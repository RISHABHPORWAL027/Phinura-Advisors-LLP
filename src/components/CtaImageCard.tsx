import type { ReactNode } from "react";
import { ASSETS } from "../constants/assetPaths";

type Props = {
  children: ReactNode;
  /** Shell: rounding, text color, alignment — not padding (background fills this box). */
  className?: string;
  /** Inner content padding so the image/overlay cover the full rounded card. */
  contentClassName?: string;
  backgroundImage?: string;
};

/**
 * Full-bleed background image with a primary-tinted overlay so CTA copy stays readable.
 */
export function CtaImageCard({ children, className = "", contentClassName = "p-8 md:p-20", backgroundImage }: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={backgroundImage || ASSETS.bg.ctaDefault}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        decoding="async"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.85] via-primary/[0.7] to-primary/[0.8]"
        aria-hidden
      />
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}
