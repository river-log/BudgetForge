import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./Modal.css";

function Modal({
  open = false,
  onClose,
  title,
  description,
  children,
  footer = null,
  size = "md",
  closeOnOverlayClick = true,
  className = "",
}) {
  const modalRef = useRef(null);
  const openerRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return undefined;
    openerRef.current = document.activeElement;
    const appRoot = document.getElementById("root");
    const previousOverflow = document.body.style.overflow;
    appRoot?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }
      if (event.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) {
          event.preventDefault();
          modalRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => {
      const initial = modalRef.current?.querySelector("[data-autofocus], button, input, select, textarea, [tabindex]");
      (initial || modalRef.current)?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      appRoot?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus?.();
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

  return createPortal(
    <div
      className="bf-modal__overlay"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={classes}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
      >
        {(title || onClose) && (
          <div className="bf-modal__header">
            {title && (
              <h2
                id={titleId}
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
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="bf-modal__body">
          {description && <p id={descriptionId} className="bf-modal__description">{description}</p>}
          {children}
        </div>

        {footer && (
          <div className="bf-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
