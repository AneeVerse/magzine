"use client";
import { useState } from "react";
import { Plus, Minus, ShieldCheck } from "lucide-react";
const faqs = [
  [
    "Is it really free?",
    "Yes. Our members’ advertisements paid for it. You pay nothing, now or later. No subscription or BNI membership needed.",
  ],
  [
    "What will you send me?",
    "This edition, the New Year edition in January 2027, and invites to BNI Navi Mumbai meetings and events. Reply STOP anytime to opt out.",
  ],
  [
    "I’m not in BNI. Is this for me?",
    "It was written for you. This edition is intended for business owners across Navi Mumbai, including people who have never been to a BNI meeting.",
  ],
  [
    "How do I receive my copy?",
    "Fill in the form and check WhatsApp for a message from BNI Navi Mumbai. The same download link arrives by email as a backup. Please allow up to two minutes, and check your Promotions or Spam folder if needed.",
  ],
  [
    "Can I visit a chapter meeting?",
    "Yes. After requesting your magazine, choose “Book a guest visit” and tell us your preferred area. The BNI team can help you find the right chapter and confirm the meeting details.",
  ],
];
export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="questions" className="section faq-section">
      <div className="container-custom faq-grid">
        <div>
          <p className="eyebrow">BEFORE YOU SHARE YOUR NUMBER</p>
          <h2>
            Fair questions.
            <br />
            <em>Straight answers.</em>
          </h2>
          <p className="faq-intro">
            A good relationship starts with clarity.
            <br />
            Here’s what you can expect from us.
          </p>
          <span className="trust-note">
            <ShieldCheck size={20} />
            Your details stay with BNI Navi Mumbai.
          </span>
        </div>
        <div>
          {faqs.map(([question, answer], i) => (
            <div
              className={"faq-item " + (open === i ? "is-open" : "")}
              key={question}
            >
              <h3>
                <button
                  aria-expanded={open === i}
                  aria-controls={"faq-answer-" + i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {question}
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
              </h3>
              <div id={"faq-answer-" + i} hidden={open !== i}>
                <p>{answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
