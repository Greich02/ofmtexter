'use client'
import React from "react";
import Pricing from "@/components/Pricing";
import { useSession, SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar.jsx";

export default function PricingPage() {
  return (
    <SessionProvider>
      <PricingSessionWrapper />
    </SessionProvider>
  );
}

function PricingSessionWrapper() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <>
      {session?.user ? (
        <Topbar showDashboardButton={true} />
      ) : <Navbar />}
      <main className="min-h-screen bg-gradient-to-br from-[#181828] via-[#232346] to-[#181828] pt-24">
        <Pricing isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </>
  );
}
