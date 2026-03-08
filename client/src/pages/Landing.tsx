import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const FEATURES = [
  { icon: "🧩", title: "9 Skill Categories", desc: "From addition to logic puzzles — structured by Year Group 1–6.", color: "#F5A623" },
  { icon: "⏱️", title: "Timed Tests", desc: "Simulate real competition conditions and earn certificates.", color: "#4ECDC4" },
  { icon: "🏆", title: "Leaderboard", desc: "See how you rank against other pupils across all year groups.", color: "#9B59B6" },
  { icon: "🦉", title: "Problem of the Week", desc: "A new challenge every week with bonus points.", color: "#E91E63" },
  { icon: "🎖️", title: "Badges & Certificates", desc: "Earn badges for skill mastery and printable certificates.", color: "#2ECC71" },
  { icon: "👩‍🏫", title: "Teacher Dashboard", desc: "Set work, track pupil progress, and manage your class.", color: "#3498DB" },
];

const SKILLS = [
  { icon: "➕", name: "Addition & Subtraction", color: "#F5A623" },
  { icon: "✖️", name: "Multiplication & Division", color: "#9B59B6" },
  { icon: "🍕", name: "Fractions & Decimals", color: "#E74C3C" },
  { icon: "🔷", name: "Shapes & Geometry", color: "#3498DB" },
  { icon: "🔄", name: "Patterns & Sequences", color: "#2ECC71" },
  { icon: "🧠", name: "Logic & Word Problems", color: "#F39C12" },
  { icon: "🧩", name: "Shape Value Puzzles", color: "#E91E63" },
  { icon: "📏", name: "Measurement & Data", color: "#00BCD4" },
  { icon: "🕐", name: "Time & Calendar", color: "#FF5722" },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />

      {/* Hero */}
      <section style={{ padding: "80px 0 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ fontSize: "80px", marginBottom: "16px", lineHeight: 1 }}>🦉</div>
          <div className="no-pill" style={{ margin: "0 auto 20px", width: "fit-content" }}>
            Competition Maths · Years 1–6
          </div>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(36px, 6vw, 64px)", color: "white", margin: "0 0 16px", lineHeight: 1.1 }}>
            Master Maths.<br />
            <span style={{ color: "#F5A623" }}>Earn Your Wings.</span>
          </h1>
          <p style={{ fontSize: "18px", color: "#B0C4DE", maxWidth: "560px", margin: "0 auto 36px", lineHeight: 1.6 }}>
            Practice competition-style maths problems, take timed tests, earn badges, and climb the leaderboard.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <button className="no-btn-gold" style={{ fontSize: "17px", padding: "14px 32px" }}>Go to My Dashboard →</button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <button className="no-btn-gold" style={{ fontSize: "17px", padding: "14px 32px" }}>Start Practising Free →</button>
              </a>
            )}
            <Link href="/leaderboard">
              <button className="no-btn-ghost" style={{ fontSize: "16px", padding: "14px 28px" }}>🏆 View Leaderboard</button>
            </Link>
          </div>
          <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginTop: "48px", flexWrap: "wrap" }}>
            {[["70+", "Questions"], ["9", "Skill Areas"], ["6", "Year Groups"], ["∞", "Practice Tests"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div className="font-num" style={{ fontSize: "32px", fontWeight: 700, color: "#F5A623" }}>{val}</div>
                <div style={{ fontSize: "13px", color: "#B0C4DE", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills grid */}
      <section style={{ padding: "60px 0", background: "rgba(255,255,255,0.02)" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "28px", color: "white", marginBottom: "8px" }}>9 Skill Categories</h2>
          <p style={{ textAlign: "center", color: "#B0C4DE", marginBottom: "36px", fontSize: "15px" }}>Each skill has questions for every year group, from Year 1 to Year 6</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
            {SKILLS.map((skill) => (
              <Link key={skill.name} href={`/practice/${skill.name.toLowerCase().split(" ")[0]}`}>
                <div className="no-skill-card" style={{ borderColor: `${skill.color}30` }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>{skill.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "white", lineHeight: 1.3 }}>{skill.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "28px", color: "white", marginBottom: "8px" }}>Everything you need to excel</h2>
          <p style={{ textAlign: "center", color: "#B0C4DE", marginBottom: "40px", fontSize: "15px" }}>Built for pupils, parents, and teachers</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="no-card">
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{f.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: "17px", color: "white", marginBottom: "6px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "#B0C4DE", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 0", background: "linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(78,205,196,0.06) 100%)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🦉</div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "32px", color: "white", marginBottom: "12px" }}>Ready to become a NumerOwl?</h2>
          <p style={{ color: "#B0C4DE", fontSize: "16px", marginBottom: "28px" }}>Join pupils from Years 1–6 practising competition maths every week.</p>
          {isAuthenticated ? (
            <Link href="/practice"><button className="no-btn-gold" style={{ fontSize: "17px", padding: "14px 36px" }}>Start Practising Now →</button></Link>
          ) : (
            <a href={getLoginUrl()}><button className="no-btn-gold" style={{ fontSize: "17px", padding: "14px 36px" }}>Sign Up Free →</button></a>
          )}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "24px 0", textAlign: "center" }}>
        <div className="container">
          <p style={{ color: "#B0C4DE", fontSize: "13px", margin: 0 }}>🦉 NumerOwls · Competition Maths for Years 1–6 · <span style={{ color: "#F5A623" }}>NumerOwls.com</span></p>
        </div>
      </footer>
    </div>
  );
}
