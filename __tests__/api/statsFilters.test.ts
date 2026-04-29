import { describe, it, expect } from "vitest";
import { parseFilterParams, applyFilters } from "../../lib/api/statsFilters";
import type { StatDataPoint } from "../../types/api";

function makePoints(dates: string[]): StatDataPoint[] {
  return dates.map((date) => ({
    period: date,
    periodStart: date,
    periodEnd: date,
    date,
    value: 1,
    status: "final" as const,
  }));
}

describe("parseFilterParams", () => {
  it("returns empty params for no query string", () => {
    const { params, error } = parseFilterParams(new URLSearchParams());
    expect(error).toBeUndefined();
    expect(params).toEqual({});
  });

  it("accepts valid from/to dates", () => {
    const { params, error } = parseFilterParams(
      new URLSearchParams("from=2020-01-01&to=2024-12-31"),
    );
    expect(error).toBeUndefined();
    expect(params.from).toBe("2020-01-01");
    expect(params.to).toBe("2024-12-31");
  });

  it("returns 400 for invalid from date", () => {
    const { error } = parseFilterParams(new URLSearchParams("from=not-a-date"));
    expect(error?.status).toBe(400);
  });

  it("returns 400 for invalid to date", () => {
    const { error } = parseFilterParams(new URLSearchParams("to=abc"));
    expect(error?.status).toBe(400);
  });

  it("accepts a valid limit", () => {
    const { params, error } = parseFilterParams(new URLSearchParams("limit=5"));
    expect(error).toBeUndefined();
    expect(params.limit).toBe(5);
  });

  it("returns 400 for non-integer limit", () => {
    const { error } = parseFilterParams(new URLSearchParams("limit=1.5"));
    expect(error?.status).toBe(400);
  });

  it("returns 400 for zero limit", () => {
    const { error } = parseFilterParams(new URLSearchParams("limit=0"));
    expect(error?.status).toBe(400);
  });

  it("returns 400 for negative limit", () => {
    const { error } = parseFilterParams(new URLSearchParams("limit=-3"));
    expect(error?.status).toBe(400);
  });

  it("returns 400 for alphabetic limit", () => {
    const { error } = parseFilterParams(new URLSearchParams("limit=abc"));
    expect(error?.status).toBe(400);
  });

  it("accepts latest=true", () => {
    const { params, error } = parseFilterParams(
      new URLSearchParams("latest=true"),
    );
    expect(error).toBeUndefined();
    expect(params.latest).toBe(true);
  });

  it("accepts latest=false", () => {
    const { params, error } = parseFilterParams(
      new URLSearchParams("latest=false"),
    );
    expect(error).toBeUndefined();
    expect(params.latest).toBe(false);
  });

  it("returns 400 for invalid latest value", () => {
    const { error } = parseFilterParams(new URLSearchParams("latest=yes"));
    expect(error?.status).toBe(400);
  });
});

describe("applyFilters", () => {
  const DATES = [
    "2021-12-31",
    "2022-12-31",
    "2023-12-31",
    "2024-12-31",
    "2025-12-31",
  ];

  it("returns all data when no filters are applied", () => {
    const data = makePoints(DATES);
    expect(applyFilters(data, {})).toHaveLength(5);
  });

  it("filters from a start date", () => {
    const data = makePoints(DATES);
    const result = applyFilters(data, { from: "2023-01-01" });
    expect(result.map((d) => d.date)).toEqual([
      "2023-12-31",
      "2024-12-31",
      "2025-12-31",
    ]);
  });

  it("filters to an end date", () => {
    const data = makePoints(DATES);
    const result = applyFilters(data, { to: "2023-12-31" });
    expect(result.map((d) => d.date)).toEqual([
      "2021-12-31",
      "2022-12-31",
      "2023-12-31",
    ]);
  });

  it("applies from and to together", () => {
    const data = makePoints(DATES);
    const result = applyFilters(data, {
      from: "2022-01-01",
      to: "2024-01-01",
    });
    expect(result.map((d) => d.date)).toEqual(["2022-12-31", "2023-12-31"]);
  });

  it("limit returns most recent N records in ascending order", () => {
    const data = makePoints(DATES);
    const result = applyFilters(data, { limit: 3 });
    expect(result.map((d) => d.date)).toEqual([
      "2023-12-31",
      "2024-12-31",
      "2025-12-31",
    ]);
  });

  it("returns only the latest record when latest=true", () => {
    const data = makePoints(DATES);
    const result = applyFilters(data, { latest: true });
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2025-12-31");
  });

  it("latest=true takes precedence over limit", () => {
    const data = makePoints(DATES);
    const result = applyFilters(data, { latest: true, limit: 3 });
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2025-12-31");
  });

  it("returns empty array when no data matches filters", () => {
    const data = makePoints(DATES);
    expect(applyFilters(data, { from: "2030-01-01" })).toHaveLength(0);
  });

  it("returns empty array for latest=true on empty data", () => {
    expect(applyFilters([], { latest: true })).toHaveLength(0);
  });

  it("data remains sorted ascending after applying limit", () => {
    const data = makePoints(DATES);
    const result = applyFilters(data, { limit: 3 });
    const dates = result.map((d) => d.date);
    expect(dates).toEqual([...dates].sort());
  });
});
