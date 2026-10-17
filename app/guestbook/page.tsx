import GuestbookBoard from "@/components/guestbook/GuestbookBoard";
import AmbientBackground from "@/components/layout/AmbientBackground";

export default function GuestbookPage() {
  return (
    <main className="guestbook-page">
      <AmbientBackground />
      <GuestbookBoard />
    </main>
  );
}
