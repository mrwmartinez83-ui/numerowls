import { useState, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { lessons, Lesson, ShapePuzzle, CompetitionQuestion, HomeworkItem } from "@/lib/lessonData";
import { useProgress, LessonProgress } from "@/hooks/useProgress";

const SECTIONS = [
  { id: "puzzles", label: "🧩 Shape Puzzles" },
  { id: "competition", label: "🦉 Competition" },
  { id: "homework", label: "📚 Homework" },
];

export default function Practice() {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeSection, setActiveSection] = useState("puzzles");
  const lesson = lessons[activeLessonIdx];
  const { initLesson, recordAnswer, getLessonProgress, getLessonCompletion, resetLesson } = useProgress();

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
    setActiveSection("puzzles");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      {/* ── Lesson Tabs ── */}
      <div
        style={{
          background: "#0F1B2D",
          borderBottom: "1px solid rgba(245, 166, 35, 0.15)",
          overflowX: "auto",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", minWidth: "max-content" }}>
            {lessons.map((l, idx) => {
              const isActive = idx === activeLessonIdx;
              const completion = getLessonCompletion(l.id);
              return (
                <button
                  key={l.id}
                  onClick={() => switchLesson(idx)}
                  style={{
                    padding: "16px 24px",
                    border: "none",
                    borderBottom: isActive ? `3px solid ${l.color}` : "3px solid transparent",
                    background: "transparent",
                    color: isActive ? "white" : "#B0C4DE",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{l.emoji}</span>
                  <span>{l.title}</span>
                  {completion > 0 && (
                    <span
                      style={{
                        background: completion === 100 ? "#2ECC71" : l.color,
                        color: "#0F1B2D",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "2px 8px",
                      }}
                    >
                      {completion === 100 ? "✓" : `${completion}%`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Lesson Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A2E4A 0%, #243B55 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 0",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            {/* Lesson title */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `${lesson.color}22`,
                  border: `2px solid ${lesson.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                {lesson.emoji}
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 20, color: "white" }}>{lesson.title}</div>
                <div style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600 }}>{lesson.subtitle}</div>
              </div>
            </div>

            {/* Section progress pills */}
            {lessonProgress && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { key: "puzzles" as const, label: "Puzzles", icon: "🧩" },
                  { key: "competition" as const, label: "Competition", icon: "🦉" },
                  { key: "homework" as const, label: "Homework", icon: "📚" },
                ].map((s) => {
                  const sec = lessonProgress[s.key];
                  const pct = sec.total > 0 ? Math.round((sec.attempted / sec.total) * 100) : 0;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setActiveSection(s.key)}
                      style={{
                        background: activeSection === s.key ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${activeSection === s.key ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 10,
                        padding: "8px 14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 100,
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{s.icon}</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: activeSection === s.key ? "#F5A623" : "#B0C4DE" }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "#B0C4DE", fontWeight: 600 }}>{sec.attempted}/{sec.total}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Reset */}
            {getLessonCompletion(lesson.id) > 0 && (
              <button
                className="no-btn-ghost"
                style={{ marginLeft: "auto", fontSize: 13 }}
                onClick={() => resetLesson(lesson.id)}
              >
                🔄 Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Section Nav ── */}
      <div style={{ background: "#0F1B2D", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 0 }}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderBottom: activeSection === s.id ? "2px solid #4ECDC4" : "2px solid transparent",
                  background: "transparent",
                  color: activeSection === s.id ? "#4ECDC4" : "#B0C4DE",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div key={`${lesson.id}-${activeSection}`} className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {activeSection === "puzzles" && (
          <ShapePuzzlesSection
            lesson={lesson}
            lessonProgress={lessonProgress}
            onAnswer={(c) => recordAnswer(lesson.id, "puzzles", c)}
          />
        )}
        {activeSection === "competition" && (
          <CompetitionSection
            lesson={lesson}
            lessonProgress={lessonProgress}
            onAnswer={(c) => recordAnswer(lesson.id, "competition", c)}
          />
        )}
        {activeSection === "homework" && (
          <HomeworkSection
            lesson={lesson}
            lessonProgress={lessonProgress}
            onAnswer={(c) => recordAnswer(lesson.id, "homework", c)}
          />
        )}
      </div>
    </Layout>
  );
}

// ─── Shape Puzzles Section ────────────────────────────────────────────────────

function buildRow(emoji1: string, emoji2: string, e1: number, e2: number, total: number) {
  const parts: string[] = [];
  for (let i = 0; i < e1; i++) parts.push(emoji1);
  for (let i = 0; i < e2; i++) parts.push(emoji2);
  return (
    <div className="no-equation" style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {parts.map((p, idx) => (
          <span key={idx} style={{ fontSize: 28 }}>{p}</span>
        ))}
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#B0C4DE", margin: "0 8px" }}>=</span>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          color: "#F5A623",
          background: "rgba(245,166,35,0.12)",
          border: "2px solid rgba(245,166,35,0.3)",
          borderRadius: 8,
          padding: "2px 12px",
        }}
      >
        {total}
      </span>
    </div>
  );
}

function PuzzleCard({ puzzle, index, lessonColor, onAnswer }: { puzzle: ShapePuzzle; index: number; lessonColor: string; onAnswer: (c: boolean) => void }) {
  const [revealed, setRevealed] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    if (!hasRecorded) {
      setHasRecorded(true);
      onAnswer(true);
    }
  };

  const isSetB = puzzle.difficulty === "B";

  return (
    <div
      className="no-card"
      style={{
        borderColor: revealed ? "rgba(46, 204, 113, 0.4)" : isSetB ? "rgba(155, 89, 182, 0.3)" : "rgba(78, 205, 196, 0.25)",
        background: revealed ? "rgba(46, 204, 113, 0.04)" : "#1A2E4A",
        transition: "all 0.3s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div
          style={{
            background: isSetB ? "rgba(155,89,182,0.2)" : "rgba(78,205,196,0.15)",
            border: `2px solid ${isSetB ? "rgba(155,89,182,0.4)" : "rgba(78,205,196,0.35)"}`,
            borderRadius: 8,
            padding: "3px 12px",
            fontSize: 13,
            fontWeight: 800,
            color: isSetB ? "#9B59B6" : "#4ECDC4",
          }}
        >
          {isSetB ? "★ Set B" : "Set A"} · #{index + 1}
        </div>
        <div style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600 }}>
          {puzzle.emoji1} {puzzle.label1} &amp; {puzzle.emoji2} {puzzle.label2}
        </div>
      </div>

      {/* Equations */}
      {buildRow(puzzle.emoji1, puzzle.emoji2, puzzle.row1.e1, puzzle.row1.e2, puzzle.row1.total)}
      {buildRow(puzzle.emoji1, puzzle.emoji2, puzzle.row2.e1, puzzle.row2.e2, puzzle.row2.total)}

      {/* Find values prompt */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10,
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-around",
          border: "1px dashed rgba(78,205,196,0.3)",
          marginTop: 12,
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{puzzle.emoji1} {puzzle.label1} = ?</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{puzzle.emoji2} {puzzle.label2} = ?</span>
      </div>

      {/* Reveal */}
      {!revealed ? (
        <button className="no-btn-teal" style={{ fontSize: 14, padding: "8px 20px" }} onClick={handleReveal}>
          👀 Show Answer
        </button>
      ) : (
        <div className="animate-slide-up">
          <div
            style={{
              background: "rgba(46,204,113,0.08)",
              border: "2px solid rgba(46,204,113,0.35)",
              borderRadius: 12,
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: "#2ECC71",
                marginBottom: 8,
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <span>{puzzle.emoji1} = {puzzle.answer1}</span>
              <span>{puzzle.emoji2} = {puzzle.answer2}</span>
            </div>
            <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>
              💡 {puzzle.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ShapePuzzlesSection({ lesson, lessonProgress, onAnswer }: { lesson: Lesson; lessonProgress: LessonProgress | null; onAnswer: (c: boolean) => void }) {
  const setA = lesson.shapePuzzles.filter((p) => p.difficulty === "A");
  const setB = lesson.shapePuzzles.filter((p) => p.difficulty === "B");
  const sp = lessonProgress?.puzzles;
  const pct = sp && sp.total > 0 ? Math.round((sp.attempted / sp.total) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28, color: "white" }}>
          🧩 Shape Puzzles
        </h2>
        {sp && sp.total > 0 && (
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#B0C4DE" }}>Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#4ECDC4" }}>{sp.attempted}/{sp.total}</span>
            </div>
            <div className="no-progress-track">
              <div className="no-progress-fill" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #4ECDC4, #44B8B0)" }} />
            </div>
          </div>
        )}
      </div>

      {/* Strategy tip */}
      <div
        className="no-card"
        style={{ marginBottom: 32, borderColor: "rgba(78,205,196,0.3)", background: "rgba(78,205,196,0.05)" }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24 }}>🦉</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#4ECDC4", marginBottom: 4 }}>Ollie's Strategy Tip</div>
            <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>
              Look at both rows carefully. Can you find a row where only one emoji appears? Start there to find its value, then use that to solve the other!
            </p>
          </div>
        </div>
      </div>

      {/* Set A */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div
            style={{
              background: "rgba(78,205,196,0.15)",
              border: "2px solid rgba(78,205,196,0.35)",
              borderRadius: 10,
              padding: "6px 16px",
              fontWeight: 800,
              fontSize: 15,
              color: "#4ECDC4",
            }}
          >
            Set A — Warm Up
          </div>
          <span style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600 }}>Positive integers only</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {setA.map((p, i) => (
            <PuzzleCard key={p.id} puzzle={p} index={i} lessonColor={lesson.color} onAnswer={onAnswer} />
          ))}
        </div>
      </div>

      {/* Set B */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div
            style={{
              background: "rgba(155,89,182,0.15)",
              border: "2px solid rgba(155,89,182,0.35)",
              borderRadius: 10,
              padding: "6px 16px",
              fontWeight: 800,
              fontSize: 15,
              color: "#9B59B6",
            }}
          >
            ★ Set B — Challenge
          </div>
          <span style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600 }}>Trickier values!</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {setB.map((p, i) => (
            <PuzzleCard key={p.id} puzzle={p} index={i} lessonColor={lesson.color} onAnswer={onAnswer} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Competition Section ──────────────────────────────────────────────────────

function CompetitionCard({ q, index, onAnswer }: { q: CompetitionQuestion; index: number; onAnswer: (c: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const isCorrect = selected === q.correctLetter;

  const handleSelect = (letter: string) => {
    if (selected !== null) return;
    setSelected(letter);
    if (!hasAnswered) {
      setHasAnswered(true);
      onAnswer(letter === q.correctLetter);
    }
  };

  const pointColors: Record<number, string> = { 3: "#4ECDC4", 4: "#F5A623", 5: "#9B59B6" };
  const ptColor = pointColors[q.points] || "#F5A623";

  return (
    <div
      className="no-card"
      style={{
        borderColor: selected
          ? isCorrect ? "rgba(46,204,113,0.5)" : "rgba(231,76,60,0.5)"
          : "rgba(255,255,255,0.08)",
        background: selected
          ? isCorrect ? "rgba(46,204,113,0.05)" : "rgba(231,76,60,0.04)"
          : "#1A2E4A",
        transition: "all 0.3s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div
          style={{
            background: `${ptColor}22`,
            border: `2px solid ${ptColor}44`,
            borderRadius: 8,
            padding: "3px 12px",
            fontSize: 12,
            fontWeight: 800,
            color: ptColor,
          }}
        >
          Q{index + 1} · {q.points} pts
        </div>
        {selected && (
          <span style={{ fontSize: 18 }}>{isCorrect ? "✅" : "❌"}</span>
        )}
      </div>

      {/* Question */}
      <p style={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.6, marginBottom: 14 }}>
        {q.text}
      </p>

      {/* SVG Diagram */}
      {q.svgDiagram && (
        <div className="no-diagram" style={{ marginBottom: 14 }}>
          <div dangerouslySetInnerHTML={{ __html: q.svgDiagram }} style={{ width: "100%", maxWidth: 320 }} />
        </div>
      )}

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: selected ? 16 : 0 }}>
        {q.options.map((opt) => {
          let extraStyle: React.CSSProperties = {};
          if (selected) {
            if (opt.letter === q.correctLetter) {
              extraStyle = { background: "rgba(46,204,113,0.15)", borderColor: "rgba(46,204,113,0.5)", color: "white" };
            } else if (opt.letter === selected) {
              extraStyle = { background: "rgba(231,76,60,0.12)", borderColor: "rgba(231,76,60,0.5)", color: "white" };
            }
          }
          return (
            <button
              key={opt.letter}
              className="no-option"
              style={{ ...extraStyle, cursor: selected ? "default" : "pointer" }}
              onClick={() => handleSelect(opt.letter)}
              disabled={selected !== null}
            >
              <span className="no-option-letter">{opt.letter}</span>
              <span>{opt.text}</span>
              {selected && opt.letter === q.correctLetter && <span style={{ marginLeft: "auto" }}>✅</span>}
              {selected && opt.letter === selected && opt.letter !== q.correctLetter && <span style={{ marginLeft: "auto" }}>❌</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {selected && (
        <div className="animate-slide-up">
          <div
            style={{
              background: isCorrect ? "rgba(46,204,113,0.08)" : "rgba(245,166,35,0.08)",
              border: `2px solid ${isCorrect ? "rgba(46,204,113,0.3)" : "rgba(245,166,35,0.3)"}`,
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 15, color: isCorrect ? "#2ECC71" : "#F5A623", marginBottom: 4 }}>
              {isCorrect ? "🎉 Correct!" : `😅 The answer was (${q.correctLetter})`}
            </div>
            <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>💡 {q.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CompetitionSection({ lesson, lessonProgress, onAnswer }: { lesson: Lesson; lessonProgress: LessonProgress | null; onAnswer: (c: boolean) => void }) {
  const q3 = lesson.competitionQuestions.filter((q) => q.points === 3);
  const q4 = lesson.competitionQuestions.filter((q) => q.points === 4);
  const q5 = lesson.competitionQuestions.filter((q) => q.points === 5);
  const sp = lessonProgress?.competition;
  const pct = sp && sp.total > 0 ? Math.round((sp.correct / sp.total) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28, color: "white" }}>
          🦉 Competition Questions
        </h2>
        {sp && sp.total > 0 && (
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#B0C4DE" }}>Score</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F5A623" }}>{sp.correct}/{sp.total} correct ({pct}%)</span>
            </div>
            <div className="no-progress-track">
              <div className="no-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>

      {[
        { qs: q3, pts: 3, label: "3-Point Questions", color: "#4ECDC4", desc: "Warm-up level" },
        { qs: q4, pts: 4, label: "4-Point Questions", color: "#F5A623", desc: "Medium difficulty" },
        { qs: q5, pts: 5, label: "5-Point Questions", color: "#9B59B6", desc: "Challenge level" },
      ].map(({ qs, label, color, desc }) => (
        <div key={label} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                background: `${color}22`,
                border: `2px solid ${color}44`,
                borderRadius: 10,
                padding: "6px 16px",
                fontWeight: 800,
                fontSize: 15,
                color,
              }}
            >
              {label}
            </div>
            <span style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600 }}>{desc}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {qs.map((q, i) => (
              <CompetitionCard key={q.id} q={q} index={i} onAnswer={onAnswer} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Homework Section ─────────────────────────────────────────────────────────

function HomeworkCard({ item, index, onAnswer }: { item: HomeworkItem; index: number; onAnswer: (c: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const isCorrect = selected === item.correctLetter;
  const isPuzzle = item.type === "puzzle";
  const isChallenge = item.type === "challenge";

  const handleSelect = (letter: string) => {
    if (selected !== null) return;
    setSelected(letter);
    setShowAnswer(true);
    if (!hasAnswered) {
      setHasAnswered(true);
      onAnswer(letter === item.correctLetter);
    }
  };

  const handlePuzzleReveal = () => {
    setShowAnswer(true);
    if (!hasAnswered) {
      setHasAnswered(true);
      onAnswer(true);
    }
  };

  return (
    <div
      className="no-card"
      style={{
        borderColor: isChallenge
          ? "rgba(155,89,182,0.4)"
          : showAnswer
          ? isCorrect || isPuzzle ? "rgba(46,204,113,0.4)" : "rgba(231,76,60,0.4)"
          : "rgba(255,255,255,0.08)",
        background: isChallenge ? "rgba(155,89,182,0.04)" : "#1A2E4A",
        transition: "all 0.3s",
      }}
    >
      {/* Badge */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <div
          style={{
            background: isChallenge ? "rgba(155,89,182,0.2)" : "rgba(78,205,196,0.15)",
            border: `2px solid ${isChallenge ? "rgba(155,89,182,0.4)" : "rgba(78,205,196,0.35)"}`,
            borderRadius: 8,
            padding: "3px 12px",
            fontSize: 13,
            fontWeight: 800,
            color: isChallenge ? "#9B59B6" : "#4ECDC4",
          }}
        >
          {isChallenge ? "⭐ Super Star" : `H${index + 1}`}
        </div>
      </div>

      {/* Question */}
      <p style={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.6, marginBottom: 14 }}>
        {item.text}
      </p>

      {/* SVG Diagram */}
      {item.svgDiagram && (
        <div className="no-diagram" style={{ marginBottom: 14 }}>
          <div dangerouslySetInnerHTML={{ __html: item.svgDiagram }} style={{ width: "100%", maxWidth: 320 }} />
        </div>
      )}

      {/* Puzzle equations */}
      {isPuzzle && item.emoji1 && item.emoji2 && item.row1 && item.row2 && (
        <div style={{ marginBottom: 16 }}>
          {buildRow(item.emoji1, item.emoji2, item.row1.e1, item.row1.e2, item.row1.total)}
          {buildRow(item.emoji1, item.emoji2, item.row2.e1, item.row2.e2, item.row2.total)}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10,
              padding: "10px 14px",
              display: "flex",
              justifyContent: "space-around",
              border: "1px dashed rgba(78,205,196,0.3)",
              marginTop: 8,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{item.emoji1} {item.label1} = ?</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{item.emoji2} {item.label2} = ?</span>
          </div>
        </div>
      )}

      {/* MCQ options */}
      {item.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: showAnswer ? 16 : 0 }}>
          {item.options.map((opt) => {
            let extraStyle: React.CSSProperties = {};
            if (showAnswer) {
              if (opt.letter === item.correctLetter) {
                extraStyle = { background: "rgba(46,204,113,0.15)", borderColor: "rgba(46,204,113,0.5)", color: "white" };
              } else if (opt.letter === selected) {
                extraStyle = { background: "rgba(231,76,60,0.12)", borderColor: "rgba(231,76,60,0.5)", color: "white" };
              }
            }
            return (
              <button
                key={opt.letter}
                className="no-option"
                style={{ ...extraStyle, cursor: showAnswer ? "default" : "pointer" }}
                onClick={() => handleSelect(opt.letter)}
                disabled={showAnswer}
              >
                <span className="no-option-letter">{opt.letter}</span>
                <span>{opt.text}</span>
                {showAnswer && opt.letter === item.correctLetter && <span style={{ marginLeft: "auto" }}>✅</span>}
                {showAnswer && opt.letter === selected && opt.letter !== item.correctLetter && <span style={{ marginLeft: "auto" }}>❌</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Puzzle reveal */}
      {isPuzzle && !showAnswer && (
        <button className="no-btn-teal" style={{ fontSize: 14, padding: "8px 20px" }} onClick={handlePuzzleReveal}>
          👀 Show Answer
        </button>
      )}

      {/* Answer */}
      {showAnswer && (
        <div className="animate-slide-up">
          <div
            style={{
              background: "rgba(46,204,113,0.08)",
              border: "2px solid rgba(46,204,113,0.3)",
              borderRadius: 12,
              padding: "14px 18px",
            }}
          >
            {isPuzzle && item.emoji1 && item.emoji2 && (
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#2ECC71",
                  marginBottom: 8,
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <span>{item.emoji1} = {item.answer1}</span>
                <span>{item.emoji2} = {item.answer2}</span>
              </div>
            )}
            {!isPuzzle && selected && (
              <div style={{ fontWeight: 800, fontSize: 15, color: isCorrect ? "#2ECC71" : "#F5A623", marginBottom: 4 }}>
                {isCorrect ? "🎉 Correct!" : `😅 The answer was (${item.correctLetter})`}
              </div>
            )}
            <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>
              💡 {item.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeworkSection({ lesson, lessonProgress, onAnswer }: { lesson: Lesson; lessonProgress: LessonProgress | null; onAnswer: (c: boolean) => void }) {
  const sp = lessonProgress?.homework;
  const pct = sp && sp.total > 0 ? Math.round((sp.correct / sp.total) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28, color: "white" }}>
          📚 Homework
        </h2>
        {sp && sp.total > 0 && (
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#B0C4DE" }}>Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#9B59B6" }}>{sp.correct}/{sp.total} ({pct}%)</span>
            </div>
            <div className="no-progress-track">
              <div className="no-progress-fill" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #9B59B6, #8E44AD)" }} />
            </div>
          </div>
        )}
      </div>

      <div
        className="no-card"
        style={{ marginBottom: 28, borderColor: "rgba(155,89,182,0.3)", background: "rgba(155,89,182,0.05)" }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24 }}>🏠</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#9B59B6", marginBottom: 4 }}>Take-home practice</div>
            <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>
              These questions are for you to try at home. Work through them carefully — the ⭐ Super Star question is the trickiest!
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {lesson.homeworkItems.map((item, i) => (
          <HomeworkCard key={item.id} item={item} index={i} onAnswer={onAnswer} />
        ))}
      </div>
    </div>
  );
}
