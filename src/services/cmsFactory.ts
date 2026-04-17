import { ICMSService } from "./types";
import { LocalCMSService } from "./localService";
import { GitHubCMSService } from "./githubService";

class CMSFactory {
  private static instance: ICMSService;

  static getService(): ICMSService {
    if (!this.instance) {
      if (import.meta.env.VITE_CMS_BACKEND === "github") {
        this.instance = new GitHubCMSService();
      } else {
        this.instance = new LocalCMSService();
      }
    }
    return this.instance;
  }
}

export const cms = CMSFactory.getService();
