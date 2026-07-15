import { useNavigate } from "react-router-dom";

function CommandItem({
  command,
  selected,
  onMouseEnter,
  onClose,
}) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(command.path);
    onClose();
  }

  return (
    <div
      className={`command-item ${
        selected ? "selected" : ""
      }`}
      onMouseEnter={onMouseEnter}
      onClick={handleClick}
    >
      <div
        style={{
          fontSize: "24px",
          width: "36px",
          textAlign: "center",
        }}
      >
        {command.icon}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <strong>{command.title}</strong>

        <small
          style={{
            color: "#8b93a7",
            marginTop: "2px",
          }}
        >
          {command.subtitle}
        </small>
      </div>

      <small
        style={{
          color: "#6d7384",
          fontSize: "12px",
        }}
      >
        {command.type.toUpperCase()}
      </small>
    </div>
  );
}

export default CommandItem;