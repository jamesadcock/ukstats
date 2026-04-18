import * as XLSX from "xlsx";
import { type HoSmallBoatRow, HoApiError } from "./types";

const PUBLICATION_PAGE =
  "https://www.gov.uk/government/publications/migrants-detected-crossing-the-english-channel-in-small-boats";

const FETCH_TIMEOUT_MS = 20_000;

/** Sheet containing the daily time series */
const DATA_SHEET = "SB_01";

/** Column index (0-based) of the date in SB_01 */
const DATE_COL = 0;

/** Column index (0-based) of "Migrants arrived" in SB_01 */
const ARRIVED_COL = 1;

/** Row index (0-based) where data starts (row 0 is the header) */
const DATA_START_ROW = 1;

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
 * Fetches the Home Office small boats weekly ODS time series, parses it, and
 * returns all daily rows as {@link HoSmallBoatRow}, oldest-first.
 *
 * Two-step process:
 *  1. Fetch the GOV.UK publication page to discover the current ODS URL
 *     (the URL path changes with each weekly publication).
 *  2. Fetch and parse the ODS file with SheetJS.
 *
 * Throws {@link HoApiError} on any network or parse failure so callers can
 * fall back to static data gracefully.
 */
export async function fetchHoSmallBoats(): Promise<HoSmallBoatRow[]> {
  // ── Step 1: discover current ODS URL ──────────────────────────────────────
  let pageHtml: string;
  try {
    const res = await fetch(PUBLICATION_PAGE, {
      // Cache the discovery page for a day — URL only changes on publication day
      next: { revalidate: 86_400 },
      headers: { "User-Agent": "ukstats/1.0 (+https://ukstats.info)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    pageHtml = await res.text();
  } catch (err) {
    throw new HoApiError(PUBLICATION_PAGE, err);
  }

  const match = pageHtml.match(
    /https:\/\/assets\.publishing\.service\.gov\.uk\/media\/[^"]+_Small_boats_-_time_series\.ods/,
  );
  if (!match) {
    throw new HoApiError(
      PUBLICATION_PAGE,
      new Error("Could not find Small_boats_-_time_series ODS link on page"),
    );
  }
  const odsUrl = match[0];

  // ── Step 2: fetch and parse the ODS ───────────────────────────────────────
  let buffer: ArrayBuffer;
  try {
    const res = await fetch(odsUrl, {
      next: { revalidate: 86_400 },
      headers: { "User-Agent": "ukstats/1.0 (+https://ukstats.info)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    buffer = await res.arrayBuffer();
  } catch (err) {
    throw new HoApiError(odsUrl, err);
  }

  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
  } catch (err) {
    throw new HoApiError(odsUrl, new Error(`Failed to parse ODS: ${err}`));
  }

  const ws = wb.Sheets[DATA_SHEET];
  if (!ws) {
    throw new HoApiError(
      odsUrl,
      new Error(`Sheet "${DATA_SHEET}" not found in ODS`),
    );
  }

  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
  }) as unknown[][];
  const rows: HoSmallBoatRow[] = [];

  for (let i = DATA_START_ROW; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rawDate = row[DATE_COL];
    const rawArrived = row[ARRIVED_COL];

    if (rawDate == null || rawArrived == null) continue;

    // Dates are stored as Excel serial integers in the ODS
    const serial = Number(rawDate);
    if (isNaN(serial)) continue;

    const parsed = XLSX.SSF.parse_date_code(serial);
    if (!parsed) continue;

    const arrived = Number(rawArrived);
    if (isNaN(arrived)) continue;

    const month = String(parsed.m).padStart(2, "0");
    const day = String(parsed.d).padStart(2, "0");
    const dateStr = `${parsed.y}-${month}-${day}`;
    const label = `${MONTH_LABELS[parsed.m - 1]} ${parsed.y}`;

    rows.push({ date: dateStr, arrived });
    void label; // label used in transform, not stored in row
  }

  // Return oldest-first
  return rows;
}
