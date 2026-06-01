import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";

type CountUpProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  /** Delay before counting starts (ms). */
  startDelayMs?: number;
};

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className = "tabular-nums",
  startDelayMs = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 34, stiffness: 48 });
  const displayValue = useTransform(springValue, (latest) => {
    const n = decimals > 0 ? latest : Math.floor(latest);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });

  useEffect(() => {
    if (!isInView) return;
    const id = window.setTimeout(() => motionValue.set(value), startDelayMs);
    return () => window.clearTimeout(id);
  }, [isInView, value, motionValue, startDelayMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}
