import FloatingNav from "@/components/FloatingNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import LinkHubSection from "@/components/LinkHubSection";
import ShopSection from "@/components/ShopSection";
import CodesSection from "@/components/CodesSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <HeroSection />
      <AboutSection />
      <LinkHubSection />
      <ShopSection />
      <CodesSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
