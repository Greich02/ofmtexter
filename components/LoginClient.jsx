"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginClient() {
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session?.user?.exists) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <button
        type="button"
        className="w-full px-4 py-2 rounded bg-white text-blue-500 font-bold border border-blue-400 hover:bg-blue-50 transition"
        onClick={() => signIn("google")}
      >
        Se connecter avec Google
      </button>
      <div className="mt-6 flex flex-col gap-2">
        <a href="/signup" className="text-blue-400 hover:underline text-center">Créer un compte</a>
      </div>
    </>
  );
}

export default LoginClient;
