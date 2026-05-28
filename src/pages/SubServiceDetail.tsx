import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  HelpCircle,
  ListOrdered,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { AppLink } from "../navigation/AppLink";
import { useCMS } from "../hooks/useCMS";
import { CtaImageCard } from "../components/CtaImageCard";
import { getSubServicePageContent } from "../utils/subServiceContent";
import detailsBg from "../Assets/details_page_bg.avif";

function FeatureCards({ items }: { items: { title: string; description: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 md:p-6"
        >
          <h3 className="mb-2 font-headline text-base font-bold text-primary">{item.title}</h3>
          <p className="text-sm leading-relaxed text-on-surface-variant">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function BulletList({ items, iconClass = "text-secondary" }: { items: string[]; iconClass?: string }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-on-surface-variant">
          <CheckCircle2 className={`h-5 w-5 shrink-0 mt-0.5 ${iconClass}`} aria-hidden />
          <span className="text-sm font-medium leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="font-headline font-bold text-primary text-sm md:text-base">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-secondary transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-outline-variant/15 px-5 pb-5 pt-3 text-sm leading-relaxed text-on-surface-variant">
          {answer}
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: typeof CheckCircle2;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={className}
    >
      <h2 className="mb-6 flex items-center gap-3 font-headline text-2xl font-extrabold text-primary md:text-3xl">
        <Icon className="h-7 w-7 shrink-0 text-secondary" aria-hidden />
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

export const SubServiceDetail = () => {
  const { serviceId, subServiceId } = useParams<{ serviceId: string; subServiceId: string }>();
  const { data, loading } = useCMS();

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const services = data.pages.services.serviceList || [];
  const serviceIdNormalized = (serviceId || "").toLowerCase();
  const service =
    services.find((s: any) => String(s?.id ?? "").toLowerCase() === serviceIdNormalized) ||
    services.find((s: any) => String(s?.slug ?? "").toLowerCase() === serviceIdNormalized);

  const content = getSubServicePageContent(serviceId || "", subServiceId || "", service.subServices);

  const heroCtaPrimary =
    service.heroCtaPrimary?.trim() || data.pages.home.hero.buttonText || "Get Started";
  const heroCtaSecondary =
    service.heroCtaSecondary?.trim() || data.pages.home.hero.secondaryButtonText || "Talk to Expert";

  if (!service || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center px-6">
          <h1 className="text-4xl font-headline font-bold text-primary mb-4">Page Not Found</h1>
          <AppLink to="/services" className="text-secondary font-bold inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Back to Services
          </AppLink>
        </div>
      </div>
    );
  }

  const whatsappPhone = String(data.mobile || "").replace(/\D/g, "");
  const telHref = whatsappPhone ? `tel:+${whatsappPhone}` : "/contact";
  const parentTitle = service.title || "Services";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-[7.25rem] pb-20 sm:pb-24 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32">
        <div className="absolute inset-0 z-0 min-h-full">
          <img
            src={detailsBg}
            alt=""
            className="h-full min-h-[520px] w-full object-cover md:min-h-full"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <AppLink
            to={`/services/${service.id}`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {parentTitle}
          </AppLink>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl pb-4"
          >
            <span className="mb-6 inline-block rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {service.category || "Registration"}
            </span>
            <h1 className="mb-6 font-headline text-4xl font-extrabold leading-tight tracking-tighter text-white md:mb-8 md:text-6xl">
              {content.heroTitle}
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-white/85 md:mb-12 md:max-w-2xl md:text-xl">
              {content.shortDescription}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <AppLink
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-8 py-4 font-headline font-bold text-primary transition-colors hover:bg-slate-100"
              >
                {heroCtaPrimary}
              </AppLink>
              {whatsappPhone ? (
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-headline font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {heroCtaSecondary}
                </a>
              ) : (
                <AppLink
                  to="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-headline font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {heroCtaSecondary}
                </AppLink>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-14 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-14 md:space-y-20">
            <SectionBlock title={content.whyChooseHeading} icon={Sparkles}>
              {content.whyChooseIntro && (
                <p className="mb-6 text-lg leading-relaxed text-on-surface-variant">{content.whyChooseIntro}</p>
              )}
              {content.whyChooseFeatures && content.whyChooseFeatures.length > 0 ? (
                <FeatureCards items={content.whyChooseFeatures} />
              ) : content.whyChooseItems && content.whyChooseItems.length > 0 ? (
                <BulletList items={content.whyChooseItems} />
              ) : null}
            </SectionBlock>

            <SectionBlock title={content.whatIsHeading} icon={HelpCircle}>
              <p className="mb-6 text-lg leading-relaxed text-on-surface-variant">{content.whatIsDescription}</p>
              {content.keyPoints && content.keyPoints.length > 0 && (
                <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8">
                  {content.keyPointsHeading && (
                    <h3 className="mb-4 font-headline text-lg font-bold text-primary">{content.keyPointsHeading}</h3>
                  )}
                  <BulletList items={content.keyPoints} iconClass="text-primary" />
                </div>
              )}
            </SectionBlock>

            {/* Key Features + Benefits side by side */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20"
            >
              <div>
                <h2 className="mb-4 flex items-center gap-3 font-headline text-2xl font-extrabold text-primary md:text-3xl">
                  <Star className="h-7 w-7 shrink-0 text-secondary" aria-hidden />
                  {content.keyFeaturesHeading}
                </h2>
                {content.keyFeaturesIntro && (
                  <p className="mb-6 text-sm leading-relaxed text-on-surface-variant md:text-base">
                    {content.keyFeaturesIntro}
                  </p>
                )}
                <BulletList items={content.keyFeatures} />
              </div>

              <div>
                <h2 className="mb-4 flex items-center gap-3 font-headline text-2xl font-extrabold text-primary md:text-3xl">
                  <Target className="h-7 w-7 shrink-0 text-secondary" aria-hidden />
                  Benefits
                </h2>
                {content.benefitsIntro && (
                  <p className="mb-6 text-sm leading-relaxed text-on-surface-variant md:text-base">
                    {content.benefitsIntro}
                  </p>
                )}
                {content.benefitFeatures && content.benefitFeatures.length > 0 ? (
                  <FeatureCards items={content.benefitFeatures} />
                ) : (
                <ol className="space-y-4">
                  {content.benefits.map((item, i) => (
                    <li key={i} className="flex gap-4 text-on-surface-variant">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-xs font-bold text-secondary">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium leading-relaxed pt-0.5">{item}</span>
                    </li>
                  ))}
                </ol>
                )}
              </div>
            </motion.div>

            {content.registrableItems && content.registrableItems.length > 0 && (
              <SectionBlock title={content.registrableItemsHeading || "What Can Be Registered?"} icon={FileText}>
                <div className="flex flex-wrap gap-3">
                  {content.registrableItems.map((item, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-outline-variant/25 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </SectionBlock>
            )}

            {content.processSteps && content.processSteps.length > 0 && (
              <SectionBlock title={content.processStepsHeading || "Process"} icon={ListOrdered}>
                <ol className="space-y-6">
                  {content.processSteps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="mb-1 font-headline font-bold text-primary">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-on-surface-variant">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </SectionBlock>
            )}

            {content.documentsRequired && content.documentsRequired.length > 0 && (
              <SectionBlock title={content.documentsHeading || "Documents Required"} icon={ClipboardList}>
                <BulletList items={content.documentsRequired} iconClass="text-primary" />
              </SectionBlock>
            )}

            {content.labeledSections?.map((section, i) => (
              <SectionBlock key={i} title={section.title} icon={HelpCircle}>
                {section.intro && (
                  <p className="mb-6 text-lg leading-relaxed text-on-surface-variant">{section.intro}</p>
                )}
                {section.items && section.items.length > 0 && <FeatureCards items={section.items} />}
                {section.bullets && section.bullets.length > 0 && (
                  <BulletList items={section.bullets} iconClass="text-primary" />
                )}
              </SectionBlock>
            ))}

            <SectionBlock title={content.whyChooseUsHeading} icon={CheckCircle2}>
              {content.whyChooseUsIntro && (
                <p className="mb-6 text-lg leading-relaxed text-on-surface-variant">{content.whyChooseUsIntro}</p>
              )}
              <BulletList items={content.whyChooseUs} />
            </SectionBlock>

            {content.whoShouldApply && content.whoShouldApply.length > 0 && (
              <SectionBlock title={content.whoShouldApplyHeading || "Who Should Apply?"} icon={Users}>
                <div className="flex flex-wrap gap-3">
                  {content.whoShouldApply.map((item, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-outline-variant/25 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </SectionBlock>
            )}

            {content.idealFor && content.idealFor.length > 0 && (
              <SectionBlock title={content.idealForHeading || "Ideal For"} icon={Target}>
                <div className="flex flex-wrap gap-3">
                  {content.idealFor.map((item, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-outline-variant/25 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </SectionBlock>
            )}

            {content.faq.length > 0 && (
              <SectionBlock title="FAQ" icon={HelpCircle}>
                <div className="space-y-3">
                  {content.faq.map((item, i) => (
                    <FaqItem key={i} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </SectionBlock>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-container-lowest px-6 py-14 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/20 md:rounded-[3rem]"
          >
            <CtaImageCard
              className="rounded-[2.5rem] text-center text-white md:rounded-[3rem]"
              contentClassName="px-8 py-14 md:px-14 md:py-20 lg:px-16 lg:py-24"
            >
              <h2 className="mb-8 font-headline text-3xl font-extrabold text-white md:text-5xl [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
                {content.ctaTitle}
              </h2>
              <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 font-headline font-bold text-lg text-primary transition-colors hover:bg-slate-100"
                >
                  <PhoneCall className="h-5 w-5" />
                  Call Us
                </a>
                {whatsappPhone ? (
                  <a
                    href={`https://wa.me/${whatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 font-headline font-bold text-lg text-white transition-colors hover:bg-emerald-600"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                ) : null}
              </div>
            </CtaImageCard>
          </motion.div>
        </div>
      </section>

      {/* Other registration types */}
      <section className="border-t border-outline-variant/20 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-8 font-headline text-2xl font-extrabold text-primary md:text-3xl">
            Explore Other Registration Types
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(service.subServices || [])
              .filter((s: any) => s?.id && s.id !== content.id)
              .map((sub: any) => (
                <AppLink
                  key={sub.id}
                  to={`/services/${service.id}/${sub.id}`}
                  className="group flex items-center justify-between rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 transition-all hover:border-secondary/40 hover:shadow-md"
                >
                  <span className="pr-4 text-sm font-bold text-primary group-hover:text-secondary">{sub.title}</span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-secondary transition-transform group-hover:translate-x-1" />
                </AppLink>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};
