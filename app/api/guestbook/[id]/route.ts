import { isValidObjectId } from "mongoose";

import { adminErrorResponse, isGuestbookAdmin } from "@/lib/guestbook-admin";
import {
  deleteGuestbookMessage,
  getGuestbookMessage,
  updateGuestbookMessageState,
} from "@/lib/guestbook";
import { isDatabaseUnavailableError } from "@/lib/mongodb";

type GuestbookRouteContext = { params: Promise<{ id: string }> };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failureResponse(error: unknown, message: string) {
  if (isDatabaseUnavailableError(error)) {
    return Response.json(
      { message: "데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요." },
      { status: 503 },
    );
  }
  return Response.json({ message }, { status: 500 });
}

function invalidIdResponse() {
  return Response.json({ message: "올바르지 않은 메시지입니다." }, { status: 400 });
}

function missingMessageResponse() {
  return Response.json({ message: "메시지를 찾을 수 없습니다." }, { status: 404 });
}

export async function GET(_request: Request, context: GuestbookRouteContext) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) return invalidIdResponse();

  try {
    const message = await getGuestbookMessage(id);
    return message ? Response.json({ message }) : missingMessageResponse();
  } catch (error) {
    return failureResponse(error, "메시지를 불러오지 못했습니다.");
  }
}

export async function PATCH(request: Request, context: GuestbookRouteContext) {
  if (!isGuestbookAdmin(request)) return adminErrorResponse();

  const { id } = await context.params;
  if (!isValidObjectId(id)) return invalidIdResponse();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const update: { isPinned?: boolean; isFavorite?: boolean } = {};
    if (typeof body.isPinned === "boolean") update.isPinned = body.isPinned;
    if (typeof body.isFavorite === "boolean") update.isFavorite = body.isFavorite;

    if (Object.keys(update).length === 0) {
      return Response.json(
        { message: "변경할 상태가 없습니다." },
        { status: 400 },
      );
    }

    const message = await updateGuestbookMessageState(id, update);
    return message ? Response.json({ message }) : missingMessageResponse();
  } catch (error) {
    return failureResponse(error, "상태를 변경하지 못했습니다.");
  }
}

export async function DELETE(request: Request, context: GuestbookRouteContext) {
  if (!isGuestbookAdmin(request)) return adminErrorResponse();

  const { id } = await context.params;
  if (!isValidObjectId(id)) return invalidIdResponse();

  try {
    return (await deleteGuestbookMessage(id))
      ? Response.json({ deleted: true })
      : missingMessageResponse();
  } catch (error) {
    return failureResponse(error, "메시지를 삭제하지 못했습니다.");
  }
}
