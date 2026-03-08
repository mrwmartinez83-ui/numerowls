import { useState } from "react";
import StarterSection from "@/components/StarterSection";
import ShapePuzzlesSection from "@/components/ShapePuzzlesSection";
import CompetitionSection from "@/components/CompetitionSection";
import HomeworkSection from "@/components/HomeworkSection";

const sections = [
  { id: "starter", label: "🎯 Starter", emoji: "🎯" },
  { id: "puzzles", label: "🔢 Shape Puzzles", emoji: "🔢" },
  { id: "competition", label: "🦘 Competition", emoji: "🦘" },
  { id: "homework", label: "🏠 Homework", emoji: "🏠" },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("starter");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDFBF7", fontFamily: "'Quicksand', sans-serif" }}>
      {/* ── Hero Header ── */}
      <header
        style={{
          background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
          borderBottom: "6px solid #2D3436",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between py-3 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 44 }}>🦘</span>
              <div>
                <h1
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: 28,
                    color: "white",
                    lineHeight: 1.1,
                    textShadow: "2px 2px 0px rgba(0,0,0,0.2)",
                  }}
                >
                  Kangaroo Maths Challenge
                </h1>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600 }}>
                  Year 2 Competition Prep
                </p>
              </div>
            </div>

            {/* Nav pills */}
            <nav className="flex gap-2 flex-wrap">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: 15,
                    padding: "6px 16px",
                    borderRadius: 12,
                    border: "3px solid #2D3436",
                    background: activeSection === s.id ? "#2D3436" : "rgba(255,255,255,0.9)",
                    color: activeSection === s.id ? "white" : "#2D3436",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: activeSection === s.id ? "none" : "3px 3px 0px rgba(0,0,0,0.3)",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Page Banner ── */}
      <div
        style={{
          background: "#4ECDC4",
          borderBottom: "4px solid #2D3436",
          padding: "20px 0",
        }}
      >
        <div className="container">
          <div className="flex items-center gap-6 flex-wrap">
            <div
              style={{
                background: "white",
                border: "4px solid #2D3436",
                borderRadius: 20,
                padding: "12px 24px",
                boxShadow: "5px 5px 0px #2D3436",
              }}
            >
              <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "#FF6B6B" }}>
                🌍 About the Competition
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#2D3436", marginTop: 4, maxWidth: 500 }}>
                Kangaroo Maths is a fun international competition. Each question has{" "}
                <strong>5 choices (A–E)</strong>. There are{" "}
                <span style={{ color: "#FF6B6B" }}>3-point</span>,{" "}
                <span style={{ color: "#FF8E00" }}>4-point</span>, and{" "}
                <span style={{ color: "#9B59B6" }}>5-point</span> questions. Think carefully — a
                wrong answer loses a quarter point!
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "3 pts", desc: "Warm-up", color: "#FF6B6B" },
                { label: "4 pts", desc: "Medium", color: "#FF8E00" },
                { label: "5 pts", desc: "Challenge", color: "#9B59B6" },
              ].map((b) => (
                <div
                  key={b.label}
                  style={{
                    background: "white",
                    border: `4px solid ${b.color}`,
                    borderRadius: 14,
                    padding: "10px 18px",
                    textAlign: "center",
                    boxShadow: `4px 4px 0px ${b.color}`,
                    minWidth: 80,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: 24,
                      color: b.color,
                    }}
                  >
                    {b.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="container py-10" style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        <StarterSection />
        <ShapePuzzlesSection />
        <CompetitionSection />
        <HomeworkSection />
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "#2D3436",
          borderTop: "4px solid #2D3436",
          padding: "24px 0",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 20,
            color: "#4ECDC4",
          }}
        >
          🦘 Keep practising — you're going to be amazing! 🦘
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 }}>
          Kangaroo Maths Competition Prep · Year 2
        </p>
      </footer>
    </div>
  );
}
