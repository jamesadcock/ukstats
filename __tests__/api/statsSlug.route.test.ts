import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import type { Stat } from "../../types";

vi.mock("../../lib/data/stats", () => ({
  getAllStats: vi.fn(),
  getStatBySlugWithLiveData: vi.fn(),
}));

import { GET } from "../../app/api/v1/stats/[slug]/route";
import { getStatBySlugWithLiveData } from "../../lib/data/stats";

const MOCK_STAT: Stat = {
  slug: "uk-gdp-growth-rate",
  title: "UK GDP Growth Rate",
  category: "economy",
  summary: "Quarterly percentage change in UK GDP.",
  currentValue: 0.1,
  unit: "%",
  frequency: "quarterly",
  source: {
    name: "Office for National Statistics (ONS)",
    url: "https://www.ons.gov.uk",
    publishedAt: "2024-01-01",
  },
  lastUpdated: "2024-03-01",
  methodology: "GDP methodology.",
  tags: ["gdp"],
  chartData: [
    { date: "2022-01-01", value: 0.5, label: "Q1 2022" },
    { date: "2022-04-01", value: 0.2, label: "Q2 2022" },
    { date: "2022-07-01", value: -0.1, label: "Q3 2022" },
    { date: "2023-01-01", value: 0.3, label: "Q1 2023" },
    { date: "2024-01-01", value: 0.1, label: "Q1 2024" },
  ],
};

function makeRequest(slug: string, search = "", apiKey = "test-secret") {
  const url = `http://localhost/api/v1/stats/${slug}${search ? `?${search}` : ""}`;
  return new NextRequest(url, { headers: { "x-api-key": apiKey } });
}

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

describe("GET /api/v1/stats/[slug]", () => {
  const ORIG = process.env.UKSTATS_API_KEY;

  beforeEach(() => {
    process.env.UKSTATS_API_KEY = "test-secret";
    vi.resetAllMocks();
    vi.mocked(getStatBySlugWithLiveData).mockResolvedValue(MOCK_STAT);
  });

  afterEach(() => {
    if (ORIG === undefined) delete process.env.UKSTATS_API_KEY;
    else process.env.UKSTATS_API_KEY = ORIG;
  });

  it("returns 401 when x-api-key header is missing", async () => {
    const req = new NextRequest(
      "http://localhost/api/v1/stats/uk-gdp-growth-rate",
    );
    const res = await GET(req, makeParams("uk-gdp-growth-rate"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when x-api-key is invalid", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "", "bad-key"),
      makeParams("uk-gdp-growth-rate"),
    );
    expect(res.status).toBe(401);
  });

  it("returns 500 when UKSTATS_API_KEY is not configured", async () => {
    delete process.env.UKSTATS_API_KEY;
    const res = await GET(
      makeRequest("uk-gdp-growth-rate"),
      makeParams("uk-gdp-growth-rate"),
    );
    expect(res.status).toBe(500);
  });

  it("returns 404 for an unknown slug", async () => {
    vi.mocked(getStatBySlugWithLiveData).mockResolvedValue(undefined);
    const res = await GET(
      makeRequest("does-not-exist"),
      makeParams("does-not-exist"),
    );
    expect(res.status).toBe(404);
  });

  it("returns 200 with the full dataset for a known slug", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate"),
      makeParams("uk-gdp-growth-rate"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toBe("uk-gdp-growth-rate");
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it("data is sorted ascending by date", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate"),
      makeParams("uk-gdp-growth-rate"),
    );
    const body = await res.json();
    const dates: string[] = body.data.map((d: { date: string }) => d.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("filters data using the from parameter", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "from=2023-01-01"),
      makeParams("uk-gdp-growth-rate"),
    );
    const body = await res.json();
    body.data.forEach((d: { date: string }) => {
      expect(d.date >= "2023-01-01").toBe(true);
    });
  });

  it("filters data using the to parameter", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "to=2022-12-31"),
      makeParams("uk-gdp-growth-rate"),
    );
    const body = await res.json();
    body.data.forEach((d: { date: string }) => {
      expect(d.date <= "2022-12-31").toBe(true);
    });
  });

  it("limit returns the most recent N records in ascending order", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "limit=2"),
      makeParams("uk-gdp-growth-rate"),
    );
    const body = await res.json();
    expect(body.data).toHaveLength(2);
    const dates: string[] = body.data.map((d: { date: string }) => d.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("latest=true returns only the most recent record", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "latest=true"),
      makeParams("uk-gdp-growth-rate"),
    );
    const body = await res.json();
    expect(body.data).toHaveLength(1);
  });

  it("returns 400 for an invalid from date", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "from=not-a-date"),
      makeParams("uk-gdp-growth-rate"),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid to date", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "to=xyz"),
      makeParams("uk-gdp-growth-rate"),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for a non-integer limit", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "limit=abc"),
      makeParams("uk-gdp-growth-rate"),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid latest value", async () => {
    const res = await GET(
      makeRequest("uk-gdp-growth-rate", "latest=maybe"),
      makeParams("uk-gdp-growth-rate"),
    );
    expect(res.status).toBe(400);
  });
});
