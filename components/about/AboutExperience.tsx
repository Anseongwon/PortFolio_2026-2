"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import styles from "@/app/about/about.module.css";

const journeyItems = [
  {
    year: "2022",
    title: "대학 입학",
    summary: "중부대학교 정보보호학과",
    details: ["정보보호 전공 시작", "SCP 동아리 활동", "C 언어와 Python 기초 학습"],
    technologies: ["C", "Python", "Security"],
  },
  {
    year: "2023",
    title: "휴학 시작",
    summary: "경험을 돌아보고 방향을 정리",
    details: ["3년간의 휴학 시작", "기초 학습 내용 복습", "진로와 학습 방향 탐색"],
    technologies: ["Review", "Planning"],
  },
  {
    year: "2024–2025",
    title: "기초 다지기",
    summary: "복학과 새로운 학습을 준비",
    details: ["웹과 보안 분야에 대한 관심 구체화", "개발 학습 계획 정리", "복학 이후의 목표 설정"],
    technologies: ["Web", "Security"],
  },
  {
    year: "2026",
    title: "개발과 보안 학습",
    summary: "기초부터 프로젝트까지",
    details: [
      "Linux, 네트워크, 운영체제 학습",
      "HTML, CSS, JavaScript 기반 웹 개발",
      "React, Next.js, MongoDB 프로젝트 구현",
      "GitHub와 알고리즘 학습",
    ],
    technologies: ["Next.js", "React", "MongoDB", "Linux", "Network", "GitHub"],
  },
] as const;

const skills = [
  { name: "React", level: 62, icon: "react", color: "#21a9c7", soft: "#e5f8fb", ink: "#ffffff" },
  { name: "Next.js", level: 60, icon: "next", color: "#222222", soft: "#ededed", ink: "#ffffff" },
  { name: "MongoDB", level: 52, icon: "mongo", color: "#3f9b47", soft: "#e8f6e9", ink: "#ffffff" },
  { name: "JavaScript", level: 68, icon: "javascript", color: "#e2b916", soft: "#fff7d6", ink: "#202020" },
  { name: "HTML", level: 78, icon: "html", color: "#e7653a", soft: "#fff0eb", ink: "#ffffff" },
  { name: "CSS", level: 74, icon: "css", color: "#397bd9", soft: "#eaf2ff", ink: "#ffffff" },
  { name: "Python", level: 48, icon: "python", color: "#3776ab", soft: "#e7f1f8", ink: "#ffffff" },
  { name: "C", level: 45, icon: "c", color: "#667bd4", soft: "#edf0ff", ink: "#ffffff" },
  { name: "Linux", level: 55, icon: "linux", color: "#64748b", soft: "#eef1f4", ink: "#ffffff" },
  { name: "Network", level: 50, icon: "network", color: "#506fe6", soft: "#edf0ff", ink: "#ffffff" },
  { name: "Security", level: 56, icon: "security", color: "#139b8d", soft: "#e6f7f4", ink: "#ffffff" },
  { name: "GitHub", level: 58, icon: "github", color: "#31343a", soft: "#eceef1", ink: "#ffffff" },
] as const;

type SkillIconName = (typeof skills)[number]["icon"];

function SkillIcon({ name }: { name: SkillIconName }) {
  if (name === "react") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="2.4" fill="currentColor" /><ellipse cx="16" cy="16" rx="12" ry="4.7" stroke="currentColor" strokeWidth="1.7" /><ellipse cx="16" cy="16" rx="12" ry="4.7" stroke="currentColor" strokeWidth="1.7" transform="rotate(60 16 16)" /><ellipse cx="16" cy="16" rx="12" ry="4.7" stroke="currentColor" strokeWidth="1.7" transform="rotate(120 16 16)" /></svg>;
  }

  if (name === "mongo") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 32 32"><path d="M16 3.5c5.7 5.2 8.2 10 6.5 15.2-1.1 3.6-3.5 6.3-6.5 8.7-3-2.4-5.4-5.1-6.5-8.7C7.8 13.5 10.3 8.7 16 3.5Z" stroke="currentColor" strokeWidth="1.8" /><path d="M16 8v20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
  }

  if (name === "html" || name === "css") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 32 32"><path d="m6 4 2 22 8 2.5 8-2.5 2-22H6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /><path d={name === "html" ? "M11 10h10l-.5 5H12l.5 5 3.5 1 3.5-1 .3-2.5" : "M11 10h10l-1 11-4 1.3-4-1.3-.3-3"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
  }

  if (name === "python") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 32 32"><path d="M16 5c-6 0-7 2.5-7 6v3h8v2H7c-3.2 0-5 2.2-5 6s2.2 5 5 5h4v-4.5c0-3.2 2.1-5.5 5.5-5.5H23c3.5 0 6-2.2 6-6s-2.7-6-6-6h-7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" /><circle cx="13" cy="9" r="1" fill="currentColor" /></svg>;
  }

  if (name === "linux") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="17" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="m9 12 3 3-3 3m6 0h7M11 27h10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
  }

  if (name === "network") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" /><circle cx="7" cy="24" r="3" stroke="currentColor" strokeWidth="1.8" /><circle cx="25" cy="24" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="m14.5 9.7-6 11.5m9-11.5 6 11.5M10 24h12" stroke="currentColor" strokeWidth="1.8" /></svg>;
  }

  if (name === "security") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 32 32"><path d="M16 3.5 26 7v7.2c0 6.1-3.7 10.8-10 14.3-6.3-3.5-10-8.2-10-14.3V7l10-3.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /><path d="m11.5 16 3 3 6-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
  }

  if (name === "github") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.8" /><circle cx="11" cy="11" r="2" stroke="currentColor" strokeWidth="1.7" /><circle cx="21" cy="11" r="2" stroke="currentColor" strokeWidth="1.7" /><circle cx="16" cy="22" r="2" stroke="currentColor" strokeWidth="1.7" /><path d="M13 11h6m-7 1.5 3 7.5m5-7.5L17 20" stroke="currentColor" strokeWidth="1.7" /></svg>;
  }

  const label = name === "javascript" ? "JS" : name === "next" ? "N" : "C";
  return <svg aria-hidden="true" viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><text x="16" y="20" fill="currentColor" fontSize={name === "javascript" ? "10" : "14"} fontWeight="800" textAnchor="middle">{label}</text></svg>;
}

const updates = [
  { date: "2026.10", text: "Next.js와 MongoDB를 활용한 포트폴리오 개선" },
  { date: "2026.10", text: "방명록 메시지·답장·투표 데이터 영구 저장 구현" },
  { date: "2026.10", text: "중고 거래 웹사이트 팀 프로젝트 진행" },
  { date: "2026.06", text: "NeoCore AI 팀 프로젝트 완성" },
] as const;

const questions = [
  {
    question: "왜 정보보호학과를 선택했나요?",
    answer: "디지털 환경을 안전하게 만드는 원리를 배우고, 개발 과정에서도 보안을 함께 고려하고 싶어 선택했습니다.",
  },
  {
    question: "가장 기억에 남는 프로젝트는 무엇인가요?",
    answer: "현재의 포트폴리오입니다. 화면 디자인부터 API와 MongoDB 연결까지 직접 다듬으며 배운 내용을 하나씩 적용하고 있습니다.",
  },
  {
    question: "어떤 개발자가 되고 싶나요?",
    answer: "기초를 소홀히 하지 않고, 문제를 끝까지 살펴 사용자가 안심하고 이용할 수 있는 서비스를 만드는 개발자가 되고 싶습니다.",
  },
  {
    question: "앞으로의 목표는 무엇인가요?",
    answer: "웹 개발과 정보보호 역량을 함께 쌓고, 실제 사용자가 있는 프로젝트를 완성하며 경험의 폭을 넓히는 것이 목표입니다.",
  },
] as const;

type ImpressionOption = { key: string; label: string; votes: number };
type ImpressionResponse = { options: ImpressionOption[]; total: number; message?: string };

const voteStorageKey = "about-first-impression-v1";

export default function AboutExperience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeJourney, setActiveJourney] = useState(0);
  const [impressions, setImpressions] = useState<ImpressionOption[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [selectedImpression, setSelectedImpression] = useState("");
  const [votedImpression, setVotedImpression] = useState("");
  const [votePending, setVotePending] = useState(false);
  const [voteError, setVoteError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const storageTimeoutId = window.setTimeout(() => {
      try {
        setVotedImpression(window.localStorage.getItem(voteStorageKey) ?? "");
      } catch {
        setVotedImpression("");
      }
    }, 0);

    async function loadImpressions() {
      try {
        const response = await fetch("/api/about/impression", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = (await response.json()) as ImpressionResponse;
        if (!response.ok) throw new Error(data.message || "투표 결과를 불러오지 못했습니다.");
        setImpressions(data.options);
        setTotalVotes(data.total);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setVoteError(error instanceof Error ? error.message : "투표 결과를 불러오지 못했습니다.");
      }
    }

    void loadImpressions();
    return () => {
      controller.abort();
      window.clearTimeout(storageTimeoutId);
    };
  }, []);

  function focusJourney(index: number) {
    const safeIndex = Math.min(Math.max(index, 0), journeyItems.length - 1);
    setActiveJourney(safeIndex);
    const item = timelineRef.current?.children.item(safeIndex) as HTMLElement | null;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  async function submitVote() {
    if (!selectedImpression || votedImpression || votePending) return;
    setVotePending(true);
    setVoteError("");

    try {
      const response = await fetch("/api/about/impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: selectedImpression }),
      });
      const data = (await response.json()) as ImpressionResponse;
      if (!response.ok) throw new Error(data.message || "투표를 저장하지 못했습니다.");
      setImpressions(data.options);
      setTotalVotes(data.total);
      setVotedImpression(selectedImpression);
      try {
        window.localStorage.setItem(voteStorageKey, selectedImpression);
      } catch {
        // The server vote is still valid if browser storage is unavailable.
      }
    } catch (error) {
      setVoteError(error instanceof Error ? error.message : "투표를 저장하지 못했습니다.");
    } finally {
      setVotePending(false);
    }
  }

  const selectedJourney = journeyItems[activeJourney];

  return (
    <div className={styles.content}>
      <section className={styles.profileCard} id="introduction">
        <div className={styles.profileIntro}>
          <div className={styles.profilePortrait}>
            <Image
              alt="안성원 프로필"
              height={160}
              sizes="(max-width: 600px) 96px, 132px"
              src="/images/profile/about-profile.jpg"
              width={160}
            />
          </div>
          <div className={styles.profileIdentity}>
            <h2>안성원</h2>
            <p className={styles.profileSummary}>
              웹 개발과 정보보호를 배우며, 배운 내용을 실제 화면과 기능으로 구현하고 있습니다.
            </p>
          </div>
        </div>
        <dl className={styles.profileFacts}>
          <div>
            <dt>전공</dt>
            <dd>중부대학교 정보보호학과</dd>
          </div>
          <div>
            <dt>관심 분야</dt>
            <dd>웹 개발 · 정보보호 · 네트워크</dd>
          </div>
          <div>
            <dt>현재</dt>
            <dd>Next.js와 MongoDB 기반 프로젝트 학습 중</dd>
          </div>
        </dl>
      </section>

      <section className={styles.sectionCard} id="timeline">
        <div className={styles.sectionHeading}>
          <div>
            <h2>Timeline</h2>
            <p>지금까지의 기록과 현재 배우고 있는 내용을 정리했습니다.</p>
          </div>
          <div className={styles.timelineControls}>
            <button
              aria-label="이전 기록"
              disabled={activeJourney === 0}
              onClick={() => focusJourney(activeJourney - 1)}
              type="button"
            >
              ←
            </button>
            <button
              aria-label="다음 기록"
              disabled={activeJourney === journeyItems.length - 1}
              onClick={() => focusJourney(activeJourney + 1)}
              type="button"
            >
              →
            </button>
          </div>
        </div>

        <div className={styles.timelineViewport} ref={timelineRef}>
          {journeyItems.map((item, index) => (
            <button
              aria-pressed={activeJourney === index}
              className={styles.timelineItem}
              key={`${item.year}-${item.title}`}
              onClick={() => focusJourney(index)}
              type="button"
            >
              <span className={styles.timelineYear}>{item.year}</span>
              <span className={styles.timelineLine} />
              <strong>{item.title}</strong>
              <small>{item.summary}</small>
            </button>
          ))}
        </div>

        <article className={styles.timelineDetail} aria-live="polite">
          <div>
            <span>{selectedJourney.year}</span>
            <h3>{selectedJourney.title}</h3>
            <ul>
              {selectedJourney.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </div>
          <div className={styles.tagList}>
            {selectedJourney.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.sectionCard} id="skills">
        <div className={styles.sectionHeading}>
          <div>
            <h2>Skills</h2>
            <p>배우고 사용해 본 기술을 현재 학습 수준에 맞춰 정리했습니다.</p>
          </div>
        </div>
        <div className={styles.skillGrid}>
          {skills.map((skill) => (
            <article
              className={styles.skillItem}
              key={skill.name}
              style={{
                "--skill-color": skill.color,
                "--skill-soft": skill.soft,
                "--skill-ink": skill.ink,
              } as CSSProperties}
            >
              <span className={styles.skillIcon}><SkillIcon name={skill.icon} /></span>
              <div className={styles.skillBody}>
                <div className={styles.skillMeta}><strong>{skill.name}</strong><span>{skill.level}%</span></div>
                <div className={styles.skillTrack} aria-label={`${skill.name} 학습 수준 ${skill.level}%`}>
                  <span style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionCard} id="first-impression">
        <div className={styles.sectionHeading}>
          <div>
            <h2>First Impression</h2>
            <p>여러분이 본 저의 모습을 알려주세요.</p>
          </div>
          <span className={styles.participantCount}>총 {totalVotes}명 참여</span>
        </div>

        <div className={styles.impressionLayout}>
          <div className={styles.votePanel}>
            <div className={styles.voteOptions}>
              {impressions.map((option) => (
                <button
                  aria-pressed={selectedImpression === option.key || votedImpression === option.key}
                  disabled={Boolean(votedImpression)}
                  key={option.key}
                  onClick={() => setSelectedImpression(option.key)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              className={styles.voteSubmit}
              disabled={!selectedImpression || Boolean(votedImpression) || votePending}
              onClick={() => void submitVote()}
              type="button"
            >
              {votedImpression
                ? `‘${impressions.find((option) => option.key === votedImpression)?.label ?? "선택한 항목"}’에 한 표를 남겼어요`
                : votePending ? "투표 저장 중..." : "한 표 남기기"}
            </button>
            {voteError && <p className={styles.voteError} role="alert">{voteError}</p>}
          </div>

          <div className={styles.voteResults} aria-live="polite">
            {impressions.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              return (
                <div className={styles.resultRow} key={option.key}>
                  <span>{option.label}</span>
                  <div><span style={{ width: `${percentage}%` }} /></div>
                  <strong>{percentage}%</strong>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.sectionCard} id="recent-update">
        <div className={styles.sectionHeading}>
          <div>
            <h2>Recent Update</h2>
            <p>최근 배우고 적용한 내용을 기록합니다.</p>
          </div>
        </div>
        <ol className={styles.updateList}>
          {updates.map((update) => (
            <li key={`${update.date}-${update.text}`}>
              <time>{update.date}</time>
              <span>{update.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.sectionCard} id="q-and-a">
        <div className={styles.sectionHeading}>
          <div>
            <h2>Q&amp;A</h2>
            <p>자주 궁금해할 만한 질문을 모았습니다.</p>
          </div>
        </div>
        <div className={styles.questionGrid}>
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}<span aria-hidden="true">＋</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
