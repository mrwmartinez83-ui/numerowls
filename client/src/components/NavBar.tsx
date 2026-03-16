import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";

const YEAR_EMOJI: Record<number, string> = { 1: "🌱", 2: "🌿", 3: "🌳", 4: "⭐", 5: "🚀", 6: "🏆" };

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/dashboard", label: "Dashboard", icon: "📊", authOnly: true },
    { href: "/practice", label: "Practice", icon: "🧩" },
    { href: "/competition", label: "Competition", icon: "🏆", highlight: true },
    { href: "/test", label: "Timed Paper", icon: "⏱️" },
    { href: "/puzzles", label: "Puzzles", icon: "🔢" },
    { href: "/potw", label: "Problem of Week", icon: "🦉" },
    { href: "/print", label: "Worksheets", icon: "🖨️" },
    { href: "/leaderboard", label: "Leaderboard", icon: "📈" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(15,27,45,0.95)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontSize: 26 }}>🦉</span>
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900, fontSize: 20,
                color: "#F5A623", letterSpacing: "-0.5px",
              }}>
                NumerOwls
              </span>
            </Link>

            {/* Desktop nav */}
            <div style={{
              display: "flex", alignItems: "center", gap: 2,
              overflow: "hidden",
            }} className="desktop-nav">
              {links.map(link => {
                if (link.authOnly && !isAuthenticated) return null;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 11px", borderRadius: 9,
                      textDecoration: "none", whiteSpace: "nowrap",
                      fontSize: 13, fontWeight: 700,
                      background: active
                        ? link.highlight ? "rgba(245,166,35,0.18)" : "rgba(255,255,255,0.08)"
                        : link.highlight ? "rgba(245,166,35,0.08)" : "transparent",
                      color: active
                        ? link.highlight ? "#F5A623" : "white"
                        : link.highlight ? "#F5A623" : "#B0C4DE",
                      border: link.highlight
                        ? `1.5px solid ${active ? "rgba(245,166,35,0.5)" : "rgba(245,166,35,0.25)"}`
                        : "1.5px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Teacher / Admin links */}
              {(user?.role === "teacher" || user?.role === "admin") && (
                <Link href="/teacher" style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 11px", borderRadius: 9, textDecoration: "none",
                  fontSize: 13, fontWeight: 700,
                  color: isActive("/teacher") ? "white" : "#B0C4DE",
                  background: isActive("/teacher") ? "rgba(255,255,255,0.08)" : "transparent",
                  border: "1.5px solid transparent",
                }}>
                  <span>👩‍🏫</span><span>Teacher</span>
                </Link>
              )}
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {isAuthenticated ? (
                <>
                  {user?.yearGroup && (
                    <Link href="/dashboard" style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 20,
                        background: "rgba(78,205,196,0.12)",
                        border: "1px solid rgba(78,205,196,0.3)",
                        fontSize: 12, fontWeight: 800, color: "#4ECDC4", cursor: "pointer",
                      }}>
                        <span>{YEAR_EMOJI[user.yearGroup] ?? "📚"}</span>
                        <span>Y{user.yearGroup}</span>
                      </div>
                    </Link>
                  )}

                  <Link href="/badges" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                    <span style={{ fontSize: 22 }}>{user?.avatarEmoji ?? "🦉"}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#F5A623", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.displayName ?? "Owl"}
                    </span>
                  </Link>

                  <button
                    className="no-btn-ghost"
                    style={{ fontSize: 12, padding: "5px 12px" }}
                    onClick={() => logout()}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
                    <button className="no-btn-ghost" style={{ fontSize: 13, padding: "6px 14px" }}>
                      Sign In
                    </button>
                  </a>
                  <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
                    <button className="no-btn-gold" style={{ fontSize: 13, padding: "6px 14px" }}>
                      Sign Up Free
                    </button>
                  </a>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="mobile-nav-toggle"
                style={{
                  background: "transparent", border: "none",
                  color: "white", fontSize: 22, cursor: "pointer",
                  padding: 4, display: "none",
                }}
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 199, top: 62,
          background: "rgba(15,27,45,0.98)",
          backdropFilter: "blur(20px)",
          padding: "20px",
          overflowY: "auto",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map(link => {
              if (link.authOnly && !isAuthenticated) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 12,
                    textDecoration: "none",
                    background: isActive(link.href) ? "rgba(255,255,255,0.08)" : "transparent",
                    color: isActive(link.href) ? "white" : "#B0C4DE",
                    fontSize: 16, fontWeight: 700,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{link.icon}</span>
                  <span>{link.label}</span>
                  {link.highlight && (
                    <span style={{
                      marginLeft: "auto", background: "rgba(245,166,35,0.2)",
                      border: "1px solid rgba(245,166,35,0.4)",
                      borderRadius: 99, padding: "2px 8px",
                      fontSize: 11, color: "#F5A623", fontWeight: 800,
                    }}>
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}
