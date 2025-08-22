import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions); 
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.contentHTML) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const exists = await Post.findOne({ slug });
    if (exists) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
   console.log(session.user.id);
    const post = await Post.create({
      ...body,
      slug,
      coverImageUrl: body.cover || "",
      authorId: session.user.id,
    });

    return NextResponse.json(post);

}

export async function GET(req: Request) {
  await dbConnect();

  // FIX: ensure absolute URL
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";


    const posts = await Post.find({ title: { $regex: q, $options: "i" } })
      .sort({ createdAt: -1 }).lean();
      
    return NextResponse.json({ success: true, posts });
  
}