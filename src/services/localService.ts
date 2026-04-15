import siteDetails from "../data/siteDetails.json";
import { ICMSService, SiteDetails } from "./types";

export class LocalCMSService implements ICMSService {
  async getSiteDetails(): Promise<SiteDetails> {
    // In a real app, this might fetch from a local API in dev mode
    // or just return the static JSON.
    return siteDetails as SiteDetails;
  }

  async updateSiteDetails(details: SiteDetails): Promise<void> {
    console.log("Local Update (Simulated):", details);
    alert("In local mode, changes are only logged to the console. Connect Supabase for persistence.");
  }
}
