import { parseLead } from "@/lib/leads";
import { deliverLead, deliveryMode } from "@/lib/delivery";
import { DeliveryError } from "@/lib/doubletick";
import { reserveSend } from "@/lib/send-limit";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { error: "Please submit the form from this website." },
      { status: 403 },
    );
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return Response.json(
      { error: "This request is too large." },
      { status: 413 },
    );
  let input: unknown;
  try {
    const text = await request.text();
    if (text.length > 16000)
      return Response.json(
        { error: "This request is too large." },
        { status: 413 },
      );
    input = JSON.parse(text);
  } catch {
    return Response.json(
      { error: "The request could not be read. Please try again." },
      { status: 400 },
    );
  }
  const lead = parseLead(input);
  if (!lead)
    return Response.json(
      {
        error:
          "Check your name, WhatsApp number, email and consent, then try again.",
      },
      { status: 400 },
    );
  let release: (() => void) | undefined;
  try {
    if (deliveryMode() !== "preview") {
      const reservation = reserveSend(
        lead.phone + (lead.action === "visit" ? ":visit" : ":magazine"),
      );
      if (!reservation.allowed)
        return Response.json(
          { error: "Please wait a minute before requesting another message." },
          {
            status: 429,
            headers: { "Retry-After": String(reservation.retryAfter) },
          },
        );
      release = reservation.release;
    }
    const result = await deliverLead(lead);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    release?.();
    // Provider response bodies may include account details. Never expose or log them.
    const code = error instanceof DeliveryError ? error.code : "upstream";
    console.error("RISE delivery failed:", code);
    return Response.json(
      {
        error:
          code === "configuration" || code === "permission"
            ? "Delivery is temporarily unavailable. Please try again later."
            : "We couldn’t send your request. Your details are still here; please try again shortly.",
      },
      { status: code === "configuration" || code === "permission" ? 503 : 502 },
    );
  }
}
