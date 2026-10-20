import { GUESTBOOK_LIMITS, GUESTBOOK_TAGS } from "@/data/guestbook";
import {
  createGuestbookMessage,
  getGuestbookMessages,
} from "@/lib/guestbook";
import { cleanText, parseTags } from "@/lib/guestbook-helpers";
import { isDatabaseUnavailableError } from "@/lib/mongodb";
import type { GuestbookSort, GuestbookTag } from "@/types/guestbook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function databaseErrorResponse(error: unknown) {
  if (isDatabaseUnavailableError(error)) {
    return Response.json(
      { message: "데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요." },
      { status: 503 },
    );
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const sortParam = searchParams.get("sort");
    const sort: GuestbookSort =
      sortParam === "oldest" || sortParam === "favorite"
        ? sortParam
        : "latest";
    const tagParam = searchParams.get("tag");
    const tag =
      tagParam && GUESTBOOK_TAGS.includes(tagParam as GuestbookTag)
        ? (tagParam as GuestbookTag)
        : undefined;
    const query = cleanText(searchParams.get("q")).slice(0, 60);

    return Response.json(
      await getGuestbookMessages({ sort, tag, query }),
    );
  } catch (error) {
    return (
      databaseErrorResponse(error) ??
      Response.json(
        { message: "방명록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      )
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const nickname = cleanText(body.nickname);
    const content = cleanText(body.content);
    const tags = parseTags(body.tags);

    if (!nickname || nickname.length > GUESTBOOK_LIMITS.nickname) {
      return Response.json(
        { message: `닉네임은 1~${GUESTBOOK_LIMITS.nickname}자로 입력해주세요.` },
        { status: 400 },
      );
    }

    if (!content || content.length > GUESTBOOK_LIMITS.content) {
      return Response.json(
        { message: `메시지는 1~${GUESTBOOK_LIMITS.content}자로 입력해주세요.` },
        { status: 400 },
      );
    }

    const message = await createGuestbookMessage({ nickname, content, tags });
    return Response.json({ message }, { status: 201 });
  } catch (error) {
    return (
      databaseErrorResponse(error) ??
      Response.json(
        { message: "메시지를 저장하지 못했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      )
    );
  }
}
