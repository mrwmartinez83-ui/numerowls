import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";

const YEAR_EMOJI: Record<number, string> = { 1: "🌱", 2: "🌿", 3: "🌳", 4: "⭐", 5: "🚀", 6: "🏆" };

import { XP_PER_LEVEL, getLevel, getXpIntoLevel } from "@/lib/xpUtils";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/dashboard", label: "My Dashboard", icon: "📊" },
    { href: "/practice", label: "Practice", icon: "🧩" },
    { href: "/competition", label: "Competition", icon: "🏆" },
    { href: "/games", label: "Games Hub", icon: "🎮" },
    { href: "/escape-rooms", label: "Escape Rooms", icon: "🔐" },
    { href: "/puzzles", label: "Shape Puzzles", icon: "🔢" },
    { href: "/test", label: "Timed Test", icon: "⏱️" },
    { href: "/potw", label: "Problem of the Week", icon: "🦉" },
    { href: "/leaderboard", label: "Leaderboard", icon: "🏅" },
  ];

  const level = getLevel(user?.xp ?? 0);
  const xpIntoLevel = getXpIntoLevel(user?.xp ?? 0);
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

  return (
    <nav className="no-nav">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: "28px" }}>🦉</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "20px", color: "#F5A623", letterSpacing: "-0.5px" }}>
              NumerOwls
            </span>
          </Link>

          {/* Nav links — desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }} className="hidden md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`no-nav-link ${location === link.href || (link.href !== "/" && location.startsWith(link.href)) ? "active" : ""}`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            {(user?.role === "teacher" || user?.role === "admin") && (
              <Link href="/teacher" className={`no-nav-link ${location.startsWith("/teacher") ? "active" : ""}`}>
                <span>👩‍🏫</span>
                <span>Teacher</span>
              </Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin/questions" className={`no-nav-link ${location.startsWith("/admin") ? "active" : ""}`}>
                <span>📚</span>
                <span>Q Bank</span>
              </Link>
            )}
          </div>

          {/* Auth section */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {isAuthenticated ? (
              <>
                {/* 🔥 Streak badge */}
                {(user?.currentStreak ?? 0) > 0 && (
                  <Link href="/dashboard" style={{ textDecoration: "none" }}>
                    <div
                      title={`${user?.currentStreak}-day streak! Keep it up!`}
                      style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        padding: "4px 10px", borderRadius: "20px",
                        background: "rgba(255,100,30,0.14)",
                        border: "1px solid rgba(255,100,30,0.4)",
                        fontSize: "12px", fontWeight: 800, color: "#FF6820",
                        cursor: "pointer",
                      }}
                    >
                      🔥 {user?.currentStreak}
                    </div>
                  </Link>
                )}

                {/* ⚡ XP level badge with mini bar */}
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                  <div
                    title={`Level ${level} · ${xpIntoLevel}/${XP_PER_LEVEL} XP`}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      padding: "3px 10px", borderRadius: "12px",
                      background: "rgba(245,166,35,0.10)",
                      border: "1px solid rgba(245,166,35,0.3)",
                      cursor: "pointer", minWidth: "52px",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#F5A623", lineHeight: 1.2 }}>
                      ⚡ Lv {level}
                    </span>
                    <div style={{ width: "40px", height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.1)", marginTop: "2px" }}>
                      <div style={{
                        height: "100%", borderRadius: "99px",
                        background: "linear-gradient(90deg, #F5A623, #FFD700)",
                        width: `${xpPct}%`,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                </Link>

                {/* Year group badge */}
                {user?.yearGroup && (
                  <Link href="/dashboard" style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "4px 10px", borderRadius: "20px",
                      background: "rgba(78,205,196,0.12)",
                      border: "1px solid rgba(78,205,196,0.3)",
                      fontSize: "12px", fontWeight: 700, color: "#4ECDC4",
                      cursor: "pointer",
                    }}>
                      <span>{YEAR_EMOJI[user.yearGroup] ?? "📚"}</span>
                      <span>Year {user.yearGroup}</span>
                    </div>
                  </Link>
                )}

                {/* Avatar + name → badges page */}
                <Link href="/badges" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
                  <span style={{ fontSize: "22px" }}>{user?.avatarEmoji ?? "🦉"}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#F5A623" }}>
                    {user?.displayName ?? user?.name ?? "Owl"}
                  </span>
                </Link>

                <button
                  className="no-btn-ghost"
                  style={{ fontSize: "13px", padding: "6px 14px" }}
                  onClick={() => logout()}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
                  <button className="no-btn-ghost" style={{ fontSize: "13px", padding: "7px 16px" }}>
                    Sign in
                  </button>
                </a>
                <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
                  <button className="no-btn-gold" style={{ fontSize: "13px", padding: "7px 16px" }}>
                    🦉 Sign Up Free
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
