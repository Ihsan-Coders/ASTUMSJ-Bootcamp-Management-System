import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/calendar.api";
import { getBatches } from "../api/batch.api";
import { useAuth } from "../context/AuthContext";
import { useConfirm } from "../context/ConfirmContext";
import { useToast } from "../context/ToastContext";

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "Session",
  date: "",
  batch: "",
};

// Full labels — used in the event list panel.
const TYPE_LABELS = {
  AssignmentDeadline: "Assignment Deadline",
  Session: "Session",
  Custom: "Custom",
};

// Short labels — used in the legend and filter dropdown.
const TYPE_LABELS_SHORT = {
  AssignmentDeadline: "Deadline",
  Session: "Session",
  Custom: "Custom",
};

// Every color here maps to an existing ASTUMSJ theme token
// (danger / gold / emerald) — no new colors introduced.
const TYPE_STYLES = {
  AssignmentDeadline: {
    dot: "bg-danger",
    text: "text-danger",
    chip: "bg-danger/15 text-danger",
    badge: "border-danger/30 bg-danger/10 text-danger",
  },
  Session: {
    dot: "bg-gold",
    text: "text-gold",
    chip: "bg-gold/15 text-gold",
    badge: "border-gold/30 bg-gold/10 text-gold",
  },
  Custom: {
    dot: "bg-emerald",
    text: "text-emerald",
    chip: "bg-emerald/15 text-emerald",
    badge: "border-emerald/30 bg-emerald/10 text-emerald",
  },
};

const FILTER_OPTIONS = [
  { value: "all", label: "All Events" },
  { value: "AssignmentDeadline", label: "Deadlines" },
  { value: "Session", label: "Sessions" },
  { value: "Custom", label: "Custom" },
];

const WEEKDAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

// ======================================================
// DATE HELPERS
// ======================================================

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isSameMonth = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// Builds a full 7-column week grid for the given month, including the
// leading/trailing days from adjacent months needed to complete it.
const buildMonthMatrix = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    cells.push(new Date(year, month, i - startWeekday + 1));
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
};

export default function CalendarPage() {
  const { user } = useAuth();
  const confirm = useConfirm();
  const { showToast } = useToast();
  const canManage = user?.role === "admin" || user?.role === "mentor";

  const [events, setEvents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formError, setFormError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // ======================================================
  // LOAD EVENTS
  // ======================================================

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getEvents();
      setEvents(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load calendar events:", err);
      setError(
        err.response?.data?.message || "Could not load calendar events.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents();
  }, []);

  // Admin/mentor also need the batch list for the create/edit form.
  useEffect(() => {
    if (!canManage) return;

    (async () => {
      try {
        const res = await getBatches();
        setBatches(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    })();
  }, [canManage]);

  // ======================================================
  // DERIVED CALENDAR DATA
  // ======================================================

  const filteredEvents = useMemo(() => {
    if (typeFilter === "all") return events;
    return events.filter((event) => event.type === typeFilter);
  }, [events, typeFilter]);

  const eventsByDay = useMemo(() => {
    const map = {};
    filteredEvents.forEach((event) => {
      const key = dayKey(new Date(event.date));
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [filteredEvents]);

  const monthMatrix = useMemo(
    () => buildMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  const listEvents = useMemo(() => {
    if (selectedDate) {
      return filteredEvents.filter((event) =>
        isSameDay(new Date(event.date), selectedDate),
      );
    }
    return filteredEvents.filter((event) =>
      isSameMonth(new Date(event.date), currentMonth),
    );
  }, [filteredEvents, selectedDate, currentMonth]);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // ======================================================
  // NAVIGATION
  // ======================================================

  const goToPrevMonth = () => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    );
  };

  const handleDayClick = (cellDate) => {
    setSelectedDate((current) =>
      current && isSameDay(current, cellDate) ? null : cellDate,
    );
  };

  // ======================================================
  // FORM HELPERS
  // ======================================================

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingEvent(null);
    setFormError("");
  };

  const toDatetimeLocal = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
  };

  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  // Opens the create form pre-filled with the given day (default 9:00 AM)
  // — used by the "Add Event" affordance in the day/month list panel.
  const startCreateForDate = (dateObj) => {
    resetForm();
    const prefill = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      9,
      0,
    );
    setForm((f) => ({ ...f, date: toDatetimeLocal(prefill.toISOString()) }));
    setShowForm(true);
  };

  const startEdit = (event) => {
    setShowForm(false);
    setEditingEvent(event);
    setFormError("");
    setForm({
      title: event.title || "",
      description: event.description || "",
      type: event.type === "AssignmentDeadline" ? "Session" : event.type,
      date: toDatetimeLocal(event.date),
      batch: event.batch?._id || event.batch || "",
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  // ======================================================
  // CREATE
  // ======================================================

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      setActionLoading(true);

      await createEvent({
        title: form.title,
        description: form.description,
        type: form.type,
        date: form.date,
        batch: form.batch || null,
      });

      setShowForm(false);
      resetForm();
      await loadEvents();
    } catch (err) {
      console.error("Failed to create event:", err);
      setFormError(err.response?.data?.message || "Failed to create event.");
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // UPDATE
  // ======================================================

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    setFormError("");

    try {
      setActionLoading(true);

      await updateEvent(editingEvent._id, {
        title: form.title,
        description: form.description,
        type: form.type,
        date: form.date,
        batch: form.batch || null,
      });

      resetForm();
      await loadEvents();
    } catch (err) {
      console.error("Failed to update event:", err);
      setFormError(err.response?.data?.message || "Failed to update event.");
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (event) => {
    const confirmed = await confirm(
      `Are you sure you want to delete "${event.title}"?`,
      { title: "Delete event", confirmLabel: "Delete" }
    );
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await deleteEvent(event._id);
      setEvents((current) => current.filter((e) => e._id !== event._id));

      if (editingEvent?._id === event._id) resetForm();
      showToast("Event deleted", "success");
    } catch (err) {
      console.error("Failed to delete event:", err);
      showToast(err.response?.data?.message || "Failed to delete event.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const canEditEvent = (event) => {
    if (!canManage) return false;
    if (event.type === "AssignmentDeadline") return false;
    if (user.role === "admin") return true;
    const creatorId = event.createdBy?._id || event.createdBy;
    return creatorId === user.id;
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
            Calendar
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {canManage
              ? "View and manage deadlines, sessions, and events."
              : "View deadlines, sessions, and events relevant to you."}
          </p>
        </motion.div>

        {canManage && (
          <button
            onClick={() => (showForm ? cancelForm() : startCreate())}
            disabled={actionLoading}
            className="shrink-0 text-sm px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-50"
          >
            {showForm ? "Close" : "+ New Event"}
          </button>
        )}
      </div>

      {/* ==========================================
          CREATE FORM
          ========================================== */}

      <AnimatePresence>
        {canManage && showForm && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleCreate}
            className="glass-card glow-border rounded-xl p-5 mb-6 space-y-3"
          >
            <h3 className="text-lg font-semibold text-text-primary">
              Create Event
            </h3>

            {formError && <p className="text-danger text-sm">{formError}</p>}

            <EventFields form={form} batches={batches} onChange={handleChange} />

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-50"
            >
              {actionLoading ? "Creating..." : "Create Event"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ==========================================
          EDIT FORM
          ========================================== */}

      <AnimatePresence>
        {canManage && editingEvent && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleUpdate}
            className="glass-card glow-border rounded-xl p-5 mb-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                Edit Event
              </h3>

              <button
                type="button"
                onClick={cancelForm}
                disabled={actionLoading}
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
            </div>

            {formError && <p className="text-danger text-sm">{formError}</p>}

            <EventFields form={form} batches={batches} onChange={handleChange} />

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-50"
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ==========================================
          LOADING / ERROR
          ========================================== */}

      {loading && (
        <div className="glass-card glow-border rounded-xl p-6 text-text-secondary text-sm">
          Loading calendar events...
        </div>
      )}

      {!loading && error && (
        <div className="glass-card glow-border rounded-xl p-6 text-danger text-sm">
          {error}
        </div>
      )}

      {/* ==========================================
          MONTH TOOLBAR + GRID
          ========================================== */}

      {!loading && !error && (
        <div className="glass-card glow-border rounded-xl p-3 sm:p-5">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPrevMonth}
                aria-label="Previous month"
                className="p-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-gold-light transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <h2 className="text-base sm:text-lg font-semibold text-text-primary min-w-[9rem] sm:min-w-[11rem] text-center">
                {monthLabel}
              </h2>

              <button
                type="button"
                onClick={goToNextMonth}
                aria-label="Next month"
                className="p-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-gold-light transition-colors"
              >
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={goToToday}
                className="ml-1 text-xs px-3 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-gold-light transition-colors"
              >
                Today
              </button>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-border bg-background text-text-primary"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-xs text-text-secondary">
            {Object.entries(TYPE_LABELS_SHORT).map(([type, label]) => (
              <span key={type} className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${TYPE_STYLES[type].dot}`}
                />
                {label}
              </span>
            ))}
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 border-t border-l border-border/40 rounded-t-lg overflow-hidden">
            {WEEKDAYS_FULL.map((day, i) => (
              <div
                key={day}
                className="border-r border-b border-border/40 bg-surface/40 py-2 text-center text-[11px] sm:text-xs uppercase tracking-wide text-text-secondary"
              >
                <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 border-l border-border/40 rounded-b-lg overflow-hidden">
            {monthMatrix.flat().map((cellDate) => {
              const inCurrentMonth = isSameMonth(cellDate, currentMonth);
              const isToday = isSameDay(cellDate, today);
              const isSelected = selectedDate && isSameDay(cellDate, selectedDate);
              const dayEvents = eventsByDay[dayKey(cellDate)] || [];

              return (
                <button
                  key={cellDate.toISOString()}
                  type="button"
                  onClick={() => handleDayClick(cellDate)}
                  aria-label={`${cellDate.toDateString()}${
                    dayEvents.length
                      ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}`
                      : ""
                  }`}
                  className={`relative flex flex-col items-start text-left border-r border-b border-border/40 p-1.5 sm:p-2 min-h-[56px] sm:min-h-[92px] transition-colors ${
                    isSelected ? "bg-gold/10" : "hover:bg-surface/50"
                  }`}
                >
                  {isToday ? (
                    <span className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-gold to-emerald text-[11px] sm:text-sm font-bold text-obsidian">
                      {cellDate.getDate()}
                    </span>
                  ) : (
                    <span
                      className={`text-xs sm:text-sm ${
                        inCurrentMonth
                          ? "text-text-primary"
                          : "text-text-secondary/40"
                      }`}
                    >
                      {cellDate.getDate()}
                    </span>
                  )}

                  {/* Mobile: dots only */}
                  {dayEvents.length > 0 && (
                    <div className="flex sm:hidden flex-wrap gap-0.5 mt-1">
                      {dayEvents.slice(0, 4).map((ev) => (
                        <span
                          key={ev._id}
                          className={`w-1.5 h-1.5 rounded-full ${TYPE_STYLES[ev.type].dot}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* sm+: truncated title chips */}
                  {dayEvents.length > 0 && (
                    <div className="hidden sm:flex flex-col gap-0.5 mt-1 w-full">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <span
                          key={ev._id}
                          className={`truncate w-full text-[10px] leading-tight px-1 py-0.5 rounded ${TYPE_STYLES[ev.type].chip}`}
                        >
                          {ev.title}
                        </span>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[10px] text-text-secondary">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          EVENT LIST (month or selected day)
          ========================================== */}

      {!loading && !error && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <h3 className="text-text-primary font-semibold flex items-center gap-2">
              {selectedDate ? (
                <>
                  Events on{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    aria-label="Clear selected day"
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                `Events in ${monthLabel}`
              )}
            </h3>

            {canManage && (
              <button
                type="button"
                onClick={() => startCreateForDate(selectedDate || currentMonth)}
                disabled={actionLoading}
                className="text-xs px-3 py-1.5 rounded-lg border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 disabled:opacity-50"
              >
                + Add Event
              </button>
            )}
          </div>

          {listEvents.length === 0 && (
            <div className="glass-card glow-border rounded-xl p-6 text-text-secondary text-sm">
              {selectedDate
                ? "No events on this day."
                : "No events found for this month."}
            </div>
          )}

          {listEvents.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {listEvents.map((event, index) => {
                const eventDate = new Date(event.date);

                return (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="glass-card glow-border rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-gold/30 bg-gold/10 flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase text-text-secondary">
                          {eventDate.toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-lg font-bold text-gold">
                          {eventDate.getDate()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-text-primary font-semibold truncate">
                            {event.title}
                          </h4>

                          <span
                            className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full border ${TYPE_STYLES[event.type].badge}`}
                          >
                            {TYPE_LABELS[event.type] || event.type}
                          </span>
                        </div>

                        <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                          <CalendarClock size={12} />
                          {eventDate.toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>

                        <p className="text-xs text-text-secondary mt-1">
                          {event.batch?.name || "All Batches"}
                        </p>

                        {event.description && (
                          <p className="text-sm text-text-secondary mt-2 whitespace-pre-line">
                            {event.description}
                          </p>
                        )}

                        {canEditEvent(event) && (
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => startEdit(event)}
                              disabled={actionLoading}
                              className="flex items-center gap-1 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 disabled:opacity-50"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(event)}
                              disabled={actionLoading}
                              className="flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20 disabled:opacity-50"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ======================================================
// SHARED FORM FIELDS (create + edit)
// ======================================================

function EventFields({ form, batches, onChange }) {
  return (
    <>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={onChange}
        required
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      />

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={onChange}
        rows={3}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <select
          name="type"
          value={form.type}
          onChange={onChange}
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        >
          <option value="Session">Session</option>
          <option value="Custom">Custom</option>
        </select>

        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={onChange}
          required
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        />

        <select
          name="batch"
          value={form.batch}
          onChange={onChange}
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        >
          <option value="">All Batches</option>
          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
