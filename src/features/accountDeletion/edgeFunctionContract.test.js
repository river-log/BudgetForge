import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("supabase/functions/delete-account/index.ts", "utf8");

describe("delete-account Edge Function contract", () => {
  it("requires a bearer token and verifies it before privileged work", () => {
    expect(source).toContain('authorization?.startsWith("Bearer ")');
    expect(source).toContain("verifier.auth.getUser(token)");
  });

  it("derives ownership from the verified user and ignores request body IDs", () => {
    expect(source).toContain('.eq("user_id", user.id)');
    expect(source).toContain("deleteUser(user.id)");
    expect(source).not.toMatch(/request\.json|body\.user|user_id\s*=/);
  });

  it("deletes cloud records before Auth and exposes a recoverable partial failure", () => {
    expect(source.indexOf('.from("budgetforge_sync").delete()')).toBeLessThan(source.indexOf("deleteUser(user.id)"));
    expect(source).toContain('error: "auth_delete_failed"');
    expect(source).toContain("recoverable: true");
  });
});
