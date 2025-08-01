import { NextResponse } from "next/server";

// Cette route est un workaround pour récupérer les infos Google 
// lors du signup sans créer automatiquement l'utilisateur

let tempGoogleData = null;

export async function POST(req) {
  try {
    const body = await req.json();
    
    if (body.action === "store") {
      // Stocke temporairement les données Google
      tempGoogleData = body.profile;
      return NextResponse.json({ success: true });
    }
    
    if (body.action === "get") {
      // Récupère les données stockées
      if (tempGoogleData) {
        const data = tempGoogleData;
        tempGoogleData = null; // Nettoie après récupération
        return NextResponse.json(data);
      } else {
        return NextResponse.json({ error: "Aucune donnée trouvée" }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: "Action non valide" }, { status: 400 });
    
  } catch (error) {
    console.error('[GOOGLE-INFO] Erreur:', error);
    return NextResponse.json({ 
      error: "Erreur serveur" 
    }, { status: 500 });
  }
}