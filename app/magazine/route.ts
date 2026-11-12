import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** WhatsApp button opens /magazine. The file itself is a static asset. */
export function GET(request: Request) {
  return NextResponse.redirect(new URL("/rise-magazine.pdf", request.url), 307);
}
