"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Dialog } from "./Dialog";
import { NAVI_MUMBAI_AREAS } from "./LeadForm";
import type { FormData } from "../types";
export function GuestVisitModal({
  isOpen,
  onClose,
  formData,
}: {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
}) {
  const [area, setArea] = useState(formData.area || "");
  const [state, setState] = useState<"idle" | "sending" | "preview" | "sent">(
    "idle",
  );
  const [error, setError] = useState("");
  async function requestVisit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
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
        /* optional */
      }
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          area,
          action: "visit",
          attribution,
          geo,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Your request could not be sent. Please try again.",
        );
      setState(result.preview ? "preview" : "sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
      setState("idle");
    }
  }
  return (
    <Dialog open={isOpen} onClose={onClose} titleId="visit-title">
      <div className="dialog-content">
        {state === "sent" || state === "preview" ? (
          <>
            <CheckCircle2 size={40} className="success-icon" />
            <p className="eyebrow">YOUR NEXT CONVERSATION</p>
            <h2 id="visit-title">
              {state === "preview"
                ? "Visit request preview."
                : "Let’s find your chapter."}
            </h2>
            <p>
              {state === "preview"
                ? "This is a design preview. No visit has been booked and no message has been sent."
                : "Your interest has been sent to the BNI team. A visitor host will contact you to confirm a chapter, date and venue."}
            </p>
            <p>
              Preferred area: <strong>{area}</strong>
            </p>
            <button className="btn-primary" onClick={onClose}>
              Back to RISE
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">COME AS A GUEST</p>
            <h2 id="visit-title">
              Meet the people.
              <br />
              <em>See the possibility.</em>
            </h2>
            <p>
              Visit one of 17 chapters across Navi Mumbai. Tell us your
              preferred area and the team will help find the right meeting for
              you.
            </p>
            <form onSubmit={requestVisit}>
              <label htmlFor="visit-area">Where would you like to visit?</label>
              <select
                id="visit-area"
                className="field"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="">Choose your area</option>
                {NAVI_MUMBAI_AREAS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <p className="visit-contact">
                We’ll use your WhatsApp number ending in{" "}
                {formData.phone.slice(-4)} to follow up. A visit is confirmed
                only when the BNI team contacts you.
              </p>
              {error && (
                <p role="alert" className="field-error">
                  {error}
                </p>
              )}
              <button className="btn-primary" disabled={state === "sending"}>
                {state === "sending" ? (
                  <LoaderCircle size={18} className="spin" />
                ) : (
                  <ArrowRight size={18} />
                )}
                {state === "sending"
                  ? "Sending request…"
                  : "Request a guest visit"}
              </button>
            </form>
          </>
        )}
      </div>
    </Dialog>
  );
}
