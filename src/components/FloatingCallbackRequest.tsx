import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { PhoneCall, X, Loader2 } from "lucide-react";
import { CALLBACK_REQUEST_EVENT } from "../utils/openCallbackRequest";
import { useCMS } from "../hooks/useCMS";
import { hasContactFormDelivery, submitContactForm } from "../utils/submitContactForm";

export function FloatingCallbackRequest() {
  const { pathname } = useLocation();
  const { data: site } = useCMS();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastDeliveryMethod, setLastDeliveryMethod] = useState<"smtp" | "gas" | "mailto">("smtp");

  const formDeliveryConfigured = hasContactFormDelivery();
  const abovePreviewChrome = pathname.startsWith("/preview");

  useEffect(() => {
    const openFromEvent = () => setOpen(true);
    window.addEventListener(CALLBACK_REQUEST_EVENT, openFromEvent);
    return () => window.removeEventListener(CALLBACK_REQUEST_EVENT, openFromEvent);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setErrorMessage("");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setGotcha("");
    }
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  const bottomClass = abovePreviewChrome ? "bottom-[4.75rem] md:bottom-[5rem]" : "bottom-5 md:bottom-7";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (gotcha) return;

    setErrorMessage("");
    setStatus("submitting");

    try {
      const result = await submitContactForm(
        {
          name,
          email,
          phone,
          message,
          subject: `Callback request — ${name || "Website visitor"}`,
          source: "Callback widget",
          _gotcha: gotcha,
        },
        site.email
      );

      if (result.status === "success") {
        setLastDeliveryMethod(result.method);
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.message);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Could not send message. Please try again.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          `fixed left-5 z-[100] flex items-center gap-2.5 rounded-full bg-primary px-4 py-3.5 text-white shadow-xl shadow-primary/25 transition-transform hover:scale-[1.03] hover:shadow-2xl active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-white md:left-7 md:px-5 md:py-4 ` +
          bottomClass
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Get A Callback"
      >
        <PhoneCall className="h-5 w-5 shrink-0 md:h-6 md:w-6" aria-hidden />
        <span className="font-headline text-sm font-bold tracking-tight md:text-base whitespace-nowrap">
          Get A Callback
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="callback-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-4 md:p-8"
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-primary/65 backdrop-blur-[6px]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 w-full max-w-md rounded-[1.75rem] bg-white shadow-[0_25px_80px_-12px_rgba(0,31,73,0.35)] border border-outline-variant/15 overflow-hidden ring-1 ring-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-secondary-fixed to-primary" aria-hidden />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 pt-8 md:p-8">
                <div className="mb-6 flex items-start gap-4 pr-10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <PhoneCall className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <h2 id="callback-modal-title" className="text-2xl font-headline font-extrabold text-primary leading-tight">
                      Request a callback
                    </h2>
                    <p className="mt-1.5 text-sm text-on-surface-variant leading-relaxed">
                      Leave your details and we’ll get back to you shortly.
                    </p>
                  </div>
                </div>

                {status === "success" ? (
                  <p className="rounded-2xl bg-primary/5 px-5 py-4 text-center text-primary font-headline font-semibold leading-relaxed">
                    {lastDeliveryMethod === "mailto"
                      ? "Your email app should open with your message ready to send. If it doesn't, please email us directly."
                      : "Thank you — your message has been sent."}
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="_gotcha"
                      value={gotcha}
                      onChange={(e) => setGotcha(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 opacity-0 pointer-events-none"
                    />
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Name</label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl border border-transparent bg-surface-container-low px-4 py-3.5 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Email</label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-transparent bg-surface-container-low px-4 py-3.5 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Phone</label>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-2xl border border-transparent bg-surface-container-low px-4 py-3.5 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="+91 …"
                        autoComplete="tel"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full resize-none rounded-2xl border border-transparent bg-surface-container-low px-4 py-3.5 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="How can we help?"
                      />
                    </div>

                    {!formDeliveryConfigured ? (
                      <p className="text-[11px] text-on-surface-variant leading-relaxed rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
                        <strong className="text-amber-900">Setup tip:</strong> add{" "}
                        <code className="text-amber-950 bg-amber-100/80 px-1 rounded">SMTP_USER</code> and{" "}
                        <code className="text-amber-950 bg-amber-100/80 px-1 rounded">SMTP_PASS</code> in Vercel (Hostinger mailbox).
                      </p>
                    ) : null}

                    {status === "error" && errorMessage ? (
                      <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{errorMessage}</p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-headline font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-container disabled:opacity-60 transition-colors"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                          Sending…
                        </>
                      ) : (
                        "Submit request"
                      )}
                    </button>
                  </form>
                )}

                {status === "success" ? (
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-6 w-full rounded-2xl border border-outline-variant/30 py-3.5 font-headline font-bold text-primary hover:bg-surface-container-low transition-colors"
                  >
                    Close
                  </button>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
