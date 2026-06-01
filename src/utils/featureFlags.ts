/** When `true`, public routes show the coming-soon page instead of the full site. Set via `VITE_COMING_SOON` (Vercel client env). */
export function isComingSoonEnabled(): boolean {
  return import.meta.env.VITE_COMING_SOON === "true";
}
