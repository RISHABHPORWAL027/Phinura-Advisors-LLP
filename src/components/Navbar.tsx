import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppPath } from "../navigation/AppLink";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../Assets/Phinura_Advisors_logo.png";
import { useCMS } from "../hooks/useCMS";

export const Navbar = () => {
  const { data: siteDetails } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const homePath = useAppPath("/");
  const servicesPath = useAppPath("/services");
  const aboutPath = useAppPath("/about");
  const contactPath = useAppPath("/contact");

  const navLinks = [
    { name: "Home", to: homePath },
    { name: "Services", to: servicesPath },
    { name: "About", to: aboutPath },
    { name: "Contact", to: contactPath },
  ];

  const isActive = (to: string) => location.pathname === to;

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white border-b border-primary/5 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to={homePath} className="flex items-center gap-2 group">
          <img src={logo} alt={siteDetails.companyName} className="h-9 w-auto group-hover:scale-105 transition-transform logo-img" />
          <span className="text-xl font-bold tracking-tighter text-primary font-headline sm:block">
            {siteDetails.companyName}
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`relative font-headline font-bold text-sm tracking-tight transition-all duration-300 hover:text-primary ${isActive(link.to) ? "text-primary" : "text-on-surface-variant/70"}`}
            >
              {link.name}
              {isActive(link.to) && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex bg-primary text-white border-2 border-primary px-7 py-2.5 rounded-2xl font-headline font-extrabold text-sm shadow-[0_10px_30px_rgba(var(--primary-rgb),0.2)] hover:bg-transparent hover:text-primary transition-all active:scale-95"
          >
            Get Free Quote
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-20 bg-white z-[90] lg:hidden flex flex-col p-8"
          >
            <div className="flex flex-col space-y-8 mt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={link.to}
                    className={`text-4xl font-headline font-black tracking-tighter ${isActive(link.to) ? "text-primary" : "text-on-surface-variant/40 hover:text-primary"}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto pb-12"
            >
              <a
                href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary text-white text-center py-6 rounded-[2rem] font-headline font-black text-xl shadow-2xl shadow-primary/20 active:scale-95 transition-all"
              >
                Inquire Now
              </a>
              <div className="mt-8 text-center text-on-surface-variant/40 font-bold text-xs uppercase tracking-[0.2em]">
                {siteDetails.companyName} © 2024
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
