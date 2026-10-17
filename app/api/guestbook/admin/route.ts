import { adminErrorResponse, isGuestbookAdmin } from "@/lib/guestbook-admin";

export async function POST(request: Request) {
  if (!isGuestbookAdmin(request)) return adminErrorResponse();
  return Response.json({ authenticated: true });
}
