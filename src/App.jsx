import { useEffect, useRef, useState } from "react";
import Intro from "./components/Intro.jsx";
import ProjectModal from "./components/ProjectModal.jsx";
import { projects, categories } from "./data/projects.js";
import assetUrl from "./utils/assetUrl.js";
import iconDefaultUrl from "../icon1.png?url";
import iconHoverUrl from "../icon2.png?url";

function readRoute() {
  const hash = window.location.hash;
  const match = hash.match(/^#work\/([^/]+)$/);
  let projectId = null;
  try {
    projectId = match ? decodeURIComponent(match[1]) : null;
  } catch {
    /* Ignore malformed shared links. */
  }
  return { page: hash.startsWith("#work") ? "work" : "intro", projectId };
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [filter, setFilter] = useState("All");
  const workHeading = useRef(null);
  const projectOpener = useRef(null);
  const workScroll = useRef(0);
  const previouslyWork = useRef(route.page === "work");
  const selectedProject = projects.find(
    (project) => project.id === route.projectId,
  );
  const visibleProjects = projects.filter(
    (project) => filter === "All" || project.category === filter,
  );

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const onRoute = () =>
      setRoute((current) => {
        const next = readRoute();
        if (
          current.page === "work" &&
          next.page === "intro" &&
          document.body.style.position !== "fixed"
        )
          workScroll.current = window.scrollY;
        return next;
      });
    window.addEventListener("popstate", onRoute);
    window.addEventListener("hashchange", onRoute);
    return () => {
      window.removeEventListener("popstate", onRoute);
      window.removeEventListener("hashchange", onRoute);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    if (route.page === "work" && !previouslyWork.current) {
      window.scrollTo(0, workScroll.current);
      workHeading.current?.focus({ preventScroll: true });
    }
    previouslyWork.current = route.page === "work";
    document.title = selectedProject
      ? `${selectedProject.title} — GetMore`
      : "GetMore — Graphic design portfolio";
  }, [route.page, selectedProject]);

  function navigate(hash, state = {}) {
    window.history.pushState(state, "", hash);
    setRoute(readRoute());
  }

  function goIntro() {
    if (route.page === "intro") return;
    workScroll.current = window.scrollY;
    navigate("#intro");
    window.scrollTo(0, 0);
  }

  function goWork() {
    if (route.page === "work") return;
    workScroll.current = 0;
    navigate("#work");
    window.scrollTo(0, 0);
  }

  function openProject(project, event) {
    projectOpener.current = event.currentTarget;
    navigate(`#work/${project.id}`, { portfolioModal: true });
  }

  function closeProject() {
    if (window.history.state?.portfolioModal) window.history.back();
    else {
      window.history.replaceState({}, "", "#work");
      setRoute(readRoute());
    }
  }

  return (
    <>
      <a
        className="skip-link"
        inert={selectedProject ? true : undefined}
        href={route.page === "work" ? "#work-content" : "#intro-title"}
        onClick={(event) => {
          event.preventDefault();
          document
            .getElementById(
              route.page === "work" ? "work-content" : "intro-title",
            )
            ?.focus();
        }}
      >
        본문으로 이동
      </a>
      {route.page === "work" && (
        <header
          inert={selectedProject ? true : undefined}
          className={`site-header ${route.page === "work" ? "site-header--work" : ""}`}
        >
          <a
            className="work-capsule"
            href="#intro"
            aria-label="GetMore 인트로로 돌아가기"
            onClick={(event) => {
              event.preventDefault();
              goIntro();
            }}
          >
            <img className="work-capsule__default" src={iconDefaultUrl} alt="" />
            <img className="work-capsule__hover" src={iconHoverUrl} alt="" />
          </a>
          <button
            className="wordmark"
            onClick={goIntro}
            aria-label="GetMore 인트로로 돌아가기"
          >
            getmore
            <svg className="wordmark-star" viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="M20 3v34M3 20h34M8 8l24 24M8 32 32 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="header-caption">
            Independent graphic designer
            <br />
            <span>Ideas, made visual.</span>
          </span>
          <button
            className="header-work"
            onClick={() => {
              if (route.page !== "work") navigate("#work");
              else if (selectedProject) closeProject();
            }}
          >
            Selected work <span aria-hidden="true">↗</span>
          </button>
        </header>
      )}
      {route.page === "intro" ? (
        <Intro onOpenWork={goWork} />
      ) : (
        <main
          className="work-page"
          id="work-content"
          tabIndex="-1"
          inert={selectedProject ? true : undefined}
        >
          <section className="work-intro">
            <div>
              <div className="eyebrow">
                <span className="blue-dot" /> A COLLECTION OF CURIOSITIES
              </div>
              <h1 ref={workHeading} tabIndex="-1">
                Good ideas.
                <br />
                <span>More possibilities.</span>
              </h1>
            </div>
            <p>
              작은 호기심에서 시작되는 새로운 시선.
              <br />
              브랜드부터 종이 위의 이야기, 움직이는 이미지까지.
              <br />
              <span>좋아하는 것들을, 더 다르게.</span>
            </p>
          </section>
          <div className="work-toolbar">
            <nav className="filters" aria-label="작업물 분야">
              {categories.map((category) => (
                <button
                  key={category}
                  className={filter === category ? "filter active" : "filter"}
                  aria-pressed={filter === category}
                  onClick={() => setFilter(category)}
                >
                  {category}
                  {category === "All" && <sup>{projects.length}</sup>}
                </button>
              ))}
            </nav>
            <span className="work-count">
              {String(visibleProjects.length).padStart(2, "0")} SELECTED WORKS
            </span>
          </div>
          <div className="project-grid" aria-label="작업물 목록">
            {visibleProjects.map((project, index) => (
              <button
                className="project-card"
                key={project.id}
                onClick={(event) => openProject(project, event)}
                aria-label={`${project.title} 작업 설명 열기`}
                data-project-type={project.type}
                data-project-id={project.id}
              >
                <div className="project-cover">
                  <img
                    src={assetUrl(project.cover.src)}
                    alt={project.cover.alt}
                    width={project.cover.width}
                    height={project.cover.height}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                  <span className="project-open" aria-hidden="true">
                    ↗
                  </span>
                  <span className="project-format">
                    {project.type === "reel"
                      ? "↗ MOTION"
                      : project.type === "carousel"
                        ? "⊞ SERIES"
                        : "↓ STORY"}
                  </span>
                </div>
                <div className="project-caption">
                  <h2>{project.title}</h2>
                  <span>
                    {project.category} <span className="caption-dot">·</span>{" "}
                    {project.year}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="sample-note">
            지금은 새로운 작업을 위한 샘플 컬렉션입니다.
          </div>
          <footer className="site-footer">
            <div>
              <span className="eyebrow">ALWAYS CURIOUS, ALWAYS CREATING</span>
              <p>
                Let’s make
                <br />
                <span>something more.</span>{" "}
                <span className="footer-arrow" aria-hidden="true">
                  ↗
                </span>
              </p>
            </div>
            <div className="footer-meta">
              <button onClick={goIntro}>한 번 더 뽑아보기 ↗</button>
              <span>
                © 2026 GETMORE
                <br />
                GRAPHIC DESIGN PORTFOLIO
              </span>
            </div>
          </footer>
        </main>
      )}
      {selectedProject && route.page === "work" && (
        <ProjectModal
          key={selectedProject.id}
          project={selectedProject}
          onClose={closeProject}
          returnFocusRef={projectOpener}
        />
      )}
    </>
  );
}
