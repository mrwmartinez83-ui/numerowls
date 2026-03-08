import { Link, useLocation } from "wouter";
import { useProgress } from "@/hooks/useProgress";

const OWL_SVG = `
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Body -->
  <ellipse cx="40" cy="52" rx="22" ry="24" fill="#1A2E4A" stroke="#F5A623" stroke-width="2"/>
  <!-- Head -->
  <circle cx="40" cy="28" r="20" fill="#1A2E4A" stroke="#F5A623" stroke-width="2"/>
  <!-- Ear tufts -->
  <polygon points="24,12 20,2 28,10" fill="#F5A623"/>
  <polygon points="56,12 60,2 52,10" fill="#F5A623"/>
  <!-- Eyes -->
  <circle cx="32" cy="26" r="8" fill="#F5A623"/>
  <circle cx="48" cy="26" r="8" fill="#F5A623"/>
  <circle cx="32" cy="26" r="5" fill="#0F1B2D"/>
  <circle cx="48" cy="26" r="5" fill="#0F1B2D"/>
  <circle cx="33.5" cy="24.5" r="1.5" fill="white"/>
  <circle cx="49.5" cy="24.5" r="1.5" fill="white"/>
  <!-- Beak -->
  <polygon points="40,31 36,36 44,36" fill="#F5A623"/>
  <!-- Wings -->
  <ellipse cx="18" cy="54" rx="10" ry="16" fill="#243B55" stroke="#F5A623" stroke-width="1.5" transform="rotate(-15 18 54)"/>
  <ellipse cx="62" cy="54" rx="10" ry="16" fill="#243B55" stroke="#F5A623" stroke-width="1.5" transform="rotate(15 62 54)"/>
  <!-- Graduation cap -->
  <rect x="22" y="10" width="36" height="5" rx="2" fill="#F5A623"/>
  <rect x="36" y="5" width="8" height="7" rx="1" fill="#F5A623"/>
  <line x1="58" y1="12" x2="64" y2="18" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <circle cx="64" cy="20" r="3" fill="#4ECDC4"/>
  <!-- Feet -->
  <line x1="32" y1="74" x2="28" y2="78" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="74" x2="32" y2="78" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="74" x2="36" y2="78" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="48" y1="74" x2="44" y2="78" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="48" y1="74" x2="48" y2="78" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
  <line x1="48" y1="74" x2="52" y2="78" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/starter", label: "🎯 Starter" },
  { href: "/practice", label: "🧩 Practice" },
  { href: "/badges", label: "🏆 Badges" },
  { href: "/compete", label: "⚡ Compete" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { getTotalScore } = useProgress();
  const { correct, attempted } = getTotalScore();

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D", fontFamily: "'Nunito', sans-serif" }}>
      {/* ── Navigation ── */}
      <nav
        style={{
          background: "rgba(15, 27, 45, 0.95)",
          borderBottom: "1px solid rgba(245, 166, 35, 0.2)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            {/* Logo */}
            <Link href="/">
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <div style={{ width: 40, height: 40 }} dangerouslySetInnerHTML={{ __html: OWL_SVG }} />
                <div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 20, color: "#F5A623", lineHeight: 1.1 }}>
                    NumerOwls
                  </div>
                  <div style={{ fontSize: 10, color: "#B0C4DE", fontWeight: 600, letterSpacing: "0.05em" }}>
                    BE WISE. BE SHARP.
                  </div>
                </div>
              </div>
            </Link>

            {/* Nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 14,
                        color: isActive ? "#F5A623" : "#B0C4DE",
                        background: isActive ? "rgba(245, 166, 35, 0.12)" : "transparent",
                        border: isActive ? "1px solid rgba(245, 166, 35, 0.3)" : "1px solid transparent",
                        transition: "all 0.15s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Score badge */}
            {attempted > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(245, 166, 35, 0.12)",
                  border: "1px solid rgba(245, 166, 35, 0.3)",
                  borderRadius: 12,
                  padding: "6px 14px",
                }}
              >
                <span style={{ fontSize: 16 }}>⭐</span>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: "#F5A623", lineHeight: 1 }}>
                    {correct}/{attempted}
                  </div>
                  <div style={{ fontSize: 10, color: "#B0C4DE", fontWeight: 600 }}>Score</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(245, 166, 35, 0.15)",
          padding: "40px 0 24px",
          marginTop: 80,
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32 }} dangerouslySetInnerHTML={{ __html: OWL_SVG }} />
              <div>
                <div style={{ fontWeight: 900, fontSize: 16, color: "#F5A623" }}>NumerOwls</div>
                <div style={{ fontSize: 11, color: "#B0C4DE" }}>Be Wise. Be Sharp.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}>
                  <span style={{ fontSize: 13, color: "#B0C4DE", cursor: "pointer", fontWeight: 600 }}>{l.label}</span>
                </Link>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "rgba(176,196,222,0.4)", fontWeight: 600 }}>
              © 2026 NumerOwls · NumerOwls.com
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { OWL_SVG };
