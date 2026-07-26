import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Modal from "./Modal";

describe("shared accessible Modal", () => {
  it("traps focus, closes with Escape, and restores focus", async () => {
    const onClose = vi.fn();
    const opener = document.createElement("button");
    opener.textContent = "Open";
    document.body.appendChild(opener);
    opener.focus();

    const { rerender } = render(
      <Modal open title="Preview backup" description="Review contents" onClose={onClose} footer={<button>Restore</button>}>
        <button>First action</button>
      </Modal>
    );
    const dialog = screen.getByRole("dialog", { name: "Preview backup" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Review contents");

    const close = screen.getByRole("button", { name: "Close modal" });
    close.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(screen.getByRole("button", { name: "Restore" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();

    rerender(<Modal open={false} title="Preview backup" onClose={onClose} />);
    expect(opener).toHaveFocus();
    opener.remove();
  });
});

