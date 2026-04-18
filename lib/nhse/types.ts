export class NhseApiError extends Error {
  constructor(
    public readonly url: string,
    cause: unknown,
  ) {
    super(`NHS England API fetch failed at ${url}`);
    this.name = "NhseApiError";
    this.cause = cause;
  }
}

/** A single monthly A&E performance data point */
export interface NhseAeDataPoint {
  /** ISO date string, first of the month e.g. "2026-03-01" */
  date: string;
  /** Human-readable label e.g. "Mar 2026" */
  label: string;
  /** Percentage of attendances seen within 4 hours, 0–100 e.g. 77.1 */
  percentage: number;
}
