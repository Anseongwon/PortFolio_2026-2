import "server-only";

import { timingSafeEqual } from "node:crypto";

export function isGuestbookAdmin(request: Request) {
  const configuredKey = process.env.GUESTBOOK_ADMIN_KEY;
  const providedKey = request.headers.get("x-admin-key");

  if (!configuredKey || !providedKey) return false;

  const configured = Buffer.from(configuredKey);
  const provided = Buffer.from(providedKey);

  return configured.length === provided.length && timingSafeEqual(configured, provided);
}

export function adminErrorResponse() {
  if (!process.env.GUESTBOOK_ADMIN_KEY) {
    return Response.json(
      { message: "GUESTBOOK_ADMIN_KEY 환경변수를 먼저 설정해주세요." },
      { status: 503 },
    );
  }

  return Response.json({ message: "관리자 키가 올바르지 않습니다." }, { status: 401 });
}
