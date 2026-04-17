import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { AppLink } from "../navigation/AppLink";
import { Heart, Lightbulb, ShieldCheck, ArrowRight } from "lucide-react";
import { useCMS } from "../hooks/useCMS";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
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

const Hero = () => {
  const { data: siteDetails } = useCMS();
  const { hero } = siteDetails.pages.about;
  return (
    <section className="pt-24 pb-20 md:pt-40 md:pb-28 bg-white selection:bg-primary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 order-2 md:order-1"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold uppercase tracking-widest mb-8 border border-secondary/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              {hero.badge}
            </span>
            <h1 className="text-6xl md:text-8xl font-headline font-extrabold text-primary mb-10 leading-[1.1] tracking-tight">
              {hero.title.split('legacy')[0]} <span className="text-secondary italic">legacy.</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant mb-12 leading-relaxed opacity-90 max-w-xl">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <AppLink to="/contact" className="bg-primary text-white px-10 py-5 rounded-2xl font-headline font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all text-center">
                {siteDetails.pages.home.hero.buttonText}
              </AppLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative order-1 md:order-2"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
              <img
                src={hero.image}
                alt="Our Workspace"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
            </div>
            {/* Elevated Stat Badge */}
            <div className="absolute -bottom-6 left-4 right-4 md:right-auto md:-left-10 bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-outline-variant/20 md:max-w-xs transition-all hover:-translate-y-2">
              <div className="text-4xl font-headline font-extrabold text-primary mb-1 tabular-nums">
                <Counter value={10} suffix="+" />
              </div>
              <p className="text-secondary font-bold text-xs uppercase tracking-widest leading-tight">Years Designing Financial Freedom</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Story = () => {
  const { data: siteDetails } = useCMS();
  const { story } = siteDetails.pages.about;
  return (
    <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl font-headline font-extrabold text-primary mb-6">{story.title}</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            {story.content}
          </p>
        </div>
      </div>
    </section>
  );
};

const Values = () => {
  const { data: siteDetails } = useCMS();
  const { values, principles } = siteDetails.pages.about;
  const iconMap: { [key: string]: any } = {
    Heart,
    Lightbulb,
    ShieldCheck
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-headline font-extrabold text-primary mb-4 tracking-tight">{principles.title}</h2>
          <p className="text-on-surface-variant max-w-xl">{principles.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item: any, i: number) => {
            const Icon = iconMap[item.icon] || Heart;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ rotateX: 2, rotateY: 2, y: -8 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-white p-10 rounded-[2.5rem] border border-outline-variant/30 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div 
                  className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 
                  className="text-2xl font-headline font-bold text-primary mb-4"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {item.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed opacity-80">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const People = () => {
  const { data: siteDetails } = useCMS();
  const { people } = siteDetails.pages.about;
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">{people.title}</h2>
            <p className="text-on-surface-variant text-lg">{people.subtitle}</p>
          </div>
          <AppLink to="/contact" className="flex items-center gap-2 font-bold text-primary group">
            Join our team <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </AppLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {people.team.map((person: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] mb-6 shadow-xl group-hover:shadow-primary/20 transition-all duration-500">
                <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-headline font-bold text-primary mb-1">{person.name}</h3>
              <p className="text-secondary text-xs font-bold tracking-widest mb-4 uppercase">{person.role}</p>
              <p className="text-on-surface-variant text-sm leading-relaxed">{person.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { data: siteDetails } = useCMS();
  const { cta } = siteDetails.pages.about;
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <h2 className="text-4xl md:text-6xl font-headline font-extrabold text-white mb-8 relative z-10">
            {cta.title}
          </h2>
          <p className="text-xl text-on-primary-container mb-12 max-w-2xl mx-auto relative z-10">
            {cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <a 
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary text-white px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:scale-105 transition-transform cursor-pointer text-center"
            >
              {cta.buttonText}
            </a>
            <AppLink to="/contact" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-colors cursor-pointer text-center">
              {cta.secondaryButtonText}
            </AppLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const About = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Story />
      <Values />
      <People />
      <CTA />
    </div>
  );
};
