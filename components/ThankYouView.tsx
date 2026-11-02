"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  Copy,
  Mail,
  MessageCircle,
  RefreshCw,
  UsersRound,
  Smartphone,
} from "lucide-react";
import type { FormData } from "../types";
import { GuestVisitModal } from "./GuestVisitModal";
import { EventSection } from "./EventSection";
interface Props {
  formData: FormData;
  preview: boolean;
  emailAccepted: boolean;
  onEditDetails: () => void;
  resendCooldown: number;
  onResend: () => void;
  isResending: boolean;
}
export function ThankYouView({
  formData,
  preview,
  emailAccepted,
  onEditDetails,
  resendCooldown,
  onResend,
  isResending,
}: Props) {
  const [guest, setGuest] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const firstName = formData.name.trim().split(/\s+/)[0];
  function shareUrl() {
    return window.location.origin + "/?src=reader_share";
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setCopyError("");
    } catch {
      setCopyError("Copy this link: " + shareUrl());
    }
  }
  function shareWhatsApp() {
    const message =
      "Navi Mumbai finally has its own business magazine. Get your free copy of BNI RISE — 48 pages of local stories and new possibilities. " +
      shareUrl();
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(message),
      "_blank",
      "noopener,noreferrer",
    );
  }
  return (
    <div className="thank-you-view">
      <section className="thank-you-hero">
        <div className="container-custom">
          <span className="success-seal">
            <CheckCheck size={30} strokeWidth={1.5} />
          </span>
          <p className="eyebrow">
            {preview ? "DESIGN PREVIEW" : "WELCOME TO THE RISE COMMUNITY"}
          </p>
          <h1>
            {preview ? "Looking good, " : "You’re in, "}
            <em>{firstName}.</em>
          </h1>
          <p>
            {preview
              ? "Your form is complete. Explore what happens next."
              : emailAccepted
                ? "Your copy of RISE has been requested. Check WhatsApp and email shortly."
                : "Your copy of RISE has been requested. Check WhatsApp shortly."}
          </p>
          {preview && (
            <div className="preview-banner">
              Preview mode: delivery is not connected yet. No message has been
              sent and your details have not been saved.
            </div>
          )}
          <div className="delivery-destinations">
            <span>
              <MessageCircle size={16} />
              +91 {formData.phone}
            </span>
            {(preview || emailAccepted) && (
              <span>
                <Mail size={16} />
                {formData.email}
              </span>
            )}
            <button className="text-link" onClick={onEditDetails}>
              Edit details
            </button>
          </div>
        </div>
      </section>
      <section className="delivery-section">
        <div className="container-custom">
          <div className="delivery-heading">
            <div>
              <p className="eyebrow">A LITTLE READING. A LOT OF POSSIBILITY.</p>
              <h2>
                Your next <em>three steps.</em>
              </h2>
            </div>
            <button
              className="text-link"
              onClick={() => setShowMessage(!showMessage)}
              aria-expanded={showMessage}
            >
              {showMessage ? "Hide message preview" : "See the message preview"}
              <ArrowUpRight size={15} />
            </button>
          </div>
          {showMessage && (
            <div className="message-preview">
              <div className="message-app">
                <span>BNI</span>
                <strong>
                  BNI Navi Mumbai<small>WhatsApp message preview</small>
                </strong>
              </div>
              <div className="message-body">
                <Image
                  src="/assets/rise-cover.jpg"
                  alt="RISE magazine cover"
                  width={910}
                  height={1287}
                  sizes="180px"
                />
                <p>Hi {firstName}, here’s your copy of BNI RISE.</p>
                <p>Short on time? Start with page 11, Navi Mumbai’s Moment.</p>
                <p>
                  Reading about BNI is one thing. Seeing a meeting is another.
                  Come as our guest, once, and judge for yourself.
                </p>
                <span className="message-example-action">Download RISE</span>
                <span className="message-example-action">
                  Book a guest visit
                </span>
                <small>Reply STOP to opt out · Sample message</small>
              </div>
            </div>
          )}
          <div className="delivery-grid">
            <article>
              <span className="step-number">01</span>
              <MessageCircle size={25} />
              <h3>Open WhatsApp</h3>
              <p>
                Look for a message from <strong>BNI Navi Mumbai</strong>. Tap
                “Download RISE” in the message to get your copy.
              </p>
              <a
                className="text-link"
                href="https://api.whatsapp.com/"
                target="_blank"
                rel="noreferrer"
              >
                Open WhatsApp
                <ArrowUpRight size={16} />
              </a>
            </article>
            <article>
              <span className="step-number">02</span>
              <Mail size={25} />
              <h3>
                {preview || emailAccepted
                  ? "Check your email, too"
                  : "Make time for a good read"}
              </h3>
              <p>
                {preview || emailAccepted
                  ? "The same link, as a backup. Look for “Your copy of RISE is here”. Check Promotions or Spam if needed."
                  : "Start with page 11, Navi Mumbai’s Moment. Discover what the city’s next chapter could mean for your business. Email backup is not available yet."}
              </p>
              {(preview || emailAccepted) && (
                <div className="mail-links">
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Gmail
                    <ArrowUpRight size={14} />
                  </a>
                  <a
                    href="https://outlook.live.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Outlook
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              )}
            </article>
            <article>
              <span className="step-number">03</span>
              <Smartphone size={25} />
              <h3>Keep us in your contacts</h3>
              <p>
                Once the WhatsApp message arrives, save the sender as BNI Navi
                Mumbai. The January 2027 edition is next.
              </p>
              <span className="step-hint">
                More local stories to look forward to.
              </span>
            </article>
          </div>
          <div className="resend-row">
            <p>
              {preview
                ? "Try the resend experience."
                : "Nothing after 5 minutes? Check your details or try again."}
            </p>
            <button
              className="text-link"
              disabled={resendCooldown > 0 || isResending}
              onClick={onResend}
            >
              <RefreshCw size={15} className={isResending ? "spin" : ""} />
              {isResending
                ? "Requesting…"
                : resendCooldown > 0
                  ? "Resend in " + resendCooldown + "s"
                  : "Resend the link"}
            </button>
          </div>
          <div className="next-actions">
            <article>
              <UsersRound size={26} />
              <p className="eyebrow">MEET YOUR COMMUNITY</p>
              <h2>
                There’s a seat
                <br />
                <em>at the table.</em>
              </h2>
              <p>
                See a BNI chapter meeting for yourself. Real people, real
                introductions, right here in your city.
              </p>
              <button className="btn-primary" onClick={() => setGuest(true)}>
                Book a guest visit
                <ArrowUpRight size={16} />
              </button>
            </article>
            <article>
              <span className="share-symbol" aria-hidden="true">
                ↗
              </span>
              <p className="eyebrow">GOOD STORIES DESERVE COMPANY</p>
              <h2>
                One good read.
                <br />
                <em>One great connection.</em>
              </h2>
              <p>
                Know a business owner who should read this? Pass RISE along.
                Their next chapter could start here.
              </p>
              <button className="btn-primary" onClick={shareWhatsApp}>
                <MessageCircle size={17} />
                Share on WhatsApp
              </button>
              <button className="text-link copy-link" onClick={copyLink}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Link copied" : "Copy share link"}
              </button>
              <p role="status" className="copy-status">
                {copyError}
              </p>
            </article>
          </div>
        </div>
      </section>
      <EventSection thankYou />
      <div className="return-link">
        <button className="text-link" onClick={onEditDetails}>
          Back to the issue
          <ArrowUpRight size={15} />
        </button>
      </div>
      {guest && (
        <GuestVisitModal
          isOpen={guest}
          onClose={() => setGuest(false)}
          formData={formData}
        />
      )}
    </div>
  );
}
