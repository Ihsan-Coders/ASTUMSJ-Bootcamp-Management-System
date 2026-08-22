import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import { getAttendance } from "../../api/attendance.api";
import AttendanceForm from "../../components/mentor/AttendanceForm";

const isSameDay = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const STATUS_COLOR = {
  Present: "bg-emerald/15 text-emerald",
  Absent: "bg-danger/15 text-danger",
  Late: "bg-warning/15 text-warning",
  Excused: "bg-text-secondary/15 text-text-secondary",
};

export default function MentorAttendancePage() {
  const [batches, setBatches] = useState([]);
  const [todaysRecords, setTodaysRecords] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const batchesRes = await axiosInstance.get("/batches");
      const myBatches = batchesRes.data.data;
      setBatches(myBatches);

      const today = new Date();
      const recordsMap = {};

      await Promise.all(
        myBatches.map(async (batch) => {
          if (!batch.students || batch.students.length === 0) return;
          const res = await getAttendance({ batchId: batch._id });
          const records = res.data.data.records || [];
          records.forEach((r) => {
            if (isSameDay(r.date, today)) {
              recordsMap[String(r.student)] = {
                recordId: r._id,
                status: r.status,
              };
            }
          });
        }),
      );

      setTodaysRecords(recordsMap);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load attendance data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarked = () => {
    setEditingId(null);
    loadData();
  };

  const handleQuickUpdate = async (recordId, newStatus) => {
    try {
      await axiosInstance.put(`/attendance/${recordId}`, { status: newStatus });
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update attendance");
    }
  };

  const hasAnyStudents = batches.some((b) => (b.students || []).length > 0);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
      >
        Mark Attendance
      </motion.h1>

      {loading && (
        <div className="glass-card glow-border rounded-xl p-10 text-center text-text-secondary">
          Loading your students...
        </div>
      )}

      {!loading && error && (
        <div className="glass-card glow-border rounded-xl p-6 text-center text-danger">
          {error}
        </div>
      )}

      {!loading && !error && !hasAnyStudents && (
        <div className="glass-card glow-border rounded-xl p-10 text-center text-text-secondary">
          No students assigned to you yet — ask an admin to assign you to a
          batch with enrolled students.
        </div>
      )}

      {!loading && !error && hasAnyStudents && (
        <div className="space-y-6">
          {batches.map(
            (batch) =>
              (batch.students || []).length > 0 && (
                <div key={batch._id}>
                  <h2 className="text-sm uppercase tracking-wide text-gold mb-3">
                    {batch.name}
                  </h2>
                  <div className="space-y-3">
                    {batch.students.map((student) => {
                      const record = todaysRecords[String(student._id)];
                      const isEditing = editingId === student._id;

                      return (
                        <div
                          key={student._id}
                          className="glass-card glow-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <span className="text-text-primary font-medium">
                            {student.name}
                          </span>

                          {!record ? (
                            <AttendanceForm
                              studentId={student._id}
                              batchId={batch._id}
                              onMarked={handleMarked}
                            />
                          ) : isEditing ? (
                            <div className="flex items-center gap-2">
                              {["Present", "Absent", "Late", "Excused"].map(
                                (s) => (
                                  <button
                                    key={s}
                                    onClick={() =>
                                      handleQuickUpdate(record.recordId, s)
                                    }
                                    className={`text-xs px-2.5 py-1 rounded-full border-0 ${STATUS_COLOR[s]} ${
                                      record.status === s
                                        ? "ring-2 ring-gold"
                                        : ""
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ),
                              )}
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-xs text-text-secondary hover:text-text-primary ml-1"
                              >
                                Done
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLOR[record.status]}`}
                              >
                                ✓ {record.status}
                              </span>
                              <button
                                onClick={() => setEditingId(student._id)}
                                className="text-xs text-gold hover:underline"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
