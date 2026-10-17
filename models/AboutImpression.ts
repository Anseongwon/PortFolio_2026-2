import "server-only";

import { Schema, model, models } from "mongoose";

const aboutImpressionSchema = new Schema(
  {
    key: { type: String, required: true, trim: true, unique: true },
    label: { type: String, required: true, trim: true },
    votes: { type: Number, default: 0, min: 0 },
    sortOrder: { type: Number, default: 0 },
  },
  { collection: "about_impressions", timestamps: true },
);

const AboutImpression =
  models.AboutImpression ?? model("AboutImpression", aboutImpressionSchema);

export default AboutImpression;
