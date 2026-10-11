import { useEffect, useId, useRef, useState } from "react";
import "./ProjectModal.css";
import assetUrl from "../utils/assetUrl.js";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])';

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={
          direction === "left"
            ? "M14 5 7 12l7 7M7 12h13"
            : "m10 5 7 7-7 7M17 12H4"
        }
      />
    </svg>
  );
}

function embedSource(media) {
  if (!media?.src) return null;
  const source = String(media.src);
  if (media.type === "vimeo") {
    const id = source.match(
      /(?:vimeo\.com\/(?:video\/)?|^)(\d+)(?:[/?#]|$)/,
    )?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (media.type === "youtube") {
    let id = /^[a-zA-Z0-9_-]{11}$/.test(source) ? source : null;
    try {
      const url = new URL(source);
      if (url.hostname === "youtu.be") id = url.pathname.slice(1).split("/")[0];
      if (/(^|\.)(youtube\.com|youtube-nocookie\.com)$/.test(url.hostname)) {
        id =
          url.searchParams.get("v") ||
          url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
      }
    } catch {
      // A plain video ID is supported alongside full video URLs.
    }
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null;
  }
  return null;
}

function Reel({ project }) {
  const media = project.media;
  const poster = media?.poster || project.images?.[0]?.src;
  const embed = embedSource(media);

  return (
    <div className="project-modal__reel-frame" data-testid="reel-frame">
      {media?.type === "mp4" && media.src ? (
        <video
          controls
          playsInline
          preload="metadata"
          poster={assetUrl(poster)}
          aria-label={project.title}
        >
          <source src={assetUrl(media.src)} type="video/mp4" />이 브라우저에서는 영상을
          재생할 수 없습니다.
        </video>
      ) : embed ? (
        <iframe
          src={embed}
          title={`${project.title} 영상`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      ) : (
        <div className="project-modal__reel-placeholder">
          {(poster || media?.src) && (
            <img
              src={assetUrl(poster || media.src)}
              alt={project.images?.[0]?.alt || project.title}
            />
          )}
          <span className="project-modal__reel-still">
            STILL PREVIEW · 9:16
          </span>
        </div>
      )}
    </div>
  );
}

export default function ProjectModal({ project, onClose, returnFocusRef }) {
  const [slide, setSlide] = useState(0);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const closeRequestedRef = useRef(false);
  const pointerRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const images = project.images || [];
  const slideCount = images.length;
  onCloseRef.current = onClose;

  function requestClose() {
    if (closeRequestedRef.current) return;
    closeRequestedRef.current = true;
    onCloseRef.current();
  }

  function moveSlide(direction) {
    if (slideCount > 1)
      setSlide((current) => (current + direction + slideCount) % slideCount);
  }

  useEffect(() => {
    setSlide(0);
    closeRequestedRef.current = false;
    const opener = returnFocusRef?.current || document.activeElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const previousStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousPadding =
      parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0)
      body.style.paddingRight = `${previousPadding + scrollbarWidth}px`;
    closeRef.current?.focus({ preventScroll: true });

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (
        project.type === "carousel" &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")
      ) {
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        if (slideCount > 1)
          setSlide(
            (current) => (current + direction + slideCount) % slideCount,
          );
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...panelRef.current.querySelectorAll(focusableSelector),
      ].filter(
        (element) =>
          element.getClientRects().length > 0 && element.tabIndex !== -1,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) {
        event.preventDefault();
        panelRef.current.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panelRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panelRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      Object.assign(body.style, previousStyles);
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      if (opener instanceof HTMLElement && opener.isConnected)
        opener.focus({ preventScroll: true });
    };
  }, [project.id, project.type, slideCount]);

  function onPointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
    };
    if (
      event.currentTarget.hasPointerCapture &&
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        /* Synthetic events have no active pointer. */
      }
    }
  }

  function onPointerUp(event) {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25)
      moveSlide(dx < 0 ? 1 : -1);
  }

  const format = {
    scroll: "PROJECT STORY",
    carousel: "IMAGE SERIES",
    reel: "MOTION STUDY",
  }[project.type];

  return (
    <div
      className="project-modal__backdrop"
      data-testid="project-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        className={`project-modal project-modal--${project.type}`}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        data-project-type={project.type}
      >
        <button
          className="project-modal__close"
          ref={closeRef}
          onClick={requestClose}
          aria-label="작업 설명 닫기"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div
          className="project-modal__media"
          data-testid="project-media"
          tabIndex={project.type === "scroll" ? 0 : undefined}
          role={project.type === "scroll" ? "region" : undefined}
          aria-label={
            project.type === "scroll"
              ? "작업 이미지 — 위아래 방향키로 스크롤"
              : undefined
          }
        >
          {project.type === "scroll" && (
            <div className="project-modal__story">
              {images.map((image, index) => (
                <img
                  key={`${image.src}-${index}`}
                  src={assetUrl(image.src)}
                  alt={image.alt || `${project.title} ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ))}
              <p className="project-modal__story-end">THANK YOU FOR LOOKING.</p>
            </div>
          )}

          {project.type === "carousel" && (
            <div className="project-modal__carousel">
              <div
                className="project-modal__slide"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => {
                  pointerRef.current = null;
                }}
                data-testid="carousel-slide"
              >
                {images[slide] && (
                  <img
                    src={assetUrl(images[slide].src)}
                    alt={images[slide].alt || `${project.title} ${slide + 1}`}
                    draggable={false}
                  />
                )}
              </div>
              <div className="project-modal__carousel-controls">
                <button
                  aria-label="이전 이미지"
                  onClick={() => moveSlide(-1)}
                  disabled={slideCount < 2}
                >
                  <Arrow direction="left" />
                </button>
                <span
                  aria-live="polite"
                  aria-atomic="true"
                  data-testid="slide-count"
                >
                  <strong>{String(slide + 1).padStart(2, "0")}</strong>
                  <span aria-hidden="true"> / </span>
                  {String(slideCount).padStart(2, "0")}
                </span>
                <button
                  aria-label="다음 이미지"
                  onClick={() => moveSlide(1)}
                  disabled={slideCount < 2}
                >
                  <Arrow direction="right" />
                </button>
              </div>
            </div>
          )}

          {project.type === "reel" && <Reel project={project} />}
        </div>

        <aside
          className="project-modal__info"
          tabIndex={0}
          aria-label="작업 정보"
        >
          <p className="project-modal__eyebrow">{format}</p>
          <h2 id={titleId}>{project.title}</h2>
          <p className="project-modal__category">
            {project.category}
            {project.year && (
              <>
                <span> / </span>
                {project.year}
              </>
            )}
          </p>
          <p className="project-modal__description" id={descriptionId}>
            {project.description}
          </p>
          <div className="project-modal__info-footer">
            <span>
              {project.type === "scroll"
                ? "SCROLL TO EXPLORE"
                : project.type === "carousel"
                  ? "SWIPE TO EXPLORE"
                  : "A LITTLE MOVEMENT."}
            </span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v16m-6-6 6 6 6-6" />
            </svg>
          </div>
        </aside>
      </section>
    </div>
  );
}
