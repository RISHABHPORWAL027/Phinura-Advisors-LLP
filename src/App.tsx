import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Contact } from "./pages/Contact";
import { Footer } from "./components/Footer";
import { PreviewLayout } from "./preview/PreviewLayout";
import { PreviewLinkBaseProvider } from "./navigation/AppLink";

const ServiceDetail = lazy(() => import("./pages/ServiceDetail").then((module) => ({ default: module.ServiceDetail })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then((module) => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/TermsOfService").then((module) => ({ default: module.TermsOfService })));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard").then((module) => ({ default: module.AdminDashboard })));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageLoading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function MainFooterGate() {
  const { pathname } = useLocation();
  if (pathname === "/" || pathname === "/about") return <Footer />;
  return null;
}

function MainShell() {
  return (
    <PreviewLinkBaseProvider base="">
      <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Navbar />
        <main>
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </main>
        <MainFooterGate />
      </div>
    </PreviewLinkBaseProvider>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/preview" element={<PreviewLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:serviceId" element={<ServiceDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
        </Route>
        <Route element={<MainShell />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:serviceId" element={<ServiceDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
