import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, default: "" },
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  avatarUrl: String,
}, { timestamps: true });

export const User = models.User || model("User", UserSchema);
