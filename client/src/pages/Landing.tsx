import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const SKILLS = [
  { icon: "➕", name: "Addition & Subtraction", color: "#F5A623", desc: "Number bonds, mental arithmetic, column methods" },
  { icon: "✖️", name: "Multiplication & Division", color: "#9B59B6", desc: "Times tables, arrays, short division" },
  { icon: "🍕", name: "Fractions & Decimals", color: "#E74C3C", desc: "Halves, quarters, equivalent fractions" },
  { icon: "🔷", name: "Shapes & Geometry", color: "#3498DB", desc: "2D & 3D shapes, angles, symmetry" },
  { icon: "🔄", name: "Patterns & Sequences", color: "#2ECC71", desc: "Number patterns, rules, missing terms" },
  { icon: "🧠", name: "Logic & Word Problems", color: "#F39C12", desc: "Multi-step reasoning, real-world maths" },
  { icon: "🧩", name: "Shape Value Puzzles", color: "#E91E63", desc: "Pictorial simultaneous equations" },
  { icon: "📏", name: "Measurement & Data", color: "#00BCD4", desc: "Length, mass, capacity, charts" },
  { icon: "🕐", name: "Time & Calendar", color: "#FF5722", desc: "Clocks, calendars, duration" },
];

const STEPS = [
  { icon: "1️⃣", title: "Sign up free", desc: "Create your account in seconds — no email needed, just a name and year group." },
  { icon: "2️⃣", title: "Choose your year", desc: "Tell us which year you're in. Questions are instantly tailored to your level." },
  { icon: "3️⃣", title: "Practise & compete", desc: "Work through skills, take timed tests, earn badges, and climb the leaderboard." },
];

const YEAR_LABELS: Record<number, { emoji: string; desc: string }> = {
  1: { emoji: "🌱", desc: "Counting, adding to 20, simple shapes" },
  2: { emoji: "🌿", desc: "Number bonds, 2× 5× 10× tables, fractions" },
  3: { emoji: "🌳", desc: "3-digit numbers, all times tables, data" },
  4: { emoji: "⭐", desc: "Decimals, area, Roman numerals, factors" },
  5: { emoji: "🚀", desc: "Fractions, percentages, prime numbers" },
  6: { emoji: "🏆", desc: "Ratio, algebra, complex geometry, SATs prep" },
};

export default function Landing() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ fontSize: "88px", marginBottom: "12px", lineHeight: 1, filter: "drop-shadow(0 8px 24px rgba(245,166,35,0.3))" }}>🦉</div>
          <div className="no-pill" style={{ margin: "0 auto 20px", width: "fit-content" }}>
            Free · Competition Maths · Years 1–6
          </div>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(36px, 6vw, 68px)", color: "white", margin: "0 0 16px", lineHeight: 1.1 }}>
            Master Maths.<br />
            <span style={{ color: "#F5A623" }}>Earn Your Wings.</span>
          </h1>
          <p style={{ fontSize: "18px", color: "#B0C4DE", maxWidth: "560px", margin: "0 auto 12px", lineHeight: 1.6 }}>
            Practice competition-style maths, take timed tests, earn badges, and climb the leaderboard — all tailored to <strong style={{ color: "white" }}>your year group</strong>.
          </p>
          <p style={{ fontSize: "14px", color: "#4ECDC4", marginBottom: "36px", fontWeight: 700 }}>
            ✅ Completely free · ✅ No email required · ✅ Start in 30 seconds
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <button className="no-btn-gold" style={{ fontSize: "18px", padding: "16px 36px" }}>
                    Go to My Dashboard →
                  </button>
                </Link>
                <Link href="/practice">
                  <button className="no-btn-ghost" style={{ fontSize: "16px", padding: "16px 28px" }}>
                    🧩 Start Practising
                  </button>
                </Link>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <button className="no-btn-gold" style={{ fontSize: "18px", padding: "16px 36px" }}>
                    🦉 Sign Up Free — Start Now →
                  </button>
                </a>
                <Link href="/leaderboard">
                  <button className="no-btn-ghost" style={{ fontSize: "16px", padding: "16px 28px" }}>
                    🏆 View Leaderboard
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginTop: "52px", flexWrap: "wrap" }}>
            {[["70+", "Questions"], ["9", "Skill Areas"], ["6", "Year Groups"], ["🎖️", "Earn Badges"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div className="font-num" style={{ fontSize: "32px", fontWeight: 700, color: "#F5A623" }}>{val}</div>
                <div style={{ fontSize: "13px", color: "#B0C4DE", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 0", background: "rgba(255,255,255,0.02)" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "28px", color: "white", marginBottom: "8px" }}>
            How it works
          </h2>
          <p style={{ textAlign: "center", color: "#B0C4DE", marginBottom: "40px", fontSize: "15px" }}>
            Up and running in under a minute
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {STEPS.map((step) => (
              <div key={step.title} style={{
                padding: "28px 24px",
                borderRadius: "16px",
                background: "rgba(245,166,35,0.05)",
                border: "1.5px solid rgba(245,166,35,0.2)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>{step.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: "17px", color: "white", marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ fontSize: "14px", color: "#B0C4DE", lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Year group preview ────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "28px", color: "white", marginBottom: "8px" }}>
            Questions tailored to your year
          </h2>
          <p style={{ textAlign: "center", color: "#B0C4DE", marginBottom: "36px", fontSize: "15px" }}>
            Every skill has questions matched to your curriculum level — you can always explore other years too
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
            {Object.entries(YEAR_LABELS).map(([year, { emoji, desc }]) => (
              <div key={year} style={{
                padding: "20px 16px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1.5px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>{emoji}</div>
                <div style={{ fontWeight: 800, fontSize: "16px", color: "white", marginBottom: "6px" }}>Year {year}</div>
                <div style={{ fontSize: "12px", color: "#B0C4DE", lineHeight: 1.4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills grid ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 0", background: "rgba(255,255,255,0.02)" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "28px", color: "white", marginBottom: "8px" }}>9 Skill Categories</h2>
          <p style={{ textAlign: "center", color: "#B0C4DE", marginBottom: "36px", fontSize: "15px" }}>
            Each skill has questions for every year group, from Year 1 to Year 6
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
            {SKILLS.map((skill) => (
              <Link key={skill.name} href={isAuthenticated ? `/practice/${skill.name.toLowerCase().split(" ")[0]}` : getLoginUrl()}>
                <div className="no-skill-card" style={{ borderColor: `${skill.color}30`, cursor: "pointer" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>{skill.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "white", lineHeight: 1.3, marginBottom: "6px" }}>{skill.name}</div>
                  <div style={{ fontSize: "12px", color: "#B0C4DE", lineHeight: 1.4 }}>{skill.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 0", background: "linear-gradient(135deg, rgba(245,166,35,0.1) 0%, rgba(78,205,196,0.08) 100%)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🦉</div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "34px", color: "white", marginBottom: "12px" }}>
            Ready to become a NumerOwl?
          </h2>
          <p style={{ color: "#B0C4DE", fontSize: "16px", marginBottom: "12px" }}>
            Join pupils from Years 1–6 practising competition maths every week.
          </p>
          <p style={{ color: "#4ECDC4", fontSize: "14px", fontWeight: 700, marginBottom: "32px" }}>
            ✅ Free forever · ✅ No email needed · ✅ Instant access
          </p>
          {isAuthenticated ? (
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/practice">
                <button className="no-btn-gold" style={{ fontSize: "18px", padding: "16px 36px" }}>🧩 Start Practising →</button>
              </Link>
              <Link href="/competition">
                <button style={{
                  fontSize: "16px", padding: "16px 28px", borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(245,166,35,0.25), rgba(255,215,0,0.2))",
                  border: "2px solid rgba(245,166,35,0.6)",
                  color: "#F5A623", fontWeight: 900, cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                }}>🏆 Competition Mode</button>
              </Link>
              <Link href="/test">
                <button className="no-btn-teal" style={{ fontSize: "16px", padding: "16px 28px" }}>⏱️ Timed Test</button>
              </Link>
            </div>
          ) : (
            <a href={getLoginUrl()}>
              <button className="no-btn-gold" style={{ fontSize: "18px", padding: "16px 44px" }}>
                🦉 Sign Up Free — It Takes 30 Seconds →
              </button>
            </a>
          )}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "28px 0", textAlign: "center" }}>
        <div className="container">
          <p style={{ color: "#B0C4DE", fontSize: "13px", margin: 0 }}>
            🦉 NumerOwls · Competition Maths for Years 1–6 · <span style={{ color: "#F5A623" }}>NumerOwls.com</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
