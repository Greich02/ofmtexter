'use client'
import DashboardLayout from "../../../components/DashboardLayout.jsx";
import ScriptGenerator from "../../../components/ScriptGenerator.jsx";

import React, { useState } from "react";

export default function ScriptGeneratorPage() {
  const [creditsLeft, setCreditsLeft] = useState(null);
  return (
    <DashboardLayout creditsLeft={creditsLeft}>
      <ScriptGenerator setCreditsLeft={setCreditsLeft} />
    </DashboardLayout>
  );
}
