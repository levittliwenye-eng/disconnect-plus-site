"use client";

import {
  Archive,
  Boxes,
  ClipboardList,
  Eye,
  LogOut,
  Music2,
  Newspaper,
  PlugZap,
  Plus,
  Save,
  Settings,
  Ticket,
  Trash2,
  Users
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  checkAdminSession,
  createEmptyId,
  deleteOrderIntent,
  loadOrders,
  loadSiteContent,
  saveSiteContent,
  updateOrderIntent
} from "@/lib/repository";
import { defaultContent } from "@/lib/seed";
import type {
  CmsContent,
  LinkItem,
  LocaleText,
  Member,
  NewsItem,
  OrderIntent,
  PluginProject,
  Product,
  Show,
  Song,
  VisualItem
} from "@/lib/types";

type Tab =
  | "overview"
  | "music"
  | "plugins"
  | "visuals"
  | "shows"
  | "news"
  | "members"
  | "store"
  | "orders"
  | "settings";

const demoPassword = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "";

const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Overview", icon: <Eye size={16} /> },
  { id: "music", label: "Music", icon: <Music2 size={16} /> },
  { id: "plugins", label: "Plugins", icon: <PlugZap size={16} /> },
  { id: "visuals", label: "Visuals", icon: <Archive size={16} /> },
  { id: "shows", label: "Shows", icon: <Ticket size={16} /> },
  { id: "news", label: "News", icon: <Newspaper size={16} /> },
  { id: "members", label: "Members", icon: <Users size={16} /> },
  { id: "store", label: "Store", icon: <Boxes size={16} /> },
  { id: "orders", label: "Orders", icon: <ClipboardList size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> }
];

const assetPaths = [
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
  "/images/trex_wave.JPG",
  "/audio/荒川.mp3",
  "/audio/游园地.mp3"
];

function cloneText(value = ""): LocaleText {
  return { en: value, zh: value };
}

function LocaleFields({
  label,
  value,
  onChange
}: {
  label: string;
  value: LocaleText;
  onChange: (value: LocaleText) => void;
}) {
  return (
    <div className="admin-row">
      <label>
        <span className="tiny">{label} EN</span>
        <input
          className="admin-input"
          value={value.en}
          onChange={(event) => onChange({ ...value, en: event.target.value })}
        />
      </label>
      <label>
        <span className="tiny">{label} ZH</span>
        <input
          className="admin-input"
          value={value.zh}
          onChange={(event) => onChange({ ...value, zh: event.target.value })}
        />
      </label>
    </div>
  );
}

function LinksEditor({
  links,
  onChange
}: {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
}) {
  return (
    <div className="form-stack">
      {links.map((link, index) => (
        <div className="admin-row" key={`${link.label}-${index}`}>
          <input
            className="admin-input"
            placeholder="Label"
            value={link.label}
            onChange={(event) => {
              const next = [...links];
              next[index] = { ...link, label: event.target.value };
              onChange(next);
            }}
          />
          <input
            className="admin-input"
            placeholder="URL"
            value={link.url}
            onChange={(event) => {
              const next = [...links];
              next[index] = { ...link, url: event.target.value };
              onChange(next);
            }}
          />
        </div>
      ))}
      <div className="admin-actions">
        <button
          className="ghost-button"
          type="button"
          onClick={() => onChange([...links, { label: "Link", url: "#" }])}
        >
          <Plus size={15} />
          Add link
        </button>
        <button
          className="danger-button"
          type="button"
          onClick={() => onChange(links.slice(0, -1))}
          disabled={links.length === 0}
        >
          <Trash2 size={15} />
          Remove last
        </button>
      </div>
    </div>
  );
}

export function AdminConsole() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [demoAvailable, setDemoAvailable] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [content, setContent] = useState<CmsContent>(defaultContent);
  const [orders, setOrders] = useState<OrderIntent[]>([]);
  const [authForm, setAuthForm] = useState({ password: "" });
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const newOrders = orders.filter((order) => order.status === "new").length;
  const stats = useMemo(
    () => [
      ["Songs", content.songs.length],
      ["Plugins", content.plugins.length],
      ["Visuals", content.visuals.length],
      ["Products", content.products.length],
      ["New orders", newOrders]
    ],
    [content, newOrders]
  );

  useEffect(() => {
    const hostname = window.location.hostname;
    const localDemoAvailable =
      Boolean(demoPassword) &&
      (hostname === "localhost" || hostname === "127.0.0.1");
    setDemoAvailable(localDemoAvailable);

    const localAuthed =
      localDemoAvailable && window.sessionStorage.getItem("disconnect.admin") === "true";
    if (localAuthed) {
      setIsAuthed(true);
      return;
    }

    if (localDemoAvailable) {
      return;
    }

    checkAdminSession()
      .then((session) => {
        if (session.authenticated) {
          setIsAuthed(true);
          return;
        }
        setStatus("Cloudflare Access is not configured or this email is not allowed.");
      })
      .catch(() => {
        setStatus("Production admin requires Cloudflare Access on /admin and /api/admin/*.");
      });
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      return;
    }

    refreshData().catch((error) => setStatus(error.message));
  }, [isAuthed]);

  async function refreshData() {
    const [nextContent, nextOrders] = await Promise.all([
      loadSiteContent(),
      loadOrders()
    ]);
    setContent(nextContent);
    setOrders(nextOrders);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!demoAvailable) {
      try {
        const session = await checkAdminSession();
        if (session.authenticated) {
          setIsAuthed(true);
          return;
        }
      } catch {
        setStatus("Production admin is handled by Cloudflare Access, not an in-page password.");
        return;
      }

      setStatus("Production admin is handled by Cloudflare Access, not an in-page password.");
      return;
    }

    if (demoPassword && authForm.password === demoPassword) {
      window.sessionStorage.setItem("disconnect.admin", "true");
      setIsAuthed(true);
      return;
    }

    setStatus("Password did not match the demo admin password.");
  }

  async function handleLogout() {
    window.sessionStorage.removeItem("disconnect.admin");
    if (!demoAvailable) {
      window.location.href = "/cdn-cgi/access/logout";
      return;
    }
    setIsAuthed(false);
  }

  async function handleSave() {
    setIsSaving(true);
    setStatus("");
    try {
      await saveSiteContent(content);
      setStatus("Content saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  function setSongs(songs: Song[]) {
    setContent((current) => ({ ...current, songs }));
  }

  function setVisuals(visuals: VisualItem[]) {
    setContent((current) => ({ ...current, visuals }));
  }

  function setPlugins(plugins: PluginProject[]) {
    setContent((current) => ({ ...current, plugins }));
  }

  function setShows(shows: Show[]) {
    setContent((current) => ({ ...current, shows }));
  }

  function setNews(news: NewsItem[]) {
    setContent((current) => ({ ...current, news }));
  }

  function setMembers(members: Member[]) {
    setContent((current) => ({ ...current, members }));
  }

  function setProducts(products: Product[]) {
    setContent((current) => ({ ...current, products }));
  }

  if (!isAuthed) {
    return (
      <main className="login-panel">
        <form className="login-card form-stack" onSubmit={handleLogin}>
          <span className="eyebrow">DISCONNECT+ Admin</span>
          <h1>CONTROL ROOM</h1>
          <p className="status-line">
            {demoAvailable
              ? "Local demo mode. Use your configured demo password."
              : "Production admin is protected by Cloudflare Access."}
          </p>
          {demoAvailable && (
            <>
              <label className="field">
                <span>Password</span>
                <input
                  autoComplete="current-password"
                  maxLength={128}
                  value={authForm.password}
                  onChange={(event) => setAuthForm({ password: event.target.value })}
                  type="password"
                  required
                />
              </label>
              <button className="text-button" type="submit">
                <LockIcon />
                Enter
              </button>
            </>
          )}
          {!demoAvailable && (
            <button className="text-button" type="submit">
              <LockIcon />
              Check Cloudflare Access
            </button>
          )}
          {status && <p className="status-line">{status}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <datalist id="asset-paths">
        {assetPaths.map((path) => (
          <option value={path} key={path} />
        ))}
      </datalist>
      <header className="admin-top">
        <div className="admin-title">
          <span className="eyebrow">DISCONNECT+ admin</span>
          <h1>Control Room</h1>
          <p>{demoAvailable ? "Demo mode: data persists in this browser." : "Production mode: data writes through Cloudflare D1."}</p>
        </div>
        <div className="admin-actions">
          <a className="ghost-button" href="/">
            <Eye size={16} />
            Site
          </a>
          <button className="text-button" onClick={handleSave} disabled={isSaving}>
            <Save size={16} />
            {isSaving ? "Saving" : "Save"}
          </button>
          <button className="ghost-button" onClick={handleLogout}>
            <LogOut size={16} />
            Exit
          </button>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-tabs">
          {tabs.map((item) => (
            <button
              className={`admin-tab ${tab === item.id ? "is-active" : ""}`}
              key={item.id}
              onClick={() => setTab(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        <section className="admin-panel">
          {status && <p className="status-line">{status}</p>}
          {tab === "overview" && (
            <div className="form-stack">
              <div className="grid three">
                {stats.map(([label, value]) => (
                  <div className="admin-card" key={label}>
                    <span className="eyebrow">{label}</span>
                    <h3>{value}</h3>
                  </div>
                ))}
              </div>
              <div className="admin-card">
                <h3>Operating notes</h3>
                <p className="status-line">
                  Edit sections here, save content, then check the public site. Order intents are a
                  separate operational queue so public submissions do not rewrite the whole site
                  document.
                </p>
              </div>
            </div>
          )}

          {tab === "music" && <MusicEditor songs={content.songs} onChange={setSongs} />}
          {tab === "plugins" && <PluginsEditor plugins={content.plugins} onChange={setPlugins} />}
          {tab === "visuals" && <VisualEditor visuals={content.visuals} onChange={setVisuals} />}
          {tab === "shows" && <ShowsEditor shows={content.shows} onChange={setShows} />}
          {tab === "news" && <NewsEditor news={content.news} onChange={setNews} />}
          {tab === "members" && <MembersEditor members={content.members} onChange={setMembers} />}
          {tab === "store" && <StoreEditor products={content.products} onChange={setProducts} />}
          {tab === "settings" && (
            <SettingsEditor content={content} onChange={(next) => setContent(next)} />
          )}
          {tab === "orders" && (
            <OrdersQueue orders={orders} onChange={(next) => setOrders(next)} onStatus={setStatus} />
          )}

          <div className="asset-shelf">
            {assetPaths.map((path) => (
              <span className="asset-chip" key={path}>
                {path}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function LockIcon() {
  return <Settings size={16} />;
}

function MusicEditor({ songs, onChange }: { songs: Song[]; onChange: (songs: Song[]) => void }) {
  function patch(id: string, update: Partial<Song>) {
    onChange(songs.map((song) => (song.id === id ? { ...song, ...update } : song)));
  }

  return (
    <div className="form-stack">
      <button
        className="ghost-button"
        onClick={() =>
          onChange([
            ...songs,
            {
              id: createEmptyId("song"),
              title: cloneText("New Transmission"),
              duration: "03:00",
              release: "Single",
              audioUrl: "/audio/荒川.mp3",
              lyrics: cloneText(""),
              links: [],
              featured: false
            }
          ])
        }
      >
        <Plus size={16} />
        Add song
      </button>
      <div className="admin-grid">
        {songs.map((song) => (
          <div className="admin-card form-stack" key={song.id}>
            <h3>{song.title.zh || song.title.en}</h3>
            <LocaleFields label="Title" value={song.title} onChange={(title) => patch(song.id, { title })} />
            <div className="admin-row">
              <input
                className="admin-input"
                value={song.duration}
                onChange={(event) => patch(song.id, { duration: event.target.value })}
                placeholder="Duration"
              />
              <input
                className="admin-input"
                value={song.release}
                onChange={(event) => patch(song.id, { release: event.target.value })}
                placeholder="Release"
              />
            </div>
            <input
              className="admin-input"
              list="asset-paths"
              value={song.audioUrl}
              onChange={(event) => patch(song.id, { audioUrl: event.target.value })}
              placeholder="Audio URL"
            />
            <LocaleFields
              label="Lyric note"
              value={song.lyrics ?? cloneText("")}
              onChange={(lyrics) => patch(song.id, { lyrics })}
            />
            <LinksEditor links={song.links} onChange={(links) => patch(song.id, { links })} />
            <label className="badge">
              <input
                checked={song.featured}
                onChange={(event) => patch(song.id, { featured: event.target.checked })}
                type="checkbox"
              />
              Featured
            </label>
            <button className="danger-button" onClick={() => onChange(songs.filter((item) => item.id !== song.id))}>
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PluginsEditor({
  plugins,
  onChange
}: {
  plugins: PluginProject[];
  onChange: (plugins: PluginProject[]) => void;
}) {
  function patch(id: string, update: Partial<PluginProject>) {
    onChange(plugins.map((plugin) => (plugin.id === id ? { ...plugin, ...update } : plugin)));
  }

  return (
    <div className="form-stack">
      <button
        className="ghost-button"
        onClick={() =>
          onChange([
            ...plugins,
            {
              id: createEmptyId("plugin"),
              name: cloneText("New Plugin"),
              type: cloneText("Audio tool"),
              status: cloneText("In development"),
              description: cloneText(""),
              imageUrl: "/images/synth.jpg",
              repoUrl: "#",
              active: true,
              links: []
            }
          ])
        }
      >
        <Plus size={16} />
        Add plugin
      </button>
      <div className="admin-grid">
        {plugins.map((plugin) => (
          <div className="admin-card form-stack" key={plugin.id}>
            <h3>{plugin.name.zh || plugin.name.en}</h3>
            <LocaleFields label="Name" value={plugin.name} onChange={(name) => patch(plugin.id, { name })} />
            <LocaleFields label="Type" value={plugin.type} onChange={(type) => patch(plugin.id, { type })} />
            <LocaleFields label="Status" value={plugin.status} onChange={(status) => patch(plugin.id, { status })} />
            <input
              className="admin-input"
              list="asset-paths"
              value={plugin.imageUrl}
              onChange={(event) => patch(plugin.id, { imageUrl: event.target.value })}
              placeholder="Image URL"
            />
            <input
              className="admin-input"
              value={plugin.repoUrl}
              onChange={(event) => patch(plugin.id, { repoUrl: event.target.value })}
              placeholder="Repository URL"
            />
            <LocaleFields
              label="Description"
              value={plugin.description}
              onChange={(description) => patch(plugin.id, { description })}
            />
            <LinksEditor links={plugin.links} onChange={(links) => patch(plugin.id, { links })} />
            <label className="badge">
              <input
                checked={plugin.active}
                onChange={(event) => patch(plugin.id, { active: event.target.checked })}
                type="checkbox"
              />
              Active
            </label>
            <button
              className="danger-button"
              onClick={() => onChange(plugins.filter((entry) => entry.id !== plugin.id))}
            >
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualEditor({
  visuals,
  onChange
}: {
  visuals: VisualItem[];
  onChange: (visuals: VisualItem[]) => void;
}) {
  function patch(id: string, update: Partial<VisualItem>) {
    onChange(visuals.map((item) => (item.id === id ? { ...item, ...update } : item)));
  }

  return (
    <div className="form-stack">
      <button
        className="ghost-button"
        onClick={() =>
          onChange([
            ...visuals,
            {
              id: createEmptyId("visual"),
              title: cloneText("New Visual"),
              type: cloneText("Archive"),
              imageUrl: "/images/skeleton_beach.jpg",
              description: cloneText(""),
              videoUrl: ""
            }
          ])
        }
      >
        <Plus size={16} />
        Add visual
      </button>
      <div className="admin-grid">
        {visuals.map((visual) => (
          <div className="admin-card form-stack" key={visual.id}>
            <h3>{visual.title.zh || visual.title.en}</h3>
            <LocaleFields label="Title" value={visual.title} onChange={(title) => patch(visual.id, { title })} />
            <LocaleFields label="Type" value={visual.type} onChange={(type) => patch(visual.id, { type })} />
            <input
              className="admin-input"
              list="asset-paths"
              value={visual.imageUrl}
              onChange={(event) => patch(visual.id, { imageUrl: event.target.value })}
              placeholder="Image URL"
            />
            <input
              className="admin-input"
              value={visual.videoUrl ?? ""}
              onChange={(event) => patch(visual.id, { videoUrl: event.target.value })}
              placeholder="Optional video URL"
            />
            <LocaleFields
              label="Description"
              value={visual.description}
              onChange={(description) => patch(visual.id, { description })}
            />
            <button
              className="danger-button"
              onClick={() => onChange(visuals.filter((item) => item.id !== visual.id))}
            >
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowsEditor({ shows, onChange }: { shows: Show[]; onChange: (shows: Show[]) => void }) {
  function patch(id: string, update: Partial<Show>) {
    onChange(shows.map((show) => (show.id === id ? { ...show, ...update } : show)));
  }

  return (
    <div className="form-stack">
      <button
        className="ghost-button"
        onClick={() =>
          onChange([
            ...shows,
            {
              id: createEmptyId("show"),
              date: new Date().toISOString().slice(0, 10),
              city: { en: "Kunming, Yunnan", zh: "云南昆明" },
              venue: { en: "Noise Box / 871 Cultural and Creative Factory", zh: "Noise Box / 871文化创意工厂" },
              title: { en: "Electronic Improvisation", zh: "电子音乐即兴" },
              ticketUrl: "#store",
              status: "upcoming"
            }
          ])
        }
      >
        <Plus size={16} />
        Add show
      </button>
      <div className="admin-grid">
        {shows.map((show) => (
          <div className="admin-card form-stack" key={show.id}>
            <h3>{show.title.zh || show.title.en}</h3>
            <input
              className="admin-input"
              type="date"
              value={show.date}
              onChange={(event) => patch(show.id, { date: event.target.value })}
            />
            <LocaleFields label="Title" value={show.title} onChange={(title) => patch(show.id, { title })} />
            <LocaleFields label="City" value={show.city} onChange={(city) => patch(show.id, { city })} />
            <LocaleFields label="Venue" value={show.venue} onChange={(venue) => patch(show.id, { venue })} />
            <div className="admin-row">
              <select
                className="admin-select"
                value={show.status}
                onChange={(event) => patch(show.id, { status: event.target.value as Show["status"] })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="secret">Secret</option>
              </select>
              <input
                className="admin-input"
                value={show.ticketUrl ?? ""}
                onChange={(event) => patch(show.id, { ticketUrl: event.target.value })}
                placeholder="Ticket URL"
              />
            </div>
            <button className="danger-button" onClick={() => onChange(shows.filter((item) => item.id !== show.id))}>
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsEditor({ news, onChange }: { news: NewsItem[]; onChange: (news: NewsItem[]) => void }) {
  function patch(id: string, update: Partial<NewsItem>) {
    onChange(news.map((item) => (item.id === id ? { ...item, ...update } : item)));
  }

  return (
    <div className="form-stack">
      <button
        className="ghost-button"
        onClick={() =>
          onChange([
            ...news,
            {
              id: createEmptyId("news"),
              date: new Date().toISOString().slice(0, 10),
              category: cloneText("Signal"),
              title: cloneText("New Signal"),
              summary: cloneText(""),
              url: "",
              pinned: false
            }
          ])
        }
      >
        <Plus size={16} />
        Add news
      </button>
      <div className="admin-grid">
        {news.map((item) => (
          <div className="admin-card form-stack" key={item.id}>
            <h3>{item.title.zh || item.title.en}</h3>
            <input
              className="admin-input"
              type="date"
              value={item.date}
              onChange={(event) => patch(item.id, { date: event.target.value })}
            />
            <LocaleFields label="Category" value={item.category} onChange={(category) => patch(item.id, { category })} />
            <LocaleFields label="Title" value={item.title} onChange={(title) => patch(item.id, { title })} />
            <LocaleFields label="Summary" value={item.summary} onChange={(summary) => patch(item.id, { summary })} />
            <input
              className="admin-input"
              value={item.url ?? ""}
              onChange={(event) => patch(item.id, { url: event.target.value })}
              placeholder="Optional URL"
            />
            <label className="badge">
              <input
                checked={item.pinned}
                onChange={(event) => patch(item.id, { pinned: event.target.checked })}
                type="checkbox"
              />
              Pinned
            </label>
            <button className="danger-button" onClick={() => onChange(news.filter((entry) => entry.id !== item.id))}>
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MembersEditor({
  members,
  onChange
}: {
  members: Member[];
  onChange: (members: Member[]) => void;
}) {
  function patch(id: string, update: Partial<Member>) {
    onChange(members.map((member) => (member.id === id ? { ...member, ...update } : member)));
  }

  return (
    <div className="form-stack">
      <button
        className="ghost-button"
        onClick={() =>
          onChange([
            ...members,
            {
              id: createEmptyId("member"),
              name: cloneText("New Entity"),
              role: cloneText("Role"),
              imageUrl: "/images/guitar.jpg",
              bio: cloneText("")
            }
          ])
        }
      >
        <Plus size={16} />
        Add member
      </button>
      <div className="admin-grid">
        {members.map((member) => (
          <div className="admin-card form-stack" key={member.id}>
            <h3>{member.name.zh || member.name.en}</h3>
            <LocaleFields label="Name" value={member.name} onChange={(name) => patch(member.id, { name })} />
            <LocaleFields label="Role" value={member.role} onChange={(role) => patch(member.id, { role })} />
            <input
              className="admin-input"
              list="asset-paths"
              value={member.imageUrl}
              onChange={(event) => patch(member.id, { imageUrl: event.target.value })}
              placeholder="Image URL"
            />
            <LocaleFields label="Bio" value={member.bio} onChange={(bio) => patch(member.id, { bio })} />
            <button
              className="danger-button"
              onClick={() => onChange(members.filter((entry) => entry.id !== member.id))}
            >
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoreEditor({
  products,
  onChange
}: {
  products: Product[];
  onChange: (products: Product[]) => void;
}) {
  function patch(id: string, update: Partial<Product>) {
    onChange(products.map((product) => (product.id === id ? { ...product, ...update } : product)));
  }

  return (
    <div className="form-stack">
      <button
        className="ghost-button"
        onClick={() =>
          onChange([
            ...products,
            {
              id: createEmptyId("product"),
              name: cloneText("New Artifact"),
              type: cloneText("Merch"),
              price: "CN¥ 0",
              availability: cloneText("Reservation open"),
              imageUrl: "/images/my_record.jpg",
              stock: 1,
              active: true,
              externalUrl: ""
            }
          ])
        }
      >
        <Plus size={16} />
        Add product
      </button>
      <div className="admin-grid">
        {products.map((product) => (
          <div className="admin-card form-stack" key={product.id}>
            <h3>{product.name.zh || product.name.en}</h3>
            <LocaleFields label="Name" value={product.name} onChange={(name) => patch(product.id, { name })} />
            <LocaleFields label="Type" value={product.type} onChange={(type) => patch(product.id, { type })} />
            <LocaleFields
              label="Availability"
              value={product.availability ?? cloneText("")}
              onChange={(availability) => patch(product.id, { availability })}
            />
            <div className="admin-row">
              <input
                className="admin-input"
                value={product.price}
                onChange={(event) => patch(product.id, { price: event.target.value })}
                placeholder="Price"
              />
              <input
                className="admin-input"
                type="number"
                value={product.stock}
                onChange={(event) => patch(product.id, { stock: Number(event.target.value) })}
                placeholder="Stock"
              />
            </div>
            <input
              className="admin-input"
              list="asset-paths"
              value={product.imageUrl}
              onChange={(event) => patch(product.id, { imageUrl: event.target.value })}
              placeholder="Image URL"
            />
            <input
              className="admin-input"
              value={product.externalUrl ?? ""}
              onChange={(event) => patch(product.id, { externalUrl: event.target.value })}
              placeholder="External buy URL"
            />
            <label className="badge">
              <input
                checked={product.active}
                onChange={(event) => patch(product.id, { active: event.target.checked })}
                type="checkbox"
              />
              Active
            </label>
            <button
              className="danger-button"
              onClick={() => onChange(products.filter((entry) => entry.id !== product.id))}
            >
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsEditor({
  content,
  onChange
}: {
  content: CmsContent;
  onChange: (content: CmsContent) => void;
}) {
  const settings = content.settings;
  return (
    <div className="admin-card form-stack">
      <h3>Settings</h3>
      <div className="admin-row">
        <input
          className="admin-input"
          value={settings.contactEmail}
          onChange={(event) =>
            onChange({
              ...content,
              settings: { ...settings, contactEmail: event.target.value }
            })
          }
          placeholder="Contact email"
        />
        <input
          className="admin-input"
          value={settings.bookingEmail}
          onChange={(event) =>
            onChange({
              ...content,
              settings: { ...settings, bookingEmail: event.target.value }
            })
          }
          placeholder="Booking email"
        />
      </div>
      <LocaleFields
        label="Location"
        value={settings.location}
        onChange={(location) => onChange({ ...content, settings: { ...settings, location } })}
      />
      <LinksEditor
        links={settings.socials}
        onChange={(socials) => onChange({ ...content, settings: { ...settings, socials } })}
      />
    </div>
  );
}

function OrdersQueue({
  orders,
  onChange,
  onStatus
}: {
  orders: OrderIntent[];
  onChange: (orders: OrderIntent[]) => void;
  onStatus: (status: string) => void;
}) {
  async function patch(id: string, update: Partial<OrderIntent>) {
    await updateOrderIntent(id, update);
    onChange(orders.map((order) => (order.id === id ? { ...order, ...update } : order)));
    onStatus("Order updated.");
  }

  async function remove(id: string) {
    await deleteOrderIntent(id);
    onChange(orders.filter((order) => order.id !== id));
    onStatus("Order removed.");
  }

  return (
    <div className="form-stack">
      {orders.map((order) => (
        <article className="admin-card" key={order.id}>
          <span className="badge">{order.status}</span>
          <h3>{order.productName}</h3>
          <p>
            {order.customerName} / {order.contact}
            <br />
            Quantity: {order.quantity}
            <br />
            {order.notes}
          </p>
          <div className="admin-actions">
            <select
              className="admin-select"
              value={order.status}
              onChange={(event) => patch(order.id, { status: event.target.value as OrderIntent["status"] })}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="paid">Paid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="danger-button" onClick={() => remove(order.id)}>
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
