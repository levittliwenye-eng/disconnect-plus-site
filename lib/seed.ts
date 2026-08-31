import type { CmsContent, OrderIntent } from "./types";

export const imageOptions = [
  "/images/skeleton_beach.jpg",
  "/images/skeleton_lightning.jpg",
  "/images/guitar.jpg",
  "/images/synth.jpg",
  "/images/the-bureaucrat-plugin.png",
  "/images/pigen2-plugin.png",
  "/images/visuals/ocular-broadcast.jpg",
  "/images/visuals/skeleton-studio.jpg",
  "/images/visuals/octopus-console.jpg",
  "/images/visuals/black-duo-console.jpg",
  "/images/visuals/masked-mixers.jpg",
  "/images/visuals/red-skeleton-console.jpg",
  "/images/visuals/red-crow-poster.jpg",
  "/images/visuals/door-skeleton-poster.jpg",
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
        en: "The site now connects the band, independent DISCONNECT audio plugins, Noise Box in Kunming, and Wilderness Noise outdoor activity.",
        zh: "网站开始同时记录乐队、独立的 DISCONNECT 音频插件、昆明 Noise Box，以及荒野噪音活动。"
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
        en: "THE BUREAUCRAT and PiGen2 are public plugin releases",
        zh: "THE BUREAUCRAT 与 PiGen2 公开发布"
      },
      summary: {
        en: "Both plugin projects are public on GitHub, with source code, documentation, and future release notes collected here.",
        zh: "两个插件项目都已公开在 GitHub，源码、文档和后续发布记录会收进这个档案。"
      },
      pinned: false
    },
    {
      id: "wilderness-noise",
      date: "2026-09-20",
      category: { en: "Wilderness Noise", zh: "荒野噪音" },
      title: {
        en: "Wilderness Noise prepares the next outdoor transmission",
        zh: "荒野噪音准备下一次户外传输"
      },
      summary: {
        en: "The outdoor noise activity happens irregularly and requires advance signup.",
        zh: "荒野噪音不定期举行，需要提前报名。"
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
      imageUrl: "/images/the-bureaucrat-plugin.png",
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
      imageUrl: "/images/pigen2-plugin.png",
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
      id: "wilderness-noise",
      title: { en: "Wilderness Noise", zh: "荒野噪音" },
      type: { en: "Outdoor activity", zh: "户外活动" },
      imageUrl: "/images/crow_beach.JPG",
      description: {
        en: "Irregular outdoor activity by advance signup, with weather, ground, power, and distance entering the sound.",
        zh: "不定期、提前报名的户外活动，让天气、地面、电源和距离进入声音。"
      }
    },
    {
      id: "ocular-broadcast",
      title: { en: "Ocular Broadcast", zh: "目镜广播" },
      type: { en: "Artwork", zh: "画作" },
      imageUrl: "/images/visuals/ocular-broadcast.jpg",
      description: {
        en: "A bright receiver image for the softer side of the signal archive.",
        zh: "偏柔和的信号接收图像，适合放在视觉档案里作为彩色入口。"
      }
    },
    {
      id: "skeleton-studio",
      title: { en: "Skeleton Studio", zh: "骸骨工作室" },
      type: { en: "Noise Box image", zh: "Noise Box 图像" },
      imageUrl: "/images/visuals/skeleton-studio.jpg",
      description: {
        en: "A seated figure, machines, and a small room that reads close to the Noise Box world.",
        zh: "骸骨、机器和小房间，和 Noise Box 的现场气质更接近。"
      }
    },
    {
      id: "octopus-console",
      title: { en: "Octopus Console", zh: "章鱼控制台" },
      type: { en: "Artwork", zh: "画作" },
      imageUrl: "/images/visuals/octopus-console.jpg",
      description: {
        en: "Surreal hands on a console, useful for the stranger electronic side of the archive.",
        zh: "触手在控制台上操作，适合对应更怪诞的电子声音部分。"
      }
    },
    {
      id: "black-duo-console",
      title: { en: "Black Duo Console", zh: "黑色双人控制台" },
      type: { en: "Artwork", zh: "画作" },
      imageUrl: "/images/visuals/black-duo-console.jpg",
      description: {
        en: "A darker performance image for improvisation, routing, and shared machinery.",
        zh: "更冷、更暗的合奏图像，对应即兴、接线和共同操作机器。"
      }
    },
    {
      id: "masked-mixers",
      title: { en: "Masked Mixers", zh: "面具混音者" },
      type: { en: "Collective image", zh: "集体图像" },
      imageUrl: "/images/visuals/masked-mixers.jpg",
      description: {
        en: "A visual cue for rotating players and temporary live formations.",
        zh: "适合表示不断变化的乐手阵容和临时现场组合。"
      }
    },
    {
      id: "red-skeleton-console",
      title: { en: "Red Skeleton Console", zh: "红色骸骨控制台" },
      type: { en: "Poster fragment", zh: "海报碎片" },
      imageUrl: "/images/visuals/red-skeleton-console.jpg",
      description: {
        en: "A high-contrast red image for sharper live or release announcements.",
        zh: "强烈的红色图像，可以放进演出、发布和活动视觉系统。"
      }
    },
    {
      id: "red-crow-poster",
      title: { en: "Red Crow Poster", zh: "红色鸟骨海报" },
      type: { en: "Poster", zh: "海报" },
      imageUrl: "/images/visuals/red-crow-poster.jpg",
      description: {
        en: "A DISCONNECT poster mark that keeps the logo direct and rough.",
        zh: "DISCONNECT 的海报标识，直接、粗粝，适合作为标志类档案。"
      }
    },
    {
      id: "door-skeleton-poster",
      title: { en: "Door Skeleton Poster", zh: "门缝骸骨海报" },
      type: { en: "Poster", zh: "海报" },
      imageUrl: "/images/visuals/door-skeleton-poster.jpg",
      description: {
        en: "A spare poster symbol for the project identity and archive spine.",
        zh: "更简洁的项目识别海报，可以作为后续视觉系统的基础。"
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
      id: "wilderness-noise-outdoor",
      date: "2026-09-20",
      city: { en: "Outdoor / advance signup", zh: "户外 / 提前报名" },
      venue: { en: "Wilderness Noise site / irregular", zh: "荒野噪音现场 / 不定期" },
      title: { en: "Wilderness Noise", zh: "荒野噪音" },
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
      imageUrl: "/images/the-bureaucrat-plugin.png",
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
      imageUrl: "/images/pigen2-plugin.png",
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
      id: "wilderness-noise-signup",
      name: { en: "Wilderness Noise Signup", zh: "荒野噪音提前报名" },
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
      imageUrl: "/images/visuals/red-crow-poster.jpg",
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
