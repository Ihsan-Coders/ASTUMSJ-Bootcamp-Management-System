import { useState } from "react";
import { Link2, FileText, Video, Download, Trash2 } from "lucide-react";
import Modal from "../common/Modal";

function formatSize(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

// The HTML `download` attribute is silently ignored by browsers for
// cross-origin URLs (Cloudinary is always cross-origin from the app) —
// that's why "Download" was behaving identically to "Open" (both just
// navigated to the file). Cloudinary's `fl_attachment` flag tells
// Cloudinary itself to serve the file with a
// Content-Disposition: attachment header, which forces an actual browser
// download regardless of origin. Works for any Cloudinary resource_type
// (image/video/raw) since it just inserts into the URL path.
function getDownloadUrl(url) {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/fl_attachment/");
}

const TYPE_ICON = { Link: Link2, Document: FileText, Video: Video };

// Fallback shown in place of a real thumbnail image when the resource
// doesn't have one — a type-appropriate icon rather than a blank box.
function ThumbnailFallback({ type }) {
  const Icon = TYPE_ICON[type] || FileText;
  return (
    <div className="h-28 rounded-md bg-background border border-border flex items-center justify-center">
      <Icon size={28} className="text-gold" />
    </div>
  );
}

export default function ResourceCard({ resource, canDelete, onDelete, deleting }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  // A resource is only genuinely "downloadable" if it's an actual uploaded
  // file (Document type sets fileName on creation) — a Link or Video
  // resource has nowhere to download *from*, so no download affordance
  // is shown for those, per the requirement not to show a download action
  // that doesn't actually do anything.
  const isDownloadable = Boolean(resource.fileName);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setDetailsOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setDetailsOpen(true)}
        className="glass-card glow-border rounded-lg p-4 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer text-left"
      >
        {resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt=""
            className="h-28 w-full object-cover rounded-md mb-3"
          />
        ) : (
          <div className="mb-3">
            <ThumbnailFallback type={resource.type} />
          </div>
        )}

        <span className="text-xs text-gold uppercase">{resource.type}</span>
        <h4 className="text-text-primary font-semibold mt-1">{resource.title}</h4>

        {resource.description && (
          <p className="text-text-secondary text-sm mt-1 line-clamp-2">
            {resource.description}
          </p>
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

        <div className="flex items-center justify-between mt-3">
          {isDownloadable ? (
            <a
              href={getDownloadUrl(resource.url)}
              download={resource.fileName}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-gold hover:underline"
            >
              <Download size={14} /> Download
            </a>
          ) : (
            <span />
          )}

          {canDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(resource);
              }}
              disabled={deleting}
              className="flex items-center gap-1 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-400/20 disabled:opacity-50"
            >
              <Trash2 size={13} /> {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={resource.title}
        footer={
          <>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
            >
              Open {resource.type}
            </a>
            {isDownloadable && (
              <a
                href={getDownloadUrl(resource.url)}
                download={resource.fileName}
                className="flex items-center gap-1.5 px-4 py-2 rounded border border-border text-sm text-text-primary"
              >
                <Download size={14} /> Download
              </a>
            )}
          </>
        }
      >
        <div className="space-y-3">
          {resource.thumbnailUrl && (
            <img
              src={resource.thumbnailUrl}
              alt=""
              className="w-full max-h-48 object-cover rounded-md"
            />
          )}

          {resource.description && (
            <p className="text-text-secondary text-sm">{resource.description}</p>
          )}

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-text-secondary">Type</dt>
            <dd className="text-text-primary">{resource.type}</dd>

            <dt className="text-text-secondary">Topic</dt>
            <dd className="text-text-primary">{resource.topic}</dd>

            {resource.batch?.name && (
              <>
                <dt className="text-text-secondary">Batch</dt>
                <dd className="text-text-primary">{resource.batch.name}</dd>
              </>
            )}

            {resource.uploadedBy?.name && (
              <>
                <dt className="text-text-secondary">Uploaded by</dt>
                <dd className="text-text-primary">
                  {resource.uploadedBy.name}
                  {resource.uploadedBy.role ? ` (${resource.uploadedBy.role})` : ""}
                </dd>
              </>
            )}

            {resource.fileName && (
              <>
                <dt className="text-text-secondary">File</dt>
                <dd className="text-text-primary">
                  {resource.fileName} ({formatSize(resource.fileSize)})
                </dd>
              </>
            )}
          </dl>
        </div>
      </Modal>
    </>
  );
}
