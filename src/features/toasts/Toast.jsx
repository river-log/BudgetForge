function Toast({ message, type }) {
  return (
    <div className={`toast ${type}`} role={type === "error" ? "alert" : "status"} aria-live={type === "error" ? "assertive" : "polite"}>
      {message}
    </div>
  );
}

export default Toast;
