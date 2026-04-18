import * as XLSX from "xlsx";
import { type NhseAeDataPoint, NhseApiError } from "./types";

const AE_STATS_PAGE =
  "https://www.england.nhs.uk/statistics/statistical-work-areas/ae-waiting-times-and-activity/";
const FETCH_TIMEOUT_MS = 15_000;
const PERFORMANCE_SHEET = "Performance";
/** Column index (0-based) of "Percentage in 4 hours or less (all)" */
const PCT_COL = 10;
/** Row index (0-based) where data rows begin */
const DATA_START_ROW = 14;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Fetches the NHS England A&E monthly time series XLS, parses it, and returns
 * the most recent `count` months of England-aggregate 4-hour performance data,
 * newest-first.
 *
 * Two-step process:
 *  1. Fetch the NHS England A&E stats page to discover the current XLS URL
 *     (the URL slug changes with each monthly publication).
 *  2. Fetch and parse the XLS file with SheetJS.
 *
 * Throws NhseApiError on any network or parse failure so callers can fall
 * back to static data gracefully.
 */
export async function fetchNhseAeTimeSeries(
  count: number,
): Promise<NhseAeDataPoint[]> {
  // ── Step 1: discover current XLS URL ────────────────────────────────────
  let pageHtml: string;
  try {
    const res = await fetch(AE_STATS_PAGE, {
      // Cache the discovery page for a day — URL only changes on publication day
      next: { revalidate: 86_400 },
      headers: { "User-Agent": "ukstats/1.0 (+https://ukstats.info)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    pageHtml = await res.text();
  } catch (err) {
    throw new NhseApiError(AE_STATS_PAGE, err);
  }

  const match = pageHtml.match(
    /https:\/\/www\.england\.nhs\.uk[^"]+Monthly-AE-Time-Series[^"]+\.xls/,
  );
  if (!match) {
    throw new NhseApiError(
      AE_STATS_PAGE,
      new Error("Could not find Monthly-AE-Time-Series XLS link on page"),
    );
  }
  const xlsUrl = match[0];

  // ── Step 2: fetch and parse the XLS ────────────────────────────────────
  let buffer: ArrayBuffer;
  try {
    const res = await fetch(xlsUrl, {
      next: { revalidate: 86_400 },
      headers: { "User-Agent": "ukstats/1.0 (+https://ukstats.info)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    buffer = await res.arrayBuffer();
  } catch (err) {
    throw new NhseApiError(xlsUrl, err);
  }

  // ── Step 3: parse rows from the Performance sheet ──────────────────────
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(buffer, { type: "array" });
  } catch (err) {
    throw new NhseApiError(xlsUrl, err);
  }

  const ws = wb.Sheets[PERFORMANCE_SHEET];
  if (!ws) {
    throw new NhseApiError(
      xlsUrl,
      new Error(`Sheet "${PERFORMANCE_SHEET}" not found`),
    );
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: "",
  });

  const points: NhseAeDataPoint[] = [];
  for (let i = DATA_START_ROW; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    const rawDate = row[1];
    const rawPct = row[PCT_COL];
    if (typeof rawDate !== "number" || typeof rawPct !== "number") continue;

    const d = XLSX.SSF.parse_date_code(rawDate);
    const month = d.m - 1; // 0-indexed
    const date = `${d.y}-${String(d.m).padStart(2, "0")}-01`;
    const label = `${MONTH_LABELS[month]} ${d.y}`;
    const percentage = Math.round(rawPct * 1000) / 10; // decimal → %, 1 d.p.

    points.push({ date, label, percentage });
  }

  if (points.length === 0) {
    throw new NhseApiError(xlsUrl, new Error("No data rows found in XLS"));
  }

  // Return newest-first, capped at `count`
  return points.slice(-count).reverse();
}
