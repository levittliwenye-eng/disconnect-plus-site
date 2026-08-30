"use client";

import {
  Archive,
  Cpu,
  ExternalLink,
  Github,
  Globe2,
  Lock,
  Mail,
  MapPin,
  Pause,
  Play,
  PlugZap,
  Radio,
  ShoppingBag,
  Ticket,
  Volume2,
  Zap
} from "lucide-react";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  loadSiteContent,
  submitOrderIntent
} from "@/lib/repository";
import {
  cleanLongText,
  cleanText,
  FIELD_LIMITS,
  isExternalHref,
  normalizeQuantity,
  safeHref,
  safeMediaSrc
} from "@/lib/security";
import { defaultContent } from "@/lib/seed";
import type { CmsContent, LocaleText, Product, Song } from "@/lib/types";

type Lang = "zh" | "en";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: "dark" | "light" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

const ui = {
  zh: {
    nav: {
      nodes: "项目",
      plugins: "插件",
      music: "音乐",
      visuals: "视觉",
      shows: "演出",
      archive: "档案",
      store: "商店"
    },
    heroKicker: "声音项目 / 音频插件 / 场地 / 野外电燥",
    heroCopy:
      "DISCONNECT+ 连接实验电子乐队、免费开源音频插件、昆明 Noise Box，以及不定期发生的野外电燥活动。",
    listen: "立即试听",
    latestSignal: "当前信号",
    nodesLead:
      "这里不是单一乐队页面，而是一组持续发生的声音节点：制作工具、现场空间、每周即兴和野外电声活动互相接线。",
    pluginLead:
      "DISCONNECT audio 的公开插件项目：目前两个插件免费发布并全开源，把现场里反复出现的驱动、干预、随机和序列逻辑做成可以下载、研究和继续改造的声音工具。",
    nodes: [
      {
        title: "DISCONNECT+ 乐队",
        meta: "Experimental electronic band",
        body: "噪音、氛围、合成器、吉他、采样和不同乐手的现场即兴，是整个系统的声音核心。"
      },
      {
        title: "DISCONNECT Plugins",
        meta: "Audio plugin brand",
        body: "把现场里常用的失真、纹理、随机调制和空间处理，发展成免费发布、全开源的声音工具。"
      },
      {
        title: "Noise Box",
        meta: "Weekly improv venue",
        body: "云南昆明 871文化创意工厂里的演出场地，每周五或周六 21:00-22:30 组织电子音乐即兴。"
      },
      {
        title: "野外电燥",
        meta: "Field electric noise",
        body: "不定期举行，提前报名，把电声设备带到户外，在环境噪声和电源限制里做开放现场实验。"
      }
    ],
    musicLead: "试听会混合乐队作品、Noise Box 现场记录和野外电燥采样。后台可以继续添加单曲、歌词、外链和发行信息。",
    visualLead: "把 MV、海报、插件界面、Noise Box 现场照片、画作和野外残片收进同一个视觉档案。",
    showsLead: "Noise Box 固定在周五或周六 21:00-22:30 进行电子音乐即兴；野外电燥不定期举行，需要提前报名。",
    storeLead: "商店/预约已经开放：实体周边、免费开源插件咨询、Noise Box 活动名额和野外电燥报名都可以在这里管理。",
    membersLead: "给媒体、演出方和合作项目使用的乐队介绍与成员档案。",
    bandBioEyebrow: "Press bio",
    bandBioTitle: "实验电子 / 噪音氛围 / 现场即兴",
    bandBioParagraphs: [
      "DISCONNECT+ 是一组围绕实验电子、噪音氛围、声音工具和现场空间持续生长的声音项目。它以乐队现场为核心，合成器、吉他、采样、效果器、打击物、声响装置与不同乐手的即兴反应共同进入同一个系统，在不稳定的结构中生成新的路径。",
      "DISCONNECT 同时延伸为音频插件品牌，把现场中反复出现的失真、随机调制、纹理生成和空间处理整理成免费发布、全开源的声音工具。Noise Box 是项目的线下发生地，位于云南昆明 871文化创意工厂，每周五或周六 21:00-22:30 组织电子音乐即兴、小型演出、设备试验和跨乐手合奏。",
      "野外电燥则把电子设备带离室内，不定期在户外空间举行，并通过提前报名组织参与者。移动电源、环境声、天气和距离会进入声音系统。DISCONNECT+ 接受 Livehouse、艺术空间、影像放映、跨媒介现场、实验音乐活动、插件演示和声音/视觉合作邀请。"
    ],
    bandBioTags: ["noise", "ambient", "plugins", "Noise Box", "field electric noise"],
    newsLead: "动态用于发布新歌、演出、合作和周边补货。",
    orderTitle: "预留 / 购买意向",
    privacyNotice: "提交的信息只用于联系和订单处理；联系方式和订单内容不会公开显示。",
    chooseProduct: "选择物品",
    name: "姓名 / 代号",
    contact: "联系方式",
    quantity: "数量",
    notes: "备注",
    submitOrder: "提交意向",
    orderSent: "订单意向已记录，我们会通过你留下的方式联系。",
    soldOut: "售罄",
    stock: "库存",
    contactBand: "联系 / 合作",
    booking: "演出合作",
    admin: "后台",
    privacy: "隐私说明",
    sourceCode: "源代码",
    open: "打开"
  },
  en: {
    nav: {
      nodes: "Projects",
      plugins: "Plugins",
      music: "Music",
      visuals: "Visuals",
      shows: "Shows",
      archive: "Archive",
      store: "Store"
    },
    heroKicker: "Sound project / audio plugins / venue / field noise",
    heroCopy:
      "DISCONNECT+ connects an experimental electronic band, free open-source audio plugins, Noise Box in Kunming, and irregular Field Electric Noise gatherings.",
    listen: "Listen now",
    latestSignal: "Current signal",
    nodesLead:
      "This is not a single band page, but a live network of sound nodes: tools, rooms, weekly improvisation, and outdoor electric activity feeding each other.",
    pluginLead:
      "Public DISCONNECT audio plugin projects: two free open-source releases turning live drive, intervention, randomness, and sequencing ideas into tools that can be downloaded, studied, and rebuilt.",
    nodes: [
      {
        title: "DISCONNECT+ Band",
        meta: "Experimental electronic band",
        body: "Noise, ambience, synths, guitars, samples, and rotating improvisers form the sonic core of the whole system."
      },
      {
        title: "DISCONNECT Plugins",
        meta: "Audio plugin brand",
        body: "Distortion, texture, random modulation, and spatial processes from live practice become free open-source sound tools."
      },
      {
        title: "Noise Box",
        meta: "Weekly improv venue",
        body: "A Kunming venue inside 871 Cultural and Creative Factory, hosting electronic improvisation on Fridays or Saturdays from 21:00 to 22:30."
      },
      {
        title: "Field Electric Noise",
        meta: "Outdoor electric activity",
        body: "An irregular outdoor electric-noise activity with advance signup, built around portable setups, environmental noise, and power limits."
      }
    ],
    musicLead: "Listening entries can include band releases, Noise Box live recordings, and Field Electric Noise fragments.",
    visualLead: "Collect music videos, posters, plugin interfaces, Noise Box photos, paintings, and outdoor fragments in one archive.",
    showsLead: "Noise Box runs electronic improvisation on Fridays or Saturdays from 21:00 to 22:30. Field Electric Noise happens irregularly with advance signup.",
    storeLead: "Reservations are open for physical merch, free open-source plugin inquiries, Noise Box sessions, and Field Electric Noise signup.",
    membersLead: "Band introduction and member files for press, booking, and collaboration.",
    bandBioEyebrow: "Press bio",
    bandBioTitle: "Experimental electronics / noise ambience / live improvisation",
    bandBioParagraphs: [
      "DISCONNECT+ is a growing sound project around experimental electronics, noise ambience, sound tools, and live spaces. Its core is the band performance, where synths, guitars, samples, effects, objects, sound devices, and rotating improvisers enter the same unstable system.",
      "DISCONNECT also extends into an audio plugin brand, turning recurring live processes such as distortion, random modulation, texture generation, and spatial treatment into free open-source sound tools. Noise Box is the physical room of the project, located inside 871 Cultural and Creative Factory in Kunming, Yunnan, and hosting electronic improvisation, compact shows, device tests, and cross-player sessions on Fridays or Saturdays from 21:00 to 22:30.",
      "Field Electric Noise moves electronic setups outdoors, happening irregularly with advance signup and testing sound through portable power, environmental noise, weather, distance, and open space. DISCONNECT+ is open to livehouse shows, art spaces, screenings, cross-media performances, experimental music events, plugin demonstrations, and sound/visual collaborations."
    ],
    bandBioTags: ["noise", "ambient", "plugins", "Noise Box", "field electric noise"],
    newsLead: "Use news for releases, shows, collaborations, and merch restocks.",
    orderTitle: "Reserve / purchase intent",
    privacyNotice:
      "Submitted details are used only for contact and order handling. Contact and order details are not shown publicly.",
    chooseProduct: "Choose artifact",
    name: "Name / codename",
    contact: "Contact",
    quantity: "Quantity",
    notes: "Notes",
    submitOrder: "Submit intent",
    orderSent: "Order intent captured. The band will contact you.",
    soldOut: "Sold out",
    stock: "Stock",
    contactBand: "Contact / collaboration",
    booking: "Booking",
    admin: "Admin",
    privacy: "Privacy",
    sourceCode: "Source",
    open: "Open"
  }
};

function text(value: LocaleText, lang: Lang) {
  return value[lang] || value.en || value.zh;
}

function formatDate(value: string, lang: Lang) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

function SafeLink({
  href,
  className,
  ariaLabel,
  children
}: {
  href?: string;
  className: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const nextHref = safeHref(href);
  const external = isExternalHref(nextHref);

  return (
    <a
      aria-label={ariaLabel}
      className={className}
      href={nextHref}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

function TurnstileField({
  token,
  onTokenChange
}: {
  token: string;
  onTokenChange: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef("");

  useEffect(() => {
    if (!turnstileSiteKey) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    function renderWidget() {
      if (cancelled || widgetIdRef.current || !containerRef.current) {
        return;
      }

      const turnstile = window.turnstile;
      if (!turnstile?.render) {
        attempts += 1;
        if (attempts <= 50) {
          timer = setTimeout(renderWidget, 120);
        }
        return;
      }

      if (cancelled || widgetIdRef.current || !containerRef.current) {
        return;
      }

      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: turnstileSiteKey,
        theme: "dark",
        callback: onTokenChange,
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange("")
      });
    }

    renderWidget();

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = "";
      onTokenChange("");
    };
  }, [onTokenChange]);

  if (!turnstileSiteKey) {
    return null;
  }

  return (
    <div className="turnstile-field">
      <div ref={containerRef} />
      <input name="cf-turnstile-response" type="hidden" value={token} readOnly />
    </div>
  );
}

function getTurnstileToken(form: HTMLFormElement) {
  const value = new FormData(form).get("cf-turnstile-response");
  return typeof value === "string" ? value : "";
}

const nodeIcons = [Radio, Cpu, MapPin, Zap];

function productStatus(product: Product, lang: Lang) {
  const availability = product.availability ? text(product.availability, lang) : "";
  if (availability) {
    return availability;
  }
  return product.stock > 0 ? `${ui[lang].stock}: ${product.stock}` : ui[lang].soldOut;
}

export function PublicSite() {
  const [lang, setLang] = useState<Lang>("zh");
  const [content, setContent] = useState<CmsContent>(defaultContent);
  const [activeSongId, setActiveSongId] = useState(content.songs[0]?.id ?? "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(content.products[0]?.id ?? "");
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    contact: "",
    quantity: 1,
    notes: ""
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeSong = useMemo(
    () => content.songs.find((song) => song.id === activeSongId) ?? content.songs[0],
    [activeSongId, content.songs]
  );
  const activePlugins = content.plugins.filter((plugin) => plugin.active);
  const activeProducts = content.products.filter((product) => product.active);
  const selectedProduct =
    activeProducts.find((product) => product.id === selectedProductId) ?? activeProducts[0];
  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  useEffect(() => {
    async function hydrate() {
      const nextContent = await loadSiteContent();
      setContent(nextContent);
      setActiveSongId((current) => current || nextContent.songs[0]?.id || "");
      setSelectedProductId((current) => current || nextContent.products[0]?.id || "");
    }

    hydrate().catch((error) => console.error("Failed to load site data", error));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeSong || !isPlaying) {
      return;
    }

    audio.src = safeMediaSrc(activeSong.audioUrl);
    audio.play().catch(() => setIsPlaying(false));
  }, [activeSong, isPlaying]);

  function toggleSong(song: Song) {
    if (song.id === activeSongId) {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
      return;
    }

    setActiveSongId(song.id);
    setIsPlaying(true);
  }

  async function handleOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const customerName = cleanText(orderForm.customerName, FIELD_LIMITS.name);
    const contact = cleanText(orderForm.contact, FIELD_LIMITS.contact);
    const notes = cleanLongText(orderForm.notes, FIELD_LIMITS.notes);
    if (!selectedProduct || !customerName || !contact) {
      return;
    }

    try {
      await submitOrderIntent({
        productId: selectedProduct.id,
        productName: text(selectedProduct.name, lang),
        quantity: normalizeQuantity(orderForm.quantity),
        customerName,
        contact,
        notes,
        turnstileToken: getTurnstileToken(form)
      });

      setOrderForm({ customerName: "", contact: "", quantity: 1, notes: "" });
      setOrderStatus(ui[lang].orderSent);
      setTurnstileToken("");
      setTurnstileResetKey((current) => current + 1);
    } catch (error) {
      setOrderStatus(error instanceof Error ? error.message : "Submit failed.");
    }
  }

  return (
    <main className="page-shell">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand-mark" href="#top">
          DISCONNECT+
        </a>
        <div className="nav-links">
          <a href="#nodes">{ui[lang].nav.nodes}</a>
          <a href="#plugins">{ui[lang].nav.plugins}</a>
          <a href="#music">{ui[lang].nav.music}</a>
          <a href="#visuals">{ui[lang].nav.visuals}</a>
          <a href="#shows">{ui[lang].nav.shows}</a>
          <a href="#archive">{ui[lang].nav.archive}</a>
          <a href="#store">{ui[lang].nav.store}</a>
        </div>
        <div className="nav-actions">
          <button
            className="icon-button"
            aria-label="Switch language"
            title="Switch language"
            onClick={() => setLang((current) => (current === "zh" ? "en" : "zh"))}
          >
            <Globe2 size={17} />
          </button>
          <a className="icon-button" href="/admin" aria-label={ui[lang].admin} title={ui[lang].admin}>
            <Lock size={16} />
          </a>
        </div>
      </nav>

      <header id="top" className="hero">
        <div className="hero-bg">
          <img src="/images/hero-heartwave.png" alt="" />
          <svg
            className="signal-overlay"
            viewBox="0 0 1440 640"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <filter id="signal-glow" x="-10%" y="-80%" width="120%" height="260%">
                <feGaussianBlur stdDeviation="3.4" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.86 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              className="signal-path signal-base signal-red"
              d="M-80 118 H150 L165 112 L173 118 L183 118 L193 78 L204 166 L215 118 H380 L388 116 L396 118 H690 L700 96 L710 144 L720 118 H1040 L1052 118 L1062 18 L1074 250 L1088 118 H1520"
            />
            <path
              className="signal-path signal-pulse signal-red"
              pathLength={1}
              d="M-80 118 H150 L165 112 L173 118 L183 118 L193 78 L204 166 L215 118 H380 L388 116 L396 118 H690 L700 96 L710 144 L720 118 H1040 L1052 118 L1062 18 L1074 250 L1088 118 H1520"
            />
            <path
              className="signal-path signal-base signal-cyan"
              d="M470 335 H790 L802 333 L812 337 L824 331 L835 340 L848 332 L862 338 L875 334 L892 335 L904 270 L920 445 L936 335 L950 360 L968 333 L990 338 L1018 323 L1042 380 L1070 340 L1098 310 L1130 360 L1165 334 L1202 336 H1510"
            />
            <path
              className="signal-path signal-pulse signal-cyan"
              pathLength={1}
              d="M470 335 H790 L802 333 L812 337 L824 331 L835 340 L848 332 L862 338 L875 334 L892 335 L904 270 L920 445 L936 335 L950 360 L968 333 L990 338 L1018 323 L1042 380 L1070 340 L1098 310 L1130 360 L1165 334 L1202 336 H1510"
            />
            <path
              className="signal-path signal-base signal-green"
              d="M-80 520 H96 L125 500 L154 520 H280 L318 536 L360 520 L416 520 L462 545 L520 520 H684 L740 505 L806 520 H1120 L1132 414 L1144 612 L1158 520 L1188 536 L1238 520 H1520"
            />
            <path
              className="signal-path signal-pulse signal-green"
              pathLength={1}
              d="M-80 520 H96 L125 500 L154 520 H280 L318 536 L360 520 L416 520 L462 545 L520 520 H684 L740 505 L806 520 H1120 L1132 414 L1144 612 L1158 520 L1188 536 L1238 520 H1520"
            />
          </svg>
          <span className="signal-sweep" aria-hidden="true" />
        </div>
        <div className="hero-content">
          <div className="hero-kicker">{ui[lang].heroKicker}</div>
          <h1>
            <span className="glitch" data-text="DISCONNECT+">
              DISCONNECT+
            </span>
          </h1>
          <div className="hero-subgrid">
            <p className="hero-copy">{ui[lang].heroCopy}</p>
            <div className="hero-stat">
              <span className="eyebrow">{ui[lang].latestSignal}</span>
              <strong>{content.songs.length}</strong>
              <span className="tiny">transmissions online</span>
            </div>
          </div>
          <div className="admin-actions">
            <a className="text-button" href="#music">
              <Volume2 size={17} />
              {ui[lang].listen}
            </a>
            <a className="ghost-button" href="#contact">
              <Mail size={17} />
              {ui[lang].contactBand}
            </a>
          </div>
        </div>
      </header>

      <section id="nodes" className="section section-theme section-nodes">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <span className="eyebrow">00 / Signal network</span>
              <h2>{ui[lang].nav.nodes}</h2>
            </div>
            <p>{ui[lang].nodesLead}</p>
          </div>
          <div className="grid four">
            {ui[lang].nodes.map((node, index) => {
              const Icon = nodeIcons[index] ?? Radio;

              return (
                <article className="content-card node-card" key={node.title}>
                  <div className="node-icon" aria-hidden="true">
                    <Icon size={22} />
                  </div>
                  <div className="content-card-body">
                    <span className="badge">{node.meta}</span>
                    <h3>{node.title}</h3>
                    <p>{node.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="plugins" className="section section-alt section-theme section-plugins">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / Audio tools</span>
              <h2>{ui[lang].nav.plugins}</h2>
            </div>
            <p>{ui[lang].pluginLead}</p>
          </div>
          <div className="plugin-grid">
            {activePlugins.map((plugin) => (
              <article className="content-card plugin-card" key={plugin.id}>
                <div className="plugin-media">
                  <img
                    src={safeMediaSrc(plugin.imageUrl) || "/images/synth.jpg"}
                    alt={text(plugin.name, lang)}
                  />
                  <div className="plugin-circuit" aria-hidden="true">
                    <PlugZap size={22} />
                  </div>
                </div>
                <div className="content-card-body">
                  <div className="plugin-meta">
                    <span className="badge">{text(plugin.type, lang)}</span>
                    <span className="badge">{text(plugin.status, lang)}</span>
                  </div>
                  <h3>{text(plugin.name, lang)}</h3>
                  <p>{text(plugin.description, lang)}</p>
                  <div className="admin-actions">
                    <SafeLink className="text-button" href={plugin.repoUrl}>
                      <Github size={16} />
                      {ui[lang].sourceCode}
                    </SafeLink>
                    {plugin.links
                      .filter((link) => link.url !== plugin.repoUrl)
                      .map((link) => (
                        <SafeLink className="ghost-button" href={link.url} key={link.label}>
                          {link.label}
                          <ExternalLink size={14} />
                        </SafeLink>
                      ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="music" className="section section-alt section-theme section-music">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / Transmissions</span>
              <h2>{ui[lang].nav.music}</h2>
            </div>
            <p>{ui[lang].musicLead}</p>
          </div>
          <div className="music-layout">
            <div className="image-panel">
              <img src="/images/skeleton_lightning.jpg" alt="" />
            </div>
            <div className="track-list">
              {content.songs.map((song) => (
                <article
                  className={`track-row ${song.id === activeSongId ? "is-active" : ""}`}
                  key={song.id}
                >
                  <button
                    className="icon-button"
                    onClick={() => toggleSong(song)}
                    aria-label={song.id === activeSongId && isPlaying ? "Pause" : "Play"}
                  >
                    {song.id === activeSongId && isPlaying ? <Pause size={17} /> : <Play size={17} />}
                  </button>
                  <div>
                    <div className="track-title">{text(song.title, lang)}</div>
                    <div className="track-meta">
                      {song.release} / {song.duration}
                    </div>
                    {song.lyrics && <p>{text(song.lyrics, lang)}</p>}
                    <div className="link-row">
                      {song.links.map((link) => (
                        <SafeLink className="micro-link" href={link.url} key={link.label}>
                          {link.label}
                          <ExternalLink size={12} />
                        </SafeLink>
                      ))}
                    </div>
                  </div>
                  <span className="badge">{song.featured ? "featured" : "archive"}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="visuals" className="section section-theme section-visuals">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / Visual archive</span>
              <h2>{ui[lang].nav.visuals}</h2>
            </div>
            <p>{ui[lang].visualLead}</p>
          </div>
          <div className="grid four">
            {content.visuals.map((visual) => (
              <article className="content-card visual-card" key={visual.id}>
                <img
                  src={safeMediaSrc(visual.imageUrl) || "/images/skeleton_beach.jpg"}
                  alt={text(visual.title, lang)}
                />
                <div className="content-card-body">
                  <span className="badge">{text(visual.type, lang)}</span>
                  <h3>{text(visual.title, lang)}</h3>
                  <p>{text(visual.description, lang)}</p>
                  {visual.videoUrl && (
                    <SafeLink className="micro-link" href={visual.videoUrl}>
                      {ui[lang].open}
                      <ExternalLink size={12} />
                    </SafeLink>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="shows" className="section section-alt section-theme section-shows">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <span className="eyebrow">04 / Live routing</span>
              <h2>{ui[lang].nav.shows}</h2>
            </div>
            <p>{ui[lang].showsLead}</p>
          </div>
          <div>
            {content.shows.map((show) => (
              <article className="show-row" key={show.id}>
                <div className="show-date">{formatDate(show.date, lang)}</div>
                <div>
                  <span className="badge">{show.status}</span>
                  <h3>{text(show.title, lang)}</h3>
                  <p>
                    {text(show.city, lang)} / {text(show.venue, lang)}
                  </p>
                </div>
                {show.ticketUrl && (
                  <SafeLink className="text-button" href={show.ticketUrl}>
                    <Ticket size={16} />
                    Tickets
                  </SafeLink>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="archive" className="section section-theme section-archive">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <span className="eyebrow">05 / Entity files</span>
              <h2>{lang === "zh" ? "乐队档案" : "Band archive"}</h2>
            </div>
            <p>{ui[lang].membersLead}</p>
          </div>
          <article className="band-bio">
            <div>
              <span className="eyebrow">{ui[lang].bandBioEyebrow}</span>
              <h3>{ui[lang].bandBioTitle}</h3>
            </div>
            <div className="band-bio-copy">
              {ui[lang].bandBioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="asset-shelf">
                {ui[lang].bandBioTags.map((tag) => (
                  <span className="asset-chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
          <div className="grid two">
            {content.members.map((member) => (
              <article className="content-card member-card" key={member.id}>
                <img
                  src={safeMediaSrc(member.imageUrl) || "/images/skeleton_stand.JPG"}
                  alt={text(member.name, lang)}
                />
                <div className="content-card-body">
                  <h3>{text(member.name, lang)}</h3>
                  <span className="badge">{text(member.role, lang)}</span>
                  <p>{text(member.bio, lang)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt section-theme section-news">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <span className="eyebrow">06 / Signal notes</span>
              <h2>{lang === "zh" ? "最新动态" : "News"}</h2>
            </div>
            <p>{ui[lang].newsLead}</p>
          </div>
          <div>
            {content.news.map((item) => (
              <article className="news-row" key={item.id}>
                <div className="news-date">{formatDate(item.date, lang)}</div>
                <div>
                  <span className="badge">{text(item.category, lang)}</span>
                  <h3>{text(item.title, lang)}</h3>
                  <p>{text(item.summary, lang)}</p>
                </div>
                {item.url && (
                  <SafeLink className="icon-button" href={item.url} ariaLabel={ui[lang].open}>
                    <ExternalLink size={16} />
                  </SafeLink>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="store" className="section section-theme section-store">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <span className="eyebrow">07 / Artifacts</span>
              <h2>{ui[lang].nav.store}</h2>
            </div>
            <p>{ui[lang].storeLead}</p>
          </div>
          <div className="split-panel">
            <div className="form-stack">
              <h3>{ui[lang].orderTitle}</h3>
              <form className="form-stack" onSubmit={handleOrder}>
                <label className="field">
                  <span>{ui[lang].chooseProduct}</span>
                  <select
                    value={selectedProduct?.id ?? ""}
                    onChange={(event) => setSelectedProductId(event.target.value)}
                  >
                    {activeProducts.map((product) => (
                      <option value={product.id} key={product.id}>
                        {text(product.name, lang)} / {product.price}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>{ui[lang].name}</span>
                  <input
                    maxLength={FIELD_LIMITS.name}
                    value={orderForm.customerName}
                    onChange={(event) =>
                      setOrderForm((current) => ({ ...current, customerName: event.target.value }))
                    }
                    required
                  />
                </label>
                <label className="field">
                  <span>{ui[lang].contact}</span>
                  <input
                    maxLength={FIELD_LIMITS.contact}
                    value={orderForm.contact}
                    onChange={(event) =>
                      setOrderForm((current) => ({ ...current, contact: event.target.value }))
                    }
                    required
                  />
                </label>
                <label className="field">
                  <span>{ui[lang].quantity}</span>
                  <input
                    max={FIELD_LIMITS.quantityMax}
                    min={1}
                    type="number"
                    value={orderForm.quantity}
                    onChange={(event) =>
                      setOrderForm((current) => ({
                        ...current,
                        quantity: Number(event.target.value)
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span>{ui[lang].notes}</span>
                  <textarea
                    maxLength={FIELD_LIMITS.notes}
                    value={orderForm.notes}
                    onChange={(event) =>
                      setOrderForm((current) => ({ ...current, notes: event.target.value }))
                    }
                  />
                </label>
                <TurnstileField
                  key={turnstileResetKey}
                  token={turnstileToken}
                  onTokenChange={handleTurnstileToken}
                />
                <button className="text-button" type="submit">
                  <ShoppingBag size={17} />
                  {ui[lang].submitOrder}
                </button>
                <p className="status-line">
                  {ui[lang].privacyNotice}{" "}
                  <a className="inline-link" href="/privacy">
                    {ui[lang].privacy}
                  </a>
                </p>
                {orderStatus && <div className="status-line">{orderStatus}</div>}
              </form>
            </div>
            <div className="grid three">
              {activeProducts.map((product: Product) => (
                <article className="content-card product-card" key={product.id}>
                  <img
                    src={safeMediaSrc(product.imageUrl) || "/images/my_record.jpg"}
                    alt={text(product.name, lang)}
                  />
                  <div className="content-card-body">
                    <div className="product-meta">
                      <span>{text(product.type, lang)}</span>
                      <span>{product.price}</span>
                    </div>
                    <h3>{text(product.name, lang)}</h3>
                    <p>{productStatus(product, lang)}</p>
                    <div className="admin-actions">
                      <button
                        className="text-button"
                        onClick={() => setSelectedProductId(product.id)}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingBag size={16} />
                        {ui[lang].chooseProduct}
                      </button>
                      {product.externalUrl && (
                        <SafeLink className="ghost-button" href={product.externalUrl}>
                          {ui[lang].open}
                          <ExternalLink size={14} />
                        </SafeLink>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="footer section-theme section-contact">
        <div className="footer-inner">
          <div>
            <strong>DISCONNECT+</strong>
            <p>
              {ui[lang].contactBand}: {content.settings.contactEmail}
              <br />
              {ui[lang].booking}: {content.settings.bookingEmail}
              <br />
              {text(content.settings.location, lang)}
            </p>
          </div>
          <div className="link-row">
            {content.settings.socials.map((link) => (
              <SafeLink className="micro-link" href={link.url} key={link.label}>
                {link.label}
                <ExternalLink size={12} />
              </SafeLink>
            ))}
            <a className="micro-link" href="/admin">
              <Archive size={12} />
              {ui[lang].admin}
            </a>
            <a className="micro-link" href="/privacy">
              {ui[lang].privacy}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
