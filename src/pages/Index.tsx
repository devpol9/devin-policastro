import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import HeroSection from "@/components/HeroSection";
import MarqueeStrip from "@/components/MarqueeStrip";
import StatsBar from "@/components/StatsBar";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import LinkHubSection from "@/components/LinkHubSection";
import ShopSection from "@/components/ShopSection";

import ServicesSection from "@/components/ServicesSection";
import TrainingSection from "@/components/TrainingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/effects/CustomCursor";
import MouseSpotlight from "@/components/effects/MouseSpotlight";
import SmoothScroll from "@/components/effects/SmoothScroll";
import AIChatbot from "@/components/AIChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SmoothScroll />
      <CustomCursor />
      <MouseSpotlight />
      <FloatingNav />
      <HeroSection />
      <MarqueeStrip />
      <StatsBar />
      <AboutSection />
      <GallerySection />
      <LinkHubSection />
      <ShopSection />
      
      <ServicesSection />
      <TrainingSection />
      <ContactSection />
      <Footer />
      <MobileBottomNav />
      <AIChatbot />
    </div>
  );
};

export default Index;