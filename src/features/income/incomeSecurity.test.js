import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { toIncomeRow } from "./incomeCloud";

const migration = readFileSync("supabase/migrations/202607280001_create_income_entries.sql", "utf8");

describe("income cloud ownership", () => {
  it("always maps the verified active user into persisted rows", () => {
    expect(toIncomeRow({ id: "entry", entryMode: "quick", sourceType: "Gift", sourceName: "Family", amount: 10, dateReceived: "2026-07-01", depositMethod: "Cash", createdAt: "now", updatedAt: "now" }, "verified-user")).toMatchObject({ id: "entry", user_id: "verified-user" });
  });
  it("enables RLS and defines separate owner-only CRUD policies", () => {
    expect(migration).toContain("enable row level security");
    expect(migration.match(/auth\.uid\(\) = user_id/g)).toHaveLength(5);
    ["select", "insert", "update", "delete"].forEach((operation) => expect(migration).toContain(`for ${operation}`));
  });
});
