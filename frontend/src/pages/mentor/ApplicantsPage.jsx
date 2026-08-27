import { useEffect, useState } from "react";
import { getMyAssignedApplicants } from "../../api/application.api";
import InterviewResultForm from "../../components/mentor/InterviewResultForm";

const STATUS_LABEL = {
  Interview: "Awaiting your interview",
  "Interview Completed": "Result submitted — awaiting admin decision",
  Passed: "Admitted",
  Failed: "Not admitted",
};

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplicants = () => {
    getMyAssignedApplicants()
      .then((res) => {
        setApplicants(res.data.data);
        setError("");
      })
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load applicants"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)] mb-6">
        My Assigned Applicants
      </h1>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-text-secondary text-sm">Loading…</p>
      ) : applicants.length === 0 ? (
        <p className="text-text-secondary text-sm">
          No applicants have been assigned to you yet.
        </p>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <div
              key={applicant._id}
              className="glass-card glow-border rounded-xl p-5 space-y-3"
            >
              <div>
                <h3 className="text-text-primary font-semibold">
                  {applicant.name}
                </h3>
                <p className="text-text-secondary text-sm">
                  {applicant.email} · {applicant.department} ·{" "}
                  {applicant.academicYear}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-secondary mb-1">
                  Daily commitment
                </p>
                <p className="text-sm text-text-primary">
                  {applicant.dailyCommitmentHours} hrs/day
                </p>
              </div>

              <div>
                <p className="text-xs text-text-secondary mb-1">
                  Motivation
                </p>
                <p className="text-sm text-text-primary whitespace-pre-wrap">
                  {applicant.motivation}
                </p>
              </div>

              {applicant.status === "Interview" ? (
                <InterviewResultForm
                  applicant={applicant}
                  onSubmitted={fetchApplicants}
                />
              ) : (
                <div className="border-t border-border/50 pt-3 space-y-1">
                  <p className="text-sm text-text-secondary">
                    {STATUS_LABEL[applicant.status] || applicant.status}
                  </p>
                  {applicant.interviewScore !== null &&
                    applicant.interviewScore !== undefined && (
                      <p className="text-sm text-text-primary">
                        Your score: {applicant.interviewScore} · Your
                        recommendation: {applicant.mentorRecommendation}
                      </p>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
