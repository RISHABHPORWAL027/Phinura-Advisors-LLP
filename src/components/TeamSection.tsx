import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserRound, X } from "lucide-react";
import { AppLink } from "../navigation/AppLink";
import { useCMS } from "../hooks/useCMS";
import type { SiteDetails } from "../services/types";
import { RotatingLogoWatermark } from "./RotatingLogoWatermark";
import ambujProfile from "../Assets/team_profile/ambuj_profile.jpeg";
import shivaniProfile from "../Assets/team_profile/shivani_profile.jpeg";
import priyaProfile from "../Assets/team_profile/priya_profile.jpeg";

type TeamMember = SiteDetails["pages"]["about"]["people"]["team"][number];

/** Local headshots bundled from `src/Assets/team_profile` (override CMS image URL when present). */
const TEAM_MEMBER_HEADSHOTS: Record<string, string> = {
  "Ambuj Jain": ambujProfile,
  "Shivani Jain": shivaniProfile,
  "Priya Porwal": priyaProfile,
};

/** Crop/focus tweaks for photos with extra headroom or letterboxing in the source file. */
const TEAM_MEMBER_PHOTO_FRAMING: Record<string, string> = {
  "Ambuj Jain": "object-[center_20%]",
  "Shivani Jain": "object-[center_14%]",
  "Priya Porwal": "object-[center_84%]",
};

const TEAM_PHOTO_IMG_BASE =
  "block h-full w-full max-h-none max-w-none object-cover origin-top transition-transform duration-500 ease-out group-hover:scale-[1.03]";

const TEAM_PHOTO_IMG_STATIC =
  "block h-full w-full max-h-none max-w-none object-cover origin-top";

function teamPhotoClassName(member: TeamMember, base = TEAM_PHOTO_IMG_BASE): string {
  const framing = TEAM_MEMBER_PHOTO_FRAMING[member.name] ?? "object-[center_22%]";
  return `${base} ${framing}`;
}

function resolveTeamPhoto(member: TeamMember): string {
  const bundled = TEAM_MEMBER_HEADSHOTS[member.name];
  const url = typeof member.img === "string" ? member.img.trim() : "";
  return (bundled ?? url).trim();
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function TeamMemberPortraitFill({
  member,
  imgClassName,
}: {
  member: TeamMember;
  /** Applied only when a real photo is shown */
  imgClassName?: string;
}) {
  const src = resolveTeamPhoto(member);
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;
  const resolvedClassName = teamPhotoClassName(member, imgClassName ?? TEAM_PHOTO_IMG_BASE);

  useEffect(() => {
    setBroken(false);
  }, [member.name, src]);

  return showImage ? (
    <img
      src={src}
      alt={member.name}
      className={resolvedClassName}
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
    />
  ) : (
    <div
      className="flex h-full w-full min-h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/[0.12] via-slate-100 to-[#18335c]/[0.12] px-4 text-center"
      role="img"
      aria-label={`Photo placeholder for ${member.name}`}
    >
      <UserRound className="h-10 w-10 shrink-0 text-primary/[0.22]" aria-hidden strokeWidth={1.75} />
      <span className="font-headline text-4xl font-black uppercase tracking-[0.15em] text-primary/28 sm:text-5xl">{initialsFromName(member.name)}</span>
    </div>
  );
}

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

  const sectionBg = "bg-[#18335c]";

  return (
    <>
      <section className={`relative overflow-hidden py-16 md:py-24 px-6 ${sectionBg}`}>
        {/* Background Patterns */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ 
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <RotatingLogoWatermark side="right" tintClass="bg-white" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16 text-center md:text-left">
            <div className="max-w-3xl mx-auto md:mx-0">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-4">{title}</h2>
              <p className="text-blue-100/70 text-lg leading-relaxed">{subtitle}</p>
            </div>
            {variant === "home" ? (
              <AppLink
                to="/about"
                className="shrink-0 inline-flex items-center justify-center gap-2 text-white font-headline font-bold border-2 border-white/20 px-8 py-4 rounded-2xl hover:bg-white hover:text-[#18335c] transition-all"
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
                className="text-left group flex flex-col rounded-2xl border border-outline-variant/15 bg-white p-0 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden leading-[0]">
                  <TeamMemberPortraitFill member={person} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-4 left-4 right-4 text-sm font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    View profile
                  </span>
                </div>
                <div className="p-5 pt-4">
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
            aria-label={`${selected.name}, ${selected.role}`}
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
              className="relative z-10 w-full max-w-md flex flex-col rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-[0_25px_80px_-12px_rgba(0,31,73,0.35)] border border-outline-variant/15 overflow-hidden ring-1 ring-black/5 max-h-[min(90vh,640px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-primary shadow-md backdrop-blur-md border border-outline-variant/20 hover:bg-primary hover:text-white transition-colors"
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center px-6 pt-10 pb-8 md:px-10 md:pb-10 overflow-y-auto">
                <div className="relative mb-6 aspect-[4/5] w-full max-w-[200px] shrink-0 overflow-hidden rounded-2xl leading-[0] shadow-xl ring-1 ring-black/5">
                  <TeamMemberPortraitFill member={selected} imgClassName={teamPhotoClassName(selected, TEAM_PHOTO_IMG_STATIC)} />
                </div>

                <h2 className="font-headline text-2xl font-extrabold tracking-tight text-primary md:text-[1.65rem] px-1">
                  {selected.name}
                </h2>

                <p className="mt-2 text-[#B45309] text-[11px] font-bold tracking-[0.12em] uppercase mb-4 max-w-sm">
                  {selected.role}
                </p>

                <p className="text-sm text-on-surface-variant leading-relaxed text-left max-h-[42vh] overflow-y-auto whitespace-pre-line">
                  {selected.bio?.trim() ? selected.bio : selected.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
