import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FileText, Scale, Gavel, AlertCircle } from "lucide-react";
import siteDetails from "../data/siteDetails.json";

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[400px] pt-40 pb-20 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070" 
            alt="Terms Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-3 bg-secondary text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              Legal Framework
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white mb-8 leading-tight tracking-tighter">
              Terms of <span className="text-secondary">Service</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-10">
              Understanding our mutual commitments. This agreement outlines the professional standards and operational boundaries of our partnership.
            </p>
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
              className="prose prose-lg max-w-none shadow-2xl shadow-primary/5 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-outline-variant/10"
            >
              <h2 className="text-3xl font-headline font-extrabold text-primary mb-6">Professional Engagement</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Welcome to {siteDetails.companyName}. These terms and conditions outline the rules and regulations for the use of our professional advisory, taxation, and secretarial services.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                  <Scale className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">Scope of Advice</h3>
                  <p className="text-sm text-on-surface-variant">Our advice is based on the information provided by the client. We are not responsible for discrepancies arising from incomplete data.</p>
                </div>
                <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                  <Gavel className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">Governing Law</h3>
                  <p className="text-sm text-on-surface-variant">Any legal disputes shall be subject to the jurisdiction of the courts located in Hyderabad, Telangana.</p>
                </div>
              </div>

              <h2 className="text-2xl font-headline font-bold text-primary mt-12 mb-6">User Responsibilities</h2>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                By accessing this website we assume you accept these terms and conditions. Do not continue to use {siteDetails.companyName} if you do not agree to take all of the terms and conditions stated on this page.
              </p>
              <ul className="space-y-4 text-on-surface-variant mb-8">
                <li className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <span>Clients must provide accurate and timely documentation for regulatory filings.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <span>Professional fees are non-refundable once the filing process has been initiated with government portals.</span>
                </li>
              </ul>

              <h2 className="text-2xl font-headline font-bold text-primary mt-12 mb-6">Intellectual Property</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Unless otherwise stated, {siteDetails.companyName} and/or its licensors own the intellectual property rights for all material on our website. All intellectual property rights are reserved.
              </p>

              <h2 className="text-2xl font-headline font-bold text-primary mt-12 mb-6">Disclaimers</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                The content on this website is for general informational purposes only and does not constitute formal legal or financial advice. We recommend a private consultation for specific case analysis.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
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
            <Link to="/terms" className="text-primary font-bold">Terms of Service</Link>
            <a href="https://www.devyugsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Design and Develop by Devyug Solution
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
