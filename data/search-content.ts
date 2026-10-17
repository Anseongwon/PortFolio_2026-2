import { aboutSections } from "@/data/about";
import { issues } from "@/data/issues";
import { projects } from "@/data/projects";
import type { SearchDocument } from "@/types/search";

const aboutDocuments: SearchDocument[] = aboutSections.map((section) => ({
  id: `about-${section.id}`,
  page: "about",
  pageLabel: "About Me",
  title: section.title,
  section: section.title,
  content: section.body.join(" "),
  keywords: [...section.keywords],
  url: `/about#${section.id}`,
  isPublic: true,
}));

const projectDocuments: SearchDocument[] = projects.flatMap((project) => [
  {
    id: `project-${project.slug}-overview`,
    page: "projects",
    pageLabel: "Projects",
    title: project.title,
    section: "프로젝트 소개",
    content: `${project.summary} ${project.period}`,
    keywords: [project.title, project.type === "team" ? "팀 프로젝트" : "개인 프로젝트"],
    url: `/projects/${project.slug}#overview`,
    isPublic: true,
  },
  {
    id: `project-${project.slug}-tech-stack`,
    page: "projects",
    pageLabel: "Projects",
    title: project.title,
    section: "사용 기술",
    content: project.techStack.join(", "),
    keywords: [...project.techStack, "기술"],
    url: `/projects/${project.slug}#tech-stack`,
    isPublic: true,
  },
  {
    id: `project-${project.slug}-role`,
    page: "projects",
    pageLabel: "Projects",
    title: project.title,
    section: "담당 역할",
    content: project.role,
    keywords: ["역할", "담당"],
    url: `/projects/${project.slug}#role`,
    isPublic: true,
  },
  ...(project.features.length > 0
    ? [
        {
          id: `project-${project.slug}-features`,
          page: "projects" as const,
          pageLabel: "Projects",
          title: project.title,
          section: "주요 기능",
          content: project.features.join(" "),
          keywords: ["기능", ...project.features],
          url: `/projects/${project.slug}#features`,
          isPublic: true,
        },
      ]
    : []),
]);

const issueDocuments: SearchDocument[] = issues.map((issue) => ({
  id: `issue-${issue.slug}`,
  page: "issues",
  pageLabel: "Dev Issues",
  title: issue.title,
  section: "문제 요약",
  content: issue.summary,
  keywords: [issue.category, issue.difficulty, issue.status],
  url: `/issues/${issue.slug}#overview`,
  isPublic: true,
}));

const contactDocuments: SearchDocument[] = [
  {
    id: "home-contact-github",
    page: "home",
    pageLabel: "Home",
    title: "GitHub",
    section: "연락 수단",
    content: "안성원의 GitHub 프로필에서 프로젝트 저장소를 확인할 수 있습니다.",
    keywords: ["연락", "연락처", "깃허브", "GitHub"],
    url: "/#contact",
    isPublic: true,
  },
];

export const localSearchDocuments: SearchDocument[] = [
  ...aboutDocuments,
  ...projectDocuments,
  ...issueDocuments,
  ...contactDocuments,
];
