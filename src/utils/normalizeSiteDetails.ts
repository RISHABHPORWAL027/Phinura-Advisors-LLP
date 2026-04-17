import defaults from "../data/siteDetails.json";
import type { SiteDetails } from "../services/types";

type UnknownRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is UnknownRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function cloneDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => cloneDeep(v)) as T;
  }
  if (isPlainObject(value)) {
    const out: UnknownRecord = {};
    for (const [k, v] of Object.entries(value)) out[k] = cloneDeep(v);
    return out as T;
  }
  return value;
}

function deepMergeWithDefaults(defaultValue: unknown, incomingValue: unknown): unknown {
  if (incomingValue === null || incomingValue === undefined) return cloneDeep(defaultValue);

  if (Array.isArray(defaultValue)) {
    return Array.isArray(incomingValue) ? cloneDeep(incomingValue) : cloneDeep(defaultValue);
  }

  if (isPlainObject(defaultValue)) {
    if (!isPlainObject(incomingValue)) return cloneDeep(defaultValue);
    const out: UnknownRecord = {};
    const keys = new Set([...Object.keys(defaultValue), ...Object.keys(incomingValue)]);
    for (const key of keys) {
      if (key in defaultValue) {
        out[key] = deepMergeWithDefaults((defaultValue as UnknownRecord)[key], incomingValue[key]);
      } else {
        out[key] = cloneDeep(incomingValue[key]);
      }
    }
    return out;
  }

  return incomingValue ?? cloneDeep(defaultValue);
}

/** Map DB / API rows (often snake_case) onto the camelCase shape the admin UI expects. */
function coerceServiceRow(raw: unknown): UnknownRecord {
  if (!isPlainObject(raw)) return {};
  const s = raw as UnknownRecord;
  const out: UnknownRecord = { ...s };

  if (out.heroTitle == null && s.hero_title != null) out.heroTitle = s.hero_title;
  if (out.mainHeading == null && s.main_heading != null) out.mainHeading = s.main_heading;
  if (out.longDescription == null && s.long_description != null) out.longDescription = s.long_description;
  if (out.ctaTitle == null && s.cta_title != null) out.ctaTitle = s.cta_title;
  if (out.subtitle == null && s.hero_subtitle != null) out.subtitle = s.hero_subtitle;
  if ((out.id == null || out.id === "") && s.slug != null) out.id = s.slug;

  for (const key of ["deliverables", "benefits"] as const) {
    let v = out[key];
    if (typeof v === "string") {
      try {
        v = JSON.parse(v);
      } catch {
        v = [];
      }
    }
    if (v != null && !Array.isArray(v)) v = [];
    out[key] = v;
  }

  delete out.hero_title;
  delete out.main_heading;
  delete out.long_description;
  delete out.cta_title;
  delete out.hero_subtitle;

  const detailStringKeys = [
    "heroTitle",
    "subtitle",
    "mainHeading",
    "longDescription",
    "ctaTitle",
    "category",
  ] as const;
  for (const k of detailStringKeys) {
    const v = out[k];
    if (typeof v === "string" && v.trim() === "") delete out[k];
  }

  return out;
}

function defaultServiceKey(s: UnknownRecord): string {
  return String(s.id ?? s.slug ?? "");
}

function findDefaultForService(defaultList: unknown[], row: UnknownRecord): UnknownRecord | undefined {
  const rid = String(row.id ?? "").toLowerCase();
  const rslug = String(row.slug ?? "").toLowerCase();
  for (const d of defaultList) {
    if (!isPlainObject(d)) continue;
    const did = String(d.id ?? "").toLowerCase();
    const dslug = String(d.slug ?? "").toLowerCase();
    if (rid && (rid === did || (dslug && rid === dslug))) return d;
    if (rslug && (rslug === did || (dslug && rslug === dslug))) return d;
  }
  return undefined;
}

/**
 * `serviceList` from remote CMS replaces the bundled array wholesale. Rows are often partial
 * or snake_case, while the public service page applies fallbacks — leaving the admin form blank.
 * Merge each incoming row with the bundled default for the same id (slug) so editable fields match the site.
 */
function mergeServiceLists(defaultList: unknown[], incomingList: unknown[]): unknown[] {
  return incomingList.map((raw) => {
    const row = coerceServiceRow(raw);
    const def = findDefaultForService(defaultList, row);

    if (!isPlainObject(def)) {
      return deepMergeWithDefaults({}, row);
    }

    const merged = deepMergeWithDefaults(def, row) as UnknownRecord;

    const detailKeys = ["heroTitle", "subtitle", "mainHeading", "longDescription", "ctaTitle", "category"] as const;
    for (const k of detailKeys) {
      const m = merged[k];
      const d = def[k];
      const empty = m === undefined || m === null || (typeof m === "string" && m.trim() === "");
      if (empty && typeof d === "string" && d.trim() !== "") merged[k] = cloneDeep(d);
    }

    const rowDel = row.deliverables;
    const rowBen = row.benefits;
    if (Array.isArray(rowDel) && rowDel.length === 0 && Array.isArray(def.deliverables) && (def.deliverables as unknown[]).length > 0) {
      merged.deliverables = cloneDeep(def.deliverables);
    }
    if (Array.isArray(rowBen) && rowBen.length === 0 && Array.isArray(def.benefits) && (def.benefits as unknown[]).length > 0) {
      merged.benefits = cloneDeep(def.benefits);
    }

    return merged;
  });
}

export function normalizeSiteDetails(input: unknown): SiteDetails {
  const merged = deepMergeWithDefaults(defaults as SiteDetails, input) as SiteDetails;

  const inc = isPlainObject(input) ? (input as UnknownRecord).pages : undefined;
  const incServices = isPlainObject(inc) ? ((inc as UnknownRecord).services as UnknownRecord | undefined)?.serviceList : undefined;

  if (Array.isArray(incServices) && incServices.length > 0) {
    const defaultServices = ((defaults as UnknownRecord).pages as UnknownRecord)?.services as UnknownRecord | undefined;
    const defaultList = Array.isArray(defaultServices?.serviceList) ? (defaultServices!.serviceList as unknown[]) : [];
    merged.pages.services.serviceList = mergeServiceLists(defaultList, incServices) as SiteDetails["pages"]["services"]["serviceList"];
  }

  return merged;
}

