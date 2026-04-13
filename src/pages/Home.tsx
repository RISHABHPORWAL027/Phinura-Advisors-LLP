import { motion } from "motion/react";
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

const Hero = () => (
  <section className="relative overflow-hidden pt-20 pb-32">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <span className="inline-block py-1 px-3 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-sm font-semibold mb-6">Expert Financial Guidance</span>
        <h1 className="text-5xl lg:text-7xl font-headline font-extrabold text-primary leading-[1.1] tracking-tighter mb-6">
          Your Trusted Partner for Taxes and Business Growth.
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-lg">
          We help you handle company registration, tax filings, and accounting with ease. Over 10 years of experience making compliance simple for business owners.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer">
            Get Free Consultation
          </button>
          <button className="bg-surface-container-highest text-on-primary-fixed-variant px-8 py-4 rounded-xl font-headline font-bold text-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors cursor-pointer">
            <Headset className="w-6 h-6" />
            Talk to an Expert
          </button>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10"
      >
        <img 
          alt="Financial Professional" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc2_UYhj9LkuLpCwZIoGD9DrRGi4JK_9h7wt9xmwISuIZLfglKkHYvzdva371ta6W2tmIsxK1CNvq6OMqF8IPc8-OxlN8h2dHmjIYiY1kxyj6crskrw4FImLj-I0SnFzUI-d-8mDDJsoqVrzRY5396aBI3MNRxedlTKABg3PUh4vguO01Tg6cDv_FEtXqMH8O3nNfk9KWEy6OSQ3SoHxlDViIzGH50N7BT2WRdJAQD7zoWAy_pE0skcPys9bqYqSCmpyAB-FascC_h" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
      </motion.div>
    </div>
    
    <div className="mt-24 bg-surface-container-low py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Years Experience", value: "10+" },
          { label: "Happy Clients", value: "500+" },
          { label: "Annual Filings", value: "1000+" },
          { label: "Pan-India", value: "Presence" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-headline font-extrabold text-primary mb-1">{stat.value}</div>
            <div className="text-on-surface-variant font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CoreServices = () => {
  return (
    <section className="py-24 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Comprehensive Expertise</span>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-6">Our Core Services</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">End-to-end financial and legal solutions designed to empower your business journey with absolute precision and clarity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.slice(0, 6).map((service, i) => (
            <Link 
              to={`/services/${service.id}`}
              key={i}
              className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                <service.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-primary mb-4">{service.title}</h3>
              <p className="text-on-surface-variant mb-6 line-clamp-2">{service.description}</p>
              <div className="inline-flex items-center font-bold text-primary group/link">
                View Details
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/link:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const SimpleSolutions = () => (
  <section className="py-24 bg-surface">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-4">Simple Solutions for You</h2>
          <p className="text-on-surface-variant max-w-xl">We cut through the legal jargon so you can focus on what matters—growing your dream business.</p>
        </div>
        <a className="text-primary font-bold flex items-center gap-2 group underline-offset-4 hover:underline" href="#">
          View All Services 
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Start Your Business", icon: Rocket, color: "bg-primary-fixed", text: "text-primary", desc: "Full support for GST registration, PVT LTD incorporation, and shop licenses.", items: ["Easy Documentation", "Fast Turnaround"] },
          { title: "Handle Your Taxes", icon: Wallet, color: "bg-secondary-fixed", text: "text-secondary", desc: "Expert Income Tax and GST filing that keeps you on the right side of the law.", items: ["Maximize Savings", "Error-Free Filings"] },
          { title: "Track Your Growth", icon: LineChart, color: "bg-tertiary-fixed", text: "text-on-tertiary-fixed-variant", desc: "Monthly accounting and bookkeeping to help you understand your numbers better.", items: ["Monthly Reports", "24/7 Dashboard"] },
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-surface-container-lowest p-8 rounded-2xl group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center ${card.text} mb-8 group-hover:scale-110 transition-transform`}>
              <card.icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-primary mb-4">{card.title}</h3>
            <p className="text-on-surface-variant leading-relaxed mb-6">{card.desc}</p>
            <ul className="space-y-3 mb-8">
              {card.items.map((item, j) => (
                <li key={j} className="flex items-center gap-2 text-sm font-medium text-on-surface">
                  <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary/10" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const WhyChooseUs = () => (
  <section className="py-24 bg-surface-container-low">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">Why Business Owners Choose Us</h2>
        <p className="text-on-surface-variant">We're more than just consultants; we're your growth partners.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[500px]">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-8 bg-primary rounded-3xl p-10 flex flex-col justify-between text-on-primary"
        >
          <div>
            <ShieldCheck className="w-12 h-12 mb-6 opacity-80" />
            <h3 className="text-3xl font-headline font-bold mb-4">A Decade of Trust</h3>
            <p className="text-on-primary-container text-lg max-w-md">10 years of handling complex Indian regulations for startups and legacy brands alike. We've seen it all and solved it all.</p>
          </div>
          <div className="flex -space-x-3 mt-8">
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
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-4 bg-secondary-fixed rounded-3xl p-8 flex flex-col justify-center text-on-secondary-fixed-variant"
        >
          <ArrowRightLeft className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-headline font-bold mb-2">No Hidden Fees</h3>
          <p className="text-on-secondary-fixed opacity-80">Transparent pricing from day one. You only pay for what you need.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-4 bg-surface-container-highest rounded-3xl p-8 flex flex-col justify-center"
        >
          <Zap className="w-10 h-10 mb-4 text-primary" />
          <h3 className="text-xl font-headline font-bold mb-2 text-primary">Swift Support</h3>
          <p className="text-on-surface-variant">Instant WhatsApp and email updates on your application status.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-8 bg-surface-container-lowest rounded-3xl p-8 flex items-center gap-8"
        >
          <div className="hidden sm:block w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/team/300/300" 
              alt="Team"
            />
          </div>
          <div>
            <h3 className="text-xl font-headline font-bold text-primary mb-2">Friendly Language</h3>
            <p className="text-on-surface-variant">We explain compliance in plain English and Hindi, not legalese.</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-24 bg-surface overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">Trusted by Businesses Like Yours</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {[
          { name: "Ankit Sharma", role: "Founder, TechSprint Solutions", quote: "They made my company registration so easy! I was worried about the paperwork, but they handled everything in just 10 days." },
          { name: "Priya Verma", role: "Owner, Bloom Boutique", quote: "GST filings used to be a headache every month. Now, it's just one text away. Their team is extremely professional and polite." },
        ].map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="flex-1 bg-surface-container p-10 rounded-3xl relative"
          >
            <Quote className="text-primary/10 w-24 h-24 absolute top-6 right-8 select-none" />
            <div className="flex gap-1 text-secondary mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Zap key={s} className="w-5 h-5 fill-secondary" />
              ))}
            </div>
            <p className="text-xl font-medium text-primary italic mb-10 leading-relaxed relative z-10">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-300"></div>
              <div>
                <div className="font-bold text-primary">{t.name}</div>
                <div className="text-sm text-on-surface-variant">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="py-24 bg-surface">
    <div className="max-w-5xl mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary-container rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20"></div>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-6 relative z-10">
          Ready to grow your business?
        </h2>
        <p className="text-xl text-on-primary-container mb-12 max-w-2xl mx-auto relative z-10">
          Let us handle the paperwork while you focus on your customers. Your first consultation is completely free.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button className="bg-secondary text-white px-10 py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-secondary/20 hover:scale-105 transition-transform cursor-pointer">
            Schedule Free Call
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-colors cursor-pointer">
            View Pricing
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CoreServices />
      <SimpleSolutions />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </div>
  );
};
