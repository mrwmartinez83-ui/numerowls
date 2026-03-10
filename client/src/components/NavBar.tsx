import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { XP_PER_LEVEL, getLevel, getXpIntoLevel } from "@/lib/xpUtils";

const YEAR_EMOJI: Record<number, string> = { 1: "🌱", 2: "🌿", 3: "🌳", 4: "⭐", 5: "🚀", 6: "🏆" };

// Menu groups shown in the hamburger slide-out
const MENU_GROUPS = [
  {
    label: "📚 Learn",
    items: [
      { href: "/practice",    icon: "🧩", label: "Practice" },
      { href: "/test",        icon: "⏱️", label: "Timed Test" },
      { href: "/potw",        icon: "🦉", label: "Problem of the Week" },
    ],
  },
  {
    label: "🎮 Play",
    items: [
      { href: "/games",        icon: "🎮", label: "Games Hub" },
      { href: "/escape-rooms", icon: "🔐", label: "Escape Rooms" },
      { href: "/puzzles",      icon: "🔢", label: "Shape Puzzles" },
    ],
  },
  {
    label: "🏆 Compete",
    items: [
      { href: "/competition",  icon: "🏆", label: "Competition Mode" },
      { href: "/leaderboard",  icon: "🏅", label: "Leaderboard" },
    ],
  },
];

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const level = getLevel(user?.xp ?? 0);
  const xpIntoLevel = getXpIntoLevel(user?.xp ?? 0);
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="no-nav">
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontSize: "28px" }}>🦉</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "20px", color: "#F5A623", letterSpacing: "-0.5px" }}>
                NumerOwls
              </span>
            </Link>

            {/* Primary nav — 3 always-visible links (desktop only) */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hidden md:flex">
              <Link href="/dashboard" className={`no-nav-link ${location.startsWith("/dashboard") ? "active" : ""}`}>
                <span>📊</span><span>My Dashboard</span>
              </Link>
              <Link href="/practice" className={`no-nav-link ${location.startsWith("/practice") ? "active" : ""}`}>
                <span>🧩</span><span>Practice</span>
              </Link>
              <Link href="/leaderboard" className={`no-nav-link ${location.startsWith("/leaderboard") ? "active" : ""}`}>
                <span>🏅</span><span>Leaderboard</span>
              </Link>
              {(user?.role === "teacher" || user?.role === "admin") && (
                <Link href="/teacher" className={`no-nav-link ${location.startsWith("/teacher") ? "active" : ""}`}>
                  <span>👩‍🏫</span><span>Teacher</span>
                </Link>
              )}
            </div>

            {/* Right side: badges + avatar + hamburger */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              {isAuthenticated ? (
                <>
                  {/* 🔥 Streak badge */}
                  {(user?.currentStreak ?? 0) > 0 && (
                    <Link href="/dashboard" style={{ textDecoration: "none" }}>
                      <div title={`${user?.currentStreak}-day streak!`} style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        padding: "4px 10px", borderRadius: "20px",
                        background: "rgba(255,100,30,0.14)",
                        border: "1px solid rgba(255,100,30,0.4)",
                        fontSize: "12px", fontWeight: 800, color: "#FF6820", cursor: "pointer",
                      }}>
                        🔥 {user?.currentStreak}
                      </div>
                    </Link>
                  )}

                  {/* ⚡ XP level badge */}
                  <Link href="/dashboard" style={{ textDecoration: "none" }}>
                    <div title={`Level ${level} · ${xpIntoLevel}/${XP_PER_LEVEL} XP`} style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      padding: "3px 10px", borderRadius: "12px",
                      background: "rgba(245,166,35,0.10)",
                      border: "1px solid rgba(245,166,35,0.3)",
                      cursor: "pointer", minWidth: "52px",
                    }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#F5A623", lineHeight: 1.2 }}>⚡ Lv {level}</span>
                      <div style={{ width: "40px", height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.1)", marginTop: "2px" }}>
                        <div style={{
                          height: "100%", borderRadius: "99px",
                          background: "linear-gradient(90deg, #F5A623, #FFD700)",
                          width: `${xpPct}%`, transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  </Link>

                  {/* Avatar */}
                  <Link href="/badges" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
                    <span style={{ fontSize: "22px" }}>{user?.avatarEmoji ?? "🦉"}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#F5A623" }} className="hidden sm:inline">
                      {user?.displayName ?? user?.name ?? "Owl"}
                    </span>
                  </Link>
                </>
              ) : (
                <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
                  <button className="no-btn-gold" style={{ fontSize: "13px", padding: "7px 16px" }}>
                    🦉 Sign In
                  </button>
                </a>
              )}

              {/* Hamburger button */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  background: menuOpen ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "18px",
                  lineHeight: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
                aria-label="Open menu"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out overlay menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
          onClick={closeMenu}
        />
      )}

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1000,
        width: "min(320px, 88vw)",
        background: "#0F1B2D",
        borderLeft: "1.5px solid rgba(255,255,255,0.1)",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto",
        display: "flex", flexDirection: "column",
        boxShadow: menuOpen ? "-8px 0 40px rgba(0,0,0,0.5)" : "none",
      }}>
        {/* Menu header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "24px" }}>🦉</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "18px", color: "#F5A623" }}>NumerOwls</span>
          </div>
          <button onClick={closeMenu} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", padding: "6px 10px", cursor: "pointer", color: "white", fontSize: "16px",
          }}>✕</button>
        </div>

        {/* User info strip */}
        {isAuthenticated && (
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <span style={{ fontSize: "32px" }}>{user?.avatarEmoji ?? "🦉"}</span>
            <div>
              <div style={{ fontWeight: 800, color: "white", fontSize: "15px" }}>
                {user?.displayName ?? user?.name ?? "Owl"}
              </div>
              <div style={{ fontSize: "12px", color: "#8899AA", marginTop: "2px" }}>
                {user?.yearGroup ? `Year ${user.yearGroup} · ` : ""}⚡ Level {level} · {user?.totalPoints ?? 0} pts
              </div>
            </div>
          </div>
        )}

        {/* Menu groups */}
        <div style={{ padding: "12px 12px", flex: 1 }}>
          {MENU_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "11px", fontWeight: 800, color: "#8899AA",
                textTransform: "uppercase", letterSpacing: "0.08em",
                padding: "0 8px 8px",
              }}>
                {group.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "11px 12px", borderRadius: "10px",
                      textDecoration: "none",
                      background: location.startsWith(item.href) ? "rgba(245,166,35,0.12)" : "transparent",
                      border: location.startsWith(item.href) ? "1px solid rgba(245,166,35,0.25)" : "1px solid transparent",
                      color: location.startsWith(item.href) ? "#F5A623" : "#C8D8E8",
                      fontWeight: 700, fontSize: "15px",
                    }}
                  >
                    <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Teacher / Admin links */}
          {(user?.role === "teacher" || user?.role === "admin") && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "11px", fontWeight: 800, color: "#8899AA",
                textTransform: "uppercase", letterSpacing: "0.08em",
                padding: "0 8px 8px",
              }}>
                👩‍🏫 Staff
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <Link href="/teacher" onClick={closeMenu} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "11px 12px", borderRadius: "10px", textDecoration: "none",
                  color: "#C8D8E8", fontWeight: 700, fontSize: "15px",
                  background: location.startsWith("/teacher") ? "rgba(245,166,35,0.12)" : "transparent",
                  border: location.startsWith("/teacher") ? "1px solid rgba(245,166,35,0.25)" : "1px solid transparent",
                }}>
                  <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>👩‍🏫</span>
                  <span>Teacher Dashboard</span>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin/questions" onClick={closeMenu} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "11px 12px", borderRadius: "10px", textDecoration: "none",
                    color: "#C8D8E8", fontWeight: 700, fontSize: "15px",
                    background: location.startsWith("/admin") ? "rgba(245,166,35,0.12)" : "transparent",
                    border: location.startsWith("/admin") ? "1px solid rgba(245,166,35,0.25)" : "1px solid transparent",
                  }}>
                    <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>📚</span>
                    <span>Question Bank</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Badges & Dashboard */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "20px" }}>
            <Link href="/dashboard" onClick={closeMenu} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 12px", borderRadius: "10px", textDecoration: "none",
              color: "#C8D8E8", fontWeight: 700, fontSize: "15px",
              background: location === "/dashboard" ? "rgba(245,166,35,0.12)" : "transparent",
              border: location === "/dashboard" ? "1px solid rgba(245,166,35,0.25)" : "1px solid transparent",
            }}>
              <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>📊</span>
              <span>My Dashboard</span>
            </Link>
            <Link href="/badges" onClick={closeMenu} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 12px", borderRadius: "10px", textDecoration: "none",
              color: "#C8D8E8", fontWeight: 700, fontSize: "15px",
            }}>
              <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>🏆</span>
              <span>My Badges</span>
            </Link>
          </div>
        </div>

        {/* Sign out / sign in at bottom */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {isAuthenticated ? (
            <button
              className="no-btn-ghost"
              style={{ width: "100%", fontSize: "14px", padding: "10px" }}
              onClick={() => { logout(); closeMenu(); }}
            >
              Sign out
            </button>
          ) : (
            <a href={getLoginUrl()} style={{ textDecoration: "none", display: "block" }}>
              <button className="no-btn-gold" style={{ width: "100%", fontSize: "14px", padding: "10px" }}>
                🦉 Sign In / Sign Up Free
              </button>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
