import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SiteDetails } from "../services/types";
import { bundledSiteDetails } from "../data/bundledSiteDetails";
import { normalizeSiteDetails } from "../utils/normalizeSiteDetails";

interface CMSContextType {
  data: SiteDetails;
  loading: boolean;
  updateData: (newData: SiteDetails) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

type CMSProviderProps = {
  children: ReactNode;
  /** When set (e.g. under `/preview`), skip remote fetch and use this draft only. */
  previewDraft?: SiteDetails;
  /** Load live content from GitHub CMS — use on `/admin` only. */
  fetchRemote?: boolean;
};

export function CMSProvider({ children, previewDraft, fetchRemote = false }: CMSProviderProps) {
  const isPreview = previewDraft != null;
  const [data, setData] = useState<SiteDetails>(() =>
    isPreview ? normalizeSiteDetails(previewDraft) : bundledSiteDetails
  );
  const [loading, setLoading] = useState(() => fetchRemote && !isPreview);

  useEffect(() => {
    if (!fetchRemote || isPreview) return;

    let cancelled = false;
    async function loadData() {
      try {
        const { cms } = await import("../services/cmsFactory");
        const remoteData = await cms.getSiteDetails();
        if (!cancelled) {
          setData(normalizeSiteDetails(remoteData));
        }
      } catch (error) {
        console.error("Failed to load CMS data:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [fetchRemote, isPreview]);

  const updateData = async (newData: SiteDetails) => {
    if (isPreview) {
      console.warn("CMS save skipped: preview tab is read-only.");
      return;
    }
    try {
      const normalized = normalizeSiteDetails(newData);
      const { cms } = await import("../services/cmsFactory");
      await cms.updateSiteDetails(normalized);
      setData(normalized);
    } catch (error) {
      console.error("Failed to update CMS data:", error);
      throw error;
    }
  };

  return (
    <CMSContext.Provider value={{ data, loading, updateData }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}

/** Wrap admin routes so GitHub CMS is fetched only when editing content. */
export function AdminCMSProvider({ children }: { children: ReactNode }) {
  return <CMSProvider fetchRemote>{children}</CMSProvider>;
}
