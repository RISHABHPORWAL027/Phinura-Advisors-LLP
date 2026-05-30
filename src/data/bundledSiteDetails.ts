import initialData from "./siteDetails.json";
import { normalizeSiteDetails } from "../utils/normalizeSiteDetails";
import type { SiteDetails } from "../services/types";

/** Normalized once at build/load — public pages read this without re-merging JSON. */
export const bundledSiteDetails: SiteDetails = normalizeSiteDetails(initialData);
