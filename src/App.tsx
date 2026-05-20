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

const PathRedirect = ({ to }: { to: string }) => {
  useEffect(() => { window.location.replace(to); }, [to]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SmoothScroll />
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Index />} />
          <Route path="/manufacturing" element={<Manufacturing />} />
          <Route path="/content" element={<Content />} />
          <Route path="/automotive" element={<Automotive />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/networking" element={<Networking />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/admin-login" element={<PathRedirect to="/hq/login" />} />
          <Route path="/admin" element={<PathRedirect to="/hq/today" />} />
          <Route path="/legacy-admin-login" element={<AdminLogin />} />
          <Route path="/legacy-admin" element={<Admin />} />

          {/* DevHQ admin */}
          <Route path="/hq" element={<Navigate to="/hq/today" replace />} />
          <Route path="/hq/login" element={<AdminLoginPage />} />
          <Route path="/hq/today" element={<TodayPage />} />
          <Route path="/hq/inquiries" element={<InquiriesPage />} />
          <Route path="/hq/inquiries/:id" element={<InquiryDetailPage />} />
          <Route path="/hq/ventures" element={<VenturesPage />} />
          <Route path="/hq/ventures/:slug" element={<VentureDetailPage />} />
          <Route path="/hq/*" element={<AdminNotFound />} />

          {/* Public catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
