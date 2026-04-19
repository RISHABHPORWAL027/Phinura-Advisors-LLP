import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Rocket,
  Wallet,
  LineChart,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Quote,
  ArrowRight,
  ArrowRightLeft,
  Headset,
  User,
  BadgeCheck,
  Clock,
  UserSearch,
  Tag,
  Search,
  FileStack,
  Microscope
} from "lucide-react";
import { AppLink } from "../navigation/AppLink";
import { useCMS } from "../hooks/useCMS";
import { getHomepageFeaturedServices } from "../utils/homeFeaturedServices";
import { resolveLucideIcon } from "../utils/lucideIconMap";
import bundledHomeBannerWebm from "../Assets/homebanner.webm";
import bundledHomeBannerMp4 from "../Assets/homebanner.mp4";
import bundledHomeBannerPoster from "../Assets/BANNERPREVIEW.png";
import phinuraLogo from "../Assets/Phinura_Advisors_logo.png";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  // ...
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 60,
  });
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

const resolveBundledMedia = (value: string | undefined, fallback: string, aliases: string[]) => {
  if (!value) return fallback;
  return aliases.includes(value) ? fallback : value;
};

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [hasPosterError, setHasPosterError] = useState(false);
  const { data: siteDetails } = useCMS();
  const heroMedia = siteDetails.pages.home.hero;

  const posterSrc = resolveBundledMedia(heroMedia.posterUrl, bundledHomeBannerPoster, [
    "/BANNERPREVIEW.png",
    "BANNERPREVIEW.png",
  ]);

  const webmSrc = resolveBundledMedia(heroMedia.videoUrl, bundledHomeBannerWebm, [
    "/homebanner.webm",
    "homebanner.webm",
  ]);

  const mp4FallbackSrc = bundledHomeBannerMp4;

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-40 bg-white ">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-[10rem] -z-10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -z-10 blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative mt-10 md:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20"
        >
          <div className="inline-flex items-center gap-2 py-2 px-4 bg-primary/5 border border-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {siteDetails.pages.home.hero.badge}
          </div>

          <h1 className="text-6xl lg:text-8xl font-headline font-extrabold text-primary leading-[1.05] tracking-tight mb-8">
            {siteDetails.pages.home.hero.title.split('Integrity')[0]} <br />
            <span className="text-secondary italic">Integrity.</span>
          </h1>

          <p className="text-xl text-on-surface-variant leading-relaxed mb-12 max-w-xl opacity-90">
            {siteDetails.pages.home.hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-6 mb-12">
            <a
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-10 py-5 rounded-2xl font-headline font-bold text-lg shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-all cursor-pointer text-center group"
            >
              {siteDetails.pages.home.hero.buttonText}
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary border border-outline-variant/30 px-10 py-5 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <Headset className="w-6 h-6" />
              {siteDetails.pages.home.hero.secondaryButtonText}
            </a>
          </div>

          {/* Trust Badges / Social Proof */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-10 border-t border-outline-variant/30">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-slate-100">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="avatar" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-xs font-bold">
                500+
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-3.5 h-3.5 text-yellow-500 fill-current">★</div>
                ))}
                <span className="text-xs font-bold text-primary ml-1.5">4.9/5</span>
              </div>
              <p className="text-[11px] md:text-sm text-on-surface-variant font-medium leading-tight">
                Trusted by 500+ Indian <br className="sm:hidden" /> Businesses & Startups
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 aspect-square bg-slate-100">
            {/* Poster Image (shown while video is loading) */}
            <motion.img
              src={hasPosterError ? bundledHomeBannerPoster : posterSrc}
              alt="Loading Banner"
              initial={{ opacity: 1 }}
              animate={{ opacity: isVideoLoaded && !hasVideoError ? 0 : 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover z-20"
              onError={() => setHasPosterError(true)}
            />

            {/* Background Video */}
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
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded && !hasVideoError ? "opacity-100" : "opacity-0"}`}
            >
              <source src={webmSrc} type="video/webm" />
              <source src={mp4FallbackSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-multiply z-10"></div>
          </div>

          {/* Futuristic Floating Trust Badges */}
          <motion.div
            animate={{
              y: [0, -12, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -right-4 md:-right-8 bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-primary/5 z-30 flex items-center gap-3 transition-all hover:scale-105"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-tight leading-none mb-0.5">Government Authorized</p>
              <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest leading-none">Regulatory Verified</p>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 12, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-8 -left-4 md:-left-8 bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-xl border border-primary/5 z-30 flex flex-col items-center transition-all hover:scale-105"
          >
            <div className="flex items-baseline gap-0.5 mb-1.5">
              <span className="text-3xl font-headline font-black text-primary tracking-tighter">99.9</span>
              <span className="text-secondary text-lg font-black">%</span>
            </div>
            <div className="h-0.5 w-12 bg-secondary/30 rounded-full mb-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "95%" }}
                transition={{ duration: 2 }}
                className="h-full bg-secondary"
              />
            </div>
            <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] leading-none opacity-60">Compliance Success</p>
          </motion.div>

          {/* Decorative Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-primary/5 rounded-full -z-10 animate-[spin_30s_linear_infinite]"></div>
        </motion.div>
      </div>
    </section>
  );
};

const StatsBar = () => {
  const { data: siteDetails } = useCMS();
  const { stats } = siteDetails.pages.home;
  return (
    <div className="bg-white py-16 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-primary/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="text-4xl md:text-6xl lg:text-5xl font-headline font-extrabold text-primary mb-3 tabular-nums group-hover:scale-105 transition-transform duration-500">
                {typeof stat.value === 'number' ? (
                  <Counter value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span className="text-2xl md:text-3xl lg:text-2xl xl:text-3xl">{stat.value}</span>
                )}
              </div>
              <p className="text-on-surface-variant font-bold text-xs lg:text-[10px] uppercase tracking-[0.2em] opacity-60 leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Industry Trust Logos */}
        <div className="mt-24 pt-16 border-t border-outline-variant/30 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-12">
            {siteDetails.pages.home.statsTitle || "Strategic Industry Partners"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {[
              "FINANCE.CO",
              "CAPITAL_ONE",
              "GLOBAL_AUDIT",
              "TRUST_BANK",
              "VENTURE_X"
            ].map((logo) => (
              <motion.div
                key={logo}
                whileHover={{ scale: 1.1 }}
                className="text-xl md:text-2xl font-headline font-black tracking-tighter text-slate-300 hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CoreServices = () => {
  const { data: siteDetails } = useCMS();
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">{(siteDetails.pages.home as any).coreServices?.badge || "Comprehensive Expertise"}</span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-6">{(siteDetails.pages.home as any).coreServices?.title || "Our Core Services"}</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              {(siteDetails.pages.home as any).coreServices?.subtitle || "End-to-end financial and legal solutions designed to empower your business journey with absolute precision and clarity."}
            </p>
          </div>
          <AppLink to="/services" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-headline font-bold text-base shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0 group">
            View All Services
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </AppLink>
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
                            src={service.image}
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

const ProcessFlow = () => {
  const { data: siteDetails } = useCMS();
  const { process } = siteDetails.pages.home;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const steps = process.steps || [];

  // Animation mapping: finish early (at 0.8) to hold the final state
  const progressLineScale = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const logoPosition = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);
  const logoRotation = useTransform(scrollYProgress, [0.1, 0.8], [0, 1440]);

  const iconMap: { [key: string]: any } = { Search, FileStack, Microscope, Rocket };

  return (
    <section ref={containerRef} className="relative bg-[#F8F9FA] lg:h-[200vh]">
      <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background Watermark Logo - Inside Sticky Container */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none z-0">
          <img src={phinuraLogo} alt="" className="w-[500px] md:w-[800px] grayscale" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-headline font-extrabold text-primary mb-4 tracking-tight">
                {process.title}
              </h2>
              <p className="text-lg text-on-surface-variant opacity-80">
                {process.subtitle}
              </p>
            </motion.div>
          </div>

          <div className="relative pt-16">
            {/* Desktop Horizontal Line */}
            <div className="hidden lg:block absolute top-[2px] left-0 w-full h-[4px] bg-slate-200 z-0 rounded-full"></div>
            <motion.div
              style={{ scaleX: progressLineScale }}
              className="hidden lg:block absolute top-[2px] left-0 w-full h-[4px] bg-primary z-10 origin-left rounded-full"
            ></motion.div>

            {/* Rolling Logo Follower */}
            <motion.div
              style={{ left: logoPosition, rotate: logoRotation }}
              className="hidden lg:flex absolute top-[-22px] -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-2xl items-center justify-center p-2 z-30 border border-slate-100"
            >
              <img src={phinuraLogo} alt="Logo" className="w-full h-full object-contain" />
            </motion.div>

            {/* Mobile Vertical Line */}
            <div className="lg:hidden absolute left-8 top-0 bottom-0 w-[4px] bg-slate-200 z-0 rounded-full"></div>
            <motion.div
              style={{ scaleY: progressLineScale }}
              className="lg:hidden absolute left-8 top-0 bottom-0 w-[4px] bg-primary z-10 origin-top rounded-full"
            ></motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-0 w-full relative z-20">
              {steps.map((step: any, i: number) => {
                const Icon = iconMap[step.icon] || Rocket;

                // Optimized thresholds for 200vh height
                const stepStart = 0.1 + (i * 0.18);

                const boxBg = useTransform(scrollYProgress, [stepStart, stepStart + 0.08], ["#ffffff", "#001f49"]);
                const iconColor = useTransform(scrollYProgress, [stepStart, stepStart + 0.08], ["#001f49", "#ffffff"]);
                const opacity = useTransform(scrollYProgress, [stepStart, stepStart + 0.1], [0.6, 1]);
                const contentScale = useTransform(scrollYProgress, [stepStart, stepStart + 0.08, stepStart + 0.16], [1, 1.05, 1]);

                return (
                  <motion.div
                    key={i}
                    style={{ opacity }}
                    className="relative flex flex-col items-center text-center lg:px-6 pt-12"
                  >
                    {/* The Dot/Marker */}
                    <motion.div
                      style={{ backgroundColor: boxBg }}
                      className="absolute w-6 h-6 rounded-full border-4 border-white shadow-md z-40 left-7 lg:left-1/2 lg:-translate-x-1/2 top-[-11px]"
                    ></motion.div>

                    {/* Step Card Content */}
                    <motion.div
                      style={{ scale: contentScale }}
                      className="pl-20 lg:pl-0 flex flex-col items-center group w-full"
                    >
                      <div className="relative mb-8">
                        <div className="text-8xl font-black text-primary/10 absolute -top-12 -left-6 select-none transition-all group-hover:text-primary/20">
                          0{i + 1}
                        </div>
                        <motion.div
                          style={{ backgroundColor: boxBg, color: iconColor }}
                          className="w-20 h-20 rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-500 border border-slate-50 relative z-10"
                        >
                          <Icon size={32} />
                        </motion.div>
                      </div>

                      <h3 className="text-2xl font-headline font-black text-primary mb-2 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed opacity-80 max-w-[240px]">
                        {step.desc}
                      </p>
                    </motion.div>

                    {/* Vertical connecting line for mobile */}
                    {i < steps.length - 1 && (
                      <div className="lg:hidden absolute top-full left-8 h-12 w-[3px] bg-primary/20 mt-4"></div>
                    )}
                  </motion.div>
                );
              })}
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

  const iconMap: { [key: string]: any } = { ShieldCheck, Zap, CheckCircle2 };

  // Extra features to supplement CMS cards
  const extraFeatures = [
    { icon: Tag, title: "Transparent Pricing", desc: "No hidden charges. Clear, upfront fee structures for all professional engagements." },
    { icon: Clock, title: "Timely Delivery", desc: "We value your time. Strict adherence to deadlines for all compliance and advisory tasks." },
    { icon: UserSearch, title: "Personalized Solutions", desc: "Every business is unique. We tailor our services to meet your specific financial and legal needs." },
  ];

  // CMS cards come first, extras fill up to 5 total
  const allFeatures = [
    ...cards.map((c: any) => ({ icon: iconMap[c.icon] || CheckCircle2, title: c.title, desc: c.desc })),
    ...extraFeatures,
  ].slice(0, 5);

  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: office image + floating stat card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: "4/5" }}>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
                alt="Modern office"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute bottom-8 left-6 bg-primary text-white px-8 py-6 rounded-2xl shadow-2xl"
            >
              <div className="text-5xl font-headline font-extrabold leading-none">10+</div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200 mt-2">Years of Professionalism</div>
            </motion.div>
          </motion.div>

          {/* RIGHT: title + feature list */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-4 leading-tight">
              {whyChooseUs.title || "Why Choose Us?"}
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed mb-10 max-w-lg">
              {whyChooseUs.subtitle || "We are a team of highly qualified Chartered Accountants and Company Secretaries with over 10 years of experience dedicated to your success."}
            </p>

            <div className="space-y-6">
              {allFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start group"
                >
                  {/* Circular amber icon badge */}
                  <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors duration-300">
                    <f.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-primary mb-1">{f.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
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
  const reviews = testimonials;

  return (
    <section className="py-16 md:py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center">
          <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">{(siteDetails.pages.home as any).testimonialsTitle || "Trusted by Businesses Like Yours"}</h2>
          <p className="text-on-surface-variant">Real stories from entrepreneurs who grow with us.</p>
        </div>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...reviews, ...reviews].map((t, i) => (
            <div
              key={i}
              className="w-[400px] flex-shrink-0 bg-white p-10 rounded-[2rem] border border-outline-variant/10 shadow-sm relative group"
            >
              <Quote className="text-primary/5 w-20 h-20 absolute top-4 right-6 select-none group-hover:text-primary/10 transition-colors" />
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
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const { data: siteDetails } = useCMS();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary-container rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20"></div>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-6 relative z-10">
            {siteDetails.pages.home.cta.title}
          </h2>
          <p className="text-xl text-on-primary-container mb-12 max-w-2xl mx-auto relative z-10">
            {siteDetails.pages.home.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary text-white px-10 py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-secondary/20 hover:scale-105 transition-transform cursor-pointer text-center"
            >
              {siteDetails.pages.home.cta.buttonText}
            </a>
            <AppLink to="/services" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-colors cursor-pointer text-center">
              {siteDetails.pages.home.cta.secondaryButtonText}
            </AppLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <StatsBar />
      <CoreServices />
      <ProcessFlow />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </div>
  );
};
