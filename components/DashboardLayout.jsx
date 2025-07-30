"use client";
import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import SuggestionBox from "./SuggestionBox.jsx";

const DashboardLayout = ({ children, creditsLeft }) => {
  return (
    <SessionProvider>
      <div className="bg-[#0d0d0d] min-h-screen w-full flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar creditsLeft={creditsLeft} />
          <div className="pt-20 px-8 pb-8">{children}</div>
          <SuggestionBox />
        </div>
      </div>
    </SessionProvider>
  );
};

export default DashboardLayout;