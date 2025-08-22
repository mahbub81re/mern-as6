import { NextResponse } from "next/server";
interface Comments {id:string,postId:string,text:string,status:string}
// Dummy DB (later replace with real DB)
let comments: Comments[] = [
  { id: "c1", postId: "1", text: "Great post!", status: "active" },
  { id: "c2", postId: "1", text: "Thanks for sharing.", status: "active" },
];

// PATCH /api/comments/[cid]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ cid: string }> }
) {
  const { cid } = await params;
  const body = await req.json();

  const comment = comments.find((c) => c.id === cid);
  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  comment.text = body.text ?? comment.text;
  return NextResponse.json(comment);
}

// DELETE /api/comments/[cid]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ cid: string }> }
) {
  const { cid } = await params;
  comments = comments.filter((c) => c.id !== cid);
  return NextResponse.json({ message: "Comment deleted" });
}

// Custom: SUSPEND /api/comments/[cid]
export async function POST(
  req: Request,
  { params }: { params: Promise<{ cid: string }> }
) {
  const { cid } = await params;
  const { action } = await req.json();

  const comment = comments.find((c) => c.id === cid);
  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (action === "suspend") {
    comment.status = "suspended";
    return NextResponse.json(comment);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
