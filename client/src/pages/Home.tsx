import { useState, useEffect } from "react";
import { lessons } from "@/lib/lessonData";
import { useProgress } from "@/hooks/useProgress";
import StarterSection from "@/components/StarterSection";
import ShapePuzzlesSection from "@/components/ShapePuzzlesSection";
import CompetitionSection from "@/components/CompetitionSection";
import HomeworkSection from "@/components/HomeworkSection";

const SECTIONS = [
  { id: "starter", label: "🎯 Starter" },
  { id: "puzzles", label: "🧩 Puzzles" },
  { id: "competition", label: "🦘 Competition" },
  { id: "homework", label: "📚 Homework" },
];

export default function Home() {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeSection, setActiveSection] = useState("starter");
  const lesson = lessons[activeLessonIdx];

  const { progress, initLesson, recordAnswer, getLessonCompletion, getLessonProgress, resetLesson } = useProgress();

  // Initialise progress totals for each lesson on mount
  useEffect(() => {
    lessons.forEach((l) => {
      initLesson(l.id, {
        starter: l.starterSteps.length,
        puzzles: l.shapePuzzles.length,
        competition: l.competitionQuestions.length,
        homework: l.homeworkItems.length,
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lessonProgress = getLessonProgress(lesson.id);

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

  // Overall progress summary
  const totalAttempted = Object.values(progress).reduce((sum, lp) => {
    return sum + Object.values(lp).reduce((s, sec) => s + sec.attempted, 0);
  }, 0);
  const totalCorrect = Object.values(progress).reduce((sum, lp) => {
    return sum + Object.values(lp).reduce((s, sec) => s + sec.correct, 0);
  }, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDFBF7", fontFamily: "'Quicksand', sans-serif" }}>

      {/* ── Sticky Header ── */}
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

            {/* Overall score badge */}
            {totalAttempted > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.95)",
                border: "3px solid #2D3436",
                borderRadius: 14,
                padding: "8px 18px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "3px 3px 0 #2D3436",
              }}>
                <span style={{ fontSize: 20 }}>⭐</span>
                <div>
                  <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "#FF6B6B" }}>
                    {totalCorrect}/{totalAttempted}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>Total Score</div>
                </div>
              </div>
            )}

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
      <div style={{ background: "#2D3436", borderBottom: "4px solid #2D3436", padding: "0", overflowX: "auto" }}>
        <div className="container">
          <div className="flex gap-0" style={{ minWidth: "max-content" }}>
            {lessons.map((l, idx) => {
              const isActive = idx === activeLessonIdx;
              const completion = getLessonCompletion(l.id);
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
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{l.emoji}</span>
                  <span>{l.title}</span>
                  {completion > 0 && (
                    <span style={{
                      background: completion === 100 ? "#28a745" : l.color,
                      color: "white",
                      borderRadius: 99,
                      fontSize: 11,
                      fontFamily: "'Quicksand', sans-serif",
                      fontWeight: 700,
                      padding: "2px 8px",
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}>
                      {completion === 100 ? "✓ Done" : `${completion}%`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Lesson Banner ── */}
      <div style={{ background: "#4ECDC4", borderBottom: "4px solid #2D3436", padding: "16px 0" }}>
        <div className="container">
          <div className="flex items-center gap-6 flex-wrap">
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

            {/* Per-section progress stats */}
            {lessonProgress && (
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Starter", key: "starter" as const, icon: "🎯", color: lesson.color },
                  { label: "Puzzles", key: "puzzles" as const, icon: "🧩", color: "#4ECDC4" },
                  { label: "Competition", key: "competition" as const, icon: "🦘", color: "#FF6B6B" },
                  { label: "Homework", key: "homework" as const, icon: "📚", color: "#9B59B6" },
                ].map((stat) => {
                  const sec = lessonProgress[stat.key];
                  const pct = sec.total > 0 ? Math.round((sec.attempted / sec.total) * 100) : 0;
                  return (
                    <div
                      key={stat.key}
                      style={{
                        background: "white",
                        border: `3px solid ${stat.color}`,
                        borderRadius: 12,
                        padding: "8px 16px",
                        minWidth: 90,
                        boxShadow: `3px 3px 0px ${stat.color}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                        <span style={{ fontSize: 14 }}>{stat.icon}</span>
                        <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 13, color: stat.color }}>{stat.label}</span>
                      </div>
                      <div style={{ background: "#e0e0e0", borderRadius: 99, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, background: stat.color, height: "100%", borderRadius: 99, transition: "width 0.5s" }} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginTop: 3 }}>
                        {sec.attempted}/{sec.total}
                        {sec.attempted > 0 && stat.key === "competition" && (
                          <span style={{ color: "#28a745", marginLeft: 4 }}>✅{sec.correct}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reset button */}
            {getLessonCompletion(lesson.id) > 0 && (
              <button
                onClick={() => resetLesson(lesson.id)}
                style={{
                  marginLeft: "auto",
                  background: "white",
                  border: "3px solid #dc3545",
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 14,
                  color: "#dc3545",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0 #dc3545",
                }}
              >
                🔄 Reset Lesson
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main
        key={lesson.id}
        className="container py-10"
        style={{ display: "flex", flexDirection: "column", gap: 64 }}
      >
        <StarterSection
          lesson={lesson}
          lessonProgress={lessonProgress}
          onAnswer={(isCorrect) => recordAnswer(lesson.id, "starter", isCorrect)}
        />
        <ShapePuzzlesSection
          lesson={lesson}
          lessonProgress={lessonProgress}
          onAnswer={(isCorrect) => recordAnswer(lesson.id, "puzzles", isCorrect)}
        />
        <CompetitionSection
          lesson={lesson}
          lessonProgress={lessonProgress}
          onAnswer={(isCorrect) => recordAnswer(lesson.id, "competition", isCorrect)}
        />
        <HomeworkSection
          lesson={lesson}
          lessonProgress={lessonProgress}
          onAnswer={(isCorrect) => recordAnswer(lesson.id, "homework", isCorrect)}
        />
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
