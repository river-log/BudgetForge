import "./Spinner.css";

function Spinner({
  size = "md",
  color = "primary",
  label = "Loading...",
  centered = false,
  className = "",
  ...props
}) {
  const classes = [
    "bf-spinner",
    `bf-spinner--${size}`,
    `bf-spinner--${color}`,
    centered ? "bf-spinner--centered" : "",
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
      <span className="bf-spinner__circle" />
      <span className="bf-spinner__label">{label}</span>
    </div>
  );
}

export default Spinner;