import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { SampleArtifacts } from "@/components/landing/SampleArtifacts";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { BotanicalBackground } from "@/components/botanical/BotanicalBackground";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <BotanicalBackground />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <FeaturesGrid />
        <SampleArtifacts />
      </main>
      <Footer />
    </div>
  );
}
