import type { StatDataPoint } from "../../types/api";

export interface FilterParams {
  from?: string;
  to?: string;
  limit?: number;
  latest?: boolean;
}

interface ParseError {
  message: string;
  status: 400;
}

export interface ParseResult {
  params: FilterParams;
  error?: ParseError;
}

function isValidIsoDate(value: string): boolean {
  const d = new Date(value);
  return !isNaN(d.getTime());
}

/** Parses and validates query parameters for the detail endpoint */
export function parseFilterParams(searchParams: URLSearchParams): ParseResult {
  const params: FilterParams = {};

  const from = searchParams.get("from");
  if (from !== null) {
    if (!isValidIsoDate(from)) {
      return {
        params,
        error: {
          message: "Invalid 'from' — expected an ISO date string",
          status: 400,
        },
      };
    }
    params.from = from;
  }

  const to = searchParams.get("to");
  if (to !== null) {
    if (!isValidIsoDate(to)) {
      return {
        params,
        error: {
          message: "Invalid 'to' — expected an ISO date string",
          status: 400,
        },
      };
    }
    params.to = to;
  }

  const limitRaw = searchParams.get("limit");
  if (limitRaw !== null) {
    if (!/^\d+$/.test(limitRaw)) {
      return {
        params,
        error: {
          message: "Invalid 'limit' — expected a positive integer",
          status: 400,
        },
      };
    }
    const limit = parseInt(limitRaw, 10);
    if (limit < 1) {
      return {
        params,
        error: {
          message: "Invalid 'limit' — must be greater than zero",
          status: 400,
        },
      };
    }
    params.limit = limit;
  }

  const latestRaw = searchParams.get("latest");
  if (latestRaw !== null) {
    if (latestRaw !== "true" && latestRaw !== "false") {
      return {
        params,
        error: {
          message: "Invalid 'latest' — expected 'true' or 'false'",
          status: 400,
        },
      };
    }
    params.latest = latestRaw === "true";
  }

  return { params };
}

/**
 * Applies from/to/limit/latest filters to an ascending-sorted data array.
 * Returns data still sorted ascending by date.
 */
export function applyFilters(
  data: StatDataPoint[],
  params: FilterParams,
): StatDataPoint[] {
  let result = data;

  if (params.from) {
    result = result.filter((d) => d.date >= params.from!);
  }

  if (params.to) {
    result = result.filter((d) => d.date <= params.to!);
  }

  // latest=true takes precedence over limit
  if (params.latest) {
    return result.length > 0 ? [result[result.length - 1]] : [];
  }

  if (params.limit !== undefined) {
    // Take the most recent N; slicing from the end preserves ascending order
    result = result.slice(-params.limit);
  }

  return result;
}
