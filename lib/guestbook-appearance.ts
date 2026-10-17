import "server-only";

import {
  GUESTBOOK_PROFILE_FALLBACKS,
  GUESTBOOK_ROOM_COLOR_FALLBACKS,
} from "@/data/guestbook-appearance";
import GuestbookAppearance from "@/models/GuestbookAppearance";

type AppearanceCandidate = { key: string; value: string };

function pickRandom<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function isRoomColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function isProfileSource(value: string) {
  return value.startsWith("/") || /^https:\/\//i.test(value);
}

export async function assignGuestbookAppearance() {
  const [storedRoomColors, storedProfiles] = await Promise.all([
    GuestbookAppearance.find({ kind: "roomColor", active: true })
      .select({ _id: 0, key: 1, value: 1 })
      .sort({ sortOrder: 1 })
      .lean<AppearanceCandidate[]>(),
    GuestbookAppearance.find({ kind: "profile", active: true })
      .select({ _id: 0, key: 1, value: 1 })
      .sort({ sortOrder: 1 })
      .lean<AppearanceCandidate[]>(),
  ]);

  const roomCandidates = storedRoomColors.filter((item) => isRoomColor(item.value));
  const profileCandidates = storedProfiles.filter((item) => isProfileSource(item.value));
  const room = pickRandom(
    roomCandidates.length > 0 ? roomCandidates : GUESTBOOK_ROOM_COLOR_FALLBACKS,
  );
  const profile = pickRandom(
    profileCandidates.length > 0 ? profileCandidates : GUESTBOOK_PROFILE_FALLBACKS,
  );

  return {
    roomThemeKey: room.key,
    roomColor: room.value,
    profileKey: profile.key,
    profileImage: profile.value,
  };
}
