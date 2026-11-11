import "server-only";
import type { LeadRequest } from "./leads.ts";
import type { DeliveryResult } from "../types";
import { DeliveryError, sendWhatsApp } from "./doubletick.ts";
import { emailConfigured, getIndianTime, sendLeadEmail } from "./email.ts";
import { sendToGoogleSheets } from "./googleSheetsClient.ts";

export function deliveryMode(): "preview" | "doubletick" | "webhook" {
  const mode = process.env.RISE_DELIVERY_MODE || "preview";
  if (mode !== "preview" && mode !== "doubletick" && mode !== "webhook")
    throw new DeliveryError("configuration");
  return mode;
}

async function captureLead(lead: LeadRequest): Promise<{
  email: boolean;
  sheet: boolean;
}> {
  const submittedAt = getIndianTime();
  const phone = `91${lead.phone}`;

  const [email, sheet] = await Promise.all([
    sendLeadEmail(lead),
    sendToGoogleSheets(
      {
        name: lead.name,
        email: lead.email,
        phone,
        googleSheetsPhone: phone,
        countryCode: "91",
        phoneWithoutCode: lead.phone,
        business: lead.biz,
        area: lead.area,
        bniStatus: lead.status,
        action: lead.action,
        formSource: "rise-magazine",
        from: "rise-magazine",
        userLocation: lead.geo.userLocation,
        city: lead.geo.city,
        region: lead.geo.region,
        country: lead.geo.country,
        userPincode: lead.geo.userPincode,
        userIp: lead.geo.userIp,
        pageUrl: lead.geo.pageUrl,
        src: lead.attribution.src || "",
        utm_source: lead.attribution.utm_source || "",
        utm_medium: lead.attribution.utm_medium || "",
        utm_campaign: lead.attribution.utm_campaign || "",
        utm_content: lead.attribution.utm_content || "",
        utm_term: lead.attribution.utm_term || "",
        consent: true,
        consentVersion: "rise-diwali-2026-v1",
        submittedAt,
      },
      `rise ${lead.action}`,
    ),
  ]);

  return { email, sheet };
}

export async function deliverLead(lead: LeadRequest): Promise<DeliveryResult> {
  const mode = deliveryMode();
  const capture = await captureLead(lead);
  const emailStatus = capture.email ? "accepted" : "not_configured";

  if (mode === "preview") {
    // Email / Sheets can still run when credentials are set (local testing).
    const anythingCaptured = capture.email || capture.sheet;
    return {
      preview: !anythingCaptured,
      delivery: {
        whatsapp: "not_configured",
        email: emailStatus,
      },
    };
  }

  if (mode === "webhook") {
    const endpoint = process.env.RISE_LEAD_WEBHOOK_URL;
    if (!endpoint || !endpoint.startsWith("https://")) {
      if (capture.email || capture.sheet) {
        return {
          preview: false,
          delivery: { whatsapp: "not_configured", email: emailStatus },
        };
      }
      throw new DeliveryError("configuration");
    }
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.RISE_WEBHOOK_TOKEN
            ? { Authorization: "Bearer " + process.env.RISE_WEBHOOK_TOKEN }
            : {}),
        },
        body: JSON.stringify({
          ...lead,
          phone: "+91" + lead.phone,
          consentVersion: "rise-diwali-2026-v1",
          requestedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10000),
        redirect: "error",
      });
      if (!response.ok) throw new DeliveryError("upstream");
      return {
        preview: false,
        delivery: { whatsapp: "accepted", email: emailStatus },
      };
    } catch (error) {
      if (capture.email || capture.sheet) {
        return {
          preview: false,
          delivery: { whatsapp: "not_configured", email: emailStatus },
        };
      }
      if (error instanceof DeliveryError) throw error;
      throw new DeliveryError("upstream");
    }
  }

  // Magazine + guest-visit forms both get the same DoubleTick template
  // (Download RISE + Book a guest visit buttons on rise.nmbts.co.in).
  await sendWhatsApp(lead);
  return {
    preview: false,
    delivery: { whatsapp: "accepted", email: emailStatus },
  };
}

export { emailConfigured };
