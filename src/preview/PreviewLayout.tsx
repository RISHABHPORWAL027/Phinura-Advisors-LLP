import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CMSProvider } from "../hooks/useCMS";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { readAdminPreviewDraft } from "../lib/adminPreview";
import type { SiteDetails } from "../services/types";
import { normalizeSiteDetails } from "../utils/normalizeSiteDetails";
import { PreviewLinkBaseProvider } from "../navigation/AppLink";

const PageLoading = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-surface">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

function PreviewFooterGate() {
  const { pathname } = useLocation();
  if (pathname === "/preview" || pathname === "/preview/about") return <Footer />;
  return null;
}

export function PreviewLayout() {
  const [draft, setDraft] = useState<SiteDetails | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    try {
      const raw = readAdminPreviewDraft();
      if (!raw) {
        setMissing(true);
        return;
      }
      setDraft(JSON.parse(raw) as SiteDetails);
    } catch {
      setMissing(true);
    }
  }, []);

  if (missing) {
    return <Navigate to="/admin" replace />;
  }

  if (!draft) {
    return <PageLoading />;
  }

  const normalized = normalizeSiteDetails(draft);

  return (
    <CMSProvider previewDraft={normalized}>
      <PreviewLinkBaseProvider base="/preview">
        <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed pb-14">
          <Navbar />
          <main>
            <Outlet />
          </main>
          <PreviewFooterGate />
          <div className="fixed bottom-0 left-0 right-0 z-[110] bg-amber-500 text-amber-950 text-center text-sm font-semibold py-2.5 px-4 border-t border-amber-600/30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            Preview — unsaved draft. Close this tab when done; use Save in Admin to publish to GitHub.
          </div>
        </div>
      </PreviewLinkBaseProvider>
    </CMSProvider>
  );
}
