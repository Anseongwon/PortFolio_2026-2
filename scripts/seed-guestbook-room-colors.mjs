import nextEnv from "@next/env";
import mongoose from "mongoose";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const roomColors = [
  "#AFC4E3",
  "#C3DDF7",
  "#CFEAEA",
  "#DCCEF7",
  "#F7C6D7",
  "#F8E3A7",
  "#C9E7C9",
  "#FFC9B6",
  "#E8D7C6",
  "#A9B8D6",
  "#B7D3A4",
  "#AFA7E6",
  "#F4A7B9",
  "#A5D8E6",
  "#B7C4F2",
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
    roomColors.map((value, index) => ({
      updateOne: {
        filter: { kind: "roomColor", key: `kakao-room-${String(index + 1).padStart(2, "0")}` },
        update: {
          $set: { value, active: true, sortOrder: index + 1, updatedAt: now },
          $setOnInsert: {
            kind: "roomColor",
            key: `kakao-room-${String(index + 1).padStart(2, "0")}`,
            createdAt: now,
          },
        },
        upsert: true,
      },
    })),
  );

  const saved = await collection
    .find({ kind: "roomColor", key: /^kakao-room-/ })
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
        colors: saved.map((item) => item.value),
      },
      null,
      2,
    ),
  );
} finally {
  await mongoose.disconnect();
}
