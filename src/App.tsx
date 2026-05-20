import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/effects/SmoothScroll";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Manufacturing from "./pages/Manufacturing";
import Content from "./pages/Content";
import Automotive from "./pages/Automotive";
import Consulting from "./pages/Consulting";
import Financing from "./pages/Financing";
import Networking from "./pages/Networking";
import Fitness from "./pages/Fitness";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

// DevHQ admin
import AdminLoginPage from "./pages/admin/Login";
import TodayPage from "./pages/admin/Today";
import InquiriesPage from "./pages/admin/Inquiries";
import InquiryDetailPage from "./pages/admin/InquiryDetail";
import VenturesPage from "./pages/admin/Ventures";
import VentureDetailPage from "./pages/admin/VentureDetail";
import AdminNotFound from "./pages/admin/NotFound";

const queryClient = new QueryClient();
const ADMIN_HOST = "admin.devinpolicastro.com";
const HQ_KEY = "lovable_hq_mode";

const computeIsAdminHost = (): boolean => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  if (host === ADMIN_HOST) return true;
  if (host.startsWith("admin.")) return true;
  if (params.get("hq") === "1") {
    try { window.sessionStorage.setItem(HQ_KEY, "1"); } catch {}
    return true;
  }
  if (params.get("hq") === "0") {
    try { window.sessionStorage.removeItem(HQ_KEY); } catch {}
    return false;
  }
  try {
    if (window.sessionStorage.getItem(HQ_KEY) === "1") return true;
  } catch {}
  return false;
};

const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => { window.location.replace(to); }, [to]);
  return null;
};

const AdminApp = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/" element={<Navigate to="/today" replace />} />
      <Route path="/today" element={<TodayPage />} />
      <Route path="/inquiries" element={<InquiriesPage />} />
      <Route path="/inquiries/:id" element={<InquiryDetailPage />} />
      <Route path="/ventures" element={<VenturesPage />} />
      <Route path="/ventures/:slug" element={<VentureDetailPage />} />
      <Route path="*" element={<AdminNotFound />} />
    </Routes>
  </BrowserRouter>
);

const PublicApp = () => (
  <BrowserRouter>
    <ScrollToTop />
    <SmoothScroll />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/manufacturing" element={<Manufacturing />} />
      <Route path="/content" element={<Content />} />
      <Route path="/automotive" element={<Automotive />} />
      <Route path="/consulting" element={<Consulting />} />
      <Route path="/financing" element={<Financing />} />
      <Route path="/networking" element={<Networking />} />
      <Route path="/fitness" element={<Fitness />} />
      <Route path="/admin-login" element={<ExternalRedirect to={`https://${ADMIN_HOST}/login`} />} />
      <Route path="/admin" element={<ExternalRedirect to={`https://${ADMIN_HOST}/today`} />} />
      <Route path="/legacy-admin-login" element={<AdminLogin />} />
      <Route path="/legacy-admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => {
  const isAdminHost = computeIsAdminHost();
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[DevHQ routing]", {
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      search: window.location.search,
      isAdminHost,
      tree: isAdminHost ? "admin" : "public",
    });
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        {isAdminHost ? <AdminApp /> : <PublicApp />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
