import { Schema, model, models, Types } from "mongoose";
const CommentSchema = new Schema({
  postId: { type: Types.ObjectId, ref: "Post", index: true, required: true },
  authorId: { type: Types.ObjectId, ref: "User", index: true, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ["active","suspended","deleted"], default: "active", index: true },
}, { timestamps: true });

export const Comment = models.Comment || model("Comment", CommentSchema);
