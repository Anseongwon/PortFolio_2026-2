import "server-only";

import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  retryAfter: number;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalWithMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
  retryAfter: 0,
};

cache.retryAfter ??= 0;

globalWithMongoose.mongooseCache = cache;

export async function connectToDatabase() {
  const uri = getMongoUri();
  const databaseName = process.env.MONGODB_DB_NAME?.trim() || "myportfolio";

  if (!uri) return null;
  if (cache.connection?.connection.readyState === 1) return cache.connection;
  if (Date.now() < cache.retryAfter) throw new DatabaseConnectionError();

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      connectTimeoutMS: 4000,
      dbName: databaseName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 4000,
      socketTimeoutMS: 8000,
    });
  }

  try {
    cache.connection = await withTimeout(cache.promise, 2500);
    cache.retryAfter = 0;
    return cache.connection;
  } catch (error) {
    cache.retryAfter = Date.now() + 30_000;

    // Keep a still-pending DNS/driver attempt shared instead of starting another
    // connection on every page navigation. Reset it only when it actually settles.
    void cache.promise
      ?.then((connection) => {
        cache.connection = connection;
        cache.retryAfter = 0;
      })
      .catch(() => {
        cache.promise = null;
      });

    if (error instanceof DatabaseConnectionError) throw error;
    throw new DatabaseConnectionError(error);
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new DatabaseConnectionError()),
      timeoutMs,
    );

    promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("MongoDB 연결 환경변수가 설정되지 않았습니다.");
    this.name = "DatabaseConfigurationError";
  }
}

export class DatabaseConnectionError extends Error {
  cause?: unknown;

  constructor(cause?: unknown) {
    super("MongoDB에 연결할 수 없습니다.");
    this.name = "DatabaseConnectionError";
    this.cause = cause;
  }
}

export async function requireDatabaseConnection() {
  const connection = await connectToDatabase();
  if (!connection) throw new DatabaseConfigurationError();
  return connection;
}

export function isDatabaseConfigurationError(error: unknown) {
  return error instanceof DatabaseConfigurationError;
}

export function isDatabaseConnectionError(error: unknown) {
  return error instanceof DatabaseConnectionError;
}

export function isDatabaseUnavailableError(error: unknown) {
  return isDatabaseConfigurationError(error) || isDatabaseConnectionError(error);
}

function getMongoUri() {
  const directUri = process.env.MONGODB_DIRECT_URI?.trim();
  if (directUri) return directUri;

  const srvUri = process.env.MONGODB_URI?.trim();
  const seedHosts = process.env.MONGODB_SEED_HOSTS?.trim();

  if (!srvUri || !seedHosts) return srvUri;

  return buildDirectUri(srvUri, seedHosts);
}

/**
 * mongodb+srv relies on Node's SRV DNS lookup. Some school/company networks
 * allow normal OS DNS queries but block Node's SRV lookup. Atlas seed hosts
 * can be supplied separately without duplicating credentials.
 */
function buildDirectUri(srvUri: string, seedHosts: string) {
  if (!srvUri.startsWith("mongodb+srv://")) return srvUri;

  const schemeLength = "mongodb+srv://".length;
  const authorityEnd = srvUri.indexOf("/", schemeLength);
  const authority =
    authorityEnd === -1
      ? srvUri.slice(schemeLength)
      : srvUri.slice(schemeLength, authorityEnd);
  const credentialsEnd = authority.lastIndexOf("@");

  if (credentialsEnd === -1) return srvUri;

  const credentials = authority.slice(0, credentialsEnd);
  const suffix = authorityEnd === -1 ? "/" : srvUri.slice(authorityEnd);
  const [path, rawQuery = ""] = suffix.split("?", 2);
  const query = new URLSearchParams(rawQuery);

  query.set("tls", "true");
  query.set("authSource", query.get("authSource") || "admin");

  const replicaSet = process.env.MONGODB_REPLICA_SET?.trim();
  if (replicaSet) query.set("replicaSet", replicaSet);

  return `mongodb://${credentials}@${seedHosts}${path}?${query.toString()}`;
}
