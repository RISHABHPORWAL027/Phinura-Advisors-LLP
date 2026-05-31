import { FacebookIcon as Facebook, InstagramIcon as Instagram, LinkedinIcon as Linkedin } from "./SocialIcons";
import { AppLink } from "../navigation/AppLink";
import { DeveloperCredit } from "./DeveloperCredit";
import { ASSETS } from "../constants/assetPaths";
import { useCMS } from "../hooks/useCMS";

export const Footer = () => {
  const { data: siteDetails } = useCMS();
  const taglineLine = siteDetails.tagline.replace(/\.\s*$/, "");

  return (
  <footer className="w-full bg-primary text-on-primary">
    <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <AppLink to="/" className="flex items-center gap-2 mb-4 group">
          <img src={ASSETS.brand.logo} alt={siteDetails.companyName} className="h-8 w-auto logo-img brightness-0 invert" />
          <span className="text-lg font-bold text-white group-hover:text-secondary-fixed transition-all">{siteDetails.companyName}</span>
        </AppLink>
        <p className="text-white/75 text-sm mb-6">{siteDetails.tagline}</p>
        <div className="flex gap-4">
          <a href={siteDetails.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook className="text-white/55 hover:text-secondary-fixed cursor-pointer transition-colors w-6 h-6" />
          </a>
          <a href={siteDetails.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram className="text-white/55 hover:text-secondary-fixed cursor-pointer transition-colors w-6 h-6" />
          </a>
          <a href={siteDetails.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="text-white/55 hover:text-secondary-fixed cursor-pointer transition-colors w-6 h-6" />
          </a>
        </div>
      </div>
      <div>
        <h4 className="font-headline font-bold text-white mb-6">Explore</h4>
        <ul className="space-y-4">
          <li><AppLink to="/" className="text-white/75 hover:text-white transition-all text-sm">Home</AppLink></li>
          <li><AppLink to="/services" className="text-white/75 hover:text-white transition-all text-sm">Services</AppLink></li>
          <li><AppLink to="/about" className="text-white/75 hover:text-white transition-all text-sm">About Us</AppLink></li>
          <li><AppLink to="/contact" className="text-white/75 hover:text-white transition-all text-sm">Contact</AppLink></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-white mb-6">Resources</h4>
        <ul className="space-y-4">
          <li><AppLink className="text-white/75 hover:text-white transition-all text-sm" to="/privacy">Privacy Policy</AppLink></li>
          <li><AppLink className="text-white/75 hover:text-white transition-all text-sm" to="/terms">Terms of Service</AppLink></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-white mb-6">Contact</h4>
        <p className="text-white/75 text-sm mb-4 whitespace-pre-line">{siteDetails.address}</p>
        <p className="text-white text-sm font-bold">{siteDetails.mobile}</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-8 py-8 border-t border-white/15 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-white/50 text-xs">© {new Date().getFullYear()} {siteDetails.fullName}. {taglineLine}. All rights reserved.</p>
      <DeveloperCredit
        className="text-white/50 text-xs"
        linkClassName="text-secondary-fixed hover:text-white font-semibold hover:underline underline-offset-2"
      />
    </div>
  </footer>
  );
};
