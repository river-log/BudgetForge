import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commands } from "./commands";

function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setSearch("");
    }
  }, [open]);

  const filteredCommands = useMemo(() => {
    return commands.filter((command) =>
      command.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

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
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="command-results">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command) => (
              <div
                 key={command.path}
                className="command-item"
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