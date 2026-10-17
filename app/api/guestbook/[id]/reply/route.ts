import { isValidObjectId } from "mongoose";

import { GUESTBOOK_LIMITS } from "@/data/guestbook";
import { adminErrorResponse, isGuestbookAdmin } from "@/lib/guestbook-admin";
import { cleanText, serializeGuestbookMessage } from "@/lib/guestbook-helpers";
import { connectToDatabase } from "@/lib/mongodb";
import GuestbookMessage from "@/models/GuestbookMessage";

type GuestbookReplyRouteContext = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function POST(request: Request, context: GuestbookReplyRouteContext) {
  if (!isGuestbookAdmin(request)) return adminErrorResponse();

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return Response.json({ message: "올바르지 않은 메시지입니다." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const content = cleanText(body.content);

    if (!content || content.length > GUESTBOOK_LIMITS.reply) {
      return Response.json(
        { message: `답장은 1~${GUESTBOOK_LIMITS.reply}자로 입력해주세요.` },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const message = await GuestbookMessage.findByIdAndUpdate(
      id,
      { $push: { replies: { content, isAdmin: true, createdAt: new Date() } } },
      { new: true },
    ).lean();

    if (!message) return Response.json({ message: "메시지를 찾을 수 없습니다." }, { status: 404 });

    return Response.json({
      message: serializeGuestbookMessage(message as unknown as Record<string, unknown>),
    });
  } catch {
    return Response.json({ message: "답장을 저장하지 못했습니다." }, { status: 500 });
  }
}
