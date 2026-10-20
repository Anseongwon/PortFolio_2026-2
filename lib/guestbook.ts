import "server-only";

import { assignGuestbookAppearance } from "@/lib/guestbook-appearance";
import { serializeGuestbookMessage } from "@/lib/guestbook-helpers";
import { requireDatabaseConnection } from "@/lib/mongodb";
import GuestbookMessageModel from "@/models/GuestbookMessage";
import type {
  GuestbookMessage,
  GuestbookSort,
  GuestbookTag,
} from "@/types/guestbook";

type GuestbookListOptions = {
  sort?: GuestbookSort;
  tag?: GuestbookTag;
  query?: string;
};

type CreateGuestbookMessageInput = {
  nickname: string;
  content: string;
  tags: GuestbookTag[];
};

type GuestbookStateUpdate = {
  isPinned?: boolean;
  isFavorite?: boolean;
};

function serialize(message: unknown) {
  return serializeGuestbookMessage(
    message as Record<string, unknown>,
  ) as GuestbookMessage;
}

export async function getGuestbookMessages({
  sort = "latest",
  tag,
  query = "",
}: GuestbookListOptions = {}) {
  await requireDatabaseConnection();

  const filter: Record<string, unknown> = {};
  if (sort === "favorite") filter.isFavorite = true;
  if (tag) filter.tags = tag;

  if (query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { nickname: { $regex: escaped, $options: "i" } },
      { content: { $regex: escaped, $options: "i" } },
    ];
  }

  const createdAt = sort === "oldest" ? 1 : -1;
  const [messages, total] = await Promise.all([
    GuestbookMessageModel.find(filter)
      .sort({ isPinned: -1, createdAt })
      .maxTimeMS(3000)
      .lean(),
    GuestbookMessageModel.countDocuments({}).maxTimeMS(3000),
  ]);

  return {
    messages: messages.map(serialize),
    total,
  };
}

export async function getGuestbookMessage(id: string) {
  await requireDatabaseConnection();
  const message = await GuestbookMessageModel.findById(id).maxTimeMS(3000).lean();
  return message ? serialize(message) : null;
}

export async function createGuestbookMessage(input: CreateGuestbookMessageInput) {
  await requireDatabaseConnection();
  const appearance = await assignGuestbookAppearance();
  const message = await GuestbookMessageModel.create({ ...input, ...appearance });
  return serialize(message.toObject());
}

export async function updateGuestbookMessageState(
  id: string,
  update: GuestbookStateUpdate,
) {
  await requireDatabaseConnection();
  const message = await GuestbookMessageModel.findByIdAndUpdate(id, update, {
    new: true,
  }).lean();
  return message ? serialize(message) : null;
}

export async function addGuestbookReply(id: string, content: string) {
  await requireDatabaseConnection();
  const message = await GuestbookMessageModel.findByIdAndUpdate(
    id,
    { $push: { replies: { content, isAdmin: true, createdAt: new Date() } } },
    { new: true },
  ).lean();
  return message ? serialize(message) : null;
}

export async function deleteGuestbookMessage(id: string) {
  await requireDatabaseConnection();
  return Boolean(await GuestbookMessageModel.findByIdAndDelete(id));
}
