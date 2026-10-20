import "server-only";

import { Schema, model, models } from "mongoose";

const projectGalleryItemSchema = new Schema(
  {
    src: { type: String, required: true, trim: true, maxlength: 500 },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    alt: { type: String, required: true, trim: true, maxlength: 180 },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 80,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    type: { type: String, required: true, enum: ["team", "personal"] },
    status: {
      type: String,
      required: true,
      enum: ["completed", "in-progress"],
    },
    startedAt: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true, maxlength: 80 },
    learningTopic: { type: String, trim: true, maxlength: 180, default: "" },
    role: { type: String, required: true, trim: true, maxlength: 500 },
    overview: { type: String, trim: true, maxlength: 1500, default: "" },
    techStack: {
      type: [{ type: String, trim: true, maxlength: 40 }],
      required: true,
    },
    features: {
      type: [{ type: String, trim: true, maxlength: 180 }],
      default: [],
    },
    learnings: { type: String, trim: true, maxlength: 1500, default: "" },
    thumbnail: { type: String, trim: true, maxlength: 500, default: "" },
    lightThumbnail: { type: String, trim: true, maxlength: 500, default: "" },
    gallery: { type: [projectGalleryItemSchema], default: [] },
    githubUrl: { type: String, trim: true, maxlength: 500, default: "" },
    demoUrl: { type: String, trim: true, maxlength: 500, default: "" },
    demoPending: { type: Boolean, default: false },
  },
  { collection: "projects", timestamps: true },
);

const ProjectModel = models.Project ?? model("Project", projectSchema);

export default ProjectModel;
