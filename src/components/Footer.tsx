import { Mail, Globe, Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import siteDetails from "../data/siteDetails.json";
import logo from "../Assets/Phinura_Advisors_logo.png";

export const Footer = () => (
  <footer className="w-full bg-slate-50 rounded-t-[2.5rem] mt-20">
    <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <Link to="/" className="flex items-center gap-2 mb-4 group">
          <img src={logo} alt={siteDetails.companyName} className="h-8 w-auto logo-img" />
          <span className="text-lg font-bold text-primary group-hover:text-primary transition-all">{siteDetails.companyName}</span>
        </Link>
        <p className="text-on-surface-variant text-sm mb-6">{siteDetails.tagline}</p>
        <div className="flex gap-4">
          <a href={siteDetails.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook className="text-slate-400 hover:text-primary cursor-pointer transition-colors w-6 h-6" />
          </a>
          <a href={siteDetails.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram className="text-slate-400 hover:text-primary cursor-pointer transition-colors w-6 h-6" />
          </a>
          <a href={siteDetails.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="text-slate-400 hover:text-primary cursor-pointer transition-colors w-6 h-6" />
          </a>
        </div>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Explore</h4>
        <ul className="space-y-4">
          <li><Link to="/" className="text-on-surface-variant hover:text-primary transition-all text-sm">Home</Link></li>
          <li><Link to="/services" className="text-on-surface-variant hover:text-primary transition-all text-sm">Services</Link></li>
          <li><Link to="/about" className="text-on-surface-variant hover:text-primary transition-all text-sm">About Us</Link></li>
          <li><Link to="/contact" className="text-on-surface-variant hover:text-primary transition-all text-sm">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Resources</h4>
        <ul className="space-y-4">
          <li><Link className="text-on-surface-variant hover:text-primary transition-all text-sm" to="/privacy">Privacy Policy</Link></li>
          <li><Link className="text-on-surface-variant hover:text-primary transition-all text-sm" to="/terms">Terms of Service</Link></li>
          <li><a className="text-on-surface-variant hover:text-primary transition-all text-sm" href="#">Newsletter</a></li>
          <li><a className="text-on-surface-variant hover:text-primary transition-all text-sm" href="#">Tax Calendar</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Contact</h4>
        <p className="text-on-surface-variant text-sm mb-4 whitespace-pre-line">{siteDetails.address}</p>
        <p className="text-on-surface-variant text-sm font-bold">{siteDetails.mobile}</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-slate-400 text-xs">© {new Date().getFullYear()} {siteDetails.fullName}. {siteDetails.tagline}. All rights reserved.</p>
      <p className="text-slate-400 text-xs">
        Design and Develop by <a href="https://www.devyugsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Devyug Solution</a>
      </p>
    </div>
  </footer>
);
