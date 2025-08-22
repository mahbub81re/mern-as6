import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Comment } from "@/models/Comment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postComments = await Comment.find({ postId: id }).populate("authorId", "name").sort({ createdAt: -1 }).lean();
 console.log(postComments);
  return NextResponse.json(postComments);
}

// POST /api/posts/[id]/comments
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
  const { id } = await params;
  const body = await req.json();
  console.log("Creating comment for post ID:", id,body, "by user ID:", session.user.id);
  const newComment = {
    postId: id,
    authorId: session.user.id,
    body: body.content,
  };
   await Comment.create(newComment);
  return NextResponse.json(newComment, { status: 201 });
}
