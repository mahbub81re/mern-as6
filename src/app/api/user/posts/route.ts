import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const posts = await Post.find({ authorId: session.user.id }).lean();
  return NextResponse.json(posts);
}