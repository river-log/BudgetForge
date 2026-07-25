import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = "",
  ...props
}) {
  const classes = [
    "bf-button",
    `bf-button--${variant}`,
    `bf-button--${size}`,
    fullWidth ? "bf-button--full" : "",
    loading ? "is-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {leftIcon && !loading && (
        <span className="bf-button__icon">
          {leftIcon}
        </span>
      )}

      {loading ? (
        <span className="bf-button__loading">
          Loading...
        </span>
      ) : (
        <span className="bf-button__label">
          {children}
        </span>
      )}

      {rightIcon && !loading && (
        <span className="bf-button__icon">
          {rightIcon}
        </span>
      )}
    </button>
  );
}

export default Button;