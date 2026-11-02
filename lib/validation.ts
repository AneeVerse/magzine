import type { FormData, FormErrors } from "../types";

export function validateContact(
  data: Pick<FormData, "name" | "phone" | "email">,
): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Please enter your full name.";
  if (!/^[6-9]\d{9}$/.test(data.phone))
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()))
    errors.email = "Please enter a valid email address.";
  return errors;
}

export function validateLead(data: FormData): FormErrors {
  return {
    ...validateContact(data),
    ...(!data.consent
      ? { consent: "Please tick the box so we can send you RISE." }
      : {}),
  };
}
