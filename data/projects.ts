import type { Project } from "@/types/project";

const projectItems: Project[] = [
  {
    slug: "my-app",
    title: "my-app",
    summary:
      "Next.js, React, MongoDB를 활용해 상품 게시, 공지사항, 사용자 인증 기능을 구현한 웹 개발 수업 실습 프로젝트입니다.",
    type: "personal",
    status: "in-progress",
    startedAt: "2026-09-01",
    period: "2026.09 - 2026.10",
    role: "수업에서 학습한 내용을 바탕으로 전체 기능을 개인 구현",
    techStack: ["Next.js", "React", "MongoDB", "GitHub"],
    features: [
      "상품 등록 및 목록 조회",
      "좋아요 클릭 결과의 실시간 화면 반영",
      "공지사항 작성 및 게시",
      "회원가입과 로그인 기반 사용자 인증",
    ],
    learnings:
      "인증과 인가의 차이, 세션과 JWT 기반 인증 흐름을 이해하고 MongoDB를 활용한 데이터 생성·조회·수정·삭제(CRUD)를 실습했습니다. 또한 사용자 동작에 따라 변경된 데이터를 화면에 즉시 반영하는 방법을 익혔습니다.",
    thumbnail: "/images/projects/my-app/home.png",
    gallery: [
      {
        src: "/images/projects/my-app/products.png",
        title: "상품 목록 페이지",
        alt: "상품명과 설명, 좋아요 수를 카드 목록으로 보여주는 my-app 상품 페이지",
      },
      {
        src: "/images/projects/my-app/notices.png",
        title: "공지사항 페이지",
        alt: "작성자와 작성일을 포함한 공지사항 목록을 보여주는 my-app 공지사항 페이지",
      },
      {
        src: "/images/projects/my-app/notice-create.png",
        title: "새 공지 작성 페이지",
        alt: "제목과 작성자, 내용을 입력해 공지사항을 등록하는 my-app 작성 페이지",
      },
      {
        src: "/images/projects/my-app/login.png",
        title: "로그인 페이지",
        alt: "이메일과 비밀번호를 입력하는 my-app 로그인 페이지",
      },
      {
        src: "/images/projects/my-app/register.png",
        title: "회원가입 페이지",
        alt: "이름과 이메일, 비밀번호를 입력하는 my-app 회원가입 페이지",
      },
    ],
    githubUrl: "https://github.com/Anseongwon/my-app_2026-2",
    demoUrl: "https://my-app2026-2.vercel.app/",
  },
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
