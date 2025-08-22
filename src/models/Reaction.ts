import { Schema, model, models, Types } from "mongoose";
const ReactionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", index: true, required: true },
  postId: { type: Types.ObjectId, ref: "Post", index: true, required: true },
  type: { type: String, enum: ["like","dislike"], required: true },
}, { timestamps: true });

ReactionSchema.index({ userId: 1, postId: 1 }, { unique: true });
export const Reaction = models.Reaction || model("Reaction", ReactionSchema);
