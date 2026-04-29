import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { validateApiKey } from "../../lib/api/auth";

function makeRequest(headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/v1/stats", { headers });
}

describe("validateApiKey", () => {
  const ORIG = process.env.UKSTATS_API_KEY;

  beforeEach(() => {
    process.env.UKSTATS_API_KEY = "test-secret";
  });

  afterEach(() => {
    if (ORIG === undefined) {
      delete process.env.UKSTATS_API_KEY;
    } else {
      process.env.UKSTATS_API_KEY = ORIG;
    }
  });

  it("returns 500 when UKSTATS_API_KEY env var is missing", async () => {
    delete process.env.UKSTATS_API_KEY;
    const res = validateApiKey(makeRequest({ "x-api-key": "anything" }));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(500);
    const body = await res!.json();
    expect(JSON.stringify(body)).not.toContain("test-secret");
  });

  it("returns 500 when UKSTATS_API_KEY is an empty string", async () => {
    process.env.UKSTATS_API_KEY = "";
    const res = validateApiKey(makeRequest({ "x-api-key": "anything" }));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(500);
  });

  it("returns 401 when x-api-key header is absent", async () => {
    const res = validateApiKey(makeRequest());
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });

  it("returns 401 when x-api-key header is wrong", async () => {
    const res = validateApiKey(makeRequest({ "x-api-key": "wrong-key" }));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
    const body = await res!.json();
    expect(JSON.stringify(body)).not.toContain("test-secret");
  });

  it("returns null when the correct API key is provided", () => {
    const res = validateApiKey(makeRequest({ "x-api-key": "test-secret" }));
    expect(res).toBeNull();
  });

  it("does not accept the key via query string only (no header)", () => {
    const req = new NextRequest(
      "http://localhost/api/v1/stats?x-api-key=test-secret",
    );
    const res = validateApiKey(req);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });
});
