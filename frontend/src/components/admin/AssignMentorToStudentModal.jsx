import { useEffect, useState } from "react";
import { getBatches, assignMentorToStudent } from "../../api/batch.api";

export default function AssignMentorToStudentModal({
  isOpen,
  onClose,
  onAssigned,
}) {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const loadBatches = async () => {
      try {
        setError("");

        const response = await getBatches();

        const batchData = response?.data?.data || response?.data || [];

        setBatches(batchData);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load batches");
      }
    };

    loadBatches();
  }, [isOpen]);

  useEffect(() => {
    if (!selectedBatch) {
      setStudents([]);
      setMentors([]);
      return;
    }

    const batch = batches.find(
      (item) => String(item._id) === String(selectedBatch),
    );

    if (!batch) {
      setStudents([]);
      setMentors([]);
      return;
    }

    setStudents(batch.students || []);
    setMentors(batch.mentors || []);
  }, [selectedBatch, batches]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedMentor) {
      setError("Please select a student and mentor.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await assignMentorToStudent({
        studentId: selectedStudent,
        mentorId: selectedMentor,
      });

      onAssigned?.();

      setSelectedBatch("");
      setSelectedStudent("");
      setSelectedMentor("");

      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to assign mentor to student",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-xl bg-surface border border-border p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">
            Assign Mentor to Student
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-text-primary">
              Batch
            </label>

            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setSelectedStudent("");
                setSelectedMentor("");
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-primary"
            >
              <option value="">Select batch</option>

              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-text-primary">
              Student
            </label>

            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!selectedBatch}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-primary disabled:opacity-50"
            >
              <option value="">Select student</option>

              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} — {student.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-text-primary">
              Mentor
            </label>

            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              disabled={!selectedBatch}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-primary disabled:opacity-50"
            >
              <option value="">Select mentor</option>

              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>
                  {mentor.name} — {mentor.email}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading || !selectedBatch || !selectedStudent || !selectedMentor
              }
              className="rounded-lg bg-gradient-to-r from-gold to-emerald px-4 py-2 text-sm font-semibold text-obsidian disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign Mentor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
