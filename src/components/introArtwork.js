// Intro-only samples, independent of the gallery/project data.
// Replace src, width, height and position with the real thumbnail later.
// x/y are offsets from the machine center; size is the circle diameter.
// Desktop units follow machine width. Mobile units follow available screen space.
export const introArtwork = [
  {
    id: "waves", projectId: "new-waves", title: "New Waves", src: "/projects/new-waves.svg", width: 600, height: 840,
    position: "50% 65%",
    desktop: { x: -1.04, y: -0.62, size: 0.40 },
    mobile: { x: -0.30, y: -0.49, size: 0.17 },
    tilt: -9, duration: 690,
  },
  {
    id: "soft", projectId: "soft-form", title: "Soft Form", src: "/projects/soft-form.svg", width: 600, height: 460,
    desktop: { x: 0.92, y: -0.68, size: 0.28 },
    mobile: { x: 0.29, y: -0.47, size: 0.14 },
    tilt: 8, duration: 620,
  },
  {
    id: "orbit", projectId: "orbit-studio", title: "Orbit Studio", src: "/projects/orbit-studio.svg", width: 600, height: 600,
    desktop: { x: -1.50, y: 0.02, size: 0.53 },
    mobile: { x: -0.385, y: -0.03, size: 0.165 },
    tilt: -5, duration: 790,
  },
  {
    id: "play", projectId: "play-every-day", title: "Play Every Day", src: "/projects/play-every-day.svg", width: 600, height: 480,
    desktop: { x: 1.49, y: -0.02, size: 0.43 },
    mobile: { x: 0.40, y: 0, size: 0.14 },
    tilt: 12, duration: 760,
  },
  {
    id: "field", projectId: "field-notes", title: "Field Notes", src: "/projects/field-notes.svg", width: 600, height: 800,
    desktop: { x: -0.82, y: 0.72, size: 0.45 },
    mobile: { x: -0.34, y: 0.46, size: 0.21 },
    tilt: -8, duration: 820,
  },
  {
    id: "type", projectId: "type-matters", title: "Type Matters", src: "/projects/type-matters.svg", width: 600, height: 810,
    desktop: { x: 0.12, y: 1.02, size: 0.26 },
    mobile: { x: -0.08, y: 0.63, size: 0.135 },
    tilt: 7, duration: 700,
  },
  {
    id: "good", projectId: "good-things", title: "Good Things", src: "/projects/good-things.svg", width: 600, height: 360,
    desktop: { x: 1.04, y: 0.73, size: 0.63 },
    mobile: { x: 0.29, y: 0.54, size: 0.28 },
    tilt: 5, duration: 900,
  },
];
