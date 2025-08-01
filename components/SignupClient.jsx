'use client'
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SignupClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Tentative de connexion/inscription avec Google
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/dashboard' 
      });

      if (result?.error) {
        setError('Erreur lors de la création du compte');
        console.error('Signup error:', result.error);
      } else if (result?.ok) {
        // Succès : redirection vers le dashboard
        // Le plan sera automatiquement attribué dans DashboardLayout
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      console.error('Signup error:', err);
    }
    
    setIsLoading(false);
  };

  return (
    <main className="bg-black min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="bg-[#181828] rounded-2xl p-8 shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Créer un compte</h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <img src="/images/signup-illustration.jpg" alt="Inscription Illustration" className="h-40 object-contain" />
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Créer un compte avec Google
              </>
            )}
          </button>

          <p className="text-gray-400 text-sm text-center mt-6">
            Déjà un compte ?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}