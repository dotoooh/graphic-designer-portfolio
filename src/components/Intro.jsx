import { useEffect, useRef, useState } from "react";
import backgroundUrl from "../../main1-1.png?url";
import machineUrl from "../../main1-2.png?url";

const silhouette =
  "M1252 392 Q1278 383 1306 392 L1311 408 Q1369 410 1374 432 L1379 448 Q1378 455 1370 457 C1440 492 1491 560 1491 632 C1491 715 1453 769 1410 794 Q1419 812 1410 820 L1430 836 L1431 1031 Q1454 1036 1450 1059 L1450 1077 Q1445 1101 1320 1103 Q1321 1107 1280 1108 Q1240 1109 1239 1103 Q1120 1103 1115 1076 L1115 1059 Q1111 1036 1133 1032 L1133 836 L1153 820 Q1140 807 1152 794 C1111 758 1075 709 1075 635 C1075 558 1123 492 1191 458 Q1177 455 1183 445 L1187 432 Q1188 411 1249 408 Z";
const balls = Array.from({ length: 18 }, (_, index) => ({
  x: 23 + ((index * 17) % 56),
  y: 58 + ((index * 11) % 25),
  dx: (index % 2 ? 1 : -1) * (22 + (index % 5) * 6),
  dy: -(35 + (index % 4) * 10),
  color: ["blue", "red", "white"][index % 3],
}));

export default function Intro({ onEnter }) {
  const [phase, setPhase] = useState("idle");
  const [origin, setOrigin] = useState("50% 46%");
  const locked = useRef(false);
  const timers = useRef([]);
  const scene = useRef(null);
  const glass = useRef(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduceMotion.current = query.matches;
    };
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  function start() {
    if (locked.current) return;
    locked.current = true;
    const sceneRect = scene.current.getBoundingClientRect();
    const glassRect = glass.current.getBoundingClientRect();
    setOrigin(
      `${glassRect.left + glassRect.width / 2 - sceneRect.left}px ${glassRect.top + glassRect.height / 2 - sceneRect.top}px`,
    );
    if (reduceMotion.current) {
      setPhase("fade");
      timers.current.push(setTimeout(onEnter, 220));
      return;
    }
    setPhase("mixing");
    timers.current.push(setTimeout(() => setPhase("turning"), 1350));
    timers.current.push(setTimeout(() => setPhase("zooming"), 2050));
    timers.current.push(setTimeout(onEnter, 2720));
  }

  return (
    <section
      className={`intro intro--${phase}`}
      data-phase={phase}
      aria-labelledby="intro-title"
    >
      <div
        className="intro-scene"
        ref={scene}
        style={{ transformOrigin: origin }}
      >
        <img
          className="intro-background"
          src={backgroundUrl}
          alt="Pick a Character. GetMore."
          width="2560"
          height="1440"
          fetchPriority="high"
        />
        <h1 id="intro-title" className="sr-only" tabIndex="-1">
          GetMore — Graphic design portfolio
        </h1>
        <div className="machine-wrap">
          <button
            className="machine"
            type="button"
            onClick={start}
            aria-label="뽑기 기계를 작동하고 작업물 보기"
            aria-disabled={phase !== "idle"}
          >
            <svg
              className="machine-art"
              viewBox="1065 380 435 740"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="machine-outline">
                  <path d={silhouette} />
                </clipPath>
              </defs>
              <image
                href={machineUrl}
                width="2560"
                height="1440"
                clipPath="url(#machine-outline)"
              />
            </svg>
            <span
              className="glass-target"
              ref={glass}
              onPointerEnter={(event) => {
                if (
                  event.pointerType === "mouse" &&
                  window.matchMedia("(hover: hover) and (pointer: fine)")
                    .matches
                )
                  start();
              }}
            >
              <span className="glass-animation" aria-hidden="true">
                {balls.map((ball, index) => (
                  <span
                    key={index}
                    className={`lottery-ball lottery-ball--${ball.color}`}
                    style={{
                      left: `${ball.x}%`,
                      top: `${ball.y}%`,
                      "--dx": `${ball.dx}px`,
                      "--dy": `${ball.dy}px`,
                      "--duration": `${400 + (index % 5) * 57}ms`,
                      "--delay": `${-index * 71}ms`,
                    }}
                  />
                ))}
                <span className="glass-shine" />
              </span>
            </span>
            <svg
              className="handle-layer"
              viewBox="1231 861 99 99"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="handle-outline">
                  <circle cx="1280.5" cy="910.5" r="48" />
                </clipPath>
              </defs>
              <image
                href={machineUrl}
                width="2560"
                height="1440"
                clipPath="url(#handle-outline)"
              />
            </svg>
          </button>
          <span className="machine-shadow" aria-hidden="true" />
        </div>
      </div>
      <div className="intro-hint" aria-live="polite">
        <span className="hint-dot" />
        {phase === "idle" ? (
          <>
            <span className="desktop-hint">유리 위에 마우스를 올려보세요</span>
            <span className="touch-hint">기계를 터치해보세요</span>
          </>
        ) : (
          "새로운 영감을 뽑는 중…"
        )}
        <span className="hint-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="intro-bottom">
        <span>
          A little curiosity.
          <br />A whole lot of possibilities.
        </span>
        <span>
          GRAPHIC DESIGN
          <br />
          PORTFOLIO · 2026
        </span>
      </div>
    </section>
  );
}
