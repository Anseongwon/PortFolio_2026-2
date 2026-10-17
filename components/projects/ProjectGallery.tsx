'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type GalleryImage = {
  src: string
  title: string
  alt: string
}

type ProjectGalleryProps = {
  images: GalleryImage[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (expandedIndex === null) {
      return
    }

    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpandedIndex(null)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [expandedIndex])

  if (images.length === 0) {
    return null
  }

  const previousIndex = (activeIndex - 1 + images.length) % images.length
  const nextIndex = (activeIndex + 1) % images.length
  const visibleItems = [
    { index: previousIndex, position: 'before' },
    { index: activeIndex, position: 'active' },
    { index: nextIndex, position: 'after' },
  ].filter(
    (item, itemIndex, items) =>
      items.findIndex((candidate) => candidate.index === item.index) === itemIndex,
  )
  const activeImage = images[activeIndex]
  const expandedImage = expandedIndex === null ? null : images[expandedIndex]

  function openExpandedImage(index: number) {
    previousFocusRef.current = document.activeElement as HTMLElement | null
    setExpandedIndex(index)
  }

  return (
    <>
      <div className="project-gallery">
        <div className="project-gallery-stage">
          {visibleItems.map(({ index, position }) => {
            const image = images[index]
            const isActive = index === activeIndex

            return (
              <div
                className={`project-gallery-card project-gallery-card-${position}`}
                key={image.src}
              >
                <button
                  aria-label={`${image.title} 화면 선택`}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <Image
                    alt={image.alt}
                    fill
                    sizes="(max-width: 800px) 82vw, 640px"
                    src={image.src}
                  />
                </button>

                {isActive && (
                  <button
                    aria-label={`${image.title} 크게 보기`}
                    className="project-gallery-expand"
                    onClick={() => openExpandedImage(index)}
                    title="Open full size"
                    type="button"
                  >
                    <span aria-hidden="true">⛶</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="project-gallery-caption" aria-live="polite">
          <strong>{activeImage.title}</strong>
          <div
            aria-label={`${activeIndex + 1} / ${images.length}`}
            className="project-gallery-dots"
          >
            {images.map((image, index) => (
              <button
                aria-label={`${image.title} 화면 선택`}
                aria-pressed={index === activeIndex}
                key={image.src}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>

      {expandedImage && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="project-gallery-modal-backdrop"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setExpandedIndex(null)
                }
              }}
            >
              <section
                aria-label="확대된 프로젝트 화면"
                aria-modal="true"
                className="project-gallery-modal"
                role="dialog"
              >
                <div className="project-gallery-modal-image">
                  <Image
                    alt={expandedImage.alt}
                    fill
                    priority
                    sizes="94vw"
                    src={expandedImage.src}
                  />
                </div>
                <button
                  aria-label="확대 이미지 닫기"
                  className="project-gallery-modal-close"
                  onClick={() => setExpandedIndex(null)}
                  ref={closeButtonRef}
                  type="button"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
