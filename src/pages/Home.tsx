import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
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
  Headset
} from "lucide-react";
import { Link } from "react-router-dom";
import { servicesData } from "../data/services";
import siteDetails from "../data/siteDetails.json";

import homeBanner from "../Assets/homebanner.webm";
import bannerPoster from "../Assets/BANNERPREVIEW.png";

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

import { useState } from "react";

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-40 bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-[10rem] -z-10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -z-10 blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
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
            Architects of <br />
            <span className="text-secondary italic">Financial Integrity.</span>
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
              Get Free Quote
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary border border-outline-variant/30 px-10 py-5 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <Headset className="w-6 h-6" />
              Talk to Expert
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
              src={bannerPoster}
              alt="Loading Banner"
              initial={{ opacity: 1 }}
              animate={{ opacity: isVideoLoaded ? 0 : 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover z-20"
            />

            {/* Background Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              <source src={homeBanner} type="video/webm" />
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
  const { stats } = siteDetails.pages.home;
  return (
    <div className="bg-white py-16 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-primary/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="text-4xl md:text-6xl font-headline font-extrabold text-primary mb-3 tabular-nums group-hover:scale-105 transition-transform duration-500">
                {typeof stat.value === 'number' ? (
                  <Counter value={stat.value} suffix={stat.suffix} />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-[0.2em] opacity-60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Industry Trust Logos */}
        <div className="mt-24 pt-16 border-t border-outline-variant/30 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-12">Strategic Industry Partners</p>
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
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Comprehensive Expertise</span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-6">Our Core Services</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              {(siteDetails.pages.home as any).coreServices?.subtitle || "End-to-end financial and legal solutions designed to empower your business journey with absolute precision and clarity."}
            </p>
          </div>
          <Link to="/services" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-headline font-bold text-base shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0 group">
            View All Services
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.slice(0, 6).map((service, i) => (
            <Link
              to={`/services/${service.id}`}
              key={i}
              className="group relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -10,
                  rotateX: 2,
                  rotateY: 2,
                  transition: { duration: 0.3 }
                }}
                viewport={{ once: true }}
                style={{ transformStyle: "preserve-3d" }}
                className="h-full bg-white p-10 rounded-[2.5rem] border border-outline-variant/30 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div
                  className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <service.icon className="w-8 h-8" />
                </div>
                <h3
                  className="text-2xl font-headline font-bold text-primary mb-4"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {service.title}
                </h3>
                <p className="text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">{service.description}</p>
                <div
                  className="inline-flex items-center font-bold text-primary group/link"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <span className="border-b-2 border-primary/0 group-hover:border-primary transition-all">View Details</span>
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/link:translate-x-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const SimpleSolutions = () => {
  const { simpleSolutions } = siteDetails.pages.home;

  const iconMap: { [key: string]: any } = {
    Rocket,
    Wallet,
    LineChart
  };

  return (
    <section className="py-16 md:py-24 bg-surface-container-low relative overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-4">{simpleSolutions.title}</h2>
            <p className="text-on-surface-variant">{simpleSolutions.subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {simpleSolutions.items.map((card: any, i: number) => {
            const Icon = iconMap[card.icon] || Rocket;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -12,
                  rotateX: 2,
                  rotateY: 2,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                viewport={{ once: true }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-white p-10 rounded-[2.5rem] group border border-outline-variant/30 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden"
              >
                {/* Animated card background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center ${card.text} mb-8 group-hover:scale-110 transition-transform shadow-lg`}
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3
                    className="text-2xl font-headline font-bold text-primary mb-4"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed mb-6">{card.desc}</p>
                  <ul className="space-y-4 mb-8">
                    {card.features.map((item: string, j: number) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-medium text-on-surface">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <motion.div
                    className="pt-6 border-t border-outline-variant/30 flex items-center justify-between"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Learn More</span>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const { whyChooseUs } = siteDetails.pages.home;

  const iconMap: { [key: string]: any } = {
    ShieldCheck,
    Zap,
    CheckCircle2
  };

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">{whyChooseUs.title}</h2>
          <p className="text-on-surface-variant">{whyChooseUs.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Card 1: Decade of Trust */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ rotateX: 2, rotateY: 2, y: -5 }}
            viewport={{ once: true }}
            style={{ transformStyle: "preserve-3d" }}
            className="md:col-span-8 bg-primary rounded-[2.5rem] p-10 flex flex-col justify-between text-on-primary relative overflow-hidden group shadow-xl hover:shadow-primary/20 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors"></div>
            <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
              {(() => {
                const Icon = iconMap[whyChooseUs.cards[0].icon];
                return <Icon className="w-12 h-12 mb-6 opacity-80" />;
              })()}
              <h3 className="text-3xl font-headline font-bold mb-4">{whyChooseUs.cards[0].title}</h3>
              <p className="text-blue-100 text-lg max-w-md opacity-90 leading-relaxed">{whyChooseUs.cards[0].desc}</p>
            </div>
            <div className="flex items-center gap-6 mt-8 relative z-10" style={{ transform: "translateZ(40px)" }}>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((n) => (
                  <img
                    key={n}
                    className="w-12 h-12 rounded-full border-2 border-primary"
                    referrerPolicy="no-referrer"
                    src={`https://picsum.photos/seed/user${n}/100/100`}
                    alt="User"
                  />
                ))}
                <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold border-2 border-primary">+497</div>
              </div>
              <span className="text-sm font-medium text-blue-100">{whyChooseUs.cards[0].trustedText}</span>
            </div>
          </motion.div>

          {/* Card 2: Swift Support */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ rotateX: -2, rotateY: -2, y: -5 }}
            viewport={{ once: true }}
            style={{ transformStyle: "preserve-3d" }}
            className="md:col-span-4 bg-surface-container-highest rounded-[2.5rem] p-10 flex flex-col justify-center border border-outline-variant/30 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-2xl"
          >
            <div style={{ transform: "translateZ(30px)" }}>
              {(() => {
                const Icon = iconMap[whyChooseUs.cards[1].icon];
                return <Icon className="w-10 h-10 mb-6 text-primary" />;
              })()}
              <h3 className="text-2xl font-headline font-bold mb-4 text-primary">{whyChooseUs.cards[1].title}</h3>
              <p className="text-on-surface-variant leading-relaxed mb-8">{whyChooseUs.cards[1].desc}</p>
              <div className="text-primary font-bold flex items-center gap-2">
                Learn More <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Friendly Language */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ rotateX: 1, y: -5 }}
            viewport={{ once: true }}
            style={{ transformStyle: "preserve-3d" }}
            className="md:col-span-12 bg-primary-fixed/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 border border-primary-fixed/50 transition-all duration-500 hover:bg-primary-fixed/30"
          >
            <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 shadow-xl" style={{ transform: "translateZ(20px)" }}>
              <img
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                src={whyChooseUs.cards[2].img}
                alt="Team"
              />
            </div>
            <div style={{ transform: "translateZ(30px)" }}>
              <h3 className="text-2xl font-headline font-bold text-primary mb-3">{whyChooseUs.cards[2].title}</h3>
              <p className="text-on-surface-variant text-lg">{whyChooseUs.cards[2].desc} Understanding your obligations should be the easiest part of your day.</p>
            </div>
            <div className="flex-grow"></div>
            {(() => {
              const Icon = iconMap[whyChooseUs.cards[2].icon];
              return <Icon className="w-16 h-16 text-primary/20 hidden lg:block" />;
            })()}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { testimonials } = siteDetails.pages.home;
  const reviews = testimonials;

  return (
    <section className="py-16 md:py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center">
          <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">Trusted by Businesses Like Yours</h2>
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
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center font-bold text-primary">
                  {t.name.charAt(0)}
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

const FinalCTA = () => (
  <section className="py-24 bg-white">
    <div className="max-w-5xl mx-auto px-6">
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
            Schedule Free Call
          </a>
          <Link to="/services" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-colors cursor-pointer text-center">
            View Pricing
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <StatsBar />
      <CoreServices />
      <SimpleSolutions />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </div>
  );
};
