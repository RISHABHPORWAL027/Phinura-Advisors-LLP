/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Contact } from "./pages/Contact";
import { ServiceDetail } from "./pages/ServiceDetail";
import { Footer } from "./components/Footer";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
          </Routes>
        </main>
        {/* Only show global footer on pages that don't have their own specific footer implementation */}
        <Routes>
          <Route path="/" element={<Footer />} />
          <Route path="/about" element={<Footer />} />
          {/* Services and Contact have their own footers in the screenshots */}
          <Route path="/services" element={null} />
          <Route path="/contact" element={null} />
          <Route path="/services/:serviceId" element={null} />
        </Routes>
      </div>
    </Router>
  );
}
