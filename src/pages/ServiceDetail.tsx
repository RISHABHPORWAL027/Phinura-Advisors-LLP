import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, MessageSquare, PhoneCall, ArrowLeft, TrendingUp } from "lucide-react";
import { servicesData } from "../data/services";
import siteDetails from "../data/siteDetails.json";

export const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = servicesData.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-4xl font-headline font-bold text-primary mb-4">Service Not Found</h1>
          <Link to="/services" className="text-secondary font-bold flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[600px] pt-20 flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
            alt="Architectural Background" 
            className="w-full h-full object-cover"
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
              Regulatory Excellence
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white mb-8 leading-tight tracking-tighter">
              {service.heroTitle}
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-10">
              {service.subtitle}
            </p>
            <a
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-headline font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Get Free Quote
            </a>
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
                {service.mainHeading}
              </h2>
              <div className="w-20 h-1.5 bg-secondary mb-12 rounded-full"></div>
              
              <div className="space-y-8 text-on-surface-variant text-lg leading-relaxed mb-16 whitespace-pre-line">
                {service.longDescription}
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
                  {service.deliverables.map((item, i) => (
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
                  {service.benefits.map((item, i) => (
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
              {service.ctaTitle}
            </h2>
            <p className="text-xl text-on-primary-container mb-12 max-w-2xl mx-auto relative z-10">
              Connect with our compliance architects today for a hassle-free filing experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <a 
                href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all cursor-pointer text-center"
              >
                <MessageSquare className="w-6 h-6" />
                Consult via WhatsApp
              </a>
              <Link to="/contact" className="text-white font-headline font-bold text-lg flex items-center justify-center gap-2 underline underline-offset-8 hover:text-secondary transition-colors cursor-pointer">
                <PhoneCall className="w-5 h-5" />
                Request a Call Back
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specific Footer */}
      <footer className="bg-slate-50 py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h4 className="font-bold text-primary mb-2">{siteDetails.companyName}</h4>
            <p className="text-xs text-on-surface-variant max-w-xs">
              © {new Date().getFullYear()} {siteDetails.fullName}. All rights reserved. {siteDetails.tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-xs text-on-surface-variant font-medium items-center">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <a href="https://www.devyugsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Design and Develop by Devyug Solution
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
