function formatSize(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function ResourceCard({ resource, canDelete, onDelete, deleting }) {
  return (
    <div className="glass-card glow-border rounded-lg p-4 flex flex-col hover:-translate-y-1 transition-transform">
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="block flex-1"
      >
        <span className="text-xs text-gold uppercase">{resource.type}</span>

        <h4 className="text-text-primary font-semibold mt-1">{resource.title}</h4>

        {resource.description && (
          <p className="text-text-secondary text-sm mt-1">{resource.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs text-emerald">{resource.topic}</span>
          {resource.batch?.name && (
            <span className="text-xs text-text-secondary">· {resource.batch.name}</span>
          )}
          {resource.fileName && (
            <span className="text-xs text-text-secondary">
              · {resource.fileName} ({formatSize(resource.fileSize)})
            </span>
          )}
        </div>
      </a>

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(resource)}
          disabled={deleting}
          className="mt-3 self-start rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-400/20 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );
}
