import Plan from "@/models/Plan";
import dbConnect from "@/lib/mongoose";

export async function GET() {
  await dbConnect();
  const plans = await Plan.find({});
  return Response.json(plans);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const plan = await Plan.create(data);
  return Response.json(plan);
}

export async function PUT(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = await req.json();
  const plan = await Plan.findByIdAndUpdate(id, data, { new: true });
  return Response.json(plan);
}

export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Plan.findByIdAndDelete(id);
  return Response.json({ success: true });
}
