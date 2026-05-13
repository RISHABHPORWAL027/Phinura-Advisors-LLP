import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, BadgeCheck, User } from "lucide-react";
import { AppLink } from "../navigation/AppLink";
import { useCMS } from "../hooks/useCMS";
import type { SiteDetails } from "../services/types";
import logo from "../Assets/Phinura_Advisors_logo.png";

type TeamMember = SiteDetails["pages"]["about"]["people"]["team"][number];

type Props = {
  variant: "home" | "about";
};

export function TeamSection({ variant }: Props) {
  const { data } = useCMS();
  const people = data.pages.about.people;
  const homeTeam = data.pages.home.team;
  const [selected, setSelected] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  const title = variant === "home" && homeTeam?.title ? homeTeam.title : people.title;
  const subtitle = variant === "home" && homeTeam?.subtitle ? homeTeam.subtitle : people.subtitle;
  const aboutLinkText = homeTeam?.aboutLinkText ?? "About us";

  const sectionBg = variant === "about" ? "bg-white" : "bg-surface-container-low";

  return (
    <>
      <section className={`relative overflow-hidden py-16 md:py-24 px-6 ${sectionBg}`}>
        {/* Background Rotating Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -translate-y-1/2 -right-[300px] md:-right-[400px] w-[600px] md:w-[800px] h-[600px] md:h-[800px] opacity-[0.1] pointer-events-none bg-primary"
          style={{
            WebkitMaskImage: `url(${logo})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: `url(${logo})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center"
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16 text-center md:text-left">
            <div className="max-w-3xl mx-auto md:mx-0">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-4">{title}</h2>
              <p className="text-on-surface-variant text-lg opacity-80 leading-relaxed">{subtitle}</p>
            </div>
            {variant === "home" ? (
              <AppLink
                to="/about"
                className="shrink-0 inline-flex items-center justify-center gap-2 text-primary font-headline font-bold border-2 border-primary px-8 py-4 rounded-2xl hover:bg-primary hover:text-white transition-colors"
              >
                {aboutLinkText}
              </AppLink>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {people.team.map((person, i) => (
              <motion.button
                key={`${person.name}-${i}`}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(person)}
                className="text-left group rounded-2xl border border-outline-variant/15 bg-white shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <span className="absolute bottom-4 left-4 right-4 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    View profile
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-headline font-bold text-primary mb-1">{person.name}</h3>
                  <p className="text-secondary text-[10px] font-bold tracking-widest uppercase opacity-90 mb-2">{person.role}</p>
                  <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2 opacity-80">{person.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {variant === "home" ? (
            <p className="text-center mt-12 md:hidden">
              <AppLink to="/about" className="text-primary font-bold underline underline-offset-4">
                {aboutLinkText}
              </AppLink>
            </p>
          ) : null}
        </div>
      </section>

      <AnimatePresence>
        {selected ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-primary/65 backdrop-blur-[6px] cursor-default transition-opacity"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 w-full max-w-4xl max-h-[min(90vh,880px)] flex flex-col rounded-[1.75rem] md:rounded-[2rem] bg-white shadow-[0_25px_80px_-12px_rgba(0,31,73,0.35)] border border-outline-variant/15 overflow-hidden ring-1 ring-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-primary shadow-lg backdrop-blur-md border border-outline-variant/20 hover:bg-primary hover:text-white transition-colors"
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[minmax(320px,40%)_1fr] bg-white flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
                
                {/* LEFT COLUMN */}
                <div className="bg-[#F6F6F6] p-8 md:p-10 flex flex-col items-center border-r border-outline-variant/10 md:overflow-y-auto">
                  <div className="w-full max-w-[280px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl mb-8 border-4 border-white shrink-0">
                    <img
                      src={selected.img}
                      alt={selected.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 id="team-modal-title" className="text-3xl font-headline font-extrabold text-[#0D1B2A] text-center mb-2">
                    {selected.name}
                  </h3>
                  <p className="text-[#B45309] text-xs font-bold tracking-[0.15em] uppercase text-center mb-8">
                    {selected.role}
                  </p>
                  
                  <div className="w-full border-t border-outline-variant/15 mb-8"></div>

                  <div className="w-full pl-4 md:pl-0 max-w-[280px]">
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-4">Roles</h4>
                    <ul className="space-y-3 mb-8">
                      {(selected.rolesList || ["Tax & Audit Lead", "Business Advisor"]).map((r: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-[#0D1B2A]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></div>
                          {r}
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-4">Core Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selected.expertise || ["Company Registration", "GST & Income Tax", "MCA Compliance"]).map((ex: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-100/50 text-[#0D1B2A] text-xs font-bold rounded-full border border-blue-200/50">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="p-8 md:p-12 md:overflow-y-auto relative">
                  {/* Track Record Section */}
                  <div className="mb-12">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <BadgeCheck className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-headline font-extrabold text-[#0D1B2A]">Track Record</h3>
                    </div>

                    <div className="space-y-4">
                      {(selected.trackRecord || [
                        { stat: "10+", title: "Years of Experience", desc: "A decade of helping Indian businesses stay compliant and profitable." },
                        { stat: "500+", title: "Happy Clients", desc: "Successfully advised hundreds of startups and established firms." },
                        { stat: "100%", title: "Compliance Focus", desc: "Dedicated to keeping your business safe from penalties and notices." }
                      ]).map((tr: any, i: number) => (
                        <div key={i} className="bg-[#FCFCFC] border border-outline-variant/20 rounded-2xl p-6 flex gap-6 items-center hover:shadow-md transition-shadow">
                          <div className="text-3xl font-extrabold text-[#B45309] min-w-[70px]">
                            {tr.stat}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#0D1B2A] mb-1">{tr.title}</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">{tr.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] text-white flex items-center justify-center shadow-lg shadow-[#0D1B2A]/20">
                        <User className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-headline font-extrabold text-[#0D1B2A]">About</h3>
                    </div>

                    <blockquote className="border-l-4 border-[#B45309] pl-6 py-1 mb-8">
                      <p className="text-base text-on-surface-variant italic font-medium leading-relaxed">
                        "{(selected.bioQuote || "We don't just crunch numbers; we provide peace of mind so you can focus on growing your business.")}"
                      </p>
                    </blockquote>

                    <p className="text-sm text-on-surface-variant leading-loose whitespace-pre-line">
                      {selected.bio?.trim() ? selected.bio : selected.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
