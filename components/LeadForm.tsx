"use client";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
} from "lucide-react";
import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import { useState } from "react";
import { validateContact } from "../lib/validation";
import type { FormData, FormErrors } from "../types";
interface LeadFormProps {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  errors: FormErrors;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
  formRef: RefObject<HTMLDivElement | null>;
  onOpenPrivacyModal: () => void;
  submissionError?: string;
}
export const NAVI_MUMBAI_AREAS = [
  "Vashi",
  "Sanpada",
  "Nerul",
  "Seawoods",
  "CBD Belapur",
  "Kharghar",
  "Kamothe",
  "Panvel",
  "Ulwe",
  "Airoli",
  "Ghansoli",
  "Koparkhairane",
  "Taloja",
  "Outside Navi Mumbai",
];
export function LeadForm({
  formData,
  setFormData,
  errors,
  setErrors,
  isSubmitting,
  onSubmit,
  formRef,
  onOpenPrivacyModal,
  submissionError,
}: LeadFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  function changeStep(next: 1 | 2) {
    setStep(next);
    requestAnimationFrame(() => {
      const heading = document.getElementById("form-step-title");
      heading?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 700px)").matches) {
        formRef.current?.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      }
    });
  }
  function handleStepSubmit(event: FormEvent) {
    if (step === 2) {
      onSubmit(event);
      return;
    }
    event.preventDefault();
    const contactErrors = validateContact(formData);
    setErrors(contactErrors);
    if (Object.keys(contactErrors).length) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    changeStep(2);
  }
  const change = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  const error = (field: keyof FormErrors) =>
    errors[field] ? (
      <p className="field-error" id={"error-" + field}>
        {errors[field]}
      </p>
    ) : null;
  return (
    <div
      ref={formRef}
      id="get-rise"
      className="lead-card"
      tabIndex={-1}
      aria-labelledby="form-title"
    >
      <div className="form-heading">
        <span className="eyebrow">THE NEXT CHAPTER IS YOURS</span>
        <span className="free-label">100% FREE</span>
        <h2 id="form-title">Get your free copy.</h2>
        <p>48 pages. On WhatsApp & email. All yours.</p>
      </div>
      <div className="form-progress" aria-label={`Step ${step} of 2`}>
        <button
          type="button"
          onClick={() => changeStep(1)}
          aria-current={step === 1 ? "step" : undefined}
        >
          <span>{step === 2 ? <Check size={12} /> : "1"}</span>Your details
        </button>
        <span className="progress-connector" />
        <span
          className={step === 2 ? "current" : ""}
          aria-current={step === 2 ? "step" : undefined}
        >
          <span>2</span>A little about you
        </span>
      </div>
      <form onSubmit={handleStepSubmit} noValidate>
        <p
          id="form-step-title"
          className="sr-only"
          tabIndex={-1}
          aria-live="polite"
        >
          Step {step} of 2:{" "}
          {step === 1 ? "Your contact details" : "A little about you"}
        </p>
        <div className="form-fields">
          <div className="form-step" hidden={step !== 1}>
            <div>
              <label htmlFor="f-name">
                Full name <span>*</span>
              </label>
              <input
                className="field"
                id="f-name"
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => change("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "error-name" : undefined}
              />
              {error("name")}
            </div>
            <div>
              <label htmlFor="f-phone">
                WhatsApp number <span>*</span>
              </label>
              <div className="phone-field">
                <span>+91</span>
                <input
                  className="field"
                  id="f-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  required
                  placeholder="Your 10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => {
                    let digits = e.target.value.replace(/\D/g, "");
                    if (digits.length === 12 && digits.startsWith("91"))
                      digits = digits.slice(2);
                    change("phone", digits.slice(0, 10));
                  }}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "error-phone" : undefined}
                />
              </div>
              {error("phone")}
            </div>
            <div>
              <label htmlFor="f-email">
                Email address <span>*</span>
              </label>
              <input
                className="field"
                id="f-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@business.com"
                value={formData.email}
                onChange={(e) => change("email", e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "error-email" : undefined}
              />
              {error("email")}
            </div>
          </div>
          <div className="form-step" hidden={step !== 2}>
            <div className="contact-summary">
              <Check size={14} />
              <span>
                {formData.name.split(" ")[0]} · +91 ••••••
                {formData.phone.slice(-4)}
              </span>
              <button
                type="button"
                onClick={() => {
                  changeStep(1);
                }}
              >
                Edit
              </button>
            </div>
            <div className="form-pair">
              <div>
                <label htmlFor="f-biz">
                  Your business <small>Optional</small>
                </label>
                <input
                  className="field"
                  id="f-biz"
                  name="business"
                  maxLength={150}
                  placeholder="e.g. Interiors, IT"
                  value={formData.biz}
                  onChange={(e) => change("biz", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="f-area">
                  Your area <small>Optional</small>
                </label>
                <select
                  className="field"
                  id="f-area"
                  name="area"
                  value={formData.area}
                  onChange={(e) => change("area", e.target.value)}
                >
                  <option value="">Select area</option>
                  {NAVI_MUMBAI_AREAS.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
            <fieldset className="meeting-options">
              <legend>Have you been to a BNI meeting?</legend>
              <div>
                {(
                  [
                    { id: "new", label: "Never" },
                    { id: "visited", label: "Once or twice" },
                    { id: "member", label: "I’m a member" },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.id}
                    className={formData.status === option.id ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="bni-status"
                      value={option.id}
                      checked={formData.status === option.id}
                      onChange={() => change("status", option.id)}
                    />
                    {formData.status === option.id && <Check size={12} />}
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label className="consent-label" htmlFor="f-consent">
                <input
                  id="f-consent"
                  type="checkbox"
                  required
                  checked={formData.consent}
                  onChange={(e) => change("consent", e.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={
                    errors.consent ? "error-consent" : undefined
                  }
                />
                <span>
                  Send me RISE on WhatsApp and email, plus BNI Navi Mumbai
                  meeting and event invites. I can reply <b>STOP</b> anytime.
                </span>
              </label>
              {error("consent")}
            </div>
          </div>
        </div>
        {submissionError && (
          <p role="alert" className="submission-error">
            {submissionError}
          </p>
        )}
        <div className="form-actions">
          {step === 2 && (
            <button
              type="button"
              className="form-back"
              onClick={() => changeStep(1)}
              aria-label="Back to your details"
            >
              <ArrowLeft size={17} />
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary form-submit"
          >
            {isSubmitting ? (
              <LoaderCircle className="spin" size={18} />
            ) : step === 2 ? (
              <MessageCircle size={18} />
            ) : null}
            <span>
              {isSubmitting
                ? "Sending your request…"
                : step === 1
                  ? "Continue"
                  : "Send me RISE"}
            </span>
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </div>
        <p className="form-reassurance">
          {step === 1
            ? "Just one more step. No payment, ever."
            : "Free digital copy · No membership needed"}
        </p>
        <div className="privacy-note">
          <LockKeyhole size={12} />
          <span>
            Your details stay with BNI Navi Mumbai.{" "}
            <button type="button" onClick={onOpenPrivacyModal}>
              Privacy policy
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}
