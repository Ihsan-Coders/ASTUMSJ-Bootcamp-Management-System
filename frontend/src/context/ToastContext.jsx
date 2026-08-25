import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let toastId = 0;

const STYLES = {
  error: "bg-danger/15 border-danger text-danger",
  success: "bg-emerald/15 border-emerald text-emerald",
  info: "bg-gold/15 border-gold text-gold-light",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "error", duration = 4000) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }
      return id;
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`glass-card border rounded-lg shadow-lg px-4 py-3 text-sm flex items-start justify-between gap-3 ${
              STYLES[t.type] || STYLES.error
            }`}
          >
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
              className="text-text-secondary hover:text-text-primary leading-none"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
