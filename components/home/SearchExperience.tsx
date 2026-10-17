'use client'

import Link from 'next/link'
import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import type { SearchResponse, SearchResult } from '@/types/search'

const emptyResponse: SearchResponse = {
  query: '',
  suggestions: [],
  results: [],
  total: 0,
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ query, text }: { query: string; text: string }) {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return text

  const matcher = new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi')
  return text.split(matcher).map((part, index) =>
    part.toLocaleLowerCase('ko-KR') ===
    trimmedQuery.toLocaleLowerCase('ko-KR') ? (
      <mark
        className="rounded-sm bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] px-0.5 text-inherit"
        key={`${part}-${index}`}
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  )
}

function resultHref(result: SearchResult, query: string) {
  const [pathname, hash] = result.url.split('#')
  const search = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''
  return `${pathname}${search}${hash ? `#${hash}` : ''}`
}

export default function SearchExperience() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState<SearchResponse>(emptyResponse)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const activeRequestRef = useRef<AbortController | null>(null)

  function clearSearch() {
    activeRequestRef.current?.abort()
    activeRequestRef.current = null
    setQuery('')
    setResponse(emptyResponse)
    setIsLoading(false)
    setError('')
    setIsPanelOpen(false)
    setSelectedIndex(-1)
    setSubmittedQuery('')
    setShowAll(false)
  }

  const loadResults = useCallback(async (value: string, openPanel: boolean) => {
    const trimmedValue = value.trim()
    if (!trimmedValue) return emptyResponse

    activeRequestRef.current?.abort()
    const controller = new AbortController()
    activeRequestRef.current = controller
    setIsLoading(true)
    setError('')

    try {
      const request = await fetch(
        `/api/search?q=${encodeURIComponent(trimmedValue)}`,
        {
          signal: controller.signal,
        },
      )

      if (!request.ok) {
        const body = (await request.json()) as { message?: string }
        throw new Error(body.message || '검색 요청에 실패했습니다.')
      }

      const nextResponse = (await request.json()) as SearchResponse
      setResponse(nextResponse)
      setIsPanelOpen(openPanel)
      setSelectedIndex(-1)
      return nextResponse
    } catch (requestError) {
      if (
        requestError instanceof DOMException &&
        requestError.name === 'AbortError'
      ) {
        return null
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : '검색 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      )
      setResponse(emptyResponse)
      return null
    } finally {
      if (activeRequestRef.current === controller) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      activeRequestRef.current?.abort()
      return
    }

    const timer = window.setTimeout(() => {
      void loadResults(trimmedQuery, true)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [loadResults, query])

  useEffect(() => {
    function closePanel(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsPanelOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', closePanel)
    return () => document.removeEventListener('mousedown', closePanel)
  }, [])

  function submitSearch(value: string) {
    const trimmedValue = value.trim()
    if (!trimmedValue) return

    setQuery(trimmedValue)
    setSubmittedQuery(trimmedValue)
    setShowAll(true)
    setIsPanelOpen(false)
    setSelectedIndex(-1)
    void loadResults(trimmedValue, false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (selectedIndex >= 0 && response.suggestions[selectedIndex]) {
      submitSearch(response.suggestions[selectedIndex].label)
      return
    }

    submitSearch(query)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return

    if (event.key === 'ArrowDown' && response.suggestions.length > 0) {
      event.preventDefault()
      setIsPanelOpen(true)
      setSelectedIndex((current) => (current + 1) % response.suggestions.length)
    }

    if (event.key === 'ArrowUp' && response.suggestions.length > 0) {
      event.preventDefault()
      setIsPanelOpen(true)
      setSelectedIndex((current) =>
        current <= 0 ? response.suggestions.length - 1 : current - 1,
      )
    }

    if (event.key === 'Escape') {
      setIsPanelOpen(false)
      setSelectedIndex(-1)
    }
  }

  const previewResults = response.results.slice(0, 4)

  return (
    <div
      className="relative mx-auto mt-24 w-full max-w-[900px] max-md:mt-20"
      ref={rootRef}
    >
      <form
        className="glass-surface flex min-h-[70px] w-full items-center gap-4 px-3 py-1.5 pl-8 text-left focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-[color-mix(in_srgb,var(--accent)_38%,transparent)] max-md:min-h-[58px] max-md:gap-2.5 max-md:py-1 max-md:pl-5"
        onSubmit={handleSubmit}
        role="search"
      >
        <svg
          aria-hidden="true"
          className="size-8 flex-none text-[var(--muted)] max-md:size-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m16 16 4.2 4.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>

        <input
          aria-activedescendant={
            selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isPanelOpen}
          aria-label="안성원에 대해 검색하기"
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent text-xl text-[var(--text)] outline-none placeholder:text-[var(--muted)] max-md:text-base"
          maxLength={100}
          onChange={(event) => {
            const nextQuery = event.target.value

            if (!nextQuery.trim()) {
              clearSearch()
              return
            }

            setQuery(nextQuery)
            setShowAll(false)
            setSubmittedQuery('')
          }}
          onFocus={() => {
            if (query.trim()) setIsPanelOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder="무엇이 궁금하세요?"
          role="combobox"
          type="search"
          value={query}
        />

        {query && (
          <button
            aria-label="검색어 지우기"
            className="grid size-10 flex-none cursor-pointer place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--nav-hover)] hover:text-[var(--text)]"
            onClick={clearSearch}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m7 7 10 10M17 7 7 17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        )}

        <button
          aria-label="검색 실행"
          className="grid size-[46px] flex-none cursor-pointer place-items-center rounded-full border border-white/40 bg-[var(--accent)] text-white shadow-[0_5px_14px_rgb(31_89_239/22%)] transition duration-150 hover:-translate-y-px hover:brightness-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] max-md:size-10"
          type="submit"
        >
          <svg
            aria-hidden="true"
            className="size-7"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 12h14M14 7l5 5-5 5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </form>

      <p className="mt-4 mb-0 text-sm text-[var(--muted)]">
        사이트 내 공개된 소개, 프로젝트와 개발 기록을 검색합니다.
      </p>

      {isPanelOpen && query.trim() && (
        <div className="search-results-panel absolute z-40 mt-4 grid w-full grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-[var(--border)] text-left shadow-[0_18px_45px_rgb(0_0_0/14%)] max-md:grid-cols-1">
          <section className="border-r border-[var(--border)] p-5 max-md:border-r-0 max-md:border-b">
            <h2 className="mb-3 text-sm font-semibold text-[var(--muted)]">
              자동완성
            </h2>
            <ul
              className="m-0 list-none p-0"
              id="search-suggestions"
              role="listbox"
            >
              {response.suggestions.map((suggestion, index) => (
                <li key={suggestion.id}>
                  <button
                    aria-selected={selectedIndex === index}
                    className={`w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      selectedIndex === index
                        ? 'bg-[var(--nav-active)] text-[var(--text)]'
                        : 'hover:bg-[var(--surface-soft)]'
                    }`}
                    id={`search-option-${index}`}
                    onClick={() => submitSearch(suggestion.label)}
                    role="option"
                    type="button"
                  >
                    <Highlight query={query} text={suggestion.label} />
                  </button>
                </li>
              ))}
              {!isLoading && response.suggestions.length === 0 && (
                <li className="px-3 py-2 text-sm text-[var(--muted)]">
                  일치하는 자동완성이 없습니다.
                </li>
              )}
            </ul>
          </section>

          <section className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-[var(--muted)]">
              관련 콘텐츠
            </h2>
            <div className="space-y-2">
              {previewResults.map((result) => (
                <Link
                  className="block rounded-xl px-3 py-2.5 transition hover:bg-[var(--surface-soft)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  href={resultHref(result, query)}
                  key={result.id}
                >
                  <span className="block text-xs text-[var(--muted)]">
                    {result.pageLabel} › {result.section}
                  </span>
                  <strong className="mt-0.5 block text-sm text-[var(--text)]">
                    <Highlight query={query} text={result.title} />
                  </strong>
                  <span className="mt-1 line-clamp-2 block text-xs text-[var(--muted)]">
                    <Highlight query={query} text={result.snippet} />
                  </span>
                </Link>
              ))}
              {isLoading && (
                <p className="px-3 py-2 text-sm text-[var(--muted)]">
                  검색 중...
                </p>
              )}
              {!isLoading && !error && previewResults.length === 0 && (
                <p className="px-3 py-2 text-sm text-[var(--muted)]">
                  일치하는 내용이 없습니다.
                </p>
              )}
              {error && (
                <p className="px-3 py-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            {response.total > previewResults.length && (
              <button
                className="mt-3 cursor-pointer px-3 text-sm font-semibold text-[var(--accent)]"
                onClick={() => {
                  setSubmittedQuery(query.trim())
                  setShowAll(true)
                  setIsPanelOpen(false)
                }}
                type="button"
              >
                전체 결과 {response.total}개 보기
              </button>
            )}
          </section>
        </div>
      )}

      {showAll && submittedQuery && (
        <section
          aria-live="polite"
          className="search-results-panel mt-10 rounded-3xl border border-[var(--border)] p-5 text-left shadow-[0_18px_45px_rgb(0_0_0/10%)]"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[var(--text)]">
              &lsquo;{submittedQuery}&rsquo; 검색 결과
            </h2>
            <span className="text-sm text-[var(--muted)]">
              {response.total}개
            </span>
          </div>

          {isLoading && (
            <p className="rounded-2xl border border-[var(--border)] p-5">
              검색 중...
            </p>
          )}
          {error && (
            <p className="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-700">
              {error} 검색어를 확인한 뒤 다시 시도해주세요.
            </p>
          )}
          {!isLoading && !error && response.results.length === 0 && (
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--muted)]">
              일치하는 내용이 없습니다. 다른 검색어를 입력해주세요.
            </p>
          )}

          <div className="space-y-3">
            {response.results.map((result) => (
              <Link
                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
                href={resultHref(result, submittedQuery)}
                key={result.id}
              >
                <span className="text-xs text-[var(--muted)]">
                  {result.pageLabel} › {result.title} › {result.section}
                </span>
                <h3 className="mt-1 mb-1 text-base font-semibold text-[var(--text)]">
                  <Highlight query={submittedQuery} text={result.title} />
                </h3>
                <p className="m-0 text-sm text-[var(--muted)]">
                  <Highlight query={submittedQuery} text={result.snippet} />
                </p>
                <span className="mt-2 block text-xs font-medium text-[var(--accent)]">
                  {result.matchReason}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
