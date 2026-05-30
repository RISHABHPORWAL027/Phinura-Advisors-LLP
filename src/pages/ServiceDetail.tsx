import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLink } from "../navigation/AppLink";
import { motion } from "motion/react";
import { CheckCircle2, MessageSquare, PhoneCall, ArrowLeft, TrendingUp, Layers, ArrowRight } from "lucide-react";
import { useCMS } from "../hooks/useCMS";
import { resolveLucideIcon } from "../utils/lucideIconMap";
import { CtaImageCard } from "../components/CtaImageCard";
import detailsBg from "../Assets/details_page_bg.avif";
import type { SubServicePageContent } from "../data/subServiceTypes";
import { loadDefaultSubServices } from "../utils/subServiceDefaults";

const SERVICE_DETAIL_FALLBACK_CONSULTATION_HEADING = "Consultation — how we can help";

/** Topic-neutral prose when CMS has no usable consultation body. */
const SERVICE_DETAIL_FALLBACK_CONSULTATION_CLOSING = [
  "We start from how your business runs day to day—that tells us which MCA, GST, tax, trademark, or allied obligations actually apply.",
  "",
  "On consultation we listen first: what deadlines worry you and what paperwork you already have. Then we map a sensible sequence—what we prepare, what you submit on government portals—and we explain steps in ordinary language before you authorise filings.",
  "",
  "MCA, GST, and income-tax cycles often overlap; we keep work coordinated instead of reinventing data in isolation. Reach us on WhatsApp or call for a clear next step, not jargon.",
].join("\n");

function resolveSubServiceCardCopy(
  sub: { id?: string; hook?: string; description?: string },
  bundledById: Map<string, SubServicePageContent>
) {
  const bundled = sub.id ? bundledById.get(sub.id.toLowerCase()) : undefined;
  return {
    hook: sub.hook?.trim() || "",
    description: sub.description?.trim() || bundled?.shortDescription?.trim() || "",
  };
}

export const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data } = useCMS();
  const [bundledSubServices, setBundledSubServices] = useState<Map<string, SubServicePageContent>>(new Map());

  const services = data.pages.services.serviceList || [];
  const serviceIdNormalized = (serviceId || "").toLowerCase();
  const service =
    services.find((s: any) => String(s?.id ?? "").toLowerCase() === serviceIdNormalized) ||
    services.find((s: any) => String(s?.slug ?? "").toLowerCase() === serviceIdNormalized);

  useEffect(() => {
    const serviceKey = String(service?.id ?? "").toLowerCase();
    if (!serviceKey) {
      setBundledSubServices(new Map());
      return;
    }

    let cancelled = false;
    loadDefaultSubServices(serviceKey).then((list) => {
      if (cancelled) return;
      setBundledSubServices(new Map(list.map((item) => [item.id.toLowerCase(), item])));
    });

    return () => {
      cancelled = true;
    };
  }, [service?.id]);

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
  const subServices =
    Array.isArray(service.subServices) && service.subServices.length > 0
      ? service.subServices.filter((s: any) => s?.title?.trim())
      : [];
  const subServicesTitle =
    (typeof service.subServicesTitle === "string" && service.subServicesTitle.trim()) ||
    heroTitle ||
    service.title ||
    "Sub-Services";
  const subServicesHaveDescriptions = subServices.some((s: { description?: string }) => s.description?.trim());
  const hasRegistrationHub =
    service.pageLayout === "hub" ||
    (Boolean(service.registrationTypesHeading?.trim()) &&
      subServices.some((s: any) => s?.id?.trim()));
  const registeredBusinessBenefitsTitle = service.registeredBusinessBenefitsTitle?.trim();
  const registeredBusinessBenefitsText = service.registeredBusinessBenefitsText?.trim();
  const registeredBusinessBenefitsCards = Array.isArray(service.registeredBusinessBenefitsCards)
    ? service.registeredBusinessBenefitsCards.filter((c: any) => c?.title?.trim())
    : [];
  const registrationTypesHeading = service.registrationTypesHeading?.trim();
  const registrationTypesEyebrow = service.registrationTypesEyebrow?.trim();
  const registrationTypesSubtext = service.registrationTypesSubtext?.trim();
  const serviceIntro = service.serviceIntro?.trim();
  const postRegistrationSection = service.postRegistrationSection;
  const postRegistrationTitle = postRegistrationSection?.title?.trim();
  const postRegistrationSubtitle = postRegistrationSection?.subtitle?.trim();
  const postRegistrationParagraphs = Array.isArray(postRegistrationSection?.paragraphs)
    ? postRegistrationSection.paragraphs.filter((p: string) => p?.trim())
    : [];
  const postRegistrationHighlights = Array.isArray(postRegistrationSection?.highlights)
    ? postRegistrationSection.highlights.filter((h: any) => h?.title?.trim())
    : [];
  const heroCtaPrimary = service.heroCtaPrimary?.trim() || data.pages.home.hero.buttonText || "Get Started";
  const heroCtaSecondary = service.heroCtaSecondary?.trim() || data.pages.home.hero.secondaryButtonText || "Talk to Expert";
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
  const servicesPage = data.pages.services;
  const globalConsultationHeading =
    typeof servicesPage.serviceDetailConsultationHeading === "string"
      ? servicesPage.serviceDetailConsultationHeading.trim()
      : "";
  const globalConsultationClosing =
    typeof servicesPage.serviceDetailConsultationClosing === "string"
      ? servicesPage.serviceDetailConsultationClosing.trim()
      : "";
  const perConsultationHeading =
    typeof service.consultationHeading === "string" ? service.consultationHeading.trim() : "";
  const perConsultationClosing =
    typeof service.consultationClosing === "string" ? service.consultationClosing.trim() : "";

  /** Prefer per-service (topic-specific copy in bundled JSON/CMS), then site-wide defaults, then app fallback. */
  const consultationHeading =
    perConsultationHeading || globalConsultationHeading || SERVICE_DETAIL_FALLBACK_CONSULTATION_HEADING;
  const consultationClosing =
    perConsultationClosing || globalConsultationClosing || SERVICE_DETAIL_FALLBACK_CONSULTATION_CLOSING;

  const postRegistrationHubBlock =
    hasRegistrationHub && postRegistrationTitle ? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto mb-12 max-w-4xl text-center md:mb-16">
          <h2 className="mb-4 font-headline text-3xl font-extrabold text-primary md:text-4xl">
            {postRegistrationTitle}
          </h2>
          {postRegistrationSubtitle && (
            <p className="text-lg leading-relaxed text-on-surface-variant">{postRegistrationSubtitle}</p>
          )}
        </div>

        {postRegistrationParagraphs.length > 0 && (
          <div className="mx-auto mb-14 max-w-4xl space-y-6 md:mb-16">
            {postRegistrationParagraphs.map((paragraph: string, i: number) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-justify text-base leading-relaxed text-on-surface-variant md:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        )}

        {postRegistrationHighlights.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {postRegistrationHighlights.map((item: { title: string; description: string }, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6"
              >
                <h3 className="mb-2 font-headline text-base font-bold text-primary">{item.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{item.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    ) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — fluid padding so long subtitles (e.g. Allied compliance) don’t sit flush to edges */}
      <section className="relative overflow-hidden pt-[7.25rem] pb-20 sm:pb-24 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 min-h-[100%]">
          <img
            src={detailsBg}
            alt="Architectural Background"
            className="h-full min-h-[520px] w-full object-cover md:min-h-full"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/40"></div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl pb-4"
          >
            <span className="mb-6 inline-block rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {category}
            </span>
            <h1 className="mb-6 font-headline text-5xl font-extrabold leading-tight tracking-tighter text-white md:mb-8 md:text-7xl">
              {heroTitle}
            </h1>
            <p className="mb-10 text-xl leading-relaxed text-white/85 md:mb-12 md:max-w-2xl">
              {subtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <AppLink
                to="/contact"
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-8 py-4 font-headline font-bold text-primary transition-colors hover:bg-slate-100"
              >
                {heroCtaPrimary}
              </AppLink>
              {whatsappPhone ? (
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-headline font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {heroCtaSecondary}
                </a>
              ) : (
                <AppLink
                  to="/contact"
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-headline font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {heroCtaSecondary}
                </AppLink>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className={`bg-white ${hasRegistrationHub ? "pb-14 pt-14 md:pb-20 md:pt-16 lg:pt-24" : "pb-14 pt-14 md:pb-20 md:pt-16 lg:pt-24"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={hasRegistrationHub ? "w-full" : "max-w-4xl"}>
            {serviceIntro && hasRegistrationHub && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mx-auto mb-14 max-w-4xl text-center text-lg leading-relaxed text-on-surface-variant md:mb-16 md:text-xl"
              >
                {serviceIntro}
              </motion.p>
            )}

            {registeredBusinessBenefitsTitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-14 md:mb-20"
              >
                <div className="mb-10 text-center md:mb-12">
                  <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-primary mb-4">
                    {registeredBusinessBenefitsTitle}
                  </h2>
                  {registeredBusinessBenefitsText && (
                    <p className="mx-auto max-w-3xl text-lg leading-relaxed text-on-surface-variant">
                      {registeredBusinessBenefitsText}
                    </p>
                  )}
                </div>
                {registeredBusinessBenefitsCards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {registeredBusinessBenefitsCards.map((card: { title: string; description: string; icon?: string }, i: number) => {
                      const Icon = resolveLucideIcon(card.icon) || CheckCircle2;
                      return (
                        <div
                          key={i}
                          className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 md:p-7 transition-shadow hover:shadow-md"
                        >
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary md:h-16 md:w-16">
                            <Icon className="h-7 w-7 md:h-8 md:w-8" aria-hidden />
                          </div>
                          <h3 className="mb-2 font-headline text-lg font-bold text-primary">{card.title}</h3>
                          <p className="text-sm leading-relaxed text-on-surface-variant">{card.description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {!hasRegistrationHub && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-headline font-extrabold text-primary mb-2">
                {mainHeading}
              </h2>
              <div className="w-20 h-1.5 bg-secondary mb-10 md:mb-12 rounded-full"></div>

              <div className="space-y-8 text-on-surface-variant text-lg leading-relaxed mb-12 md:mb-16 whitespace-pre-line">
                {longDescription}
              </div>
            </motion.div>
            )}

            {!hasRegistrationHub && subServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 md:mb-16"
              >
                <h3 className="text-xl font-headline font-bold text-primary mb-8 flex items-center gap-3">
                  <Layers className="w-6 h-6 text-secondary" />
                  {subServicesTitle}
                </h3>
                {subServicesHaveDescriptions ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subServices.map((sub: { title: string; description?: string }, i: number) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 transition-shadow hover:shadow-md"
                      >
                        <h4 className="font-headline font-bold text-primary mb-2">{sub.title}</h4>
                        {sub.description && (
                          <p className="text-sm text-on-surface-variant leading-relaxed">{sub.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subServices.map((sub: { title: string }, i: number) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 text-on-surface-variant"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary mt-0.5" aria-hidden />
                        <span className="text-sm font-medium leading-relaxed">{sub.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}

            {!hasRegistrationHub && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
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
            )}

            {!hasRegistrationHub && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-14 border-t border-outline-variant/25 pt-12 md:mt-16 md:pt-14"
              aria-labelledby="service-consultation-heading"
            >
              <h3
                id="service-consultation-heading"
                className="mb-8 flex items-center gap-3 font-headline text-xl font-bold text-primary"
              >
                <MessageSquare className="h-6 w-6 shrink-0 text-secondary" aria-hidden />
                {consultationHeading}
              </h3>
              <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant whitespace-pre-line">
                {consultationClosing}
              </div>
            </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Registration types — blue section (matches home Why Choose Us) */}
      {hasRegistrationHub && (
        <section className="relative overflow-hidden bg-[#18335c] py-20 md:py-28">
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-[80px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-[80px]"
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 text-center md:mb-14"
            >
              <h2 className="mb-3 font-headline text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
                {registrationTypesHeading}
              </h2>
              {registrationTypesEyebrow && (
                <p className="mb-2 text-base font-semibold text-blue-100 md:text-lg">
                  {registrationTypesEyebrow}
                </p>
              )}
              {registrationTypesSubtext && (
                <p className="mx-auto max-w-3xl text-base leading-relaxed text-blue-100/90 md:text-lg">
                  {registrationTypesSubtext}
                </p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {subServices.map((sub: { id?: string; title: string; hook?: string; description?: string }, i: number) => {
                const cardCopy = resolveSubServiceCardCopy(sub, bundledSubServices);

                return sub.id ? (
                  <AppLink
                    key={sub.id}
                    to={`/services/${service.id}/${sub.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] md:p-7"
                  >
                    <h3 className="mb-2 font-headline text-lg font-bold text-[#18335c] group-hover:text-secondary">
                      {sub.title}
                    </h3>
                    {cardCopy.hook && (
                      <p className="mb-3 text-sm font-semibold leading-snug text-secondary">
                        {cardCopy.hook}
                      </p>
                    )}
                    {cardCopy.description && (
                      <p className="mb-5 flex-grow text-sm leading-relaxed text-on-surface-variant">
                        {cardCopy.description}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-secondary">
                      Know more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </AppLink>
                ) : (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white p-6 md:p-7"
                  >
                    <h3 className="mb-2 font-headline text-lg font-bold text-[#18335c]">{sub.title}</h3>
                    {cardCopy.description && (
                      <p className="text-sm leading-relaxed text-on-surface-variant">{cardCopy.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {postRegistrationHubBlock && (
        <section className="bg-white py-14 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-6">{postRegistrationHubBlock}</div>
        </section>
      )}

      {/* CTA Section — generous vertical rhythm above/below the card */}
      <section className="bg-surface-container-lowest px-6 py-14 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ rotateX: 1, rotateY: 1, scale: 1.01 }}
            viewport={{ once: true }}
            style={{ transformStyle: "preserve-3d" }}
            className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/20 transition-all duration-500 md:rounded-[3rem]"
          >
            <CtaImageCard
              className="rounded-[2.5rem] text-center text-white md:rounded-[3rem]"
              contentClassName="px-8 py-14 md:px-14 md:py-20 lg:px-16 lg:py-24"
            >
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-6 md:mb-8 text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
              {ctaTitle}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-on-primary/90 md:mb-12 md:text-xl font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              {ctaBlockSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
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
            </CtaImageCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
