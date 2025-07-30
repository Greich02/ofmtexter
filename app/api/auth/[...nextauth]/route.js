import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

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
          await User.create({
            googleId: profile.sub,
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
          });
        } catch (err) {
          // Ignore duplicate key error
          if (err.code !== 11000) throw err;
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
          const plan = await (await import("@/models/Plan")).default.findById(dbUser.plan);
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
