import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PwaUpdatePrompt from "./PwaUpdatePrompt";
import usePwaUpdate from "../hooks/usePwaUpdate";

vi.mock("../hooks/usePwaUpdate", () => ({ default: vi.fn() }));

describe("PwaUpdatePrompt", () => {
  beforeEach(() => usePwaUpdate.mockReturnValue({ updateAvailable: false, deferredForEditing: false, updateNow: vi.fn() }));

  it("offers a clear Update Now action", () => {
    const updateNow = vi.fn();
    usePwaUpdate.mockReturnValue({ updateAvailable: true, deferredForEditing: false, updateNow });
    render(<PwaUpdatePrompt />);
    fireEvent.click(screen.getByRole("button", { name: "Update Now" }));
    expect(updateNow).toHaveBeenCalledOnce();
  });

  it("explains when updating is deferred for form edits", () => {
    usePwaUpdate.mockReturnValue({ updateAvailable: true, deferredForEditing: true, updateNow: vi.fn() });
    render(<PwaUpdatePrompt />);
    expect(screen.getByText("Finish or cancel your form changes before updating.")).toBeInTheDocument();
  });
});
