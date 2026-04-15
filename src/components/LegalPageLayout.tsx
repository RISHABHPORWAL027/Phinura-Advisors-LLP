import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type Section = {
  title: string;
  body: string[];
  bullets: string[];
};

type SummaryCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

interface LegalPageLayoutProps {
  eyebrow: string;
  accentWord: string;
  heroTitle: string;
  heroSubtitle: string;
  backgroundImage: string;
  summaryCards: SummaryCard[];
  content: string;
  companyName: string;
  fullName: string;
  tagline: string;
  activePage: "privacy" | "terms";
}

const parseSections = (content: string): Section[] => {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      const [title, ...rest] = lines;
      const bullets = rest.filter((line) => line.startsWith("- "));
      const body = rest.filter((line) => !line.startsWith("- "));
      return {
        title: title || "",
        body,
        bullets: bullets.map((line) => line.slice(2)),
      };
    });
};

const splitTitle = (title: string, accentWord: string) => {
  const match = title.toLowerCase().lastIndexOf(accentWord.toLowerCase());
  if (match === -1) {
    return { before: title, accent: "" };
  }

  return {
    before: title.slice(0, match),
    accent: title.slice(match),
  };
};

export function LegalPageLayout({
  eyebrow,
  accentWord,
  heroTitle,
  heroSubtitle,
  backgroundImage,
  summaryCards,
  content,
  companyName,
  fullName,
  tagline,
  activePage,
}: LegalPageLayoutProps) {
  const { before, accent } = splitTitle(heroTitle, accentWord);
  const sections = parseSections(content);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt={heroTitle}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/88 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
              {eyebrow}
            </span>
            <h1 className="mb-6 text-5xl font-headline font-extrabold leading-tight tracking-tight text-white md:text-7xl">
              {before}
              {accent && <span className="text-secondary">{accent}</span>}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-white/85 md:text-2xl">
              {heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 pb-8 md:-mt-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[2rem] border border-outline-variant/30 bg-white p-8 shadow-xl shadow-primary/5"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-fixed text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mb-3 text-xl font-headline font-bold text-primary">{card.title}</h2>
                <p className="text-sm leading-relaxed text-on-surface-variant">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="pb-20 pt-8 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.92fr_1.4fr]">
          <div className="rounded-[2.25rem] border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-lg shadow-primary/5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary">Quick Overview</p>
            <h2 className="mb-4 text-3xl font-headline font-extrabold text-primary">{heroTitle}</h2>
            <p className="mb-8 text-on-surface-variant leading-relaxed">{heroSubtitle}</p>
            <div className="space-y-3">
              {sections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="block rounded-2xl border border-outline-variant/20 px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.article
                key={section.title}
                id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[2.25rem] border border-outline-variant/20 bg-white p-8 shadow-lg shadow-primary/5 md:p-10"
              >
                <h3 className="mb-5 text-2xl font-headline font-bold text-primary">{section.title}</h3>
                <div className="space-y-4 text-base leading-relaxed text-on-surface-variant">
                  {section.body.map((paragraph, paragraphIndex) => (
                    <p key={`${section.title}-p-${paragraphIndex}`}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets.length > 0 && (
                  <ul className="mt-6 space-y-3 text-sm leading-relaxed text-on-surface-variant">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary"></span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <h4 className="mb-2 font-bold text-primary">{companyName}</h4>
            <p className="max-w-xs text-xs text-on-surface-variant">
              © {new Date().getFullYear()} {fullName}. All rights reserved. {tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-xs font-medium text-on-surface-variant">
            <Link to="/privacy" className={activePage === "privacy" ? "font-bold text-primary" : "transition-colors hover:text-primary"}>
              Privacy Policy
            </Link>
            <Link to="/terms" className={activePage === "terms" ? "font-bold text-primary" : "transition-colors hover:text-primary"}>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
