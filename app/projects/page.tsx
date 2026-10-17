import AmbientBackground from '@/components/layout/AmbientBackground'
import ProjectsPanel from '@/components/projects/ProjectsPanel'

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <AmbientBackground />

      <header className="projects-page-heading">
        <h1>Projects</h1>
        <p>지금까지 진행한 프로젝트</p>
      </header>

      <ProjectsPanel />
    </main>
  )
}
