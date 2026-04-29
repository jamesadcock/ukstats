import { type NextRequest, NextResponse } from "next/server";
import { getAllStats } from "../../../../lib/data/stats";
import { validateApiKey } from "../../../../lib/api/auth";
import { toStatSummary } from "../../../../lib/api/statsService";

export async function GET(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  const stats = getAllStats();
  return NextResponse.json({ stats: stats.map(toStatSummary) });
}
