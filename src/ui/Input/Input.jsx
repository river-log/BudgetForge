import "./Input.css";

function Input({
  label,
  helperText,
  error,
  leftIcon = null,
  rightIcon = null,
  fullWidth = true,
  className = "",
  id,
  ...props
}) {
  const classes = [
    "bf-input",
    error ? "bf-input--error" : "",
    fullWidth ? "bf-input--full" : "",
    leftIcon ? "bf-input--has-left-icon" : "",
    rightIcon ? "bf-input--has-right-icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="bf-input-group">
      {label && (
        <label className="bf-input__label" htmlFor={id}>
          {label}
        </label>
      )}

      <div className="bf-input__wrapper">
        {leftIcon && (
          <span className="bf-input__icon bf-input__icon--left">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          className={classes}
          aria-invalid={!!error}
          {...props}
        />

        {rightIcon && (
          <span className="bf-input__icon bf-input__icon--right">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="bf-input__error">{error}</p>
      ) : (
        helperText && (
          <p className="bf-input__helper">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

export default Input;