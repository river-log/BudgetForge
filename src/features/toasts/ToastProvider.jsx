import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ToastContainer from "./ToastContainer";
import ToastContext from "./ToastContext";

const TOAST_DURATION = 3000;

function createToastId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Set());

  const removeToast = useCallback((id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback((message, type = "info") => {
    const id = createToastId();

    setToasts((current) => [
      ...current,
      { id, message, type },
    ]);

    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      removeToast(id);
    }, TOAST_DURATION);

    timers.current.add(timer);
  }, [removeToast]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export default ToastProvider;
