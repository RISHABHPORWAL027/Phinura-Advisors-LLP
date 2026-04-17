import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { PreviewLinkBaseProvider } from "./navigation/AppLink";

/** Route-level lazy loading: each path downloads its own chunk (faster repeat visits / lighter bundles per URL). */
const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const Services = lazy(() => import("./pages/Services").then((m) => ({ default: m.Services })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail").then((m) => ({ default: m.ServiceDetail })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/TermsOfService").then((m) => ({ default: m.TermsOfService })));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard").then((m) => ({ default: m.AdminDashboard })));
const PreviewLayout = lazy(() => import("./preview/PreviewLayout").then((m) => ({ default: m.PreviewLayout })));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageLoading = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-surface">
    <div className="h-9 w-9 border-4 border-primary/15 border-t-primary rounded-full animate-spin" aria-hidden />
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
          <Outlet />
        </main>
        <MainFooterGate />
      </div>
    </PreviewLinkBaseProvider>
  );
}

const previewRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="services" element={<Services />} />
    <Route path="services/:serviceId" element={<ServiceDetail />} />
    <Route path="contact" element={<Contact />} />
    <Route path="privacy" element={<PrivacyPolicy />} />
    <Route path="terms" element={<TermsOfService />} />
  </>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/preview" element={<PreviewLayout />}>
            {previewRoutes}
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
      </Suspense>
    </Router>
  );
}
