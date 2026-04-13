import { motion } from "motion/react";
import { 
  ArrowRight,
  Send
} from "lucide-react";
import { Link } from "react-router-dom";
import { servicesData } from "../data/services";

const Hero = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-headline font-extrabold text-primary mb-8 leading-tight">
          Our Professional <span className="text-secondary">Services</span>
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed">
          Comprehensive financial architecture and compliance engineering for modern enterprises. From incorporation to global auditing, we secure your capital's integrity.
        </p>
      </motion.div>
    </div>
  </section>
);

const ServiceGrid = () => (
  <section className="pb-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((service, i) => (
          <Link
            to={`/services/${service.id}`}
            key={i}
            className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/10 flex flex-col h-full group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <service.icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-primary mb-4">{service.title}</h3>
            <p className="text-on-surface-variant leading-relaxed mb-8 flex-grow">{service.description}</p>
            <div className="w-full bg-primary text-white py-4 rounded-xl font-headline font-bold text-sm text-center hover:bg-primary-container transition-colors cursor-pointer">
              Get Started
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const StatsCTA = () => (
  <section className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="inline-block py-1 px-3 bg-secondary text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6">Business Owners</span>
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-8 leading-tight">
              Custom Solutions for Architects of Commerce.
            </h2>
            <p className="text-on-primary-container text-lg mb-12 max-w-xl">
              No two business structures are identical. We provide bespoke financial modeling and operational accounting designed specifically for your unique organizational goals.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-primary px-8 py-4 rounded-xl font-headline font-bold hover:bg-slate-100 transition-colors cursor-pointer">
                Request Bespoke Proposal
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-headline font-bold hover:bg-white/20 transition-colors cursor-pointer">
                View Case Studies
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Compliance Accuracy", value: "99.8%" },
              { label: "Assets Under Audit", value: "$4.2B" },
              { label: "Strategic Industries", value: "15+" },
              { label: "Inquiry Response", value: "24h" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                <div className="text-3xl font-headline font-extrabold text-secondary mb-2">{stat.value}</div>
                <div className="text-sm text-on-primary-container font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const FooterCTA = () => (
  <footer className="bg-slate-50 py-20 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <h4 className="text-lg font-bold text-primary mb-6">The Sovereign Ledger</h4>
        <p className="text-on-surface-variant text-sm leading-relaxed">Architecting financial futures with precision, integrity, and forward-thinking strategy.</p>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Services</h4>
        <ul className="space-y-4 text-sm text-on-surface-variant">
          <li><a href="#" className="hover:text-primary transition-colors">Tax Preparation</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Audit & Assurance</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Corporate Strategy</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Financial Planning</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Company</h4>
        <ul className="space-y-4 text-sm text-on-surface-variant">
          <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
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
  </footer>
);

export const Services = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ServiceGrid />
      <StatsCTA />
      <FooterCTA />
    </div>
  );
};
