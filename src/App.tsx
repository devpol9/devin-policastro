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
import AdminGuard from "./components/admin/AdminGuard";
import AdminLoginPage from "./pages/admin/Login";
import Today from "./pages/admin/Today";
import Inquiries from "./pages/admin/Inquiries";
import InquiryDetail from "./pages/admin/InquiryDetail";
import AdminNotFound from "./pages/admin/NotFound";

const queryClient = new QueryClient();

const ADMIN_HOST = "admin.devinpolicastro.com";

const isAdminHost = () => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  return host === ADMIN_HOST || host.startsWith("admin.") || params.get("hq") === "1";
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
      <Route path="/today" element={<AdminGuard><Today /></AdminGuard>} />
      <Route path="/inquiries" element={<AdminGuard><Inquiries /></AdminGuard>} />
      <Route path="/inquiries/:id" element={<AdminGuard><InquiryDetail /></AdminGuard>} />
      <Route path="/" element={<Navigate to="/today" replace />} />
      <Route path="*" element={<AdminGuard><AdminNotFound /></AdminGuard>} />
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
      {/* Legacy admin routes — redirect to subdomain */}
      <Route path="/admin-login" element={<ExternalRedirect to={`https://${ADMIN_HOST}/login`} />} />
      <Route path="/admin" element={<ExternalRedirect to={`https://${ADMIN_HOST}/today`} />} />
      {/* Legacy fallbacks if subdomain isn't yet provisioned */}
      <Route path="/legacy-admin-login" element={<AdminLogin />} />
      <Route path="/legacy-admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      {isAdminHost() ? <AdminApp /> : <PublicApp />}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
