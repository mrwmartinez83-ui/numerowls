import { useState, useEffect } from "react";
import { lessons } from "@/lib/lessonData";
import StarterSection from "@/components/StarterSection";
import ShapePuzzlesSection from "@/components/ShapePuzzlesSection";
import CompetitionSection from "@/components/CompetitionSection";
import HomeworkSection from "@/components/HomeworkSection";

const SECTIONS = [
  { id: "starter", label: "🎯 Starter" },
  { id: "puzzles", label: "🔢 Puzzles" },
  { id: "competition", label: "🦘 Competition" },
  { id: "homework", label: "🏠 Homework" },
];

export default function Home() {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeSection, setActiveSection] = useState("starter");
  const lesson = lessons[activeLessonIdx];

  // Reset section to starter when switching lessons
  const switchLesson = (idx: number) => {
    setActiveLessonIdx(idx);
    setActiveSection("starter");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

            {/* Section nav pills */}
            <nav className="flex gap-2 flex-wrap">
              {SECTIONS.map((s) => (
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

      {/* ── Lesson Tabs ── */}
      <div
        style={{
          background: "#2D3436",
          borderBottom: "4px solid #2D3436",
          padding: "0",
          overflowX: "auto",
        }}
      >
        <div className="container">
          <div className="flex gap-0" style={{ minWidth: "max-content" }}>
            {lessons.map((l, idx) => {
              const isActive = idx === activeLessonIdx;
              return (
                <button
                  key={l.id}
                  onClick={() => switchLesson(idx)}
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: 16,
                    padding: "14px 28px",
                    border: "none",
                    borderBottom: isActive ? `5px solid ${l.color}` : "5px solid transparent",
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    color: isActive ? "white" : "rgba(255,255,255,0.55)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{l.emoji}</span>
                  <span>{l.title}</span>
                  <span
                    style={{
                      fontSize: 13,
                      color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                      fontFamily: "'Quicksand', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {l.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Lesson Banner ── */}
      <div
        style={{
          background: "#4ECDC4",
          borderBottom: "4px solid #2D3436",
          padding: "16px 0",
        }}
      >
        <div className="container">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Lesson title */}
            <div
              style={{
                background: "white",
                border: "4px solid #2D3436",
                borderRadius: 20,
                padding: "10px 24px",
                boxShadow: `5px 5px 0px ${lesson.color}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 32 }}>{lesson.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: lesson.color }}>
                  {lesson.title}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#555" }}>{lesson.subtitle}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: `${lesson.shapePuzzles.length} Puzzles`, icon: "🔢", color: "#4ECDC4" },
                { label: `${lesson.competitionQuestions.length} Questions`, icon: "🦘", color: "#FF6B6B" },
                { label: `${lesson.homeworkItems.length} HW Tasks`, icon: "🏠", color: "#9B59B6" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "white",
                    border: `3px solid ${stat.color}`,
                    borderRadius: 12,
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: `3px 3px 0px ${stat.color}`,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{stat.icon}</span>
                  <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 15, color: "#2D3436" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Point guide */}
            <div className="flex gap-2 flex-wrap" style={{ marginLeft: "auto" }}>
              {[
                { label: "3 pts", desc: "Warm-up", color: "#FF6B6B" },
                { label: "4 pts", desc: "Medium", color: "#FF8E00" },
                { label: "5 pts", desc: "Challenge", color: "#9B59B6" },
              ].map((b) => (
                <div
                  key={b.label}
                  style={{
                    background: "white",
                    border: `3px solid ${b.color}`,
                    borderRadius: 12,
                    padding: "8px 14px",
                    textAlign: "center",
                    boxShadow: `3px 3px 0px ${b.color}`,
                    minWidth: 70,
                  }}
                >
                  <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: b.color }}>
                    {b.label}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main
        key={lesson.id}
        className="container py-10"
        style={{ display: "flex", flexDirection: "column", gap: 64 }}
      >
        <StarterSection lesson={lesson} />
        <ShapePuzzlesSection lesson={lesson} />
        <CompetitionSection lesson={lesson} />
        <HomeworkSection lesson={lesson} />
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
        <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#4ECDC4" }}>
          🦘 Keep practising — you're going to be amazing! 🦘
        </p>
        <div className="flex justify-center gap-3 flex-wrap" style={{ marginTop: 12 }}>
          {lessons.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => switchLesson(idx)}
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 14,
                padding: "6px 16px",
                borderRadius: 10,
                border: `3px solid ${l.color}`,
                background: idx === activeLessonIdx ? l.color : "transparent",
                color: idx === activeLessonIdx ? "white" : l.color,
                cursor: "pointer",
              }}
            >
              {l.emoji} {l.title}
            </button>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 12 }}>
          Kangaroo Maths Competition Prep · Year 2
        </p>
      </footer>
    </div>
  );
}
