import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/shared/schemas/User";
import Post from "@/shared/schemas/Post";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");

    if (!owner) {
        return NextResponse.json({ error: "Owner is required." }, { status: 400 });
    }

    try {
        await dbConnect();
        const user = await User.findOne({ owner });
        const post = await Post.findOne({ owner });
        const userImage = post ? post.image : null;

        return NextResponse.json({ interval: user?.postInterval || null, image: userImage }, { status: 200 });
    } catch (error) {
        console.error("Error fetching interval:", error);
        return NextResponse.json({ error: "Error Occurs while Getting Interval" }, { status: 500 });
    }
}
