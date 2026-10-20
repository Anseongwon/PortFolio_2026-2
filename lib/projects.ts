import "server-only";

import { cache } from "react";

import { projects as staticProjects } from "@/data/projects";
import { requireDatabaseConnection } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import type { Project } from "@/types/project";

export class ProjectSlugConflictError extends Error {
  constructor() {
    super("이미 사용 중인 프로젝트 주소입니다.");
    this.name = "ProjectSlugConflictError";
  }
}

function optionalText(value: unknown) {
  return typeof value === "string" && value ? value : undefined;
}

function serializeProject(document: unknown): Project {
  const project = document as Record<string, unknown>;
  const gallery = Array.isArray(project.gallery)
    ? project.gallery.map((item) => {
        const image = item as Record<string, unknown>;
        return {
          src: String(image.src ?? ""),
          title: String(image.title ?? ""),
          alt: String(image.alt ?? ""),
        };
      })
    : [];

  return {
    slug: String(project.slug ?? ""),
    title: String(project.title ?? ""),
    summary: String(project.summary ?? ""),
    type: project.type === "team" ? "team" : "personal",
    status: project.status === "completed" ? "completed" : "in-progress",
    startedAt: String(project.startedAt ?? ""),
    period: String(project.period ?? ""),
    learningTopic: optionalText(project.learningTopic),
    role: String(project.role ?? ""),
    overview: optionalText(project.overview),
    techStack: Array.isArray(project.techStack)
      ? project.techStack.map(String)
      : [],
    features: Array.isArray(project.features) ? project.features.map(String) : [],
    learnings: optionalText(project.learnings),
    thumbnail: optionalText(project.thumbnail),
    lightThumbnail: optionalText(project.lightThumbnail),
    gallery: gallery.length ? gallery : undefined,
    githubUrl: optionalText(project.githubUrl),
    demoUrl: optionalText(project.demoUrl),
    demoPending: Boolean(project.demoPending),
  };
}

export async function getProjects() {
  try {
    await requireDatabaseConnection();
    const storedProjects = await ProjectModel.find({})
      .sort({ startedAt: -1, createdAt: -1 })
      .maxTimeMS(3000)
      .lean();
    const merged = new Map(staticProjects.map((project) => [project.slug, project]));

    for (const project of storedProjects.map(serializeProject)) {
      if (!merged.has(project.slug)) merged.set(project.slug, project);
    }

    return [...merged.values()].sort((a, b) =>
      b.startedAt.localeCompare(a.startedAt),
    );
  } catch (error) {
    console.error("MongoDB 프로젝트 목록을 불러오지 못해 정적 목록을 사용합니다.", error);
    return staticProjects;
  }
}

export const getProjectBySlug = cache(async (slug: string) => {
  const staticProject = staticProjects.find((project) => project.slug === slug);
  if (staticProject) return staticProject;

  try {
    await requireDatabaseConnection();
    const project = await ProjectModel.findOne({ slug }).maxTimeMS(3000).lean();
    return project ? serializeProject(project) : null;
  } catch (error) {
    console.error("MongoDB 프로젝트를 불러오지 못했습니다.", error);
    return null;
  }
});

export async function createProject(input: Project) {
  await requireDatabaseConnection();

  if (staticProjects.some((project) => project.slug === input.slug)) {
    throw new ProjectSlugConflictError();
  }

  const existing = await ProjectModel.exists({ slug: input.slug });
  if (existing) throw new ProjectSlugConflictError();

  const project = await ProjectModel.create(input);
  return serializeProject(project.toObject());
}
