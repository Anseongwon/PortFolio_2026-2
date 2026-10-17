import "server-only";

import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalWithMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalWithMongoose.mongooseCache = cache;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB_NAME?.trim() || "myportfolio";

  if (!uri) return null;
  if (cache.connection) return cache.connection;

  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    dbName: databaseName,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
