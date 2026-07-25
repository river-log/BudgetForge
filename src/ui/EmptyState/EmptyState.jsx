import "./EmptyState.css";

function EmptyState({
  icon = null,
  title = "Nothing here yet",
  description = "There's nothing to display right now.",
  action = null,
  centered = true,
  className = "",
  ...props
}) {
  const classes = [
    "bf-empty-state",
    centered ? "bf-empty-state--centered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {icon && (
        <div className="bf-empty-state__icon">
          {icon}
        </div>
      )}

      <h2 className="bf-empty-state__title">
        {title}
      </h2>

      <p className="bf-empty-state__description">
        {description}
      </p>

      {action && (
        <div className="bf-empty-state__action">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;