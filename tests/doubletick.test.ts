import test from "node:test";
import assert from "node:assert/strict";
import {
  buildTemplateMessage,
  sendWhatsApp,
  DeliveryError,
} from "../lib/doubletick.ts";
import type { LeadRequest } from "../lib/leads.ts";

const lead: LeadRequest = {
  name: "Test Reader",
  phone: "9876543210",
  email: "reader@example.com",
  biz: "Design",
  area: "Vashi",
  status: "new",
  consent: true,
  action: "subscribe",
  attribution: { src: "qr" },
  geo: {
    userLocation: "",
    city: "",
    region: "",
    country: "",
    userPincode: "",
    userIp: "",
    pageUrl: "",
  },
};
const env = {
  DOUBLETICK_API_KEY: "test-secret",
  DOUBLETICK_FROM: "919876543211",
  DOUBLETICK_TEMPLATE_NAME: "rise_delivery",
  DOUBLETICK_TEMPLATE_LANGUAGE: "en",
  RISE_MAGAZINE_URL: "https://example.com/rise.pdf",
  DOUBLETICK_TEMPLATE_DATA_JSON: JSON.stringify({
    header: {
      type: "DOCUMENT",
      mediaUrl: "{{magazineUrl}}",
      filename: "RISE.pdf",
    },
    body: { placeholders: ["{{firstName}}"] },
    buttons: [{ type: "URL", parameter: "{{magazineUrl}}" }],
  }),
};

test("builds a provider template with consent and attribution, without credentials", () => {
  const payload = buildTemplateMessage(lead, env);
  const message = payload.messages[0];
  assert.equal(message.from, "+919876543211");
  assert.equal(message.to, "+919876543210");
  assert.deepEqual(message.content.templateData.body, {
    placeholders: ["Test"],
  });
  assert.equal(
    message.content.templateData.header?.mediaUrl,
    env.RISE_MAGAZINE_URL,
  );
  const metadata: Record<string, string> = message.customData;
  assert.equal(metadata.src, "qr");
  assert.equal(message.customData.consent, "true");
  assert.match(message.messageId, /^[0-9a-f-]{36}$/);
  assert.ok(!JSON.stringify(payload).includes(env.DOUBLETICK_API_KEY));
});

test("uses the raw key only in the server authorization header", async () => {
  let calls = 0;
  const mock: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(url, "https://public.doubletick.io/whatsapp/message/template");
    assert.equal(
      new Headers(init?.headers).get("Authorization"),
      env.DOUBLETICK_API_KEY,
    );
    assert.equal(init?.redirect, "error");
    assert.ok(!String(init?.body).includes(env.DOUBLETICK_API_KEY));
    return Response.json({ status: "SENT" }, { status: 201 });
  };
  assert.ok((await sendWhatsApp(lead, env, mock)).messageId);
  assert.equal(calls, 1);
});

test("rejects incomplete or unsafe configuration before sending", async () => {
  const mock: typeof fetch = async () => {
    throw new Error("Network must not be called");
  };
  for (const change of [
    { DOUBLETICK_FROM: "bad" },
    { DOUBLETICK_API_KEY: "" },
    { RISE_MAGAZINE_URL: "http://example.com/rise.pdf" },
    {
      DOUBLETICK_TEMPLATE_DATA_JSON:
        '{"body":{"placeholders":["{{unknown}}"]}}',
    },
  ]) {
    await assert.rejects(
      sendWhatsApp(lead, { ...env, ...change }, mock),
      (e: unknown) => e instanceof DeliveryError && e.code === "configuration",
    );
  }
});

test("does not expose provider permission errors or accept ambiguous responses", async () => {
  for (const status of [401, 403, 500]) {
    const mock: typeof fetch = async () =>
      Response.json({ reason: "private account data" }, { status });
    await assert.rejects(
      sendWhatsApp(lead, env, mock),
      (e: unknown) =>
        e instanceof DeliveryError &&
        e.code === (status === 500 ? "upstream" : "permission") &&
        !e.message.includes("private"),
    );
  }
  const mock: typeof fetch = async () => Response.json({});
  await assert.rejects(sendWhatsApp(lead, env, mock), DeliveryError);
});

