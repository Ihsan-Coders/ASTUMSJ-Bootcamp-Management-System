const AUDIENCE_LABELS = {
  All: "Everyone",
  Students: "Students Only",
  Mentors: "Mentors Only",
  SpecificBatch: "Specific Batch",
};

const AUDIENCE_COLORS = {
  All: "bg-emerald/15 text-emerald",
  Students: "bg-gold/15 text-gold",
  Mentors: "bg-sky-500/15 text-sky-400",
  SpecificBatch: "bg-warning/15 text-warning",
};

/**
 * Displays a single announcement.
 *
 * Pass canManage to show Edit / Delete actions (admin, or the mentor
 * who created it). Read-only by default — used for student/recipient
 * views.
 */
export default function AnnouncementCard({
  announcement,
  canManage = false,
  onEdit,
  onDelete,
}) {
  const audienceLabel =
    AUDIENCE_LABELS[announcement.targetAudience] || announcement.targetAudience;
  const audienceColor =
    AUDIENCE_COLORS[announcement.targetAudience] ||
    "bg-text-secondary/15 text-text-secondary";

  const isScheduled =
    announcement.publishDate && new Date(announcement.publishDate) > new Date();

  return (
    <div className="glass-card glow-border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-text-primary font-semibold">
          {announcement.title}
        </h4>
        <span
          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${audienceColor}`}
        >
          {announcement.targetAudience === "SpecificBatch" && announcement.batch?.name
            ? announcement.batch.name
            : audienceLabel}
        </span>
      </div>

      <p className="text-text-secondary text-sm mt-2 whitespace-pre-line">
        {announcement.content}
      </p>

      <div className="flex items-center justify-between mt-3">
        <p className="text-text-secondary text-xs">
          {announcement.createdBy?.name && (
            <span>By {announcement.createdBy.name} · </span>
          )}
          {announcement.publishDate
            ? new Date(announcement.publishDate).toLocaleDateString()
            : ""}
          {isScheduled && (
            <span className="text-warning"> · Scheduled</span>
          )}
        </p>

        {canManage && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onEdit?.(announcement)}
              className="text-gold hover:underline text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(announcement)}
              className="text-danger hover:underline text-xs"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
