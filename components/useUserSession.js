import { useSession } from "next-auth/react";

export default function useUserSession() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user || {};
  return { user, loading };
}
