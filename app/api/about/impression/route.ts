import { connectToDatabase } from "@/lib/mongodb";
import AboutImpression from "@/models/AboutImpression";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const impressionOptions = [
  { key: "steady", label: "꾸준함" },
  { key: "sincere", label: "성실함" },
  { key: "curious", label: "호기심" },
  { key: "calm", label: "차분함" },
  { key: "collaborative", label: "협업" },
] as const;

async function ensureImpressions() {
  await AboutImpression.bulkWrite(
    impressionOptions.map((option, index) => ({
      updateOne: {
        filter: { key: option.key },
        update: {
          $set: { label: option.label, sortOrder: index + 1 },
          $setOnInsert: { votes: 0 },
        },
        upsert: true,
      },
    })),
  );
}

async function getResults() {
  const options = await AboutImpression.find({
    key: { $in: impressionOptions.map((option) => option.key) },
  })
    .sort({ sortOrder: 1 })
    .select({ _id: 0, key: 1, label: 1, votes: 1 })
    .lean<Array<{ key: string; label: string; votes: number }>>();

  const total = options.reduce((sum, option) => sum + option.votes, 0);
  return { options, total };
}

export async function GET() {
  try {
    const connection = await connectToDatabase();
    if (!connection) {
      return Response.json({ message: "MongoDB 연결 정보가 없습니다." }, { status: 503 });
    }

    await ensureImpressions();
    return Response.json(await getResults());
  } catch {
    return Response.json(
      { message: "첫인상 투표 결과를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { key?: unknown };
    const key = typeof body.key === "string" ? body.key : "";
    const selected = impressionOptions.find((option) => option.key === key);

    if (!selected) {
      return Response.json({ message: "올바른 항목을 선택해주세요." }, { status: 400 });
    }

    const connection = await connectToDatabase();
    if (!connection) {
      return Response.json({ message: "MongoDB 연결 정보가 없습니다." }, { status: 503 });
    }

    await ensureImpressions();
    await AboutImpression.updateOne({ key }, { $inc: { votes: 1 } });
    return Response.json(await getResults());
  } catch {
    return Response.json({ message: "투표를 저장하지 못했습니다." }, { status: 500 });
  }
}
