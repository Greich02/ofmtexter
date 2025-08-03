import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { answers } = body;

    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Sauvegarder les réponses d'onboarding
    dbUser.onboarding = {
      ...answers,
      completed: true,
      completedAt: new Date()
    };

    await dbUser.save();

    return NextResponse.json({ 
      success: true, 
      message: "Onboarding complété avec succès" 
    });

  } catch (error) {
    console.error("Erreur lors de l'onboarding:", error);
    return NextResponse.json({ 
      error: "Erreur lors de la sauvegarde" 
    }, { status: 500 });
  }
} 