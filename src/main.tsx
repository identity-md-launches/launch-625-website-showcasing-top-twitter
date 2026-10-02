import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import posts from "./posts.json";
import "./styles.css";

type IconName =
  | "arrow"
  | "down"
  | "search"
  | "bookmark"
  | "pause"
  | "play"
  | "close"
  | "spark"
  | "x";
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const shapes: Record<IconName, React.ReactNode> = {
    arrow: <path d="M6 18 18 6M6 6h12v12" />,
    down: <path d="M12 4v16m-6-6 6 6 6-6" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
    pause: (
      <>
        <path d="M8 5v14M16 5v14" />
      </>
    ),
    play: <path d="m8 4 12 8-12 8V4Z" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    spark: (
      <>
        <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />
      </>
    ),
    x: <path d="M5 4h4l10 16h-4L5 4Zm14 0L5 20" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}
function Mark() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="27"
      height="27"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 24V15m7 9V9m8 15V4m7 20V12" />
    </svg>
  );
}
const STORAGE_KEY = "identity-signal-saved-v1";
function getSaved(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );
    return Array.isArray(value)
      ? value.filter(
          (id): id is string =>
            typeof id === "string" && posts.some((p) => p.id === id),
        )
      : [];
  } catch {
    return [];
  }
}
function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (preference.matches) video.current?.pause();
      else void video.current?.play().catch(() => setPlaying(false));
    };
    apply();
    preference.addEventListener("change", apply);
    return () => preference.removeEventListener("change", apply);
  }, []);
  return (
    <>
      <div className="hero-media" aria-hidden="true">
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="metadata"
          poster="./media/swarm-poster.webp"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
        >
          <source src="./media/swarm.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="scene-caption">
        <span className="scene-label">
          <span className="tiny-square" /> A little collective intelligence.
        </span>
        {failed ? (
          <span className="motion-button">Still illustration</span>
        ) : (
          <button
            className="motion-button"
            onClick={() => {
              if (playing) video.current?.pause();
              else void video.current?.play().catch(() => setFailed(true));
            }}
            aria-label={
              playing ? "Pause background video" : "Play background video"
            }
          >
            <Icon name={playing ? "pause" : "play"} size={14} />
            <span>{playing ? "Pause" : "Play"} scene</span>
          </button>
        )}
      </div>
    </>
  );
}
type Post = (typeof posts)[number];
function PostCard({
  post,
  saved,
  onSave,
  featured,
}: {
  post: Post;
  saved: boolean;
  onSave: () => void;
  featured: boolean;
}) {
  const date = new Date(post.date);
  return (
    <article
      className={`post-card ${featured ? "featured-card" : ""} ${post.cover ? "has-cover" : "text-card"}`}
    >
      <div className="card-top">
        <div className="author">
          <img
            src={`./${post.avatar}`}
            alt=""
            width="36"
            height="36"
            loading="lazy"
          />
          <div>
            <span className="author-name">{post.author}</span>
            <span className="author-handle">@{post.handle}</span>
          </div>
        </div>
        <button
          className={`save-button ${saved ? "is-saved" : ""}`}
          onClick={onSave}
          aria-pressed={saved}
          aria-label={`${saved ? "Unsave" : "Save"} ${post.title}`}
          title={saved ? "Remove from saved posts" : "Save post"}
        >
          <Icon name="bookmark" size={18} />
        </button>
      </div>
      <a
        className="post-link"
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Read ${post.title} on X (opens in a new tab)`}
      >
        {post.cover && (
          <div className="cover">
            <img src={`./${post.cover}`} alt="" loading="lazy" />
            <span className="image-tag">
              {featured ? "Editor’s pick" : post.type}
            </span>
          </div>
        )}
        <div className="card-copy">
          <div className="post-meta">
            <span>{post.type}</span>
            <span aria-hidden="true">/</span>
            <time dateTime={date.toISOString()}>
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
            {post.handle === "joechalom" && (
              <span className="context-tag">Wider context</span>
            )}
          </div>
          <h3>{post.title}</h3>
          <p className="excerpt">“{post.excerpt}”</p>
          <div className="card-bottom">
            <span>
              Read {post.type.toLowerCase()} <span className="on-x">on X</span>
            </span>
            <Icon name="arrow" size={18} />
          </div>
        </div>
      </a>
    </article>
  );
}
function App() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("curated");
  const [saved, setSaved] = useState<string[]>(getSaved);
  const [notice, setNotice] = useState("");
  const visible = useMemo(() => {
    const result = posts.filter(
      (p) =>
        (filter === "All" ||
          (filter === "Articles" && p.type === "Article") ||
          (filter === "Posts" && p.type !== "Article") ||
          (filter === "Saved" && saved.includes(p.id))) &&
        `${p.author} ${p.handle} ${p.title} ${p.excerpt} ${p.text}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
    if (sort !== "curated")
      result.sort(
        (a, b) =>
          (sort === "newest" ? 1 : -1) *
          (Date.parse(b.date) - Date.parse(a.date)),
      );
    return result;
  }, [filter, query, sort, saved]);
  function toggleSaved(id: string) {
    const wasSaved = saved.includes(id);
    const next = wasSaved
      ? saved.filter((item) => item !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setNotice(
        wasSaved ? "Post removed from saved." : "Post saved in this browser.",
      );
    } catch {
      setNotice("Saved for this visit. Browser storage is unavailable.");
    }
  }
  function resetFilters() {
    setQuery("");
    setFilter("All");
    setSort("curated");
  }
  return (
    <>
      <a className="skip-link" href="#collection">
        Skip to the collection
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="brand" aria-label="Signal home">
            <span className="brand-mark">
              <Mark />
            </span>
            <span>
              signal<span className="brand-period">.</span>
            </span>
            <span className="brand-byline">on identity.md</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#collection" className="nav-collection">
              The collection
            </a>
            <a href="#about">The idea</a>
            <button
              className={`saved-nav ${filter === "Saved" ? "selected" : ""}`}
              onClick={() => {
                setFilter("Saved");
                setQuery("");
                document.getElementById("collection")?.scrollIntoView();
              }}
            >
              <Icon name="bookmark" size={16} />
              <span>Saved</span>
              <span className="saved-count">{saved.length}</span>
            </button>
          </nav>
          <a
            className="project-link"
            href="https://imd.fun"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore identity.md <Icon name="arrow" size={15} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-inner">
            <HeroVideo />
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="status-dot" /> Independent voices. Shared
                curiosity.
              </div>
              <h1 id="hero-title">
                Big ideas.
                <br />A little <span className="hero-emphasis">frog</span>
                <br />
                energy<span className="lime-period">.</span>
              </h1>
              <p>
                The best reads on identity.md.
                <br />
                Explore the ideas and people behind a new
                <br className="desktop-break" /> kind of collective
                intelligence.
              </p>
              <a href="#collection" className="primary-button">
                Explore the collection <Icon name="down" size={19} />
              </a>
              <div className="hero-proof">
                <div className="avatar-stack">
                  {posts.slice(0, 4).map((p) => (
                    <img
                      src={`./${p.avatar}`}
                      key={p.id}
                      alt=""
                      width="28"
                      height="28"
                    />
                  ))}
                </div>
                <span>7 voices. A bigger conversation.</span>
              </div>
            </div>
            <div className="hero-coordinate" aria-hidden="true">
              HUMANS × AGENTS
            </div>
          </div>
        </section>
        <div className="topic-strip">
          <div className="container">
            <span>
              <Icon name="spark" size={16} /> Ideas worth your attention
            </span>
            <div>
              <span>AI agents</span>
              <span className="strip-cross">+</span>
              <span>Onchain identity</span>
              <span className="strip-cross">+</span>
              <span>Collective intelligence</span>
            </div>
            <span className="strip-edition">FIELD NOTES / 001</span>
          </div>
        </div>
        <section
          className="collection container"
          id="collection"
          aria-labelledby="collection-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow section-eyebrow">The reading room</div>
              <h2 id="collection-title">Less noise. More signal.</h2>
            </div>
            <p>
              A handpicked collection from across X.
              <br />
              Different perspectives. One unfolding story.
            </p>
          </div>
          <div className="toolbar">
            <div
              className="filters"
              role="group"
              aria-label="Filter the collection"
            >
              {[
                "All",
                "Articles",
                "Posts",
                ...(filter === "Saved" ? ["Saved"] : []),
              ].map((value) => (
                <button
                  key={value}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value === "All" ? "All reads" : value}
                  <span>
                    {value === "All"
                      ? 7
                      : value === "Articles"
                        ? 4
                        : value === "Posts"
                          ? 3
                          : saved.length}
                  </span>
                </button>
              ))}
            </div>
            <div className="search-group">
              <label htmlFor="search">Search</label>
              <div className="search-field">
                <Icon name="search" size={17} />
                <input
                  type="search"
                  id="search"
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="An idea, a name…"
                  autoComplete="off"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="results-bar">
            <p role="status">
              {visible.length} {visible.length === 1 ? "read" : "reads"}
              {filter === "Saved"
                ? " saved in this browser"
                : " in the collection"}
            </p>
            <div>
              <label htmlFor="sort">Sort by</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="curated">Editor’s order</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
          {visible.length ? (
            <div
              className={`post-grid ${filter === "All" && !query && sort === "curated" ? "editorial-grid" : ""}`}
            >
              {visible.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  featured={
                    filter === "All" &&
                    !query &&
                    sort === "curated" &&
                    index === 0
                  }
                  saved={saved.includes(post.id)}
                  onSave={() => toggleSaved(post.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon
                name={filter === "Saved" ? "bookmark" : "search"}
                size={30}
              />
              <h3>
                {query
                  ? `No reads for “${query}”`
                  : "Your next good read goes here."}
              </h3>
              <p>
                {filter === "Saved" && !query
                  ? "Use the bookmark on any read to keep it in this browser."
                  : "Try another idea or name, or explore the full collection."}
              </p>
              <button className="primary-button" onClick={resetFilters}>
                Explore all reads <Icon name="arrow" size={17} />
              </button>
            </div>
          )}
          <div className="collection-footnote">
            <span>
              <Icon name="x" size={13} /> All reads open the original on X.
            </span>
            <span>
              Curated perspectives, not a live ranking.{" "}
              <span className="footnote-date">Collected October 2, 2026.</span>
            </span>
          </div>
        </section>
        <section id="about" className="about-section container">
          <div className="about-icon" aria-hidden="true">
            <Mark />
          </div>
          <div className="about-copy">
            <div className="eyebrow">A shared rabbit hole</div>
            <h2>Good ideas don’t happen alone.</h2>
            <p>
              Signal is an independent reading room for the identity.md
              conversation: AI agents, onchain work, and what happens when they
              come together. Start with an article. Follow a new voice. Make up
              your own mind.
            </p>
          </div>
          <a
            className="about-link"
            href="https://imd.fun"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meet identity.md <Icon name="arrow" size={20} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </section>
      </main>
      <footer className="site-footer container">
        <a href="#" className="brand footer-brand">
          <Mark />
          <span>signal.</span>
        </a>
        <p>A community reading room. Made for the curious.</p>
        <a href="#hero-title">Back to top ↑</a>
      </footer>
      <div className="save-notice" role="status">
        {notice && (
          <>
            <Icon name="bookmark" size={16} />
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss save notification"
            >
              <Icon name="close" size={16} />
            </button>
          </>
        )}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
