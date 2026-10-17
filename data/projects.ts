import type { Project } from "@/types/project";

const projectItems: Project[] = [
  {
    slug: "neocore",
    title: "NeoCore",
    summary:
      "AI 개념 설명과 간단한 게임, 딥러닝 모델을 활용한 유해 콘텐츠 필터링을 제공하는 웹사이트입니다.",
    type: "team",
    status: "completed",
    startedAt: "2026-04-01",
    period: "2026.04 - 2026.06",
    role: "AI의 실생활 페이지, 다크 모드, 틱택토와 숫자 맞히기 게임 구현",
    techStack: ["HTML", "CSS", "JavaScript"],
    features: [
      "AI 개념과 실생활 활용 사례 소개",
      "틱택토와 숫자 맞히기 게임",
      "딥러닝 모델을 활용한 유해 콘텐츠 필터링",
      "다크 모드와 모바일 반응형 레이아웃",
    ],
    learnings:
      "기본적인 웹사이트 구성과 AI 활용 방법을 익히고, JavaScript로 페이지의 동작과 사용자 상호작용을 구현했습니다.",
    thumbnail: "/images/projects/neocore/home.png",
    gallery: [
      {
        src: "/images/projects/neocore/theory.png",
        title: "AI 이론 페이지",
        alt: "AI 역사와 보안, 생활 속 AI와 생성형 AI를 소개하는 NeoCore AI 이론 페이지",
      },
      {
        src: "/images/projects/neocore/game-tictactoe.png",
        title: "틱택토 게임",
        alt: "AI 판단 원리를 체험하는 NeoCore 틱택토 게임 페이지",
      },
      {
        src: "/images/projects/neocore/game-number.png",
        title: "숫자 맞히기 게임",
        alt: "조건 비교 방식으로 숫자를 맞히는 NeoCore 숫자 맞히기 게임 페이지",
      },
      {
        src: "/images/projects/neocore/tips.png",
        title: "AI 사용법 페이지",
        alt: "AI 활용 공부법과 주의사항을 소개하는 NeoCore AI 사용법 페이지",
      },
      {
        src: "/images/projects/neocore/scanner.png",
        title: "AI 탐지기 페이지",
        alt: "딥러닝 모델로 유해 콘텐츠를 분석하는 NeoCore AI 탐지기 페이지",
      },
    ],
    githubUrl: "https://github.com/Anseongwon/2026_AI_Team_Final",
    demoUrl: "https://2026-ai-team-final.vercel.app/",
  },
  {
    slug: "my-portfolio",
    title: "MyPortfolio",
    summary:
      "HTML, CSS, JavaScript를 사용해 나의 소개와 프로젝트를 보여주는 개인 포트폴리오 웹사이트입니다.",
    type: "personal",
    status: "completed",
    startedAt: "2026-04-01",
    period: "2026.04 - 2026.06",
    role: "기획, 디자인, 개발을 포함한 전체 페이지 제작",
    techStack: ["HTML", "CSS", "JavaScript"],
    features: [
      "다크 모드와 모바일 반응형 레이아웃",
      "Flexbox와 Grid를 활용한 페이지 구성",
      "컴퓨터 아이콘을 클릭해 소개, 기술, 목표를 확인하는 인터랙션",
      "공책 형태의 프로젝트 화면과 이전·다음 페이지 이동",
    ],
    learnings:
      "반응형 웹 디자인의 기본 원리와 JavaScript 함수를 활용한 다양한 사용자 상호작용을 배웠습니다.",
    thumbnail: "/images/projects/my-portfolio/home.png",
    lightThumbnail: "/images/projects/my-portfolio/home-light.png",
    gallery: [
      {
        src: "/images/projects/my-portfolio/about.png",
        title: "About 페이지",
        alt: "컴퓨터 바탕화면 콘셉트로 구성한 MyPortfolio About 페이지",
      },
      {
        src: "/images/projects/my-portfolio/projects.png",
        title: "Projects 페이지",
        alt: "공책 형태로 프로젝트를 소개하는 MyPortfolio Projects 페이지",
      },
      {
        src: "/images/projects/my-portfolio/contact.png",
        title: "Contact 페이지",
        alt: "메시지 입력 폼과 소셜 링크로 구성한 MyPortfolio Contact 페이지",
      },
    ],
    githubUrl: "https://github.com/Anseongwon/2026_Portfolio-Final",
    demoUrl: "https://2026-portfolio-final.vercel.app/",
  },
  {
    slug: "marketplace",
    title: "거래소",
    summary: "사용자가 물품을 등록하고 거래할 수 있는 중고 거래 웹사이트입니다.",
    type: "team",
    status: "in-progress",
    startedAt: "2026-10-01",
    period: "2026.10 - 진행 중",
    role: "백엔드 개발",
    techStack: ["HTML", "CSS", "Next.js", "React", "MongoDB"],
    features: [],
    githubUrl: "https://github.com/anty9915-sudo/reown",
  },
];

export const projects = [...projectItems].sort((a, b) =>
  b.startedAt.localeCompare(a.startedAt),
);
