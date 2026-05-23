import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AppLink } from "../navigation/AppLink";
import {
  Heart,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
  Building2,
  Goal,
  Eye,
  LineChart,
  Rocket,
  Briefcase,
  CheckCircle2
} from "lucide-react";
import { useCMS } from "../hooks/useCMS";
import { CtaImageCard } from "../components/CtaImageCard";
import { TeamSection } from "../components/TeamSection";
import missionCardBanner from "../Assets/genral_banner.jpg";
import visionSectionImage from "../Assets/vision_2.jpg";
import workingBanner from "../Assets/working.png";
import ctaBackground from "../Assets/team_member.webp";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 60 });
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

/* ─── Hero ─────────────────────────────────────────────────────────────── */
const Hero = () => {
  const { data: siteDetails } = useCMS();
  const { hero } = siteDetails.pages.about;
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F8F9FA] pt-36 pb-[clamp(3rem,10vw,5rem)]">
      {/* Bottom band: working photo (left); no overlay so the asset stays fully visible */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-[clamp(168px,26vh,320px)] sm:block"
        aria-hidden
      >
        <div className="relative flex h-full w-full items-end justify-start pl-6 pr-4 sm:pl-8">
          <img
            src={workingBanner}
            alt=""
            className="max-h-full w-auto max-w-[min(100%,520px)] object-contain object-left-bottom opacity-100 sm:max-w-[min(100%,580px)]"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto h-full max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-8 text-5xl font-headline font-extrabold leading-[1.1] tracking-tight text-[#0D1B2A] md:text-7xl">
              {hero.title}
            </h1>

            <p className="mb-12 max-w-xl text-lg leading-relaxed text-on-surface-variant opacity-80 md:text-xl">
              {hero.subtitle}
            </p>
            <AppLink
              to="/contact"
              className="inline-block rounded-lg bg-[#0D1B2A] px-12 py-5 text-center font-headline text-lg font-bold text-white transition-all hover:bg-opacity-90"
            >
              Get Started
            </AppLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl w-full">
              <img
                src={hero.image}
                alt="Architectural Building"
                className="w-full object-cover"
                style={{ height: "clamp(400px, 70vh, 750px)" }}
              />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-10 left-10 bg-[#0D1B2A] text-white px-10 py-8 rounded-xl shadow-2xl z-20 min-w-[280px]"
            >
              <div className="text-5xl font-headline font-extrabold mb-1">
                <Counter value={parseInt(hero.statNumber)} suffix="+" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
                {hero.statLabel}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ─── Our Story ─────────────────────────────────────────────────────────── */
const Story = () => {
  const { data: siteDetails } = useCMS();
  const { story } = siteDetails.pages.about;
  return (
    <section className="relative py-24 bg-[#18335c] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -left-24 bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            {/* Architectural Frame Effect */}
            <div className="absolute -inset-4 border border-white/10 rounded-[2.5rem] pointer-events-none" />
            
            <motion.div
              style={{ rotate: 2 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 border border-white/20 rounded-[2.5rem] pointer-events-none" />

              <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40 aspect-[4/3] relative z-10 bg-[#18335c] border-4 border-[#18335c]">
                <img
                  src={story.image || "https://images.unsplash.com/photo-1556155092-490a1ba16284"}
                  alt="Phinura Story"
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Achievement Badge */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  x: { delay: 0.6 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -bottom-10 -right-4 bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-20 border border-slate-50 hidden md:block min-w-[280px]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#18335c] flex items-center justify-center text-white shadow-lg shadow-black/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <div className="text-3xl font-headline font-extrabold text-[#18335c]">100%</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compliance Guaranteed</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", bounce: 0.3, duration: 1.5, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-blue-200 text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-white/10 shadow-sm">
              <Briefcase size={14} className="text-secondary" />
              Our Story
            </div>

            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-8 leading-tight">
              Founded on a Singular Principle: <span className="text-secondary-fixed">Sovereignty.</span>
            </h2>

            <div className="space-y-6">
              <p className="text-blue-100/90 text-xl font-medium leading-relaxed italic border-l-4 border-secondary/30 pl-6 py-2">
                Phinura Advisors began with a clear mandate: to provide corporate entities with the absolute clarity required to govern their own financial destinies.
              </p>

              <div className="space-y-4 text-blue-100/80 text-lg leading-relaxed">
                <p>
                  Our founders recognized that the traditional accounting model was reactive. They sought to create a proactive, architectural approach to fiscal management—one where every ledger entry is a strategic brick in a larger edifice of corporate success.
                </p>
                <p>
                  Today, we continue that legacy, ensuring our clients don't just react to the market, but architect their future with precision and professional sovereignty.
                </p>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#18335c] bg-slate-200 overflow-hidden shadow-lg">
                    <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="Founder" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-bold text-white">Trusted by Global Entities</div>
                <div className="text-blue-200/60">5+ Years of Fiscal Excellence</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

/* ─── Mission, Vision & Values ─────────────────────────────────────────── */
const MissionVision = () => {
  const { data: siteDetails } = useCMS();
  const { missionVision, values } = siteDetails.pages.about;
  const iconMap: { [key: string]: any } = { ShieldCheck, LineChart, Rocket, Heart, Lightbulb };

  const [currentMission, setCurrentMission] = useState(0);
  const missions =
    missionVision.missions && missionVision.missions.length > 0
      ? missionVision.missions
      : [missionVision.mission ?? ""].filter(Boolean);
  const safeMissions = missions.length > 0 ? missions : ["We help business owners with tax, MCA, and filings — explained in everyday language."];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMission((prev: number) => (prev + 1) % safeMissions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [safeMissions.length]);

  return (
    <section className="py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Mission Card - Autoplay Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative flex min-h-[400px] flex-col justify-center overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <img src={missionCardBanner} alt="" className="h-full w-full object-cover" />
              <div
                className="absolute inset-0 bg-[linear-gradient(100deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_28%,rgba(255,255,255,0.45)_48%,rgba(255,255,255,0.08)_68%,transparent_88%)]"
                aria-hidden
              />
            </div>

            <div className="relative z-10 flex max-w-xl flex-col justify-center p-12 md:p-16">
              <Building2 className="mb-8 h-10 w-10 text-primary" />
              <h3 className="mb-6 font-headline text-3xl font-bold text-primary">Our Mission</h3>

              <div className="relative h-32 overflow-hidden md:h-24">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentMission}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute text-xl font-medium leading-relaxed text-[#0D1B2A]/90"
                  >
                    {safeMissions[currentMission]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-12 flex gap-2">
                {safeMissions.map((_: any, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentMission(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${currentMission === i ? "w-10 bg-slate-400" : "w-4 bg-slate-200"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-[2.5rem] overflow-hidden group min-h-[450px] bg-slate-900 shadow-2xl"
          >
            <div className="absolute inset-0">
              <img
                src={missionVision.visionImage?.trim() ? missionVision.visionImage : visionSectionImage}
                alt="Our Vision"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#0D1B2A]/40 group-hover:bg-[#0D1B2A]/20 transition-colors duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/40 to-transparent"></div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-12 h-1 bg-orange-500 mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
                <h3 className="text-4xl font-headline font-bold text-white mb-6 tracking-tight">Our Vision</h3>
                <p className="text-slate-200 text-lg leading-relaxed max-w-md font-light">
                  {missionVision.vision}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Values: compact horizontal scroll on mobile (aligned with page gutter), grid from md */}
        <div
          className="flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain py-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:py-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Our values"
        >
          {values.map((v: any, i: number) => {
            const Icon = iconMap[v.icon] || ShieldCheck;
            return (
              <motion.div
                key={i}
                role="listitem"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex w-[220px] shrink-0 snap-start flex-col items-start rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:w-[236px] sm:p-6 md:w-auto md:min-w-0 md:snap-none md:rounded-[1.5rem] md:p-10"
              >
                <div className="mb-6 rounded-lg bg-slate-50 p-2">
                  <Icon className="h-6 w-6 text-orange-700" />
                </div>
                <h4 className="mb-3 font-headline text-xl font-bold text-primary">{v.title}</h4>
                <p className="text-sm leading-relaxed text-on-surface-variant opacity-70">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─── CTA ─────────────────────────────────────────────────────────────────── */
const CTA = () => {
  const { data: siteDetails } = useCMS();
  const { cta } = siteDetails.pages.about;
  return (
    <section className="py-16 px-6 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/20 md:rounded-[4rem]"
        >
          <CtaImageCard
            backgroundImage={ctaBackground}
            className="rounded-[2.5rem] text-center text-white md:rounded-[4rem]"
            contentClassName="p-10 md:p-20"
          >
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-8 leading-[1.1]">
              {cta.title}
            </h2>
            <p className="text-xl md:text-2xl text-on-primary-container/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              {cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <AppLink
                to="/contact"
                className="bg-secondary text-white px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:scale-105 transition-transform shadow-xl shadow-secondary/20"
              >
                {cta.buttonText}
              </AppLink>
              <AppLink
                to="/services"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-all"
              >
                {cta.secondaryButtonText}
              </AppLink>
            </div>
          </CtaImageCard>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
export const About = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Story />
      <MissionVision />
      <TeamSection variant="about" />
      <CTA />
    </div>
  );
};
