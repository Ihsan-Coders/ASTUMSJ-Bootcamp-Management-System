export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface text-text-primary rounded-lg shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mb-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
