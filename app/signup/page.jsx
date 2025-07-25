'use client'
import { SessionProvider } from "next-auth/react";
import SignupClient from "../../components/SignupClient.jsx";

export default function SignupPage() {
  return (
    <SessionProvider>
      <SignupClient />
    </SessionProvider>
  );
}
