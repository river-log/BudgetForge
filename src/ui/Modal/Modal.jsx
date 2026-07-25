import { useEffect } from "react";
import "./Modal.css";

function Modal({
  open = false,
  onClose,
  title,
  children,
  footer = null,
  size = "md",
  closeOnOverlayClick = true,
  className = "",
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const classes = [
    "bf-modal",
    `bf-modal--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlayClick &&
      event.target === event.currentTarget
    ) {
      onClose?.();
    }
  };

  return (
    <div
      className="bf-modal__overlay"
      onClick={handleOverlayClick}
    >
      <div
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bf-modal-title" : undefined}
      >
        {(title || onClose) && (
          <div className="bf-modal__header">
            {title && (
              <h2
                id="bf-modal-title"
                className="bf-modal__title"
              >
                {title}
              </h2>
            )}

            {onClose && (
              <button
                type="button"
                className="bf-modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="bf-modal__body">
          {children}
        </div>

        {footer && (
          <div className="bf-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;