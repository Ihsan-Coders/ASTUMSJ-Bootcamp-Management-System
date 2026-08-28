import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBatches } from "../../api/batch.api";
import {
  getAttendance,
  markAttendance,
  updateAttendance,
} from "../../api/attendance.api";
import { useToast } from "../../context/ToastContext";

const STATUS_OPTIONS = ["Present", "Absent", "Late", "Excused"];

const STATUS_COLOR = {
  Present: "bg-emerald/15 text-emerald",
  Absent: "bg-danger/15 text-danger",
  Late: "bg-warning/15 text-warning",
  Excused: "bg-text-secondary/15 text-text-secondary",
};

const isSameDay = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export default function AdminAttendancePage() {
  const { showToast } = useToast();

  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);
  const [editing, setEditing] = useState(null);
  const [updating, setUpdating] = useState(null);

  const [error, setError] = useState("");

  /*
   * Load the currently active batch and today's attendance.
   */
  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Get batches only to find the currently active batch.
       * Previous/completed batches are never displayed.
       */
      const batchesResponse = await getBatches();
      const batches = batchesResponse.data.data || [];

      const activeBatch = batches.find((item) => item.isActive === true);

      if (!activeBatch) {
        setBatch(null);
        setStudents([]);
        setAttendance({});
        return;
      }

      setBatch(activeBatch);

      const batchStudents = activeBatch.students || [];
      setStudents(batchStudents);

      /*
       * Get attendance records for the active batch.
       */
      const attendanceResponse = await getAttendance({
        batchId: activeBatch._id,
      });

      const records = attendanceResponse.data.data.records || [];

      const today = new Date();
      const todayAttendance = {};

      records.forEach((record) => {
        if (!isSameDay(record.date, today)) return;

        const studentId =
          record.student?._id || record.student;

        const key = `${studentId}-${record.session}`;

        todayAttendance[key] = {
          recordId: record._id,
          status: record.status,
        };
      });

      setAttendance(todayAttendance);
    } catch (err) {
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
    loadAttendance();
  }, []);

  /*
   * Mark a student's attendance for a specific session.
   */
  const handleMark = async (studentId, session, status) => {
    const actionKey = `${studentId}-${session}`;

    try {
      setMarking(actionKey);

      await markAttendance({
        student: studentId,
        batch: batch._id,
        date: new Date(),
        session,
        status,
      });

      showToast(
        `${session === "start" ? "Start" : "End"} attendance marked successfully`,
        "success",
      );

      await loadAttendance();
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

  /*
   * Update an existing attendance record.
   */
  const handleUpdate = async (recordId, status) => {
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

      await loadAttendance();
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

  /*
   * Render one attendance cell.
   */
  const renderAttendanceCell = (student, session) => {
    const key = `${student._id}-${session}`;
    const record = attendance[key];
    const isEditing = editing === key;
    const isMarking = marking === key;

    /*
     * No record yet.
     */
    if (!record) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
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
              {isMarking ? "Marking..." : status}
            </button>
          ))}
        </div>
      );
    }

    /*
     * Editing an existing record.
     */
    if (isEditing) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() =>
                handleUpdate(
                  record.recordId,
                  status,
                )
              }
              disabled={updating === record.recordId}
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
            onClick={() => setEditing(null)}
            className="text-xs text-text-secondary hover:text-text-primary px-1"
          >
            Cancel
          </button>
        </div>
      );
    }

    /*
     * Existing record.
     */
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
          onClick={() => setEditing(key)}
          className="text-xs text-gold hover:underline"
        >
          Edit
        </button>
      </div>
    );
  };

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Attendance
        </h1>

        <p className="text-sm text-text-secondary mt-1">
          Mark today's attendance for the active batch.
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
            There is currently no active batch for attendance.
          </p>
        </div>
      )}

      {!loading && !error && batch && (
        <>
          {/* Active batch information */}
          <div className="glass-card glow-border rounded-xl p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gold">
                  Active Batch
                </p>

                <h2 className="text-lg font-semibold text-text-primary mt-1">
                  {batch.name}
                </h2>
              </div>

              <div className="text-sm text-text-secondary">
                {students.length}{" "}
                {students.length === 1
                  ? "student"
                  : "students"}
              </div>
            </div>
          </div>

          {/* No students */}
          {students.length === 0 && (
            <div className="glass-card glow-border rounded-xl p-10 text-center text-text-secondary">
              No students are enrolled in the active batch.
            </div>
          )}

          {/* Attendance table */}
          {students.length > 0 && (
            <div className="glass-card glow-border rounded-xl overflow-hidden">
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
                    {students.map((student) => (
                      <tr
                        key={student._id}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="px-5 py-4 align-top">
                          <p className="text-sm font-medium text-text-primary">
                            {student.name}
                          </p>

                          {student.email && (
                            <p className="text-xs text-text-secondary mt-1">
                              {student.email}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
