import "./Skeleton.css";

function Skeleton({
  width,
  height,
  variant = "text",
  animated = true,
  className = "",
  style = {},
  ...props
}) {
  const classes = [
    "bf-skeleton",
    `bf-skeleton--${variant}`,
    animated && "bf-skeleton--animated",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const skeletonStyle = {
    width,
    height,
    ...style,
  };

  return (
    <div
      className={classes}
      style={skeletonStyle}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Skeleton;