import type { SearchDocument, SearchResponse, SearchResult } from "@/types/search";

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR");
}

function createSnippet(content: string, query: string) {
  const normalizedContent = normalize(content);
  const normalizedQuery = normalize(query);
  const matchIndex = normalizedContent.indexOf(normalizedQuery);

  if (matchIndex < 0) {
    return content.length > 120 ? `${content.slice(0, 117)}...` : content;
  }

  const start = Math.max(0, matchIndex - 42);
  const end = Math.min(content.length, matchIndex + query.length + 72);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < content.length ? "..." : "";

  return `${prefix}${content.slice(start, end)}${suffix}`;
}

function scoreDocument(document: SearchDocument, query: string) {
  const normalizedQuery = normalize(query);
  const title = normalize(document.title);
  const section = normalize(document.section);
  const content = normalize(document.content);
  const keywords = document.keywords.map(normalize);

  if (title === normalizedQuery) return { score: 500, reason: "제목 일치" };
  if (title.includes(normalizedQuery)) return { score: 400, reason: "제목 일부 일치" };
  if (section.includes(normalizedQuery)) return { score: 350, reason: "항목 일치" };
  if (keywords.some((keyword) => keyword === normalizedQuery)) {
    return { score: 300, reason: "키워드 일치" };
  }
  if (keywords.some((keyword) => keyword.includes(normalizedQuery))) {
    return { score: 250, reason: "키워드 일부 일치" };
  }
  if (content.includes(normalizedQuery)) return { score: 150, reason: "본문 일치" };

  return null;
}

export function searchDocuments(documents: SearchDocument[], rawQuery: string): SearchResponse {
  const query = rawQuery.trim();

  if (!query) {
    return { query: "", suggestions: [], results: [], total: 0 };
  }

  const scoredResults = documents
    .filter((document) => document.isPublic)
    .map((document) => {
      const match = scoreDocument(document, query);
      return match ? { document, ...match } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title, "ko"));

  const results: SearchResult[] = scoredResults.map(({ document, reason }) => ({
    id: document.id,
    page: document.page,
    pageLabel: document.pageLabel,
    title: document.title,
    section: document.section,
    snippet: createSnippet(document.content, query),
    matchReason: reason,
    url: document.url,
  }));

  const candidateLabels = documents.flatMap((document) => [
    document.title,
    document.section,
    ...document.keywords,
  ]);
  const seen = new Set<string>();
  const normalizedQuery = normalize(query);
  const suggestions = candidateLabels
    .filter((label) => normalize(label).includes(normalizedQuery))
    .filter((label) => {
      const key = normalize(label);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 7)
    .map((label, index) => ({ id: `suggestion-${index}-${label}`, label }));

  return { query, suggestions, results, total: results.length };
}
