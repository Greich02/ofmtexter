'use client'

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import useAutoAssignPlan from "../hooks/useAutoAssignPlan";
import Loader from "./Loader";

// Sous-composant qui affiche le layout seulement si connecté
function DashboardLayoutComponent({ children, creditsLeft }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isAssigning, assignmentResult, needsPlan } = useAutoAssignPlan();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (!session || status === "loading") {
    return <Loader />; // Redirection ou chargement en cours
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar creditsLeft={creditsLeft} />

        {isAssigning && (
          <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-3 mx-6 mt-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-300 border-t-transparent rounded-full"></div>
              Attribution de votre plan gratuit en cours...
            </div>
          </div>
        )}

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}


// Composant exporté par défaut qui wrappe avec <SessionProvider>
export default function DashboardLayout({ children, creditsLeft }) {
  return (
    <SessionProvider>
      <DashboardLayoutComponent creditsLeft={creditsLeft} children={children} />
    </SessionProvider>
  );
}
