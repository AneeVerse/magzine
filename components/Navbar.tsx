"use client";
import { ArrowUpRight } from "lucide-react";
interface NavbarProps {
  onScrollToForm: () => void;
  isSubmitted: boolean;
  onEditDetails: () => void;
}
export function Navbar({
  onScrollToForm,
  isSubmitted,
  onEditDetails,
}: NavbarProps) {
  return (
    <header className="site-header">
      <nav className="container-custom nav-inner" aria-label="Main navigation">
        <button
          className="brand"
          aria-label="RISE home"
          onClick={() =>
            isSubmitted
              ? onEditDetails()
              : window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <span className="brand-word">
            RISE<span className="brand-dot">.</span>
          </span>
          <span className="brand-byline">
            <b>BNI</b>
            <span>NAVI MUMBAI</span>
          </span>
        </button>
        {!isSubmitted && (
          <div className="nav-links">
            <a href="#inside">Inside the issue</a>
            <a href="#community">Our community</a>
            <a href="#questions">FAQs</a>
          </div>
        )}
        <button
          className="btn-primary nav-cta"
          onClick={isSubmitted ? onEditDetails : onScrollToForm}
        >
          <span className="nav-cta-full">
            {isSubmitted ? "Back to the issue" : "Get your free copy"}
          </span>
          <span className="nav-cta-short">
            {isSubmitted ? "Back to issue" : "Get RISE free"}
          </span>
          <ArrowUpRight size={16} />
        </button>
      </nav>
    </header>
  );
}
