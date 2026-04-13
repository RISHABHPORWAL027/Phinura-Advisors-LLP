import { motion } from "motion/react";
import { Heart, Lightbulb, ShieldCheck, ArrowRight } from "lucide-react";

const Hero = () => (
  <section className="relative pt-20 pb-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block py-1 px-3 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-bold uppercase tracking-wider mb-6">Who We Are</span>
        <h1 className="text-5xl lg:text-7xl font-headline font-extrabold text-primary leading-[1.1] tracking-tighter mb-6">
          Partners in your <span className="text-secondary">financial legacy.</span>
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-lg">
          At The Sovereign Ledger, we've replaced complex jargon with clear paths forward. We're not just accountants and secretaries; we're your dedicated financial architects, helping you build something that lasts.
        </p>
        <div className="flex items-center gap-4 p-4 bg-primary-fixed/30 rounded-2xl border border-primary-fixed/50">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-primary font-semibold">Committed to your growth, not just your filings.</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img 
            src="https://picsum.photos/seed/office-meeting/800/600" 
            alt="Team Meeting" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl border border-outline-variant/20 max-w-xs">
          <div className="text-4xl font-headline font-extrabold text-primary mb-2">15+</div>
          <p className="text-on-surface-variant font-medium">Years of helping families and founders secure their futures.</p>
        </div>
      </motion.div>
    </div>
  </section>
);

const Story = () => (
  <section className="py-24 bg-surface-container-low">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <h2 className="text-4xl font-headline font-extrabold text-primary mb-6">Our Story</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          We started in a small room with a big idea: that financial clarity shouldn't be a luxury reserved for giant corporations. Our founder believed that every business owner deserves a partner who cares as much about their success as they do.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Heart-First Approach", icon: Heart, desc: "We listen to your dreams before we look at your spreadsheets. Understanding your 'why' is our first priority." },
          { title: "Clarity Over Jargon", icon: Lightbulb, desc: "We break down complex regulations into actionable advice you can actually use to grow your business." },
          { title: "Steadfast Integrity", icon: ShieldCheck, desc: "Trust is our currency. We maintain the highest standards of ethics so you can sleep soundly at night." },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary mb-8">
              <item.icon className="w-6 h-6 fill-secondary/20" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-primary mb-4">{item.title}</h3>
            <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const People = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-xl">
          <h2 className="text-4xl font-headline font-extrabold text-primary mb-4">Our People</h2>
          <p className="text-on-surface-variant text-lg">A collective of specialists, strategists, and supporters dedicated to your journey.</p>
        </div>
        <a href="#" className="flex items-center gap-2 font-bold text-primary group">
          Join our team <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { name: "Julian Thorne", role: "PRINCIPAL CHARTERED ACCOUNTANT", desc: "Julian founded the firm with a vision to humanize financial services. He specializes in wealth architecture for families.", img: "https://picsum.photos/seed/julian/400/500" },
          { name: "Elena Rodriguez", role: "SENIOR COMPANY SECRETARY", desc: "Elena ensures our clients stay ahead of the curve. She treats every client's business as if it were her own venture.", img: "https://picsum.photos/seed/elena/400/500" },
          { name: "Marcus Chen", role: "TAX STRATEGY LEAD", desc: "Marcus brings a calm, analytical approach to complex tax puzzles, always looking for the most efficient path forward.", img: "https://picsum.photos/seed/marcus/400/500" },
        ].map((person, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="rounded-3xl overflow-hidden mb-8 aspect-[4/5]">
              <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-primary mb-1">{person.name}</h3>
            <p className="text-secondary font-bold text-xs tracking-widest uppercase mb-4">{person.role}</p>
            <p className="text-on-surface-variant leading-relaxed">{person.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <h2 className="text-4xl md:text-6xl font-headline font-extrabold text-white mb-8 relative z-10">
          Ready to build your financial<br />future with a partner who cares?
        </h2>
        <p className="text-xl text-on-primary-container mb-12 max-w-2xl mx-auto relative z-10">
          We're here to help you navigate the complexities of accounting and compliance with a human touch.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
          <button className="bg-secondary text-white px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:scale-105 transition-transform cursor-pointer">
            Schedule a Coffee Chat
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-colors cursor-pointer">
            Download Our Guide
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export const About = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Story />
      <People />
      <CTA />
    </div>
  );
};
