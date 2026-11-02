import "server-only";
import { randomUUID } from "node:crypto";
import { isRecord, type LeadRequest } from "./leads.ts";

const TEMPLATE_ENDPOINT =
  "https://public.doubletick.io/whatsapp/message/template";
type Environment = Record<string, string | undefined>;
interface TemplateData {
  header?: {
    type: "TEXT" | "IMAGE" | "DOCUMENT" | "VIDEO";
    placeholder?: string;
    mediaUrl?: string;
    filename?: string;
  };
  body?: { placeholders: string[] };
  buttons?: { type: "URL"; parameter?: string }[];
}
export class DeliveryError extends Error {
  readonly code: "configuration" | "permission" | "upstream" | "timeout";
  constructor(code: DeliveryError["code"]) {
    super("Message delivery is unavailable.");
    this.name = "DeliveryError";
    this.code = code;
  }
}
function required(env: Environment, key: string): string {
  const value = env[key]?.trim();
  if (!value) throw new DeliveryError("configuration");
  return value;
}
function publicUrl(value: string): string {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.hostname === "localhost"
    )
      throw new Error();
    return url.toString();
  } catch {
    throw new DeliveryError("configuration");
  }
}
function templateData(env: Environment, lead: LeadRequest): TemplateData {
  let source: unknown;
  try {
    source = JSON.parse(required(env, "DOUBLETICK_TEMPLATE_DATA_JSON"));
  } catch {
    throw new DeliveryError("configuration");
  }
  if (
    !isRecord(source) ||
    Object.keys(source).some(
      (key) => !["body", "header", "buttons"].includes(key),
    )
  )
    throw new DeliveryError("configuration");
  const values: Record<string, string> = {
    firstName: lead.name.split(/\s+/)[0],
    fullName: lead.name,
    magazineUrl: publicUrl(required(env, "RISE_MAGAZINE_URL")),
    visitUrl: env.RISE_VISIT_URL ? publicUrl(env.RISE_VISIT_URL) : "",
    coverUrl: env.RISE_COVER_URL ? publicUrl(env.RISE_COVER_URL) : "",
  };
  function expand(value: unknown): string {
    if (typeof value !== "string") throw new DeliveryError("configuration");
    return value.replace(/\{\{(\w+)\}\}/g, (_token, key: string) => {
      if (!Object.hasOwn(values, key) || !values[key])
        throw new DeliveryError("configuration");
      return values[key];
    });
  }
  const result: TemplateData = {};
  if (source.body !== undefined) {
    if (!isRecord(source.body) || !Array.isArray(source.body.placeholders))
      throw new DeliveryError("configuration");
    result.body = { placeholders: source.body.placeholders.map(expand) };
  }
  if (source.header !== undefined) {
    if (
      !isRecord(source.header) ||
      !["TEXT", "IMAGE", "DOCUMENT", "VIDEO"].includes(
        String(source.header.type),
      )
    )
      throw new DeliveryError("configuration");
    const type = source.header.type as NonNullable<
      TemplateData["header"]
    >["type"];
    result.header =
      type === "TEXT"
        ? { type, placeholder: expand(source.header.placeholder) }
        : {
            type,
            mediaUrl: publicUrl(expand(source.header.mediaUrl)),
            ...(source.header.filename
              ? { filename: expand(source.header.filename) }
              : {}),
          };
  }
  if (source.buttons !== undefined) {
    if (!Array.isArray(source.buttons))
      throw new DeliveryError("configuration");
    result.buttons = source.buttons.map((button) => {
      if (!isRecord(button) || button.type !== "URL")
        throw new DeliveryError("configuration");
      return {
        type: "URL",
        ...(button.parameter !== undefined
          ? { parameter: expand(button.parameter) }
          : {}),
      };
    });
  }
  return result;
}
export function buildTemplateMessage(
  lead: LeadRequest,
  env: Environment = process.env,
) {
  const from = required(env, "DOUBLETICK_FROM");
  const templateName = required(env, "DOUBLETICK_TEMPLATE_NAME");
  const language = env.DOUBLETICK_TEMPLATE_LANGUAGE?.trim() || "en";
  if (
    !/^\+?[1-9]\d{9,14}$/.test(from) ||
    !/^[a-z0-9_]{1,512}$/.test(templateName) ||
    !/^[a-z]{2,3}(_[A-Z]{2})?$/.test(language)
  )
    throw new DeliveryError("configuration");
  return {
    messages: [
      {
        from: from.startsWith("+") ? from : "+" + from,
        to: "+91" + lead.phone,
        messageId: randomUUID(),
        content: {
          templateName,
          language,
          templateData: templateData(env, lead),
        },
        customData: {
          source: "rise_magazine",
          action: lead.action,
          name: lead.name,
          email: lead.email,
          business: lead.biz,
          area: lead.area,
          bniStatus: lead.status,
          consent: "true",
          consentVersion: "rise-diwali-2026-v1",
          requestedAt: new Date().toISOString(),
          ...lead.attribution,
        },
      },
    ],
  };
}
export async function sendWhatsApp(
  lead: LeadRequest,
  env: Environment = process.env,
  request: typeof fetch = fetch,
) {
  const apiKey = required(env, "DOUBLETICK_API_KEY");
  const payload = buildTemplateMessage(lead, env);
  try {
    const response = await request(TEMPLATE_ENDPOINT, {
      method: "POST",
      headers: { Authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (response.status === 401 || response.status === 403)
      throw new DeliveryError("permission");
    if (!response.ok) throw new DeliveryError("upstream");
    const result: unknown = await response.json();
    if (
      !isRecord(result) ||
      result.error ||
      typeof result.status !== "string" ||
      !["SENT", "ACCEPTED", "QUEUED"].includes(result.status)
    )
      throw new DeliveryError("upstream");
    return { messageId: payload.messages[0].messageId };
  } catch (error) {
    if (error instanceof DeliveryError) throw error;
    throw new DeliveryError(
      error instanceof Error && error.name === "TimeoutError"
        ? "timeout"
        : "upstream",
    );
  }
}
