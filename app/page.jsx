"use client";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar.jsx";
import { useSession } from "next-auth/react";
import HeroSection from "../components/HeroSection";
import KeyAdvantages from "../components/KeyAdvantages";
import Features from "../components/Features";
import SocialProof from "../components/SocialProof";
import SecondaryCTA from "../components/SecondaryCTA";
import Footer from "../components/Footer";

function HomeContent() {
  const { data: session } = useSession();
  return (
    <main className="bg-black min-h-screen w-full">
      {session?.user ? (
        <Topbar showDashboardButton={true} />
      ) : <Navbar />}
      <div className="pt-24">
        <HeroSection />
        <KeyAdvantages />
        <Features />
        {/**<SocialProof /> */}
        <SecondaryCTA />
        <Footer />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  );
}
