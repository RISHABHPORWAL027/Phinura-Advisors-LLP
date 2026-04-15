import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send, Globe, Users, Headset } from "lucide-react";
import { FacebookIcon as Facebook, InstagramIcon as Instagram, LinkedinIcon as Linkedin } from "../components/SocialIcons";
import { useCMS } from "../hooks/useCMS";
import logo from "../Assets/Phinura_Advisors_logo.png";

const Hero = () => {
  const { data: siteDetails } = useCMS();
  const { hero } = siteDetails.pages.contact;
  return (
    <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-primary mb-8 leading-tight tracking-tighter">
            {hero.title}
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            {hero.subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const { data: siteDetails } = useCMS();

  return (
    <section className="pb-16 md:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 bg-surface-container-lowest p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:border-primary/20 transition-all duration-500"
        >
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-surface-container-low border border-transparent rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="w-full bg-surface-container-low border border-transparent rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all"
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
                className="w-full bg-surface-container-low border border-transparent rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all resize-none"
              ></textarea>
            </div>

            <button className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl shadow-primary/20 cursor-pointer">
              {siteDetails.pages.contact.form.buttonText} <Send className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center py-4">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="px-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-50">OR</span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            <a
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
            >
              <Headset className="w-6 h-6" />
              {siteDetails.pages.contact.form.whatsappButtonText}
            </a>
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
              { icon: Phone, label: "Call Us Directly", value: siteDetails.mobile, color: "bg-primary" },
              { icon: Mail, label: "Email Our Partners", value: siteDetails.email, color: "bg-primary" },
              { icon: MapPin, label: "Visit Headquarters", value: siteDetails.shortAddress, color: "bg-primary" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-6 bg-surface-container-low rounded-3xl border border-outline-variant/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
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
            className="relative rounded-[2.5rem] overflow-hidden aspect-square shadow-xl border border-outline-variant/10 group"
          >
            <iframe
              title="Office Location"
              className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
              src={`https://www.google.com/maps?q=${encodeURIComponent(siteDetails.address)}&output=embed`}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none bg-primary/5"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="pr-12">
                <p className="font-bold text-primary mb-1">HQ Main Office</p>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{siteDetails.address}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteDetails.fullName + " " + siteDetails.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-1/2 right-6 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
                title="Open in Google Maps"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => (
  <section className="py-16 md:py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden"
      >
        <div className="max-w-xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-6">Stay Informed.</h2>
          <p className="text-xl text-on-primary-container">Join 5,000+ business owners receiving our monthly regulatory insights and financial strategy guide.</p>
        </div>
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 relative z-10">
          <input
            type="email"
            placeholder="Enter your work email"
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 text-white placeholder:text-white/50 focus:ring-2 focus:ring-secondary hover:bg-white/20 transition-all w-full lg:w-80"
          />
          <button className="bg-secondary-fixed text-on-secondary-fixed-variant px-10 py-5 rounded-2xl font-headline font-bold text-lg hover:scale-105 transition-transform cursor-pointer">
            Subscribe
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => {
  const { data: siteDetails } = useCMS();

  return (
    <footer className="py-16 md:py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <img src={logo} alt={siteDetails.companyName} className="h-8 w-auto logo-img" />
            <span className="text-lg font-bold text-primary">{siteDetails.companyName}</span>
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">{siteDetails.tagline}</p>
          <div className="flex gap-4">
            <a href={siteDetails.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all cursor-pointer">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={siteDetails.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all cursor-pointer">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={siteDetails.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all cursor-pointer">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-headline font-bold text-primary mb-6 uppercase tracking-widest text-xs">Navigation</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="/services" className="hover:text-primary transition-colors">Services</a></li>
            <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-primary transition-colors font-bold text-primary">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline font-bold text-primary mb-6 uppercase tracking-widest text-xs">Resources</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">Insights</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Newsletter</a></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline font-bold text-primary mb-6 uppercase tracking-widest text-xs">Connect</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed opacity-60 mb-2">© {new Date().getFullYear()} {siteDetails.fullName}. {siteDetails.tagline}</p>
          <p className="text-[10px] text-on-surface-variant opacity-60">
            Design and Develop by <a href="https://www.devyugsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Devyug Solution</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

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
