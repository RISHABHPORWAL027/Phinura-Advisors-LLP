import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Send,
  CheckCircle2,
  TrendingUp,
  Quote
} from "lucide-react";
import { AppLink } from "../navigation/AppLink";
import { useCMS } from "../hooks/useCMS";
import { resolveLucideIcon } from "../utils/lucideIconMap";
import logo from "../Assets/Phinura_Advisors_logo.png";
import { DeveloperCredit } from "../components/DeveloperCredit";

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
    <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold text-primary mb-8 leading-tight">
            {hero.title.split('Services')[0]} <span className="text-secondary">Services</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            {hero.subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceGrid = ({ services }: { services: any[] }) => (
  <section className="py-16 md:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, i) => {
          const Icon = resolveLucideIcon(service.icon) || CheckCircle2;
          return (
            <AppLink
              to={`/services/${service.id}`}
              key={i}
              className="group relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -12,
                  rotateX: 2,
                  rotateY: 2,
                  scale: 1.01,
                  transition: { duration: 0.3 }
                }}
                viewport={{ once: true, margin: "-50px" }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-white p-10 rounded-[2.5rem] border border-outline-variant/10 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-colors transition-shadow duration-500 h-full flex flex-col"
              >
                <div
                  className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3
                  className="text-2xl font-headline font-bold text-primary mb-4"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {service.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-8 flex-grow opacity-80">{service.description}</p>
                <div
                  className="inline-flex items-center font-bold text-primary group/link border-t border-outline-variant/30 pt-6"
                  style={{ transform: "translateZ(10px)" }}
                >
                  Explore Service
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/link:translate-x-1" />
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
          className="bg-primary rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <span className="inline-block py-1 px-3 bg-secondary text-white rounded-full text-[10px] font-bold uppercase tracking-wider mb-6">
                {statsCTA.badge}
              </span>
              <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-8 leading-tight">
                {statsCTA.title}
              </h2>
              <p className="text-blue-100 text-lg mb-12 max-w-xl opacity-90">
                {statsCTA.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-primary px-8 py-4 rounded-xl font-headline font-bold hover:bg-slate-50 transition-colors shadow-lg shadow-white/10 cursor-pointer inline-block"
                >
                  {statsCTA.buttonText}
                </a>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-headline font-bold hover:bg-white/20 transition-colors cursor-pointer">
                  {statsCTA.secondaryButtonText}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {statsCTA.stats.map((stat: any, i: number) => (
                <div key={i} className="text-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="text-3xl md:text-4xl font-headline font-extrabold mb-2 text-white tabular-nums">
                    <Counter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                    />
                  </div>
                  <p className="text-blue-100 text-sm font-medium opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FooterCTA = ({ siteDetails }: { siteDetails: any }) => (
  <footer className="bg-slate-50 py-16 md:py-20 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <AppLink to="/" className="flex items-center gap-2 mb-6 group">
          <img src={logo} alt={siteDetails.companyName} className="h-8 w-auto logo-img" />
          <span className="text-lg font-bold text-primary">{siteDetails.companyName}</span>
        </AppLink>
        <p className="text-on-surface-variant text-sm leading-relaxed">{siteDetails.tagline}</p>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Services</h4>
        <ul className="space-y-4 text-sm text-on-surface-variant">
          <li><AppLink to="/services" className="hover:text-primary transition-colors">Tax Preparation</AppLink></li>
          <li><AppLink to="/services" className="hover:text-primary transition-colors">Audit & Assurance</AppLink></li>
          <li><AppLink to="/services" className="hover:text-primary transition-colors">Corporate Strategy</AppLink></li>
          <li><AppLink to="/services" className="hover:text-primary transition-colors">Financial Planning</AppLink></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Company</h4>
        <ul className="space-y-4 text-sm text-on-surface-variant">
          <li><AppLink to="/about" className="hover:text-primary transition-colors">About</AppLink></li>
          <li><AppLink to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</AppLink></li>
          <li><AppLink to="/terms" className="hover:text-primary transition-colors">Terms of Service</AppLink></li>
          <li><AppLink to="/contact" className="hover:text-primary transition-colors">Contact</AppLink></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Newsletter</h4>
        <p className="text-sm text-on-surface-variant mb-4">The Quarterly Ledger: Financial insights directly to your inbox.</p>
        <div className="flex gap-2">
          <input type="email" placeholder="Email address" className="bg-white border-0 rounded-xl px-4 py-3 w-full text-sm shadow-sm focus:ring-2 focus:ring-primary" />
          <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary-container transition-colors cursor-pointer">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-slate-400 text-xs">© {new Date().getFullYear()} {siteDetails.fullName}. All rights reserved.</p>
      <DeveloperCredit />
    </div>
  </footer>
);

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
      <ServiceGrid services={data.pages.services.serviceList} />
      <StatsCTA statsCTA={data.pages.services.statsCTA} siteDetails={data} />
      <FooterCTA siteDetails={data} />
    </div>
  );
};
