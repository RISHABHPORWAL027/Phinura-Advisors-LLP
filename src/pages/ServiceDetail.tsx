import { useParams } from "react-router-dom";
import { AppLink } from "../navigation/AppLink";
import { motion } from "motion/react";
import { CheckCircle2, MessageSquare, PhoneCall, ArrowLeft, TrendingUp } from "lucide-react";
import { useCMS } from "../hooks/useCMS";
import { DeveloperCredit } from "../components/DeveloperCredit";

export const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data, loading } = useCMS();

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const services = data.pages.services.serviceList || [];
  const serviceIdNormalized = (serviceId || "").toLowerCase();
  const service =
    services.find((s: any) => String(s?.id ?? "").toLowerCase() === serviceIdNormalized) ||
    services.find((s: any) => String(s?.slug ?? "").toLowerCase() === serviceIdNormalized);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-4xl font-headline font-bold text-primary mb-4">Service Not Found</h1>
          <AppLink to="/services" className="text-secondary font-bold flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Back to Services
          </AppLink>
        </div>
      </div>
    );
  }

  const heroTitle = service.heroTitle || service.hero_title || service.title || "Our Service";
  const subtitle =
    service.subtitle ||
    service.description ||
    "Professional service tailored to your business needs.";
  const category = service.category || "Regulatory Excellence";
  const mainHeading = service.mainHeading || heroTitle;
  const longDescription =
    service.longDescription ||
    (service.description ? `${service.description}\n\nContact us to get a custom quote and timeline.` : "Contact us to get a custom quote and timeline.");
  const deliverables =
    (service.deliverables && service.deliverables.length > 0 ? service.deliverables : null) || [
      "Initial consultation and requirement checklist",
      "Document review and preparation",
      "Filing / submission support",
      "Status updates and follow-ups",
    ];
  const benefits =
    (service.benefits && service.benefits.length > 0 ? service.benefits : null) || [
      "Reduced compliance risk",
      "Faster turnaround",
      "Clear, step-by-step guidance",
      "Transparent pricing and communication",
    ];
  const ctaTitle = service.ctaTitle || service.cta_title || "Ready to get started?";
  const ctaBlockSubtitle =
    service.ctaSubtitle ||
    data.pages.services.serviceDetailCtaSubtitle ||
    "Connect with our compliance architects today for a hassle-free filing experience.";
  const callBackLinkLabel =
    service.callBackLinkText ||
    data.pages.services.serviceDetailCallBackLinkText ||
    "Request a Call Back";
  const whatsappPhone = String(data.mobile || "").replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — mobile: extra top padding, taller banner, bottom padding below CTA */}
      <section className="relative flex min-h-[min(82vh,760px)] flex-col justify-start pt-28 pb-16 md:min-h-[600px] md:justify-center md:pt-20 md:pb-0 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
            alt="Architectural Background"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-3 bg-secondary text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              {category}
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white mb-8 leading-tight tracking-tighter">
              {heroTitle}
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-10">
              {subtitle}
            </p>
            {whatsappPhone ? (
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-headline font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {data.pages.home.hero.buttonText}
              </a>
            ) : (
              <AppLink
                to="/contact"
                className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-headline font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Contact Us
              </AppLink>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-headline font-extrabold text-primary mb-2">
                {mainHeading}
              </h2>
              <div className="w-20 h-1.5 bg-secondary mb-12 rounded-full"></div>

              <div className="space-y-8 text-on-surface-variant text-lg leading-relaxed mb-16 whitespace-pre-line">
                {longDescription}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-headline font-bold text-primary mb-8 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  Key Deliverables
                </h3>
                <ul className="space-y-6">
                  {deliverables.map((item: string, i: number) => (
                    <li key={i} className="flex gap-4 text-on-surface-variant">
                      <div className="w-6 h-6 rounded-full bg-primary-fixed flex-shrink-0 flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-headline font-bold text-primary mb-8 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                  Strategic Benefits
                </h3>
                <ul className="space-y-6">
                  {benefits.map((item: string, i: number) => (
                    <li key={i} className="flex gap-4 text-on-surface-variant">
                      <div className="w-6 h-6 rounded-full bg-secondary-fixed flex-shrink-0 flex items-center justify-center text-secondary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ rotateX: 1, rotateY: 1, scale: 1.01 }}
            viewport={{ once: true }}
            style={{ transformStyle: "preserve-3d" }}
            className="bg-primary rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold text-white mb-8 relative z-10">
              {ctaTitle}
            </h2>
            <p className="text-xl text-on-primary-container mb-12 max-w-2xl mx-auto relative z-10">
              {ctaBlockSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              {whatsappPhone ? (
                <a 
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all cursor-pointer text-center"
                >
                  <MessageSquare className="w-6 h-6" />
                  {data.pages.contact.form.whatsappButtonText}
                </a>
              ) : null}
              <AppLink to="/contact" className="text-white font-headline font-bold text-lg flex items-center justify-center gap-2 underline underline-offset-8 hover:text-secondary transition-colors cursor-pointer">
                <PhoneCall className="w-5 h-5" />
                {callBackLinkLabel}
              </AppLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specific Footer */}
      <footer className="bg-slate-50 py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h4 className="font-bold text-primary mb-2">{data.companyName}</h4>
            <p className="text-xs text-on-surface-variant max-w-xs">
              © {new Date().getFullYear()} {data.fullName}. All rights reserved. {data.tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-xs text-on-surface-variant font-medium items-center">
            <AppLink to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</AppLink>
            <AppLink to="/terms" className="hover:text-primary transition-colors">Terms of Service</AppLink>
            <DeveloperCredit />
          </div>
        </div>
      </footer>
    </div>
  );
};
