import { describe, it, expect } from "vitest";
import { toStatSummary, toStatSeries } from "../../lib/api/statsService";
import type { Stat } from "../../types";

const BASE_STAT: Stat = {
  slug: "uk-inflation-rate-cpi",
  title: "UK Inflation Rate (CPI)",
  category: "economy",
  summary: "The CPI 12-month rate.",
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
  chartData: [
    { date: "2024-01-01", value: 4.0, label: "Jan 2024" },
    { date: "2024-02-01", value: 3.4, label: "Feb 2024" },
    { date: "2024-03-01", value: 2.8, label: "Mar 2024" },
  ],
};

describe("toStatSummary", () => {
  it("maps slug to both id and slug", () => {
    const s = toStatSummary(BASE_STAT);
    expect(s.id).toBe("uk-inflation-rate-cpi");
    expect(s.slug).toBe("uk-inflation-rate-cpi");
  });

  it("maps title to name and summary to description", () => {
    const s = toStatSummary(BASE_STAT);
    expect(s.name).toBe("UK Inflation Rate (CPI)");
    expect(s.description).toBe("The CPI 12-month rate.");
  });

  it("maps frequency: monthly → monthly", () => {
    expect(
      toStatSummary({ ...BASE_STAT, frequency: "monthly" }).frequency,
    ).toBe("monthly");
  });

  it("maps frequency: quarterly → quarterly", () => {
    expect(
      toStatSummary({ ...BASE_STAT, frequency: "quarterly" }).frequency,
    ).toBe("quarterly");
  });

  it("maps frequency: annual → yearly", () => {
    expect(toStatSummary({ ...BASE_STAT, frequency: "annual" }).frequency).toBe(
      "yearly",
    );
  });

  it("maps undefined frequency to irregular", () => {
    const { frequency: _f, ...rest } = BASE_STAT;
    expect(toStatSummary(rest as Stat).frequency).toBe("irregular");
  });

  it("maps unit % to percent", () => {
    expect(toStatSummary(BASE_STAT).unit).toBe("percent");
  });

  it("passes through unknown units unchanged", () => {
    expect(toStatSummary({ ...BASE_STAT, unit: "custom-unit" }).unit).toBe(
      "custom-unit",
    );
  });

  it("extracts publisher abbreviation from parentheses in source name", () => {
    const s = toStatSummary(BASE_STAT);
    expect(s.source.publisher).toBe("ONS");
    expect(s.source.name).toBe("Office for National Statistics (ONS)");
  });

  it("falls back to full name when no parenthetical publisher", () => {
    const s = toStatSummary({
      ...BASE_STAT,
      source: { ...BASE_STAT.source, name: "NHS England" },
    });
    expect(s.source.publisher).toBe("NHS England");
  });

  it("sets geography to UK", () => {
    expect(toStatSummary(BASE_STAT).geography).toBe("UK");
  });

  it("formats lastUpdated as an ISO datetime string", () => {
    const s = toStatSummary(BASE_STAT);
    expect(s.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("does not include a data field", () => {
    const s = toStatSummary(BASE_STAT) as unknown as Record<string, unknown>;
    expect(s["data"]).toBeUndefined();
  });
});

describe("toStatSeries", () => {
  it("includes all StatSummary fields", () => {
    const series = toStatSeries(BASE_STAT);
    expect(series.id).toBe("uk-inflation-rate-cpi");
    expect(series.frequency).toBe("monthly");
  });

  it("returns a data array with the correct length", () => {
    const series = toStatSeries(BASE_STAT);
    expect(series.data).toHaveLength(3);
  });

  it("returns an empty data array when chartData is undefined", () => {
    const { chartData: _c, ...rest } = BASE_STAT;
    expect(toStatSeries(rest as Stat).data).toEqual([]);
  });

  it("data is sorted ascending by date", () => {
    const shuffled: Stat = {
      ...BASE_STAT,
      chartData: [
        { date: "2024-03-01", value: 2.8, label: "Mar 2024" },
        { date: "2024-01-01", value: 4.0, label: "Jan 2024" },
        { date: "2024-02-01", value: 3.4, label: "Feb 2024" },
      ],
    };
    const series = toStatSeries(shuffled);
    const dates = series.data.map((d) => d.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("monthly data point has correct period bounds", () => {
    const series = toStatSeries(BASE_STAT);
    const jan = series.data[0];
    expect(jan.periodStart).toBe("2024-01-01");
    expect(jan.periodEnd).toBe("2024-01-31");
    expect(jan.date).toBe("2024-01-31");
  });

  it("uses DataPoint label as period when available", () => {
    const series = toStatSeries(BASE_STAT);
    expect(series.data[0].period).toBe("Jan 2024");
  });

  it("quarterly data point has correct period bounds", () => {
    const stat: Stat = {
      ...BASE_STAT,
      frequency: "quarterly",
      chartData: [{ date: "2024-01-01", value: 0.3, label: "Q1 2024" }],
    };
    const series = toStatSeries(stat);
    expect(series.data[0].periodStart).toBe("2024-01-01");
    expect(series.data[0].periodEnd).toBe("2024-03-31");
  });

  it("annual data point has correct period bounds", () => {
    const stat: Stat = {
      ...BASE_STAT,
      frequency: "annual",
      chartData: [{ date: "2023-01-01", value: 68.3, label: "2023" }],
    };
    const series = toStatSeries(stat);
    expect(series.data[0].periodStart).toBe("2023-01-01");
    expect(series.data[0].periodEnd).toBe("2023-12-31");
  });

  it("status defaults to final for all data points", () => {
    toStatSeries(BASE_STAT).data.forEach((d) => {
      expect(d.status).toBe("final");
    });
  });
});
