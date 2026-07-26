import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RouteAnnouncer from "./RouteAnnouncer";

describe("route announcer", () => {
  it("announces and titles known and unknown routes", () => {
    const main = document.createElement("main");
    main.className = "main-content";
    main.scrollTo = vi.fn();
    document.body.appendChild(main);
    const { unmount } = render(<MemoryRouter initialEntries={["/reports"]}><RouteAnnouncer /></MemoryRouter>);
    expect(screen.getByRole("status")).toHaveTextContent("Reports page");
    expect(document.title).toBe("Reports | BudgetForge");
    expect(main.scrollTo).toHaveBeenCalled();
    unmount();
    main.remove();
  });
});

