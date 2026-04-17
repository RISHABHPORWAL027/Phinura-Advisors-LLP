import { useState, useEffect } from "react";
import { useCMS } from "../../hooks/useCMS";
import { Save, AlertCircle, CheckCircle2, LayoutDashboard, FileText, Settings, Phone, Info, Briefcase, Plus, Trash2, Shield, Eye } from "lucide-react";
import { SiteDetails } from "../../services/types";
import { GitHubCMSService } from "../../services/githubService";
import { SupabaseCMSService } from "../../services/supabaseService";
import { supabase } from "../../lib/supabase";
import { normalizeSiteDetails } from "../../utils/normalizeSiteDetails";
import { storeAdminPreviewDraft, clearAdminPreviewDraft } from "../../lib/adminPreview";
import { LUCIDE_SERVICE_ICON_OPTIONS_SORTED } from "../../constants/lucideServiceIconOptions";
import { LucideIconSelect } from "../../components/admin/LucideIconSelect";
import {
  featuredIdsToSlots,
  slotsToFeaturedIds,
  HOMEPAGE_FEATURED_SERVICE_COUNT,
} from "../../utils/homeFeaturedServices";

/** Full clone so nested updates never mutate `prev` (React Strict Mode runs updaters twice in dev). */
function cloneFormState(prev: SiteDetails): SiteDetails {
  return structuredClone(prev);
}

export function AdminDashboard() {
  const { data, loading, updateData } = useCMS();
  const [formData, setFormData] = useState<SiteDetails | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"general" | "home" | "about" | "services" | "contact" | "legal">("general");
  const isGitHubMode = import.meta.env.VITE_CMS_BACKEND === "github";
  const isInsecureAdmin = import.meta.env.VITE_INSECURE_ADMIN === "true";
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return sessionStorage.getItem("adminPassword") || "";
    } catch {
      return "";
    }
  });
  const [authPassword, setAuthPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<"idle" | "checking" | "error">("idle");
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "error" | "success">("idle");

  // Initialize form after CMS data is ready (avoid render-phase setState; re-run when `data` updates from fetch/save)
  useEffect(() => {
    if (loading || !data) return;
    setFormData((prev) => {
      if (prev) return prev;
      const cloned = JSON.parse(JSON.stringify(normalizeSiteDetails(data)));
      if (cloned?.pages?.services?.serviceList && Array.isArray(cloned.pages.services.serviceList)) {
        cloned.pages.services.serviceList = cloned.pages.services.serviceList.map((service: any) => ({
          ...service,
          heroTitle: service.heroTitle ?? "",
          subtitle: service.subtitle ?? "",
          mainHeading: service.mainHeading ?? "",
          longDescription: service.longDescription ?? "",
          ctaTitle: service.ctaTitle ?? "",
          category: service.category ?? "",
          deliverables: Array.isArray(service.deliverables) ? service.deliverables : [],
          benefits: Array.isArray(service.benefits) ? service.benefits : [],
        }));
      }
      if (cloned?.pages?.services?.statsCTA?.stats && !Array.isArray(cloned.pages.services.statsCTA.stats)) {
        cloned.pages.services.statsCTA.stats = [];
      }
      return cloned;
    });
  }, [loading, data]);

  const handleUnlock = async () => {
    setAuthStatus("checking");
    try {
      const ok = await GitHubCMSService.validatePassword(authPassword);
      if (!ok) {
        setAuthStatus("error");
        return;
      }
      try {
        sessionStorage.setItem("adminPassword", authPassword);
      } catch {
        // ignore
      }
      setAdminPassword(authPassword);
      setAuthPassword("");
      setAuthStatus("idle");
    } catch (e) {
      console.error(e);
      setAuthStatus("error");
    }
  };

  const handlePreviewInNewTab = () => {
    if (!formData) return;
    try {
      storeAdminPreviewDraft(normalizeSiteDetails(formData));
      window.open("/preview", "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
      alert("Could not open preview. Check that local storage is allowed for this site (private windows may block it).");
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      await updateData(formData);
      clearAdminPreviewDraft();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
      if (String((error as any)?.message || error).toLowerCase().includes("unauthorized")) {
        setAdminPassword("");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportFromSupabase = async () => {
    if (!supabase) {
      setImportStatus("error");
      return;
    }
    setImportStatus("importing");
    try {
      const supa = new SupabaseCMSService();
      const imported = await supa.getSiteDetails();
      await updateData(imported); // In GitHub mode this writes to GitHub
      setFormData(JSON.parse(JSON.stringify(normalizeSiteDetails(imported))));
      setImportStatus("success");
      setTimeout(() => setImportStatus("idle"), 4000);
    } catch (e) {
      console.error(e);
      setImportStatus("error");
    }
  };

  const handleChange = (path: (string | number)[], value: any) => {
    if (!formData) return;
    
    setFormData((prev) => {
      if (!prev) return prev;
      const newData = cloneFormState(prev);
      let current: any = newData;
      let parent: any = null;
      let parentKey: string | number | null = null;

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextKey = path[i + 1];
        const shouldBeArray = typeof nextKey === "number";

        if (typeof key === "number") {
          if (!Array.isArray(current)) {
            if (parent && parentKey !== null) parent[parentKey] = [];
            current = parent && parentKey !== null ? parent[parentKey] : [];
          }
          const existing = current[key];
          if (existing === null || existing === undefined || (shouldBeArray ? !Array.isArray(existing) : typeof existing !== "object" || Array.isArray(existing))) {
            current[key] = shouldBeArray ? [] : {};
          }
          parent = current;
          parentKey = key;
          current = current[key];
        } else {
          const existing = current[key];
          if (existing === null || existing === undefined || (shouldBeArray ? !Array.isArray(existing) : typeof existing !== "object" || Array.isArray(existing))) {
            current[key] = shouldBeArray ? [] : {};
          }
          parent = current;
          parentKey = key;
          current = current[key];
        }
      }
      current[path[path.length - 1]] = value;
      
      return newData;
    });
  };

  const handleArrayAdd = (path: (string | number)[], newItem: any) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return prev;
      const newData = cloneFormState(prev);
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextKey = path[i + 1];
        const shouldBeArray = typeof nextKey === "number";
        const existing = current[key as any];
        if (existing === null || existing === undefined || (shouldBeArray ? !Array.isArray(existing) : typeof existing !== "object" || Array.isArray(existing))) {
          current[key as any] = shouldBeArray ? [] : {};
        }
        current = current[key as any];
      }
      const key = path[path.length - 1];
      const existing = current[key];
      const arr = Array.isArray(existing) ? existing : [];
      current[key] = [...arr, newItem];
      return newData;
    });
  };

  const handleArrayRemove = (path: (string | number)[], index: number) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return prev;
      const newData = cloneFormState(prev);
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextKey = path[i + 1];
        const shouldBeArray = typeof nextKey === "number";
        const existing = current[key as any];
        if (existing === null || existing === undefined || (shouldBeArray ? !Array.isArray(existing) : typeof existing !== "object" || Array.isArray(existing))) {
          current[key as any] = shouldBeArray ? [] : {};
        }
        current = current[key as any];
      }
      const key = path[path.length - 1];
      const existing = current[key];
      if (!Array.isArray(existing)) return newData;
      const arr = [...existing];
      arr.splice(index, 1);
      current[key] = arr;
      return newData;
    });
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isGitHubMode && !isInsecureAdmin && !adminPassword) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-surface flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-on-surface">Admin Login</h1>
          <p className="text-sm text-on-surface-variant mt-2">Enter the shared password to access the editor.</p>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-on-surface">Password</label>
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
            {authStatus === "error" && (
              <p className="text-sm text-red-600">Wrong password or server not configured.</p>
            )}
          </div>

          <button
            onClick={handleUnlock}
            disabled={!authPassword || authStatus === "checking"}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {authStatus === "checking" ? "Checking..." : "Unlock"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-surface flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface-container-lowest border-r border-outline-variant p-6 flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Admin Portal</h2>
          <p className="text-sm text-on-surface-variant mt-1">Content Management</p>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "general" 
                ? "bg-primary-fixed text-on-primary-fixed" 
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">General Details</span>
          </button>
          
          <button
            onClick={() => setActiveTab("home")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "home" 
                ? "bg-secondary-fixed text-on-secondary-fixed" 
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Home Page</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "about" 
                ? "bg-secondary-fixed text-on-secondary-fixed" 
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Info size={20} />
            <span className="font-medium">About Page</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "services" 
                ? "bg-secondary-fixed text-on-secondary-fixed" 
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Briefcase size={20} />
            <span className="font-medium">Services Page</span>
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "contact" 
                ? "bg-tertiary-fixed text-on-tertiary-fixed" 
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Phone size={20} />
            <span className="font-medium">Contact & Social</span>
          </button>

          <button
            onClick={() => setActiveTab("legal")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "legal" 
                ? "bg-red-100 text-red-900" 
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Shield size={20} />
            <span className="font-medium">Legal Pages</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">
                {activeTab === "general" && "General Details"}
                {activeTab === "home" && "Home Page Content"}
                {activeTab === "about" && "About Page Content"}
                {activeTab === "services" && "Services Page Content"}
                {activeTab === "contact" && "Contact Information"}
                {activeTab === "legal" && "Terms & Privacy Content"}
              </h1>
              <p className="text-on-surface-variant mt-2">
                Make changes below and click save. The website will update instantly.
              </p>
              {isGitHubMode && (
                <p className="text-xs text-on-surface-variant mt-2">
                  GitHub CMS mode: saving updates `src/data/siteDetails.json` in your repo (then Vercel redeploys).
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {isGitHubMode && (
                <button
                  onClick={handleImportFromSupabase}
                  disabled={isSaving || importStatus === "importing"}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-container text-on-surface rounded-full font-medium border border-outline-variant hover:bg-surface-container-high transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  title="One-time migration: pull current content from Supabase and write it into GitHub JSON"
                >
                  <FileText size={20} />
                  {importStatus === "importing" ? "Importing..." : "Import from Supabase"}
                </button>
              )}

              <button
                type="button"
                onClick={handlePreviewInNewTab}
                disabled={!formData}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary/15 text-secondary rounded-full font-medium border border-secondary/30 hover:bg-secondary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Opens your current edits in a new tab (not saved to GitHub yet)"
              >
                <Eye size={20} />
                Preview changes
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                ) : (
                  <Save size={20} />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {importStatus === "success" && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 text-green-600 border border-green-500/20 rounded-2xl">
              <CheckCircle2 size={24} />
              <p className="font-medium">Imported from Supabase and saved to GitHub successfully.</p>
            </div>
          )}

          {importStatus === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-600 border border-red-500/20 rounded-2xl">
              <AlertCircle size={24} />
              <p className="font-medium">Supabase import failed (check keys / connectivity). You can still edit manually.</p>
            </div>
          )}

          {saveStatus === "success" && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 text-green-600 border border-green-500/20 rounded-2xl">
              <CheckCircle2 size={24} />
              <p className="font-medium">Changes saved successfully! Your website is updated.</p>
            </div>
          )}

          {saveStatus === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-600 border border-red-500/20 rounded-2xl">
              <AlertCircle size={24} />
              <p className="font-medium">Failed to save changes. Please try again.</p>
            </div>
          )}

          {/* Form Content based on Active Tab */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm space-y-6">
            
            {activeTab === "general" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleChange(["companyName"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Full Legal Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange(["fullName"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface">Main Tagline (Shown across site)</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleChange(["tagline"], e.target.value)}
                    className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                
                <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Instagram URL</label>
                    <input
                      type="url"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleChange(["socialMedia", "instagram"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Facebook URL</label>
                    <input
                      type="url"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => handleChange(["socialMedia", "facebook"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => handleChange(["socialMedia", "linkedin"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "home" && (
              <>
                <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-primary"/>
                  Hero Section
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Hero Title</label>
                    <textarea
                      rows={2}
                      value={formData.pages.home.hero.title}
                      onChange={(e) => handleChange(["pages", "home", "hero", "title"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Hero Subtitle</label>
                    <textarea
                      rows={3}
                      value={formData.pages.home.hero.subtitle}
                      onChange={(e) => handleChange(["pages", "home", "hero", "subtitle"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Badge Text (Above Title)</label>
                    <input
                      type="text"
                      value={formData.pages.home.hero.badge}
                      onChange={(e) => handleChange(["pages", "home", "hero", "badge"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Section Headlines</h3>
                  <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase">Core Services Title</label>
                      <input type="text" value={(formData.pages.home as any).coreServices?.title || ""} onChange={(e) => handleChange(["pages", "home", "coreServices", "title"], e.target.value)} className="w-full p-3 bg-white rounded-xl border" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary uppercase">Simple Solutions Title</label>
                      <input type="text" value={(formData.pages.home as any).simpleSolutions?.title || ""} onChange={(e) => handleChange(["pages", "home", "simpleSolutions", "title"], e.target.value)} className="w-full p-3 bg-white rounded-xl border" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Hero Button 1 Text</label>
                      <input type="text" value={formData.pages.home.hero.buttonText} onChange={(e) => handleChange(["pages", "home", "hero", "buttonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Hero Button 2 Text</label>
                      <input type="text" value={formData.pages.home.hero.secondaryButtonText} onChange={(e) => handleChange(["pages", "home", "hero", "secondaryButtonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Hero Video URL</label>
                      <input type="text" value={formData.pages.home.hero.videoUrl} onChange={(e) => handleChange(["pages", "home", "hero", "videoUrl"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Hero Poster URL</label>
                      <input type="text" value={formData.pages.home.hero.posterUrl} onChange={(e) => handleChange(["pages", "home", "hero", "posterUrl"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Home Page Stats</h3>
                  {formData.pages.home.stats.map((stat, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-outline-variant rounded-xl relative">
                      <button onClick={() => handleArrayRemove(["pages", "home", "stats"], index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                      <input type="text" value={stat.label} onChange={(e) => handleChange(["pages", "home", "stats", index, "label"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Label" />
                      <input type="text" value={stat.value} onChange={(e) => handleChange(["pages", "home", "stats", index, "value"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Value" />
                      <input type="text" value={stat.suffix} onChange={(e) => handleChange(["pages", "home", "stats", index, "suffix"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Suffix" />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "home", "stats"], {label: "New Stat", value: "0", suffix: "+"})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                    <Plus size={16} /> Add Stat
                  </button>

                   <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Services Preview Teaser</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Core Services Section Subtitle</label>
                    <textarea rows={2} value={formData.pages.home.coreServices.subtitle} onChange={(e) => handleChange(["pages", "home", "coreServices", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                  </div>

                  {/* Homepage Core Services: exactly 3 cards — pick order here */}
                  <div className="mt-6 space-y-3">
                    <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                      <Briefcase size={16} className="text-primary" />
                      Homepage Core Services ({HOMEPAGE_FEATURED_SERVICE_COUNT} cards)
                    </label>
                    <p className="text-xs text-on-surface-variant">
                      The home page always shows exactly {HOMEPAGE_FEATURED_SERVICE_COUNT} service cards in this section. Choose slot 1 → 2 → 3 (left to right on large screens). Leave a slot on
                      “Auto” to fill from the next available service in your Services list.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {(() => {
                        const slots = featuredIdsToSlots(formData.pages.home.coreServices.featuredServiceIds);
                        return [0, 1, 2].map((slotIndex) => (
                          <div key={slotIndex} className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                              Slot {slotIndex + 1}
                            </label>
                            <select
                              value={slots[slotIndex]}
                              onChange={(e) => {
                                const next = [...slots] as [string, string, string];
                                next[slotIndex] = e.target.value;
                                handleChange(
                                  ["pages", "home", "coreServices", "featuredServiceIds"],
                                  slotsToFeaturedIds(next)
                                );
                              }}
                              className="w-full p-2.5 bg-surface-container rounded-lg border border-outline-variant outline-none text-sm"
                            >
                              <option value="">— Auto (next in list) —</option>
                              {formData.pages.services.serviceList.map((service) => (
                                <option key={service.id} value={service.id}>
                                  {service.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        ));
                      })()}
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Add or edit services under the <strong>Services</strong> tab; then assign them here.
                    </p>
                  </div>

                  {/* Simple Solutions */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Simple Solutions</h3>
                  <div className="space-y-4 mb-4">
                    <input type="text" value={formData.pages.home.simpleSolutions.title} onChange={(e) => handleChange(["pages", "home", "simpleSolutions", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none" placeholder="Title" />
                    <textarea rows={2} value={formData.pages.home.simpleSolutions.subtitle} onChange={(e) => handleChange(["pages", "home", "simpleSolutions", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none resize-none" placeholder="Subtitle" />
                  </div>
                  {formData.pages.home.simpleSolutions.items.map((item, index) => (
                    <div key={index} className="p-4 border border-outline-variant rounded-xl relative space-y-2 mb-4 bg-surface-container-lowest">
                      <button onClick={() => handleArrayRemove(["pages", "home", "simpleSolutions", "items"], index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                      <input type="text" value={item.title} onChange={(e) => handleChange(["pages", "home", "simpleSolutions", "items", index, "title"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Item Title" />
                      <textarea rows={2} value={item.desc} onChange={(e) => handleChange(["pages", "home", "simpleSolutions", "items", index, "desc"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none" placeholder="Description" />
                      <input type="text" value={item.icon} onChange={(e) => handleChange(["pages", "home", "simpleSolutions", "items", index, "icon"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Icon Name (e.g., Target, Search)" />
                      <input type="text" value={item.buttonText} onChange={(e) => handleChange(["pages", "home", "simpleSolutions", "items", index, "buttonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Button Text" />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "home", "simpleSolutions", "items"], {title: "New Solution", icon: "CheckCircle", color: "bg-primary-fixed", text: "text-primary", desc: "Description", features: [], buttonText: "Learn More"})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline mb-6">
                    <Plus size={16} /> Add Solution
                  </button>

                  {/* Why Choose Us */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Why Choose Us</h3>
                  <div className="space-y-4 mb-4">
                    <input type="text" value={formData.pages.home.whyChooseUs.title} onChange={(e) => handleChange(["pages", "home", "whyChooseUs", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none" placeholder="Title" />
                    <textarea rows={2} value={formData.pages.home.whyChooseUs.subtitle} onChange={(e) => handleChange(["pages", "home", "whyChooseUs", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none resize-none" placeholder="Subtitle" />
                  </div>
                  {formData.pages.home.whyChooseUs.cards.map((card, index) => (
                    <div key={index} className="p-4 border border-outline-variant rounded-xl relative space-y-2 mb-4 bg-surface-container-lowest">
                      <button onClick={() => handleArrayRemove(["pages", "home", "whyChooseUs", "cards"], index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                      <input type="text" value={card.title} onChange={(e) => handleChange(["pages", "home", "whyChooseUs", "cards", index, "title"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Card Title" />
                      <textarea rows={2} value={card.desc} onChange={(e) => handleChange(["pages", "home", "whyChooseUs", "cards", index, "desc"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none" placeholder="Description" />
                      <input type="text" value={card.icon} onChange={(e) => handleChange(["pages", "home", "whyChooseUs", "cards", index, "icon"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Icon Name" />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "home", "whyChooseUs", "cards"], {title: "New Reason", icon: "CheckCircle", desc: "Description"})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline mb-6">
                    <Plus size={16} /> Add Reason Card
                  </button>

                  {/* Testimonials */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Testimonials</h3>
                  {formData.pages.home.testimonials.map((test, index) => (
                    <div key={index} className="p-4 border border-outline-variant rounded-xl relative space-y-2 mb-4 bg-surface-container-lowest">
                      <button onClick={() => handleArrayRemove(["pages", "home", "testimonials"], index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                      <input type="text" value={test.name} onChange={(e) => handleChange(["pages", "home", "testimonials", index, "name"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Author Name" />
                      <input type="text" value={test.role} onChange={(e) => handleChange(["pages", "home", "testimonials", index, "role"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Author Role" />
                      <textarea rows={3} value={test.quote} onChange={(e) => handleChange(["pages", "home", "testimonials", index, "quote"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none" placeholder="Quote Text" />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "home", "testimonials"], {name: "John Doe", role: "CEO", quote: "Great service!"})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline mb-6">
                    <Plus size={16} /> Add Testimonial
                  </button>

                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Bottom CTA</h3>
                  <div className="space-y-4">
                    <input type="text" value={formData.pages.home.cta.title} onChange={(e) => handleChange(["pages", "home", "cta", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none" placeholder="CTA Title" />
                    <textarea rows={2} value={formData.pages.home.cta.subtitle} onChange={(e) => handleChange(["pages", "home", "cta", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none resize-none" placeholder="CTA Subtitle" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-primary uppercase">CTA Button 1 Text</label>
                        <input type="text" value={formData.pages.home.cta.buttonText} onChange={(e) => handleChange(["pages", "home", "cta", "buttonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-primary uppercase">CTA Button 2 Text</label>
                        <input type="text" value={formData.pages.home.cta.secondaryButtonText} onChange={(e) => handleChange(["pages", "home", "cta", "secondaryButtonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "about" && (
              <>
                <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <Info size={20} className="text-primary"/>
                  About Page Content
                </h3>
                <div className="space-y-6">
                  {/* Hero Section */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Hero Title</label>
                    <input type="text" value={formData.pages.about.hero.title} onChange={(e) => handleChange(["pages", "about", "hero", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Hero Subtitle</label>
                    <textarea rows={2} value={formData.pages.about.hero.subtitle} onChange={(e) => handleChange(["pages", "about", "hero", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                  </div>
                  {/* Story Section */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Our Story</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Story Title</label>
                    <input type="text" value={formData.pages.about.story.title} onChange={(e) => handleChange(["pages", "about", "story", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Story Content</label>
                    <textarea rows={6} value={formData.pages.about.story.content} onChange={(e) => handleChange(["pages", "about", "story", "content"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-y" />
                  </div>
                  {/* Principles Section */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Core Principles Section</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Section Title</label>
                      <input type="text" value={formData.pages.about.principles.title} onChange={(e) => handleChange(["pages", "about", "principles", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Section Subtitle</label>
                      <textarea rows={2} value={formData.pages.about.principles.subtitle} onChange={(e) => handleChange(["pages", "about", "principles", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                    </div>
                  </div>
                  {/* Values Section */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Core Values</h3>
                  {formData.pages.about.values.map((v, i) => (
                    <div key={i} className="mb-4 p-4 border border-outline-variant rounded-xl relative space-y-2">
                      <button onClick={() => handleArrayRemove(["pages", "about", "values"], i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      <input type="text" value={v.title} onChange={(e) => handleChange(["pages", "about", "values", i, "title"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Value Title" />
                      <textarea value={v.desc} onChange={(e) => handleChange(["pages", "about", "values", i, "desc"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none" placeholder="Description" rows={2} />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "about", "values"], {title: "", desc: "", icon: "Star"})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"><Plus size={16} /> Add Value</button>
                  
                  {/* People Section */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Our Team</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Section Title</label>
                      <input type="text" value={formData.pages.about.people.title} onChange={(e) => handleChange(["pages", "about", "people", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Section Subtitle</label>
                      <textarea rows={2} value={formData.pages.about.people.subtitle} onChange={(e) => handleChange(["pages", "about", "people", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                    </div>
                  </div>
                  {formData.pages.about.people.team.map((member, i) => (
                    <div key={i} className="mb-4 p-4 border border-outline-variant rounded-xl relative space-y-2">
                      <button onClick={() => handleArrayRemove(["pages", "about", "people", "team"], i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      <input type="text" value={member.name} onChange={(e) => handleChange(["pages", "about", "people", "team", i, "name"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Name" />
                      <input type="text" value={member.role} onChange={(e) => handleChange(["pages", "about", "people", "team", i, "role"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Role" />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "about", "people", "team"], {name: "New Member", role: "Role", desc: "", img: ""})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"><Plus size={16} /> Add Team Member</button>

                  {/* Bottom CTA */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Bottom CTA Banner</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Banner Title</label>
                      <textarea rows={2} value={formData.pages.about.cta.title} onChange={(e) => handleChange(["pages", "about", "cta", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Banner Subtitle</label>
                      <textarea rows={2} value={formData.pages.about.cta.subtitle} onChange={(e) => handleChange(["pages", "about", "cta", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Primary Button Text</label>
                        <input type="text" value={formData.pages.about.cta.buttonText} onChange={(e) => handleChange(["pages", "about", "cta", "buttonText"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Secondary Button Text</label>
                        <input type="text" value={formData.pages.about.cta.secondaryButtonText} onChange={(e) => handleChange(["pages", "about", "cta", "secondaryButtonText"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Background Images</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Hero Right Image (Unsplash URL)</label>
                    <input type="text" value={formData.pages.about.hero.image} onChange={(e) => handleChange(["pages", "about", "hero", "image"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant outline-none focus:border-primary transition-all" />
                  </div>
                </div>
              </>
            )}

            {activeTab === "services" && (
              <>
                <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-primary"/>
                  Services Page Content
                </h3>
                <div className="space-y-6">
                  {/* Hero Section */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Hero Title</label>
                    <input type="text" value={formData.pages.services.hero.title} onChange={(e) => handleChange(["pages", "services", "hero", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Hero Subtitle</label>
                    <textarea rows={2} value={formData.pages.services.hero.subtitle} onChange={(e) => handleChange(["pages", "services", "hero", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                  </div>
                  
                  {/* Stats CTA Section */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Bottom CTA Stats Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" value={formData.pages.services.statsCTA.title} onChange={(e) => handleChange(["pages", "services", "statsCTA", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border outline-none" placeholder="CTA Title" />
                    <input type="text" value={formData.pages.services.statsCTA.subtitle} onChange={(e) => handleChange(["pages", "services", "statsCTA", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border outline-none" placeholder="CTA Subtitle" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">CTA Button 1 Text</label>
                      <input type="text" value={formData.pages.services.statsCTA.buttonText} onChange={(e) => handleChange(["pages", "services", "statsCTA", "buttonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">CTA Button 2 Text</label>
                      <input type="text" value={formData.pages.services.statsCTA.secondaryButtonText} onChange={(e) => handleChange(["pages", "services", "statsCTA", "secondaryButtonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                    </div>
                  </div>
                  {formData.pages.services.statsCTA.stats.map((stat, i) => (
                    <div key={i} className="mb-4 p-4 border border-outline-variant rounded-xl relative grid grid-cols-1 md:grid-cols-3 gap-2">
                      <button onClick={() => handleArrayRemove(["pages", "services", "statsCTA", "stats"], i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16} /></button>
                      <input type="text" value={stat.label} onChange={(e) => handleChange(["pages", "services", "statsCTA", "stats", i, "label"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Stat Label" />
                      <input type="number" value={stat.value} onChange={(e) => handleChange(["pages", "services", "statsCTA", "stats", i, "value"], Number(e.target.value))} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Value" />
                      <input type="text" value={stat.suffix} onChange={(e) => handleChange(["pages", "services", "statsCTA", "stats", i, "suffix"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Suffix" />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "services", "statsCTA", "stats"], {label: "New Stat", value: 0, suffix: ""})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"><Plus size={16} /> Add Stat</button>
                  
                  {/* Service List Section */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Service Details Pages</h3>
                  <p className="text-sm text-on-surface-variant mb-2">
                    Add a service with <strong>Add New Service</strong>, set a unique <strong>Slug ID</strong> (used in URLs like <code className="text-xs bg-surface-container px-1 rounded">/services/your-slug</code>), then pick an icon: type the{" "}
                    <strong>PascalCase</strong> name from the Lucide set (e.g. <code className="text-xs bg-surface-container px-1 rounded">Gavel</code>, <code className="text-xs bg-surface-container px-1 rounded">Building2</code>). Wrong or unknown names fall back to a checkmark on the live site.{" "}
                    <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline">
                      Browse all icons →
                    </a>{" "}
                    Open the icon control to see each option with its preview; use the custom row for any name from the gallery.
                  </p>
                  {formData.pages.services.serviceList.map((service, i) => (
                    <div key={i} className="mb-8 p-6 border border-outline-variant rounded-xl relative space-y-4 shadow-sm bg-surface">
                      <button onClick={() => handleArrayRemove(["pages", "services", "serviceList"], i)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 z-10 p-2"><Trash2 size={20} /></button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-primary uppercase">Slug ID</label>
                          <input type="text" value={service.id} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "id"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="service-id" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-primary uppercase">Menu Title</label>
                          <input type="text" value={service.title} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "title"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Service Title" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-primary uppercase" htmlFor={`service-icon-${i}`}>
                            Icon (Lucide)
                          </label>
                          <LucideIconSelect
                            id={`service-icon-${i}`}
                            value={service.icon}
                            onChange={(next) => handleChange(["pages", "services", "serviceList", i, "icon"], next)}
                            options={LUCIDE_SERVICE_ICON_OPTIONS_SORTED}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-primary uppercase">Short Description</label>
                          <textarea rows={1} value={service.description} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "description"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none" placeholder="Card Description" />
                        </div>
                      </div>

                      <div className="space-y-1 mt-4 border-t border-outline-variant/20 pt-4">
                        <label className="text-xs font-bold text-primary uppercase">Detail Page: Hero Title</label>
                        <input type="text" value={service.heroTitle} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "heroTitle"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Hero Title" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-primary uppercase">Detail Page: Subtitle</label>
                        <textarea rows={2} value={service.subtitle} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "subtitle"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none" placeholder="Hero Subtitle" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-primary uppercase">Detail Page: Main Heading</label>
                        <input type="text" value={service.mainHeading} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "mainHeading"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Main Feature Heading" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-primary uppercase">Detail Page: Long Description</label>
                        <textarea rows={5} value={service.longDescription} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "longDescription"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-y" placeholder="Detailed Service Description" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/20">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary uppercase flex items-center justify-between">
                            Deliverables
                            <button onClick={() => handleArrayAdd(["pages", "services", "serviceList", i, "deliverables"], "New Deliverable")} className="text-primary hover:text-secondary"><Plus size={14} /></button>
                          </label>
                          {(service.deliverables || []).map((item: any, dIndex: number) => (
                            <div key={dIndex} className="flex items-center gap-2">
                              <input type="text" value={item} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "deliverables", dIndex], e.target.value)} className="flex-grow p-1.5 text-sm bg-surface-container rounded-lg border outline-none" />
                              <button onClick={() => handleArrayRemove(["pages", "services", "serviceList", i, "deliverables"], dIndex)} className="text-red-500"><Trash2 size={14}/></button>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary uppercase flex items-center justify-between">
                            Benefits
                            <button onClick={() => handleArrayAdd(["pages", "services", "serviceList", i, "benefits"], "New Benefit")} className="text-primary hover:text-secondary"><Plus size={14} /></button>
                          </label>
                          {(service.benefits || []).map((item: any, bIndex: number) => (
                            <div key={bIndex} className="flex items-center gap-2">
                              <input type="text" value={item} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "benefits", bIndex], e.target.value)} className="flex-grow p-1.5 text-sm bg-surface-container rounded-lg border outline-none" />
                              <button onClick={() => handleArrayRemove(["pages", "services", "serviceList", i, "benefits"], bIndex)} className="text-red-500"><Trash2 size={14}/></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 mt-4 pt-4 border-t border-outline-variant/20">
                        <label className="text-xs font-bold text-primary uppercase">Detail Page: CTA Title</label>
                        <input type="text" value={service.ctaTitle} onChange={(e) => handleChange(["pages", "services", "serviceList", i, "ctaTitle"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="CTA Block Title" />
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => handleArrayAdd(["pages", "services", "serviceList"], {
                      id: "new-service", title: "New Service", heroTitle: "Hero Title", subtitle: "Subtitle", icon: "Star", description: "Short desc", longDescription: "Long description", mainHeading: "Main heading", ctaTitle: "Ready to start?", deliverables: [], benefits: []
                    })} 
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all w-max"
                  >
                    <Plus size={18} /> Add New Service
                  </button>
                </div>
              </>
            )}

            {activeTab === "contact" && (
              <>
                <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-secondary"/>
                  Contact Page Headers
                </h3>
                <div className="space-y-4 mb-8 p-4 border border-outline-variant rounded-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Page Main Heading</label>
                    <input
                      type="text"
                      value={formData.pages.contact.hero.title}
                      onChange={(e) => handleChange(["pages", "contact", "hero", "title"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Page Subheading</label>
                    <textarea
                      rows={2}
                      value={formData.pages.contact.hero.subtitle}
                      onChange={(e) => handleChange(["pages", "contact", "hero", "subtitle"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange(["email"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Phone Number</label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => handleChange(["mobile"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface">Full Address</label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleChange(["address"], e.target.value)}
                    className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>

                <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Contact Form Configuration</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Form Title</label>
                    <input type="text" value={formData.pages.contact.form.title} onChange={(e) => handleChange(["pages", "contact", "form", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Submit Button Text</label>
                      <input type="text" value={formData.pages.contact.form.buttonText} onChange={(e) => handleChange(["pages", "contact", "form", "buttonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">WhatsApp Button Text</label>
                      <input type="text" value={formData.pages.contact.form.whatsappButtonText} onChange={(e) => handleChange(["pages", "contact", "form", "whatsappButtonText"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "legal" && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                    <FileText size={24} className="text-primary"/> 
                    Terms of Service
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Main Title</label>
                      <input type="text" value={formData.pages.terms.hero.title} onChange={(e) => handleChange(["pages", "terms", "hero", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Hero Subtitle</label>
                      <textarea rows={2} value={formData.pages.terms.hero.subtitle} onChange={(e) => handleChange(["pages", "terms", "hero", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border outline-none resize-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Page Body Content (Supports Multiline)</label>
                      <textarea rows={10} value={formData.pages.terms.content} onChange={(e) => handleChange(["pages", "terms", "content"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border outline-none font-mono text-sm leading-relaxed focus:border-primary transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-outline-variant">
                  <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                    <Shield size={24} className="text-primary"/> 
                    Privacy Policy
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Main Title</label>
                      <input type="text" value={formData.pages.privacy.hero.title} onChange={(e) => handleChange(["pages", "privacy", "hero", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Hero Subtitle</label>
                      <textarea rows={2} value={formData.pages.privacy.hero.subtitle} onChange={(e) => handleChange(["pages", "privacy", "hero", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border outline-none resize-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary uppercase">Page Body Content (Supports Multiline)</label>
                      <textarea rows={10} value={formData.pages.privacy.content} onChange={(e) => handleChange(["pages", "privacy", "content"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border outline-none font-mono text-sm leading-relaxed focus:border-primary transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="bg-primary-container p-6 rounded-3xl mt-8">
            <h4 className="font-bold text-on-primary-container">Architecture Note</h4>
            <p className="text-on-primary-container/80 mt-2 text-sm">
              This dashboard works locally. Changes are intercepted by the CMSFactory and kept loosely coupled. 
              To configure a remote database like Supabase later, add credentials to .env file—no code changes required.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
