import { readFile } from "node:fs/promises";
import dns from "node:dns/promises";
import net from "node:net";

import mongoose from "mongoose";

const TIMEOUT_MS = 6000;

function loadEnv(text) {
  for (const sourceLine of text.split(/\r?\n/)) {
    const line = sourceLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  }
}

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timeout`)), TIMEOUT_MS);
    }),
  ]);
}

function testTcp(host, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const done = (ok) => {
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(4000);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

function redact(message) {
  return String(message).replace(
    /mongodb(?:\+srv)?:\/\/[^\s]+/gi,
    "[redacted MongoDB URI]",
  );
}

for (const envFile of [".env.local", ".env.development.local"]) {
  try {
    loadEnv(await readFile(envFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

const srvUri = process.env.MONGODB_URI;
const seedHosts = process.env.MONGODB_SEED_HOSTS;
let uri = process.env.MONGODB_DIRECT_URI || srvUri;
if (!uri) {
  console.error("[FAIL] MONGODB_URI가 .env.local에 없습니다.");
  process.exit(1);
}

const match = uri.match(/^mongodb\+srv:\/\/(?:[^@]+@)?([^/?]+)/i);
let srvLookupFailed = false;
if (match) {
  const srvName = `_mongodb._tcp.${match[1]}`;
  try {
    const records = await withTimeout(dns.resolveSrv(srvName), "SRV DNS");
    console.log(`[OK] SRV DNS: ${records.length}개 호스트 확인`);

    const tcpResults = await Promise.all(
      records.map(async ({ name, port }) => ({
        host: name,
        ok: await testTcp(name, port),
        port,
      })),
    );

    for (const result of tcpResults) {
      console.log(
        `[${result.ok ? "OK" : "FAIL"}] TCP ${result.host}:${result.port}`,
      );
    }
  } catch (error) {
    srvLookupFailed = true;
    console.error(`[FAIL] ${redact(error.message)}`);
    console.error(
      "       Node에서 Atlas SRV DNS를 조회하지 못합니다. MONGODB_DIRECT_URI 또는 MONGODB_SEED_HOSTS를 설정하세요.",
    );
  }
}

if (srvLookupFailed && seedHosts && srvUri) {
  const schemeLength = "mongodb+srv://".length;
  const authorityEnd = srvUri.indexOf("/", schemeLength);
  const authority = srvUri.slice(schemeLength, authorityEnd);
  const credentials = authority.slice(0, authority.lastIndexOf("@"));
  const suffix = srvUri.slice(authorityEnd);
  const [path, rawQuery = ""] = suffix.split("?", 2);
  const query = new URLSearchParams(rawQuery);
  query.set("tls", "true");
  query.set("authSource", query.get("authSource") || "admin");
  if (process.env.MONGODB_REPLICA_SET) {
    query.set("replicaSet", process.env.MONGODB_REPLICA_SET);
  }
  uri = `mongodb://${credentials}@${seedHosts}${path}?${query}`;
  console.log("[INFO] MONGODB_SEED_HOSTS를 사용해 SRV DNS를 우회합니다.");

  const seedResults = await Promise.all(
    seedHosts.split(",").map(async (seed) => {
      const [host, rawPort = "27017"] = seed.trim().split(":");
      const port = Number(rawPort);
      return { host, ok: await testTcp(host, port), port };
    }),
  );

  for (const result of seedResults) {
    console.log(
      `[${result.ok ? "OK" : "FAIL"}] TCP ${result.host}:${result.port}`,
    );
  }

  if (seedResults.every((result) => !result.ok)) {
    console.error(
      "[FAIL] Atlas의 모든 호스트에서 TCP 27017 연결이 차단되었습니다.",
    );
    console.error(
      "       Atlas IP 허용 후에도 같다면 현재 Wi-Fi/학교/회사 네트워크 방화벽을 확인하거나 다른 네트워크를 사용하세요.",
    );
  }
} else if (srvLookupFailed) {
  process.exit(1);
}

try {
  await mongoose.connect(uri, {
    bufferCommands: false,
    connectTimeoutMS: TIMEOUT_MS,
    serverSelectionTimeoutMS: TIMEOUT_MS,
  });
  console.log("[OK] MongoDB 연결 및 인증 성공");
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error(`[FAIL] MongoDB 연결: ${redact(error.message)}`);
  console.error(
    "       Atlas Network Access의 허용 IP와 현재 네트워크의 TCP 27017 허용 여부를 확인하세요.",
  );
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
}
