import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SiteDetails } from "../services/types";
import { cms } from "../services/cmsFactory";
import initialData from "../data/siteDetails.json";
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
};

export function CMSProvider({ children, previewDraft }: CMSProviderProps) {
  const isPreview = previewDraft != null;
  const [data, setData] = useState<SiteDetails>(() =>
    isPreview ? normalizeSiteDetails(previewDraft) : (initialData as SiteDetails)
  );
  const [loading, setLoading] = useState(() => !isPreview);

  useEffect(() => {
    if (isPreview) {
      setLoading(false);
      return;
    }
    async function loadData() {
      try {
        const remoteData = await cms.getSiteDetails();
        setData(normalizeSiteDetails(remoteData));
      } catch (error) {
        console.error("Failed to load CMS data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isPreview]);

  const updateData = async (newData: SiteDetails) => {
    if (isPreview) {
      console.warn("CMS save skipped: preview tab is read-only.");
      return;
    }
    try {
      const normalized = normalizeSiteDetails(newData);
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
