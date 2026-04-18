export class LrApiError extends Error {
  constructor(
    public readonly url: string,
    cause: unknown,
  ) {
    super(`Land Registry API fetch failed at ${url}`);
    this.name = "LrApiError";
    this.cause = cause;
  }
}

/** A single item returned by the LR Linked Data list endpoint */
export interface LrItem {
  _about: string;
  /** Average price for all property types, in pounds (integer) */
  averagePrice: number;
  /** ISO year-month, e.g. "2026-01" */
  refMonth: string;
}

/** Top-level shape of the LR Linked Data list API response */
export interface LrListResponse {
  result: {
    items: LrItem[];
    totalResults: number;
  };
}
