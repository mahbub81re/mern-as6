import { Schema, model, models, Types } from "mongoose";

const PostSchema = new Schema({
  authorId: { type: Types.ObjectId, ref: "User", index: true, required: true },
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  coverImageUrl: String,
  contentHTML: { type: String, required: true },
  status: { type: String, enum: ["draft","published","suspended"], default: "draft", index: true },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Post = models.Post || model("Post", PostSchema);
