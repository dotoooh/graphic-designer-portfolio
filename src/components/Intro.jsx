import { useEffect, useRef, useState } from "react";
import backgroundUrl from "../../main1-1.png?url";
import machineUrl from "../../main1-2.png?url";
import assetUrl from "../utils/assetUrl.js";
import { introArtwork } from "./introArtwork.js";
import "./Intro.css";

// Crop the existing flat PNG with its original silhouette, without editing it.
const silhouette =
  "M1252 392 Q1278 383 1306 392 L1311 408 Q1369 410 1374 432 L1379 448 Q1378 455 1370 457 C1440 492 1491 560 1491 632 C1491 715 1453 769 1410 794 Q1419 812 1410 820 L1430 836 L1431 1031 Q1454 1036 1450 1059 L1450 1077 Q1445 1101 1320 1103 Q1321 1107 1280 1108 Q1240 1109 1239 1103 Q1120 1103 1115 1076 L1115 1059 Q1111 1036 1133 1032 L1133 836 L1153 820 Q1140 807 1152 794 C1111 758 1075 709 1075 635 C1075 558 1123 492 1191 458 Q1177 455 1183 445 L1187 432 Q1188 411 1249 408 Z";

const DEACTIVATE_DELAY = 720;

export default function Intro({ onOpenWork }) {
  const [active, setActive] = useState(false);
  const hovering = useRef(false);
  const lastPointer = useRef(null);
  const deactivateTimer = useRef(null);
  const machineButton = useRef(null);

  function cancelDeactivation() {
    window.clearTimeout(deactivateTimer.current);
    deactivateTimer.current = null;
  }

  function activate() {
    cancelDeactivation();
    setActive(true);
  }

  function scheduleDeactivation() {
    cancelDeactivation();
    deactivateTimer.current = window.setTimeout(() => {
      deactivateTimer.current = null;
      setActive(false);
      machineButton.current?.style.setProperty("--capsule-drift-x", "0px");
      machineButton.current?.style.setProperty("--capsule-drift-y", "0px");
    }, DEACTIVATE_DELAY);
  }

  useEffect(() => () => cancelDeactivation(), []);

  function followPointer(event) {
    if (event.pointerType !== "mouse" || !active || !machineButton.current) return;
    const bounds = machineButton.current.getBoundingClientRect();
    // main1-2.png is a single flat illustration. Keep its original pixels intact
    // and use a restrained, slow parallax to suggest gentle capsule movement.
    const x = Math.max(-1, Math.min(1, (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width * 0.42)));
    const y = Math.max(-1, Math.min(1, (event.clientY - (bounds.top + bounds.height * 0.36)) / (bounds.height * 0.28)));
    machineButton.current.style.setProperty("--capsule-drift-x", `${x * 2}px`);
    machineButton.current.style.setProperty("--capsule-drift-y", `${y * 1.5}px`);
  }

  return (
    <section
      className={active ? "intro intro--active" : "intro"}
      data-active={active}
      aria-labelledby="intro-title"
      onPointerDown={(event) => {
        if (!event.target.closest(".intro-interaction, .intro-orb")) {
          cancelDeactivation();
          setActive(false);
        }
      }}
    >
      <img
        className="intro-background"
        src={backgroundUrl}
        alt="Pick a Character. GetMore."
        width="2560"
        height="1440"
        fetchPriority="high"
        draggable="false"
      />
      <h1 id="intro-title" className="sr-only" tabIndex="-1">
        GetMore — Graphic design portfolio
      </h1>

      {/* The hit area stays full-size while the illustration shrinks. */}
      <div
        className="intro-interaction"
        onPointerEnter={(event) => {
          if (
            event.pointerType === "mouse" &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches
          ) {
            hovering.current = true;
            activate();
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            hovering.current = false;
            scheduleDeactivation();
          }
        }}
        onPointerMove={followPointer}
      >
        <button
          ref={machineButton}
          className="machine"
          type="button"
          aria-label="주변 작업물 그래픽 펼치기"
          aria-pressed={active}
          onPointerDown={(event) => {
            lastPointer.current = event.pointerType;
          }}
          onClick={(event) => {
            if (event.detail === 0 || lastPointer.current !== "mouse") {
              cancelDeactivation();
              setActive((current) => !current);
            }
          }}
          onBlur={(event) => {
            if (
              !hovering.current &&
              !event.relatedTarget?.closest?.(".intro-orb")
            ) {
              scheduleDeactivation();
            }
          }}
        >
          <svg
            className="intro-machine-art"
            viewBox="1065 380 435 740"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="intro-machine-outline">
                <path d={silhouette} />
              </clipPath>
            </defs>
            <image
              href={machineUrl}
              width="2560"
              height="1440"
              clipPath="url(#intro-machine-outline)"
            />
          </svg>
          <span className="intro-machine-shadow" aria-hidden="true" />
        </button>
      </div>

      <div className="intro-artworks">
        {introArtwork.map((artwork, index) => (
          <button
            className="intro-orb"
            key={artwork.id}
            type="button"
            disabled={!active}
            data-artwork-id={artwork.id}
            aria-label={`${artwork.title} 작업물 목록 보기`}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") cancelDeactivation();
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") scheduleDeactivation();
            }}
            onBlur={(event) => {
              if (
                !event.relatedTarget?.closest?.(".intro-orb, .machine")
              ) {
                scheduleDeactivation();
              }
            }}
            onClick={() => onOpenWork?.()}
            style={{
              "--desktop-x": artwork.desktop.x,
              "--desktop-y": artwork.desktop.y,
              "--desktop-size": artwork.desktop.size,
              "--mobile-x": artwork.mobile.x,
              "--mobile-y": artwork.mobile.y,
              "--mobile-size": artwork.mobile.size,
              "--tilt": `${artwork.tilt}deg`,
              "--travel-duration": `${artwork.duration}ms`,
              "--enter-delay": `${index * 80}ms`,
              "--exit-delay": `${(introArtwork.length - 1 - index) * 65}ms`,
              "--float-duration": `${4.8 + index * 0.43}s`,
              "--float-x": `${index % 2 ? -2 : 2}px`,
              "--float-y": `${-3 - (index % 3)}px`,
            }}
          >
            <span className="intro-orb-float">
              <span className="intro-orb-image">
                <img
                  src={assetUrl(artwork.src)}
                  alt=""
                  width={artwork.width}
                  height={artwork.height}
                  style={{ objectPosition: artwork.position || "50% 50%" }}
                  draggable="false"
                />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
