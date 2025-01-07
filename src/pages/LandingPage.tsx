import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { UpcomingFeatures } from "@/components/landing/UpcomingFeatures";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FounderMessage } from "@/components/landing/FounderMessage";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <Hero />
        <About />
        <UpcomingFeatures />
        <Testimonials />
        <Pricing />
        <FounderMessage />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;