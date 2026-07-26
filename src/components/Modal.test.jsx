import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Modal from "./Modal";

describe("workspace Modal", () => {
  it("provides dialog semantics and closes with Escape", () => {
    const onClose = vi.fn();
    render(<Modal open title="Edit goal" onClose={onClose}><p>Content</p></Modal>);

    expect(screen.getByRole("dialog", { name: "Edit goal" })).toHaveAttribute("aria-modal", "true");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});

