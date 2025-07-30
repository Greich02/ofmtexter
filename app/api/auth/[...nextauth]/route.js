import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Plan from "@/models/Plan";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();
      const existingUser = await User.findOne({ googleId: profile.sub });
      
      if (!existingUser) {
        try {
          // Cherche le plan gratuit (par nom ou prix = 0)
          const freePlan = await Plan.findOne({ 
            $or: [
              { name: { $regex: /gratuit/i } }, // insensible à la casse
              { price: 0 }
            ]
          });

          // Données de base pour le nouvel utilisateur
          const userData = {
            googleId: profile.sub,
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
          };

          // Si un plan gratuit existe, l'attribuer
          if (freePlan) {
            const now = new Date();
            const endDate = new Date(now);
            endDate.setMonth(endDate.getMonth() + 1); // Plan d'1 mois

            userData.plan = freePlan._id;
            userData.credits = freePlan.credits;
            userData.creditsRenewalDate = now;
            userData.planHistory = [{
              plan: freePlan._id,
              startDate: now,
              endDate: endDate
            }];

            console.log(`[AUTH] Plan gratuit "${freePlan.name}" attribué au nouvel utilisateur ${profile.email}`);
          } else {
            console.warn('[AUTH] Aucun plan gratuit trouvé pour le nouvel utilisateur');
          }

          await User.create(userData);
        } catch (err) {
          // Ignore duplicate key error
          if (err.code !== 11000) {
            console.error('[AUTH] Erreur lors de la création de l\'utilisateur:', err);
            throw err;
          }
        }
      }
      return true;
    },
    
    async session({ session, token, user }) {
      await dbConnect();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id = dbUser._id;
        session.user.role = dbUser.role;
        session.user.avatar = dbUser.avatar;
        session.user.credits = dbUser.credits;
        session.user.plan = dbUser.plan;
        session.user.exists = true;
        
        // Ajoute les accès du plan si disponible
        if (dbUser.plan) {
          const plan = await Plan.findById(dbUser.plan);
          session.user.planAccess = plan?.access || {};
        } else {
          session.user.planAccess = {};
        }
      } else {
        session.user.exists = false;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };