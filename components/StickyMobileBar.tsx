import { ArrowUpRight } from "lucide-react";
export function StickyMobileBar({
  show,
  onScrollToForm,
}: {
  show: boolean;
  onScrollToForm: () => void;
}) {
  if (!show) return null;
  return (
    <div className="mobile-bar">
      <div>
        <strong>Your next chapter.</strong>
        <span>48 pages. Yours, free.</span>
      </div>
      <button onClick={onScrollToForm} className="btn-primary">
        Get RISE free
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
