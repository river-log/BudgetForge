import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(".");
const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, "public/site.webmanifest"), "utf8"));

function pngDimensions(filePath) {
  const bytes = fs.readFileSync(filePath);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("production web app manifest", () => {
  it("contains required installability and branding fields", () => {
    expect(manifest).toMatchObject({
      id: "/",
      name: "BudgetForge",
      short_name: "BudgetForge",
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "any",
      lang: "en-US",
    });
    expect(manifest.description).toBeTruthy();
    expect(manifest.categories).toContain("finance");
  });

  it("references valid 192, 512, and maskable PNG icons", () => {
    const required = [
      manifest.icons.find((icon) => icon.sizes === "192x192" && icon.type === "image/png"),
      manifest.icons.find((icon) => icon.sizes === "512x512" && icon.type === "image/png" && icon.purpose === "any"),
      manifest.icons.find((icon) => icon.sizes === "512x512" && icon.purpose === "maskable"),
    ];
    required.forEach((icon) => {
      expect(icon).toBeTruthy();
      const declared = Number(icon.sizes.split("x")[0]);
      expect(pngDimensions(path.join(projectRoot, "public", icon.src))).toEqual({ width: declared, height: declared });
    });
  });

  it("maps shortcuts only to existing routes", () => {
    expect(manifest.shortcuts.map((shortcut) => shortcut.url)).toEqual(["/", "/bills", "/reports"]);
  });
});

