/**
 * Sends ONE real WhatsApp using the approved RISE template.
 * Refuses to run until TEST_WHATSAPP_TO is your own 10-digit number.
 *
 *   $env:TEST_WHATSAPP_TO="98xxxxxxxx"; npm run whatsapp:test
 */
import { sendWhatsApp } from "../lib/doubletick.ts";

const digits = (process.env.TEST_WHATSAPP_TO || "").replace(/\D/g, "");
const phone =
  digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;

if (!/^[6-9]\d{9}$/.test(phone)) {
  console.log("No test message sent.");
  console.log("Set TEST_WHATSAPP_TO to the 10-digit WhatsApp that should receive it.");
  process.exit(0);
}

const result = await sendWhatsApp({
  name: "Test Reader",
  phone,
  email: "team.bnipankaj@gmail.com",
  biz: "Template test",
  area: "Vashi",
  status: "new",
  consent: true,
  action: "subscribe",
  attribution: { src: "whatsapp-test" },
  geo: {
    userLocation: "",
    city: "",
    region: "",
    country: "",
    userPincode: "",
    userIp: "",
    pageUrl: "https://magzine-nmbts.vercel.app/",
  },
});

console.log("WhatsApp accepted for +91" + phone + ". messageId: " + result.messageId);
