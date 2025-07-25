"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

export default function SignupClient() {

  const { data: session } = useSession();
  const router = useRouter();
  const [alreadyRegistered, setAlreadyRegistered] = React.useState(false);

  // Helper to get selected plan from localStorage
  const getSelectedPlan = () => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('selectedPlan');
    }
    return null;
  };

  // Assign free plan to new users after signup
  React.useEffect(() => {
    if (session?.user?.exists) {
      const selectedPlan = getSelectedPlan();
      if (selectedPlan && selectedPlan !== 'Gratuit') {
        // Redirect to preview/payment page for selected paid plan
        window.localStorage.removeItem('selectedPlan');
        router.replace(`/dashboard/buycredits?plan=${selectedPlan}`);
      } else {
        // Default: redirect to dashboard (free plan)
        router.replace("/dashboard");
      }
    } else if (session) {
      setAlreadyRegistered(false);
    }
  }, [session, router]);

  const handleSignup = async () => {
    await signIn("google");
  };

  return (
    <main className="bg-black min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="bg-[#181828] rounded-2xl p-8 shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Créer un compte</h2>
          <div className="flex justify-center mb-6">
            <img src="/images/signup-illustration.jpg" alt="Inscription Illustration" className="h-40 object-contain" />
          </div>
          <button
            type="button"
            className="w-full px-4 py-2 rounded bg-white text-blue-500 font-bold border border-blue-400 hover:bg-blue-50 transition"
            onClick={handleSignup}
          >
            S'inscrire avec Google
          </button>
          <div className="mt-6 flex flex-col gap-2">
            <a href="/login" className="text-blue-400 hover:underline text-center">Déjà un compte ? Se connecter</a>
            {alreadyRegistered && (
              <span className="text-red-400 text-center mt-2">Vous êtes déjà enregistré. Veuillez vous connecter.</span>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
