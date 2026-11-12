"use client";
import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowDown, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type {
  DeliveryResult,
  FormData,
  FormErrors,
  SpreadDetail,
} from "../types";
import { validateLead } from "../lib/validation";
import { Navbar } from "./Navbar";
import { MagazineCover3D } from "./MagazineCover3D";
import { LeadForm } from "./LeadForm";
import { SpreadExplorer, MAGAZINE_SPREADS } from "./SpreadExplorer";
import { SpreadModal } from "./SpreadModal";
import { Footer } from "./Footer";
import { ThankYouView } from "./ThankYouView";
import { StickyMobileBar } from "./StickyMobileBar";
import { PrivacyModal } from "./PrivacyModal";

export default function RiseExperience({
  metrics,
  children,
}: {
  metrics: ReactNode;
  children: ReactNode;
}) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    biz: "",
    area: "",
    status: "new",
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [emailAccepted, setEmailAccepted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [spread, setSpread] = useState<SpreadDetail | null>(null);
  const [sticky, setSticky] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [toast, setToast] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) {
      successRef.current?.focus({ preventScroll: true });
      return;
    }
    const form = formRef.current;
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setSticky(
          !entry.isIntersecting && entry.boundingClientRect.bottom < 80,
        ),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, [submitted]);
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("book") !== "visit") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: reduce ? "instant" : "smooth",
        block: "start",
      });
      formRef.current?.focus({ preventScroll: true });
    });
  }, []);

  function scrollToForm() {
    // Focus the card first so a phone's keyboard does not obscure the destination.
    formRef.current?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  function editDetails() {
    setSubmitted(false);
    setSticky(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      document.getElementById("f-name")?.focus({ preventScroll: true }),
    );
  }
  async function send(action: "subscribe" | "resend") {
    const params = new URLSearchParams(window.location.search);
    const attribution = Object.fromEntries(
      [
        "src",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ].map((key) => [key, params.get(key)?.slice(0, 200) || ""]),
    );
    let geo = {
      userLocation: "",
      city: "",
      region: "",
      country: "",
      userPincode: "",
      userIp: "",
      pageUrl: window.location.href,
    };
    try {
      const geoRes = await fetch("https://ipapi.co/json/");
      if (geoRes.ok) {
        const g = (await geoRes.json()) as Record<string, string>;
        geo = {
          userLocation: [g.city, g.region, g.country_name || g.country]
            .filter(Boolean)
            .join(", "),
          city: g.city || "",
          region: g.region || "",
          country: g.country_name || g.country || "",
          userPincode: g.postal || "",
          userIp: g.ip || "",
          pageUrl: window.location.href,
        };
      }
    } catch {
      /* geo is optional */
    }
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        action,
        attribution,
        geo,
      }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error || "Your request could not be sent. Please try again.",
      );
    return data as DeliveryResult;
  }
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    const nextErrors = validateLead(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    setIsSubmitting(true);
    setSubmissionError("");
    try {
      const result = await send("subscribe");
      setPreview(result.preview);
      setEmailAccepted(result.delivery.email === "accepted");
      setSubmitted(true);
      setCooldown(60);
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (err) {
      setSubmissionError(
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  async function resend() {
    if (cooldown || resending) return;
    setResending(true);
    try {
      const result = await send("resend");
      setToast(
        result.preview
          ? "Preview only. No message has been sent."
          : result.delivery.email === "accepted"
            ? "Your resend request was received. Check WhatsApp and email shortly."
            : "Your resend request was received. Check WhatsApp shortly.",
      );
      setCooldown(60);
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setResending(false);
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar
        onScrollToForm={scrollToForm}
        isSubmitted={submitted}
        onEditDetails={editDetails}
      />
      <main id="main">
        {submitted ? (
          <div ref={successRef} tabIndex={-1}>
            <ThankYouView
              formData={formData}
              preview={preview}
              emailAccepted={emailAccepted}
              onEditDetails={editDetails}
              resendCooldown={cooldown}
              onResend={resend}
              isResending={resending}
            />
          </div>
        ) : (
          <>
            <section className="hero">
              <div className="container-custom hero-grid">
                <div className="hero-copy">
                  <div className="issue-label">
                    <span />
                    12TH ANNIVERSARY EDITION
                  </div>
                  <h1>
                    A city on the rise.
                    <em>Your business, next.</em>
                  </h1>
                  <p className="hero-description">
                    <span className="hero-description-desktop">
                      The business story of Navi Mumbai, told by the people
                      building it. 48 pages of local ideas, connections and
                      possibility.
                    </span>
                    <span className="hero-description-mobile">
                      Meet the people and ideas moving Navi Mumbai forward. Your
                      next opportunity could be inside.
                    </span>
                  </p>
                  <div className="hero-value">
                    <span />
                    Free digital edition. No membership needed.
                  </div>
                  <MagazineCover3D
                    onOpenPreview={() => setSpread(MAGAZINE_SPREADS[0])}
                  />
                  <div className="mobile-hero-action">
                    <button className="btn-ivory" onClick={scrollToForm}>
                      Get my free copy
                      <ArrowUpRight size={19} />
                    </button>
                    <p>On WhatsApp & email · No membership needed</p>
                  </div>
                </div>
                <LeadForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  formRef={formRef}
                  onOpenPrivacyModal={() => setPrivacy(true)}
                  submissionError={submissionError}
                />
                <a className="hero-scroll" href="#inside">
                  <ArrowDown size={14} />
                  THERE’S A WHOLE CITY INSIDE
                </a>
              </div>
            </section>
            {metrics}
            <SpreadExplorer onSelectSpread={setSpread} />
            {children}
          </>
        )}
      </main>
      <Footer
        isSubmitted={submitted}
        onOpenPrivacyModal={() => setPrivacy(true)}
      />
      <SpreadModal
        spread={spread}
        onClose={() => setSpread(null)}
        onSelectSpread={setSpread}
        onDownloadClick={() => {
          setSpread(null);
          requestAnimationFrame(scrollToForm);
        }}
      />
      <PrivacyModal isOpen={privacy} onClose={() => setPrivacy(false)} />
      {!submitted && (
        <StickyMobileBar show={sticky} onScrollToForm={scrollToForm} />
      )}
      {toast && (
        <div role="status" className="toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </>
  );
}
