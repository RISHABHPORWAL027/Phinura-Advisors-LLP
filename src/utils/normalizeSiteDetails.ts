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

export function normalizeSiteDetails(input: unknown): SiteDetails {
  return deepMergeWithDefaults(defaults as SiteDetails, input) as SiteDetails;
}

