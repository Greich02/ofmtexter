'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import TextGenerator from "../../components/TextGenerator.jsx";
import React, { useState } from "react";

export default function page() {
  const router = useRouter();
  const [creditsLeft, setCreditsLeft] = useState(null);
  useEffect(() => {
    router.replace("/dashboard/textgenerator");
  }, [router]);

  return (
    <DashboardLayout creditsLeft={creditsLeft}>
      <TextGenerator setCreditsLeft={setCreditsLeft} />
      {/* Ajoutez ici les autres sections du dashboard (Scripts, Équipe, etc.) */}
    </DashboardLayout>
  );
}
