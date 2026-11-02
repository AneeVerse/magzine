"use client";
import { Dialog } from "./Dialog";
export function PrivacyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} titleId="privacy-title">
      <div className="dialog-content">
        <p className="eyebrow">YOUR DETAILS. YOUR CHOICE.</p>
        <h2 id="privacy-title">
          A note on <em>privacy.</em>
        </h2>
        <p>RISE is published by YBOUNCE Ventures LLP for BNI Navi Mumbai.</p>
        <div className="privacy-sections">
          <section>
            <h3>What you’re signing up for</h3>
            <p>
              Your requested RISE edition, the January 2027 issue, and BNI Navi
              Mumbai chapter meeting and event invitations by WhatsApp and
              email.
            </p>
          </section>
          <section>
            <h3>How your details are used</h3>
            <p>
              Your form details help BNI Navi Mumbai deliver the magazine and
              connect you with a local chapter if you request a visit.
            </p>
          </section>
          <section>
            <h3>You’re always in control</h3>
            <p>
              Reply STOP to a WhatsApp message to opt out. Use the unsubscribe
              link in an email to stop email updates.
            </p>
          </section>
        </div>
        <button className="btn-primary" onClick={onClose}>
          Got it
        </button>
      </div>
    </Dialog>
  );
}
