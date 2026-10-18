import Link from "next/link";

import ContactIcon from "@/components/home/ContactIcon";
import ContactPromptButton from "@/components/home/ContactPromptButton";
import EmailCopyButton from "@/components/home/EmailCopyButton";
import SearchExperience from "@/components/home/SearchExperience";
import { contactLinks } from "@/data/profile";

const quickLinks = [
  { label: "어떤 공부를 하고 있나요?", href: "/about#education" },
  { label: "관심있는 분야가 있나요?", href: "/about#interests" },
  { label: "어떤 프로젝트를 해봤나요?", href: "/projects" },
  { label: "사용할 수 있는 기술이 뭐가 있나요?", href: "/about#skills" },
  { label: "방명록 쓰고 싶어요!", href: "/guestbook" },
];

const contactOrder = ["Instagram", "GitHub", "Blog", "Email"];

export default function HomePage() {
  const orderedContacts = contactOrder
    .map((label) => contactLinks.find((contact) => contact.label === label))
    .filter((contact): contact is (typeof contactLinks)[number] => Boolean(contact));

  return (
    <main className="home-page flex min-h-[calc(100vh-146px)] items-center justify-center py-16 text-center max-md:min-h-[calc(100vh-122px)] max-md:py-12">
      <section className="relative z-1 w-full max-w-[960px]">
        <h1 className="home-title m-0 text-[68px] leading-none font-bold tracking-[-0.025em] text-[var(--text)] max-md:text-[46px]">
          Hi, im Seongwon
        </h1>

        <nav aria-label="연락처" className="contact-dock" id="contact">
          {orderedContacts.map((contact) =>
            contact.icon === "email" ? (
              <EmailCopyButton email={contact.value} key={contact.label} />
            ) : contact.isPlaceholder ? (
              <span
                aria-disabled="true"
                aria-label={`${contact.label} 주소 준비 중`}
                className={`contact-dock-item contact-dock-item-${contact.icon} contact-dock-item-disabled`}
                key={contact.label}
                title={`${contact.label} 주소 준비 중`}
              >
                <ContactIcon name={contact.icon} />
              </span>
            ) : (
              <a
                aria-label={contact.label}
                className={`contact-dock-item contact-dock-item-${contact.icon}`}
                href={contact.href}
                key={contact.label}
                rel="noreferrer"
                target="_blank"
                title={contact.label}
              >
                <ContactIcon name={contact.icon} />
              </a>
            ),
          )}
        </nav>

        <p className="contact-caption">
          중부대학교 정보보호학과 <span aria-hidden="true">·</span> 안성원
        </p>

        <SearchExperience />

        <nav
          aria-label="추천 질문"
          className="mx-auto mt-10 flex max-w-[900px] flex-wrap justify-center gap-4 max-md:mt-8 max-md:gap-3"
        >
          {quickLinks.map((quickLink) => (
            <Link
              className="rounded-full border border-[var(--border)] bg-[var(--nav-background)] px-7 py-3 text-base font-medium text-[var(--text)] shadow-[0_3px_10px_rgb(0_0_0/4%)] backdrop-blur-xl transition hover:-translate-y-px hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] max-md:px-4 max-md:py-2 max-md:text-sm"
              href={quickLink.href}
              key={quickLink.href}
            >
              {quickLink.label}
            </Link>
          ))}
          <ContactPromptButton />
        </nav>

      </section>
    </main>
  );
}
