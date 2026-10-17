import { isValidObjectId } from "mongoose";

import { adminErrorResponse, isGuestbookAdmin } from "@/lib/guestbook-admin";
import { serializeGuestbookMessage } from "@/lib/guestbook-helpers";
import { connectToDatabase } from "@/lib/mongodb";
import GuestbookMessage from "@/models/GuestbookMessage";

type GuestbookRouteContext = { params: Promise<{ id: string }> };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: GuestbookRouteContext) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return Response.json({ message: "올바르지 않은 메시지입니다." }, { status: 400 });
  }

  try {
    const connection = await connectToDatabase();
    if (!connection) return Response.json({ message: "MongoDB 연결 정보가 없습니다." }, { status: 503 });

    const message = await GuestbookMessage.findById(id).lean();
    if (!message) return Response.json({ message: "메시지를 찾을 수 없습니다." }, { status: 404 });

    return Response.json({
      message: serializeGuestbookMessage(message as unknown as Record<string, unknown>),
    });
  } catch {
    return Response.json({ message: "메시지를 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: GuestbookRouteContext) {
  if (!isGuestbookAdmin(request)) return adminErrorResponse();

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return Response.json({ message: "올바르지 않은 메시지입니다." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const update: Record<string, boolean> = {};
    if (typeof body.isPinned === "boolean") update.isPinned = body.isPinned;
    if (typeof body.isFavorite === "boolean") update.isFavorite = body.isFavorite;

    if (Object.keys(update).length === 0) {
      return Response.json({ message: "변경할 상태가 없습니다." }, { status: 400 });
    }

    await connectToDatabase();
    const message = await GuestbookMessage.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!message) return Response.json({ message: "메시지를 찾을 수 없습니다." }, { status: 404 });

    return Response.json({
      message: serializeGuestbookMessage(message as unknown as Record<string, unknown>),
    });
  } catch {
    return Response.json({ message: "상태를 변경하지 못했습니다." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: GuestbookRouteContext) {
  if (!isGuestbookAdmin(request)) return adminErrorResponse();

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return Response.json({ message: "올바르지 않은 메시지입니다." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const deleted = await GuestbookMessage.findByIdAndDelete(id);
    if (!deleted) return Response.json({ message: "메시지를 찾을 수 없습니다." }, { status: 404 });
    return Response.json({ deleted: true });
  } catch {
    return Response.json({ message: "메시지를 삭제하지 못했습니다." }, { status: 500 });
  }
}
