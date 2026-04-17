/** Always show this many cards in the home “Core Services” grid. */
export const HOMEPAGE_FEATURED_SERVICE_COUNT = 3;

type ServiceLike = { id: string };

/**
 * Picks up to {@link HOMEPAGE_FEATURED_SERVICE_COUNT} services for the home teaser:
 * 1) Use `featuredIds` in order (skip unknown / empty ids).
 * 2) Fill remaining slots from `allServices` (no duplicates), in list order.
 */
export function getHomepageFeaturedServices<T extends ServiceLike>(
  allServices: T[],
  featuredIds: string[] | undefined
): T[] {
  const max = HOMEPAGE_FEATURED_SERVICE_COUNT;
  const list = Array.isArray(allServices) ? allServices : [];
  if (list.length === 0) return [];

  const seen = new Set<string>();
  const picked: T[] = [];

  const rawIds = Array.isArray(featuredIds) ? featuredIds : [];
  for (const id of rawIds) {
    if (picked.length >= max) break;
    if (!id || typeof id !== "string" || !id.trim()) continue;
    const s = list.find((x) => x.id === id);
    if (s && !seen.has(s.id)) {
      picked.push(s);
      seen.add(s.id);
    }
  }

  for (const s of list) {
    if (picked.length >= max) break;
    if (!seen.has(s.id)) {
      picked.push(s);
      seen.add(s.id);
    }
  }

  return picked.slice(0, max);
}

/** Map stored ids to three slot values for admin dropdowns (unique, order preserved). */
export function featuredIdsToSlots(ids: string[] | undefined): [string, string, string] {
  const raw = [...(ids || [])].slice(0, HOMEPAGE_FEATURED_SERVICE_COUNT);
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const id of raw) {
    if (!id?.trim() || seen.has(id)) continue;
    unique.push(id);
    seen.add(id);
  }
  return [
    unique[0] ?? "",
    unique[1] ?? "",
    unique[2] ?? "",
  ];
}

/** Persist three slot dropdowns as a deduped id list (max 3). */
export function slotsToFeaturedIds(slots: [string, string, string]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const s of slots) {
    const id = (s || "").trim();
    if (!id || seen.has(id)) continue;
    out.push(id);
    seen.add(id);
  }
  return out.slice(0, HOMEPAGE_FEATURED_SERVICE_COUNT);
}
