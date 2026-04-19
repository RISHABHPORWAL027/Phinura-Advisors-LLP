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
  Briefcase 
} from "lucide-react";
import { useCMS } from "../hooks/useCMS";

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
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-[#0D1B2A] mb-8 leading-[1.1] tracking-tight">
              {hero.title}
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant mb-12 leading-relaxed opacity-80 max-w-xl">
              {hero.subtitle}
            </p>
            <AppLink
              to="/contact"
              className="bg-[#0D1B2A] text-white px-12 py-5 rounded-lg font-headline font-bold text-lg hover:bg-opacity-90 transition-all text-center inline-block"
            >
              Get Started
            </AppLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/3]">
              <img
                src={hero.image}
                alt="Architectural Building"
                className="w-full h-full object-cover"
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
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-8">
              <Briefcase size={14} />
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-[#0D1B2A] mb-8 leading-tight">
              {story.title}
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed opacity-80">
              <p>{story.content}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                src={story.image || "https://images.unsplash.com/photo-1556155092-490a1ba16284"}
                alt="Phinura Story"
                className="w-full h-full object-cover"
              />
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
  const missions = missionVision.missions || [missionVision.mission];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMission((prev: number) => (prev + 1) % missions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [missions.length]);

  return (
    <section className="py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Mission Card - Autoplay Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white p-12 md:p-16 rounded-[2rem] shadow-sm flex flex-col justify-center border border-slate-100 relative min-h-[400px]"
          >
            <Building2 className="w-10 h-10 text-primary mb-8" />
            <h3 className="text-3xl font-headline font-bold text-primary mb-6">Our Mission</h3>
            
            <div className="relative overflow-hidden h-32 md:h-24">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMission}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-on-surface-variant leading-relaxed opacity-80 absolute"
                >
                  {missions[currentMission]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Pagination dots */}
            <div className="flex gap-2 mt-12">
              {missions.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentMission(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    currentMission === i ? "w-10 bg-slate-400" : "w-4 bg-slate-200"
                  }`}
                />
              ))}
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
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
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

        {/* Small Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v: any, i: number) => {
            const Icon = iconMap[v.icon] || ShieldCheck;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white p-10 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-start"
              >
                <div className="mb-6 rounded-lg p-2 bg-[#F8F9FA]">
                  <Icon className="w-6 h-6 text-orange-700" />
                </div>
                <h4 className="text-xl font-headline font-bold text-primary mb-3">{v.title}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed opacity-70">
                  {v.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─── Architectural Board (Team) ────────────────────────────────────────── */
const People = () => {
  const { data: siteDetails } = useCMS();
  const { people } = siteDetails.pages.about;
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-6">
          {people.title}
        </h2>
        <p className="text-on-surface-variant text-lg max-w-3xl mx-auto mb-20 opacity-70">
          {people.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {people.team.map((person: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-left group"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-6 shadow-lg">
                <img 
                  src={person.img} 
                  alt={person.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h3 className="text-lg font-headline font-bold text-primary mb-1">{person.name}</h3>
              <p className="text-secondary text-[10px] font-bold tracking-widest uppercase opacity-80">
                {person.role}
              </p>
            </motion.div>
          ))}
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
          className="bg-primary rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold text-white mb-8 leading-[1.1]">
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
          </div>
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
      <People />
      <CTA />
    </div>
  );
};
