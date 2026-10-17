import type { Project } from "@/types/project";

export const projectTypeLabel: Record<Project["type"], string> = {
  team: "팀 프로젝트",
  personal: "개인 프로젝트",
};

export const projectStatusLabel: Record<Project["status"], string> = {
  completed: "완료",
  "in-progress": "진행 중",
};
