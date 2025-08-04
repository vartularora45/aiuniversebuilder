import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureGrid from "../components/FeatureGrid";
import PricingSection from "../components/PricingSection";
import DemoVideo from "../components/DemoVideo";
import Testimonials from "../components/Testimonials";
import FAQSection from "../components/FaqSection";
import Footer from "../components/Footer";

function La() {
  return (
    <div className="bg-gradient-to-br from-[#0e1016] to-[#141824] min-h-screen text-white font-sans relative">
      <Navbar />
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-8">
        <HeroSection />
        <FeatureGrid />
        <PricingSection />
        <DemoVideo />
        <Testimonials />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
