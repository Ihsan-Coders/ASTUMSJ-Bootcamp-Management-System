import { createContext, useCallback, useContext, useRef, useState } from "react";
import Modal from "../components/common/Modal";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    title: "Confirm",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
  });
  const resolveRef = useRef(null);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        isOpen: true,
        title: options.title || "Confirm",
        message,
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
      });
    });
  }, []);

  const handleClose = (result) => {
    setState((prev) => ({ ...prev, isOpen: false }));
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Modal
        isOpen={state.isOpen}
        onClose={() => handleClose(false)}
        title={state.title}
        footer={
          <>
            <button
              onClick={() => handleClose(false)}
              className="px-4 py-2 rounded border border-border text-text-secondary hover:text-text-primary text-sm"
            >
              {state.cancelLabel}
            </button>
            <button
              onClick={() => handleClose(true)}
              className="px-4 py-2 rounded bg-danger text-white hover:opacity-90 text-sm"
            >
              {state.confirmLabel}
            </button>
          </>
        }
      >
        <p className="text-text-secondary text-sm">{state.message}</p>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within a ConfirmProvider");
  return ctx.confirm;
}
