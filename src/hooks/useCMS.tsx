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

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteDetails>(initialData as SiteDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const updateData = async (newData: SiteDetails) => {
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
