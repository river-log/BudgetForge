import "./Toast.css";

function Toast({
  title,
  message,
  variant = "info",
  icon = null,
  action = null,
  onClose,
  className = "",
  ...props
}) {
  const classes = [
    "bf-toast",
    `bf-toast--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role="status"
      aria-live="polite"
      {...props}
    >
      {icon && (
        <div className="bf-toast__icon">
          {icon}
        </div>
      )}

      <div className="bf-toast__content">
        {title && (
          <h4 className="bf-toast__title">
            {title}
          </h4>
        )}

        {message && (
          <p className="bf-toast__message">
            {message}
          </p>
        )}
      </div>

      {action && (
        <div className="bf-toast__action">
          {action}
        </div>
      )}

      {onClose && (
        <button
          type="button"
          className="bf-toast__close"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Toast;