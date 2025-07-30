'use client'
import DashboardLayout from "../../../components/DashboardLayout.jsx";
import MediaScriptGenerator from "../../../components/MediaScriptGenerator.jsx";
import React, { useState } from "react";

export default function MediaScriptGeneratorPage() {
  const [creditsLeft, setCreditsLeft] = useState(null);
  return (
    <DashboardLayout creditsLeft={creditsLeft}>
      <MediaScriptGenerator setCreditsLeft={setCreditsLeft} />
    </DashboardLayout>
  );
}
