import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const post = await Post.findById((await params).id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });


  const body = await _.json();
  Object.assign(post, { title: body.title ?? post.title, contentHTML: body.contentHTML ?? post.contentHTML, status: body.status ?? post.status, coverImageUrl: body.coverImageUrl ?? post.coverImageUrl });
  await post.save();
  return NextResponse.json(post);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const post = await Post.findById((await params).id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Post.deleteOne({ _id: post._id });
  return NextResponse.json({ ok: true });
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {

    await dbConnect();
    const post = await Post.findOne({ slug: (await params).id });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(post);
}