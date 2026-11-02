/**
 * Read-only-ish smoke test: verifies Gmail SMTP auth and optionally sends one test mail.
 * Usage: node --env-file-if-exists=.env.local scripts/check-email.mjs
 */
import nodemailer from "nodemailer";

const user = process.env.EMAIL_USER || process.env.NEXT_PUBLIC_EMAIL_USER || "";
const pass =
  process.env.EMAIL_APP_PASSWORD ||
  process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD ||
  process.env.NEXT_PUBLIC_EMAIL_APP_PASS ||
  "";
const receiver =
  process.env.EMAIL_RECEIVER ||
  process.env.NEXT_PUBLIC_EMAIL_RECEIVER ||
  user;

if (!user || !pass) {
  console.error("Missing EMAIL_USER or EMAIL_APP_PASSWORD in .env.local");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

try {
  await transporter.verify();
  console.log("SMTP OK for", user);

  const info = await transporter.sendMail({
    from: `"RISE Magazine test" <${user}>`,
    to: receiver,
    subject: "RISE magazine — email pipeline test",
    text: `Smoke test from magzine-nmbts at ${new Date().toISOString()}`,
  });
  console.log("Test mail sent to", receiver, "· messageId:", info.messageId);
} catch (error) {
  console.error("Email check failed:", error?.message || error);
  process.exit(1);
}
