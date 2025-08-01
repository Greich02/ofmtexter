import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function useAutoAssignPlan() {
  const { data: session, update } = useSession();
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState(null);

  useEffect(() => {
    const assignFreePlan = async () => {
      // Vérifie si l'utilisateur est connecté et n'a pas de plan
      if (!session?.user?.id || session?.user?.plan || isAssigning) {
        return;
      }

      console.log('[AUTO-ASSIGN] Détection: utilisateur sans plan, attribution en cours...');
      setIsAssigning(true);

      try {
        const response = await fetch('/api/assign-free-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
          setAssignmentResult({
            success: true,
            message: data.message,
            plan: data.plan
          });

          // Force la mise à jour de la session pour refléter le nouveau plan
          await update();
          
          console.log('[AUTO-ASSIGN] Plan attribué avec succès:', data.plan?.name);
        } else {
          console.error('[AUTO-ASSIGN] Erreur:', data.error);
          setAssignmentResult({
            success: false,
            error: data.error
          });
        }
      } catch (error) {
        console.error('[AUTO-ASSIGN] Erreur réseau:', error);
        setAssignmentResult({
          success: false,
          error: 'Erreur de connexion'
        });
      } finally {
        setIsAssigning(false);
      }
    };

    assignFreePlan();
  }, [session?.user?.id, session?.user?.plan, update, isAssigning]);

  return {
    isAssigning,
    assignmentResult,
    needsPlan: session?.user?.id && !session?.user?.plan && !isAssigning
  };
}