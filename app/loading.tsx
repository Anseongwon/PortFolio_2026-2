import PageShell from "@/components/layout/PageShell";

export default function Loading() {
  return (
    <PageShell className="route-loading-page">
      <section aria-label="페이지를 불러오는 중" className="route-loading-card">
        <span className="route-loading-spinner" />
        <strong>페이지를 불러오는 중입니다.</strong>
      </section>
    </PageShell>
  );
}
