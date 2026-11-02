"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import type { SpreadDetail } from "../types";
export const MAGAZINE_SPREADS: SpreadDetail[] = [
  {
    id: "page-11",
    pageNumber: "11",
    badge: "THE BIG PICTURE",
    title: "Navi Mumbai’s Moment",
    subtitle:
      "What the airport and the data centre belt will need from businesses already here.",
    image: "/assets/page-11-moment.jpg",
  },
  {
    id: "page-13",
    pageNumber: "13",
    badge: "A LOCAL PERSPECTIVE",
    title: "No longer Mumbai’s backup plan.",
    subtitle:
      "In 2009 clients said Vashi was “far”. Now they ask for office space in his building.",
    author: "Sudeep Kumar",
    image: "/assets/page-13-sudeep.jpg",
  },
  {
    id: "page-39",
    pageNumber: "39",
    badge: "THINK BIGGER",
    title: "Is your dream big enough?",
    subtitle:
      "If you run a ₹5 crore business today, can you see a ₹20,000 crore one by 2046?",
    author: "Arun Rao",
    image: "/assets/page-39-dream.jpg",
  },
  {
    id: "page-44",
    pageNumber: "44",
    badge: "MAKE THE CONNECTION",
    title: "Your next conversation could change everything.",
    subtitle:
      "9–10 December at Le Meridien. Two days of ideas, introductions and new possibilities.",
    image: "/assets/page-44-event.jpg",
  },
];
export function SpreadExplorer({
  onSelectSpread,
}: {
  onSelectSpread: (spread: SpreadDetail) => void;
}) {
  const shelf = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function moveTo(index: number) {
    const container = shelf.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(".story-card");
    const next = Math.max(0, Math.min(index, cards.length - 1));
    container.scrollTo({
      left: cards[next].offsetLeft - cards[0].offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function updatePosition() {
    const container = shelf.current;
    if (!container || container.scrollWidth <= container.clientWidth) return;
    const cards = container.querySelectorAll<HTMLElement>(".story-card");
    const stride = cards[1].offsetLeft - cards[0].offsetLeft;
    setActive(
      Math.min(cards.length - 1, Math.round(container.scrollLeft / stride)),
    );
  }
  return (
    <section id="inside" className="section stories-section">
      <div className="container-custom">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INSIDE THE DIWALI ISSUE</p>
            <h2>
              Local stories.
              <br />
              <em>Bigger possibilities.</em>
            </h2>
          </div>
          <p>
            Read it before your competitor does.
            <br />
            Four pieces worth the download on their own.
          </p>
        </div>
        <div
          className="stories-grid"
          id="story-shelf"
          ref={shelf}
          onScroll={updatePosition}
          role="group"
          aria-label="Magazine story previews"
        >
          {MAGAZINE_SPREADS.map((story, index) => (
            <button
              className={"story-card story-" + index}
              key={story.id}
              onClick={() => onSelectSpread(story)}
              aria-label={"Preview " + story.title}
            >
              <div className="story-art">
                <span className="page-tag">PAGE {story.pageNumber}</span>
                <Image
                  src={story.image}
                  alt={"Magazine page " + story.pageNumber}
                  width={596}
                  height={843}
                  sizes="(max-width: 700px) 210px, (max-width: 1000px) 300px, 280px"
                />
                <span className="story-art-caption">
                  A LOOK INSIDE THE ISSUE
                </span>
              </div>
              <div className="story-copy">
                <span className="eyebrow">{story.badge}</span>
                <h3>{story.title}</h3>
                <p>{story.subtitle}</p>
                <div className="story-bottom">
                  <span>
                    {story.author
                      ? "By " + story.author
                      : "From the editors of RISE"}
                  </span>
                  <span className="story-preview-link">
                    Preview story{" "}
                    <span className="circle-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="story-controls">
          <div>
            <span className="eyebrow">SWIPE THROUGH THE ISSUE</span>
            <p aria-live="polite">
              Story {active + 1} <span>of {MAGAZINE_SPREADS.length}</span>
            </p>
          </div>
          <div className="story-control-buttons">
            <button
              aria-label="Previous story"
              aria-controls="story-shelf"
              disabled={active === 0}
              onClick={() => moveTo(active - 1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              aria-label="Next story"
              aria-controls="story-shelf"
              disabled={active === MAGAZINE_SPREADS.length - 1}
              onClick={() => moveTo(active + 1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <p className="stories-footnote">
          A little preview. A much bigger story.{" "}
          <span>All 48 pages, in your free copy.</span>
        </p>
      </div>
    </section>
  );
}
