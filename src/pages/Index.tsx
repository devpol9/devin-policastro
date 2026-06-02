import SEOHead from "@/components/SEOHead";
import { personJsonLd, localBusinessJsonLd, seoPages } from "@/lib/seoData";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import HeroSection from "@/components/HeroSection";
import MarqueeStrip from "@/components/MarqueeStrip";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import InTheGymSection from "@/components/InTheGymSection";
import LinkHubSection from "@/components/LinkHubSection";
import ShopSection from "@/components/ShopSection";
import StatsBar from "@/components/StatsBar";


import ServicesSection from "@/components/ServicesSection";
import TrainingSection from "@/components/TrainingSection";
import ContactSection from "@/components/ContactSection";
import PlaybookBanner from "@/components/PlaybookBanner";
import Footer from "@/components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead {...seoPages["/"]} canonicalPath="/" jsonLd={[personJsonLd, localBusinessJsonLd]} ogImage="/images/og-image.png" />
      <FloatingNav />
      <HeroSection />
      <MarqueeStrip />
      <AboutSection />
      <StatsBar />
      <GallerySection />
      <InTheGymSection />
      <LinkHubSection />
        <ShopSection />
        
        <div className="-mt-12 sm:-mt-20">
          <ServicesSection />
        </div>
        <TrainingSection />
        <div className="-mt-12 sm:-mt-20">
          <ContactSection />
        </div>
      <PlaybookBanner />
      <Footer />
      <MobileBottomNav />
      
    </div>
  );
};

export default Index;