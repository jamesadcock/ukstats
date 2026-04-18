export class WbApiError extends Error {
  constructor(
    public readonly url: string,
    cause: unknown,
  ) {
    super(`World Bank API fetch failed at ${url}`);
    this.name = "WbApiError";
    this.cause = cause;
  }
}

/** A single data point returned by the World Bank indicator API */
export interface WbDatapoint {
  date: string;
  value: number | null;
}

/**
 * Top-level shape of the World Bank API response.
 * The API returns a two-element JSON array: [metadata, data[]].
 */
export type WbResponse = [
  { page: number; pages: number; per_page: number; total: number },
  WbDatapoint[],
];
