import siteDetails from "../data/siteDetails.json";
import { ICMSService, SiteDetails } from "./types";

const insecureAdmin = import.meta.env.VITE_INSECURE_ADMIN === "true";

function getAdminPassword(): string | null {
  try {
    return sessionStorage.getItem("adminPassword");
  } catch {
    return null;
  }
}

export class GitHubCMSService implements ICMSService {
  async getSiteDetails(): Promise<SiteDetails> {
    try {
      const res = await fetch("/api/site-details", { method: "GET" });
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      const json = await res.json();
      if (!json?.ok || !json?.data) throw new Error("Invalid response");
      return json.data as SiteDetails;
    } catch (e) {
      console.warn("GitHub CMS fetch failed, falling back to local data:", e);
      return siteDetails as SiteDetails;
    }
  }

  async updateSiteDetails(details: SiteDetails): Promise<void> {
    const password = getAdminPassword();
    if (!password && !insecureAdmin) throw new Error("Missing admin password");

    const res = await fetch("/api/site-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(password ? { "x-admin-password": password } : {}),
      },
      body: JSON.stringify(details),
    });

    if (res.status === 401) {
      try {
        sessionStorage.removeItem("adminPassword");
      } catch {
        // ignore
      }
      throw new Error("Unauthorized: wrong admin password");
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Save failed: ${res.status}`);
    }
  }

  static async validatePassword(password: string): Promise<boolean> {
    if (insecureAdmin) return true;
    const res = await fetch("/api/site-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ __validate: true }),
    });
    return res.ok;
  }
}
