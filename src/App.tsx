import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Contact } from "./pages/Contact";
import { Footer } from "./components/Footer";

// Lazy load less critical pages
const ServiceDetail = lazy(() => import("./pages/ServiceDetail").then(module => ({ default: module.ServiceDetail })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/TermsOfService").then(module => ({ default: module.TermsOfService })));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard").then(module => ({ default: module.AdminDashboard })));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading component for Suspense
const PageLoading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Navbar />
        <main>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </main>
        {/* Only show global footer on pages that don't have their own specific footer implementation */}
        <Routes>
          <Route path="/" element={<Footer />} />
          <Route path="/about" element={<Footer />} />
          {/* Services and Contact have their own footers in the screenshots */}
          <Route path="/services" element={null} />
          <Route path="/contact" element={null} />
          <Route path="/services/:serviceId" element={null} />
          <Route path="/privacy" element={null} />
          <Route path="/terms" element={null} />
        </Routes>
      </div>
    </Router>
  );
}
