import { motion } from "motion/react";
import { Mail, MapPin, Phone } from "lucide-react";
import { ASSETS } from "../constants/assetPaths";
import { useCMS } from "../hooks/useCMS";
import { getPrimaryMobile, getTelHref, getWhatsAppUrl } from "../utils/phoneNumbers";

export function ComingSoon() {
  const { data: site } = useCMS();
  const whatsAppUrl = getWhatsAppUrl(site);
  const telHref = getTelHref(site);
  const phone = getPrimaryMobile(site);
  const email = site.email?.trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f1f3d] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${ASSETS.hero.poster})` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0f1f3d]/90 via-[#152a4f]/95 to-[#0f1f3d]" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <motion.img
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          src={ASSETS.brand.logo}
          alt={site.companyName}
          className="mb-10 h-14 w-auto brightness-0 invert sm:h-16"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-fixed"
        >
          Launching soon
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
        >
          Coming Soon
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          {site.tagline ||
            "Expert financial, tax, and compliance services for growing businesses. Our new website is almost ready."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-3 text-sm text-white/60"
        >
          {site.fullName} · {site.shortAddress}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
        >
          {whatsAppUrl ? (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-lg transition hover:bg-primary/90"
            >
              Chat on WhatsApp
            </a>
          ) : null}
          {email ? (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email us
            </a>
          ) : null}
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="mt-12 flex flex-col items-center gap-3 text-sm text-white/70"
        >
          {phone && telHref ? (
            <li>
              <a href={telHref} className="inline-flex items-center gap-2 transition hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-primary-fixed" aria-hidden />
                {phone}
              </a>
            </li>
          ) : null}
          {email ? (
            <li>
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 transition hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-primary-fixed" aria-hidden />
                {email}
              </a>
            </li>
          ) : null}
          {site.shortAddress ? (
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary-fixed" aria-hidden />
              {site.shortAddress}
            </li>
          ) : null}
        </motion.ul>
      </div>
    </div>
  );
}
