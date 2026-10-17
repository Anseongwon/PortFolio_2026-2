import nextEnv from "@next/env";
import mongoose from "mongoose";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const profiles = [
  ["guest-orb-aqua", "/images/guestbook/profiles/orb-aqua.png"],
  ["guest-orb-blue", "/images/guestbook/profiles/orb-blue.png"],
  ["guest-orb-lavender", "/images/guestbook/profiles/orb-lavender.png"],
  ["guest-orb-pink", "/images/guestbook/profiles/orb-pink.png"],
  ["guest-orb-amber", "/images/guestbook/profiles/orb-amber.png"],
  ["guest-orb-green", "/images/guestbook/profiles/orb-green.png"],
  ["guest-orb-coral", "/images/guestbook/profiles/orb-coral.png"],
  ["guest-orb-teal", "/images/guestbook/profiles/orb-teal.png"],
  ["guest-orb-indigo", "/images/guestbook/profiles/orb-indigo.png"],
];

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI가 설정되어 있지 않습니다.");
const databaseName = process.env.MONGODB_DB_NAME?.trim() || "myportfolio";

await mongoose.connect(uri, {
  bufferCommands: false,
  dbName: databaseName,
  serverSelectionTimeoutMS: 5000,
});

try {
  const collection = mongoose.connection.collection("guestbook_appearances");
  const now = new Date();
  const result = await collection.bulkWrite(
    profiles.map(([key, value], index) => ({
      updateOne: {
        filter: { kind: "profile", key },
        update: {
          $set: { value, active: true, sortOrder: index + 1, updatedAt: now },
          $setOnInsert: { kind: "profile", key, createdAt: now },
        },
        upsert: true,
      },
    })),
  );

  const saved = await collection
    .find({ kind: "profile", key: /^guest-orb-/ })
    .sort({ sortOrder: 1 })
    .project({ _id: 0, key: 1, value: 1, active: 1, sortOrder: 1 })
    .toArray();

  console.log(
    JSON.stringify(
      {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
        savedCount: saved.length,
        profiles: saved,
      },
      null,
      2,
    ),
  );
} finally {
  await mongoose.disconnect();
}
