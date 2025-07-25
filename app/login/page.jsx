
"use client";
import { SessionProvider } from "next-auth/react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import LoginClient from "../../components/LoginClient.jsx";

export default function LoginPageClient() {
  return (
    <SessionProvider>
      <main className="bg-black min-h-screen w-full flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-24 pb-16">
          <div className="bg-[#181828] rounded-2xl p-8 shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Connexion</h2>
            <div className="flex justify-center mb-6">
              <img src="/images/login-illustration.jpg" alt="Connexion Illustration" className="h-40 object-contain" />
            </div>
            <LoginClient />
          </div>
        </div>
        <Footer />
      </main>
    </SessionProvider>
  );
}
