import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
export function EventSection({
  onAction,
  thankYou = false,
}: {
  onAction?: () => void;
  thankYou?: boolean;
}) {
  const calendarUrl =
    "https://calendar.google.com/calendar/render?" +
    new URLSearchParams({
      action: "TEMPLATE",
      text: "BNI Navi Mumbai business event",
      dates: "20261209/20261211",
      location: "Le Meridien, Navi Mumbai",
      details:
        "Member stalls, speaker sessions, 1-2-1 arenas and a startup shark tank. Event details and guest invitation to follow from BNI Navi Mumbai.",
    }).toString();
  return (
    <section className="event-wrap" id="event">
      <div className="container-custom">
        <div className="event-panel">
          <div className="event-copy">
            <p className="eyebrow gold">TAKE THE STORY OFFLINE</p>
            <h2>
              Great businesses start
              <br />
              with a <em>conversation.</em>
            </h2>
            <p>
              Member stalls. Speaker sessions. 1-2-1 arenas.
              <br className="desktop-only" /> A startup shark tank. Two days to
              meet your next possibility.
            </p>
            <div className="event-location">
              <MapPin size={16} />
              Le Meridien, Navi Mumbai
            </div>
            {thankYou ? (
              <a
                className="btn-ivory"
                target="_blank"
                rel="noreferrer"
                href={calendarUrl}
              >
                Add to Google Calendar
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <a className="btn-ivory" href="#get-rise" onClick={onAction}>
                Get RISE. Get the guest invite.
                <ArrowUpRight size={16} />
              </a>
            )}
            <small>Readers receive the guest invite closer to the event.</small>
          </div>
          <div className="event-date">
            <span>DECEMBER 2026</span>
            <strong>
              09<span>—</span>10
            </strong>
            <span>TWO DAYS. NEW POSSIBILITIES.</span>
            <div className="event-page">
              <Image
                src="/assets/page-44-event.jpg"
                alt="December event preview from page 44 of RISE"
                width={596}
                height={843}
                sizes="200px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
