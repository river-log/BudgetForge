import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commands } from "./commands";

function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [open]);

  const filteredCommands = useMemo(() => {
    return commands.filter((command) =>
      command.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  useEffect(() => {
    if (!open) return;

    function handleKeys(e) {
      if (!filteredCommands.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev === filteredCommands.length - 1
              ? 0
              : prev + 1
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev === 0
              ? filteredCommands.length - 1
              : prev - 1
          );
          break;

        case "Enter":
          e.preventDefault();
          navigate(filteredCommands[selectedIndex].path);
          onClose();
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeys
      );
    };
  }, [
    open,
    filteredCommands,
    selectedIndex,
    navigate,
    onClose,
  ]);

  if (!open) return null;

  return (
    <div
      className="command-overlay"
      onClick={onClose}
    >
      <div
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          className="command-input"
          placeholder="Search BudgetForge..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedIndex(0);
          }}
        />

        <div className="command-results">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => (
              <div
                key={command.path}
                className={`command-item ${
                  index === selectedIndex
                    ? "selected"
                    : ""
                }`}
                onMouseEnter={() =>
                  setSelectedIndex(index)
                }
                onClick={() => {
                  navigate(command.path);
                  onClose();
                }}
              >
                <span>{command.icon}</span>

                <span>{command.name}</span>
              </div>
            ))
          ) : (
            <div className="command-empty">
              No commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;