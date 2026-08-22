import { useState } from "react";
import { gradeSubmission } from "../../api/submission.api";

export default function GradingPanel({ submission, onGraded }) {
  const [score, setScore] = useState(submission.score ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const maxScore = submission.assignment?.maxScore ?? 100;

  const handleSubmit = async (selectedStatus) => {
    console.log("GRADE BUTTON CLICKED");
    console.log("Submission:", submission);
    console.log("Status:", selectedStatus);
    console.log("Score:", score);
    console.log("Feedback:", feedback);

    setError("");
    setSuccess("");

    // ============================
    // VALIDATION
    // ============================

    if (selectedStatus === "Graded" && score === "") {
      setError("Please enter a score before submitting the grade.");
      return;
    }

    if (
      selectedStatus === "Graded" &&
      Number(score) > Number(maxScore)
    ) {
      setError(`Score cannot be greater than ${maxScore}.`);
      return;
    }

    if (
      selectedStatus === "Graded" &&
      Number(score) < 0
    ) {
      setError("Score cannot be less than 0.");
      return;
    }

    try {
      // ============================
      // SET CORRECT LOADING STATE
      // ============================

      if (selectedStatus === "Graded") {
        setSubmitting(true);
      } else {
        setRequesting(true);
      }

      console.log("SENDING GRADE REQUEST...");

      // ============================
      // SEND REQUEST
      // ============================

      const response = await gradeSubmission(
        submission._id,
        {
          score:
            score === ""
              ? null
              : Number(score),
          feedback,
          status: selectedStatus,
        },
      );

      console.log(
        "GRADE SUCCESS:",
        response.data,
      );

      // ============================
      // SUCCESS MESSAGE
      // ============================

      setSuccess(
        response.data.message ||
          (
            selectedStatus === "Graded"
              ? "Submission graded successfully."
              : "Resubmission requested successfully."
          ),
      );

      // ============================
      // REFRESH SUBMISSION
      // ============================

      onGraded?.();

    } catch (err) {
      console.error(
        "GRADING ERROR:",
        err,
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data,
      );

      setError(
        err.response?.data?.message ||
          "Grading failed.",
      );

    } finally {
      setSubmitting(false);
      setRequesting(false);
    }
  };

  return (
    <div className="glass-card glow-border rounded-xl p-5 space-y-4">

      {/* ============================ */}
      {/* STUDENT + ASSIGNMENT */}
      {/* ============================ */}

      <div>
        <h3 className="text-text-primary font-semibold">
          {submission.student?.name || "Student"}
        </h3>

        <p className="text-text-secondary text-sm">
          {submission.assignment?.title ||
            "Assignment"}
        </p>
      </div>

      {/* ============================ */}
      {/* CURRENT GRADED STATUS */}
      {/* ============================ */}

      {submission.status === "Graded" && (
        <div className="p-3 rounded-lg bg-emerald/10 border border-emerald/30">

          <p className="text-emerald text-sm font-semibold">
            ✓ Graded
          </p>

          <p className="text-text-secondary text-sm mt-1">
            Score:{" "}
            <span className="text-text-primary font-semibold">
              {submission.score}/{maxScore}
            </span>
          </p>

          {submission.feedback && (
            <p className="text-text-secondary text-sm mt-1">
              Feedback:{" "}
              {submission.feedback}
            </p>
          )}

          {submission.gradedAt && (
            <p className="text-text-secondary text-xs mt-1">
              Graded on{" "}
              {new Date(
                submission.gradedAt,
              ).toLocaleString()}
            </p>
          )}

        </div>
      )}

      {/* ============================ */}
      {/* GITHUB */}
      {/* ============================ */}

      {submission.githubUrl && (
        <a
          href={submission.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-gold hover:underline"
        >
          View GitHub Submission →
        </a>
      )}

      {/* ============================ */}
      {/* LIVE DEMO */}
      {/* ============================ */}

      {submission.liveDemoUrl && (
        <a
          href={
            submission.liveDemoUrl.startsWith("http")
              ? submission.liveDemoUrl
              : `https://${submission.liveDemoUrl}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-emerald hover:underline"
        >
          View Live Demo →
        </a>
      )}

      {/* ============================ */}
      {/* STUDENT NOTES */}
      {/* ============================ */}

      {submission.notes && (
        <div>
          <p className="text-xs text-text-secondary mb-1">
            Student Notes
          </p>

          <p className="text-sm text-text-primary">
            {submission.notes}
          </p>
        </div>
      )}

      {/* ============================ */}
      {/* ATTACHMENTS */}
      {/* ============================ */}

      {submission.attachments?.length > 0 && (
        <div>
          <p className="text-xs text-text-secondary mb-2">
            Attachments
          </p>

          <div className="space-y-1">
            {submission.attachments.map(
              (file, index) => (
                <a
                  key={file.url || index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gold hover:underline"
                >
                  {file.filename}
                </a>
              ),
            )}
          </div>
        </div>
      )}

      {/* ============================ */}
      {/* SUCCESS MESSAGE */}
      {/* ============================ */}

      {success && (
        <div className="p-3 rounded-lg bg-emerald/10 border border-emerald/30">
          <p className="text-emerald text-sm font-semibold">
            ✓ {success}
          </p>
        </div>
      )}

      {/* ============================ */}
      {/* ERROR MESSAGE */}
      {/* ============================ */}

      {error && (
        <div className="p-3 rounded-lg bg-danger/10 border border-danger/30">
          <p className="text-danger text-sm">
            {error}
          </p>
        </div>
      )}

      {/* ============================ */}
      {/* GRADING FORM */}
      {/* ============================ */}

      <div className="border-t border-border/50 pt-4 space-y-4">

        {/* SCORE + STATUS */}

        <div className="grid grid-cols-2 gap-3">

          {/* SCORE */}

          <div>
            <label className="block text-xs text-text-secondary mb-1">
              Score
            </label>

            <input
              type="number"
              min="0"
              max={maxScore}
              value={score}
              onChange={(e) =>
                setScore(e.target.value)
              }
              placeholder={`0 - ${maxScore}`}
              className="w-full p-2 rounded border border-border bg-background text-text-primary"
            />
          </div>

        </div>

        {/* FEEDBACK */}

        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Feedback
          </label>

          <textarea
            value={feedback}
            onChange={(e) =>
              setFeedback(e.target.value)
            }
            placeholder="Write feedback for the student..."
            rows={4}
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          />
        </div>

        {/* BUTTONS */}

        <div className="flex gap-2">

          {/* GRADE BUTTON */}

          <button
            type="button"
            disabled={
              submitting || requesting
            }
            onClick={() =>
              handleSubmit("Graded")
            }
            className="flex-1 py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : "Submit Grade"}
          </button>

          {/* RESUBMISSION BUTTON */}

          <button
            type="button"
            disabled={
              submitting || requesting
            }
            onClick={() =>
              handleSubmit(
                "Resubmission Requested",
              )
            }
            className="flex-1 py-2 rounded border border-warning text-warning disabled:opacity-60"
          >
            {requesting
              ? "Requesting..."
              : "Request Resubmission"}
          </button>

        </div>

      </div>
    </div>
  );
}