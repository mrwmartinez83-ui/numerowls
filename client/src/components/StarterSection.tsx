import { useState } from "react";
import { Lesson } from "@/lib/lessonData";
import { LessonProgress } from "@/hooks/useProgress";

interface Props {
  lesson: Lesson;
  lessonProgress: LessonProgress | null;
  onAnswer: (isCorrect: boolean) => void;
}

export default function StarterSection({ lesson, lessonProgress, onAnswer }: Props) {
  const { starterSteps } = lesson;
  const [revealed, setRevealed] = useState<boolean[]>(starterSteps.map(() => false));
  const [allDone, setAllDone] = useState(false);

  const revealStep = (i: number) => {
    if (revealed[i]) return;
    const next = [...revealed];
    next[i] = true;
    setRevealed(next);
    onAnswer(true);
    if (next.every(Boolean)) setAllDone(true);
  };

  const reset = () => {
    setRevealed(starterSteps.map(() => false));
    setAllDone(false);
  };

  const sp = lessonProgress?.starter;
  const pct = sp && sp.total > 0 ? Math.round((sp.correct / sp.total) * 100) : 0;
  const revealedCount = revealed.filter(Boolean).length;

  return (
    <section id="starter">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div
          style={{
            background: lesson.color,
            border: "4px solid #2D3436",
            borderRadius: 16,
            padding: "10px 24px",
            boxShadow: "5px 5px 0px #2D3436",
          }}
        >
          <h2
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: 30,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            🎯 Starter Activity
          </h2>
        </div>
        <div
          style={{
            background: "#FFF9C4",
            border: "3px solid #2D3436",
            borderRadius: 12,
            padding: "8px 16px",
            fontWeight: 700,
            fontSize: 15,
            color: "#2D3436",
          }}
        >
          Warm-up your brain!
        </div>
      </div>

      {/* Progress bar */}
      {sp && sp.total > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#555" }}>Progress</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: lesson.color }}>{revealedCount}/{starterSteps.length} steps revealed</span>
          </div>
          <div style={{ background: "#e0e0e0", borderRadius: 99, height: 12, border: "2px solid #2D3436", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, background: lesson.color, height: "100%", borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}

      {/* Intro card */}
      <div
        className="km-card"
        style={{ padding: "24px 32px", marginBottom: 32, background: "linear-gradient(135deg, #fff 60%, #FFF9C4 100%)" }}
      >
        <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: lesson.color, marginBottom: 8 }}>
          🔐 Crack the Code!
        </h3>
        <p style={{ fontSize: 18, fontWeight: 600, color: "#2D3436", lineHeight: 1.6 }}>
          Each animal or object is hiding a secret number. Use the clues to figure out what each one is worth — then use those values to solve the final mystery!
        </p>
        <p style={{ fontSize: 15, color: "#666", marginTop: 8, fontWeight: 600 }}>
          Click <strong style={{ color: "#4ECDC4" }}>Reveal Answer</strong> when you're ready to check each step.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {starterSteps.map((step, i) => {
          const isLast = i === starterSteps.length - 1;
          return (
            <div
              key={i}
              className="km-card"
              style={{
                padding: "24px 28px",
                borderColor: revealed[i] ? "#28a745" : "#2D3436",
                boxShadow: revealed[i] ? "6px 6px 0px #28a745" : "6px 6px 0px #2D3436",
                transition: "all 0.3s ease",
              }}
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div
                  style={{
                    background: isLast ? "#9B59B6" : lesson.color,
                    border: "3px solid #2D3436",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: 22,
                    color: "white",
                    flexShrink: 0,
                    boxShadow: "3px 3px 0px #2D3436",
                  }}
                >
                  {isLast ? "?" : i + 1}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div
                    style={{
                      background: "#FDFBF7",
                      border: "3px solid #e0e0e0",
                      borderRadius: 14,
                      padding: "12px 20px",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#2D3436",
                      marginBottom: 12,
                      textAlign: "center",
                      letterSpacing: 2,
                    }}
                  >
                    {step.clue}
                  </div>

                  <p style={{ fontSize: 16, fontWeight: 600, color: "#555", marginBottom: 12, fontStyle: "italic" }}>
                    💡 {step.hint}
                  </p>

                  {!revealed[i] ? (
                    <button className="km-btn km-btn-teal" onClick={() => revealStep(i)} style={{ fontSize: 16 }}>
                      👀 Reveal Answer
                    </button>
                  ) : (
                    <div
                      style={{
                        background: "#d4edda",
                        border: "3px solid #28a745",
                        borderRadius: 14,
                        padding: "14px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>✅</span>
                      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#155724" }}>
                        Answer = {step.answer}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allDone && (
        <div
          style={{
            marginTop: 24,
            background: `linear-gradient(135deg, ${lesson.color}, #FF8E53)`,
            border: "4px solid #2D3436",
            borderRadius: 20,
            padding: "20px 32px",
            textAlign: "center",
            boxShadow: "6px 6px 0px #2D3436",
          }}
        >
          <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "white", textShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}>
            🎉 Amazing! You cracked the code! 🎉
          </p>
          <button className="km-btn km-btn-yellow" onClick={reset} style={{ marginTop: 12, fontSize: 15 }}>
            🔄 Try Again
          </button>
        </div>
      )}
    </section>
  );
}
