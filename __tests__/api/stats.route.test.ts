import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import type { Stat } from "../../types";

vi.mock("../../lib/data/stats", () => ({
  getAllStats: vi.fn(),
  getStatBySlugWithLiveData: vi.fn(),
}));

import { GET } from "../../app/api/v1/stats/route";
import { getAllStats } from "../../lib/data/stats";

const MOCK_STAT: Stat = {
  slug: "uk-inflation-rate-cpi",
  title: "UK Inflation Rate (CPI)",
  category: "economy",
  summary: "CPI 12-month rate.",
  currentValue: 2.8,
  unit: "%",
  frequency: "monthly",
  source: {
    name: "Office for National Statistics (ONS)",
    url: "https://www.ons.gov.uk",
    publishedAt: "2024-01-01",
  },
  lastUpdated: "2024-03-01",
  methodology: "CPI methodology.",
  tags: ["inflation"],
  chartData: [{ date: "2024-01-01", value: 4.0, label: "Jan 2024" }],
};

function makeRequest(apiKey?: string) {
  const headers: Record<string, string> = {};
  if (apiKey !== undefined) headers["x-api-key"] = apiKey;
  return new NextRequest("http://localhost/api/v1/stats", { headers });
}

describe("GET /api/v1/stats", () => {
  const ORIG = process.env.UKSTATS_API_KEY;

  beforeEach(() => {
    process.env.UKSTATS_API_KEY = "test-secret";
    vi.resetAllMocks();
    vi.mocked(getAllStats).mockReturnValue([MOCK_STAT]);
  });

  afterEach(() => {
    if (ORIG === undefined) delete process.env.UKSTATS_API_KEY;
    else process.env.UKSTATS_API_KEY = ORIG;
  });

  it("returns 401 when x-api-key header is missing", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 401 when x-api-key is invalid", async () => {
    const res = await GET(makeRequest("wrong-key"));
    expect(res.status).toBe(401);
  });

  it("returns 500 when UKSTATS_API_KEY env var is not configured", async () => {
    delete process.env.UKSTATS_API_KEY;
    const res = await GET(makeRequest("test-secret"));
    expect(res.status).toBe(500);
  });

  it("returns 200 with a valid API key", async () => {
    const res = await GET(makeRequest("test-secret"));
    expect(res.status).toBe(200);
  });

  it("returns a stats array in the response body", async () => {
    const res = await GET(makeRequest("test-secret"));
    const body = await res.json();
    expect(Array.isArray(body.stats)).toBe(true);
    expect(body.stats).toHaveLength(1);
  });

  it("list response does not include data arrays (metadata only)", async () => {
    const res = await GET(makeRequest("test-secret"));
    const body = await res.json();
    for (const stat of body.stats) {
      expect((stat as Record<string, unknown>)["data"]).toBeUndefined();
    }
  });

  it("each item includes required metadata fields", async () => {
    const res = await GET(makeRequest("test-secret"));
    const body = await res.json();
    const item = body.stats[0];
    expect(item.id).toBe("uk-inflation-rate-cpi");
    expect(item.slug).toBeDefined();
    expect(item.name).toBeDefined();
    expect(item.description).toBeDefined();
    expect(item.category).toBeDefined();
    expect(item.frequency).toBeDefined();
    expect(item.unit).toBeDefined();
    expect(item.source).toBeDefined();
    expect(item.lastUpdated).toBeDefined();
  });

  it("response has correct Content-Type header", async () => {
    const res = await GET(makeRequest("test-secret"));
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});
