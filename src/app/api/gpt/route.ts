import dbConnect from "@/lib/mongodb";
import OpenAIApi from "openai";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const openai = new OpenAIApi({
        apiKey: process.env.openai_apikey,
      });
    const { postText } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant providing comments for posts.",
        },
        { role: "user", content: postText },
      ],
    });

    const comment = response.choices[0].message.content;
    return NextResponse.json({ comment }, { status: 200 });
  } catch (error) {
    console.error("Failed to generate comment", error);
    return NextResponse.json({ error: "Failed to generate comment" }, { status: 500 });
  }
}