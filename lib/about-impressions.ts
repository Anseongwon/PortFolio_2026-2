import "server-only";

import { ABOUT_IMPRESSION_OPTIONS } from "@/data/about-impressions";
import { requireDatabaseConnection } from "@/lib/mongodb";
import AboutImpression from "@/models/AboutImpression";
import type { AboutImpressionKey } from "@/data/about-impressions";

async function ensureAboutImpressions() {
  await AboutImpression.bulkWrite(
    ABOUT_IMPRESSION_OPTIONS.map((option, index) => ({
      updateOne: {
        filter: { key: option.key },
        update: {
          $set: { label: option.label, sortOrder: index + 1 },
          $setOnInsert: { votes: 0 },
        },
        upsert: true,
      },
    })),
  );
}

async function readAboutImpressionResults() {
  const storedOptions = await AboutImpression.find({
    key: { $in: ABOUT_IMPRESSION_OPTIONS.map((option) => option.key) },
  })
    .sort({ sortOrder: 1 })
    .select({ _id: 0, key: 1, label: 1, votes: 1 })
    .maxTimeMS(3000)
    .lean<Array<{ key: AboutImpressionKey; label: string; votes: number }>>();
  const votesByKey = new Map(
    storedOptions.map((option) => [option.key, option.votes]),
  );
  const options = ABOUT_IMPRESSION_OPTIONS.map((option) => ({
    key: option.key,
    label: option.label,
    votes: votesByKey.get(option.key) ?? 0,
  }));

  return {
    options,
    total: options.reduce((sum, option) => sum + option.votes, 0),
  };
}

export async function getAboutImpressionResults() {
  await requireDatabaseConnection();
  return readAboutImpressionResults();
}

export async function voteForAboutImpression(key: AboutImpressionKey) {
  await requireDatabaseConnection();
  await ensureAboutImpressions();
  await AboutImpression.updateOne({ key }, { $inc: { votes: 1 } });
  return readAboutImpressionResults();
}
