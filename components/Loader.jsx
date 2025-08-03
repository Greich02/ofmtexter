import React from "react";

export default function Loader({ size = "h-10 w-10", className = "" }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-400 ${size} ${className}`} />
    </div>
  );
}
