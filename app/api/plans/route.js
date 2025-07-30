import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const plans = await Plan.find({});
  return NextResponse.json({ plans });
}
