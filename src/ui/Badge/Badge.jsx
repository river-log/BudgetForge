import "./Badge.css";

function Badge({
  children,
  variant = "default",
  size = "md",
  rounded = true,
  className = "",
  ...props
}) {
  const classes = [
    "bf-badge",
    `bf-badge--${variant}`,
    `bf-badge--${size}`,
    rounded ? "bf-badge--rounded" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;