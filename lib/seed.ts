import type { CmsContent, OrderIntent } from "./types";

export const imageOptions = [
  "/images/skeleton_beach.jpg",
  "/images/skeleton_lightning.jpg",
  "/images/guitar.jpg",
  "/images/synth.jpg",
  "/images/my_record.jpg",
  "/images/hc.jpg",
  "/images/qz.jpg",
  "/images/alien_ufo.JPG",
  "/images/crow_beach.JPG",
  "/images/dino_run.JPG",
  "/images/moth_woman.JPG",
  "/images/ribcage_border.JPG",
  "/images/ribcage_detail.JPG",
  "/images/skeleton_stand.JPG",
  "/images/trex_wave.JPG"
];

export const defaultContent: CmsContent = {
  songs: [
    {
      id: "arakawa",
      title: { en: "Arakawa", zh: "荒川" },
      duration: "03:42",
      release: "DISCONNECT+ / Field Recording",
      audioUrl: "/audio/荒川.mp3",
      lyrics: {
        en: "A river of static, a station with no name.",
        zh: "静电般的河流，一座没有名字的车站。"
      },
      links: [
        { label: "Bandcamp", url: "#" },
        { label: "NetEase Cloud", url: "#" }
      ],
      featured: true
    },
    {
      id: "amusement-park",
      title: { en: "Amusement Park", zh: "游园地" },
      duration: "04:15",
      release: "Noise Box Session",
      audioUrl: "/audio/游园地.mp3",
      lyrics: {
        en: "Lights blink in circles until the exit disappears.",
        zh: "灯光循环闪烁，直到出口消失。"
      },
      links: [
        { label: "Bandcamp", url: "#" },
        { label: "QQ Music", url: "#" }
      ],
      featured: true
    }
  ],
  news: [
    {
      id: "disconnect-ecosystem",
      date: "2026-08-30",
      category: { en: "Archive", zh: "档案" },
      title: {
        en: "DISCONNECT+ expands into a sound ecosystem",
        zh: "DISCONNECT+ 转为声音生态档案"
      },
      summary: {
        en: "The site now connects the band, free open-source DISCONNECT audio plugins, Noise Box in Kunming, and Field Electric Noise outdoor activity.",
        zh: "网站开始同时记录乐队、免费开源的 DISCONNECT 音频插件、昆明 Noise Box，以及野外电燥活动。"
      },
      pinned: true
    },
    {
      id: "noise-box-weekly",
      date: "2026-09-05",
      category: { en: "Noise Box", zh: "Noise Box" },
      title: {
        en: "Weekly electronic improvisation at Noise Box",
        zh: "Noise Box 每周电子音乐即兴"
      },
      summary: {
        en: "Every Friday or Saturday from 21:00 to 22:30 at Noise Box, inside 871 Cultural and Creative Factory in Kunming.",
        zh: "每周五或周六 21:00-22:30，在云南昆明 871文化创意工厂 Noise Box 发生。"
      },
      pinned: true
    },
    {
      id: "plugin-brand",
      date: "2026-09-12",
      category: { en: "Plugins", zh: "插件" },
      title: {
        en: "THE BUREAUCRAT and PiGen2 are free open-source releases",
        zh: "THE BUREAUCRAT 与 PiGen2 免费开源发布"
      },
      summary: {
        en: "Both plugin projects are public on GitHub, with source code, documentation, and future release notes collected here.",
        zh: "两个插件项目都已公开在 GitHub，源码、文档和后续发布记录会收进这个档案。"
      },
      pinned: false
    },
    {
      id: "field-electric-noise",
      date: "2026-09-20",
      category: { en: "Field Noise", zh: "野外电燥" },
      title: {
        en: "Field Electric Noise prepares the next outdoor transmission",
        zh: "野外电燥准备下一次户外传输"
      },
      summary: {
        en: "The outdoor electric-noise activity happens irregularly and requires advance signup.",
        zh: "野外电燥不定期举行，需要提前报名。"
      },
      pinned: false
    }
  ],
  plugins: [
    {
      id: "the-bureaucrat",
      name: { en: "THE BUREAUCRAT", zh: "THE BUREAUCRAT" },
      type: {
        en: "AU / VST3 saturation and intervention effect",
        zh: "AU / VST3 饱和与干预效果器"
      },
      status: { en: "Free / open source / AGPL-3.0", zh: "免费发布 / 开源 / AGPL-3.0" },
      description: {
        en: "A Pravda Audio / DISCONNECT audio effect for asymmetric drive, timing disruption, phase interference, filtering, overload control, and long feedback delay.",
        zh: "Pravda Audio / DISCONNECT audio 的声音效果器，用于非对称驱动、时间扰动、相位干涉、滤波、过载控制和长反馈延迟。"
      },
      imageUrl: "/images/synth.jpg",
      repoUrl: "https://github.com/levittliwenye-eng/the-bureaucrat",
      active: true,
      links: [
        { label: "GitHub", url: "https://github.com/levittliwenye-eng/the-bureaucrat" }
      ]
    },
    {
      id: "pigen2",
      name: { en: "PiGen2", zh: "PiGen2" },
      type: {
        en: "Max for Live MIDI sequencer",
        zh: "Max for Live MIDI 序列器"
      },
      status: { en: "Free / open source / MIT", zh: "免费发布 / 开源 / MIT" },
      description: {
        en: "A deterministic pi-driven MIDI sequencer for Ableton Live, mapping positions in pi into pitch, rhythm, gate, velocity, scales, and transport-synced patterns.",
        zh: "一个由圆周率驱动的 Ableton Live MIDI 序列器，把 π 的位置映射为音高、节奏、门限、力度、音阶和同步图案。"
      },
      imageUrl: "/images/qz.jpg",
      repoUrl: "https://github.com/levittliwenye-eng/pigen2",
      active: true,
      links: [
        { label: "GitHub", url: "https://github.com/levittliwenye-eng/pigen2" },
        { label: "Releases", url: "https://github.com/levittliwenye-eng/pigen2/releases" }
      ]
    }
  ],
  visuals: [
    {
      id: "skeleton-beach",
      title: { en: "Skeleton Beach", zh: "骸骨海滩" },
      type: { en: "Visual field note", zh: "视觉田野笔记" },
      imageUrl: "/images/skeleton_beach.jpg",
      description: {
        en: "An opening image for the band myth: shore, remains, and signal loss.",
        zh: "乐队神话的开场图像：岸边、残骸，以及信号丢失。"
      }
    },
    {
      id: "lightning",
      title: { en: "Lightning Figure", zh: "闪电人像" },
      type: { en: "Artwork", zh: "画作" },
      imageUrl: "/images/skeleton_lightning.jpg",
      description: {
        en: "A charged body caught between ritual and circuit.",
        zh: "一具被困在仪式与电路之间的带电身体。"
      }
    },
    {
      id: "ufo",
      title: { en: "UFO Contact Sheet", zh: "飞碟接触表" },
      type: { en: "Archive", zh: "档案" },
      imageUrl: "/images/alien_ufo.JPG",
      description: {
        en: "A soft invasion from the image archive.",
        zh: "来自图像档案的一次柔软入侵。"
      }
    },
    {
      id: "trex",
      title: { en: "T-Rex Wave", zh: "霸王龙挥手" },
      type: { en: "Poster fragment", zh: "海报碎片" },
      imageUrl: "/images/trex_wave.JPG",
      description: {
        en: "Playful ruin, fossil noise, and a wave from another room.",
        zh: "玩笑般的废墟、化石噪音，以及从另一间房里传来的招手。"
      }
    },
    {
      id: "noise-box-room",
      title: { en: "Noise Box Room", zh: "Noise Box 房间" },
      type: { en: "Venue signal", zh: "场地信号" },
      imageUrl: "/images/synth.jpg",
      description: {
        en: "A Kunming room inside 871 Cultural and Creative Factory, active on Friday or Saturday nights.",
        zh: "云南昆明 871文化创意工厂里的房间，周五或周六夜晚发生电子音乐即兴。"
      }
    },
    {
      id: "field-electric-noise",
      title: { en: "Field Electric Noise", zh: "野外电燥" },
      type: { en: "Outdoor activity", zh: "户外活动" },
      imageUrl: "/images/crow_beach.JPG",
      description: {
        en: "Irregular outdoor activity by advance signup, with weather, ground, power, and distance entering the sound.",
        zh: "不定期、提前报名的户外活动，让天气、地面、电源和距离进入声音。"
      }
    }
  ],
  members: [
    {
      id: "kunbo",
      name: { en: "Kunbo", zh: "琨波" },
      role: {
        en: "Guitar / Synth / Visuals",
        zh: "吉他 / 合成器 / 视觉"
      },
      imageUrl: "/images/guitar.jpg",
      bio: {
        en: "Builds brittle guitar structures and folds visual noise into the live system.",
        zh: "搭建易碎的吉他结构，把视觉噪声折进现场系统。"
      }
    },
    {
      id: "wenye",
      name: { en: "Wenye", zh: "文野" },
      role: {
        en: "Guitar / Synth / Production",
        zh: "吉他 / 合成器 / 制作"
      },
      imageUrl: "/images/synth.jpg",
      bio: {
        en: "Shapes the low-frequency weather and keeps the machine dreaming in time.",
        zh: "塑造低频天气，让机器按时做梦。"
      }
    }
  ],
  shows: [
    {
      id: "noise-box-weekly",
      date: "2026-09-05",
      city: { en: "Kunming, Yunnan", zh: "云南昆明" },
      venue: {
        en: "Noise Box / 871 Cultural and Creative Factory",
        zh: "Noise Box / 871文化创意工厂"
      },
      title: { en: "Friday or Saturday Electronic Improvisation", zh: "周五或周六电子音乐即兴" },
      ticketUrl: "#store",
      status: "upcoming"
    },
    {
      id: "field-noise-outdoor",
      date: "2026-09-20",
      city: { en: "Outdoor / advance signup", zh: "户外 / 提前报名" },
      venue: { en: "Field Electric Noise site / irregular", zh: "野外电燥现场 / 不定期" },
      title: { en: "Field Electric Noise", zh: "野外电燥" },
      ticketUrl: "#store",
      status: "secret"
    },
    {
      id: "basement-recap",
      date: "2026-05-12",
      city: { en: "Kunming, Yunnan", zh: "云南昆明" },
      venue: { en: "Noise Box / 871 Cultural and Creative Factory", zh: "Noise Box / 871文化创意工厂" },
      title: { en: "Private Transmission", zh: "私人传输" },
      status: "past"
    }
  ],
  products: [
    {
      id: "the-bureaucrat-plugin",
      name: { en: "THE BUREAUCRAT", zh: "THE BUREAUCRAT" },
      type: { en: "AU / VST3 plugin", zh: "AU / VST3 插件" },
      price: "Free",
      availability: { en: "Free release / open source", zh: "免费发布 / 全开源" },
      imageUrl: "/images/synth.jpg",
      stock: 999,
      active: true,
      externalUrl: "https://github.com/levittliwenye-eng/the-bureaucrat"
    },
    {
      id: "pigen2-plugin",
      name: { en: "PiGen2", zh: "PiGen2" },
      type: { en: "Max for Live MIDI sequencer", zh: "Max for Live MIDI 序列器" },
      price: "Free",
      availability: { en: "Free release / open source", zh: "免费发布 / 全开源" },
      imageUrl: "/images/qz.jpg",
      stock: 999,
      active: true,
      externalUrl: "https://github.com/levittliwenye-eng/pigen2/releases"
    },
    {
      id: "noise-box-session-ticket",
      name: { en: "Noise Box Weekly Session Signup", zh: "Noise Box 每周即兴报名" },
      type: { en: "Friday or Saturday / 21:00-22:30", zh: "周五或周六 / 21:00-22:30" },
      price: "Open",
      availability: { en: "Advance signup open", zh: "提前报名开放" },
      imageUrl: "/images/guitar.jpg",
      stock: 30,
      active: true
    },
    {
      id: "field-electric-noise-signup",
      name: { en: "Field Electric Noise Signup", zh: "野外电燥提前报名" },
      type: { en: "Irregular outdoor activity", zh: "不定期户外活动" },
      price: "Open",
      availability: { en: "Advance signup required", zh: "需提前报名" },
      imageUrl: "/images/crow_beach.JPG",
      stock: 30,
      active: true
    },
    {
      id: "self-titled-ep",
      name: { en: "DISCONNECT+ Self-titled EP", zh: "DISCONNECT+ 同名 EP" },
      type: { en: "EP / Physical", zh: "迷你专辑 / 实体" },
      price: "Reserve",
      availability: { en: "Reservation open", zh: "预约开放" },
      imageUrl: "/images/my_record.jpg",
      stock: 18,
      active: true
    },
    {
      id: "ritual-tee",
      name: { en: "Ritual Tee", zh: "仪式感 T恤" },
      type: { en: "Apparel", zh: "服饰" },
      price: "Reserve",
      availability: { en: "Reservation open", zh: "预约开放" },
      imageUrl: "/images/hc.jpg",
      stock: 24,
      active: true
    },
    {
      id: "signal-hoodie",
      name: { en: "Signal Loss Hoodie", zh: "信号丢失卫衣" },
      type: { en: "Apparel", zh: "服饰" },
      price: "Reserve",
      availability: { en: "Reservation open", zh: "预约开放" },
      imageUrl: "/images/skeleton_lightning.jpg",
      stock: 8,
      active: true
    },
    {
      id: "archive-print",
      name: { en: "Archive Print", zh: "档案画作" },
      type: { en: "Print", zh: "海报 / 画作" },
      price: "Reserve",
      availability: { en: "Reservation open", zh: "预约开放" },
      imageUrl: "/images/qz.jpg",
      stock: 12,
      active: true
    }
  ],
  settings: {
    contactEmail: "disconnectaudio@sina.com",
    bookingEmail: "disconnectaudio@sina.com",
    location: {
      en: "Kunming, Yunnan / Noise Box / 871 Cultural and Creative Factory / Field",
      zh: "云南昆明 / Noise Box / 871文化创意工厂 / 野外"
    },
    socials: [
      { label: "Email", url: "mailto:disconnectaudio@sina.com" },
      { label: "THE BUREAUCRAT GitHub", url: "https://github.com/levittliwenye-eng/the-bureaucrat" },
      { label: "PiGen2 GitHub", url: "https://github.com/levittliwenye-eng/pigen2" }
    ]
  }
};

export const defaultOrders: OrderIntent[] = [
  {
    id: "demo-order",
    productId: "self-titled-ep",
    productName: "DISCONNECT+ Self-titled EP",
    quantity: 1,
    customerName: "Demo Listener",
    contact: "demo@example.com",
    notes: "Local demo order. Replace with Cloudflare D1 in production.",
    status: "new",
    createdAt: "2026-04-01T10:00:00.000Z"
  }
];
