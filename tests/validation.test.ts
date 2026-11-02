import test from "node:test";
import assert from "node:assert/strict";
import { parseLead } from "../lib/leads.ts";
import { validateContact, validateLead } from "../lib/validation.ts";

export const lead = {
  name: " Test Reader ",
  phone: "9876543210",
  email: " reader@example.com ",
  biz: "Design",
  area: "Vashi",
  status: "new" as const,
  consent: true,
  action: "subscribe" as const,
  attribution: { src: "qr", extra: "drop", utm_campaign: "a".repeat(250) },
};

test("normalizes details and limits campaign attribution", () => {
  const parsed = parseLead(lead)!;
  assert.equal(parsed.name, "Test Reader");
  assert.equal(parsed.email, "reader@example.com");
  assert.equal(parsed.attribution.src, "qr");
  assert.equal(parsed.attribution.utm_campaign.length, 200);
  assert.equal(parsed.attribution.extra, undefined);
});

test("rejects absent consent, malformed contacts and invalid action types", () => {
  for (const change of [
    { consent: false },
    { consent: "true" },
    { phone: "1234567890" },
    { phone: 9876543210 },
    { email: "invalid" },
    { name: " " },
    { status: ["new"] },
    { action: ["subscribe"] },
    { action: "delete" },
    { biz: "a".repeat(151) },
  ]) {
    assert.equal(parseLead({ ...lead, ...change }), null);
  }
  assert.equal(parseLead(null), null);
});

test("guest requests need an area; optional business details remain optional", () => {
  assert.equal(parseLead({ ...lead, action: "visit", area: "" }), null);
  assert.ok(parseLead({ ...lead, biz: undefined, area: undefined }));
});

test("first-step validation excludes consent; final validation requires it", () => {
  assert.deepEqual(validateContact(lead), {});
  assert.ok(validateLead({ ...lead, consent: false }).consent);
});
