export type Project = {
  slug: string;
  title: string;
  summary: string;
  type: "team" | "personal";
  status: "completed" | "in-progress";
  startedAt: string;
  period: string;
  role: string;
  techStack: string[];
  features: string[];
  learnings?: string;
  thumbnail?: string;
  lightThumbnail?: string;
  gallery?: Array<{
    src: string;
    title: string;
    alt: string;
  }>;
  githubUrl?: string;
  demoUrl?: string;
};
