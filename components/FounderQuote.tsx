import Image from "next/image";
export function FounderQuote() {
  return (
    <section id="community" className="section community-section">
      <div className="container-custom community-grid">
        <div className="community-portrait">
          <div className="portrait-crop">
            <Image
              src="/assets/rise-cover.jpg"
              alt="Pankaj J Harwansh on the RISE magazine cover"
              fill
              sizes="(max-width: 700px) 280px, 360px"
            />
          </div>
          <span className="portrait-caption">
            FROM THE COVER / THE PEOPLE BEHIND THE PROGRESS
          </span>
        </div>
        <div className="community-copy">
          <p className="eyebrow">12 YEARS OF GIVERS GAIN®</p>
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <blockquote>
            When people grow together, businesses grow{" "}
            <em>faster, stronger,</em> and more meaningfully.
          </blockquote>
          <div className="quote-credit">
            <span className="credit-line" />
            <div>
              <strong>Pankaj J Harwansh</strong>
              <p>
                Founder & Executive Director
                <br />
                BNI Navi Mumbai
              </p>
            </div>
          </div>
          <p className="community-note">
            A magazine for the people who see possibility in this city. And a
            celebration of the people making it happen.
          </p>
        </div>
      </div>
    </section>
  );
}
