import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";

const STATUS_OPTIONS = [
  "Not Started",
  "In Progress",
  "Completed",
  "Needs Improvement",
];

export default function ProgressPage() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [topic, setTopic] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Not Started");
  const [notes, setNotes] = useState("");

  const [studentProgress, setStudentProgress] = useState([]);

  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // --------------------------------------------------
  // LOAD BATCHES
  // --------------------------------------------------
 useEffect(() => {
  const loadBatches = async () => {
    try {
      setLoadingBatches(true);
      setError("");

      const response = await axiosInstance.get("/batches");

      setBatches(response?.data?.data || []);
    } catch (err) {
      console.error("Failed to load batches:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load batches."
      );
    } finally {
      setLoadingBatches(false);
    }
  };

  loadBatches();
}, []);

  // --------------------------------------------------
  // LOAD SELECTED STUDENT PROGRESS
  // --------------------------------------------------
  useEffect(() => {
    if (!selectedStudent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStudentProgress([]);
      return;
    }

    const loadProgress = async () => {
      try {
        setLoadingProgress(true);
        setError("");

        const params = {
          studentId: selectedStudent,
        };

        if (selectedBatch) {
          params.batchId = selectedBatch;
        }

        const response = await axiosInstance.get("/progress", {
          params,
        });

        setStudentProgress(response?.data?.data || []);
      } catch (err) {
        console.error("Failed to load student progress:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load student progress."
        );

        setStudentProgress([]);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadProgress();
  }, [selectedStudent, selectedBatch]);

  // --------------------------------------------------
  // HANDLE PROGRESS SLIDER
  // --------------------------------------------------
  const handleBatchChange = (e) => {
  const batchId = e.target.value;

  setSelectedBatch(batchId);
  setSelectedStudent("");
  setStudentProgress([]);
  setMessage("");
  setError("");

  if (!batchId) {
    setStudents([]);
    return;
  }

  const selectedBatchData = batches.find(
    (batch) => batch._id === batchId
  );

  const batchStudents = selectedBatchData?.students || [];

  setStudents(batchStudents);
};

  const handleProgressChange = (e) => {
    const value = Number(e.target.value);

    setProgress(value);

    // Keep status synchronized with percentage.
    if (value === 0) {
      setStatus("Not Started");
    } else if (value === 100) {
      setStatus("Completed");
    } else {
      setStatus("In Progress");
    }
  };

  // --------------------------------------------------
  // HANDLE STATUS CHANGE
  // --------------------------------------------------
  const handleStatusChange = (e) => {
    const value = e.target.value;

    setStatus(value);

    // Keep percentage synchronized with status.
    if (value === "Not Started") {
      setProgress(0);
    }

    if (value === "Completed") {
      setProgress(100);
    }

    if (value === "In Progress" && progress === 0) {
      setProgress(50);
    }
  };

  // --------------------------------------------------
  // SUBMIT PROGRESS
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!selectedStudent) {
      setError("Please select a student.");
      return;
    }

    if (!selectedBatch) {
      setError("Please select a batch.");
      return;
    }

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    if (progress < 0 || progress > 100) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    if (!status) {
      setError("Please select a status.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        student: selectedStudent,
        batch: selectedBatch,
        topic: topic.trim(),
        progress: Number(progress),
        status,
        notes: notes.trim(),
      };

      console.log("Sending progress payload:", payload);

      await axiosInstance.put("/progress", payload);

      setMessage("Progress updated successfully.");

      // Clear topic-specific fields.
      setTopic("");
      setProgress(0);
      setStatus("Not Started");
      setNotes("");

      // Reload progress so the mentor immediately sees
      // the newly updated record.
      const response = await axiosInstance.get("/progress", {
        params: {
          studentId: selectedStudent,
          batchId: selectedBatch,
        },
      });

      setStudentProgress(response?.data?.data || []);
    } catch (err) {
      console.error("Failed to update progress:", err);

      console.error(
        "Backend response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to update progress."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------
  const totalTopics = studentProgress.length;

  const completedTopics = studentProgress.filter(
    (item) => item.status === "Completed"
  ).length;

  const averageProgress =
    totalTopics > 0
      ? Math.round(
          studentProgress.reduce(
            (total, item) =>
              total + Number(item.progress || 0),
            0
          ) / totalTopics
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#051C14] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            ASTU MSJ • Mentor
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#F8F9FA]">
            Student Progress
          </h1>

          <p className="mt-2 text-sm text-[#F8F9FA]/55">
            Update and monitor the learning progress of your students.
          </p>
        </motion.header>

        {/* MESSAGES */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-3 text-sm text-[#10B981]">
            {message}
          </div>
        )}

        {/* UPDATE FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[rgba(10,35,26,0.75)] p-6 backdrop-blur-[16px]"
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            M2 • Progress Management
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#F8F9FA]">
            Update Student Progress
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* STUDENT */}
            <div>
  <label className="mb-2 block text-sm font-medium text-[#F8F9FA]/70">
    Student
  </label>

  <select
    value={selectedStudent}
    onChange={(e) => {
      setSelectedStudent(e.target.value);
      setMessage("");
      setError("");
    }}
    disabled={!selectedBatch}
    className="w-full rounded-xl border border-[#F8F9FA]/10 bg-[#051C14] px-4 py-3 text-sm text-[#F8F9FA] outline-none focus:border-[#D4AF37]/50 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <option value="">
      {!selectedBatch
        ? "Select a batch first"
        : students.length === 0
        ? "No students in this batch"
        : "Select a student"}
    </option>

    {students.map((student) => (
      <option key={student._id} value={student._id}>
        {student.name} — {student.email}
      </option>
    ))}
  </select>
</div>

            {/* BATCH */}
            <div>
  <label className="mb-2 block text-sm font-medium text-[#F8F9FA]/70">
    Batch
  </label>

  <select
    value={selectedBatch}
    onChange={handleBatchChange}
    disabled={loadingBatches}
    className="w-full rounded-xl border border-[#F8F9FA]/10 bg-[#051C14] px-4 py-3 text-sm text-[#F8F9FA] outline-none focus:border-[#D4AF37]/50"
  >
    <option value="">
      {loadingBatches
        ? "Loading batches..."
        : "Select a batch"}
    </option>

    {batches.map((batch) => (
      <option key={batch._id} value={batch._id}>
        {batch.name}
      </option>
    ))}
  </select>
</div>

            {/* TOPIC */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#F8F9FA]/70">
                Topic
              </label>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Example: React Hooks"
                className="w-full rounded-xl border border-[#F8F9FA]/10 bg-[#051C14] px-4 py-3 text-sm text-[#F8F9FA] outline-none placeholder:text-[#F8F9FA]/30 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
              />
            </div>

            {/* PROGRESS */}
            <div>
              <div className="mb-3 flex justify-between">
                <label className="text-sm text-[#F8F9FA]/70">
                  Completion
                </label>

                <span className="font-semibold text-[#D4AF37]">
                  {progress}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#0A0F0D] accent-[#10B981]"
              />

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0A0F0D]">
                <motion.div
                  animate={{
                    width: `${progress}%`,
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#10B981]"
                />
              </div>
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#F8F9FA]/70">
                Status
              </label>

              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full rounded-xl border border-[#F8F9FA]/10 bg-[#051C14] px-4 py-3 text-sm text-[#F8F9FA] outline-none focus:border-[#D4AF37]/50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* NOTES */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#F8F9FA]/70">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional feedback or notes about the student's progress..."
                className="w-full resize-none rounded-xl border border-[#F8F9FA]/10 bg-[#051C14] px-4 py-3 text-sm text-[#F8F9FA] outline-none placeholder:text-[#F8F9FA]/30 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
              />
            </div>

            {/* SUBMIT */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={
                  saving ||
                  !selectedStudent ||
                  !selectedBatch ||
                  !topic.trim()
                }
                className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#10B981] px-5 py-3 text-sm font-bold text-[#0A0F0D] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Updating..."
                  : "Update Student Progress"}
              </button>
            </div>
          </div>
        </motion.form>

        {/* SELECTED STUDENT PROGRESS */}
        {selectedStudent && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-[#D4AF37]/30 bg-[rgba(10,35,26,0.75)] p-6 backdrop-blur-[16px]"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                  Student Overview
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#F8F9FA]">
                  Current Progress
                </h2>
              </div>

              <div className="flex gap-3">
                <div className="rounded-xl border border-[#D4AF37]/20 bg-[#051C14] px-4 py-2">
                  <p className="text-xs text-[#F8F9FA]/50">
                    Average
                  </p>
                  <p className="font-bold text-[#D4AF37]">
                    {averageProgress}%
                  </p>
                </div>

                <div className="rounded-xl border border-[#10B981]/20 bg-[#051C14] px-4 py-2">
                  <p className="text-xs text-[#F8F9FA]/50">
                    Completed
                  </p>
                  <p className="font-bold text-[#10B981]">
                    {completedTopics}
                  </p>
                </div>

                <div className="rounded-xl border border-[#D4AF37]/20 bg-[#051C14] px-4 py-2">
                  <p className="text-xs text-[#F8F9FA]/50">
                    Topics
                  </p>
                  <p className="font-bold text-[#F8F9FA]">
                    {totalTopics}
                  </p>
                </div>
              </div>
            </div>

            {loadingProgress ? (
              <p className="py-8 text-center text-sm text-[#F8F9FA]/50">
                Loading student progress...
              </p>
            ) : studentProgress.length === 0 ? (
              <div className="rounded-xl border border-[#D4AF37]/10 bg-[#051C14] p-8 text-center">
                <p className="text-sm text-[#F8F9FA]/50">
                  No progress has been recorded for this student yet.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {studentProgress.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-[#F8F9FA]/10 bg-[#051C14] p-5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-[#F8F9FA]">
                          {item.topic}
                        </h3>

                        <p className="mt-1 text-xs text-[#F8F9FA]/40">
                          {item.status}
                        </p>
                      </div>

                      <span className="font-semibold text-[#D4AF37]">
                        {Number(item.progress || 0)}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#0A0F0D]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#10B981]"
                        style={{
                          width: `${Math.min(
                            Math.max(
                              Number(item.progress || 0),
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    {item.notes && (
                      <p className="mt-3 text-sm text-[#F8F9FA]/50">
                        {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}