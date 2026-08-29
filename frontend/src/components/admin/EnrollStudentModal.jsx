import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { getUsers } from "../../api/user.api";
import { getBatches, enrollStudent } from "../../api/batch.api";

export default function EnrollStudentModal({ isOpen, onClose, onEnrolled }) {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    setLoadingOptions(true);
    setError("");

    Promise.all([getUsers({ role: "student" }), getBatches()])
      .then(([studentsRes, batchesRes]) => {
        if (cancelled) return;

        setStudents(studentsRes.data.data || []);
        setBatches(batchesRes.data.data || []);
      })
      .catch((err) => {
        if (cancelled) return;

        setError(err?.response?.data?.message || "Failed to load options");
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingOptions(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !batchId) {
      setError("Choose both a student and a batch");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await enrollStudent({
        batchId,
        studentId,
      });

      setStudentId("");
      setBatchId("");

      onEnrolled?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to enroll student");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll Student in Batch"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || loadingOptions}
            className="px-4 py-2 rounded text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
          >
            {submitting ? "Enrolling…" : "Enroll"}
          </button>
        </>
      }
    >
      {loadingOptions ? (
        <p className="text-text-secondary text-sm">
          Loading students and batches…
        </p>
      ) : (
        <div className="space-y-3">
          {/* Student */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">
              Student
            </label>

            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-text-primary"
            >
              <option value="" disabled>
                Select a student
              </option>

              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>

            {students.length === 0 && (
              <p className="text-xs text-text-secondary mt-1">
                No student accounts exist yet.
              </p>
            )}
          </div>

          {/* Batch */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">
              Batch
            </label>

            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-text-primary"
            >
              <option value="" disabled>
                Select a batch
              </option>

              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
