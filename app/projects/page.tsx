import PageHeading from '@/components/layout/PageHeading'
import PageShell from '@/components/layout/PageShell'
import ProjectCreateButton from '@/components/projects/ProjectCreateButton'
import ProjectsPanel from '@/components/projects/ProjectsPanel'
import { projects } from '@/data/projects'

export default function ProjectsPage() {
  return (
    <PageShell className="projects-page">
      <div className="projects-page-toolbar">
        <PageHeading description="지금까지 진행한 프로젝트" title="Projects" />
        <ProjectCreateButton />
      </div>

      <ProjectsPanel projects={projects} />
    </PageShell>
  )
}
