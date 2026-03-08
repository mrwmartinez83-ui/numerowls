import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/dashboard", label: "My Dashboard", icon: "📊" },
    { href: "/practice", label: "Practice", icon: "🧩" },
    { href: "/test", label: "Timed Test", icon: "⏱️" },
    { href: "/potw", label: "Problem of the Week", icon: "🦉" },
    { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  ];

  return (
    <nav className="no-nav">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <span style={{ fontSize: "28px" }}>🦉</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "20px", color: "#F5A623", letterSpacing: "-0.5px" }}>
              NumerOwls
            </span>
          </Link>

          {/* Nav links — desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hidden md:flex">
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
            {user?.role === "teacher" || user?.role === "admin" ? (
              <Link href="/teacher" className={`no-nav-link ${location.startsWith("/teacher") ? "active" : ""}`}>
                <span>👩‍🏫</span>
                <span>Teacher</span>
              </Link>
            ) : null}
          </div>

          {/* Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isAuthenticated ? (
              <>
                <Link href="/badges" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
                  <span style={{ fontSize: "20px" }}>{user?.avatarEmoji ?? "🦉"}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#F5A623" }}>
                    {user?.displayName ?? user?.name ?? "Owl"}
                  </span>
                </Link>
                <button className="no-btn-ghost" style={{ fontSize: "13px", padding: "6px 14px" }} onClick={() => logout()}>
                  Sign out
                </button>
              </>
            ) : (
              <a href={getLoginUrl()} className="no-btn-gold" style={{ fontSize: "14px", padding: "8px 18px" }}>
                Sign in
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
