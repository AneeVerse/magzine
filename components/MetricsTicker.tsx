import { UsersRound, Network, TrendingUp, Sparkles } from "lucide-react";
const metrics = [
  {
    value: "700",
    suffix: "+",
    label: "Business owners",
    detail: "One connected community",
    Icon: UsersRound,
  },
  {
    value: "17",
    suffix: "",
    label: "Local chapters",
    detail: "Across Navi Mumbai",
    Icon: Network,
  },
  {
    value: "₹3,000",
    suffix: "Cr+",
    label: "Business passed",
    detail: "Through member referrals",
    Icon: TrendingUp,
  },
  {
    value: "12",
    suffix: "years",
    label: "Growing together",
    detail: "Since the first chapters in 2014",
    Icon: Sparkles,
  },
];
export function MetricsTicker() {
  return (
    <section className="metrics" aria-label="BNI Navi Mumbai in numbers">
      <div className="container-custom">
        <div className="metrics-intro">
          <div>
            <span className="eyebrow">THE COMMUNITY BEHIND THE STORIES</span>
            <h2>
              Connected people. <span>Extraordinary possibilities.</span>
            </h2>
          </div>
          <span className="community-badge">
            <span />
            Givers Gain® in action
          </span>
        </div>
        <dl className="metrics-grid">
          {metrics.map(({ value, suffix, label, detail, Icon }) => (
            <div className="metric-card" key={label}>
              <span className="metric-icon">
                <Icon size={20} strokeWidth={1.7} />
              </span>
              <dt>
                {value}
                <span>{suffix}</span>
              </dt>
              <dd>
                {label}
                <small>{detail}</small>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
