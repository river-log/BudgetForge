import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

function Modal({
  open,
  title,
  children,
  onClose,
}) {
  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-modal-title"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-header">
          <h2 id="workspace-modal-title">{title}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
