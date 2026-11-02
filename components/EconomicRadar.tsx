import {
  PlaneTakeoff,
  DatabaseZap,
  Handshake,
  ArrowUpRight,
} from "lucide-react";
const themes = [
  {
    Icon: PlaneTakeoff,
    name: "A new gateway.",
    tag: "AIRPORT & OPPORTUNITY",
    text: "A new airport. New connections. Discover what the next wave of growth could mean for your business.",
    className: "aviation",
  },
  {
    Icon: DatabaseZap,
    name: "A digital destination.",
    tag: "THE DATA CENTRE BELT",
    text: "The city’s digital backbone is growing. Get a local perspective on a changing business landscape.",
    className: "digital",
  },
  {
    Icon: Handshake,
    name: "People make it happen.",
    tag: "THE POWER OF COMMUNITY",
    text: "Every opportunity starts with a connection. Meet the people building stronger businesses, together.",
    className: "community",
  },
];
export function EconomicRadar() {
  return (
    <section className="themes-section">
      <div className="container-custom">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHY RISE. WHY NOW.</p>
            <h2>
              The next big thing
              <br />
              is <em>happening here.</em>
            </h2>
          </div>
          <p>
            Three reasons to look at your city differently.
            <br />A whole issue to help you see what’s next.
          </p>
        </div>
        <div className="themes-grid">
          {themes.map(({ Icon, name, tag, text, className }) => (
            <article className={"theme-card " + className} key={name}>
              <div className="theme-illustration" aria-hidden="true">
                <span className="icon-orbit orbit-one" />
                <span className="icon-orbit orbit-two" />
                <span className="theme-icon">
                  <Icon size={68} strokeWidth={1.3} />
                </span>
                <span className="icon-spark" />
              </div>
              <div className="theme-copy">
                <span className="eyebrow">{tag}</span>
                <h3>{name}</h3>
                <p>{text}</p>
                <a href="#inside" className="text-link">
                  Inside this issue
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
