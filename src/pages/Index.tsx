import FloatingNav from "@/components/FloatingNav";

import HeroSection from "@/components/HeroSection";
import MarqueeStrip from "@/components/MarqueeStrip";
import StatsBar from "@/components/StatsBar";
import AboutSection from "@/components/AboutSection";
import LinkHubSection from "@/components/LinkHubSection";
import ShopSection from "@/components/ShopSection";
import CodesSection from "@/components/CodesSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/effects/CustomCursor";
import MouseSpotlight from "@/components/effects/MouseSpotlight";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <CustomCursor />
      <MouseSpotlight />
      <FloatingNav />
      <HeroSection />
      <MarqueeStrip />
      <StatsBar />
      <AboutSection />
      <LinkHubSection />
      <ShopSection />
      <CodesSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
      
    </div>
  );
};

export default Index;
