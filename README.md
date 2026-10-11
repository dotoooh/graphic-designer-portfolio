# GetMore — Graphic designer portfolio

Vite + React로 구현한 반응형 그래픽 디자인 포트폴리오입니다. API나 로그인 없이 실행됩니다.

## 실행

Node.js 22.12 이상이 필요합니다. 클라우드 환경에서는 Node.js 24.19로 검증했습니다.

```sh
npm ci
npm run dev
```

개발 서버는 5173 포트에서 실행됩니다. `npm run build`로 배포 파일을 `dist/`에 생성하고, `npm run preview`로 빌드 결과를 실행할 수 있습니다. npm 캐시는 저장소의 무시되는 `.npm-cache/`에 저장되어 클라우드 환경의 홈 디렉터리 쓰기 권한이 필요하지 않습니다.

## 화면과 동작

- 인트로: `main1-1.png` 배경 위에 `main1-2.png` 기계를 중앙 배치합니다. 두 원본 PNG는 수정하지 않았습니다. `main1.png`는 사용하지 않습니다.
- 기계의 사각형 배경은 SVG 외곽 마스크로 제외합니다. 이미지는 파일 경로로 참조하며 Base64로 삽입하지 않습니다. 작은 화면에는 글자와 기계를 위아래로 배치하고, 넓은 화면에는 겹쳐 배치합니다.
- 데스크톱 유리 영역 hover, 기계 터치/클릭, 포커스 후 Enter/Space로 실행합니다. 볼 1.35초 → 손잡이 한 바퀴 0.7초 → 유리 중심 줌/블러 0.67초 순서입니다. 실행 중 재입력을 무시합니다.
- 움직이는 볼은 유리 영역 안에 마스킹됩니다. 원본의 정적인 볼과 손잡이는 CSS 볼과 원본 이미지를 참조하는 회전 레이어로 재현합니다. 시스템의 모션 감소 설정에서는 0.22초 페이드로 대체합니다.
- 작업물: 다양한 비율의 샘플 12개, 화면 너비에 따른 2/3/4열 masonry와 분야 필터. 데스크톱 카드 hover에서는 미세한 확대와 밝기 변화가 있습니다.
- 팝업: 여러 세로 이미지 스크롤, 버튼·방향키·손가락 스와이프 캐러셀, 9:16 릴스 미디어. X/Esc/바깥 영역으로 닫으며 작업 목록의 스크롤 위치와 카드 포커스를 복원합니다. 배경 스크롤과 포커스는 잠깁니다.
- `#intro`, `#work`, `#work/작업-id` 주소를 사용합니다. 브라우저 뒤로가기/앞으로가기는 인트로, 작업 목록, 팝업을 따라 이동합니다. 작업 링크로 직접 접근할 수도 있습니다.

## 작업물 교체

모든 작업물은 `src/data/projects.js` 한 곳에서 관리합니다. 임시 SVG 파일은 `public/projects/`에 있습니다. 실제 JPG/PNG/WebP/SVG/MP4 파일을 이 디렉터리에 넣고 `/projects/파일명` 경로를 지정하면 됩니다.

```js
{
  id: 'my-project',
  title: '프로젝트 제목',
  category: 'Branding', // categories 목록도 같은 파일에서 수정
  description: '프로젝트 설명',
  year: '2026',
  type: 'carousel', // 'scroll' | 'carousel' | 'reel'
  isPlaceholder: false,
  cover: { src: '/projects/cover.webp', alt: '표지 설명', width: 1200, height: 1600 },
  images: [
    { src: '/projects/detail-1.webp', alt: '상세 이미지 설명', width: 1200, height: 1600 },
    { src: '/projects/detail-2.webp', alt: '상세 이미지 설명', width: 1200, height: 1600 },
  ],
}
```

`cover.width`와 `cover.height`는 원본 이미지 크기와 일치시키세요. 작품은 늘어나거나 잘리지 않도록 원래 비율로 표시됩니다. 릴스의 `media`는 아래 중 하나로 바꿀 수 있습니다. 실제 영상은 현재 포함되어 있지 않습니다.

```js
media: { type: 'mp4', src: '/projects/film.mp4', poster: '/projects/film-poster.webp' }
media: { type: 'vimeo', src: 'https://vimeo.com/123456789' }
media: { type: 'youtube', src: 'https://www.youtube.com/watch?v=VIDEO_ID' }
```

## GitHub Pages 배포

`main`에 push하면 `.github/workflows/deploy-pages.yml`이 의존성을 설치하고 사이트를 빌드한 뒤 GitHub Pages로 배포합니다. 저장소 이름에 맞춘 Vite 경로(`/graphic-designer-portfolio/`)와 작품 이미지 경로도 지원합니다. GitHub 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택하면 배포를 사용할 수 있습니다.

배포가 완료되면 Actions의 `Deploy to GitHub Pages` 실행에 실제 사이트 URL이 표시됩니다.

인트로 이미지 구도를 교체하면 `src/components/Intro.jsx`의 SVG 외곽선·유리·손잡이 좌표도 새 구도에 맞게 조정해야 합니다. 기계 PNG의 현재 실제 영역은 전체 2560×1440 이미지 중 중앙의 작은 영역이므로 원본 전체를 늘리지 않고 SVG viewBox로 표시합니다.

## 브라우저 검사

```sh
npm run test:e2e
```

Playwright가 실제 Chromium을 실행해 데스크톱·태블릿·모바일의 인트로, 순서/중복 실행 방지, 모션 감소, 팝업 3종, 닫기/스크롤/포커스 복원, 캐러셀 버튼·방향키·네이티브 터치 스와이프, 브라우저 히스토리, 이미지 비율을 검사합니다. 추가로 320px 작은 화면부터 2560px 화면과 가로 방향도 점검합니다. 결과 화면은 무시되는 `test-results/`에 저장됩니다.

클라우드에 설치된 `/usr/bin/chromium`을 기본으로 사용합니다. 다른 환경에서는 `npx playwright install chromium`으로 Playwright 브라우저를 설치하거나 `CHROMIUM_PATH`로 실행 파일을 지정하세요. 모바일 검사는 Chromium의 기기/터치 에뮬레이션이며 실제 iOS Safari 검사는 별도입니다.
