import {
  getAboutImpressionResults,
  voteForAboutImpression,
} from "@/lib/about-impressions";
import { ABOUT_IMPRESSION_OPTIONS } from "@/data/about-impressions";
import { isDatabaseUnavailableError } from "@/lib/mongodb";

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

export async function GET() {
  try {
    return Response.json(await getAboutImpressionResults());
  } catch (error) {
    return failureResponse(error, "첫인상 투표 결과를 불러오지 못했습니다.");
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { key?: unknown };
    const key = typeof body.key === "string" ? body.key : "";
    const selected = ABOUT_IMPRESSION_OPTIONS.find(
      (option) => option.key === key,
    );

    if (!selected) {
      return Response.json(
        { message: "올바른 항목을 선택해주세요." },
        { status: 400 },
      );
    }

    return Response.json(await voteForAboutImpression(selected.key));
  } catch (error) {
    return failureResponse(error, "투표를 저장하지 못했습니다.");
  }
}
