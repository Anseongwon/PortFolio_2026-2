import "server-only";

import { Schema, model, models } from "mongoose";

const guestbookAppearanceSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["roomColor", "profile"],
      required: true,
      index: true,
    },
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { collection: "guestbook_appearances", timestamps: true },
);

guestbookAppearanceSchema.index({ kind: 1, key: 1 }, { unique: true });

const GuestbookAppearance =
  models.GuestbookAppearance ?? model("GuestbookAppearance", guestbookAppearanceSchema);

export default GuestbookAppearance;
