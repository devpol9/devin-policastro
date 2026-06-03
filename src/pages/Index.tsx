import SEOHead from "@/components/SEOHead";
import { personJsonLd, localBusinessJsonLd, seoPages } from "@/lib/seoData";
import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import VenturesStrip from "@/components/VenturesStrip";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        {...seoPages["/"]}
        canonicalPath="/"
        jsonLd={[personJsonLd, localBusinessJsonLd]}
        ogImage="/images/og-image.png"
      />
      <FloatingNav />
      <HeroSection />
      <ServicesSection />
      <VenturesStrip />
      <ContactSection />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
