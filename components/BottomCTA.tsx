import { ArrowUpRight } from "lucide-react";
export function BottomCTA() {
  return (
    <section className="bottom-cta">
      <div className="container-custom">
        <p className="eyebrow">YOUR CITY. YOUR COMMUNITY. YOUR NEXT CHAPTER.</p>
        <h2>
          Good things happen
          <br />
          when you <em>turn the page.</em>
        </h2>
        <p>48 pages. A city full of opportunity. Your copy is free.</p>
        <a className="btn-primary" href="#get-rise">
          Get your free copy
          <ArrowUpRight size={18} />
        </a>
        <span className="cta-detail">
          Delivered on WhatsApp & email · Next issue: January 2027
        </span>
        <span className="cta-watermark" aria-hidden="true">
          RISE
        </span>
      </div>
    </section>
  );
}
