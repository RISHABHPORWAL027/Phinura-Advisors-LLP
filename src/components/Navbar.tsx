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
    <>
      <nav
        className="fixed top-0 w-full z-[100] border-b border-primary/[0.06] bg-white/92 backdrop-blur-md shadow-[0_1px_0_rgba(24,51,92,0.04)] transition-all duration-300 supports-[backdrop-filter]:bg-white/85"
        aria-label="Primary"
      >
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-6 lg:px-8">
          <Link
            to={homePath}
            aria-label={`${siteDetails.companyName} — Home`}
            className="group flex items-center gap-2.5 rounded-lg py-2 pr-2 focus-visible:outline-offset-4"
          >
            <img
              src={logo}
              alt=""
              aria-hidden
              className="h-9 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <span className="hidden font-headline text-lg font-bold tracking-tight text-primary sm:inline sm:text-xl">
              {siteDetails.companyName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link.to) ? "page" : undefined}
                className={`relative rounded-lg px-3 py-3 font-headline text-[0.9375rem] font-bold tracking-tight transition-colors duration-200 focus-visible:outline-offset-4 ${
                  isActive(link.to) ? "text-primary" : "text-on-surface-variant/75 hover:text-primary"
                }`}
              >
                {link.name}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-2 left-3 right-3 h-[3px] rounded-full bg-secondary-container"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`https://wa.me/${siteDetails.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border-2 border-primary bg-primary px-6 py-2.5 font-headline text-sm font-extrabold text-white shadow-[0_12px_32px_-8px_rgba(24,51,92,0.35)] transition-all duration-200 hover:border-primary hover:bg-[#142a4f] lg:inline-flex hover:brightness-[1.02] active:scale-[0.98]"
            >
              Get Free Quote
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-primary transition-colors hover:bg-primary/[0.06] lg:hidden"
              aria-expanded={isOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer — outside nav so background renders correctly */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            id="mobile-nav-drawer"
            style={{ backgroundColor: "#ffffff", position: "fixed", inset: 0, zIndex: 300 }}
            className="flex flex-col p-8 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            {/* Header row with logo + close button */}
            <div className="flex items-center justify-between mb-10">
              <img src={logo} alt="" aria-hidden className="h-9 w-auto" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-primary hover:bg-primary/[0.06]"
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={link.to}
                    aria-current={isActive(link.to) ? "page" : undefined}
                    className={`block rounded-xl py-2 text-4xl font-headline font-black tracking-tighter transition-colors focus-visible:outline-offset-[6px] ${
                      isActive(link.to) ? "text-primary" : "text-gray-400 hover:text-primary"
                    }`}
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
                className="flex min-h-[52px] w-full items-center justify-center rounded-[2rem] bg-primary px-6 py-4 text-center font-headline text-lg font-black text-white shadow-xl shadow-primary/25 transition-colors hover:bg-[#142a4f] active:scale-[0.99]"
              >
                Inquire Now
              </a>
              <div className="mt-8 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">
                {siteDetails.companyName} © {new Date().getFullYear()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
