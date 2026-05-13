import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Quote,
  ShieldCheck
} from "lucide-react";
import { AppLink } from "../navigation/AppLink";
import { useCMS } from "../hooks/useCMS";
import { resolveLucideIcon } from "../utils/lucideIconMap";
import { CtaImageCard } from "../components/CtaImageCard";

const Counter = ({ value, suffix = "", prefix = "", decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 60,
  });
  const displayValue = useTransform(springValue, (latest) =>
    latest.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

const Hero = ({ hero }: { hero: any }) => {
  return (
    <section className="relative pt-32 pb-48 md:pt-48 md:pb-60 bg-[#0D1B2A] overflow-hidden">
      {/* Immersive Architectural Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10"></div>
        <img
          src={hero.bgImage || "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=2000"}
          alt="Architectural Background"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A] via-[#0D1B2A]/80 to-transparent"></div>
        {/* Bottom fade that merges with the white section below */}
        <div className="absolute bottom-0 left-0 w-full h-[10%] bg-gradient-to-t from-white via-white/80 to-transparent z-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {hero.badge && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] mb-10"
            >
              {hero.badge}
            </motion.span>
          )}
          <h1 className="text-6xl md:text-8xl font-headline font-extrabold text-white mb-8 leading-[0.95] tracking-tight whitespace-pre-line">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 max-w-2xl font-light">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-6 mb-20">
            <AppLink
              to="/contact"
              className="bg-secondary text-white px-12 py-5 rounded-2xl font-headline font-bold text-xl hover:scale-105 transition-transform flex items-center gap-2 group shadow-2xl shadow-secondary/20"
            >
              Start Your Project
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </AppLink>
            <AppLink
              to="/pricing"
              className="bg-white/5 border border-white/10 backdrop-blur-md text-white px-12 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/10 transition-all text-center"
            >
              Fee Structure
            </AppLink>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

/* ─── Service Intro ─────────────────────────────────────────────────────── */
const ServiceIntro = ({ services }: { services: any }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-8">
              <ShieldCheck size={14} />
              Operational Excellence
            </span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-[#0D1B2A] mb-8 leading-tight">
              {services.introTitle || "A Wide Range of Strategic Solutions."}
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed opacity-80 mb-10">
              <p>
                {services.introContent1 || "At Phinura Advisors, we provide a comprehensive suite of financial architecture and compliance engineering services designed to navigate the complexities of modern global commerce."}
              </p>
              <p>
                {services.introContent2 || "From meticulous statutory audits to complex cross-border taxation strategies, our approach is built on precision, integrity, and a deep understanding of regulatory frameworks. We don't just solve problems; we engineer systems that prevent them."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-outline-variant/30">
              <div>
                <h4 className="text-3xl font-headline font-bold text-primary mb-1">100+</h4>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Global Clients</p>
              </div>
              <div>
                <h4 className="text-3xl font-headline font-bold text-primary mb-1">98%</h4>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Compliance Accuracy</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-square relative z-10">
              <img
                src={services.introImage || "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80&w=1000"}
                alt="Architecture and Precision"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply opacity-70 animate-pulse z-0"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply opacity-70 animate-pulse delay-700 z-0"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ServiceGrid = ({ services }: { services: any[] }) => (
  <section className="bg-white pb-32 relative z-40">
    <div className="max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">Our Comprehensive Range of Services</h2>
          <p className="text-on-surface-variant text-lg opacity-70">Expertly engineered financial solutions tailored to your unique corporate structure and growth trajectory.</p>
        </div>
        <div className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-2 font-bold">
          Strategic Divisions
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, i) => {
          const Icon = resolveLucideIcon(service.icon) || CheckCircle2;
          return (
            <AppLink
              to={`/services/${service.id}`}
              key={i}
              className="group h-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative h-full flex flex-col"
              >
                {/* Image Section Wrapper */}
                <div className="relative aspect-[16/10]">
                  {/* Actual Image with its own overflow clipping */}
                  <div className="absolute inset-0 rounded-t-[2.5rem] overflow-hidden">
                    <img
                      src={service.image || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600"}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-primary px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.15em] shadow-sm z-20">
                    {service.category}
                  </div>

                  {/* Floating Icon Box */}
                  <div className="absolute -bottom-7 left-8 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 z-30 border border-slate-50">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-12 flex flex-col flex-grow">
                  <h3 className="text-2xl font-headline font-bold text-primary mb-4 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-on-surface-variant text-base leading-relaxed mb-8 flex-grow opacity-70">
                    {service.description}
                  </p>

                  <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center">
                    <span className="font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                      View Details
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </AppLink>
          );
        })}
      </div>
    </div>
  </section>
);

const StatsCTA = ({ statsCTA, siteDetails }: { statsCTA: any, siteDetails: any }) => {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/25 md:rounded-[4rem]"
        >
          <CtaImageCard className="rounded-[2.5rem] text-white md:rounded-[4rem]" contentClassName="p-10 md:p-24">
          <div className="relative">
          {/* Decorative mandala-like background */}
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10">
            <div className="w-[600px] h-[600px] border border-white rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[400px] h-[400px] border border-white rounded-full rotate-45"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-8 leading-[1.1]">
                Ready to secure your fiscal future?
              </h2>
              <p className="text-blue-100/80 text-xl mb-12 max-w-xl">
                Speak with our senior partners to design a compliance framework that supports your vision.
              </p>
              <div className="flex flex-wrap gap-6 text-center">
                <a
                  href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary text-white px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:scale-105 transition-transform shadow-xl shadow-secondary/20 inline-block"
                >
                  Schedule Discovery Call
                </a>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-all">
                  Download Brochure
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:pl-12">
              {statsCTA.stats.slice(0, 2).map((stat: any, i: number) => (
                <div key={i} className="text-left py-6 border-l border-white/20 pl-8">
                  <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white tabular-nums">
                    <Counter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                    />
                  </div>
                  <p className="text-blue-100/60 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          </div>
          </CtaImageCard>
        </motion.div>
      </div>
    </section>
  );
};

export const Services = () => {
  const { data, loading } = useCMS();

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero hero={data.pages.services.hero} />
      {/* <ServiceIntro services={data.pages.services} /> */}
      <ServiceGrid services={data.pages.services.serviceList} />
      <StatsCTA statsCTA={data.pages.services.statsCTA} siteDetails={data} />
    </div>
  );
};
