import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("supabase/functions/delete-account/index.ts", "utf8");

describe("delete-account Edge Function contract", () => {
  it("requires a bearer token and verifies it before privileged work", () => {
    expect(source).toContain('authorization?.startsWith("Bearer ")');
    expect(source).toContain("verifier.auth.getUser(token)");
  });

  it("derives ownership from the verified user and ignores request body IDs", () => {
    expect(source).toContain("deleteUser(user.id)");
    expect(source).not.toMatch(/request\.json|body\.user|user_id\s*=/);
  });

  it("deletes Auth once and relies on reviewed foreign-key cascades", () => {
    expect(source.match(/deleteUser\(user\.id\)/g)).toHaveLength(1);
    expect(source).not.toContain('.from("budgetforge_sync").delete()');
    expect(source).not.toContain('.from("income_entries").delete()');
    expect(source).toContain("ON DELETE CASCADE");
  });
});
