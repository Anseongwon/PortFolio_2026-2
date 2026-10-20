import PageHeading from "@/components/layout/PageHeading";
import PageShell from "@/components/layout/PageShell";

export default function IssuesPage() {
  return (
    <PageShell className="projects-page issues-page">
      <PageHeading
        description="문제를 발견하고, 고민하고, 해결한 과정들"
        title="Dev Issues"
      />
    </PageShell>
  );
}
