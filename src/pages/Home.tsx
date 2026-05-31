import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Rocket,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Quote,
  ArrowRight,
  UserSearch,
  Search,
  FileStack,
  Microscope,
  PenTool
} from "lucide-react";
import { AppLink } from "../navigation/AppLink";
import { useCMS } from "../hooks/useCMS";
import { CtaImageCard } from "../components/CtaImageCard";
import { TeamSection } from "../components/TeamSection";
import { getHomepageFeaturedServices } from "../utils/homeFeaturedServices";
import { resolveTestimonialCompanyLogo } from "../utils/resolveTestimonialCompanyLogo";
import { resolveLucideIcon } from "../utils/lucideIconMap";
import { resolveServiceHeroImage } from "../utils/resolveServiceHeroImage";
import { openCallbackRequest } from "../utils/openCallbackRequest";
import { ASSETS } from "../constants/assetPaths";
const ScrollTypewriterText = ({ text, className }: { text: string; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let currentText = "";
    let currentIndex = 0;

    setDisplayedText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayedText(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, isInView]);

  return (
    <h2 ref={ref} className={className} style={{ whiteSpace: "pre-wrap" }}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="inline-block w-[0.05em] h-[1em] bg-primary align-baseline ml-1 translate-y-[0.1em]"
        />
      )}
    </h2>
  );
};

const TypewriterText = ({ text, className }: { text: string; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;

    setDisplayedText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayedText(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className={className} style={{ whiteSpace: "pre-wrap" }}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="inline-block w-[0.05em] h-[1em] bg-white align-baseline ml-1 translate-y-[0.1em]"
        />
      )}
    </h1>
  );
};

export const FadeInStagger = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.15,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInItem = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const resolveHeroMedia = (value: string | undefined, fallback: string, aliases: string[]) => {
  if (!value) return fallback;
  return aliases.includes(value) ? fallback : value;
};

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [hasPosterError, setHasPosterError] = useState(false);
  const { data: siteDetails } = useCMS();
  const heroMedia = siteDetails.pages.home.hero;

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const bgBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const posterSrc = resolveHeroMedia(heroMedia.posterUrl, ASSETS.hero.poster, [
    "/BANNERPREVIEW.png",
    "BANNERPREVIEW.png",
    ASSETS.hero.poster,
    "BANNERPREVIEW.webp",
  ]);

  const webmSrc = resolveHeroMedia(heroMedia.videoUrl, ASSETS.hero.videoWebm, [
    ASSETS.hero.videoWebm,
    "homebanner.webm",
  ]);

  const mp4FallbackSrc = ASSETS.hero.videoMp4;

  const titleText = siteDetails.pages.home.hero.title || "You run the business.\nWe handle the compliance.";

  return (
    <section ref={containerRef} className="relative overflow-hidden min-h-screen flex items-center pt-24 pb-16 bg-primary">
      {/* Dynamic Background with Scroll Transform */}
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={{ scale: bgScale, filter: bgBlur, opacity: bgOpacity }}
      >
        <motion.img
          src={hasPosterError ? ASSETS.hero.poster : posterSrc}
          alt="Background"
          fetchPriority="high"
          decoding="async"
          initial={{ opacity: 1, scale: 1.05 }}
          animate={{ opacity: isVideoLoaded && !hasVideoError ? 0 : 0.6, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-luminosity"
          onError={() => setHasPosterError(true)}
        />
        <video
          key={webmSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          onLoadedData={() => {
            setHasVideoError(false);
            setIsVideoLoaded(true);
          }}
          onError={() => {
            setHasVideoError(true);
            setIsVideoLoaded(false);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ${isVideoLoaded && !hasVideoError ? "opacity-60 scale-100" : "opacity-0 scale-105"}`}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4FallbackSrc} type="video/mp4" />
        </video>

        {/* Layered Gradient Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-blue-900/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10 h-full"></div>

        {/* Animated Light Orbs */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen z-10"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[100px] mix-blend-screen z-10"
        />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="max-w-7xl mx-auto px-6 relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >

        {/* Left Column - Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative mb-7 max-w-[min(38rem,100%)] sm:mb-9"
          >
            <p className="pb-3 font-headline text-[1.0625rem] font-bold leading-snug tracking-[-0.02em] text-balance text-white sm:pb-4 sm:text-xl md:text-2xl [text-shadow:0_2px_28px_rgba(0,0,0,0.42)]">
              {siteDetails.pages.home.hero.badge || "Excellence in Finance"}
            </p>
            <div
              className="h-0.5 max-w-xl bg-gradient-to-r from-secondary-container from-[-2%] via-secondary-container/70 to-transparent"
              aria-hidden
            />
          </motion.div>

          <TypewriterText
            text={titleText}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.5rem] font-headline font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-400 leading-[1.05] tracking-tight mb-6 sm:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (titleText.length * 0.05) + 0.2, duration: 0.8 }}
            className="mb-11 max-w-[min(42rem,100%)] text-pretty text-base font-light leading-[1.65] text-blue-100/82 sm:text-lg md:text-xl"
          >
            {siteDetails.pages.home.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (titleText.length * 0.05) + 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex min-h-12 flex-1 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-blue-600 px-8 py-3.5 text-center font-headline text-sm font-bold text-white shadow-[0_0_34px_-4px_rgba(37,99,235,0.45)] transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_44px_-4px_rgba(37,99,235,0.55)] active:translate-y-[1px] sm:min-h-[3.125rem] sm:flex-initial sm:py-4 sm:text-base"
            >
              {siteDetails.pages.home.hero.buttonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <AppLink
              to="/services"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/20 bg-white/8 px-8 py-3.5 text-center font-headline text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/14 active:translate-y-[1px] sm:min-h-[3.125rem] sm:flex-initial sm:py-4 sm:text-base"
            >
              {siteDetails.pages.home.hero.secondaryButtonText || "View Services"}
            </AppLink>
          </motion.div>
        </div>

        {/* Right Column - Premium Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 50 }}
          className="lg:col-span-5 relative mt-12 lg:mt-0 perspective-1000 hidden md:block"
        >
          <div className="relative z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transform-style-3d overflow-hidden group">
            {/* Ambient inner glow */}
            <div className="absolute -inset-24 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10 relative z-20">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#001430] overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">500+</div>
                <div className="text-[10px] text-blue-200/60 uppercase tracking-widest">Happy Clients</div>
              </div>
            </div>

            <div className="space-y-6 relative z-20">
              {[
                { icon: ShieldCheck, title: "Tax & Audit Defense", desc: "Expert representation & legal protection." },
                { icon: Zap, title: "Fast Incorporation", desc: "Start your company within 7 days." },
                { icon: CheckCircle2, title: "100% Customer Oriented", desc: "Advice and filings centered on your goals—not generic paperwork." },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-center group/item hover:bg-white/5 p-3 -mx-3 rounded-xl transition-colors">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover/item:scale-110 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-0.5">{feature.title}</h4>
                    <p className="text-blue-200/50 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating decorative elements inside card */}
            <div className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>

          {/* External Floating Elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-xl z-30"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-white font-bold tracking-wider uppercase">Active Compliance Monitoring</span>
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
};

const StatsBar = () => {
  const { data: siteDetails } = useCMS();
  const partnersRaw = siteDetails.pages.home.statsPartners ?? [];

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [marqueePaused, setMarqueePaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const partners = useMemo(() => {
    const list = [...partnersRaw];
    const hasLogo = (p: { logo?: string }) => Boolean((p.logo ?? "").trim());

    return list.sort((a, b) => {
      const fa = Boolean((a as { featured?: boolean }).featured);
      const fb = Boolean((b as { featured?: boolean }).featured);
      if (fa !== fb) return fa ? -1 : 1;

      const la = hasLogo(a as { logo?: string });
      const lb = hasLogo(b as { logo?: string });
      if (la !== lb) return la ? -1 : 1;

      return 0;
    });
  }, [partnersRaw]);

  /** Two copies enable seamless marquee motion (reverse: rightward scroll). */
  const marqueeItems = useMemo(() => [...partners, ...partners], [partners]);

  const partnerUrl = (url: string | undefined) => {
    const u = (url ?? "").trim();
    return /^https?:\/\//i.test(u) ? u : null;
  };

  const marqueeDurationSec = Math.max(28, Math.min(72, partners.length * 4.25));

  return (
    <div className="relative overflow-hidden bg-white py-20 md:py-28">
      <div
        className="pointer-events-none absolute top-1/2 right-0 h-[min(28rem,90vw)] w-[min(28rem,90vw)] translate-x-1/4 -translate-y-1/2 rounded-full bg-secondary/5 blur-3xl"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Client Logos */}
        <div className="border-t border-outline-variant/30 pt-14 md:pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mb-12 max-w-3xl md:mb-16"
          >
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl">
              {siteDetails.pages.home.statsTitle || "Our Trusted Clients"}
            </h2>
            <div
              className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent"
              aria-hidden
            />
          </motion.div>

          <div className="-mx-4 px-0 sm:-mx-6 sm:px-0 md:mx-0 md:px-0">
            <div
              role="region"
              aria-label="Strategic Industry Partners — logos scroll horizontally right to left"
              className="relative left-1/2 w-[min(100vw,100dvw)] max-w-[min(100vw,100dvw)] -translate-x-1/2 overflow-x-hidden pb-6 pt-2 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-20 before:w-12 before:bg-gradient-to-r before:from-white before:to-transparent sm:before:w-20 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-20 after:w-12 after:bg-gradient-to-l after:from-white after:to-transparent sm:after:w-20"
              onMouseEnter={() => setMarqueePaused(true)}
              onMouseLeave={() => setMarqueePaused(false)}
              onTouchStart={() => setMarqueePaused(true)}
              onTouchEnd={() => setMarqueePaused(false)}
              onTouchCancel={() => setMarqueePaused(false)}
            >
              <div
                className={`flex w-max flex-nowrap gap-8 px-5 sm:px-10 md:gap-12${prefersReducedMotion ? "" : " partners-marquee-track-reverse"}${marqueePaused ? " is-paused" : ""}`}
                style={
                  prefersReducedMotion
                    ? undefined
                    : ({ "--partners-marquee-duration": `${marqueeDurationSec}s` } as CSSProperties)
                }
              >
                {marqueeItems.map((client, idx) => {
                  const href = partnerUrl((client as { url?: string }).url);
                  const logo = ((client as { logo?: string }).logo ?? "").trim();
                  const featured = Boolean((client as { featured?: boolean }).featured);

                  const tile = (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.08, y: -8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-3xl border bg-white p-4 shadow-sm md:h-52 md:w-52 md:p-5 transition-all duration-700 ease-out group-hover:border-primary/30 group-hover:shadow-[0_20px_40px_-15px_rgba(0,31,73,0.15)] ${
                          featured
                            ? "border-secondary-container/60 ring-2 ring-secondary-container/35 ring-offset-2 ring-offset-white"
                            : "border-slate-100"
                        }`}
                      >
                        {featured ? (
                          <span className="absolute top-2 left-2 z-20 rounded-full bg-secondary-container px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-secondary">
                            Landmark
                          </span>
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        {logo ? (
                          <img
                            src={logo}
                            alt={client.name}
                            className="relative z-10 h-[92%] w-[92%] max-h-none max-w-none object-contain transition-all duration-700 ease-out"
                            onError={(e) => {
                              const el = e.target as HTMLImageElement;
                              el.onerror = null;
                              el.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=f0f2ff&color=18335c&size=256`;
                            }}
                          />
                        ) : (
                          <span
                            className="relative z-10 flex h-full w-full items-center justify-center font-headline text-3xl font-extrabold text-primary/35 md:text-4xl"
                            aria-hidden
                          >
                            {client.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </motion.div>
                      <span className="max-w-[13rem] text-center font-headline text-base font-bold leading-snug text-slate-600 transition-colors group-hover:text-primary md:max-w-[15rem] md:text-lg">
                        {client.name}
                      </span>
                    </>
                  );

                  const itemClass =
                    "group flex w-[calc(72vw)] max-w-[15rem] shrink-0 flex-col items-center gap-5 rounded-2xl p-4 outline-none sm:w-auto sm:max-w-none sm:min-w-[14rem] md:min-w-[15rem]" +
                    (href
                      ? " transition-colors hover:bg-primary/[0.03] focus-visible:ring-2 focus-visible:ring-secondary-container focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      : "");

                  if (href) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={`${client.name}-${idx}`}
                        aria-label={`${client.name} — opens official website`}
                        className={itemClass}
                      >
                        {tile}
                      </a>
                    );
                  }

                  return (
                    <div key={`${client.name}-${idx}`} className={itemClass}>
                      {tile}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoreServices = () => {
  const { data: siteDetails } = useCMS();
  return (
    <section className="relative overflow-x-hidden bg-white py-20 md:py-28 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_0%,rgba(0,31,73,0.06),transparent_65%)]"
        aria-hidden
      />

      {/* Decorative rope + pen — wide layout only (SVG stretches badly on narrow viewports) */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden>
        <svg className="absolute w-full h-full left-0 top-0 opacity-20 text-primary" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100,600 C300,1000 700,-100 1100,400 Q1200,550 1280,300" stroke="currentColor" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round" />
        </svg>
        <motion.div
          animate={{ x: [0, 5, 0], y: [0, -5, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-30 text-primary opacity-100"
          style={{ left: "88.88%", top: "37.5%", transform: "translate(-10%, -90%)" }}
        >
          <PenTool size={56} className="drop-shadow-2xl" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 max-w-2xl">
          <FadeInStagger className="max-w-2xl">
            <FadeInItem>
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">{(siteDetails.pages.home as any).coreServices?.badge || "Comprehensive Expertise"}</span>
            </FadeInItem>
            <FadeInItem>
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-6">{(siteDetails.pages.home as any).coreServices?.title || "Our Core Services"}</h2>
            </FadeInItem>
            <FadeInItem>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                {(siteDetails.pages.home as any).coreServices?.subtitle || "End-to-end financial and legal solutions designed to empower your business journey with absolute precision and clarity."}
              </p>
            </FadeInItem>
          </FadeInStagger>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(() => {
            const allServices = siteDetails.pages.services.serviceList || [];
            const featuredIds = siteDetails.pages.home.coreServices?.featuredServiceIds;
            const featuredServices = getHomepageFeaturedServices(allServices, featuredIds);
            return featuredServices.map((service: any, i: number) => {
              const Icon = resolveLucideIcon(service.icon) || CheckCircle2;
              return (
                <AppLink
                  to={`/services/${service.id}`}
                  key={service.id}
                  className="group h-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative h-full flex flex-col"
                  >
                    {/* Image Section Wrapper */}
                    <div className="relative aspect-[16/10]">
                      {/* Actual Image with its own overflow clipping */}
                      <div className="absolute inset-0 rounded-t-[2.5rem] overflow-hidden">
                        {service.image ? (
                          <img
                            src={resolveServiceHeroImage(service.image)}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
                        )}
                      </div>

                      {/* Category Badge */}
                      {service.category && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-primary px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.15em] shadow-sm z-20">
                          {service.category}
                        </div>
                      )}

                      {/* Floating Icon Box (CRITICAL: Must be outside overflow-hidden) */}
                      <div className="absolute -bottom-7 left-8 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 z-30 border border-slate-50">
                        <Icon className="w-7 h-7" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 pt-12 flex flex-col flex-grow">
                      <h3 className="text-xl font-headline font-bold text-primary mb-3 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-grow opacity-70 line-clamp-3">
                        {service.description}
                      </p>

                      <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center">
                        <span className="font-bold text-primary text-sm flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AppLink>
              );
            });
          })()}
        </div>
      </div>
    </section>
  );
};

function ProcessFlowStep({
  scrollYProgress,
  step,
  i,
  isLast,
}: {
  scrollYProgress: MotionValue<number>;
  step: { title: string; desc: string; icon: string };
  i: number;
  isLast: boolean;
}) {
  const stepStart = 0.1 + i * 0.18;
  const iconMap: { [key: string]: typeof Rocket } = {
    Search,
    FileStack,
    Microscope,
    Rocket,
    UserSearch,
    ShieldCheck,
  };
  const Icon = iconMap[step.icon] || Rocket;

  const boxBg = useTransform(scrollYProgress, [stepStart, stepStart + 0.08], ["#ffffff", "#001f49"]);
  const iconColor = useTransform(scrollYProgress, [stepStart, stepStart + 0.08], ["#001f49", "#ffffff"]);
  const opacity = useTransform(scrollYProgress, [stepStart, stepStart + 0.1], [0.6, 1]);
  const contentScale = useTransform(scrollYProgress, [stepStart, stepStart + 0.08, stepStart + 0.16], [1, 1.05, 1]);

  return (
    <motion.div style={{ opacity }} className="relative flex flex-col items-center pt-12 text-center lg:px-6">
      <motion.div
        style={{ backgroundColor: boxBg }}
        className="mb-4 lg:absolute lg:left-1/2 lg:top-[-11px] lg:-translate-x-1/2 z-40 h-6 w-6 rounded-full border-4 border-white shadow-md"
      />

      <motion.div style={{ scale: contentScale }} className="group flex w-full flex-col items-center">
        <div className="relative mb-8">
          <div className="pointer-events-none absolute -left-6 -top-12 select-none text-8xl font-black text-primary/10 transition-all group-hover:text-primary/20">
            0{i + 1}
          </div>
          <motion.div
            style={{ backgroundColor: boxBg, color: iconColor }}
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-50 shadow-2xl transition-all duration-500"
          >
            <Icon className="h-8 w-8" strokeWidth={1.75} />
          </motion.div>
        </div>

        <h3 className="mb-2 font-headline text-2xl font-black leading-tight text-primary">{step.title}</h3>
        <p className="max-w-[240px] text-sm leading-relaxed text-on-surface-variant opacity-80">{step.desc}</p>
      </motion.div>

      {/* Optional: Add a subtle separator for mobile instead of the vertical line */}
      {!isLast && (
        <div className="mt-8 h-[2px] w-12 bg-primary/20 lg:hidden" aria-hidden />
      )}
    </motion.div>
  );
}

const ProcessFlow = () => {
  const { data: siteDetails } = useCMS();
  const { process } = siteDetails.pages.home;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const steps = process.steps || [];

  const progressLineScale = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const logoPosition = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);
  const logoRotation = useTransform(scrollYProgress, [0.1, 0.8], [0, 1440]);

  return (
    <section ref={containerRef} className="relative bg-white lg:h-[200vh]">
      <div className="flex flex-col items-center justify-center overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center opacity-[0.05]">
          <img src={ASSETS.brand.logo} alt="" className="w-[500px] grayscale md:w-[800px]" loading="lazy" decoding="async" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center pt-8 md:pt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="mb-4 font-headline text-4xl font-extrabold tracking-tight text-primary md:text-6xl relative z-10">
                {process.title}
              </h2>
              <p className="text-lg text-on-surface-variant opacity-80">{process.subtitle}</p>
            </motion.div>
          </div>

          <div className="relative pt-16">
            <div className="absolute left-0 top-[2px] z-0 hidden h-[4px] w-full rounded-full bg-slate-200 lg:block" />
            <motion.div
              style={{ scaleX: progressLineScale }}
              className="absolute left-0 top-[2px] z-10 hidden h-[4px] w-full origin-left rounded-full bg-primary lg:block"
            />

            <motion.div
              style={{ left: logoPosition, rotate: logoRotation }}
              className="absolute top-[-22px] z-30 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-slate-100 bg-white p-2 shadow-2xl lg:flex"
            >
              <img src={ASSETS.brand.logo} alt="Logo" className="h-full w-full object-contain" />
            </motion.div>

            {/* Mobile progress line removed as layout is now centered */}

            <div className="relative z-20 grid w-full grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-0">
              {steps.map((step: { id?: string; title: string; desc: string; icon: string }, i: number) => (
                <Fragment key={step.id ?? i}>
                  <ProcessFlowStep scrollYProgress={scrollYProgress} step={step} i={i} isLast={i === steps.length - 1} />
                </Fragment>
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const { data: siteDetails } = useCMS();
  const { whyChooseUs } = siteDetails.pages.home;
  const cards = whyChooseUs.cards || [];

  const iconMap: { [key: string]: any } = { ShieldCheck, Zap, CheckCircle2, Rocket, UserSearch };

  return (
    <section className="relative overflow-hidden bg-[#18335c] py-20 md:py-28">
      {/* Decorative background map-like pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-[80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-[80px]"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: office image + floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.35, duration: 1.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative order-2 lg:order-1 mt-6 lg:mt-0"
          >
            <div
              className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40 lg:max-w-none leading-[0]"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src={ASSETS.team.member}
                alt="Phinura Advisors team"
                className="block h-full w-full max-h-none max-w-none object-cover object-[center_22%] origin-top"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 lg:bottom-8 left-4 lg:left-6 bg-white text-[#18335c] px-6 py-4 lg:px-8 lg:py-6 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-10"
            >
              <div className="text-4xl lg:text-5xl font-headline font-extrabold leading-none">{cards.length}+</div>
              <div className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] text-[#18335c]/60 mt-2">Reasons to Trust Us</div>
            </motion.div>
          </motion.div>

          {/* RIGHT: title + feature list */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <FadeInStagger>
              <ScrollTypewriterText
                text={whyChooseUs.title || "Why Choose Us?"}
                className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-4 leading-tight text-center lg:text-left"
              />
              <FadeInItem>
                <p className="text-blue-100 text-base leading-relaxed mb-10 max-w-lg font-medium mx-auto lg:mx-0 text-center lg:text-left">
                  {whyChooseUs.subtitle || "We are a team of highly qualified Chartered Accountants and Company Secretaries with over 10 years of experience dedicated to your success."}
                </p>
              </FadeInItem>
            </FadeInStagger>

            <div className="space-y-6 mt-6">
              {cards.map((c: any, i: number) => {
                const IconComponent = typeof c.icon === 'string' ? iconMap[c.icon] || ShieldCheck : c.icon || ShieldCheck;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 md:gap-5 items-start group"
                  >
                    {/* Circular icon badge with semantic icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300 border border-white/10">
                      <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white transition-all duration-300" strokeWidth={1.5} />
                    </div>
                    <div className="pt-1">
                      <h3 className="font-headline font-bold text-white mb-1 md:mb-1.5 text-base md:text-lg">{c.title}</h3>
                      <p className="text-blue-100 text-sm leading-relaxed opacity-90">{c.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { data: siteDetails } = useCMS();
  const { testimonials } = siteDetails.pages.home;
  const partners = siteDetails.pages.home.statsPartners ?? [];
  const reviews = testimonials ?? [];
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const marqueeItems = useMemo(() => [...reviews, ...reviews], [reviews]);

  return (
    <section className="relative overflow-hidden bg-[#dfe9f5] py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(0,31,73,0.04),transparent_60%)]"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <FadeInStagger className="text-center">
          <FadeInItem>
            <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">
              {(siteDetails.pages.home as any).testimonialsTitle || "Trusted by Businesses Like Yours"}
            </h2>
          </FadeInItem>
          <FadeInItem>
            <p className="text-on-surface-variant">
              {(siteDetails.pages.home as any).testimonialsSubtitle ??
                "Real stories from entrepreneurs who grow with us."}
            </p>
          </FadeInItem>
        </FadeInStagger>
      </div>

      <div
        className="relative z-10 flex overflow-hidden"
        onMouseEnter={() => setMarqueePaused(true)}
        onMouseLeave={() => setMarqueePaused(false)}
        onTouchStart={() => setMarqueePaused(true)}
        onTouchEnd={() => setMarqueePaused(false)}
        onTouchCancel={() => setMarqueePaused(false)}
      >
        <div
          className={`flex gap-8 whitespace-nowrap${prefersReducedMotion ? "" : " testimonials-marquee-track"}${marqueePaused ? " is-paused" : ""}`}
        >
          {marqueeItems.map((t, i) => {
            const companyLogo = resolveTestimonialCompanyLogo(t, partners);
            return (
              <div
                key={`${t.name}-${t.role}-${i}`}
                className="w-[min(100vw-2rem,400px)] flex-shrink-0 bg-white p-10 rounded-[2rem] border border-outline-variant/10 shadow-sm relative group"
              >
                <Quote className="text-primary/5 w-20 h-20 absolute top-4 right-6 select-none group-hover:text-primary/10 transition-colors" />
                {companyLogo ? (
                  <div className="relative z-10 mb-5 flex min-h-[48px] items-center border-b border-outline-variant/10 pb-5">
                    <img
                      src={companyLogo}
                      alt=""
                      role="presentation"
                      className="max-h-11 w-auto max-w-[11.5rem] object-contain object-left"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : null}
                <div className="flex gap-1 text-secondary mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Zap key={s} className="w-4 h-4 fill-secondary" />
                  ))}
                </div>
                <p className="text-lg font-medium text-primary italic mb-10 leading-relaxed whitespace-normal">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full ring-2 ring-primary/20 ring-offset-2 bg-primary-fixed flex items-center justify-center font-bold text-primary shadow-md relative overflow-hidden flex-shrink-0 group-hover:ring-primary/50 transition-all duration-300">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-lg font-bold text-primary relative z-10">{t.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="whitespace-normal">
                    <div className="font-bold text-primary">{t.name}</div>
                    <div className="text-xs text-on-surface-variant font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const { data: siteDetails } = useCMS();

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/30 md:rounded-[3rem]"
        >
          <CtaImageCard
            backgroundImage={ASSETS.bg.detailsPage}
            className="rounded-[2.5rem] text-center text-white md:rounded-[3rem]"
            contentClassName="p-8 md:p-20"
          >
            <FadeInStagger>
              <FadeInItem>
                <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6 text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
                  {siteDetails.pages.home.cta.title}
                </h2>
              </FadeInItem>
              <FadeInItem>
                <p className="text-xl md:text-[1.35rem] text-sky-100/95 mb-12 max-w-2xl mx-auto leading-relaxed font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                  {siteDetails.pages.home.cta.subtitle}
                </p>
              </FadeInItem>
            </FadeInStagger>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary text-white px-10 py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-secondary/20 hover:scale-105 transition-transform cursor-pointer text-center"
              >
                {siteDetails.pages.home.cta.buttonText}
              </a>
              <button
                type="button"
                onClick={openCallbackRequest}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-colors cursor-pointer text-center"
              >
                {siteDetails.pages.home.cta.secondaryButtonText}
              </button>
            </div>
          </CtaImageCard>
        </motion.div>
      </div>
    </section>
  );
};

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CoreServices />
      <WhyChooseUs />
      <ProcessFlow />
      <StatsBar />
      <Testimonials />
      <TeamSection variant="home" />
      <FinalCTA />
    </div>
  );
};
