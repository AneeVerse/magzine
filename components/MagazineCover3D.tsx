"use client";
import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
export function MagazineCover3D({
  onOpenPreview,
}: {
  onOpenPreview: () => void;
}) {
  return (
    <div className="hero-edition">
      <button
        className="cover-book"
        onClick={onOpenPreview}
        aria-label="Preview the magazine"
      >
        <Image
          src="/assets/rise-cover.jpg"
          alt="RISE magazine featuring Pankaj J Harwansh"
          width={910}
          height={1287}
          sizes="(max-width: 380px) 130px, (max-width: 700px) 160px, (max-width: 1000px) 120px, 160px"
          loading="eager"
          fetchPriority="high"
        />
      </button>
      <div className="edition-details">
        <span className="edition-pill">
          <BookOpen size={13} />
          THE INAUGURAL ISSUE
        </span>
        <h2>
          Real stories. <br />
          From right here.
        </h2>
        <p>
          People. Progress. Possibility.
        </p>
        <div className="edition-spec">
          <strong>48</strong>
          <span>
            pages of local
            <br />
            possibility.
          </span>
        </div>
        <button className="text-link light" onClick={onOpenPreview}>
          Explore the issue
          <ArrowUpRight size={16} />
        </button>
      </div>
      <span className="edition-index" aria-hidden="true">
        01 / 2026
      </span>
    </div>
  );
}
