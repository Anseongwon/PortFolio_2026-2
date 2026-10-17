import Link from "next/link";

import { projectStatusLabel, projectTypeLabel } from "@/lib/project-labels";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <p className="project-status">{projectStatusLabel[project.status]}</p>

      <h2>{project.title}</h2>
      <p>{project.summary}</p>

      <dl>
        <div>
          <dt>구분</dt>
          <dd>{projectTypeLabel[project.type]}</dd>
        </div>
        <div>
          <dt>기간</dt>
          <dd>{project.period}</dd>
        </div>
        <div>
          <dt>담당 역할</dt>
          <dd>{project.role}</dd>
        </div>
      </dl>

      <section aria-label={`${project.title} 사용 기술`}>
        <h3>사용 기술</h3>
        <ul>
          {project.techStack.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </section>

      <div className="project-links">
        <Link href={`/projects/${project.slug}`}>상세 보기</Link>
        {project.githubUrl && (
          <a href={project.githubUrl} rel="noreferrer" target="_blank">
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} rel="noreferrer" target="_blank">
            배포 사이트
          </a>
        )}
      </div>
    </article>
  );
}
