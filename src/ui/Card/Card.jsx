import "./Card.css";

function Card({
  children,
  className = "",
  padding = "md",
  shadow = "md",
  border = true,
  hover = false,
  fullHeight = false,
  onClick,
  ...props
}) {
  const classes = [
    "bf-card",
    `bf-card--padding-${padding}`,
    `bf-card--shadow-${shadow}`,
    border ? "bf-card--border" : "",
    hover ? "bf-card--hover" : "",
    fullHeight ? "bf-card--full-height" : "",
    onClick ? "bf-card--clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;