import "server-only";

import { Schema, model, models } from "mongoose";

import { GUESTBOOK_TAGS } from "@/data/guestbook";

const guestbookReplySchema = new Schema(
  {
    content: { type: String, required: true, trim: true, maxlength: 500 },
    isAdmin: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const guestbookMessageSchema = new Schema(
  {
    nickname: { type: String, required: true, trim: true, maxlength: 20 },
    content: { type: String, required: true, trim: true, maxlength: 500 },
    tags: {
      type: [{ type: String, enum: GUESTBOOK_TAGS }],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 2,
        message: "태그는 최대 2개까지 선택할 수 있습니다.",
      },
    },
    replies: { type: [guestbookReplySchema], default: [] },
    isPinned: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    roomThemeKey: { type: String, default: "" },
    roomColor: { type: String, default: "" },
    profileKey: { type: String, default: "" },
    profileImage: { type: String, default: "" },
  },
  { collection: "guestbook_messages", timestamps: true },
);

const GuestbookMessage =
  models.GuestbookMessage ?? model("GuestbookMessage", guestbookMessageSchema);

export default GuestbookMessage;
