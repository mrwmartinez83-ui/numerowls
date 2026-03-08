import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useProgress } from "@/hooks/useProgress";

const FEATURES = [
  {
    icon: "🎯",
    title: "Starter Activities",
    desc: "Fun warm-up puzzles to get your brain buzzing before every session.",
    color: "#4ECDC4",
    href: "/starter",
  },
  {
    icon: "🧩",
    title: "Shape Puzzles",
    desc: "Crack pictorial simultaneous equations — find the value of each emoji!",
    color: "#F5A623",
    href: "/practice",
  },
  {
    icon: "🦉",
    title: "Competition Practice",
    desc: "Authentic Kangaroo-style questions at 3, 4 and 5 point difficulty.",
    color: "#9B59B6",
    href: "/practice",
  },
  {
    icon: "🏆",
    title: "Earn Badges",
    desc: "Collect bronze, silver and gold badges as you improve your skills.",
    color: "#F5A623",
    href: "/badges",
  },
  {
    icon: "📈",
    title: "Track Progress",
    desc: "See exactly how many questions you've attempted and how many you got right.",
    color: "#4ECDC4",
    href: "/badges",
  },
  {
    icon: "⚡",
    title: "Competitions",
    desc: "Enter timed competitions, earn certificates, and climb the leaderboard. Coming soon!",
    color: "#E74C3C",
    href: "/compete",
  },
];

const ROADMAP = [
  { icon: "🧑‍🏫", label: "Teacher Portal", desc: "Create classes, add pupils, view progress reports", soon: true },
  { icon: "👨‍👩‍👧", label: "Parent Portal", desc: "Subscribe and get your child a login", soon: true },
  { icon: "⏱️", label: "Timed Competitions", desc: "Compete against the clock — just like the real thing", soon: true },
  { icon: "📜", label: "Certificates", desc: "Auto-generated achievement certificates to print", soon: true },
  { icon: "🦉", label: "Ask Ollie", desc: "Get a hint from our AI owl when you're stuck", soon: true },
];

// Inline owl SVG (simplified for hero)
const HeroOwl = () => (
  <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {/* Glow */}
    <ellipse cx="60" cy="120" rx="40" ry="8" fill="#F5A623" opacity="0.2" />
    {/* Body */}
    <ellipse cx="60" cy="95" rx="32" ry="36" fill="#1A2E4A" stroke="#F5A623" strokeWidth="2.5"/>
    {/* Head */}
    <circle cx="60" cy="48" r="30" fill="#1A2E4A" stroke="#F5A623" strokeWidth="2.5"/>
    {/* Ear tufts */}
    <polygon points="36,22 30,6 42,18" fill="#F5A623"/>
    <polygon points="84,22 90,6 78,18" fill="#F5A623"/>
    {/* Eyes */}
    <circle cx="48" cy="46" r="12" fill="#F5A623"/>
    <circle cx="72" cy="46" r="12" fill="#F5A623"/>
    <circle cx="48" cy="46" r="8" fill="#0F1B2D"/>
    <circle cx="72" cy="46" r="8" fill="#0F1B2D"/>
    <circle cx="50" cy="43" r="2.5" fill="white"/>
    <circle cx="74" cy="43" r="2.5" fill="white"/>
    {/* Beak */}
    <polygon points="60,54 54,62 66,62" fill="#F5A623"/>
    {/* Wings */}
    <ellipse cx="26" cy="96" rx="14" ry="22" fill="#243B55" stroke="#F5A623" strokeWidth="1.5" transform="rotate(-15 26 96)"/>
    <ellipse cx="94" cy="96" rx="14" ry="22" fill="#243B55" stroke="#F5A623" strokeWidth="1.5" transform="rotate(15 94 96)"/>
    {/* Graduation cap */}
    <rect x="32" y="20" width="56" height="8" rx="3" fill="#F5A623"/>
    <rect x="54" y="10" width="12" height="12" rx="2" fill="#F5A623"/>
    <line x1="88" y1="24" x2="98" y2="34" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="98" cy="36" r="4" fill="#4ECDC4"/>
    {/* Belly pattern */}
    <ellipse cx="60" cy="100" rx="18" ry="22" fill="#243B55" opacity="0.7"/>
    {/* Feet */}
    <line x1="48" y1="128" x2="42" y2="136" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="48" y1="128" x2="48" y2="136" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="48" y1="128" x2="54" y2="136" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="72" y1="128" x2="66" y2="136" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="72" y1="128" x2="72" y2="136" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="72" y1="128" x2="78" y2="136" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Stars around owl */}
    <text x="8" y="30" fontSize="14" fill="#F5A623" opacity="0.7">✦</text>
    <text x="100" y="20" fontSize="10" fill="#4ECDC4" opacity="0.8">✦</text>
    <text x="105" y="70" fontSize="12" fill="#F5A623" opacity="0.5">✧</text>
    <text x="2" y="75" fontSize="10" fill="#4ECDC4" opacity="0.6">✧</text>
  </svg>
);

export default function Landing() {
  const { getTotalScore, getEarnedBadges } = useProgress();
  const { correct, attempted } = getTotalScore();
  const earnedBadges = getEarnedBadges();

  return (
    <Layout>
      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #0F1B2D 0%, #1A2E4A 50%, #0F1B2D 100%)",
          borderBottom: "1px solid rgba(245, 166, 35, 0.15)",
          padding: "80px 0 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background stars */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                borderRadius: "50%",
                background: i % 4 === 0 ? "#4ECDC4" : "#F5A623",
                opacity: 0.3 + (i % 5) * 0.1,
                left: `${(i * 37 + 5) % 100}%`,
                top: `${(i * 23 + 10) % 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }}>
            <div>
              {/* Badge */}
              <div className="no-section-pill" style={{ marginBottom: 24 }}>
                ✦ Competition Maths Platform ✦
              </div>

              <h1
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(40px, 6vw, 72px)",
                  lineHeight: 1.05,
                  color: "white",
                  marginBottom: 8,
                }}
              >
                Become a{" "}
                <span style={{ color: "#F5A623" }}>NumerOwl</span>
              </h1>
              <p
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(16px, 2.5vw, 22px)",
                  color: "#B0C4DE",
                  marginBottom: 32,
                  maxWidth: 520,
                  lineHeight: 1.5,
                }}
              >
                Practice competition maths, earn badges, and get ready to shine in the{" "}
                <span style={{ color: "#4ECDC4" }}>Kangaroo Maths</span> competition.
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/starter">
                  <button className="no-btn-gold" style={{ fontSize: 18, padding: "14px 32px" }}>
                    🎯 Start Warm-Up
                  </button>
                </Link>
                <Link href="/practice">
                  <button className="no-btn-teal" style={{ fontSize: 18, padding: "14px 32px" }}>
                    🧩 Practice Now
                  </button>
                </Link>
              </div>

              {/* Quick stats if progress exists */}
              {attempted > 0 && (
                <div
                  style={{
                    marginTop: 32,
                    display: "inline-flex",
                    gap: 24,
                    background: "rgba(245, 166, 35, 0.08)",
                    border: "1px solid rgba(245, 166, 35, 0.25)",
                    borderRadius: 16,
                    padding: "16px 24px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: "#F5A623" }}>{correct}</div>
                    <div style={{ fontSize: 12, color: "#B0C4DE", fontWeight: 600 }}>Correct</div>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: "#4ECDC4" }}>{attempted}</div>
                    <div style={{ fontSize: 12, color: "#B0C4DE", fontWeight: 600 }}>Attempted</div>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: "#9B59B6" }}>{earnedBadges.length}</div>
                    <div style={{ fontSize: 12, color: "#B0C4DE", fontWeight: 600 }}>Badges</div>
                  </div>
                </div>
              )}
            </div>

            {/* Owl illustration */}
            <div style={{ width: "clamp(160px, 20vw, 260px)", flexShrink: 0 }}>
              <HeroOwl />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "72px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="no-section-pill" style={{ marginBottom: 16 }}>
              What's inside
            </div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)", color: "white" }}>
              Everything you need to{" "}
              <span style={{ color: "#F5A623" }}>compete and win</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {FEATURES.map((f) => (
              <Link key={f.title} href={f.href}>
                <div
                  className="no-card"
                  style={{ cursor: "pointer", height: "100%" }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: `${f.color}22`,
                      border: `2px solid ${f.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      marginBottom: 16,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 18, color: "white", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        style={{
          padding: "72px 0",
          background: "rgba(245, 166, 35, 0.04)",
          borderTop: "1px solid rgba(245, 166, 35, 0.1)",
          borderBottom: "1px solid rgba(245, 166, 35, 0.1)",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="no-section-pill" style={{ marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(26px, 4vw, 38px)", color: "white" }}>
              Three steps to becoming a NumerOwl
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {[
              { step: "1", icon: "🎯", title: "Warm Up", desc: "Start with a fun Starter Activity to get your brain in gear." },
              { step: "2", icon: "🧩", title: "Practice", desc: "Work through shape puzzles and competition questions at your own pace." },
              { step: "3", icon: "🏆", title: "Earn Badges", desc: "Collect badges as you improve — show off your achievements!" },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #F5A623, #F7B733)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 24,
                    color: "#0F1B2D",
                    margin: "0 auto 16px",
                    boxShadow: "0 4px 20px rgba(245, 166, 35, 0.35)",
                  }}
                >
                  {s.step}
                </div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 20, color: "white", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coming Soon Roadmap ── */}
      <section style={{ padding: "72px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="no-section-pill" style={{ marginBottom: 16 }}>Coming soon</div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(26px, 4vw, 38px)", color: "white" }}>
              The full NumerOwls platform
            </h2>
            <p style={{ fontSize: 16, color: "#B0C4DE", marginTop: 12, fontWeight: 600 }}>
              We're building something special. Here's what's coming next.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {ROADMAP.map((r) => (
              <div
                key={r.label}
                style={{
                  background: "#1A2E4A",
                  border: "2px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: "24px 20px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(245, 166, 35, 0.15)",
                    border: "1px solid rgba(245, 166, 35, 0.3)",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#F5A623",
                    padding: "2px 8px",
                    letterSpacing: "0.05em",
                  }}
                >
                  SOON
                </div>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: "white", marginBottom: 6 }}>{r.label}</h3>
                <p style={{ fontSize: 13, color: "#B0C4DE", lineHeight: 1.5, fontWeight: 600 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "72px 0",
          background: "linear-gradient(135deg, rgba(245, 166, 35, 0.1) 0%, rgba(78, 205, 196, 0.08) 100%)",
          borderTop: "1px solid rgba(245, 166, 35, 0.15)",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🦉</div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)", color: "white", marginBottom: 16 }}>
            Ready to start?
          </h2>
          <p style={{ fontSize: 18, color: "#B0C4DE", marginBottom: 32, fontWeight: 600 }}>
            Be wise. Be sharp. Be a NumerOwl.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/starter">
              <button className="no-btn-gold" style={{ fontSize: 18, padding: "16px 36px" }}>
                🎯 Start Warm-Up
              </button>
            </Link>
            <Link href="/practice">
              <button className="no-btn-teal" style={{ fontSize: 18, padding: "16px 36px" }}>
                🧩 Go to Practice
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
