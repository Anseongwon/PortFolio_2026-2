import GuestbookBoard from "@/components/guestbook/GuestbookBoard";
import PageShell from "@/components/layout/PageShell";

export default function GuestbookPage() {
  return (
    <PageShell className="guestbook-page">
      <GuestbookBoard />
    </PageShell>
  );
}
