"use client";

import { type FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function commaList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function galleryList(value: FormDataEntryValue | null) {
  return lines(value).flatMap((line) => {
    const [title, src, alt] = line.split("|").map((item) => item.trim());
    return title && src && alt ? [{ title, src, alt }] : [];
  });
}

export default function ProjectCreateButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
    const payload = {
      slug,
      title: formData.get("title"),
      summary: formData.get("summary"),
      type: formData.get("type"),
      status: formData.get("status"),
      startedAt: formData.get("startedAt"),
      period: formData.get("period"),
      learningTopic: formData.get("learningTopic"),
      role: formData.get("role"),
      overview: formData.get("overview"),
      techStack: commaList(formData.get("techStack")),
      features: lines(formData.get("features")),
      learnings: formData.get("learnings"),
      thumbnail: formData.get("thumbnail"),
      lightThumbnail: formData.get("lightThumbnail"),
      gallery: galleryList(formData.get("gallery")),
      githubUrl: formData.get("githubUrl"),
      demoUrl: formData.get("demoUrl"),
      demoPending: formData.get("demoPending") === "on",
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": String(formData.get("adminKey") ?? ""),
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "프로젝트를 등록하지 못했습니다.");
        return;
      }

      form.reset();
      setIsOpen(false);
      router.push(`/projects/${slug}`);
      router.refresh();
    } catch {
      setMessage("서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        aria-label="프로젝트 추가"
        className="project-create-open-button"
        onClick={() => {
          setMessage("");
          setIsOpen(true);
        }}
        title="프로젝트 추가"
        type="button"
      >
        <span aria-hidden="true">+</span>
      </button>

      {isOpen && typeof document !== "undefined" && createPortal((
        <div
          className="project-create-overlay"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsOpen(false);
          }}
        >
          <section
            aria-labelledby="project-create-title"
            aria-modal="true"
            className="project-create-modal"
            role="dialog"
          >
            <header>
              <h2 id="project-create-title">새 프로젝트 추가</h2>
              <button
                aria-label="프로젝트 추가 창 닫기"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ×
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>기본 정보</legend>
                <div className="project-create-grid">
                  <label>
                    프로젝트 이름 <span>*</span>
                    <input maxLength={80} name="title" required />
                  </label>
                  <label>
                    주소 이름 <span>*</span>
                    <input
                      maxLength={80}
                      name="slug"
                      pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                      placeholder="예: my-new-project"
                      required
                    />
                    <small>영문 소문자·숫자·하이픈만 입력</small>
                  </label>
                  <label>
                    프로젝트 구분 <span>*</span>
                    <select defaultValue="personal" name="type">
                      <option value="personal">개인 프로젝트</option>
                      <option value="team">팀 프로젝트</option>
                    </select>
                  </label>
                  <label>
                    진행 상태 <span>*</span>
                    <select defaultValue="in-progress" name="status">
                      <option value="in-progress">진행 중</option>
                      <option value="completed">완료</option>
                    </select>
                  </label>
                  <label>
                    시작일 <span>*</span>
                    <input name="startedAt" required type="date" />
                    <small>최신 프로젝트 정렬 기준</small>
                  </label>
                  <label>
                    진행 기간 <span>*</span>
                    <input name="period" placeholder="2026.09 - 2026.10" required />
                  </label>
                </div>
                <label>
                  수업명 또는 학습 주제
                  <input name="learningTopic" placeholder="Next.js, React 기반 웹 개발" />
                </label>
                <label>
                  짧은 소개 <span>*</span>
                  <textarea maxLength={300} name="summary" required rows={3} />
                </label>
                <label>
                  상세 개요
                  <textarea maxLength={1500} name="overview" rows={5} />
                </label>
              </fieldset>

              <fieldset>
                <legend>담당 내용과 기술</legend>
                <label>
                  담당 역할 <span>*</span>
                  <textarea maxLength={500} name="role" required rows={3} />
                </label>
                <label>
                  주요 기능 <span>*</span>
                  <textarea
                    name="features"
                    placeholder={"상품 등록\n실시간 좋아요 반영\n로그인 및 회원가입"}
                    required
                    rows={5}
                  />
                  <small>기능 하나당 한 줄씩 입력</small>
                </label>
                <label>
                  사용 기술 <span>*</span>
                  <input
                    name="techStack"
                    placeholder="Next.js, React, MongoDB, GitHub"
                    required
                  />
                  <small>쉼표로 구분</small>
                </label>
                <label>
                  배운 점
                  <textarea maxLength={1500} name="learnings" rows={5} />
                </label>
              </fieldset>

              <fieldset>
                <legend>링크와 이미지</legend>
                <div className="project-create-grid">
                  <label>
                    GitHub 주소
                    <input name="githubUrl" placeholder="https://github.com/..." type="url" />
                  </label>
                  <label>
                    배포 사이트 주소
                    <input name="demoUrl" placeholder="https://..." type="url" />
                  </label>
                  <label>
                    메인 이미지
                    <input name="thumbnail" placeholder="/images/projects/.../home.png" />
                  </label>
                  <label>
                    라이트 모드 이미지
                    <input name="lightThumbnail" placeholder="선택 사항" />
                  </label>
                </div>
                <label>
                  추가 화면 이미지 <small>(한 줄에 이미지 한 장)</small>
                  <textarea
                    name="gallery"
                    placeholder={"상품 목록 | /images/projects/my-app/products.png | 카테고리별 상품을 확인하는 화면\n로그인 | /images/projects/my-app/login.png | 이메일과 비밀번호로 로그인하는 화면"}
                    rows={4}
                  />
                  <small>입력 형식: 이미지 제목 | 이미지 경로 | 이미지 설명</small>
                  <small>각 항목은 세로줄(|)로 구분하고, 이미지가 여러 장이면 줄을 바꿔 같은 형식으로 입력하세요.</small>
                </label>
                <label className="project-create-checkbox">
                  <input name="demoPending" type="checkbox" />
                  배포 링크 준비 중 표시
                </label>
              </fieldset>

              <fieldset className="project-create-auth">
                <legend>등록 권한</legend>
                <label>
                  관리자 키 <span>*</span>
                  <input autoComplete="current-password" name="adminKey" required type="password" />
                </label>
              </fieldset>

              {message && <p className="project-create-error" role="alert">{message}</p>}

              <footer>
                <button onClick={() => setIsOpen(false)} type="button">취소</button>
                <button disabled={isSaving} type="submit">
                  {isSaving ? "저장 중..." : "프로젝트 등록"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      ), document.body)}
    </>
  );
}
