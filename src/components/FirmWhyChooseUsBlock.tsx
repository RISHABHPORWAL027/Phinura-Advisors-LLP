import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { ASSETS } from "../constants/assetPaths";
import { RotatingLogoWatermark } from "./RotatingLogoWatermark";

type FirmStat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

function StatCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 60 });
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className="font-headline text-3xl font-extrabold tabular-nums text-white md:text-4xl">
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}

type WhyChooseItem = string | { title: string; description?: string };

type Props = {
  heading: string;
  intro?: string;
  items: WhyChooseItem[];
  companyName: string;
  fullName?: string;
  /** Service area label, e.g. "Company registration" */
  fieldLabel?: string;
  stats?: FirmStat[];
};

const DEFAULT_STATS: FirmStat[] = [
  { label: "Years Experience", value: 10, suffix: "+" },
  { label: "Happy Clients", value: 499, suffix: "+" },
];

export function FirmWhyChooseUsBlock({
  heading,
  intro,
  items,
  companyName,
  fullName,
  fieldLabel,
  stats = DEFAULT_STATS,
}: Props) {
  const displayName = (fullName?.trim() || companyName).trim();
  const fieldLine = fieldLabel?.trim()
    ? `Trusted ${fieldLabel.toLowerCase()} support across India`
    : "Trusted compliance & registration support across India";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[2rem] bg-[#18335c] p-8 shadow-xl md:p-10 lg:p-12"
    >
      <RotatingLogoWatermark side="right" tintClass="bg-white" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative z-10">
        {/* Firm identity */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center md:mb-10 md:flex-row md:items-center md:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white p-3 shadow-lg md:h-24 md:w-24">
            <img src={ASSETS.brand.logo} alt={displayName} className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200/70">Why choose our firm</p>
            <h2 className="font-headline text-2xl font-extrabold text-white md:text-3xl">{displayName}</h2>
            <p className="mt-1 text-sm text-blue-100/75 md:text-base">{fieldLine}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mb-10">
          {stats.slice(0, 2).map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-5 text-center backdrop-blur-sm md:px-6 md:py-6"
            >
              <StatCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <p className="mt-2 text-sm font-medium leading-snug text-blue-100/80">{stat.label}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-5 text-center backdrop-blur-sm md:px-6 md:py-6">
            <span className="font-headline text-3xl font-extrabold text-white md:text-4xl">360°</span>
            <p className="mt-2 text-sm font-medium leading-snug text-blue-100/80">
              End-to-end expertise in this field
            </p>
          </div>
        </div>

        {/* Service-specific why choose us */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 md:p-8">
          <h3 className="mb-4 flex items-center gap-3 font-headline text-xl font-bold text-white md:text-2xl">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-secondary-container" aria-hidden />
            {heading}
          </h3>
          {intro && (
            <p className="mb-6 text-base leading-relaxed text-blue-50/90 md:text-lg">{intro}</p>
          )}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item, i) => {
              const title = typeof item === "string" ? item : item.title;
              const description = typeof item === "string" ? undefined : item.description;
              return (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-blue-50/95 md:text-[0.9375rem]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary-container" aria-hidden />
                  <span>
                    <span className="font-semibold">{title}</span>
                    {description ? (
                      <span className="mt-1 block font-normal text-blue-50/85">{description}</span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
