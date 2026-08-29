import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { getBatches } from "../../api/batch.api";

import {
  getAttendance,
  markAttendance,
  updateAttendance,
} from "../../api/attendance.api";

import { getEvents } from "../../api/calendar.api";

import { useToast } from "../../context/ToastContext";

const STATUS_OPTIONS = [
  "Present",
  "Absent",
  "Late",
  "Excused",
];

const STATUS_COLOR = {
  Present: "bg-emerald/15 text-emerald",
  Absent: "bg-danger/15 text-danger",
  Late: "bg-warning/15 text-warning",
  Excused: "bg-text-secondary/15 text-text-secondary",
};

const formatSessionDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function AdminAttendancePage() {
  const { showToast } = useToast();

  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] =
    useState(null);

  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(true);
  const [loadingAttendance, setLoadingAttendance] =
    useState(false);

  const [marking, setMarking] = useState(null);
  const [editing, setEditing] = useState(null);
  const [updating, setUpdating] = useState(null);

  const [error, setError] = useState("");

  // ======================================================
  // LOAD ACTIVE BATCH + SCHEDULED SESSIONS
  // ======================================================

  const loadPage = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        batchesResponse,
        eventsResponse,
      ] = await Promise.all([
        getBatches(),
        getEvents({
          type: "Session",
        }),
      ]);

      const batches =
        batchesResponse.data?.data || [];

      const activeBatch = batches.find(
        (item) => item.isActive === true,
      );

      if (!activeBatch) {
        setBatch(null);
        setStudents([]);
        setSessions([]);
        setSelectedSession(null);
        setAttendance({});
        return;
      }

      setBatch(activeBatch);
      setStudents(activeBatch.students || []);

      const allSessions =
        eventsResponse.data?.data || [];

      const batchSessions = allSessions
        .filter(
          (event) =>
            event.type === "Session" &&
            event.batch &&
            String(
              event.batch?._id || event.batch,
            ) === String(activeBatch._id),
        )
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date),
        );

      setSessions(batchSessions);
      console.log("ALL SESSIONS:", allSessions);
      console.log("ACTIVE BATCH ID:", activeBatch._id);
      console.log("FILTERED SESSIONS:", batchSessions);

      // Automatically select the nearest scheduled session.
      if (batchSessions.length > 0) {

        const now = new Date();

        const upcoming =
          batchSessions.find(
            (event) =>
              new Date(event.date) >= now,
          );

        setSelectedSession(
          upcoming || batchSessions[batchSessions.length - 1],
        );
      } else {
        setSelectedSession(null);
      }
    } catch (err) {
      console.error(
        "Failed to load attendance page:",
        err,
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load attendance",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPage();
  }, []);

  // ======================================================
  // LOAD ATTENDANCE FOR SELECTED SESSION
  // ======================================================

  useEffect(() => {
    if (!selectedSession || !batch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAttendance({});
      return;
    }

    let cancelled = false;

    const loadSessionAttendance = async () => {
      try {
        setLoadingAttendance(true);
        setEditing(null);

        const response = await getAttendance({
          batchId: batch._id,
          calendarEvent: selectedSession._id,
        });

        if (cancelled) return;

        const records =
          response.data?.data?.records || [];

        const mapped = {};

        records.forEach((record) => {
          const studentId =
            record.student?._id ||
            record.student;

          const key = `${studentId}-${record.session}`;

          mapped[key] = {
            recordId: record._id,
            status: record.status,
          };
        });

        setAttendance(mapped);
      } catch (err) {
        if (cancelled) return;

        showToast(
          err?.response?.data?.message ||
            "Failed to load session attendance",
          "error",
        );

        setAttendance({});
      } finally {
        if (!cancelled) {
          setLoadingAttendance(false);
        }
      }
    };

    loadSessionAttendance();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession, batch]);

  // ======================================================
  // SELECT SESSION
  // ======================================================

  const handleSessionChange = (e) => {
    const session = sessions.find(
      (item) => item._id === e.target.value,
    );

    setSelectedSession(session || null);
  };

  // ======================================================
  // MARK ATTENDANCE
  // ======================================================

  const handleMark = async (
    studentId,
    session,
    status,
  ) => {
    if (!selectedSession || !batch) return;

    const actionKey = `${studentId}-${session}`;

    try {
      setMarking(actionKey);

      await markAttendance({
        student: studentId,
        batch: batch._id,

        // Use the scheduled calendar session.
        calendarEvent: selectedSession._id,

        // Backend stores the date as the attendance date.
        date: selectedSession.date,

        session,
        status,
      });

      showToast(
        `${
          session === "start"
            ? "Start"
            : "End"
        } attendance marked successfully`,
        "success",
      );

      const response = await getAttendance({
        batchId: batch._id,
        calendarEvent:
          selectedSession._id,
      });

      const records =
        response.data?.data?.records || [];

      const mapped = {};

      records.forEach((record) => {
        const studentId =
          record.student?._id ||
          record.student;

        const key = `${studentId}-${record.session}`;

        mapped[key] = {
          recordId: record._id,
          status: record.status,
        };
      });

      setAttendance(mapped);
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Failed to mark attendance",
        "error",
      );
    } finally {
      setMarking(null);
    }
  };

  // ======================================================
  // UPDATE ATTENDANCE
  // ======================================================

  const handleUpdate = async (
    recordId,
    status,
  ) => {
    try {
      setUpdating(recordId);

      await updateAttendance(recordId, {
        status,
      });

      showToast(
        "Attendance updated successfully",
        "success",
      );

      setEditing(null);

      if (selectedSession && batch) {
        const response =
          await getAttendance({
            batchId: batch._id,
            calendarEvent:
              selectedSession._id,
        });

        const records =
          response.data?.data?.records || [];

        const mapped = {};

        records.forEach((record) => {
          const studentId =
            record.student?._id ||
            record.student;

          const key = `${studentId}-${record.session}`;

          mapped[key] = {
            recordId: record._id,
            status: record.status,
          };
        });

        setAttendance(mapped);
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Failed to update attendance",
        "error",
      );
    } finally {
      setUpdating(null);
    }
  };

  // ======================================================
  // RENDER ATTENDANCE CELL
  // ======================================================

  const renderAttendanceCell = (
    student,
    session,
  ) => {
    const key = `${student._id}-${session}`;

    const record = attendance[key];

    const isEditing = editing === key;
    const isMarking = marking === key;

    if (!record) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                handleMark(
                  student._id,
                  session,
                  status,
                )
              }
              disabled={isMarking}
              className={`
                text-xs
                px-2.5
                py-1.5
                rounded-full
                transition
                ${STATUS_COLOR[status]}
                hover:ring-2
                hover:ring-gold/50
                disabled:opacity-50
                disabled:cursor-not-allowed
              `}
            >
              {isMarking
                ? "Marking..."
                : status}
            </button>
          ))}
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                handleUpdate(
                  record.recordId,
                  status,
                )
              }
              disabled={
                updating === record.recordId
              }
              className={`
                text-xs
                px-2.5
                py-1.5
                rounded-full
                ${STATUS_COLOR[status]}
                ${
                  record.status === status
                    ? "ring-2 ring-gold"
                    : ""
                }
                disabled:opacity-50
              `}
            >
              {status}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              setEditing(null)
            }
            className="text-xs text-text-secondary hover:text-text-primary px-1"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span
          className={`
            text-xs
            px-2.5
            py-1.5
            rounded-full
            ${STATUS_COLOR[record.status]}
          `}
        >
          {record.status}
        </span>

        <button
          type="button"
          onClick={() =>
            setEditing(key)
          }
          className="text-xs text-gold hover:underline"
        >
          Edit
        </button>
      </div>
    );
  };

  // ======================================================
  // DERIVED DATA
  // ======================================================

  const sessionLabel = useMemo(() => {
    if (!selectedSession) {
      return "No session selected";
    }

    return `${selectedSession.title} — ${formatSessionDate(
      selectedSession.date,
    )}`;
  }, [selectedSession]);

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Attendance
        </h1>

        <p className="text-sm text-text-secondary mt-1">
          Select a scheduled class session and
          mark attendance for that session.
        </p>
      </motion.div>

      {loading && (
        <div className="glass-card glow-border rounded-xl p-10 text-center text-text-secondary">
          Loading attendance...
        </div>
      )}

      {!loading && error && (
        <div className="glass-card glow-border rounded-xl p-6 text-center text-danger">
          {error}
        </div>
      )}

      {!loading && !error && !batch && (
        <div className="glass-card glow-border rounded-xl p-10 text-center">
          <p className="text-text-primary font-medium">
            No active batch
          </p>

          <p className="text-sm text-text-secondary mt-2">
            There is currently no active batch for
            attendance.
          </p>
        </div>
      )}

      {!loading && !error && batch && (
        <>
          {/* ==========================================
              BATCH + SESSION SELECTOR
          ========================================== */}

          <div className="glass-card glow-border rounded-xl p-5 mb-6">
            <div className="grid lg:grid-cols-2 gap-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-gold">
                  Active Batch
                </p>

                <h2 className="text-lg font-semibold text-text-primary mt-1">
                  {batch.name}
                </h2>

                <p className="text-sm text-text-secondary mt-1">
                  {students.length}{" "}
                  {students.length === 1
                    ? "student"
                    : "students"}
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gold mb-2">
                  Attendance Session
                </label>

                {sessions.length === 0 ? (
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-sm text-text-secondary">
                      No class sessions have been
                      scheduled for this batch.
                    </p>

                    <p className="text-xs text-text-secondary mt-1">
                      Create a session announcement
                      first. It will automatically
                      appear here.
                    </p>
                  </div>
                ) : (
                  <select
                    value={
                      selectedSession?._id || ""
                    }
                    onChange={
                      handleSessionChange
                    }
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-text-primary text-sm"
                  >
                    {sessions.map(
                      (session) => (
                        <option
                          key={session._id}
                          value={session._id}
                        >
                          {session.title} —{" "}
                          {formatSessionDate(
                            session.date,
                          )}
                        </option>
                      ),
                    )}
                  </select>
                )}
              </div>
            </div>

            {selectedSession && (
              <div className="mt-4 rounded-lg border border-gold/30 bg-gold/10 p-3">
                <p className="text-xs uppercase tracking-wide text-gold">
                  Currently marking
                </p>

                <p className="text-sm font-semibold text-text-primary mt-1">
                  {sessionLabel}
                </p>
              </div>
            )}
          </div>

          {/* ==========================================
              NO STUDENTS
          ========================================== */}

          {students.length === 0 && (
            <div className="glass-card glow-border rounded-xl p-10 text-center text-text-secondary">
              No students are enrolled in the active
              batch.
            </div>
          )}

          {/* ==========================================
              NO SESSION
          ========================================== */}

          {students.length > 0 &&
            !selectedSession && (
              <div className="glass-card glow-border rounded-xl p-10 text-center">
                <p className="text-text-primary font-medium">
                  No session selected
                </p>

                <p className="text-sm text-text-secondary mt-2">
                  Create a class session announcement
                  and it will appear in the attendance
                  selector.
                </p>
              </div>
            )}

          {/* ==========================================
              ATTENDANCE TABLE
          ========================================== */}

          {students.length > 0 &&
            selectedSession && (
              <div className="glass-card glow-border rounded-xl overflow-hidden">
                {loadingAttendance ? (
                  <div className="p-10 text-center text-text-secondary">
                    Loading attendance for this
                    session...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                      <thead>
                        <tr className="border-b border-border bg-surface-solid/40">
                          <th className="text-left px-5 py-4 text-sm font-semibold text-text-primary">
                            Student
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-text-primary">
                            Start
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-text-primary">
                            End
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.map(
                          (student) => (
                            <tr
                              key={
                                student._id
                              }
                              className="border-b border-border/50 last:border-0"
                            >
                              <td className="px-5 py-4 align-top">
                                <p className="text-sm font-medium text-text-primary">
                                  {
                                    student.name
                                  }
                                </p>

                                {student.email && (
                                  <p className="text-xs text-text-secondary mt-1">
                                    {
                                      student.email
                                    }
                                  </p>
                                )}
                              </td>

                              <td className="px-5 py-4 align-top">
                                {renderAttendanceCell(
                                  student,
                                  "start",
                                )}
                              </td>

                              <td className="px-5 py-4 align-top">
                                {renderAttendanceCell(
                                  student,
                                  "end",
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
        </>
      )}
    </div>
  );
}