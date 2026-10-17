import type { GuestbookTag } from "@/types/guestbook";

export const GUESTBOOK_TAGS: GuestbookTag[] = [
  "궁금해요",
  "힘내요",
  "좋아요",
  "조언해요",
];

export const GUESTBOOK_LIMITS = {
  nickname: 20,
  content: 500,
  reply: 500,
  tags: 2,
} as const;
