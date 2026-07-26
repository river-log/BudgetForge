import { useEffect, useMemo, useState } from "react";

import { commands } from "./commands";

import CommandItem from "./CommandItem";
import CommandGroup from "./CommandGroup";

function CommandPalette({ open, onClose }) {
  if (!open) return null;

  return <CommandPaletteContent onClose={onClose} />;
}

function CommandPaletteContent({ onClose }) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const filteredCommands = useMemo(() => {
    const query = search.toLowerCase();

    return commands.filter((command) => {
      return (
        command.title
          .toLowerCase()
          .includes(query) ||
        command.subtitle
          .toLowerCase()
          .includes(query)
      );
    });
  }, [search]);

  useEffect(() => {
    function handleKeys(event) {
      if (!filteredCommands.length) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();

          setSelectedIndex((prev) =>
            prev === filteredCommands.length - 1
              ? 0
              : prev + 1
          );

          break;

        case "ArrowUp":
          event.preventDefault();

          setSelectedIndex((prev) =>
            prev === 0
              ? filteredCommands.length - 1
              : prev - 1
          );

          break;

        case "Enter":
          event.preventDefault();

          document
            .querySelector(".command-item.selected")
            ?.click();

          break;

        default:
          break;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeys
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeys
      );
  }, [filteredCommands]);

  return (
    <div
      className="command-overlay"
      onClick={onClose}
    >
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="BudgetForge command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <label className="sr-only" htmlFor="command-search">Search BudgetForge pages</label>
        <input
          id="command-search"
          autoFocus
          className="command-input"
          placeholder="Search BudgetForge..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedIndex(0);
          }}
        />

        <div className="command-results" role="listbox" aria-label="Available pages">
          <CommandGroup title="Pages">
            {filteredCommands.length > 0 ? (
              filteredCommands.map(
                (command, index) => (
                  <CommandItem
                    key={command.id}
                    command={command}
                    selected={
                      index === selectedIndex
                    }
                    onMouseEnter={() =>
                      setSelectedIndex(index)
                    }
                    onClose={onClose}
                  />
                )
              )
            ) : (
              <div className="command-empty">
                No commands found.
              </div>
            )}
          </CommandGroup>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
