function CommandGroup({
  title,
  children,
}) {
  if (!children) return null;

  return (
    <>
      <div
        style={{
          padding: "14px 22px",
          background: "rgba(255,255,255,.03)",
          borderTop:
            "1px solid rgba(255,255,255,.05)",
          borderBottom:
            "1px solid rgba(255,255,255,.05)",
          fontSize: "12px",
          letterSpacing: "1px",
          fontWeight: "700",
          color: "#8b93a7",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      {children}
    </>
  );
}

export default CommandGroup;