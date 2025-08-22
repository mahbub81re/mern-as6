import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/db";
import { Reaction } from "@/models/Reaction";
import { Post } from "@/models/Post";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();

    const { type } = await req.json() as { type: "like" | "dislike" | null };
    const userId = session.user.id ;

    const existing = await Reaction.findOne({ userId, postId: (await params).id });

    if (type === null) {
      if (existing) {
        await existing.deleteOne();
        await recomputeCounts((await params).id);
      }
      return NextResponse.json({ ok: true });
    }

    if (!existing) {
      await Reaction.create({ userId, postId: (await params).id, type });
    } else {
      existing.type = type;
      await existing.save();
    }

    await recomputeCounts((await params).id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reaction PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function recomputeCounts(postId: string) {
  const [likes, dislikes] = await Promise.all([
    Reaction.countDocuments({ postId, type: "like" }),
    Reaction.countDocuments({ postId, type: "dislike" }),
  ]);
  await Post.updateOne({ _id: postId }, { likeCount: likes, dislikeCount: dislikes });
}
