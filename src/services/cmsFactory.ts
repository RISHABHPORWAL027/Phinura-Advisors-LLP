import { ICMSService } from "./types";
import { SupabaseCMSService } from "./supabaseService";
import { LocalCMSService } from "./localService";
import { GitHubCMSService } from "./githubService";
import { supabase } from "../lib/supabase";

class CMSFactory {
  private static instance: ICMSService;

  static getService(): ICMSService {
    if (!this.instance) {
      if (import.meta.env.VITE_CMS_BACKEND === "github") {
        this.instance = new GitHubCMSService();
        return this.instance;
      }
      // If we have Supabase keys, use Supabase. Otherwise, use local.
      if (supabase) {
        this.instance = new SupabaseCMSService();
      } else {
        this.instance = new LocalCMSService();
      }
    }
    return this.instance;
  }
}

export const cms = CMSFactory.getService();
