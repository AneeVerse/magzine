import Image from "next/image";
import Link from "next/link";

export function Footer({
  isSubmitted = false,
  onOpenPrivacyModal,
}: {
  isSubmitted?: boolean;
  onOpenPrivacyModal?: () => void;
}) {
  return (
    <footer className="site-footer">
      <div className="container-custom">
        <div className="footer-top">
          <div className="brand">
            <span className="brand-word">RISE.</span>
            <span className="brand-byline">
              <b>BNI</b>
              <span>NAVI MUMBAI</span>
            </span>
          </div>
          <p>
            Building people. Building businesses.
            <br />
            Building a brighter tomorrow.
          </p>
          <span className="footer-edition">
            12TH ANNIVERSARY
            <br />
            EDITION
          </span>
        </div>
        <div className="footer-bottom">
          <p>
            Published by YBOUNCE Ventures LLP for BNI Navi Mumbai.
            <br />
            BNI® and Givers Gain® remain the property of their respective
            owners.
          </p>
          <p>
            {isSubmitted
              ? "Changed your mind? Reply STOP to opt out."
              : "Your details are used for RISE and BNI Navi Mumbai updates."}
            <br />
            <button type="button" onClick={onOpenPrivacyModal}>
              Privacy policy
            </button>
          </p>
          <p className="footer-credit">
            Designed &amp; Managed by{" "}
            <Link
              href="https://www.aneeverse.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-credit-link"
            >
              <span>Aneeverse</span>
              <Image
                src="/logo/aneeverse-logo.svg"
                alt="Aneeverse Logo"
                width={22}
                height={22}
              />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
