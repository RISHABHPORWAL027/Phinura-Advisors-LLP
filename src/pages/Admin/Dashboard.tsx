import { useState, useEffect, useRef } from "react";
import { useCMS } from "../../hooks/useCMS";
import { 
  Save, AlertCircle, CheckCircle2, LayoutDashboard, FileText, 
  Settings, Phone, Info, Briefcase, Plus, Trash2, Shield, Eye,
  Camera, Upload, X, Image as ImageIcon, Search, Globe, User, 
  Sparkles, History, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SiteDetails } from "../../services/types";
import { GitHubCMSService } from "../../services/githubService";
import { normalizeSiteDetails } from "../../utils/normalizeSiteDetails";
import { storeAdminPreviewDraft, clearAdminPreviewDraft } from "../../lib/adminPreview";
import { LUCIDE_SERVICE_ICON_OPTIONS_SORTED } from "../../constants/lucideServiceIconOptions";
import { LucideIconSelect } from "../../components/admin/LucideIconSelect";
import {
  featuredIdsToSlots,
  slotsToFeaturedIds,
  HOMEPAGE_FEATURED_SERVICE_COUNT,
} from "../../utils/homeFeaturedServices";

/** Full clone so nested updates never mutate prev (React Strict Mode runs updaters twice in dev). */
function cloneFormState(prev: SiteDetails): SiteDetails {
  return structuredClone(prev);
}

// Reusable Image Upload component
const ImageUploadField = ({ 
  label, 
  value, 
  onChange,
  className = "" 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  className?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please keep it under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-black text-primary/60 uppercase tracking-widest block ml-1">{label}</label>
      <div className="group relative flex flex-col gap-3 p-4 bg-white rounded-3xl border border-slate-200 hover:border-primary/30 transition-all shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-50 flex items-center justify-center relative group/preview">
            {value ? (
              <>
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => onChange("")}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <ImageIcon className="text-slate-300" size={24} />
            )}
          </div>
          <div className="flex-grow space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste Image URL or data:image..."
                className="flex-grow bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-bold whitespace-nowrap"
              >
                <Upload size={14} /> Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          ctaSubtitle: service.ctaSubtitle ?? "",
          callBackLinkText: service.callBackLinkText ?? "",
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
      try { sessionStorage.setItem("adminPassword", authPassword); } catch {}
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
    storeAdminPreviewDraft(normalizeSiteDetails(formData));
    window.open("/preview", "_blank", "noopener,noreferrer");
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

  const handleChange = (path: (string | number)[], value: any) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return prev;
      const newData = cloneFormState(prev);
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (current[key] === undefined) current[key] = (typeof path[i+1] === 'number' ? [] : {});
        current = current[key];
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
        current = current[path[i]];
      }
      const key = path[path.length - 1];
      current[key] = [...(current[key] || []), newItem];
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-secondary font-headline font-bold">Synchronizing Architecture...</p>
      </div>
    );
  }

  if (isGitHubMode && !adminPassword) {
    return (
      <div className="min-h-screen bg-[#001f49] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Sparkles className="absolute top-10 left-10 text-white w-24 h-24" />
          <Shield className="absolute bottom-10 right-10 text-white w-32 h-32" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/20 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Shield className="text-[#001f49]" size={40} />
          </div>
          <h2 className="text-3xl font-headline font-black text-white mb-2">Vault Access</h2>
          <p className="text-white/60 mb-8 font-medium">Please enter your specialized administrative password to modify the financial architecture.</p>
          <div className="space-y-4">
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            />
            {authStatus === "error" && <p className="text-red-400 text-sm font-bold animate-shake">Incorrect Access Key</p>}
            <button
              onClick={handleUnlock}
              disabled={authStatus === "checking"}
              className="w-full bg-white text-[#001f49] py-4 rounded-2xl font-headline font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              {authStatus === "checking" ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'general', label: 'Global Specs', icon: Globe },
    { id: 'home', label: 'Lobby (Home)', icon: LayoutDashboard },
    { id: 'about', label: 'Foundation (About)', icon: Info },
    { id: 'services', label: 'Ventures (Services)', icon: Briefcase },
    { id: 'contact', label: 'Connect (Social)', icon: Phone },
    { id: 'legal', label: 'Protocols (Legal)', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-80 bg-[#001f49] flex-col sticky top-0 h-screen overflow-hidden">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Sparkles className="text-[#001f49]" size={20} />
            </div>
            <h2 className="text-xl font-headline font-black text-white tracking-tight">PHINURA <span className="text-white/50">ADMIN</span></h2>
          </div>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest ml-1">Enterprise Console v2.0</p>
        </div>

        <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                activeTab === item.id 
                  ? "bg-white/10 text-white shadow-lg shadow-black/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? "text-white" : "group-hover:text-white/70"} />
              <span className="font-headline font-bold text-sm tracking-wide">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="nav-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-tighter">Administrator</p>
              <p className="text-[10px] text-white/40 font-medium">Vault Secure</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto p-8 lg:p-12">
          {/* Top Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-headline font-black text-[#001f49] mb-2">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-slate-400 font-medium">Architecting the digital presence of Phinura Advisors</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreviewInNewTab}
                className="flex items-center gap-2 px-6 py-4 bg-white text-[#001f49] rounded-2xl font-headline font-bold text-sm border border-slate-200 hover:border-[#001f49]/30 hover:bg-slate-50 transition-all shadow-sm group"
              >
                <Eye size={18} className="text-slate-400 group-hover:text-[#001f49]" />
                Preview Mode
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-headline font-black text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                  isSaving 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-[#001f49] text-white"
                }`}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Synchronizing..." : "Commit Changes"}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {saveStatus === "success" && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 text-emerald-700 shadow-sm"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="font-headline font-bold text-sm">Synchronized Successfully</p>
                  <p className="text-xs text-emerald-600/70 font-medium">The digital architecture has been updated across the global network.</p>
                </div>
              </motion.div>
            )}

            {saveStatus === "error" && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-700 shadow-sm"
              >
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="font-headline font-bold text-sm">Synchronization Failed</p>
                  <p className="text-xs text-rose-600/70 font-medium">A protocol error occurred. Please verify your connection or access token.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content based on Active Tab */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm space-y-6">
            
            {activeTab === "general" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2">
                   <ImageUploadField 
                     label="Master Brand Logo"
                     value={formData.logo}
                     onChange={(val) => handleChange(["logo"], val)}
                   />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-primary/60 uppercase tracking-widest block ml-1">Company Identity</label>
                  <input type="text" value={formData.companyName} onChange={e => handleChange(["companyName"], e.target.value)} className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold text-[#001f49] focus:ring-2 focus:ring-[#001f49]/10 outline-none" placeholder="Phinura Advisors" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-primary/60 uppercase tracking-widest block ml-1">Legal Nomenclature</label>
                  <input type="text" value={formData.fullName} onChange={e => handleChange(["fullName"], e.target.value)} className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold text-[#001f49] focus:ring-2 focus:ring-[#001f49]/10 outline-none" placeholder="Phinura Advisors LLP" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-xs font-black text-primary/60 uppercase tracking-widest block ml-1">Brand Tagline</label>
                  <input type="text" value={formData.tagline} onChange={e => handleChange(["tagline"], e.target.value)} className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold text-[#001f49] focus:ring-2 focus:ring-[#001f49]/10 outline-none" placeholder="" />
                </div>

                <div className="md:col-span-2 mt-10">
                  <h3 className="text-sm font-black text-[#001f49] uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Globe size={18} /> Social & Connectivity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(formData.socialMedia).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">{key}</label>
                        <input type="text" value={value as string} onChange={e => handleChange(["socialMedia", key], e.target.value)} className="w-full p-3 bg-white rounded-xl border border-slate-100 text-sm font-medium" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "home" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                {/* Hero Section */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><LayoutDashboard size={120} /></div>
                  <h3 className="text-sm font-black text-[#001f49] uppercase tracking-widest mb-8 flex items-center gap-3">
                    <Sparkles size={18} /> Hero Visuals
                  </h3>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ImageUploadField label="Hero Background" value={(formData.pages.home.hero as any).bgImage || ""} onChange={val => handleChange(["pages", "home", "hero", "bgImage"], val)} />
                      <ImageUploadField label="Hero Video Poster" value={formData.pages.home.hero.posterUrl} onChange={val => handleChange(["pages", "home", "hero", "posterUrl"], val)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-primary/60 uppercase tracking-widest block ml-1">Hero Heading</label>
                      <textarea rows={3} value={formData.pages.home.hero.title} onChange={e => handleChange(["pages", "home", "hero", "title"], e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-lg text-[#001f49] resize-none focus:ring-2 focus:ring-[#001f49]/10 outline-none" />
                    </div>
                  </div>
                </div>

                  <div className="space-y-2 mt-6 pt-6 border-t border-outline-variant/30">
                    <label className="text-sm font-medium text-on-surface">Stats section label</label>
                    <p className="text-xs text-on-surface-variant">Small caps line above the statistics row on the home page.</p>
                    <input
                      type="text"
                      value={formData.pages.home.statsTitle ?? ""}
                      onChange={(e) => handleChange(["pages", "home", "statsTitle"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all"
                      placeholder="Strategic Industry Partners"
                    />
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

                  {/* Company Process */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Company Process</h3>
                  <div className="space-y-4 mb-4">
                    <input type="text" value={formData.pages.home.process.title} onChange={(e) => handleChange(["pages", "home", "process", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none" placeholder="Process Title" />
                    <textarea rows={2} value={formData.pages.home.process.subtitle} onChange={(e) => handleChange(["pages", "home", "process", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none resize-none" placeholder="Process Subtitle" />
                  </div>
                  {formData.pages.home.process.steps.map((step, index) => (
                    <div key={index} className="p-4 border border-outline-variant rounded-xl relative space-y-2 mb-4 bg-surface-container-lowest">
                      <button onClick={() => handleArrayRemove(["pages", "home", "process", "steps"], index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                      <div className="flex gap-4">
                        <input type="text" value={step.id} onChange={(e) => handleChange(["pages", "home", "process", "steps", index, "id"], e.target.value)} className="w-16 p-2 bg-surface-container rounded-lg border outline-none text-center font-bold" placeholder="ID" />
                        <input type="text" value={step.title} onChange={(e) => handleChange(["pages", "home", "process", "steps", index, "title"], e.target.value)} className="flex-grow p-2 bg-surface-container rounded-lg border outline-none font-bold" placeholder="Step Title" />
                      </div>
                      <textarea rows={2} value={step.desc} onChange={(e) => handleChange(["pages", "home", "process", "steps", index, "desc"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none text-sm" placeholder="Step Description" />
                      <input type="text" value={step.icon} onChange={(e) => handleChange(["pages", "home", "process", "steps", index, "icon"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none text-xs" placeholder="Icon Name (Search, FileStack, Microscope, Rocket)" />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "home", "process", "steps"], {id: "0X", title: "New Step", desc: "Step details...", icon: "Zap"})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline mb-6">
                    <Plus size={16} /> Add Process Step
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Hero Title</label>
                      <input type="text" value={formData.pages.about.hero.title} onChange={(e) => handleChange(["pages", "about", "hero", "title"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Hero Badge</label>
                      <input type="text" value={formData.pages.about.hero.badge} onChange={(e) => handleChange(["pages", "about", "hero", "badge"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Hero Subtitle</label>
                    <textarea rows={2} value={formData.pages.about.hero.subtitle} onChange={(e) => handleChange(["pages", "about", "hero", "subtitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Hero Stat Number (e.g. 30+)</label>
                      <input type="text" value={formData.pages.about.hero.statNumber} onChange={(e) => handleChange(["pages", "about", "hero", "statNumber"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Hero Stat Label</label>
                      <input type="text" value={formData.pages.about.hero.statLabel} onChange={(e) => handleChange(["pages", "about", "hero", "statLabel"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                    </div>
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
                  <div className="space-y-2 mt-6">
                    <ImageUploadField 
                      label="Foundation Visual (Story Image)"
                      value={formData.pages.about.story.image}
                      onChange={(val) => handleChange(["pages", "about", "story", "image"], val)}
                    />
                  </div>

                  {/* Mission & Vision Section */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Mission & Vision</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Our Mission (Slider Items)</label>
                      {(formData.pages.about.missionVision?.missions || []).map((m: string, i: number) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <textarea 
                            rows={2} 
                            value={m} 
                            onChange={(e) => handleChange(["pages", "about", "missionVision", "missions", i], e.target.value)} 
                            className="flex-1 p-3 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" 
                          />
                          <button onClick={() => handleArrayRemove(["pages", "about", "missionVision", "missions"], i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => handleArrayAdd(["pages", "about", "missionVision", "missions"], "New mission statement...")} 
                        className="flex items-center gap-2 text-primary text-sm font-medium hover:underline mt-2"
                      >
                        <Plus size={16} /> Add Mission Slide
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Our Vision</label>
                      <textarea rows={3} value={formData.pages.about.missionVision?.vision || ""} onChange={(e) => handleChange(["pages", "about", "missionVision", "vision"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Vision Image URL</label>
                      <input type="text" value={formData.pages.about.missionVision?.visionImage || ""} onChange={(e) => handleChange(["pages", "about", "missionVision", "visionImage"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all" />
                    </div>
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
                      <div className="flex gap-2 items-center">
                        <input type="text" value={v.title} onChange={(e) => handleChange(["pages", "about", "values", i, "title"], e.target.value)} className="flex-1 p-2 bg-surface-container rounded-lg border outline-none font-bold" placeholder="Value Title" />
                        <div className="w-40">
                          <LucideIconSelect 
                            value={v.icon || "ShieldCheck"} 
                            onChange={(val) => handleChange(["pages", "about", "values", i, "icon"], val)} 
                          />
                        </div>
                      </div>
                      <textarea value={v.desc} onChange={(e) => handleChange(["pages", "about", "values", i, "desc"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none" placeholder="Description" rows={2} />
                    </div>
                  ))}
                  <button onClick={() => handleArrayAdd(["pages", "about", "values"], {title: "", desc: "", icon: "ShieldCheck"})} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"><Plus size={16} /> Add Value</button>
                  
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
                    <div key={i} className="mb-4 p-4 border border-outline-variant rounded-xl relative space-y-4">
                      <button onClick={() => handleArrayRemove(["pages", "about", "people", "team"], i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Name</label>
                          <input type="text" value={member.name} onChange={(e) => handleChange(["pages", "about", "people", "team", i, "name"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Role</label>
                          <input type="text" value={member.role} onChange={(e) => handleChange(["pages", "about", "people", "team", i, "role"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Role" />
                        </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Image URL</label>
                         <input type="text" value={member.img || ""} onChange={(e) => handleChange(["pages", "about", "people", "team", i, "img"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none" placeholder="Image URL" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Short Bio</label>
                         <textarea value={member.desc || ""} onChange={(e) => handleChange(["pages", "about", "people", "team", i, "desc"], e.target.value)} className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-none" placeholder="Short Bio" rows={2} />
                      </div>
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
                  
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Hero Background Image</h3>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Hero Badge Text</label>
                      <input type="text" value={(formData.pages.services.hero as any).badge || ""} onChange={(e) => handleChange(["pages", "services", "hero", "badge"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant outline-none" placeholder="Excellence in Governance" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Hero Background Image URL</label>
                      <input type="text" value={(formData.pages.services.hero as any).bgImage || ""} onChange={(e) => handleChange(["pages", "services", "hero", "bgImage"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant outline-none" placeholder="https://images.unsplash.com/..." />
                    </div>
                  </div>

                  {/* Intro Section */}
                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Intro Section (Below Hero)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Intro Title</label>
                      <input type="text" value={(formData.pages.services as any).introTitle || "A Wide Range of Strategic Solutions."} onChange={(e) => handleChange(["pages", "services", "introTitle"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Intro Content Paragraph 1</label>
                      <textarea rows={3} value={(formData.pages.services as any).introContent1 || ""} onChange={(e) => handleChange(["pages", "services", "introContent1"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface">Intro Content Paragraph 2</label>
                      <textarea rows={3} value={(formData.pages.services as any).introContent2 || ""} onChange={(e) => handleChange(["pages", "services", "introContent2"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none resize-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-on-surface">Intro Image URL</label>
                       <input type="text" value={(formData.pages.services as any).introImage || ""} onChange={(e) => handleChange(["pages", "services", "introImage"], e.target.value)} className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant outline-none" placeholder="https://unsplash.com/..." />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-on-surface mt-6 pt-6 border-t border-outline-variant/30">Service detail pages — default CTA block</h3>
                  <p className="text-sm text-on-surface-variant">
                    Used on each <code className="text-xs bg-surface-container px-1 rounded">/services/…</code> page under the green CTA title. You can override per service below.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Default paragraph (under CTA title)</label>
                    <textarea
                      rows={2}
                      value={formData.pages.services.serviceDetailCtaSubtitle ?? ""}
                      onChange={(e) => handleChange(["pages", "services", "serviceDetailCtaSubtitle"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Default “callback” link text</label>
                    <input
                      type="text"
                      value={formData.pages.services.serviceDetailCallBackLinkText ?? ""}
                      onChange={(e) => handleChange(["pages", "services", "serviceDetailCallBackLinkText"], e.target.value)}
                      className="w-full p-4 bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none transition-all"
                      placeholder="Request a Call Back"
                    />
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
                        <div className="space-y-1 md:col-span-2">
                          <ImageUploadField 
                            label="Service Representation (Image)"
                            value={service.image || ""}
                            onChange={(val) => handleChange(["pages", "services", "serviceList", i, "image"], val)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1 mt-4 border-t border-outline-variant/20 pt-4">
                        <label className="text-xs font-bold text-primary uppercase">Detail Page: Category Badge</label>
                        <input
                          type="text"
                          value={service.category ?? ""}
                          onChange={(e) => handleChange(["pages", "services", "serviceList", i, "category"], e.target.value)}
                          className="w-full p-2 bg-surface-container rounded-lg border outline-none"
                          placeholder="e.g. Regulatory Compliance"
                        />
                        <p className="text-[11px] text-on-surface-variant">Small label above the hero title on the service detail page.</p>
                      </div>
                      <div className="space-y-1">
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
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-primary uppercase">Detail Page: CTA paragraph (optional override)</label>
                        <textarea
                          rows={2}
                          value={service.ctaSubtitle ?? ""}
                          onChange={(e) => handleChange(["pages", "services", "serviceList", i, "ctaSubtitle"], e.target.value)}
                          className="w-full p-2 bg-surface-container rounded-lg border outline-none resize-y"
                          placeholder="Leave empty to use the default from “Service detail pages — default CTA block” above"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-primary uppercase">Detail Page: Callback link text (optional override)</label>
                        <input
                          type="text"
                          value={service.callBackLinkText ?? ""}
                          onChange={(e) => handleChange(["pages", "services", "serviceList", i, "callBackLinkText"], e.target.value)}
                          className="w-full p-2 bg-surface-container rounded-lg border outline-none"
                          placeholder="Leave empty to use the default"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => handleArrayAdd(["pages", "services", "serviceList"], {
                      id: "new-service",
                      title: "New Service",
                      category: "Regulatory Compliance",
                      heroTitle: "Hero Title",
                      subtitle: "Subtitle",
                      icon: "Star",
                      description: "Short desc",
                      longDescription: "Long description",
                      mainHeading: "Main heading",
                      ctaTitle: "Ready to start?",
                      ctaSubtitle: "",
                      callBackLinkText: "",
                      deliverables: [],
                      benefits: [],
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
            <h4 className="font-bold text-on-primary-container">CMS</h4>
            <p className="text-on-primary-container/80 mt-2 text-sm">
              With <code className="text-xs">VITE_CMS_BACKEND=github</code>, saves go through the API to your repo JSON. Otherwise edits stay in the browser (local mode).
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
