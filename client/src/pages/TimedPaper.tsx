import { useState, useEffect, useCallback, useRef } from "react";
import Layout from "@/components/Layout";
import { COMPETITION_SETS, ALL_COMPETITION_QUESTIONS, type CompetitionQ } from "@/lib/competitionBank";
import type { YearGroup } from "@/lib/competitionBank";

// ── Constants ────────────────────────────────────────────────────────────────
const TIMED_PAPER_CONFIG = {
  "Y1-2":  { questions: 15, minutes: 30, label: "Junior Paper" },
  "Y3-4":  { questions: 20, minutes: 45, label: "Intermediate Paper" },
  "Y5-6":  { questions: 25, minutes: 60, label: "Senior Paper" },
  "Mixed": { questions: 15, minutes: 30, label: "Practice Paper" },
} as const;

const COLORS = {
  navy: "#0F1B2D", card: "#1A2E4A", card2: "#243B55",
  gold: "#F5A623", teal: "#4ECDC4", purple: "#9B59B6",
  green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE",
};

// ── Timer display ────────────────────────────────────────────────────────────
function Timer({ seconds, total }: { seconds: number; total: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = seconds / total;
  const color = pct > 0.33 ? COLORS.green : pct > 0.16 ? COLORS.gold : COLORS.red;
  const isWarning = pct <= 0.16;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: `${color}15`,
      border: `2px solid ${color}40`,
      borderRadius: 14, padding: "8px 16px",
      animation: isWarning ? "pulse 1s infinite" : "none",
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <path d={`M12 6 L12 12 L${12 + 4 * Math.sin((1 - pct) * 2 * Math.PI)} ${12 - 4 * Math.cos((1 - pct) * 2 * Math.PI)}`} stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 900, fontSize: 18,
        color, letterSpacing: "0.02em",
        minWidth: 52, textAlign: "center",
      }}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

// ── Paper selector ───────────────────────────────────────────────────────────
function PaperSelector({ onStart }: { onStart: (yearGroup: YearGroup, questions: CompetitionQ[]) => void }) {
  const [selected, setSelected] = useState<YearGroup | null>(null);

  const yearGroups: YearGroup[] = ["Y1-2", "Y3-4", "Y5-6"];
  const yColors: Record<string, string> = { "Y1-2": COLORS.teal, "Y3-4": COLORS.gold, "Y5-6": COLORS.red };

  const handleStart = () => {
    if (!selected) return;
    const cfg = TIMED_PAPER_CONFIG[selected];
    const pool = ALL_COMPETITION_QUESTIONS.filter(
      q => q.yearMax <= (selected === "Y1-2" ? 2 : selected === "Y3-4" ? 4 : 6)
        && q.year >= (selected === "Y1-2" ? 1 : selected === "Y3-4" ? 3 : 5)
    );
    // Sort by points (3pt first, then 4pt, then 5pt) and take the configured count
    const sorted = [...pool].sort((a, b) => a.points - b.points);
    const qs = sorted.slice(0, Math.min(cfg.questions, sorted.length));
    onStart(selected, qs);
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>⏱️</div>
        <h1 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 44px)", color: "white",
          margin: "0 0 12px",
        }}>
          Timed Paper Mode
        </h1>
        <p style={{ fontSize: 15, color: COLORS.muted, fontWeight: 600, maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
          Simulate the real competition experience. Countdown timer, flag to revisit, submit when ready.
          Just like the PMC and UKMT papers.
        </p>
      </div>

      {/* Paper cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 36 }}>
        {yearGroups.map(yg => {
          const cfg = TIMED_PAPER_CONFIG[yg];
          const color = yColors[yg];
          const isSelected = selected === yg;
          return (
            <div
              key={yg}
              onClick={() => setSelected(yg)}
              style={{
                background: isSelected ? `${color}12` : COLORS.card,
                border: `2px solid ${isSelected ? color : `${color}30`}`,
                borderRadius: 20, padding: "28px 24px",
                cursor: "pointer", transition: "all 0.2s",
                transform: isSelected ? "translateY(-3px)" : "none",
                boxShadow: isSelected ? `0 8px 32px ${color}22` : "none",
              }}
            >
              <div style={{
                display: "inline-flex",
                background: `${color}20`, border: `2px solid ${color}40`,
                borderRadius: 99, padding: "4px 14px",
                fontSize: 12, fontWeight: 800, color, marginBottom: 16,
              }}>
                {yg}
              </div>

              <h3 style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: 20, color: "white", margin: "0 0 6px",
              }}>
                {cfg.label}
              </h3>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <div style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 10,
                  padding: "8px 14px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color }}>{cfg.questions}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>questions</div>
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 10,
                  padding: "8px 14px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color }}>{cfg.minutes}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>minutes</div>
                </div>
              </div>

              {isSelected && (
                <div style={{
                  marginTop: 16, fontSize: 12, fontWeight: 700, color,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  ✓ Selected
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rules */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "20px 24px",
        marginBottom: 32,
      }}>
        <h4 style={{ color: "white", fontWeight: 800, fontSize: 14, marginBottom: 12 }}>📋 How it works</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
          {[
            ["⏱️ Countdown timer", "Starts as soon as you begin"],
            ["🚩 Flag to revisit", "Mark questions you're unsure about"],
            ["↩️ Skip & return", "Come back to hard questions later"],
            ["📊 Marks per question", "3, 4, or 5 points — choose wisely"],
            ["🔒 No hints", "Real exam conditions — no hints available"],
            ["📝 Review before submit", "Check flagged questions before finishing"],
          ].map(([title, desc]) => (
            <div key={title} style={{ fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: "white" }}>{title}</span>
              <span style={{ color: COLORS.muted }}> — {desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleStart}
          disabled={!selected}
          style={{
            background: selected ? `linear-gradient(135deg, ${COLORS.gold}, #E8941A)` : "rgba(255,255,255,0.08)",
            border: "none", borderRadius: 14,
            padding: "16px 48px", fontSize: 17, fontWeight: 900,
            color: selected ? COLORS.navy : COLORS.muted,
            cursor: selected ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: selected ? `0 6px 28px ${COLORS.gold}44` : "none",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {selected ? `⏱️ Start ${TIMED_PAPER_CONFIG[selected].label} →` : "Select a paper first"}
        </button>
      </div>
    </div>
  );
}

// ── Exam question card ───────────────────────────────────────────────────────
function ExamQuestion({
  q, index, selected, flagged,
  onSelect, onFlag, onNext, onPrev,
  total, isLast,
}: {
  q: CompetitionQ; index: number; selected: string | null; flagged: boolean;
  onSelect: (l: string) => void; onFlag: () => void;
  onNext: () => void; onPrev: () => void;
  total: number; isLast: boolean;
}) {
  const ptColors: Record<number, string> = { 3: COLORS.teal, 4: COLORS.gold, 5: COLORS.purple };
  const ptColor = ptColors[q.points];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted }}>Q{index + 1} of {total}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: ptColor }}>{q.points} marks</span>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 99 }}>
          <div style={{
            height: "100%", width: `${((index + 1) / total) * 100}%`,
            background: ptColor, borderRadius: 99, transition: "width 0.3s",
          }} />
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: COLORS.card, borderRadius: 24, padding: "28px",
        border: `2px solid ${selected ? `${ptColor}44` : "rgba(255,255,255,0.08)"}`,
        marginBottom: 20,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{
              background: `${ptColor}22`, border: `2px solid ${ptColor}44`,
              borderRadius: 99, padding: "3px 12px",
              fontSize: 12, fontWeight: 800, color: ptColor,
            }}>
              {q.points} marks
            </span>
            <span style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 99, padding: "3px 12px",
              fontSize: 11, fontWeight: 700, color: COLORS.muted,
            }}>
              Year {q.year}{q.yearMax !== q.year ? `–${q.yearMax}` : ""}
            </span>
          </div>
          {/* Flag button */}
          <button
            onClick={onFlag}
            style={{
              background: flagged ? "rgba(245,166,35,0.15)" : "transparent",
              border: `2px solid ${flagged ? "rgba(245,166,35,0.5)" : "rgba(255,255,255,0.15)"}`,
              borderRadius: 10, padding: "6px 12px",
              fontSize: 12, fontWeight: 800,
              color: flagged ? COLORS.gold : COLORS.muted,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {flagged ? "🚩 Flagged" : "🏳️ Flag"}
          </button>
        </div>

        {/* Question text */}
        <p style={{
          fontSize: 18, fontWeight: 700, color: "white",
          lineHeight: 1.7, marginBottom: 20, whiteSpace: "pre-line",
          fontFamily: "'Nunito', sans-serif",
        }}>
          {q.text}
        </p>

        {/* Diagram */}
        {q.svgDiagram && (
          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 14,
            padding: 16, marginBottom: 20, display: "flex", justifyContent: "center",
          }}>
            <div dangerouslySetInnerHTML={{ __html: q.svgDiagram }} style={{ width: "100%", maxWidth: 380 }} />
          </div>
        )}

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map(opt => (
            <button
              key={opt.letter}
              onClick={() => onSelect(opt.letter)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: selected === opt.letter ? `${ptColor}18` : "rgba(255,255,255,0.03)",
                border: `2px solid ${selected === opt.letter ? `${ptColor}60` : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14, padding: "13px 16px",
                cursor: "pointer", textAlign: "left", width: "100%",
                transition: "all 0.15s",
              }}
            >
              <span style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: selected === opt.letter ? `${ptColor}30` : `${ptColor}15`,
                border: `2px solid ${selected === opt.letter ? `${ptColor}60` : `${ptColor}30`}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: ptColor,
              }}>
                {opt.letter}
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{opt.text}</span>
              {selected === opt.letter && (
                <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={onPrev}
          disabled={index === 0}
          style={{
            background: index === 0 ? "transparent" : COLORS.card,
            border: `2px solid ${index === 0 ? "transparent" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, padding: "12px 22px",
            color: index === 0 ? "transparent" : COLORS.muted,
            fontSize: 14, fontWeight: 700, cursor: index === 0 ? "default" : "pointer",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          style={{
            background: `linear-gradient(135deg, ${ptColor}, ${ptColor}cc)`,
            border: "none", borderRadius: 12, padding: "12px 28px",
            color: COLORS.navy, fontSize: 14, fontWeight: 900,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            boxShadow: `0 4px 16px ${ptColor}33`,
          }}
        >
          {isLast ? "Review & Submit →" : `Next →`}
        </button>
      </div>
    </div>
  );
}

// ── Review screen (before final submit) ─────────────────────────────────────
function ReviewScreen({
  questions, answers, flagged, onGoTo, onSubmit,
}: {
  questions: CompetitionQ[]; answers: Record<string, string>; flagged: Set<string>;
  onGoTo: (i: number) => void; onSubmit: () => void;
}) {
  const unanswered = questions.filter(q => !answers[q.id]).length;
  const flaggedCount = flagged.size;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 900,
        fontSize: 28, color: "white", marginBottom: 8,
      }}>
        📋 Review Your Paper
      </h2>
      <p style={{ color: COLORS.muted, fontSize: 14, fontWeight: 600, marginBottom: 28 }}>
        Check your answers before submitting. You can still go back to any question.
      </p>

      {/* Summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={{
          background: "rgba(46,204,113,0.1)", border: "2px solid rgba(46,204,113,0.3)",
          borderRadius: 12, padding: "12px 20px",
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.green }}>
            {questions.length - unanswered}
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 700 }}>Answered</div>
        </div>
        {unanswered > 0 && (
          <div style={{
            background: "rgba(231,76,60,0.1)", border: "2px solid rgba(231,76,60,0.3)",
            borderRadius: 12, padding: "12px 20px",
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.red }}>{unanswered}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 700 }}>Unanswered</div>
          </div>
        )}
        {flaggedCount > 0 && (
          <div style={{
            background: "rgba(245,166,35,0.1)", border: "2px solid rgba(245,166,35,0.3)",
            borderRadius: 12, padding: "12px 20px",
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.gold }}>{flaggedCount}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 700 }}>Flagged</div>
          </div>
        )}
      </div>

      {/* Question grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
        {questions.map((q, i) => {
          const isAnswered = !!answers[q.id];
          const isFlagged = flagged.has(q.id);
          const ptColors: Record<number, string> = { 3: COLORS.teal, 4: COLORS.gold, 5: COLORS.purple };
          return (
            <button
              key={q.id}
              onClick={() => onGoTo(i)}
              title={`Q${i + 1} · ${q.points}pt${isFlagged ? " · Flagged" : ""}${!isAnswered ? " · Unanswered" : ""}`}
              style={{
                width: 44, height: 44, borderRadius: 10,
                background: isFlagged
                  ? "rgba(245,166,35,0.2)"
                  : isAnswered ? `${ptColors[q.points]}22` : "rgba(231,76,60,0.15)",
                border: `2px solid ${isFlagged ? COLORS.gold : isAnswered ? ptColors[q.points] + "50" : "rgba(231,76,60,0.4)"}`,
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 1,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: "white" }}>Q{i + 1}</span>
              <span style={{ fontSize: 9, color: isFlagged ? COLORS.gold : isAnswered ? ptColors[q.points] : COLORS.red, fontWeight: 700 }}>
                {isFlagged ? "🚩" : isAnswered ? `${q.points}pt` : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {unanswered > 0 && (
        <div style={{
          background: "rgba(245,166,35,0.08)",
          border: "2px solid rgba(245,166,35,0.3)",
          borderRadius: 14, padding: "14px 18px",
          fontSize: 14, fontWeight: 700, color: COLORS.gold,
          marginBottom: 24,
        }}>
          ⚠️ You have {unanswered} unanswered question{unanswered > 1 ? "s" : ""}. Unanswered questions score 0.
        </div>
      )}

      <button
        onClick={onSubmit}
        style={{
          background: "linear-gradient(135deg, #E74C3C, #C0392B)",
          border: "none", borderRadius: 14,
          padding: "16px 40px", fontSize: 16, fontWeight: 900,
          color: "white", cursor: "pointer",
          boxShadow: "0 6px 24px rgba(231,76,60,0.4)",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        🏁 Submit Paper
      </button>
    </div>
  );
}

// ── Results screen ───────────────────────────────────────────────────────────
function TimedResults({
  questions, answers, timeTaken, totalTime, onRetry, onHome,
}: {
  questions: CompetitionQ[]; answers: Record<string, string>;
  timeTaken: number; totalTime: number;
  onRetry: () => void; onHome: () => void;
}) {
  const [showSolutions, setShowSolutions] = useState(false);

  const totalPts = questions.reduce((s, q) => s + q.points, 0);
  const scored = questions.reduce((s, q) =>
    s + (answers[q.id] === q.correctLetter ? q.points : 0), 0);
  const correct = questions.filter(q => answers[q.id] === q.correctLetter).length;
  const pct = Math.round((scored / totalPts) * 100);
  const minsUsed = Math.floor(timeTaken / 60);
  const secsUsed = timeTaken % 60;

  const ptColors: Record<number, string> = { 3: COLORS.teal, 4: COLORS.gold, 5: COLORS.purple };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px" }}>
      {/* Score header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.card2}, ${COLORS.card})`,
        border: "2px solid rgba(245,166,35,0.3)",
        borderRadius: 28, padding: "36px 32px",
        textAlign: "center", marginBottom: 28,
        boxShadow: "0 0 60px rgba(245,166,35,0.12)",
      }}>
        <div style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 900,
          fontSize: "clamp(52px, 12vw, 80px)", color: "white",
          lineHeight: 1, marginBottom: 8,
        }}>
          {scored}
          <span style={{ fontSize: "0.4em", color: COLORS.muted, fontWeight: 700 }}>/{totalPts}</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.gold, marginBottom: 8 }}>
          {pct}% · {correct}/{questions.length} correct
        </div>
        <div style={{ fontSize: 14, color: COLORS.muted, fontWeight: 600, marginBottom: 20 }}>
          Time used: {String(minsUsed).padStart(2, "0")}:{String(secsUsed).padStart(2, "0")} of {Math.floor(totalTime / 60)} minutes
        </div>
        <div style={{
          display: "inline-block",
          background: pct >= 80 ? "rgba(46,204,113,0.15)" : pct >= 60 ? "rgba(245,166,35,0.15)" : "rgba(78,205,196,0.1)",
          border: `2px solid ${pct >= 80 ? "rgba(46,204,113,0.4)" : pct >= 60 ? "rgba(245,166,35,0.4)" : "rgba(78,205,196,0.3)"}`,
          borderRadius: 12, padding: "8px 20px",
          fontSize: 15, fontWeight: 800,
          color: pct >= 80 ? COLORS.green : pct >= 60 ? COLORS.gold : COLORS.teal,
        }}>
          {pct >= 90 ? "🏆 Distinction — Outstanding!" :
           pct >= 80 ? "🥇 Merit — Excellent work!" :
           pct >= 65 ? "🥈 Pass — Well done!" :
           pct >= 50 ? "📚 Keep practising!" :
           "💪 Review the solutions and try again!"}
        </div>
      </div>

      {/* Solutions toggle */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowSolutions(!showSolutions)}
          style={{
            background: "rgba(78,205,196,0.1)",
            border: "2px solid rgba(78,205,196,0.3)",
            borderRadius: 12, padding: "12px 24px",
            fontSize: 14, fontWeight: 800, color: COLORS.teal,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
          }}
        >
          {showSolutions ? "▲ Hide Solutions" : "▼ View Full Solutions"}
        </button>
      </div>

      {/* Per-question review */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {questions.map((q, i) => {
          const isCorrect = answers[q.id] === q.correctLetter;
          const myAnswer = q.options.find(o => o.letter === answers[q.id]);
          const correctOpt = q.options.find(o => o.letter === q.correctLetter);
          return (
            <div key={q.id} style={{
              background: isCorrect ? "rgba(46,204,113,0.06)" : "rgba(231,76,60,0.06)",
              border: `1.5px solid ${isCorrect ? "rgba(46,204,113,0.2)" : "rgba(231,76,60,0.2)"}`,
              borderRadius: 16, padding: "16px 20px",
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{isCorrect ? "✅" : "❌"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>
                    Q{i + 1} · {q.text.split("\n")[0].substring(0, 65)}{q.text.length > 65 ? "…" : ""}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
                    <span style={{ color: ptColors[q.points], fontWeight: 700 }}>{q.points} marks</span>
                    {!isCorrect && myAnswer && (
                      <span style={{ color: COLORS.red }}>Your answer: ({answers[q.id]}) {myAnswer.text}</span>
                    )}
                    {!isCorrect && (
                      <span style={{ color: COLORS.green }}>Correct: ({q.correctLetter}) {correctOpt?.text}</span>
                    )}
                  </div>

                  {showSolutions && (
                    <div style={{
                      marginTop: 10,
                      background: "rgba(78,205,196,0.06)",
                      border: "1px solid rgba(78,205,196,0.2)",
                      borderRadius: 10, padding: "10px 14px",
                      fontSize: 13, color: COLORS.teal, fontWeight: 600, lineHeight: 1.6,
                    }}>
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 900,
                  color: isCorrect ? COLORS.green : COLORS.muted, flexShrink: 0,
                }}>
                  {isCorrect ? `+${q.points}` : "+0"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={onRetry} style={{
          background: "rgba(245,166,35,0.15)", border: "2px solid rgba(245,166,35,0.4)",
          borderRadius: 14, padding: "14px 28px",
          fontSize: 14, fontWeight: 800, color: COLORS.gold,
          cursor: "pointer", fontFamily: "'Nunito', sans-serif",
        }}>
          🔄 Try Again
        </button>
        <button onClick={onHome} style={{
          background: COLORS.card, border: "2px solid rgba(255,255,255,0.1)",
          borderRadius: 14, padding: "14px 28px",
          fontSize: 14, fontWeight: 800, color: "white",
          cursor: "pointer", fontFamily: "'Nunito', sans-serif",
        }}>
          🏠 Choose Different Paper
        </button>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

type Phase = "select" | "exam" | "review" | "results";

export default function TimedPaper() {
  const [phase, setPhase] = useState<Phase>("select");
  const [yearGroup, setYearGroup] = useState<YearGroup>("Y3-4");
  const [questions, setQuestions] = useState<CompetitionQ[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = yearGroup ? TIMED_PAPER_CONFIG[yearGroup].minutes * 60 : 1800;

  const startExam = useCallback((yg: YearGroup, qs: CompetitionQ[]) => {
    setYearGroup(yg);
    setQuestions(qs);
    setAnswers({});
    setFlagged(new Set());
    setCurrentIndex(0);
    setSecondsLeft(TIMED_PAPER_CONFIG[yg].minutes * 60);
    setPhase("exam");
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          setTimeTaken(totalSeconds);
          setPhase("results");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase, totalSeconds]);

  const handleSubmit = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeTaken(totalSeconds - secondsLeft);
    setPhase("results");
  };

  const toggleFlag = (id: string) => {
    setFlagged(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const goToQuestion = (i: number) => {
    setCurrentIndex(i);
    setPhase("exam");
  };

  if (phase === "select") {
    return (
      <Layout>
        <div style={{ background: "#0F1B2D", minHeight: "100vh" }}>
          <PaperSelector onStart={startExam} />
        </div>
      </Layout>
    );
  }

  if (phase === "results") {
    return (
      <Layout>
        <div style={{ background: "#0F1B2D", minHeight: "100vh" }}>
          <TimedResults
            questions={questions} answers={answers}
            timeTaken={timeTaken} totalTime={totalSeconds}
            onRetry={() => startExam(yearGroup, questions)}
            onHome={() => setPhase("select")}
          />
        </div>
      </Layout>
    );
  }

  if (phase === "review") {
    return (
      <Layout>
        <div style={{ background: "#0F1B2D", minHeight: "100vh", padding: "20px" }}>
          {/* Timer still ticking in review */}
          <div style={{ maxWidth: 720, margin: "0 auto 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setPhase("exam")} style={{
              background: "transparent", border: "none", color: COLORS.muted,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>← Back to paper</button>
            <Timer seconds={secondsLeft} total={totalSeconds} />
          </div>
          <ReviewScreen
            questions={questions} answers={answers} flagged={flagged}
            onGoTo={goToQuestion} onSubmit={handleSubmit}
          />
        </div>
      </Layout>
    );
  }

  // Exam phase
  const q = questions[currentIndex];
  if (!q) return null;
  const ptColors: Record<number, string> = { 3: COLORS.teal, 4: COLORS.gold, 5: COLORS.purple };

  return (
    <Layout>
      <div style={{ background: "#0F1B2D", minHeight: "100vh" }}>
        {/* Sticky exam bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: `${COLORS.navy}f0`, backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "10px 20px",
        }}>
          <div style={{
            maxWidth: 720, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            {/* Question dots */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1 }}>
              {questions.map((qi, i) => (
                <div
                  key={qi.id}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: 22, height: 22, borderRadius: 5,
                    background: i === currentIndex ? COLORS.gold
                      : flagged.has(qi.id) ? "rgba(245,166,35,0.35)"
                      : answers[qi.id] ? `${ptColors[qi.points]}30` : "rgba(255,255,255,0.07)",
                    border: `1.5px solid ${i === currentIndex ? COLORS.gold : "transparent"}`,
                    cursor: "pointer", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 800, color: i === currentIndex ? COLORS.navy : COLORS.muted,
                  }}
                >
                  {flagged.has(qi.id) ? "🚩" : i + 1}
                </div>
              ))}
            </div>
            <Timer seconds={secondsLeft} total={totalSeconds} />
          </div>
        </div>

        <div style={{ padding: "24px 20px 40px" }}>
          <ExamQuestion
            q={q} index={currentIndex}
            selected={answers[q.id] ?? null}
            flagged={flagged.has(q.id)}
            onSelect={l => setAnswers(prev => ({ ...prev, [q.id]: l }))}
            onFlag={() => toggleFlag(q.id)}
            onNext={() => {
              if (currentIndex + 1 >= questions.length) {
                setPhase("review");
              } else {
                setCurrentIndex(i => i + 1);
              }
            }}
            onPrev={() => setCurrentIndex(i => Math.max(0, i - 1))}
            total={questions.length}
            isLast={currentIndex + 1 >= questions.length}
          />
        </div>
      </div>
    </Layout>
  );
}
