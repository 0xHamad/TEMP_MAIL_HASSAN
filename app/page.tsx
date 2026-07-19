import { Navbar } from "@/components/temp-mail/navbar";
import { HeroSection } from "@/components/temp-mail/hero-section";
import { GenerateSection } from "@/components/temp-mail/generate-section";
import { FeaturesSection } from "@/components/temp-mail/features-section";
import { ApiSection } from "@/components/temp-mail/api-section";
import { FaqSection } from "@/components/temp-mail/faq-section";
import { Footer } from "@/components/temp-mail/footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <GenerateSection />
      <FeaturesSection />
      <ApiSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
