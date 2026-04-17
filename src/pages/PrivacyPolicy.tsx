import { AppLink } from "../navigation/AppLink";
import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { useCMS } from "../hooks/useCMS";

export const PrivacyPolicy = () => {
  const { data: siteDetails, loading } = useCMS();

  if (loading || !siteDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const privacy = siteDetails.pages.privacy;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[400px] pt-40 pb-20 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071"
            alt="Privacy Background"
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
              Legal & Compliance
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white mb-8 leading-tight tracking-tighter">
              {privacy.hero.title.split(" ")[0]}{" "}
              <span className="text-secondary">{privacy.hero.title.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-10">
              Your trust is our most valuable asset. Learn how {siteDetails.companyName} protects your data and maintains absolute confidentiality.
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
              <h2 className="text-3xl font-headline font-extrabold text-primary mb-6">Introduction</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                At {siteDetails.companyName}, accessible from {window.location.host}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {siteDetails.companyName} and how we use it.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                  <Shield className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">Data Protection</h3>
                  <p className="text-sm text-on-surface-variant">We implement industry-standard encryption and security protocols to safeguard your financial records.</p>
                </div>
                <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                  <Lock className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">Confidentiality</h3>
                  <p className="text-sm text-on-surface-variant">Your business data is never shared with third parties without explicit consent, except as required by law.</p>
                </div>
              </div>

              <h2 className="text-2xl font-headline font-bold text-primary mt-12 mb-6">Log Files</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                {siteDetails.companyName} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
              </p>

              <h2 className="text-2xl font-headline font-bold text-primary mt-12 mb-6">Cookies and Web Beacons</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Like any other website, {siteDetails.companyName} uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
              </p>

              <h2 className="text-2xl font-headline font-bold text-primary mt-12 mb-6">Consent</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>

              <h2 className="text-2xl font-headline font-bold text-primary mt-12 mb-6">Full Policy</h2>
              <div className="text-on-surface-variant whitespace-pre-line leading-relaxed">
                {privacy.content}
              </div>
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
            <AppLink to="/privacy" className="text-primary font-bold">Privacy Policy</AppLink>
            <AppLink to="/terms" className="hover:text-primary transition-colors">Terms of Service</AppLink>

          </div>
          <p className="text-slate-400 text-xs">
            Design and Develop by <a href="https://www.devyugsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Devyug Solution</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
