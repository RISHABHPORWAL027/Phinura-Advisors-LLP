import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-blue-900/5 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tighter text-primary font-headline">The Sovereign Ledger</Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`font-headline font-semibold tracking-tight transition-colors ${isActive("/") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            className={`font-headline font-semibold tracking-tight transition-colors ${isActive("/services") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
          >
            Services
          </Link>
          <Link 
            to="/about" 
            className={`font-headline font-semibold tracking-tight transition-colors ${isActive("/about") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`font-headline font-semibold tracking-tight transition-colors ${isActive("/contact") ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
          >
            Contact
          </Link>
        </div>
        <button className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl font-headline font-semibold transition-all duration-300 shadow-lg shadow-primary/10 cursor-pointer">
          Get Started
        </button>
      </div>
    </nav>
  );
};
