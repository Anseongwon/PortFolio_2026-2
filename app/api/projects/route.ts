import { revalidatePath } from "next/cache";

import { isProjectAdmin } from "@/lib/project-admin";
import {
  createProject,
  getProjects,
  ProjectSlugConflictError,
} from "@/lib/projects";
import { isDatabaseUnavailableError } from "@/lib/mongodb";
import type { Project } from "@/types/project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  return Response.json({ projects: await getProjects() });
}

function text(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function textList(value: unknown, maximumItems: number, maximumLength: number) {
  return Array.isArray(value)
    ? value
        .map((item) => text(item, maximumLength))
        .filter(Boolean)
        .slice(0, maximumItems)
    : [];
}

function optionalResource(value: unknown) {
  const resource = text(value, 500);
  if (!resource) return undefined;

  if (resource.startsWith("/")) return resource;

  try {
    const url = new URL(resource);
    return url.protocol === "https:" ? resource : null;
  } catch {
    return null;
  }
}

function parseProject(body: Record<string, unknown>) {
  const slug = text(body.slug, 80).toLowerCase();
  const title = text(body.title, 80);
  const summary = text(body.summary, 300);
  const type = body.type === "team" ? "team" : body.type === "personal" ? "personal" : null;
  const status =
    body.status === "completed"
      ? "completed"
      : body.status === "in-progress"
        ? "in-progress"
        : null;
  const startedAt = text(body.startedAt, 10);
  const period = text(body.period, 80);
  const role = text(body.role, 500);
  const techStack = textList(body.techStack, 20, 40);
  const features = textList(body.features, 20, 180);
  const thumbnail = optionalResource(body.thumbnail);
  const lightThumbnail = optionalResource(body.lightThumbnail);
  const githubUrl = optionalResource(body.githubUrl);
  const demoUrl = optionalResource(body.demoUrl);

  if (!slugPattern.test(slug)) {
    return { error: "주소 이름은 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다." } as const;
  }
  if (!title || !summary || !type || !status || !datePattern.test(startedAt)) {
    return { error: "프로젝트의 필수 정보를 모두 올바르게 입력해주세요." } as const;
  }
  if (!period || !role || techStack.length === 0 || features.length === 0) {
    return { error: "기간, 담당 내용, 사용 기술, 주요 기능을 입력해주세요." } as const;
  }
  if ([thumbnail, lightThumbnail, githubUrl, demoUrl].includes(null)) {
    return { error: "이미지 경로는 /로 시작하고, 외부 링크는 https:// 주소여야 합니다." } as const;
  }

  const gallery = Array.isArray(body.gallery)
    ? body.gallery
        .slice(0, 20)
        .map((item) => {
          const image = item as Record<string, unknown>;
          const src = optionalResource(image.src);
          const imageTitle = text(image.title, 80);
          const alt = text(image.alt, 180);
          return src && imageTitle && alt ? { src, title: imageTitle, alt } : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];

  const project: Project = {
    slug,
    title,
    summary,
    type,
    status,
    startedAt,
    period,
    learningTopic: text(body.learningTopic, 180) || undefined,
    role,
    overview: text(body.overview, 1500) || undefined,
    techStack,
    features,
    learnings: text(body.learnings, 1500) || undefined,
    thumbnail: thumbnail || undefined,
    lightThumbnail: lightThumbnail || undefined,
    gallery: gallery.length ? gallery : undefined,
    githubUrl: githubUrl || undefined,
    demoUrl: demoUrl || undefined,
    demoPending: Boolean(body.demoPending),
  };

  return { project } as const;
}

export async function POST(request: Request) {
  if (!isProjectAdmin(request)) {
    return Response.json(
      { message: "관리자 키가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = parseProject(body);
    if ("error" in result) {
      return Response.json({ message: result.error }, { status: 400 });
    }

    const project = await createProject(result.project);
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof ProjectSlugConflictError) {
      return Response.json({ message: error.message }, { status: 409 });
    }
    if (isDatabaseUnavailableError(error)) {
      return Response.json(
        { message: "데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요." },
        { status: 503 },
      );
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return Response.json(
        { message: "이미 사용 중인 프로젝트 주소입니다." },
        { status: 409 },
      );
    }

    console.error("프로젝트 등록 실패", error);
    return Response.json(
      { message: "프로젝트를 저장하지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
