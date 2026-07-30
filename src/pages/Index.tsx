import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { Features } from "@/components/Features";
import { LogoToCard } from "@/components/LogoToCard";
import { HowItWorks } from "@/components/HowItWorks";
import { CardTypes } from "@/components/CardTypes";
import { Industries } from "@/components/Industries";
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { CTABanner } from "@/components/CTABanner";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <TrustStrip />
      <Features />
      <LogoToCard />
      <HowItWorks />
      <CardTypes />
      <Industries />
      <Benefits />
      <Pricing />
      <CTABanner />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;