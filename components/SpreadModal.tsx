"use client";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { SpreadDetail } from "../types";
import { MAGAZINE_SPREADS } from "./SpreadExplorer";
import { Dialog } from "./Dialog";
export function SpreadModal({
  spread,
  onClose,
  onSelectSpread,
  onDownloadClick,
}: {
  spread: SpreadDetail | null;
  onClose: () => void;
  onSelectSpread: (spread: SpreadDetail) => void;
  onDownloadClick: () => void;
}) {
  const index = MAGAZINE_SPREADS.findIndex((item) => item.id === spread?.id);
  return (
    <Dialog open={!!spread} onClose={onClose} titleId="preview-title" wide>
      {spread && (
        <div className="spread-preview">
          <div className="preview-page">
            <Image
              src={spread.image}
              alt={"Page " + spread.pageNumber + ": " + spread.title}
              width={596}
              height={843}
              sizes="(max-width: 700px) 85vw, 450px"
            />
          </div>
          <div className="preview-copy">
            <p className="eyebrow">INSIDE RISE / PAGE {spread.pageNumber}</p>
            <h2 id="preview-title">{spread.title}</h2>
            {spread.author && (
              <span className="preview-author">By {spread.author}</span>
            )}
            <p>{spread.subtitle}</p>
            <div className="preview-note">
              <strong>This is just the beginning.</strong>
              <p>
                Get all 48 pages of the 12th anniversary edition, delivered free
                to your WhatsApp and email.
              </p>
            </div>
            <button className="btn-primary" onClick={onDownloadClick}>
              Get your free copy
              <ArrowUpRight size={16} />
            </button>
            <div className="preview-pagination">
              <button
                disabled={index === 0}
                onClick={() => onSelectSpread(MAGAZINE_SPREADS[index - 1])}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <span>{index + 1} / 4</span>
              <button
                disabled={index === 3}
                onClick={() => onSelectSpread(MAGAZINE_SPREADS[index + 1])}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
