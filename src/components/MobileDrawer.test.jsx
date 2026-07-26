import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import MobileDrawer from "./MobileDrawer";

describe("mobile navigation drawer", () => {
  it("locks background scroll, closes on navigation, and restores focus", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    const returnFocusRef = createRef();
    returnFocusRef.current = opener;
    const onClose = vi.fn();
    const { rerender } = render(<MemoryRouter><MobileDrawer open onClose={onClose} returnFocusRef={returnFocusRef} /></MemoryRouter>);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("link", { name: "Bills" }));
    expect(onClose).toHaveBeenCalled();
    rerender(<MemoryRouter><MobileDrawer open={false} onClose={onClose} returnFocusRef={returnFocusRef} /></MemoryRouter>);
    expect(document.body.style.overflow).toBe("");
    expect(opener).toHaveFocus();
    opener.remove();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<MemoryRouter><MobileDrawer open onClose={onClose} /></MemoryRouter>);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
