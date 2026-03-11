import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import { COMPETITION_SETS, ALL_COMPETITION_QUESTIONS, type CompetitionQ, type CompetitionSet, type YearGroup } from "@/lib/competitionBank";
import { fireCorrectConfetti, fireBigCelebration, firePerfectScore } from "@/hooks/useConfetti";

// ── Colour System ────────────────────────────────────────────────────────────
const COLORS = {
  navy:   "#0F1B2D",
  card:   "#1A2E4A",
  card2:  "#243B55",
  gold:   "#F5A623",
  teal:   "#4ECDC4",
  purple: "#9B59B6",
  green:  "#2ECC71",
  red:    "#E74C3C",
  muted:  "#B0C4DE",
};

const ptColors: Record<number, string> = { 3: COLORS.teal, 4: COLORS.gold, 5: COLORS.purple };
const ptLabels: Record<number, string> = { 3: "Warm-up", 4: "Challenge", 5: "Expert" };

const yearGroupColors: Record<YearGroup, string> = {
  "Y1-2": "#4ECDC4",
  "Y3-4": "#F5A623",
  "Y5-6": "#E74C3C",
  "Mixed": "#9B59B6",
};

// ── Star rating ──────────────────────────────────────────────────────────────
function getStars(pct: number): number {
  if (pct >= 90) return 3;
  if (pct >= 65) return 2;
  if (pct >= 40) return 1;
  return 0;
}

// ── Animated Star ────────────────────────────────────────────────────────────
function Star({ filled, delay }: { filled: boolean; delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span style={{
      fontSize: 48,
      display: "inline-block",
      transform: show ? "scale(1) rotate(0deg)" : "scale(0) rotate(-30deg)",
      transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      filter: filled ? "drop-shadow(0 0 8px gold)" : "none",
    }}>
      {filled ? "⭐" : "☆"}
    </span>
  );
}

// ── Question type pill ───────────────────────────────────────────────────────
const styleLabels: Record<string, string> = {
  "think-of-number":    "💭 Think of a Number",
  "work-backwards":     "⏪ Work Backwards",
  "age-puzzle":         "👨‍👩‍👧 Age Puzzle",
  "handshakes":         "🤝 Counting",
  "calendar":           "📅 Calendar",
  "grid-counting":      "🔲 Grid Counting",
  "balance-scales":     "⚖️ Balance Scales",
  "digit-puzzle":       "🔢 Digit Puzzle",
  "rate-proportion":    "⚡ Rate & Proportion",
  "venn-diagram":       "⭕ Venn Diagram",
  "consecutive-numbers":"📶 Consecutive Numbers",
  "logic-deduction":    "🧠 Logic",
  "fraction-operation": "🍕 Fractions",
  "perimeter-area":     "📐 Geometry",
  "number-property":    "✨ Number Properties",
  "pattern-sequence":   "🔄 Patterns",
  "standard":           "📝 Word Problem",
};

// ── Set Selector Screen ──────────────────────────────────────────────────────
function SetSelector({ onSelect }: { onSelect: (set: CompetitionSet) => void }) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🦉</div>
        <h1 style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 44px)",
          color: "white",
          marginBottom: 10,
          letterSpacing: "-0.5px",
        }}>
          Competition Mode
        </h1>
        <p style={{
          fontSize: 16,
          color: COLORS.muted,
          fontWeight: 600,
          maxWidth: 480,
          margin: "0 auto",
          lineHeight: 1.6,
        }}>
          PMC · UKMT · Kangaroo-style questions.<br/>
          Choose your year group and show what you know!
        </p>
      </div>

      {/* Set Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {COMPETITION_SETS.map((set) => {
          const accentColor = yearGroupColors[set.yearGroup];
          const isHovered = hoverId === set.id;
          const pts3 = set.questions.filter(q => q.points === 3).length;
          const pts4 = set.questions.filter(q => q.points === 4).length;
          const pts5 = set.questions.filter(q => q.points === 5).length;
          return (
            <div
              key={set.id}
              onClick={() => onSelect(set)}
              onMouseEnter={() => setHoverId(set.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                background: isHovered ? COLORS.card2 : COLORS.card,
                border: `2px solid ${isHovered ? accentColor : `${accentColor}44`}`,
                borderRadius: 20,
                padding: "28px 24px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                transform: isHovered ? "translateY(-4px)" : "none",
                boxShadow: isHovered ? `0 12px 40px ${accentColor}22` : "none",
              }}
            >
              {/* Year badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: `${accentColor}22`,
                border: `2px solid ${accentColor}55`,
                borderRadius: 99,
                padding: "4px 14px",
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: accentColor }}>
                  {set.yearGroup}
                </span>
              </div>

              <h3 style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 20,
                color: "white",
                margin: "0 0 8px",
              }}>
                {set.name}
              </h3>
              <p style={{ fontSize: 13, color: COLORS.muted, fontWeight: 600, marginBottom: 20, lineHeight: 1.5 }}>
                {set.description}
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8, padding: "4px 10px",
                  fontSize: 12, fontWeight: 700, color: COLORS.muted,
                }}>
                  {set.questions.length} questions
                </span>
                {pts3 > 0 && <span style={{ background: `${COLORS.teal}22`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: COLORS.teal }}>
                  {pts3} × 3pt
                </span>}
                {pts4 > 0 && <span style={{ background: `${COLORS.gold}22`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: COLORS.gold }}>
                  {pts4} × 4pt
                </span>}
                {pts5 > 0 && <span style={{ background: `${COLORS.purple}22`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: COLORS.purple }}>
                  {pts5} × 5pt
                </span>}
              </div>

              {/* Total points */}
              <div style={{
                marginTop: 20, paddingTop: 16,
                borderTop: `1px solid rgba(255,255,255,0.07)`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 13, color: COLORS.muted, fontWeight: 700 }}>
                  Total available
                </span>
                <span style={{ fontSize: 22, fontWeight: 900, color: accentColor, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {set.totalPoints} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Browse all link */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <p style={{ fontSize: 13, color: COLORS.muted, fontWeight: 600 }}>
          {ALL_COMPETITION_QUESTIONS.length} questions across all year groups · Inspired by PMC, UKMT, Kangourou
        </p>
      </div>
    </div>
  );
}

// ── Question Card (exam style) ───────────────────────────────────────────────
function QuestionCard({
  q,
  index,
  total,
  onAnswer,
  onHint,
  hintUsed,
  answered,
}: {
  q: CompetitionQ;
  index: number;
  total: number;
  onAnswer: (letter: string) => void;
  onHint: () => void;
  hintUsed: boolean;
  answered: string | null;
}) {
  const ptColor = ptColors[q.points];
  const isCorrect = answered === q.correctLetter;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted }}>
            Question {index + 1} of {total}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: ptColor }}>
            {styleLabels[q.style] ?? "📝 Question"}
          </span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
          <div style={{
            height: "100%",
            width: `${((index + 1) / total) * 100}%`,
            background: `linear-gradient(90deg, ${ptColor}, ${ptColor}bb)`,
            borderRadius: 99,
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Main card */}
      <div style={{
        background: COLORS.card,
        borderRadius: 24,
        padding: "28px 28px 24px",
        border: `2px solid ${
          answered
            ? isCorrect ? "rgba(46,204,113,0.5)" : "rgba(231,76,60,0.4)"
            : `${ptColor}33`
        }`,
        boxShadow: answered && isCorrect ? `0 0 40px rgba(46,204,113,0.12)` : "none",
        transition: "all 0.3s ease",
      }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{
            background: `${ptColor}22`,
            border: `2px solid ${ptColor}55`,
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: 12, fontWeight: 800, color: ptColor,
          }}>
            {q.points} points · {ptLabels[q.points]}
          </div>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 99,
            padding: "4px 12px",
            fontSize: 11, fontWeight: 700,
            color: COLORS.muted,
          }}>
            Year {q.year}{q.yearMax !== q.year ? `–${q.yearMax}` : ""}
          </div>
          {answered && (
            <span style={{ fontSize: 20, marginLeft: "auto" }}>
              {isCorrect ? "✅" : "❌"}
            </span>
          )}
        </div>

        {/* Question text */}
        <p style={{
          fontSize: 18,
          fontWeight: 700,
          color: "white",
          lineHeight: 1.7,
          marginBottom: 20,
          whiteSpace: "pre-line",
          fontFamily: "'Nunito', sans-serif",
        }}>
          {q.text}
        </p>

        {/* Diagram */}
        {q.svgDiagram && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
          }}>
            <div
              dangerouslySetInnerHTML={{ __html: q.svgDiagram }}
              style={{ width: "100%", maxWidth: 380 }}
            />
          </div>
        )}

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {q.options.map((opt) => {
            let bg = "rgba(255,255,255,0.04)";
            let borderColor = "rgba(255,255,255,0.12)";
            let textColor = "white";
            let cursor = "pointer";

            if (answered) {
              cursor = "default";
              if (opt.letter === q.correctLetter) {
                bg = "rgba(46,204,113,0.14)";
                borderColor = "rgba(46,204,113,0.55)";
              } else if (opt.letter === answered) {
                bg = "rgba(231,76,60,0.12)";
                borderColor = "rgba(231,76,60,0.5)";
              } else {
                bg = "rgba(255,255,255,0.02)";
                textColor = COLORS.muted;
              }
            }

            return (
              <button
                key={opt.letter}
                onClick={() => {
                  if (!answered) {
                    onAnswer(opt.letter);
                    if (opt.letter === q.correctLetter) {
                      fireCorrectConfetti();
                    }
                  }
                }}
                disabled={!!answered}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  cursor,
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span style={{
                  width: 32, height: 32,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: answered && opt.letter === q.correctLetter
                    ? "rgba(46,204,113,0.25)"
                    : answered && opt.letter === answered
                    ? "rgba(231,76,60,0.25)"
                    : `${ptColor}22`,
                  border: `2px solid ${
                    answered && opt.letter === q.correctLetter ? "rgba(46,204,113,0.6)"
                    : answered && opt.letter === answered ? "rgba(231,76,60,0.6)"
                    : `${ptColor}44`
                  }`,
                  borderRadius: 8,
                  fontSize: 13, fontWeight: 800, color: ptColor,
                  flexShrink: 0,
                }}>
                  {opt.letter}
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: textColor, flex: 1 }}>
                  {opt.text}
                </span>
                {answered && opt.letter === q.correctLetter && <span>✅</span>}
                {answered && opt.letter === answered && opt.letter !== q.correctLetter && <span>❌</span>}
              </button>
            );
          })}
        </div>

        {/* Hint button */}
        {!answered && (
          <div>
            {!hintUsed ? (
              <button
                onClick={onHint}
                style={{
                  background: "transparent",
                  border: `1.5px dashed rgba(245,166,35,0.4)`,
                  borderRadius: 10,
                  padding: "8px 18px",
                  color: COLORS.gold,
                  fontSize: 13, fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                💡 Show Hint
              </button>
            ) : (
              <div style={{
                background: "rgba(245,166,35,0.08)",
                border: "1.5px solid rgba(245,166,35,0.3)",
                borderRadius: 12,
                padding: "12px 16px",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gold }}>
                  💡 Hint: {q.hint}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Explanation (after answering) */}
        {answered && (
          <div style={{
            background: isCorrect ? "rgba(46,204,113,0.08)" : "rgba(245,166,35,0.08)",
            border: `2px solid ${isCorrect ? "rgba(46,204,113,0.3)" : "rgba(245,166,35,0.3)"}`,
            borderRadius: 16,
            padding: "16px 18px",
            marginTop: 16,
          }}>
            <div style={{
              fontSize: 15, fontWeight: 800,
              color: isCorrect ? COLORS.green : COLORS.gold,
              marginBottom: 8,
            }}>
              {isCorrect ? "🎉 Correct! Well done!" : `😅 The answer was (${q.correctLetter})`}
            </div>
            <p style={{
              fontSize: 14,
              color: COLORS.muted,
              lineHeight: 1.7,
              fontWeight: 600,
              margin: 0,
              whiteSpace: "pre-line",
            }}>
              💡 {q.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({
  set,
  answers,
  hintsUsed,
  onRetry,
  onHome,
}: {
  set: CompetitionSet;
  answers: Record<string, string>;
  hintsUsed: Set<string>;
  onRetry: () => void;
  onHome: () => void;
}) {
  const score = set.questions.reduce((s, q) => {
    return s + (answers[q.id] === q.correctLetter ? q.points : 0);
  }, 0);
  const pct = Math.round((score / set.totalPoints) * 100);
  const stars = getStars(pct);
  const correct = set.questions.filter(q => answers[q.id] === q.correctLetter).length;
  const accentColor = yearGroupColors[set.yearGroup];

  // Fire confetti on mount based on score
  useEffect(() => {
    if (pct === 100) firePerfectScore();
    else if (pct >= 65) fireBigCelebration();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      {/* Score banner */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.card2}, ${COLORS.card})`,
        border: `2px solid ${accentColor}44`,
        borderRadius: 28,
        padding: "36px 32px",
        textAlign: "center",
        marginBottom: 32,
        boxShadow: `0 0 60px ${accentColor}18`,
      }}>
        <div style={{ marginBottom: 16 }}>
          {[0, 1, 2].map(i => (
            <Star key={i} filled={i < stars} delay={i * 200 + 100} />
          ))}
        </div>

        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(48px, 10vw, 72px)",
          color: "white",
          lineHeight: 1,
          marginBottom: 6,
        }}>
          {score}
          <span style={{ fontSize: "0.4em", color: COLORS.muted, fontWeight: 700 }}>
            /{set.totalPoints}
          </span>
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: accentColor, marginBottom: 8 }}>
          {pct}% · {correct}/{set.questions.length} correct
        </div>

        <div style={{ fontSize: 15, color: COLORS.muted, fontWeight: 600 }}>
          {pct >= 90 ? "🏆 Outstanding! You're competition-ready!" :
           pct >= 65 ? "🎯 Great work! Keep practising!" :
           pct >= 40 ? "📚 Good effort — review the explanations!" :
           "💪 Keep going — you'll get there!"}
        </div>
      </div>

      {/* Per-question review */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 900, fontSize: 18, color: "white",
          marginBottom: 16,
        }}>
          Question Review
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {set.questions.map((q, i) => {
            const isCorrect = answers[q.id] === q.correctLetter;
            const wasHinted = hintsUsed.has(q.id);
            return (
              <div key={q.id} style={{
                background: isCorrect ? "rgba(46,204,113,0.07)" : "rgba(231,76,60,0.07)",
                border: `1.5px solid ${isCorrect ? "rgba(46,204,113,0.25)" : "rgba(231,76,60,0.25)"}`,
                borderRadius: 14,
                padding: "12px 16px",
                display: "flex", alignItems: "flex-start", gap: 12,
              }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>
                  {isCorrect ? "✅" : "❌"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 3 }}>
                    Q{i + 1}: {q.text.split("\n")[0].substring(0, 70)}{q.text.length > 70 ? "…" : ""}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ptColors[q.points] }}>
                      {q.points} pts
                    </span>
                    {wasHinted && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold }}>
                        💡 hint used
                      </span>
                    )}
                    {!isCorrect && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted }}>
                        Answer: ({q.correctLetter}) {q.options.find(o => o.letter === q.correctLetter)?.text}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 800,
                  color: isCorrect ? COLORS.green : COLORS.muted,
                  flexShrink: 0,
                }}>
                  {isCorrect ? `+${q.points}` : "+0"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={onRetry}
          style={{
            background: `${accentColor}22`,
            border: `2px solid ${accentColor}55`,
            borderRadius: 14,
            padding: "14px 28px",
            color: accentColor,
            fontSize: 15, fontWeight: 800,
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          🔄 Try Again
        </button>
        <button
          onClick={onHome}
          style={{
            background: COLORS.card,
            border: "2px solid rgba(255,255,255,0.12)",
            borderRadius: 14,
            padding: "14px 28px",
            color: "white",
            fontSize: 15, fontWeight: 800,
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          🏠 Choose Different Set
        </button>
      </div>
    </div>
  );
}

// ── Main Competition Mode Page ───────────────────────────────────────────────

type Phase = "select" | "questions" | "results";

export default function CompetitionMode() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedSet, setSelectedSet] = useState<CompetitionSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hintsUsed, setHintsUsed] = useState<Set<string>>(new Set());
  const [hintVisible, setHintVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const startSet = (set: CompetitionSet) => {
    setSelectedSet(set);
    setCurrentIndex(0);
    setAnswers({});
    setHintsUsed(new Set());
    setHintVisible(false);
    setPhase("questions");
  };

  const handleAnswer = (letter: string) => {
    if (!selectedSet) return;
    const q = selectedSet.questions[currentIndex];
    setAnswers(prev => ({ ...prev, [q.id]: letter }));
  };

  const handleHint = () => {
    if (!selectedSet) return;
    const q = selectedSet.questions[currentIndex];
    setHintsUsed(prev => { const next = new Set(prev); next.add(q.id); return next; });
    setHintVisible(true);
  };

  const handleNext = () => {
    if (!selectedSet) return;
    if (currentIndex + 1 >= selectedSet.questions.length) {
      setPhase("results");
    } else {
      setCurrentIndex(i => i + 1);
      setHintVisible(false);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setHintVisible(false);
    }
  };

  if (phase === "select") {
    return (
      <div style={{ background: COLORS.navy, minHeight: "100vh" }}>
        <NavBar />
        <SetSelector onSelect={startSet} />
      </div>
    );
  }

  if (phase === "results" && selectedSet) {
    return (
      <div style={{ background: COLORS.navy, minHeight: "100vh" }}>
        <NavBar />
        <ResultsScreen
          set={selectedSet}
          answers={answers}
          hintsUsed={hintsUsed}
          onRetry={() => startSet(selectedSet)}
          onHome={() => setPhase("select")}
        />
      </div>
    );
  }

  if (phase === "questions" && selectedSet) {
    const q = selectedSet.questions[currentIndex];
    const answered = answers[q.id] ?? null;
    const accentColor = yearGroupColors[selectedSet.yearGroup];
    const isLast = currentIndex + 1 >= selectedSet.questions.length;

    return (
      <div style={{ background: COLORS.navy, minHeight: "100vh" }}>
        <NavBar />
        {/* Sticky top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: `${COLORS.navy}ee`,
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "12px 20px",
        }}>
          <div style={{
            maxWidth: 720, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <button
              onClick={() => setPhase("select")}
              style={{
                background: "transparent", border: "none",
                color: COLORS.muted, fontSize: 13, fontWeight: 700,
                cursor: "pointer", padding: "4px 0",
              }}
            >
              ← Back
            </button>

            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "white" }}>
                {selectedSet.name}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>
                {selectedSet.questions.filter(qi => answers[qi.id] === qi.correctLetter).length} correct so far
              </div>
            </div>

            {/* Score so far */}
            <div style={{
              background: `${accentColor}22`,
              border: `1.5px solid ${accentColor}44`,
              borderRadius: 10,
              padding: "4px 12px",
              fontSize: 13, fontWeight: 800, color: accentColor,
            }}>
              {selectedSet.questions.slice(0, currentIndex + 1).reduce((s, qi) => {
                return s + (answers[qi.id] === qi.correctLetter ? qi.points : 0);
              }, 0)} pts
            </div>
          </div>
        </div>

        {/* Question */}
        <div ref={cardRef} style={{ padding: "28px 20px 32px" }}>
          <QuestionCard
            q={q}
            index={currentIndex}
            total={selectedSet.questions.length}
            onAnswer={handleAnswer}
            onHint={handleHint}
            hintUsed={hintVisible || hintsUsed.has(q.id)}
            answered={answered}
          />

          {/* Navigation */}
          <div style={{
            maxWidth: 720, margin: "24px auto 0",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            gap: 12,
          }}>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                background: currentIndex === 0 ? "transparent" : COLORS.card,
                border: `2px solid ${currentIndex === 0 ? "transparent" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14,
                padding: "12px 22px",
                color: currentIndex === 0 ? "transparent" : COLORS.muted,
                fontSize: 14, fontWeight: 700,
                cursor: currentIndex === 0 ? "default" : "pointer",
                transition: "all 0.2s",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              ← Previous
            </button>

            {answered && (
              <button
                onClick={handleNext}
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  border: "none",
                  borderRadius: 14,
                  padding: "14px 32px",
                  color: COLORS.navy,
                  fontSize: 15, fontWeight: 900,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: `0 4px 20px ${accentColor}44`,
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {isLast ? "🏁 See Results" : "Next Question →"}
              </button>
            )}
          </div>

          {/* Question dot navigation */}
          <div style={{
            maxWidth: 720, margin: "20px auto 0",
            display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center",
          }}>
            {selectedSet.questions.map((qi, i) => {
              const isAnswered = !!answers[qi.id];
              const isCurrent = i === currentIndex;
              const isCorrectQ = answers[qi.id] === qi.correctLetter;
              return (
                <div
                  key={qi.id}
                  onClick={() => { setCurrentIndex(i); setHintVisible(false); }}
                  title={`Q${i + 1} · ${qi.points}pt`}
                  style={{
                    width: 28, height: 28,
                    borderRadius: 8,
                    background: isCurrent
                      ? accentColor
                      : isAnswered
                      ? isCorrectQ ? "rgba(46,204,113,0.35)" : "rgba(231,76,60,0.3)"
                      : "rgba(255,255,255,0.07)",
                    border: `2px solid ${isCurrent ? accentColor : "transparent"}`,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800,
                    color: isCurrent ? COLORS.navy : isAnswered ? "white" : COLORS.muted,
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
