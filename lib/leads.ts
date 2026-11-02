import type { FormData } from "../types";
import { validateLead } from "./validation.ts";

export const ATTRIBUTION_KEYS = [
  "src",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
export type LeadAction = "subscribe" | "resend" | "visit";
export interface LeadGeo {
  userLocation: string;
  city: string;
  region: string;
  country: string;
  userPincode: string;
  userIp: string;
  pageUrl: string;
}
export interface LeadRequest extends FormData {
  action: LeadAction;
  attribution: Record<string, string>;
  geo: LeadGeo;
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function parseLead(value: unknown): LeadRequest | null {
  if (!isRecord(value)) return null;
  const { name, phone, email, biz, area, status, consent, action } = value;
  if (
    typeof name !== "string" ||
    name.length > 100 ||
    typeof phone !== "string" ||
    typeof email !== "string" ||
    email.length > 254 ||
    (biz !== undefined && (typeof biz !== "string" || biz.length > 150)) ||
    (area !== undefined && (typeof area !== "string" || area.length > 100)) ||
    typeof status !== "string" ||
    !["new", "visited", "member"].includes(status) ||
    typeof action !== "string" ||
    !["subscribe", "resend", "visit"].includes(action) ||
    consent !== true
  )
    return null;
  const geoSource = isRecord(value.geo) ? value.geo : value;
  const str = (key: string, max = 200) =>
    typeof geoSource[key] === "string"
      ? (geoSource[key] as string).trim().slice(0, max)
      : "";
  const data: LeadRequest = {
    name: name.trim(),
    phone,
    email: email.trim(),
    biz: typeof biz === "string" ? biz.trim() : "",
    area: typeof area === "string" ? area.trim() : "",
    status: status as FormData["status"],
    consent,
    action: action as LeadAction,
    attribution: Object.fromEntries(
      ATTRIBUTION_KEYS.map((key) => [
        key,
        isRecord(value.attribution) &&
        typeof value.attribution[key] === "string"
          ? value.attribution[key].slice(0, 200)
          : "",
      ]),
    ),
    geo: {
      userLocation: str("userLocation", 200),
      city: str("city", 100),
      region: str("region", 100),
      country: str("country", 100),
      userPincode: str("userPincode", 20) || str("pincode", 20),
      userIp: str("userIp", 64) || str("ip", 64),
      pageUrl: str("pageUrl", 500),
    },
  };
  return Object.keys(validateLead(data)).length ||
    (action === "visit" && !data.area)
    ? null
    : data;
}
