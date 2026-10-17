import "server-only";

import {
  GUESTBOOK_PROFILE_FALLBACKS,
  GUESTBOOK_ROOM_COLOR_FALLBACKS,
} from "@/data/guestbook-appearance";
import { GUESTBOOK_LIMITS, GUESTBOOK_TAGS } from "@/data/guestbook";
import type { GuestbookTag } from "@/types/guestbook";

export function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseTags(value: unknown): GuestbookTag[] {
  if (!Array.isArray(value)) return [];

  return [...new Set(value)]
    .filter((tag): tag is GuestbookTag => GUESTBOOK_TAGS.includes(tag as GuestbookTag))
    .slice(0, GUESTBOOK_LIMITS.tags);
}

export function serializeGuestbookMessage(message: Record<string, unknown>) {
  const replies = Array.isArray(message.replies) ? message.replies : [];
  const identity = String(message._id ?? "guestbook");
  const fallbackIndex = [...identity].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const fallbackRoom = GUESTBOOK_ROOM_COLOR_FALLBACKS[
    fallbackIndex % GUESTBOOK_ROOM_COLOR_FALLBACKS.length
  ];
  const fallbackProfile = GUESTBOOK_PROFILE_FALLBACKS[
    fallbackIndex % GUESTBOOK_PROFILE_FALLBACKS.length
  ];
  const storedRoomColor = typeof message.roomColor === "string" ? message.roomColor : "";
  const storedProfileImage = typeof message.profileImage === "string" ? message.profileImage : "";

  return {
    ...message,
    _id: String(message._id),
    createdAt: new Date(message.createdAt as string | Date).toISOString(),
    updatedAt: new Date(message.updatedAt as string | Date).toISOString(),
    roomThemeKey:
      typeof message.roomThemeKey === "string" && message.roomThemeKey
        ? message.roomThemeKey
        : fallbackRoom.key,
    roomColor: /^#[0-9a-f]{6}$/i.test(storedRoomColor) ? storedRoomColor : fallbackRoom.value,
    profileKey:
      typeof message.profileKey === "string" && message.profileKey
        ? message.profileKey
        : fallbackProfile.key,
    profileImage:
      storedProfileImage.startsWith("/") || /^https:\/\//i.test(storedProfileImage)
        ? storedProfileImage
        : fallbackProfile.value,
    replies: replies.map((reply) => {
      const item = reply as Record<string, unknown>;
      return {
        ...item,
        _id: String(item._id),
        createdAt: new Date(item.createdAt as string | Date).toISOString(),
      };
    }),
  };
}
