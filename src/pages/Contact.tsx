import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useCMS } from "../hooks/useCMS";
import { CtaImageCard } from "../components/CtaImageCard";
import contactHeroImage from "../Assets/contactus.svg";

const Hero = () => {
  const { data: siteDetails } = useCMS();
  const { hero } = siteDetails.pages.contact;
  return (
    <section className="bg-white pt-20 md:pt-32">
      <div className="mx-auto mt-10 max-w-7xl px-6 md:mt-0">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl lg:max-w-none"
          >
            <h1 className="mb-8 font-headline text-5xl font-extrabold leading-tight tracking-tighter text-primary md:text-7xl">
              {hero.title}
            </h1>
            <p className="text-xl leading-relaxed text-on-surface-variant">{hero.subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative m-0 flex w-full justify-center p-0 lg:justify-end"
          >
            <img
              src={contactHeroImage}
              alt=""
              className="m-0 block h-[450px] w-auto max-w-full border-0 object-contain object-center p-0"
              decoding="async"
            />
          </motion.div>
        </div>
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
          className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:border-primary/20 transition-all duration-500"
        >
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Mobile Number</label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {["Audit", "Taxation", "Company Secretarial", "Advisory"].map((need) => (
                  <button
                    key={need}
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-slate-100 text-on-surface-variant font-semibold text-sm hover:bg-primary hover:text-white transition-all cursor-pointer"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all resize-none"
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
              <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
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
              <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-outline-variant/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group">
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
              className="w-full h-full transition-all duration-700"
              src={`https://www.google.com/maps?q=${encodeURIComponent(siteDetails.address)}&output=embed`}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none bg-primary/10 group-hover:opacity-0 transition-opacity duration-500"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="pr-12">
                <p className="font-bold text-primary mb-3">HQ Main Office</p>
                <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line">{siteDetails.address}</p>
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
        className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/25 md:rounded-[3rem]"
      >
        <CtaImageCard className="rounded-[2.5rem] text-white md:rounded-[3rem]" contentClassName="p-8 md:p-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6 text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">Stay Informed.</h2>
              <p className="text-xl text-sky-100/95 leading-relaxed font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Join 5,000+ business owners receiving our monthly regulatory insights and financial strategy guide.
              </p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your work email"
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 text-white placeholder:text-white/50 focus:ring-2 focus:ring-secondary hover:bg-white/20 transition-all w-full lg:w-80"
              />
              <button className="bg-secondary-fixed text-on-secondary-fixed-variant px-10 py-5 rounded-2xl font-headline font-bold text-lg hover:scale-105 transition-transform cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </CtaImageCard>
      </motion.div>
    </div>
  </section>
);

export const Contact = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ContactForm />
      <Newsletter />
    </div>
  );
};
