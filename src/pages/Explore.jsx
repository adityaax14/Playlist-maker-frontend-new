import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getTrendingPlaylists,
  getTopRatedPlaylists,
  getNewestPlaylists,
  savePlaylist,
  getSavedPlaylists,
} from "../api/playlist.js";
import { searchPlaylists } from "../api/Search.api.js";
import "../styles/explore.css";
import "../styles/dashboard.css";
import StarRating from "./StarRating.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { logoutUser } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const SECTIONS = [
  { key: "trending", label: "Trending",  icon: "🔥", badge: "HOT"  },
  { key: "topRated", label: "Top Rated", icon: "⭐", badge: "BEST" },
  { key: "newest",   label: "Newest",    icon: "✨", badge: "NEW"  },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "views",     label: "Most Viewed"   },
  { value: "rating",    label: "Top Rated"     },
  { value: "newest",    label: "Newest"        },
];

const SEARCH_LIMIT = 20;

/* ─────────────────────────────────────────────
   USER MENU
───────────────────────────────────────────── */
function UserMenu({ username }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="db-user-menu" onBlur={() => setOpen(false)} tabIndex={0}>
      <button className="db-user-avatar" onClick={() => setOpen((v) => !v)}>
        {(username || "U")[0].toUpperCase()}
      </button>
      {open && (
        <div className="db-user-dropdown">
          <span className="db-user-name">👤 {username}</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HIGHLIGHT
───────────────────────────────────────────── */
function Highlight({ text = "", query = "" }) {
  if (!query.trim()) return <span>{text}</span>;
  const terms   = [...new Set(query.trim().split(/\W+/).filter(Boolean))];
  const pattern = new RegExp(
    `(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);
  return (
    <span>
      {parts.map((part, i) =>
        pattern.test(part)
          ? <mark key={i} className="ex-highlight">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────
   PLAYLIST CARD
───────────────────────────────────────────── */
function PlaylistCard({ playlist, index, savedIds, onSave, query = "" }) {
  const navigate = useNavigate();
  const isSaved  = savedIds.has(playlist._id);
  const isSearch = query.trim().length > 0;

  return (
    <div
      className="pc-card"
      style={{ "--delay": `${(index % SEARCH_LIMIT) * 55}ms` }}
      onClick={() => navigate(`/playlist/${playlist._id}`, { state: { from: "/explore" } })}
    >
      <div className="pc-thumb">
        {playlist.videos?.[0]?.thumbnailUrl ? (
          <img src={playlist.videos[0].thumbnailUrl} alt={playlist.title} loading="lazy" />
        ) : (
          <div className="pc-thumb-empty"><span>🎬</span></div>
        )}
        <div className="pc-thumb-overlay" />
        <div className="pc-count">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
          {playlist.totalVideos ?? 0}
        </div>
        <div className="pc-play-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>

      <div className="pc-body">
        <h3 className="pc-title">
          {isSearch ? <Highlight text={playlist.title} query={query} /> : playlist.title}
        </h3>
        <p className="pc-desc">
          {isSearch ? <Highlight text={playlist.description || ""} query={query} /> : playlist.description}
        </p>

        <div className="pc-meta">
          <div className="pc-creator">
            <div className="pc-avatar">
              {(playlist.creator?.username || "Y")[0].toUpperCase()}
            </div>
            <span>
              {isSearch
                ? <Highlight text={playlist.creator?.username || ""} query={query} />
                : (playlist.creator?.username || "You")}
            </span>
          </div>
        </div>

        <div className="pc-stats">
          <span className="pc-stat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            {(playlist.views || 0).toLocaleString()}
          </span>
          <span className="pc-stat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {playlist.commentCount ?? 0}
          </span>
        </div>

        <div className="pc-rating" onClick={(e) => e.stopPropagation()}>
          <StarRating
            playlistId={playlist._id}
            averageRating={playlist.averageRating}
            ratingsCount={playlist.ratingsCount}
            size="md"
          />
        </div>

        <div className="pc-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`pc-save-btn ${isSaved ? "pc-save-btn--saved" : ""}`}
            onClick={(e) => !isSaved && onSave(e, playlist._id)}
            disabled={isSaved}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            className="pc-open-btn"
            onClick={() => navigate(`/playlist/${playlist._id}`, { state: { from: "/explore" } })}
          >
            Open
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function SkeletonCard({ i }) {
  return (
    <div className="pc-skeleton" style={{ "--delay": `${i * 60}ms` }}>
      <div className="sk-thumb" />
      <div className="sk-body">
        <div className="sk-line sk-title" />
        <div className="sk-line sk-desc"  />
        <div className="sk-line sk-short" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INFINITE SCROLL SENTINEL
───────────────────────────────────────────── */
function ScrollSentinel({ onVisible }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { rootMargin: "200px" }   // trigger 200px before reaching the bottom
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return <div ref={ref} style={{ height: 1 }} />;
}

/* ─────────────────────────────────────────────
   EXPLORE
───────────────────────────────────────────── */
export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user }  = useAuth();

  // ── Browse sections ──
  const [trending,      setTrending]      = useState([]);
  const [topRated,      setTopRated]      = useState([]);
  const [newest,        setNewest]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeSection, setActiveSection] = useState("trending");

  // ── Search state ──
  const [inputVal,      setInputVal]      = useState(searchParams.get("q") || "");
  const [activeQuery,   setActiveQuery]   = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotal,   setSearchTotal]   = useState(0);
  const [searchPage,    setSearchPage]    = useState(1);
  const [hasMore,       setHasMore]       = useState(false);
  const [sort,          setSort]          = useState("relevance");
  const [searching,     setSearching]     = useState(false);   // initial/sort search
  const [loadingMore,   setLoadingMore]   = useState(false);   // scroll-load
  const [searched,      setSearched]      = useState(!!searchParams.get("q"));

  // ── Saved ──
  const [savedIds, setSavedIds] = useState(new Set());

  // ── Prevent duplicate concurrent fetches ──
  const fetchingRef = useRef(false);

  /* ── Save scroll position when leaving ── */
  useEffect(() => {
    const handleScroll = () => sessionStorage.setItem("exploreScrollY", window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Restore scroll position ── */
  useEffect(() => {
    const savedY = sessionStorage.getItem("exploreScrollY");
    if (savedY) setTimeout(() => window.scrollTo({ top: parseInt(savedY), behavior: "instant" }), 50);
  }, [loading]);

  /* ── Initial load ── */
  useEffect(() => {
    loadSections();
    loadSavedIds();
    const q = searchParams.get("q");
    if (q) runSearch(q, 1, "relevance", false);
  }, []);

  const loadSections = async () => {
    try {
      const [t, r, n] = await Promise.all([
        getTrendingPlaylists(),
        getTopRatedPlaylists(),
        getNewestPlaylists(),
      ]);
      setTrending(t.data);
      setTopRated(r.data);
      setNewest(n.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadSavedIds = async () => {
    try {
      const res = await getSavedPlaylists();
      setSavedIds(new Set((res.data || []).map(p => p._id)));
    } catch {}
  };

  /* ── Core search function ──
     append = false → fresh search (replace results)
     append = true  → load next page (append to results)
  ── */
  const runSearch = async (q, page = 1, srt = sort, append = false) => {
    if (!q.trim()) return;
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    if (append) setLoadingMore(true);
    else        setSearching(true);

    setSearched(true);

    try {
      const res = await searchPlaylists({ q, page, limit: SEARCH_LIMIT, sort: srt });
      const { results, pagination } = res.data;

      setSearchResults(prev => append ? [...prev, ...results] : results);
      setSearchTotal(pagination.total);
      setSearchPage(page);
      setHasMore(pagination.hasNext);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  };

  /* ── Load next page (called by sentinel) ── */
  const loadNextPage = useCallback(() => {
    if (!hasMore || loadingMore || searching || fetchingRef.current) return;
    runSearch(activeQuery, searchPage + 1, sort, true);
  }, [hasMore, loadingMore, searching, activeQuery, searchPage, sort]);

  /* ── New search submit ── */
  const handleSubmit = (e) => {
    e?.preventDefault();
    const q = inputVal.trim();
    if (!q) { clearSearch(); return; }
    setActiveQuery(q);
    setSort("relevance");
    setSearchParams({ q });
    setSearchResults([]);
    runSearch(q, 1, "relevance", false);
  };

  /* ── Sort change: restart from page 1 ── */
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setSearchResults([]);
    runSearch(activeQuery, 1, newSort, false);
  };

  /* ── Clear ── */
  const clearSearch = () => {
    setInputVal("");
    setActiveQuery("");
    setSearchResults([]);
    setSearchTotal(0);
    setSearched(false);
    setHasMore(false);
    setSearchPage(1);
    setSearchParams({});
  };

  const handleSave = async (e, playlistId) => {
    e.stopPropagation();
    try {
      await savePlaylist(playlistId);
      setSavedIds(prev => new Set([...prev, playlistId]));
    } catch (err) { console.error("Save failed", err); }
  };

  const handleLogout = async () => {
    try { await logoutUser(); navigate("/login"); }
    catch (err) { console.error(err); }
  };

  const sectionData  = { trending, topRated, newest };
  const currentList  = sectionData[activeSection] || [];

  return (
    <div className="ex-root">
      {/* Background orbs */}
      <div className="ex-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* ── Navbar ── */}
      <header className="db-nav">
        <div className="db-nav-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            <path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
          </svg>
          <span>PlaylistHub</span>
        </div>
        <div className="db-nav-actions">
          <button className="db-nav-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <UserMenu username={user?.username} />
          <button className="db-nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="ex-wrap">

        {/* ── Search bar ── */}
        <form className="ex-search-wrap" onSubmit={handleSubmit}>
          <div className="ex-search-box">
            <svg className="ex-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="ex-search-input"
              placeholder="Search by title, description, creator…"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            {inputVal && (
              <button type="button" className="ex-search-clear" onClick={clearSearch}>✕</button>
            )}
          </div>
          <button type="submit" className="ex-search-btn" disabled={searching}>
            {searching ? <span className="ex-spinner" /> : "Search"}
          </button>
        </form>

        {/* ── SEARCH MODE ── */}
        {searched && (
          <>
            <div className="ex-search-toolbar">
              <div className="ex-search-meta">
                {!searching && (
                  <span className="ex-results-count">
                    {searchTotal > 0
                      ? <><strong>{searchTotal.toLocaleString()}</strong> results for "<em>{activeQuery}</em>"</>
                      : <>No results for "<em>{activeQuery}</em>"</>}
                  </span>
                )}
                <button className="ex-clear-results" onClick={clearSearch}>✕ Clear</button>
              </div>
              <div className="ex-sort-row">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`ex-sort-btn ${sort === opt.value ? "ex-sort-btn--active" : ""}`}
                    onClick={() => handleSortChange(opt.value)}
                    disabled={searching}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Initial skeleton */}
            {searching && (
              <div className="ex-grid">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
              </div>
            )}

            {/* Results grid */}
            {!searching && searchResults.length > 0 && (
              <>
                <div className="ex-grid">
                  {searchResults.map((p, i) => (
                    <PlaylistCard
                      key={`${p._id}-${i}`}
                      playlist={p}
                      index={i}
                      savedIds={savedIds}
                      onSave={handleSave}
                      query={activeQuery}
                    />
                  ))}
                </div>

                {/* Loading more skeletons */}
                {loadingMore && (
                  <div className="ex-grid ex-grid--more">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
                  </div>
                )}

                {/* Invisible sentinel — triggers next page load */}
                {hasMore && !loadingMore && (
                  <ScrollSentinel onVisible={loadNextPage} />
                )}

                {/* End of results indicator */}
                {!hasMore && !loadingMore && (
                  <div className="ex-end-label">
                    <span>— {searchTotal.toLocaleString()} results —</span>
                  </div>
                )}
              </>
            )}

            {/* No results */}
            {!searching && searchResults.length === 0 && (
              <div className="ex-empty-search">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <h3>No playlists found</h3>
                <p>Try different keywords or check the spelling</p>
              </div>
            )}
          </>
        )}

        {/* ── BROWSE MODE ── */}
        {!searched && (
          <>
            <nav className="ex-tabs">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  className={`ex-tab ${activeSection === s.key ? "ex-tab--active" : ""}`}
                  onClick={() => setActiveSection(s.key)}
                >
                  <span>{s.icon}</span>
                  {s.label}
                  <span className="ex-tab-badge">{s.badge}</span>
                </button>
              ))}
            </nav>

            <section className="ex-section ex-section--main">
              <div className="ex-grid">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} i={i} />)
                  : currentList.map((p, i) => (
                      <PlaylistCard
                        key={p._id}
                        playlist={p}
                        index={i}
                        savedIds={savedIds}
                        onSave={handleSave}
                        query=""
                      />
                    ))
                }
              </div>
              {!loading && currentList.length === 0 && (
                <div className="ex-empty">No playlists found</div>
              )}
            </section>
          </>
        )}

      </div>
    </div>
  );
}