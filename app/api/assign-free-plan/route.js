import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Plan from "@/models/Plan";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await dbConnect();
    
    // Vérification de la session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupère l'utilisateur
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Si l'utilisateur a déjà un plan, on ne fait rien
    if (user.plan) {
      console.log(`[ASSIGN-PLAN] Utilisateur ${user.email} a déjà un plan`);
      return NextResponse.json({ 
        success: true, 
        message: "Plan déjà attribué",
        alreadyHasPlan: true 
      });
    }

    // Cherche le plan gratuit
    const freePlan = await Plan.findOne({ 
      $or: [
        { name: { $regex: /gratuit/i } },
        { price: 0 }
      ]
    });

    if (!freePlan) {
      console.error('[ASSIGN-PLAN] Aucun plan gratuit trouvé');
      return NextResponse.json({ 
        error: "Aucun plan gratuit disponible" 
      }, { status: 404 });
    }

    // Attribution du plan gratuit
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    await User.findByIdAndUpdate(user._id, {
      plan: freePlan._id,
      credits: freePlan.credits,
      creditsRenewalDate: now,
      planHistory: [{
        plan: freePlan._id,
        startDate: now,
        endDate: endDate
      }]
    });

    console.log(`[ASSIGN-PLAN] Plan gratuit "${freePlan.name}" attribué à ${user.email}`);

    return NextResponse.json({
      success: true,
      message: `Plan "${freePlan.name}" attribué avec succès`,
      plan: {
        name: freePlan.name,
        credits: freePlan.credits,
        access: freePlan.access
      }
    });

  } catch (error) {
    console.error('[ASSIGN-PLAN] Erreur:', error);
    return NextResponse.json({ 
      error: "Erreur lors de l'attribution du plan",
      details: error.message 
    }, { status: 500 });
  }
}