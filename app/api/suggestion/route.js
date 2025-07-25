import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Suggestion from "@/models/Suggestion";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const session = await getServerSession(authOptions);
  const userId = session?.user?._id || null;
  const { category, message } = body;
  if (!category || !message) {
    return NextResponse.json({ error: "Catégorie et message requis." }, { status: 400 });
  }
  const suggestion = await Suggestion.create({
    category,
    message,
    user: userId,
  });
  return NextResponse.json({ success: true, suggestion });
}
