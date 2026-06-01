import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useCMS } from "../hooks/useCMS";
import {
  checkContactApiConfigured,
  hasContactFormDelivery,
  submitContactForm,
} from "../utils/submitContactForm";
import { ASSETS } from "../constants/assetPaths";
import { ContactInfoAction } from "../components/ContactInfoAction";
import { buildGoogleMapsEmbedUrl } from "../utils/contactActions";
import {
  getPrimaryMobile,
  getSecondaryMobile,
  getWhatsAppUrl,
} from "../utils/phoneNumbers";

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
              src={ASSETS.contact.hero}
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastDeliveryMethod, setLastDeliveryMethod] = useState<"smtp" | "gas" | "mailto">("smtp");

  const [smtpConfigured, setSmtpConfigured] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let cancelled = false;
    checkContactApiConfigured().then((ok) => {
      if (!cancelled) setSmtpConfigured(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const serviceOptions = ["Audit", "Taxation", "Company Secretarial", "Advisory"];
  const primaryPhone = getPrimaryMobile(siteDetails);
  const secondaryPhone = getSecondaryMobile(siteDetails);
  const whatsappUrl = getWhatsAppUrl(siteDetails);

  function toggleNeed(need: string) {
    setSelectedNeeds((prev) => (prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]));
  }

  function focusField(fieldId: string) {
    const el = document.getElementById(fieldId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el instanceof HTMLElement) el.focus();
  }

  function validateForm(): boolean {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setValidationError("Please enter your full name.");
      focusField("contact-name");
      return false;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setValidationError("Please enter a valid email address.");
      focusField("contact-email");
      return false;
    }
    if (!trimmedPhone) {
      setValidationError("Please enter your mobile number.");
      focusField("contact-phone");
      return false;
    }
    if (!trimmedMessage) {
      setValidationError("Please enter your message.");
      focusField("contact-message");
      return false;
    }
    setValidationError("");
    return true;
  }

  async function sendMessage() {
    if (isSubmitting) return;

    if (honeypotRef.current?.value.trim()) {
      setValidationError("Something went wrong. Please refresh the page and try again.");
      return;
    }

    if (!validateForm()) return;

    setErrorMessage("");
    setIsSubmitting(true);

    const needsLine = selectedNeeds.length ? selectedNeeds.join(", ") : "Not specified";
    const bodyText = `Services of interest: ${needsLine}\n\nMessage:\n${message}`;

    try {
      const result = await submitContactForm(
        {
          name,
          email,
          phone,
          message: bodyText,
          subject: `Contact form — ${name || "Website visitor"}`,
          source: "Contact page",
          _gotcha: honeypotRef.current?.value ?? "",
        },
        siteDetails.email
      );

      if (result.status === "success") {
        setLastDeliveryMethod(result.method);
        setStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setSelectedNeeds([]);
        setMessage("");
        if (honeypotRef.current) honeypotRef.current.value = "";
      } else {
        setStatus("error");
        setErrorMessage(result.message);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Could not send message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage();
  }

  return (
    <section className="pb-28 md:pb-24 bg-white">
      <div className="relative isolate max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="relative z-20 lg:col-span-7 bg-white p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:border-primary/20 transition-all duration-500 pointer-events-auto">
          {status === "success" ? (
            <div className="space-y-6 text-center py-8">
              <p className="rounded-2xl bg-primary/5 px-5 py-4 text-primary font-headline font-semibold leading-relaxed">
                {lastDeliveryMethod === "mailto"
                  ? "Your email app should open with your message ready to send. If it doesn't, please email us directly."
                  : "Thank you — your message has been sent. We'll get back to you shortly."}
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="rounded-2xl border border-outline-variant/30 px-8 py-3.5 font-headline font-bold text-primary hover:bg-slate-50 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="relative space-y-8 pointer-events-auto"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            spellCheck={true}
          >
            <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="contact-hp">Leave blank</label>
              <input
                ref={honeypotRef}
                id="contact-hp"
                type="text"
                name="fax"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Full Name</label>
                <input
                  id="contact-name"
                  name="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Email Address</label>
                <input
                  id="contact-email"
                  name="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Mobile Number</label>
              <input
                id="contact-phone"
                name="contact-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {serviceOptions.map((need) => (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                      selectedNeeds.includes(need)
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-on-surface-variant hover:bg-primary hover:text-white"
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Your Message</label>
              <textarea
                id="contact-message"
                name="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us a little about your business goals..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary hover:border-primary/20 transition-all resize-none"
              ></textarea>
            </div>

            {smtpConfigured === false && !hasContactFormDelivery() ? (
              <p className="text-[11px] text-on-surface-variant leading-relaxed rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
                <strong className="text-amber-900">Email sending is not active yet.</strong> Add{" "}
                <code className="text-amber-950 bg-amber-100/80 px-1 rounded">SMTP_USER</code> and{" "}
                <code className="text-amber-950 bg-amber-100/80 px-1 rounded">SMTP_PASS</code> in Vercel (Hostinger
                mailbox), or run <code className="text-amber-950 bg-amber-100/80 px-1 rounded">yarn dev:full</code>{" "}
                locally. You can still submit — we will open your email app as a fallback.
              </p>
            ) : null}

            {validationError ? (
              <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2" role="alert">
                {validationError}
              </p>
            ) : null}

            {status === "error" && errorMessage ? (
              <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{errorMessage}</p>
            ) : null}

            <div className="relative z-[110]">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => {
                e.stopPropagation();
                void sendMessage();
              }}
              className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl shadow-primary/20 cursor-pointer touch-manipulation disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                  Sending…
                </>
              ) : (
                <>
                  {siteDetails.pages.contact.form.buttonText} <Send className="w-5 h-5" />
                </>
              )}
            </button>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="px-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-50">OR</span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            <a
              href={whatsappUrl}
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
          )}
        </div>

        <div className="relative z-0 lg:col-span-5 space-y-8 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="group flex w-full items-center gap-6 rounded-3xl border border-outline-variant/5 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white transition-transform group-hover:scale-110">
                <Phone className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Call Us Directly</p>
                <ContactInfoAction
                  action="copy"
                  value={primaryPhone}
                  hint="Click to copy primary number"
                  className="block w-full rounded-lg p-0"
                >
                  <span className="text-lg font-headline font-bold text-primary group-hover:text-secondary transition-colors">
                    {primaryPhone}
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                      Primary · WhatsApp
                    </span>
                  </span>
                </ContactInfoAction>
                {secondaryPhone ? (
                  <ContactInfoAction
                    action="copy"
                    value={secondaryPhone}
                    hint="Click to copy secondary number"
                    className="block w-full rounded-lg p-0"
                  >
                    <span className="text-lg font-headline font-bold text-primary group-hover:text-secondary transition-colors">
                      {secondaryPhone}
                    </span>
                  </ContactInfoAction>
                ) : null}
              </div>
            </div>

            {[
              {
                icon: Mail,
                label: "Email Our Partners",
                display: siteDetails.email,
                action: "copy" as const,
                copyValue: siteDetails.email,
              },
              {
                icon: MapPin,
                label: "Visit Headquarters",
                display: siteDetails.shortAddress,
                action: "maps" as const,
                copyValue: siteDetails.address,
              },
            ].map((item, i) => (
              <ContactInfoAction
                key={i}
                action={item.action}
                value={item.copyValue}
                hint={item.action === "maps" ? "Open in Google Maps" : "Click to copy"}
                className="group flex w-full items-center gap-6 rounded-3xl border border-outline-variant/5 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex w-12 h-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white transition-transform group-hover:scale-110">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p
                    className={`text-lg font-headline font-bold text-primary group-hover:text-secondary transition-colors ${
                      item.label.includes("Email") ? "break-all" : ""
                    }`}
                  >
                    {item.display}
                  </p>
                </div>
              </ContactInfoAction>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-0 rounded-[2.5rem] overflow-hidden aspect-square shadow-xl border border-outline-variant/10 group"
          >
            <iframe
              title="Office Location"
              className="pointer-events-none lg:pointer-events-auto w-full h-full transition-all duration-700"
              src={buildGoogleMapsEmbedUrl()}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none bg-primary/10 group-hover:opacity-0 transition-opacity duration-500"></div>
            <ContactInfoAction
              action="maps"
              value={siteDetails.address}
              hint="Open in Google Maps"
              className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/95 p-6 text-left shadow-lg backdrop-blur-xl transition-transform hover:scale-[1.01] focus-visible:ring-offset-white"
            >
              <div className="flex items-start gap-4 pr-2">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-primary mb-3">HQ Main Office</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {siteDetails.address}
                  </p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <MapPin className="w-5 h-5" aria-hidden />
                </span>
              </div>
            </ContactInfoAction>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Contact = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ContactForm />
    </div>
  );
};
