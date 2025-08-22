import { dbConnect } from "@/lib/db";
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();

  // FIX: ensure absolute URL
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";


   
    const posts = await Post.find({ title: { $regex: q, $options: "i" } })
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, posts });

}