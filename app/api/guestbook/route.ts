import { GUESTBOOK_LIMITS, GUESTBOOK_TAGS } from "@/data/guestbook";
import { assignGuestbookAppearance } from "@/lib/guestbook-appearance";
import { cleanText, parseTags, serializeGuestbookMessage } from "@/lib/guestbook-helpers";
import { connectToDatabase } from "@/lib/mongodb";
import GuestbookMessage from "@/models/GuestbookMessage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const connection = await connectToDatabase();
    if (!connection) {
      return Response.json({ message: "MongoDB 연결 정보가 없습니다." }, { status: 503 });
    }

    const searchParams = new URL(request.url).searchParams;
    const sortParam = searchParams.get("sort");
    const sort = sortParam === "oldest" ? 1 : -1;
    const tag = searchParams.get("tag");
    const query = cleanText(searchParams.get("q")).slice(0, 60);
    const filter: Record<string, unknown> = {};

    if (sortParam === "favorite") {
      filter.isFavorite = true;
    }

    if (tag && GUESTBOOK_TAGS.includes(tag as (typeof GUESTBOOK_TAGS)[number])) {
      filter.tags = tag;
    }

    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { nickname: { $regex: escaped, $options: "i" } },
        { content: { $regex: escaped, $options: "i" } },
      ];
    }

    const [messages, total] = await Promise.all([
      GuestbookMessage.find(filter).sort({ isPinned: -1, createdAt: sort }).lean(),
      GuestbookMessage.countDocuments({}),
    ]);

    return Response.json({
      messages: messages.map((message) =>
        serializeGuestbookMessage(message as unknown as Record<string, unknown>),
      ),
      total,
    });
  } catch {
    return Response.json(
      { message: "방명록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
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

    const connection = await connectToDatabase();
    if (!connection) {
      return Response.json({ message: "MongoDB 연결 정보가 없습니다." }, { status: 503 });
    }

    const appearance = await assignGuestbookAppearance();
    const message = await GuestbookMessage.create({ nickname, content, tags, ...appearance });
    return Response.json(
      { message: serializeGuestbookMessage(message.toObject()) },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { message: "메시지를 저장하지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
