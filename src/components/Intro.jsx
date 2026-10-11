import { useRef, useState } from "react";
import backgroundUrl from "../../main1-1.png?url";
import machineUrl from "../../main1-2.png?url";
import iconDefaultUrl from "../../icon1.png?url";
import iconHoverUrl from "../../icon2.png?url";
import assetUrl from "../utils/assetUrl.js";
import { introArtwork } from "./introArtwork.js";
import "./Intro.css";

// Crop the existing flat PNG with its original silhouette, without editing it.
const silhouette =
  "M1252 392 Q1278 383 1306 392 L1311 408 Q1369 410 1374 432 L1379 448 Q1378 455 1370 457 C1440 492 1491 560 1491 632 C1491 715 1453 769 1410 794 Q1419 812 1410 820 L1430 836 L1431 1031 Q1454 1036 1450 1059 L1450 1077 Q1445 1101 1320 1103 Q1321 1107 1280 1108 Q1240 1109 1239 1103 Q1120 1103 1115 1076 L1115 1059 Q1111 1036 1133 1032 L1133 836 L1153 820 Q1140 807 1152 794 C1111 758 1075 709 1075 635 C1075 558 1123 492 1191 458 Q1177 455 1183 445 L1187 432 Q1188 411 1249 408 Z";

export default function Intro() {
  const [active, setActive] = useState(false);
  const [hoverIconLoaded, setHoverIconLoaded] = useState(false);
  const hovering = useRef(false);
  const lastPointer = useRef(null);

  return (
    <section
      className={active ? "intro intro--active" : "intro"}
      data-active={active}
      aria-labelledby="intro-title"
      onPointerDown={(event) => {
        if (!event.target.closest(".intro-interaction")) setActive(false);
      }}
    >
      <header className="intro-header">
        <a
          className="intro-logo"
          href="#intro"
          aria-label="GetMore 인트로로 돌아가기"
          data-hover-ready={hoverIconLoaded}
          onClick={() => setActive(false)}
        >
          <span className="intro-logo-images">
            <img
              className="intro-logo-image intro-logo-image--default"
              src={iconDefaultUrl}
              alt=""
              width="1410"
              height="1465"
              draggable="false"
            />
            <img
              className="intro-logo-image intro-logo-image--hover"
              src={iconHoverUrl}
              onLoad={() => setHoverIconLoaded(true)}
              alt=""
              width="1410"
              height="1465"
              draggable="false"
            />
          </span>
        </a>
      </header>

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

      <div className="intro-artworks" aria-hidden="true">
        {introArtwork.map((artwork, index) => (
          <div
            className="intro-orb"
            key={artwork.id}
            data-artwork-id={artwork.id}
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
            <div className="intro-orb-float">
              <div className="intro-orb-image">
                <img
                  src={assetUrl(artwork.src)}
                  alt=""
                  width={artwork.width}
                  height={artwork.height}
                  style={{ objectPosition: artwork.position || "50% 50%" }}
                  draggable="false"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* This hit area never shrinks. Decorative orbs cannot intercept it. */}
      <div
        className="intro-interaction"
        onPointerEnter={(event) => {
          if (
            event.pointerType === "mouse" &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches
          ) {
            hovering.current = true;
            setActive(true);
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            hovering.current = false;
            setActive(false);
          }
        }}
      >
        <button
          className="machine"
          type="button"
          aria-label="주변 작업물 그래픽 펼치기"
          aria-pressed={active}
          onPointerDown={(event) => {
            lastPointer.current = event.pointerType;
          }}
          onClick={(event) => {
            // Mouse uses hover; touch, pen and keyboard use the same toggle.
            if (event.detail === 0 || lastPointer.current !== "mouse") {
              setActive((current) => !current);
            }
          }}
          onBlur={() => {
            if (!hovering.current) setActive(false);
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
    </section>
  );
}
