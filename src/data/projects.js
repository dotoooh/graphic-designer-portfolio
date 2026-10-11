/**
 * All project copy and media live here. These original sample SVGs are placeholders.
 * Replace src paths with files in public/projects and update their intrinsic dimensions.
 * For reel media: { type: 'mp4', src: '/projects/film.mp4', poster: '/projects/poster.jpg' }
 * or { type: 'vimeo', src: 'https://player.vimeo.com/video/VIDEO_ID' }
 * or { type: 'youtube', src: 'https://www.youtube.com/embed/VIDEO_ID' }.
 */
export const categories = ["All", "Branding", "Editorial", "Poster", "Motion"];

export const projects = [
  {
    id: "new-waves",
    title: "New Waves",
    category: "Poster",
    description:
      "새로운 시선의 리듬. 타이포그래피와 반복되는 파형을 바탕으로 만든 그래픽 전시 캠페인입니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "scroll",
    isPlaceholder: true,
    cover: {
      src: "/projects/new-waves.svg",
      alt: "New Waves 임시 디자인 작업물",
      width: 600,
      height: 840,
    },
    images: [
      {
        src: "/projects/new-waves.svg",
        alt: "New Waves 대표 이미지",
        width: 600,
        height: 840,
      },
      {
        src: "/projects/new-waves-detail.svg",
        alt: "New Waves 그래픽 상세 이미지",
        width: 600,
        height: 840,
      },
      {
        src: "/projects/new-waves-application.svg",
        alt: "New Waves 응용 디자인 이미지",
        width: 600,
        height: 840,
      },
    ],
  },
  {
    id: "orbit-studio",
    title: "Orbit Studio",
    category: "Branding",
    description:
      "끊임없이 움직이는 아이디어를 위한 브랜드. 서로 교차하는 궤도와 유연한 컬러 시스템으로 독립 스튜디오의 정체성을 표현했습니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "carousel",
    isPlaceholder: true,
    cover: {
      src: "/projects/orbit-studio.svg",
      alt: "Orbit Studio 임시 디자인 작업물",
      width: 600,
      height: 600,
    },
    images: [
      {
        src: "/projects/orbit-studio.svg",
        alt: "Orbit Studio 대표 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/orbit-studio-detail.svg",
        alt: "Orbit Studio 그래픽 상세 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/orbit-studio-application.svg",
        alt: "Orbit Studio 응용 디자인 이미지",
        width: 600,
        height: 580,
      },
    ],
  },
  {
    id: "good-things",
    title: "Good Things",
    category: "Motion",
    description:
      "좋은 일이 시작되는 순간의 경쾌함. 단순한 형태와 대담한 타이포그래피로 일상 속 작은 에너지를 담았습니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "reel",
    isPlaceholder: true,
    cover: {
      src: "/projects/good-things.svg",
      alt: "Good Things 임시 디자인 작업물",
      width: 600,
      height: 360,
    },
    images: [
      {
        src: "/projects/good-things.svg",
        alt: "Good Things 대표 이미지",
        width: 600,
        height: 360,
      },
      {
        src: "/projects/good-things-detail.svg",
        alt: "Good Things 그래픽 상세 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/good-things-application.svg",
        alt: "Good Things 응용 디자인 이미지",
        width: 600,
        height: 580,
      },
    ],
    media: {
      type: "placeholder",
      src: "/projects/good-things-reel.svg",
      poster: "/projects/good-things-reel.svg",
      alt: "Good Things 세로형 임시 모션 아트워크",
    },
  },
  {
    id: "type-matters",
    title: "Type Matters",
    category: "Editorial",
    description:
      "글자는 메시지이자 이미지입니다. 크기와 대비, 여백의 관계를 탐구한 실험적 서체 견본집입니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "scroll",
    isPlaceholder: true,
    cover: {
      src: "/projects/type-matters.svg",
      alt: "Type Matters 임시 디자인 작업물",
      width: 600,
      height: 810,
    },
    images: [
      {
        src: "/projects/type-matters.svg",
        alt: "Type Matters 대표 이미지",
        width: 600,
        height: 810,
      },
      {
        src: "/projects/type-matters-detail.svg",
        alt: "Type Matters 그래픽 상세 이미지",
        width: 600,
        height: 840,
      },
      {
        src: "/projects/type-matters-application.svg",
        alt: "Type Matters 응용 디자인 이미지",
        width: 600,
        height: 840,
      },
    ],
  },
  {
    id: "midnight-film",
    title: "Midnight Film",
    category: "Branding",
    description:
      "불이 꺼진 뒤 시작되는 이야기. 독립 영화제의 시각 언어를 빛의 잔상과 프레임의 반복으로 풀어냈습니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "carousel",
    isPlaceholder: true,
    cover: {
      src: "/projects/midnight-film.svg",
      alt: "Midnight Film 임시 디자인 작업물",
      width: 600,
      height: 510,
    },
    images: [
      {
        src: "/projects/midnight-film.svg",
        alt: "Midnight Film 대표 이미지",
        width: 600,
        height: 510,
      },
      {
        src: "/projects/midnight-film-detail.svg",
        alt: "Midnight Film 그래픽 상세 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/midnight-film-application.svg",
        alt: "Midnight Film 응용 디자인 이미지",
        width: 600,
        height: 580,
      },
    ],
  },
  {
    id: "move-with-it",
    title: "Move With It",
    category: "Motion",
    description:
      "움직임이 만드는 새로운 관점. 타이포그래피와 순환하는 곡선을 활용한 키네틱 그래픽 실험입니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "reel",
    isPlaceholder: true,
    cover: {
      src: "/projects/move-with-it.svg",
      alt: "Move With It 임시 디자인 작업물",
      width: 600,
      height: 810,
    },
    images: [
      {
        src: "/projects/move-with-it.svg",
        alt: "Move With It 대표 이미지",
        width: 600,
        height: 810,
      },
      {
        src: "/projects/move-with-it-detail.svg",
        alt: "Move With It 그래픽 상세 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/move-with-it-application.svg",
        alt: "Move With It 응용 디자인 이미지",
        width: 600,
        height: 580,
      },
    ],
    media: {
      type: "placeholder",
      src: "/projects/move-with-it-reel.svg",
      poster: "/projects/move-with-it-reel.svg",
      alt: "Move With It 세로형 임시 모션 아트워크",
    },
  },
  {
    id: "open-minds",
    title: "Open Minds",
    category: "Editorial",
    description:
      "서로 다른 생각이 만나는 문화 저널. 강한 타이포그래피와 열린 원형 구조로 호기심과 가능성을 표현했습니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "scroll",
    isPlaceholder: true,
    cover: {
      src: "/projects/open-minds.svg",
      alt: "Open Minds 임시 디자인 작업물",
      width: 600,
      height: 680,
    },
    images: [
      {
        src: "/projects/open-minds.svg",
        alt: "Open Minds 대표 이미지",
        width: 600,
        height: 680,
      },
      {
        src: "/projects/open-minds-detail.svg",
        alt: "Open Minds 그래픽 상세 이미지",
        width: 600,
        height: 840,
      },
      {
        src: "/projects/open-minds-application.svg",
        alt: "Open Minds 응용 디자인 이미지",
        width: 600,
        height: 840,
      },
    ],
  },
  {
    id: "soft-form",
    title: "Soft Form",
    category: "Branding",
    description:
      "조금 더 다정한 일상의 사물들. 부드러운 형태와 절제된 컬러를 활용해 라이프스타일 브랜드의 인상을 정리했습니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "carousel",
    isPlaceholder: true,
    cover: {
      src: "/projects/soft-form.svg",
      alt: "Soft Form 임시 디자인 작업물",
      width: 600,
      height: 460,
    },
    images: [
      {
        src: "/projects/soft-form.svg",
        alt: "Soft Form 대표 이미지",
        width: 600,
        height: 460,
      },
      {
        src: "/projects/soft-form-detail.svg",
        alt: "Soft Form 그래픽 상세 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/soft-form-application.svg",
        alt: "Soft Form 응용 디자인 이미지",
        width: 600,
        height: 580,
      },
    ],
  },
  {
    id: "second-life",
    title: "Second Life",
    category: "Motion",
    description:
      "끝이 새로운 시작이 되는 순환의 이야기. 반복되고 다시 피어나는 형태를 중심으로 만든 모션 캠페인입니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "reel",
    isPlaceholder: true,
    cover: {
      src: "/projects/second-life.svg",
      alt: "Second Life 임시 디자인 작업물",
      width: 600,
      height: 960,
    },
    images: [
      {
        src: "/projects/second-life.svg",
        alt: "Second Life 대표 이미지",
        width: 600,
        height: 960,
      },
      {
        src: "/projects/second-life-detail.svg",
        alt: "Second Life 그래픽 상세 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/second-life-application.svg",
        alt: "Second Life 응용 디자인 이미지",
        width: 600,
        height: 580,
      },
    ],
    media: {
      type: "placeholder",
      src: "/projects/second-life-reel.svg",
      poster: "/projects/second-life-reel.svg",
      alt: "Second Life 세로형 임시 모션 아트워크",
    },
  },
  {
    id: "seoul-design-week",
    title: "Seoul Design Week",
    category: "Poster",
    description:
      "새로운 아이디어를 향해 시선을 넓히는 디자인 축제. 선명한 색과 방향성을 가진 그래픽으로 도시의 창의적인 에너지를 담았습니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "scroll",
    isPlaceholder: true,
    cover: {
      src: "/projects/seoul-design-week.svg",
      alt: "Seoul Design Week 임시 디자인 작업물",
      width: 600,
      height: 690,
    },
    images: [
      {
        src: "/projects/seoul-design-week.svg",
        alt: "Seoul Design Week 대표 이미지",
        width: 600,
        height: 690,
      },
      {
        src: "/projects/seoul-design-week-detail.svg",
        alt: "Seoul Design Week 그래픽 상세 이미지",
        width: 600,
        height: 840,
      },
      {
        src: "/projects/seoul-design-week-application.svg",
        alt: "Seoul Design Week 응용 디자인 이미지",
        width: 600,
        height: 840,
      },
    ],
  },
  {
    id: "field-notes",
    title: "Field Notes",
    category: "Editorial",
    description:
      "자세히 바라보면 발견되는 작은 이야기들. 관찰의 흔적을 기록하는 저널을 위한 편집 디자인과 시각 시스템입니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "carousel",
    isPlaceholder: true,
    cover: {
      src: "/projects/field-notes.svg",
      alt: "Field Notes 임시 디자인 작업물",
      width: 600,
      height: 800,
    },
    images: [
      {
        src: "/projects/field-notes.svg",
        alt: "Field Notes 대표 이미지",
        width: 600,
        height: 800,
      },
      {
        src: "/projects/field-notes-detail.svg",
        alt: "Field Notes 그래픽 상세 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/field-notes-application.svg",
        alt: "Field Notes 응용 디자인 이미지",
        width: 600,
        height: 580,
      },
    ],
  },
  {
    id: "play-every-day",
    title: "Play Every Day",
    category: "Motion",
    description:
      "놀이처럼 가볍게 시작하는 창의적인 하루. 기초적인 도형과 유쾌한 컬러 조합으로 브랜드의 움직임을 만들었습니다. 현재 이미지는 레이아웃 확인을 위한 임시 작업물입니다.",
    year: "2025",
    type: "reel",
    isPlaceholder: true,
    cover: {
      src: "/projects/play-every-day.svg",
      alt: "Play Every Day 임시 디자인 작업물",
      width: 600,
      height: 480,
    },
    images: [
      {
        src: "/projects/play-every-day.svg",
        alt: "Play Every Day 대표 이미지",
        width: 600,
        height: 480,
      },
      {
        src: "/projects/play-every-day-detail.svg",
        alt: "Play Every Day 그래픽 상세 이미지",
        width: 600,
        height: 600,
      },
      {
        src: "/projects/play-every-day-application.svg",
        alt: "Play Every Day 응용 디자인 이미지",
        width: 600,
        height: 580,
      },
    ],
    media: {
      type: "placeholder",
      src: "/projects/play-every-day-reel.svg",
      poster: "/projects/play-every-day-reel.svg",
      alt: "Play Every Day 세로형 임시 모션 아트워크",
    },
  },
];
