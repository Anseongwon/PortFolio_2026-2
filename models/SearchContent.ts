import "server-only";

import { Schema, model, models } from "mongoose";

const searchContentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    page: { type: String, required: true },
    pageLabel: { type: String, required: true },
    title: { type: String, required: true },
    section: { type: String, required: true },
    content: { type: String, required: true },
    keywords: { type: [String], default: [] },
    url: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
  },
  { collection: "search_contents", timestamps: true },
);

const SearchContent = models.SearchContent ?? model("SearchContent", searchContentSchema);

export default SearchContent;
