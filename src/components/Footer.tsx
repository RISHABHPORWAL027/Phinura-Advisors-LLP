import { Facebook, Mail, Globe, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="w-full bg-slate-50 rounded-t-[2.5rem] mt-20">
    <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <span className="text-lg font-bold text-primary mb-4 block">The Sovereign Ledger</span>
        <p className="text-on-surface-variant text-sm mb-6">Expert financial solutions with architectural precision. Making business simple since 2014.</p>
        <div className="flex gap-4">
          <Facebook className="text-slate-400 hover:text-primary cursor-pointer transition-colors w-6 h-6" />
          <Mail className="text-slate-400 hover:text-primary cursor-pointer transition-colors w-6 h-6" />
          <Globe className="text-slate-400 hover:text-primary cursor-pointer transition-colors w-6 h-6" />
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
          <li><a className="text-on-surface-variant hover:text-primary transition-all text-sm" href="#">Privacy Policy</a></li>
          <li><a className="text-on-surface-variant hover:text-primary transition-all text-sm" href="#">Terms of Service</a></li>
          <li><a className="text-on-surface-variant hover:text-primary transition-all text-sm" href="#">Newsletter</a></li>
          <li><a className="text-on-surface-variant hover:text-primary transition-all text-sm" href="#">Tax Calendar</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-headline font-bold text-primary mb-6">Contact</h4>
        <p className="text-on-surface-variant text-sm mb-4">1200 Financial District, Level 24<br />London, EC2N 1AR</p>
        <p className="text-on-surface-variant text-sm font-bold">+44 20 7946 0123</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 text-center">
      <p className="text-slate-400 text-xs">© 2024 The Sovereign Ledger. Architectural Financial Authority. All rights reserved.</p>
    </div>
  </footer>
);
