import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/effects/SmoothScroll";
import { trackEvent } from "./lib/analytics";

const PageViewTracker = () => {
  const { pathname, search } = useLocation();
  const last = useRef<string>("");
  useEffect(() => {
    const key = pathname + search;
    if (last.current === key) return;
    last.current = key;
    if (pathname.startsWith("/hq")) return;
    trackEvent("page_view", {
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });
  }, [pathname, search]);
  return null;
};

const ConditionalSmoothScroll = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/hq")) return null;
  return <SmoothScroll />;
};

const HqShortcut = () => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.shiftKey && (e.key === "H" || e.key === "h")) {
        e.preventDefault();
        window.location.assign("/hq/login");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
};
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Manufacturing from "./pages/Manufacturing";
import Content from "./pages/Content";
import Automotive from "./pages/Automotive";
import Consulting from "./pages/Consulting";
import Financing from "./pages/Financing";
import Networking from "./pages/Networking";
import Fitness from "./pages/Fitness";

// DevHQ admin
import AdminLoginPage from "./pages/admin/Login";
import TodayPage from "./pages/admin/Today";
import InquiriesPage from "./pages/admin/Inquiries";
import InquiryDetailPage from "./pages/admin/InquiryDetail";
import VenturesPage from "./pages/admin/Ventures";
import VentureDetailPage from "./pages/admin/VentureDetail";
import ProjectDetailPage from "./pages/admin/ProjectDetail";
import ContentPage from "./pages/admin/Content";
import PillarsSettingsPage from "./pages/admin/PillarsSettings";


import KpisPage from "./pages/admin/Kpis";
import NotesIdeasPage from "./pages/admin/NotesIdeas";
import AdminNotFound from "./pages/admin/NotFound";

import BriefingsPage from "./pages/admin/Briefings";
import ReviewPage from "./pages/admin/Review";
import PeoplePage from "./pages/admin/People";
import InstallPwaBanner from "./components/admin/InstallPwaBanner";

const queryClient = new QueryClient();

// Add a settings entry for AdminShell page-title fallback already covered
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
        <ConditionalSmoothScroll />
        <HqShortcut />
        <PageViewTracker />
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

          {/* DevHQ admin */}
          <Route path="/hq" element={<Navigate to="/hq/today" replace />} />
          <Route path="/hq/login" element={<AdminLoginPage />} />
          <Route path="/hq/today" element={<TodayPage />} />
          <Route path="/hq/inquiries" element={<InquiriesPage />} />
          <Route path="/hq/inquiries/:id" element={<InquiryDetailPage />} />
          <Route path="/hq/ventures" element={<VenturesPage />} />
          <Route path="/hq/ventures/:slug" element={<VentureDetailPage />} />
          <Route path="/hq/projects" element={<Navigate to="/hq/ventures" replace />} />
          <Route path="/hq/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/hq/content" element={<ContentPage />} />
          <Route path="/hq/analytics" element={<Navigate to="/hq/kpis" replace />} />
          
          <Route path="/hq/people" element={<Navigate to="/hq/today" replace />} />

          <Route path="/hq/kpis" element={<KpisPage />} />
          <Route path="/hq/log" element={<Navigate to="/hq/notes" replace />} />
          <Route path="/hq/notes" element={<NotesIdeasPage />} />
          <Route path="/hq/briefings" element={<BriefingsPage />} />
          <Route path="/hq/review" element={<ReviewPage />} />
          <Route path="/hq/settings/pillars" element={<PillarsSettingsPage />} />
          <Route path="/hq/*" element={<AdminNotFound />} />

          {/* Public catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <InstallPwaBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
