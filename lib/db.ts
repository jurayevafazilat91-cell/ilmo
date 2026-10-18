import mongoose from 'mongoose';

// Cached on globalThis so serverless invocations and dev hot reloads reuse one connection.
const g = globalThis as unknown as { __mongoose?: Promise<typeof mongoose> };

export function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  g.__mongoose ??= mongoose.connect(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000 }).catch((e) => {
    g.__mongoose = undefined; // retry on the next request instead of caching the failure
    throw e;
  });
  return g.__mongoose;
}
