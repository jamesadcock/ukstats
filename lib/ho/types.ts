export class HoApiError extends Error {
  constructor(
    public readonly url: string,
    cause?: unknown,
  ) {
    super(
      `Home Office data fetch failed for ${url}${
        cause instanceof Error ? `: ${cause.message}` : ""
      }`,
    );
    this.name = "HoApiError";
    if (cause) this.cause = cause;
  }
}

/**
 * One daily row from the Home Office small boats time series (sheet SB_01).
 */
export interface HoSmallBoatRow {
  /** ISO date string, e.g. "2026-03-15" */
  date: string;
  /** Number of migrants arrived that day */
  arrived: number;
}
