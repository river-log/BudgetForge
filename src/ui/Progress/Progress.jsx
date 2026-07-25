import "./Progress.css";

function Progress({
  value = 0,
  max = 100,
  label,
  showValue = false,
  color = "primary",
  size = "md",
  animated = true,
  className = "",
  ...props
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const classes = [
    "bf-progress",
    `bf-progress--${size}`,
    `bf-progress--${color}`,
    animated ? "bf-progress--animated" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {(label || showValue) && (
        <div className="bf-progress__header">
          {label && (
            <span className="bf-progress__label">
              {label}
            </span>
          )}

          {showValue && (
            <span className="bf-progress__value">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className="bf-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label || "Progress"}
      >
        <div
          className="bf-progress__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default Progress;