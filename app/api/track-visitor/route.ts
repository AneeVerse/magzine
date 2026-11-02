import { getIndianTime } from "@/lib/email";

export const runtime = "nodejs";

const WEBHOOK_URL =
  process.env.VISITOR_TRACKING_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_VISITOR_TRACKING_WEBHOOK_URL ||
  "";

export async function POST(request: Request) {
  try {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes("YOUR_")) {
      return Response.json({ skipped: true });
    }

    const body = (await request.json()) as Record<string, unknown>;

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: getIndianTime(),
        ip: body.ip || "",
        city: body.city || "",
        region: body.region || "",
        country: body.country || "",
        pincode: body.pincode || "",
        pageUrl: body.pageUrl || "",
        referrer: body.referrer || "Direct",
        userAgent: body.userAgent || "",
        src: body.src || "",
        utm_source: body.utm_source || "",
        utm_medium: body.utm_medium || "",
        utm_campaign: body.utm_campaign || "",
        device: body.device || "",
      }),
      signal: AbortSignal.timeout(12000),
      redirect: "follow",
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("track-visitor error:", error);
    return Response.json({ success: false });
  }
}
