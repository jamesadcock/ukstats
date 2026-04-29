import { type NextRequest, NextResponse } from "next/server";
import { getStatBySlugWithLiveData } from "../../../../../lib/data/stats";
import { validateApiKey } from "../../../../../lib/api/auth";
import { toStatSeries } from "../../../../../lib/api/statsService";
import {
  parseFilterParams,
  applyFilters,
} from "../../../../../lib/api/statsFilters";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  const { slug } = await params;
  const stat = await getStatBySlugWithLiveData(slug);
  if (!stat) {
    return NextResponse.json({ error: "Stat not found" }, { status: 404 });
  }

  const { params: filterParams, error: filterError } = parseFilterParams(
    req.nextUrl.searchParams,
  );
  if (filterError) {
    return NextResponse.json(
      { error: filterError.message },
      { status: filterError.status },
    );
  }

  const series = toStatSeries(stat);
  const filteredData = applyFilters(series.data, filterParams);
  return NextResponse.json({ ...series, data: filteredData });
}
