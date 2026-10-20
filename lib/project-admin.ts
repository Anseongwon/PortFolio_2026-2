import "server-only";

import { timingSafeEqual } from "node:crypto";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function isProjectAdmin(request: Request) {
  const configuredKey = process.env.GUESTBOOK_ADMIN_KEY?.trim();
  const suppliedKey = request.headers.get("x-admin-key")?.trim();

  return Boolean(
    configuredKey && suppliedKey && safeEqual(configuredKey, suppliedKey),
  );
}
