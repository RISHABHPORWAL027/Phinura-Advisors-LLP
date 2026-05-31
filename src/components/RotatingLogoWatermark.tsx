import { motion } from "motion/react";
import { ASSETS } from "../constants/assetPaths";

const maskStyle = {
  WebkitMaskImage: `url(${ASSETS.brand.logo})`,
  WebkitMaskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskImage: `url(${ASSETS.brand.logo})`,
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
} as const;

type RotatingLogoWatermarkProps = {
  /** Which edge peeks into view (half logo visible). */
  side?: "left" | "right";
  /** Fill color behind the logo mask (e.g. bg-white on dark sections). */
  tintClass?: string;
  className?: string;
};

/** Slow-rotating Phinura logo watermark — same pattern as Meet Our Team. */
export function RotatingLogoWatermark({
  side = "right",
  tintClass = "bg-white",
  className = "",
}: RotatingLogoWatermarkProps) {
  const positionClass =
    side === "left"
      ? "top-1/2 -translate-y-1/2 -left-[300px] md:-left-[400px]"
      : "top-1/2 -translate-y-1/2 -right-[300px] md:-right-[400px]";

  return (
    <motion.div
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className={`pointer-events-none absolute ${positionClass} h-[600px] w-[600px] opacity-[0.05] md:h-[800px] md:w-[800px] ${tintClass} ${className}`}
      style={maskStyle}
    />
  );
}
