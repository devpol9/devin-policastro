import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SectionHeader from "@/components/SectionHeader";
import FloatingNav from "@/components/FloatingNav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <FloatingNav />
      <section className="section-padding pt-32 sm:pt-40">
        <div className="container-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <SectionHeader
            as="h1"
            numeral="404"
            eyebrow="Lost in transit"
            title={<>Wrong <span className="italic font-light text-accent">turn.</span></>}
            description={<>The page <span className="text-foreground/80 font-mono text-xs">{location.pathname}</span> doesn't exist — but everything else does. Head back home and pick a lane.</>}
          />

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm tracking-wide bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
        </div>
      </section>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default NotFound;
