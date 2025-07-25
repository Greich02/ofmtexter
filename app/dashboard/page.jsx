'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import TextGenerator from "../../components/TextGenerator.jsx";

export default function page() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/textgenerator");
  }, [router]);

  return (
    <DashboardLayout>
      <TextGenerator />
      {/* Ajoutez ici les autres sections du dashboard (Scripts, Équipe, etc.) */}
    </DashboardLayout>
  );
}
