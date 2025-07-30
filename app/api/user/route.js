import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Plan from "@/models/Plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  // Récupère l'utilisateur courant via la session NextAuth
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).populate("plan");
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });
  
  // On ne retourne que les infos utiles
  return Response.json({
    email: user.email,
    credits: user.credits,
    plan: user.plan ? {
      name: user.plan.name,
      access: user.plan.access,
      _id: user.plan._id
    } : null
  });
}