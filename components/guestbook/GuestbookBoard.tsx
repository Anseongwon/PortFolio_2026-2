"use client";

import {
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { GUESTBOOK_LIMITS, GUESTBOOK_TAGS } from "@/data/guestbook";
import type {
  GuestbookMessage,
  GuestbookSort,
  GuestbookTag,
} from "@/types/guestbook";

type ApiError = { message?: string };

type GuestbookBoardProps = {
  initialMessages?: GuestbookMessage[];
  initialTotal?: number;
  initialLoadSucceeded?: boolean;
};

function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: includeTime ? "numeric" : undefined,
    month: "2-digit",
    day: "2-digit",
    hour: includeTime ? "2-digit" : undefined,
    minute: includeTime ? "2-digit" : undefined,
  }).format(new Date(value));
}

function getInitial(nickname: string) {
  return nickname.trim().charAt(0).toUpperCase() || "?";
}

function GuestbookAvatar({
  message,
  large = false,
}: {
  message: GuestbookMessage;
  large?: boolean;
}) {
  return (
    <span
      aria-label={`${message.nickname} 프로필`}
      className={`guestbook-avatar${large ? " guestbook-avatar-large" : ""}${
        message.profileImage ? " guestbook-avatar-image" : ""
      }`}
      data-profile-key={message.profileKey}
      role="img"
      style={message.profileImage ? { backgroundImage: `url(${JSON.stringify(message.profileImage)})` } : undefined}
    >
      {message.profileImage ? null : getInitial(message.nickname)}
    </span>
  );
}

async function readResponse<T>(response: Response) {
  const data = (await response.json()) as T & ApiError;
  if (!response.ok) throw new Error(data.message || "요청을 처리하지 못했습니다.");
  return data;
}

function SendIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m21 3-7.1 18-3.7-7.2L3 10.1 21 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="m10.2 13.8 4.3-4.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function NewMessageIcon() {
  return (
    <svg aria-hidden="true" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
      <path
        d="M25.8 16.2a10.8 10.8 0 1 1-4.1-8.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m9.2 25.1-1 4 4.2-2.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M25 5.5v8M21 9.5h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function HeartIcon({ active = false }: { active?: boolean }) {
  return (
    <svg aria-hidden="true" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24">
      <path
        d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PinIcon({ active = false }: { active?: boolean }) {
  return (
    <svg aria-hidden="true" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24">
      <path
        d="m14.5 4.2 5.3 5.3-2.6 1.1-3.8 3.8-1 4.4-1.2 1.2-.8-5.2-5.2-.8 1.2-1.2 4.4-1 3.8-3.8 1.1-2.6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path d="m9.8 14.2-5.6 5.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

export default function GuestbookBoard({
  initialMessages = [],
  initialTotal = 0,
  initialLoadSucceeded = false,
}: GuestbookBoardProps) {
  const [messages, setMessages] = useState<GuestbookMessage[]>(initialMessages);
  const [total, setTotal] = useState(initialTotal);
  const [selectedId, setSelectedId] = useState(initialMessages[0]?._id ?? "");
  const [sort, setSort] = useState<GuestbookSort>("latest");
  const [activeTag, setActiveTag] = useState<GuestbookTag | "all">("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(!initialLoadSucceeded);
  const [error, setError] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const skipInitialLoadRef = useRef(initialLoadSucceeded);

  const selectedMessage = useMemo(
    () => messages.find((message) => message._id === selectedId) ?? messages[0],
    [messages, selectedId],
  );

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ sort });
    if (activeTag !== "all") params.set("tag", activeTag);
    if (search) params.set("q", search);

    try {
      const response = await fetch(`/api/guestbook?${params}`, { cache: "no-store" });
      const data = await readResponse<{ messages: GuestbookMessage[]; total: number }>(response);
      setMessages(data.messages);
      setTotal(data.total);
      setSelectedId((current) =>
        data.messages.some((message) => message._id === current)
          ? current
          : (data.messages[0]?._id ?? ""),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "방명록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [activeTag, search, sort]);

  useEffect(() => {
    if (skipInitialLoadRef.current) {
      skipInitialLoadRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => void loadMessages(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadMessages]);

  useEffect(() => {
    const savedKey = window.sessionStorage.getItem("guestbook-admin-key");
    if (!savedKey) return;

    const timeoutId = window.setTimeout(() => {
      setAdminKey(savedKey);
      setIsAdmin(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    function closeDialog(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsComposerOpen(false);
      setIsAdminDialogOpen(false);
    }

    window.addEventListener("keydown", closeDialog);
    return () => window.removeEventListener("keydown", closeDialog);
  }, []);

  async function updateAdminState(update: Record<string, boolean>) {
    if (!selectedMessage) return;

    try {
      const response = await fetch(`/api/guestbook/${selectedMessage._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(update),
      });
      await readResponse<{ message: GuestbookMessage }>(response);
      await loadMessages();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "상태를 변경하지 못했습니다.");
    }
  }

  async function deleteMessage() {
    if (!selectedMessage || !window.confirm("이 메시지와 모든 답장을 삭제할까요?")) return;

    try {
      const response = await fetch(`/api/guestbook/${selectedMessage._id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      await readResponse<{ deleted: boolean }>(response);
      await loadMessages();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "메시지를 삭제하지 못했습니다.");
    }
  }

  return (
    <section className="guestbook-board" aria-label="공개 방명록">
      <header className="guestbook-heading">
        <div>
          <h1>Guestbook</h1>
          <p>방문해주셔서 감사합니다. 자유롭게 한마디 남겨주세요 :)</p>
        </div>
        <button
          aria-label="메시지 남기기"
          className="guestbook-primary-button"
          onClick={() => setIsComposerOpen(true)}
          title="메시지 남기기"
          type="button"
        >
          <NewMessageIcon />
        </button>
      </header>

      <div className="guestbook-shell">
        <aside className="guestbook-inbox">
          <div className="guestbook-inbox-toolbar">
            <strong>모든 메시지 <span>{total}</span></strong>
            <label>
              <span className="sr-only">메시지 정렬</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as GuestbookSort)}>
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="favorite">♥ 하트만</option>
              </select>
            </label>
          </div>

          <form
            className="guestbook-search"
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchInput.trim());
            }}
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            </svg>
            <input
              aria-label="닉네임 또는 메시지 검색"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="닉네임 또는 메시지 검색"
              value={searchInput}
            />
          </form>

          <div className="guestbook-tag-filters" aria-label="해시태그 필터">
            <button
              aria-pressed={activeTag === "all"}
              onClick={() => setActiveTag("all")}
              type="button"
            >
              전체
            </button>
            {GUESTBOOK_TAGS.map((tag) => (
              <button
                aria-pressed={activeTag === tag}
                key={tag}
                onClick={() => setActiveTag(tag)}
                type="button"
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="guestbook-message-list" aria-busy={loading}>
            {loading ? (
              <div className="guestbook-empty">메시지를 불러오는 중입니다.</div>
            ) : error && messages.length === 0 ? (
              <div className="guestbook-empty guestbook-empty-error">
                <strong>메시지를 불러오지 못했습니다.</strong>
                <span>{error}</span>
                <button onClick={() => void loadMessages()} type="button">다시 시도</button>
              </div>
            ) : messages.length === 0 ? (
              <div className="guestbook-empty">
                <strong>아직 메시지가 없습니다.</strong>
                <span>첫 번째 메시지를 남겨보세요!</span>
              </div>
            ) : (
              messages.map((message) => (
                <button
                  aria-pressed={selectedMessage?._id === message._id}
                  className="guestbook-list-item"
                  key={message._id}
                  onClick={() => setSelectedId(message._id)}
                  type="button"
                >
                  <GuestbookAvatar message={message} />
                  <span className="guestbook-list-copy">
                    <span className="guestbook-list-title">
                      <strong>{message.nickname}</strong>
                      <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
                    </span>
                    <span className="guestbook-list-preview">{message.content}</span>
                    <span className="guestbook-list-meta">
                      {message.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                      {message.replies.length > 0 && <small>답장 {message.replies.length}</small>}
                    </span>
                  </span>
                  <span className="guestbook-list-status" aria-label="메시지 상태">
                    {message.isPinned && <span className="guestbook-status-pin" title="상단 고정"><PinIcon active /></span>}
                    {message.isFavorite && <span title="즐겨찾기">♥</span>}
                    {message.replies.length === 0 && <i title="미답변" />}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        <article
          aria-live="polite"
          className="guestbook-thread"
          data-room-theme={selectedMessage?.roomThemeKey}
          style={
            selectedMessage
              ? ({ "--guestbook-room-color": selectedMessage.roomColor } as CSSProperties)
              : undefined
          }
        >
          {selectedMessage ? (
            <>
              <header className="guestbook-thread-header">
                <div className="guestbook-thread-person">
                  <GuestbookAvatar large message={selectedMessage} />
                  <div>
                    <strong>{selectedMessage.nickname}</strong>
                    <time dateTime={selectedMessage.createdAt}>{formatDate(selectedMessage.createdAt, true)}</time>
                  </div>
                </div>

                <div className="guestbook-thread-actions">
                  <button
                    aria-label={selectedMessage.isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
                    className={`guestbook-action-favorite${selectedMessage.isFavorite ? " is-active" : ""}`}
                    onClick={() => {
                      if (!isAdmin) {
                        setIsAdminDialogOpen(true);
                        return;
                      }
                      void updateAdminState({ isFavorite: !selectedMessage.isFavorite });
                    }}
                    title={isAdmin ? "즐겨찾기" : "관리자 인증 후 즐겨찾기"}
                    type="button"
                  >
                    <HeartIcon active={selectedMessage.isFavorite} />
                  </button>
                  <button
                    aria-label={selectedMessage.isPinned ? "상단 고정 해제" : "상단 고정"}
                    className={`guestbook-action-pin${selectedMessage.isPinned ? " is-active" : ""}`}
                    onClick={() => {
                      if (!isAdmin) {
                        setIsAdminDialogOpen(true);
                        return;
                      }
                      void updateAdminState({ isPinned: !selectedMessage.isPinned });
                    }}
                    title={isAdmin ? "상단 고정" : "관리자 인증 후 상단 고정"}
                    type="button"
                  >
                    <PinIcon active={selectedMessage.isPinned} />
                  </button>
                  {isAdmin && (
                    <>
                      <button className="guestbook-action-delete" aria-label="메시지 삭제" onClick={() => void deleteMessage()} title="삭제" type="button">×</button>
                    </>
                  )}
                  <button
                    aria-label={isAdmin ? "관리자 모드 종료" : "관리자 모드"}
                    onClick={() => {
                      if (isAdmin) {
                        window.sessionStorage.removeItem("guestbook-admin-key");
                        setAdminKey("");
                        setIsAdmin(false);
                      } else {
                        setIsAdminDialogOpen(true);
                      }
                    }}
                    title={isAdmin ? "관리자 모드 종료" : "관리자 모드"}
                    type="button"
                  >
                    {isAdmin ? "🔓" : "🔒"}
                  </button>
                </div>
              </header>

              <div className="guestbook-thread-scroll">
                <div className="guestbook-visitor-message">
                  <p>{selectedMessage.content}</p>
                  {selectedMessage.tags.length > 0 && (
                    <div className="guestbook-message-tags">
                      {selectedMessage.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                    </div>
                  )}
                </div>

                {selectedMessage.replies.length === 0 ? (
                  <p className="guestbook-awaiting-reply">아직 관리자의 답장이 없습니다.</p>
                ) : (
                  selectedMessage.replies.map((reply) => (
                    <div className="guestbook-admin-message" key={reply._id}>
                      <p>{reply.content}</p>
                      <time dateTime={reply.createdAt}>{formatDate(reply.createdAt, true)}</time>
                    </div>
                  ))
                )}
              </div>

              {isAdmin ? (
                <ReplyForm
                  adminKey={adminKey}
                  messageId={selectedMessage._id}
                  onCompleted={loadMessages}
                  onError={setError}
                />
              ) : (
                <div className="guestbook-public-note">답장은 관리자만 작성할 수 있으며, 모든 대화는 공개됩니다.</div>
              )}
            </>
          ) : (
            <div className="guestbook-empty guestbook-thread-empty">
              <strong>대화를 선택해주세요.</strong>
              <span>왼쪽 목록에서 메시지를 선택하면 답장을 확인할 수 있습니다.</span>
            </div>
          )}
        </article>
      </div>

      {error && messages.length > 0 && <p className="guestbook-page-error" role="alert">{error}</p>}

      {isComposerOpen && (
        <ComposerModal
          onClose={() => setIsComposerOpen(false)}
          onCompleted={async (message) => {
            setIsComposerOpen(false);
            await loadMessages();
            setSelectedId(message._id);
          }}
        />
      )}

      {isAdminDialogOpen && (
        <AdminDialog
          onClose={() => setIsAdminDialogOpen(false)}
          onAuthenticated={(key) => {
            window.sessionStorage.setItem("guestbook-admin-key", key);
            setAdminKey(key);
            setIsAdmin(true);
            setIsAdminDialogOpen(false);
          }}
        />
      )}
    </section>
  );
}

function ComposerModal({
  onClose,
  onCompleted,
}: {
  onClose: () => void;
  onCompleted: (message: GuestbookMessage) => Promise<void>;
}) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<GuestbookTag[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function toggleTag(tag: GuestbookTag) {
    setTags((current) => {
      if (current.includes(tag)) return current.filter((item) => item !== tag);
      if (current.length >= GUESTBOOK_LIMITS.tags) return current;
      return [...current, tag];
    });
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, content, tags }),
      });
      const data = await readResponse<{ message: GuestbookMessage }>(response);
      await onCompleted(data.message);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "메시지를 등록하지 못했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="guestbook-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="guestbook-composer-title" aria-modal="true" className="guestbook-modal" role="dialog">
        <header>
          <div>
            <h2 id="guestbook-composer-title">메시지 남기기</h2>
          </div>
          <button aria-label="작성 창 닫기" onClick={onClose} type="button">×</button>
        </header>

        <form onSubmit={submitMessage}>
          <label>
            <span>닉네임 <b>*</b></span>
            <input
              autoFocus
              maxLength={GUESTBOOK_LIMITS.nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="어떻게 불러드릴까요?"
              required
              value={nickname}
            />
            <small>{nickname.length} / {GUESTBOOK_LIMITS.nickname}</small>
          </label>

          <label>
            <span>메시지 <b>*</b></span>
            <textarea
              maxLength={GUESTBOOK_LIMITS.content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="자유롭게 메시지를 남겨주세요 :)"
              required
              rows={6}
              value={content}
            />
            <small>{content.length} / {GUESTBOOK_LIMITS.content}</small>
          </label>

          <fieldset>
            <legend>해시태그 <small>최대 {GUESTBOOK_LIMITS.tags}개</small></legend>
            <div className="guestbook-composer-tags">
              {GUESTBOOK_TAGS.map((tag) => (
                <button
                  aria-pressed={tags.includes(tag)}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </fieldset>

          {error && <p className="guestbook-form-error" role="alert">{error}</p>}
          <button className="guestbook-submit-button" disabled={pending} type="submit">
            <SendIcon />
            {pending ? "등록 중..." : "등록하기"}
          </button>
        </form>
      </section>
    </div>
  );
}

function ReplyForm({
  adminKey,
  messageId,
  onCompleted,
  onError,
}: {
  adminKey: string;
  messageId: string;
  onCompleted: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  async function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    onError("");

    try {
      const response = await fetch(`/api/guestbook/${messageId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ content }),
      });
      await readResponse<{ message: GuestbookMessage }>(response);
      setContent("");
      await onCompleted();
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "답장을 등록하지 못했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="guestbook-reply-form" onSubmit={submitReply}>
      <textarea
        aria-label="관리자 답장"
        maxLength={GUESTBOOK_LIMITS.reply}
        onChange={(event) => setContent(event.target.value)}
        placeholder="답변을 남겨주세요 ..."
        required
        rows={2}
        value={content}
      />
      <button aria-label="답장 전송" disabled={pending} type="submit"><SendIcon /></button>
    </form>
  );
}

function AdminDialog({
  onClose,
  onAuthenticated,
}: {
  onClose: () => void;
  onAuthenticated: (key: string) => void;
}) {
  const [key, setKey] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/guestbook/admin", {
        method: "POST",
        headers: { "x-admin-key": key },
      });
      await readResponse<{ authenticated: boolean }>(response);
      onAuthenticated(key);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "관리자 인증에 실패했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="guestbook-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="guestbook-admin-title" aria-modal="true" className="guestbook-modal guestbook-admin-modal" role="dialog">
        <header>
          <div>
            <h2 id="guestbook-admin-title">관리자 모드</h2>
          </div>
          <button aria-label="관리자 창 닫기" onClick={onClose} type="button">×</button>
        </header>
        <form onSubmit={authenticate}>
          <label>
            <span>관리자 키</span>
            <input autoFocus onChange={(event) => setKey(event.target.value)} required type="password" value={key} />
          </label>
          {error && <p className="guestbook-form-error" role="alert">{error}</p>}
          <button className="guestbook-submit-button" disabled={pending} type="submit">
            {pending ? "확인 중..." : "관리자 모드 시작"}
          </button>
        </form>
      </section>
    </div>
  );
}
