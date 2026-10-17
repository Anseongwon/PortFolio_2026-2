import { getSearchDocuments } from "@/lib/search-data";
import { searchDocuments } from "@/lib/search-engine";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length > 100) {
    return Response.json(
      { message: "검색어는 100자 이하로 입력해주세요." },
      { status: 400 },
    );
  }

  if (!query) {
    return Response.json({ query: "", suggestions: [], results: [], total: 0 });
  }

  try {
    const documents = await getSearchDocuments();
    return Response.json(searchDocuments(documents, query));
  } catch {
    return Response.json(
      { message: "검색 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
