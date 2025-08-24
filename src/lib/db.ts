import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL!;
if (!MONGODB_URI) throw new Error("DATABASE_URL not set");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
