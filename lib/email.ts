import "server-only";
import nodemailer from "nodemailer";
import type { LeadRequest } from "./leads.ts";

function emailConfig() {
  const user =
    process.env.EMAIL_USER || process.env.NEXT_PUBLIC_EMAIL_USER || "";
  const pass =
    process.env.EMAIL_APP_PASSWORD ||
    process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD ||
    process.env.NEXT_PUBLIC_EMAIL_APP_PASS ||
    "";
  const receiver =
    process.env.EMAIL_RECEIVER ||
    process.env.NEXT_PUBLIC_EMAIL_RECEIVER ||
    user;
  return { user, pass, receiver };
}

export function emailConfigured(): boolean {
  const { user, pass, receiver } = emailConfig();
  return Boolean(user && pass && receiver);
}

export function getIndianTime(): string {
  const now = new Date();
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istTime.getUTCDate()).padStart(2, "0");
  let hours = istTime.getUTCHours();
  const minutes = String(istTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(istTime.getUTCSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}/${month}/${year}, ${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm} (IST)`;
}

const statusLabel: Record<LeadRequest["status"], string> = {
  new: "New to BNI",
  visited: "Has visited a meeting",
  member: "BNI member",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readerEmail(lead: LeadRequest): { subject: string; html: string; text: string } {
  const firstName = escapeHtml(lead.name.trim().split(/\s+/)[0] || lead.name);
  const magazineUrl =
    process.env.RISE_MAGAZINE_URL || "https://rise.nmbts.co.in/magazine";
  const safeUrl = escapeHtml(magazineUrl);

  if (lead.action === "visit") {
    return {
      subject: "We received your RISE guest visit request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8ddd3; border-radius: 8px; overflow: hidden;">
          <div style="background: #6b1d2a; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px;">Guest visit request received</h1>
          </div>
          <div style="padding: 20px; background: #fffaf5; color: #2b211c;">
            <p>Hello ${firstName},</p>
            <p>Thanks for requesting a guest visit with BNI Navi Mumbai. The team will confirm the chapter, date and venue with you.</p>
          </div>
        </div>
      `,
      text: [
        `Hello ${lead.name.trim().split(/\s+/)[0] || lead.name},`,
        "Thanks for requesting a guest visit with BNI Navi Mumbai.",
        "The team will confirm the chapter, date and venue with you.",
      ].join("\n"),
    };
  }

  return {
    subject: "Your copy of RISE is ready",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8ddd3; border-radius: 8px; overflow: hidden;">
        <div style="background: #6b1d2a; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Your RISE copy</h1>
        </div>
        <div style="padding: 20px; background: #fffaf5; color: #2b211c;">
          <p>Hello ${firstName},</p>
          <p>Your copy of RISE, the BNI Navi Mumbai business magazine, is ready.</p>
          <p><a href="${safeUrl}" style="color:#6b1d2a;">Read the magazine</a></p>
          <p>You will also get it on WhatsApp.</p>
        </div>
      </div>
    `,
    text: [
      `Hello ${lead.name.trim().split(/\s+/)[0] || lead.name},`,
      "Your copy of RISE, the BNI Navi Mumbai business magazine, is ready.",
      magazineUrl,
      "You will also get it on WhatsApp.",
    ].join("\n"),
  };
}

export async function sendLeadEmail(lead: LeadRequest): Promise<boolean> {
  const { user, pass, receiver } = emailConfig();
  if (!user || !pass || !receiver) {
    console.warn("[Email] Missing EMAIL_USER / EMAIL_APP_PASSWORD / EMAIL_RECEIVER");
    return false;
  }

  const indianTime = getIndianTime();
  const phone = `+91${lead.phone}`;
  const actionLabel =
    lead.action === "visit"
      ? "Guest visit request"
      : lead.action === "resend"
        ? "Magazine resend"
        : "Magazine subscribe";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const attribution = Object.entries(lead.attribution || {})
    .filter(([, value]) => value)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join("");

  const reader = readerEmail(lead);
  const from = `"RISE Magazine — BNI Navi Mumbai" <${user}>`;
  let teamSent = false;
  let readerSent = false;

  try {
    await transporter.sendMail({
      from,
      to: receiver,
      replyTo: lead.email,
      subject: `RISE lead · ${actionLabel} · ${lead.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8ddd3; border-radius: 8px; overflow: hidden;">
          <div style="background: #6b1d2a; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px;">New RISE Lead</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">${actionLabel}</p>
          </div>
          <div style="padding: 20px; background: #fffaf5;">
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>WhatsApp:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Business:</strong> ${lead.biz || "—"}</p>
            <p><strong>Area:</strong> ${lead.area || "—"}</p>
            <p><strong>BNI status:</strong> ${statusLabel[lead.status]}</p>
            <p><strong>Action:</strong> ${lead.action}</p>
            <h3 style="color:#6b1d2a;margin-top:20px;">Location</h3>
            <p><strong>Location:</strong> ${lead.geo.userLocation || "Unknown"}</p>
            <p><strong>Pincode:</strong> ${lead.geo.userPincode || "Unknown"}</p>
            <p><strong>IP:</strong> ${lead.geo.userIp || "Unknown"}</p>
            ${
              attribution
                ? `<h3 style="color:#6b1d2a;margin-top:20px;">Attribution</h3><ul>${attribution}</ul>`
                : ""
            }
          </div>
          <div style="background: #f3ebe3; padding: 14px; text-align: center; font-size: 12px; color: #6b5a52;">
            Submitted at <strong>${indianTime}</strong>
          </div>
        </div>
      `,
      text: [
        `New RISE lead (${actionLabel})`,
        `Name: ${lead.name}`,
        `WhatsApp: ${phone}`,
        `Email: ${lead.email}`,
        `Business: ${lead.biz || "—"}`,
        `Area: ${lead.area || "—"}`,
        `BNI status: ${statusLabel[lead.status]}`,
        `Action: ${lead.action}`,
        `Submitted: ${indianTime}`,
      ].join("\n"),
    });
    teamSent = true;
  } catch (error) {
    console.error(
      "[Email] Team send failed:",
      error instanceof Error ? error.message : error,
    );
  }

  try {
    await transporter.sendMail({
      from,
      to: lead.email,
      subject: reader.subject,
      html: reader.html,
      text: reader.text,
    });
    readerSent = true;
  } catch (error) {
    console.error(
      "[Email] Reader send failed:",
      error instanceof Error ? error.message : error,
    );
  }

  return teamSent || readerSent;
}
