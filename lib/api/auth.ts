import { type NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

/** Constant-time string comparison via SHA-256 hashing to equalise buffer lengths */
function safeCompare(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * Validates the x-api-key header against the UKSTATS_API_KEY env var.
 * Returns a NextResponse error on failure, or null if the request is authorised.
 */
export function validateApiKey(req: NextRequest): NextResponse | null {
  const expectedKey = process.env.UKSTATS_API_KEY;

  console.error("[auth] UKSTATS_API_KEY present:", !!expectedKey);
  console.error("[auth] NODE_ENV:", process.env.NODE_ENV);
  console.error(
    "[auth] Available env keys:",
    Object.keys(process.env)
      .filter((k) => k.startsWith("UKSTATS") || k.startsWith("NEXT"))
      .join(", "),
  );

  if (!expectedKey) {
    return NextResponse.json(
      { error: "Service configuration error" },
      { status: 500 },
    );
  }

  const providedKey = req.headers.get("x-api-key");

  if (!providedKey) {
    return NextResponse.json(
      { error: "Unauthorized: x-api-key header is required" },
      { status: 401 },
    );
  }

  if (!safeCompare(providedKey, expectedKey)) {
    return NextResponse.json(
      { error: "Unauthorized: invalid API key" },
      { status: 401 },
    );
  }

  return null;
}
