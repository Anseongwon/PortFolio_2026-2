'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type KeyboardEvent, useEffect, useState } from 'react'

import { projectTypeLabel } from '@/lib/project-labels'
import type { Project } from '@/types/project'

type ProjectsPanelProps = {
  projects: Project[]
}

export default function ProjectsPanel({ projects: initialProjects }: ProjectsPanelProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [selectedSlug, setSelectedSlug] = useState(initialProjects[0]?.slug ?? '')
  const matchedIndex = projects.findIndex((project) => project.slug === selectedSlug)
  const selectedIndex = matchedIndex >= 0 ? matchedIndex : 0
  const selectedProject = projects[selectedIndex]

  useEffect(() => {
    const controller = new AbortController()

    async function loadStoredProjects() {
      try {
        const response = await fetch('/api/projects', {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) return

        const data = (await response.json()) as { projects?: Project[] }
        if (data.projects?.length) setProjects(data.projects)
      } catch {
        // The bundled project list remains usable during a database outage.
      }
    }

    void loadStoredProjects()
    return () => controller.abort()
  }, [])

  if (!selectedProject) {
    return (
      <section className="glass-surface projects-panel projects-panel-empty">
        <p>등록된 프로젝트가 없습니다.</p>
      </section>
    )
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return
    }

    event.preventDefault()
    const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (selectedIndex + direction + projects.length) % projects.length
    const nextProject = projects[nextIndex]

    setSelectedSlug(nextProject.slug)
    document.getElementById(`project-tab-${nextProject.slug}`)?.focus()
  }

  return (
    <section
      aria-label="프로젝트 선택 패널"
      className="glass-surface projects-panel projects-panel-compact"
    >
      <div className="projects-selector" aria-label="프로젝트 목록" role="tablist">
        {projects.map((project, index) => {
          const isSelected = project.slug === selectedProject.slug

          return (
            <button
              aria-controls={`project-panel-${project.slug}`}
              aria-selected={isSelected}
              className={`project-selector-button ${isSelected ? 'project-selector-button-active' : ''}`}
              id={`project-tab-${project.slug}`}
              key={project.slug}
              onClick={() => setSelectedSlug(project.slug)}
              onKeyDown={handleTabKeyDown}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
            >
              <span className="project-selector-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="project-selector-copy">
                <strong>{project.title}</strong>
                <small>{projectTypeLabel[project.type]}</small>
              </span>
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path
                  d="m9 5 7 7-7 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          )
        })}
      </div>

      <article
        aria-labelledby={`project-title-${selectedProject.slug}`}
        className="project-detail-panel project-preview-panel"
        id={`project-panel-${selectedProject.slug}`}
        key={selectedProject.slug}
        role="tabpanel"
      >
        <div className="project-screenshot">
          {selectedProject.thumbnail ? (
            <Image
              alt={`${selectedProject.title} 프로젝트 화면`}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 720px"
              src={selectedProject.thumbnail}
            />
          ) : (
            <div className="project-screenshot-placeholder">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <rect height="15" rx="2" stroke="currentColor" strokeWidth="1.5" width="20" x="2" y="3" />
                <path d="M8 21h8M12 18v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
              <span>프로젝트 이미지 준비 중</span>
            </div>
          )}
        </div>

        <div className="project-preview-info">
          <span
            className="project-type-badge"
            data-project-type={selectedProject.type}
          >
            {projectTypeLabel[selectedProject.type]}
          </span>

          <h2 id={`project-title-${selectedProject.slug}`}>
            {selectedProject.title}
          </h2>
          <p>{selectedProject.summary}</p>

          <div className="project-tech-list" aria-label="사용 기술">
            {selectedProject.techStack.map((technology) => (
              <span
                data-tech={technology.toLowerCase().replace(/[^a-z0-9]/g, '')}
                key={technology}
              >
                {technology}
              </span>
            ))}
          </div>

          <Link className="project-preview-detail-link" href={`/projects/${selectedProject.slug}`}>
            <span>자세히 보기</span>
            <span aria-hidden="true" className="project-preview-detail-arrow">
              <svg fill="none" viewBox="0 0 24 24">
                <path
                  d="M5 12h14M14 7l5 5-5 5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
          </Link>
        </div>
      </article>
    </section>
  )
}
