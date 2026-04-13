import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send, Globe, Users } from "lucide-react";

const Hero = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-primary mb-8 leading-tight tracking-tighter">
          Let's Chat About Your Business
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed">
          Our friendly experts are here to answer your questions. No complex forms, just a quick message to get started.
        </p>
      </motion.div>
    </div>
  </section>
);

const ContactForm = () => (
  <section className="pb-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-7 bg-surface-container-lowest p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-sm"
      >
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="john@company.com" 
                className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Business Need</label>
            <div className="flex flex-wrap gap-3">
              {["Audit", "Taxation", "Company Secretarial", "Advisory"].map((need) => (
                <button 
                  key={need} 
                  type="button"
                  className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold text-sm hover:bg-primary hover:text-white transition-all cursor-pointer"
                >
                  {need}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Your Message</label>
            <textarea 
              rows={5} 
              placeholder="Tell us a little about your business goals..." 
              className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all resize-none"
            ></textarea>
          </div>

          <button className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl shadow-primary/20 cursor-pointer">
            Send Message <Send className="w-5 h-5" />
          </button>
        </form>
      </motion.div>

      <div className="lg:col-span-5 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {[
            { icon: Phone, label: "Call Us Directly", value: "+1 (555) 0123-4567", color: "bg-primary" },
            { icon: Mail, label: "Email Our Partners", value: "partners@sovereignledger.com", color: "bg-primary" },
            { icon: MapPin, label: "Visit Headquarters", value: "Financial District, London", color: "bg-primary" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-6 bg-surface-container-low rounded-3xl border border-outline-variant/5">
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-lg font-headline font-bold text-primary">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] overflow-hidden aspect-square shadow-xl border border-outline-variant/10"
        >
          <img 
            src="https://picsum.photos/seed/map/600/600" 
            alt="Map Placeholder" 
            className="w-full h-full object-cover grayscale opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
            <p className="font-bold text-primary mb-1">HQ Main Office</p>
            <p className="text-xs text-on-surface-variant">42 Sovereign Plaza, EC1</p>
            <div className="absolute top-1/2 right-6 -translate-y-1/2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Newsletter = () => (
  <section className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-[3rem] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden"
      >
        <div className="max-w-xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-6">Stay Informed.</h2>
          <p className="text-xl text-on-primary-container">Join 5,000+ business owners receiving our monthly regulatory insights and financial strategy guide.</p>
        </div>
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 relative z-10">
          <input 
            type="email" 
            placeholder="Enter your work email" 
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 text-white placeholder:text-white/50 focus:ring-2 focus:ring-secondary w-full lg:w-80"
          />
          <button className="bg-secondary-fixed text-on-secondary-fixed-variant px-10 py-5 rounded-2xl font-headline font-bold text-lg hover:scale-105 transition-transform cursor-pointer">
            Subscribe
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 px-6 bg-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <h4 className="text-lg font-bold text-primary mb-6">The Sovereign Ledger</h4>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-8">Architectural Financial Authority providing bespoke CA and CS services for high-growth enterprises worldwide.</p>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all cursor-pointer">
            <Globe className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all cursor-pointer">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6 uppercase tracking-widest text-xs">Navigation</h4>
        <ul className="space-y-4 text-sm text-on-surface-variant">
          <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Services</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
          <li><a href="#" className="hover:text-primary transition-colors font-bold text-primary">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6 uppercase tracking-widest text-xs">Resources</h4>
        <ul className="space-y-4 text-sm text-on-surface-variant">
          <li><a href="#" className="hover:text-primary transition-colors">Insights</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Newsletter</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6 uppercase tracking-widest text-xs">Connect</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed opacity-60">© 2024 The Sovereign Ledger. Architectural Financial Authority.</p>
      </div>
    </div>
  </footer>
);

export const Contact = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ContactForm />
      <Newsletter />
      <Footer />
    </div>
  );
};
