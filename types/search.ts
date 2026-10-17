export type SearchPage = "about" | "projects" | "issues" | "home";

export type SearchDocument = {
  id: string;
  page: SearchPage;
  pageLabel: string;
  title: string;
  section: string;
  content: string;
  keywords: string[];
  url: string;
  isPublic: boolean;
};

export type SearchSuggestion = {
  id: string;
  label: string;
};

export type SearchResult = Pick<
  SearchDocument,
  "id" | "page" | "pageLabel" | "title" | "section" | "url"
> & {
  snippet: string;
  matchReason: string;
};

export type SearchResponse = {
  query: string;
  suggestions: SearchSuggestion[];
  results: SearchResult[];
  total: number;
};
