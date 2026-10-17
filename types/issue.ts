export type Issue = {
  issueNumber: string;
  slug: string;
  title: string;
  summary: string;
  projectSlug: string;
  category: "ui" | "data" | "server" | "deployment" | "design" | "collaboration";
  difficulty: "easy" | "medium" | "hard";
  status: "resolved" | "partial" | "unresolved";
};
