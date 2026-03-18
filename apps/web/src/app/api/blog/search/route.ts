import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  // The legacy Fuse.js route is replaced by the unified OpenSearch route.
  // We'll permanently redirect (308) to the new /api/search route.
  const redirectUrl = new URL(`/api/search?q=${encodeURIComponent(query)}`, request.url);
  return NextResponse.redirect(redirectUrl, 308);
}
