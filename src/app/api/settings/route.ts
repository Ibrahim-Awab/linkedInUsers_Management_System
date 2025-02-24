import dbConnect from "@/lib/mongodb";
import User from "@/shared/schemas/User"; 
import Post from "@/shared/schemas/Post"; 
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchTerm = req.nextUrl.searchParams.get("search") || "";
  try {
    await dbConnect();
    const users = await User.find({ owner: new RegExp(`^${searchTerm}`, "i") });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error:"Error Occurs while getting Users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { owner, interval } = await req.json();

  if (!owner || !interval) {
    return NextResponse.json({ error: "Both owner and interval are required." }, { status: 400 });
  }

  try {
    await dbConnect();
    await User.updateOne(
      { owner },
      { postInterval: interval },
      { upsert: true }
    );
    return NextResponse.json({ message: `Interval set to ${interval} days for ${owner}` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error Occurs while Setting Intervals" }, { status: 500 });
  }
}
