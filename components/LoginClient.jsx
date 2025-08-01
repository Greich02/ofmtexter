'use client'
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Vérifie s'il y a des messages dans l'URL
  useEffect(() => {
    const urlMessage = searchParams.get('message');
    const authError = searchParams.get('error');
    
    if (urlMessage === 'account_created') {
      setMessage("Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.");
    }
    
    if (authError) {
      setError("Aucun compte trouvé avec ce Google. Veuillez d'abord créer un compte.");
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/dashboard' 
      });

      if (result?.error) {
        if (result.error === 'AccessDenied') {
          setError("Aucun compte trouvé avec ce Google. Veuillez d'abord créer un compte.");
        } else {
          setError('Erreur lors de la connexion');
        }
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      console.error('Login error:', err);
    }
    
    setIsLoading(false);
  };

  return (
    <>
      {message && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
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
            Se connecter avec Google
          </>
        )}
      </button>

      <p className="text-gray-400 text-sm text-center mt-6">
        Pas encore de compte ?{' '}
        <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
          Créer un compte
        </a>
      </p>
    </>
  );
}