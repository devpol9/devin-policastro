import SEOHead from "@/components/SEOHead";
import { personJsonLd, seoPages } from "@/lib/seoData";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import HeroSection from "@/components/HeroSection";
import MarqueeStrip from "@/components/MarqueeStrip";
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
import AIChatbot from "@/components/AIChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      <SEOHead {...seoPages["/"]} canonicalPath="/" jsonLd={personJsonLd} ogImage="/images/og-image.png" />
      <CustomCursor />
      <MouseSpotlight />
      <FloatingNav />
      <HeroSection />
      <MarqueeStrip />
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