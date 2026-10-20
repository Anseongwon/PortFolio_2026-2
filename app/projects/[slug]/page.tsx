import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import ProjectGallery from "@/components/projects/ProjectGallery";
import { projects } from "@/data/projects";
import { projectStatusLabel, projectTypeLabel } from "@/lib/project-labels";
import { getProjectBySlug } from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const sectionLinks = [
  { href: "#overview", label: "개요" },
  { href: "#features", label: "주요 기능" },
  { href: "#contribution", label: "내 기여" },
  { href: "#tech-stack", label: "기술 구조" },
  { href: "#learnings", label: "배운 점" },
];

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  return project
    ? { title: project.title, description: project.summary }
    : { title: "프로젝트를 찾을 수 없습니다" };
}

function MonitorIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect height="14" rx="2" stroke="currentColor" strokeWidth="1.5" width="20" x="2" y="3" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const detailSectionLinks = project.gallery?.length
    ? [
        sectionLinks[0],
        { href: "#gallery", label: "주요 화면" },
        ...sectionLinks.slice(1),
      ]
    : sectionLinks;

  return (
    <PageShell className={`project-case-page project-case-page-${project.slug}`}>
      <div className="project-case-layout">
        <aside className="project-case-sidebar">
          <Link className="project-case-list-link project-preview-detail-link" href="/projects">
            <span aria-hidden="true" className="project-preview-detail-arrow">
              <svg fill="none" viewBox="0 0 24 24">
                <path
                  d="M19 12H5M10 7l-5 5 5 5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <span>프로젝트 목록</span>
          </Link>

          <nav aria-label="프로젝트 상세 목차">
            <ul>
              {detailSectionLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="project-case-main">
          <header className="project-case-header" id="overview">
            <div className="project-case-heading">
              <div>
                <div className="project-case-title-row">
                  <h1>{project.title}</h1>
                  <span data-project-type={project.type}>
                    {projectTypeLabel[project.type]}
                  </span>
                </div>
                <p>{project.summary}</p>
              </div>

              <div className="project-case-actions">
                {project.githubUrl && (
                  <a href={project.githubUrl} rel="noreferrer" target="_blank">
                    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {project.demoUrl ? (
                  <a className="project-case-demo" href={project.demoUrl} rel="noreferrer" target="_blank">
                    <span aria-hidden="true">●</span>
                    Live Demo
                  </a>
                ) : project.demoPending ? (
                  <span
                    aria-disabled="true"
                    className="project-case-demo project-case-demo-pending"
                    title="배포 링크 준비 중"
                  >
                    <span aria-hidden="true">●</span>
                    Live Demo
                  </span>
                ) : null}
              </div>
            </div>
          </header>

          <section className="project-case-section project-case-overview">
            <h2>개요</h2>
            <p>{project.overview ?? project.summary}</p>
            <p>
              {projectTypeLabel[project.type]}로 {project.period} 동안 진행했으며, {project.role}을 담당했습니다.
            </p>
            {project.learningTopic && <p>학습 주제: {project.learningTopic}</p>}

            {project.thumbnail && project.lightThumbnail ? (
              <div className="project-case-theme-previews">
                {[
                  {
                    src: project.thumbnail,
                    label: "Dark mode",
                    alt: `${project.title} 다크 모드 메인 화면`,
                  },
                  {
                    src: project.lightThumbnail,
                    label: "Light mode",
                    alt: `${project.title} 화이트 모드 메인 화면`,
                  },
                ].map((image) => (
                  <figure key={image.src}>
                    <a href={image.src} rel="noreferrer" target="_blank">
                      <span className="project-case-theme-image">
                        <Image
                          alt={image.alt}
                          fill
                          priority
                          sizes="(max-width: 760px) 100vw, 430px"
                          src={image.src}
                        />
                      </span>
                    </a>
                    <figcaption>{image.label}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="project-case-hero">
                {project.thumbnail ? (
                  <Image
                    alt={`${project.title} 프로젝트 대표 화면`}
                    fill
                    priority
                    sizes="(max-width: 760px) 100vw, 900px"
                    src={project.thumbnail}
                  />
                ) : (
                  <div className="project-case-placeholder">
                    <MonitorIcon />
                    <strong>프로젝트 이미지 준비 중</strong>
                    <span>완성된 화면 캡처를 이곳에 추가할 예정입니다.</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {project.gallery && project.gallery.length > 0 && (
            <section className="project-case-section" id="gallery">
              <h2>주요 화면</h2>
              <p>
                페이지별 화면을 선택하면 원본 크기로 자세히 확인할 수 있습니다.
              </p>

              <ProjectGallery images={project.gallery} />
            </section>
          )}

          <section className="project-case-section" id="features">
            <h2>주요 기능</h2>
            {project.features.length > 0 ? (
              <div className="project-case-feature-list">
                {project.features.map((feature, index) => (
                  <article key={feature}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{feature}</h3>
                      <p>프로젝트에서 구현한 핵심 기능입니다.</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="project-case-empty">
                진행 중인 프로젝트로, 주요 기능은 개발 단계에 맞춰 추가할 예정입니다.
              </div>
            )}
          </section>

          <section className="project-case-section" id="contribution">
            <h2>내 기여</h2>
            <dl className="project-case-contribution">
              <div>
                <dt>담당 역할</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>개발 기간</dt>
                <dd>{project.period}</dd>
              </div>
              <div>
                <dt>진행 상태</dt>
                <dd>{projectStatusLabel[project.status]}</dd>
              </div>
            </dl>
          </section>

          <section className="project-case-section" id="tech-stack">
            <h2>기술 구조</h2>
            <div className="project-case-tech-list" aria-label="사용 기술">
              {project.techStack.map((technology) => (
                <span
                  data-tech={technology.toLowerCase().replace(/[^a-z0-9]/g, "")}
                  key={technology}
                >
                  {technology}
                </span>
              ))}
            </div>
          </section>

          <section className="project-case-section" id="learnings">
            <h2>배운 점</h2>
            <p>
              {project.learnings ??
                "프로젝트가 진행 중이며, 개발 과정에서 배운 내용을 완료 후 정리할 예정입니다."}
            </p>
          </section>
        </article>
      </div>
    </PageShell>
  );
}
