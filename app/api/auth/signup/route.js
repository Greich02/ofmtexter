import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Plan from "@/models/Plan";

export async function POST(req) {
  try {
    await dbConnect();
    const { googleProfile } = await req.json();
    
    if (!googleProfile || !googleProfile.sub || !googleProfile.email) {
      return NextResponse.json({ 
        error: "Données Google manquantes" 
      }, { status: 400 });
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ 
      $or: [
        { googleId: googleProfile.sub },
        { email: googleProfile.email }
      ]
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: "Un compte existe déjà avec cet email" 
      }, { status: 409 });
    }

    // Cherche le plan gratuit
    const freePlan = await Plan.findOne({ 
      $or: [
        { name: { $regex: /gratuit/i } },
        { price: 0 }
      ]
    });

    // Données de base pour le nouvel utilisateur
    const userData = {
      googleId: googleProfile.sub,
      email: googleProfile.email,
      name: googleProfile.name,
      avatar: googleProfile.picture,
    };

    // Si un plan gratuit existe, l'attribuer
    if (freePlan) {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);

      userData.plan = freePlan._id;
      userData.credits = freePlan.credits;
      userData.creditsRenewalDate = now;
      userData.planHistory = [{
        plan: freePlan._id,
        startDate: now,
        endDate: endDate
      }];

      console.log(`[SIGNUP] Plan gratuit "${freePlan.name}" attribué à ${googleProfile.email}`);
    }

    const newUser = await User.create(userData);

    return NextResponse.json({
      success: true,
      message: "Compte créé avec succès",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        credits: newUser.credits
      }
    });

  } catch (error) {
    console.error('[SIGNUP] Erreur:', error);
    return NextResponse.json({ 
      error: "Erreur lors de la création du compte",
      details: error.message 
    }, { status: 500 });
  }
}