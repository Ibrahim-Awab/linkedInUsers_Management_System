import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/shared/schemas/User";

export async function POST(req: Request) {
    const { owner, isImportant } = await req.json();
  
    if (!owner || typeof isImportant !== "boolean") {
      return NextResponse.json({ error: "Both owner and isImportant are required." }, { status: 400 });
    }
  
    try {
      await dbConnect();
      await User.updateOne(
        { owner },
        { isImportant },
        { upsert: true }
      );
      return NextResponse.json({ message: `Important status set to ${isImportant} for ${owner}` }, { status: 200 });
    } catch (error) {
      console.error("Error updating important status:", error);
      return NextResponse.json({ error: "Error Occurs while Creating User Important" }, { status: 500 });
    }
  }