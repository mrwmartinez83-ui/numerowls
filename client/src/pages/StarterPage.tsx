import { useState, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { lessons, StarterStep } from "@/lib/lessonData";
import { useProgress } from "@/hooks/useProgress";

export default function StarterPage() {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const lesson = lessons[activeLessonIdx];
  const { initLesson, recordAnswer, getLessonProgress } = useProgress();

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
  const sp = lessonProgress?.starter;
  const pct = sp && sp.total > 0 ? Math.round((sp.attempted / sp.total) * 100) : 0;

  return (
    <Layout>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A2E4A 0%, #243B55 100%)",
          borderBottom: "1px solid rgba(245, 166, 35, 0.2)",
          padding: "40px 0 32px",
        }}
      >
        <div className="container">
          <div className="no-section-pill" style={{ marginBottom: 16 }}>🎯 Starter Activity</div>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)", color: "white", marginBottom: 8 }}>
            Crack the Code!
          </h1>
          <p style={{ fontSize: 16, color: "#B0C4DE", fontWeight: 600, maxWidth: 520 }}>
            Each symbol hides a secret number. Use the clues to figure out what each one is worth — then solve the final mystery!
          </p>

          {/* Lesson selector */}
          <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
            {lessons.map((l, idx) => (
              <button
                key={l.id}
                onClick={() => setActiveLessonIdx(idx)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  border: `2px solid ${idx === activeLessonIdx ? l.color : "rgba(255,255,255,0.15)"}`,
                  background: idx === activeLessonIdx ? `${l.color}22` : "transparent",
                  color: idx === activeLessonIdx ? l.color : "#B0C4DE",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {l.emoji} {l.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {/* Progress bar */}
        {sp && sp.total > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#B0C4DE" }}>Starter Progress</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#F5A623" }}>{sp.attempted}/{sp.total} revealed</span>
            </div>
            <div className="no-progress-track">
              <div className="no-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* Intro card */}
        <div
          className="no-card"
          style={{ marginBottom: 24, borderColor: "rgba(245, 166, 35, 0.4)", background: "rgba(245, 166, 35, 0.06)" }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>🔐</div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: "#F5A623", marginBottom: 6 }}>How to play</h2>
              <p style={{ fontSize: 15, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>
                Work through each clue in order. Each one gives you a new value to use in the next step.
                Click <span style={{ color: "#4ECDC4", fontWeight: 800 }}>Reveal Answer</span> when you're ready to check your thinking.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {lesson.starterSteps.map((step, idx) => (
            <StarterCard
              key={step.id}
              step={step}
              index={idx}
              lessonColor={lesson.color}
              onReveal={() => recordAnswer(lesson.id, "starter", true)}
            />
          ))}
        </div>

        {/* Next step CTA */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "#B0C4DE", fontWeight: 600, marginBottom: 20 }}>
            Ready for more? Head to the Practice Arena!
          </p>
          <Link href="/practice">
            <button className="no-btn-gold" style={{ fontSize: 17, padding: "14px 32px" }}>
              🧩 Go to Practice Arena →
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function StarterCard({
  step,
  index,
  lessonColor,
  onReveal,
}: {
  step: StarterStep;
  index: number;
  lessonColor: string;
  onReveal: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    if (!hasRecorded) {
      setHasRecorded(true);
      onReveal();
    }
  };

  return (
    <div
      className="no-card"
      style={{
        borderColor: revealed ? "rgba(46, 204, 113, 0.4)" : `rgba(${lessonColor === "#F5A623" ? "245,166,35" : "78,205,196"}, 0.2)`,
        background: revealed ? "rgba(46, 204, 113, 0.05)" : "#1A2E4A",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        {/* Step number */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: revealed ? "#2ECC71" : `linear-gradient(135deg, ${lessonColor}, ${lessonColor}cc)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "#0F1B2D",
            flexShrink: 0,
            transition: "background 0.3s",
          }}
        >
          {revealed ? "✓" : index + 1}
        </div>

        <div style={{ flex: 1 }}>
          {/* Clue */}
          <p style={{ fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1.6, marginBottom: 12 }}>
            {step.clue}
          </p>

          {/* Hint toggle */}
          {step.hint && !revealed && (
            <div style={{ marginBottom: 12 }}>
              {!showHint ? (
                <button
                  className="no-btn-ghost"
                  style={{ fontSize: 13, padding: "5px 14px" }}
                  onClick={() => setShowHint(true)}
                >
                  💡 Show Hint
                </button>
              ) : (
                <div
                  style={{
                    background: "rgba(245, 166, 35, 0.08)",
                    border: "1px solid rgba(245, 166, 35, 0.25)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 14,
                    color: "#F5A623",
                    fontWeight: 600,
                  }}
                >
                  💡 {step.hint}
                </div>
              )}
            </div>
          )}

          {/* Reveal button or answer */}
          {!revealed ? (
            <button className="no-btn-teal" style={{ fontSize: 14, padding: "8px 20px" }} onClick={handleReveal}>
              👀 Reveal Answer
            </button>
          ) : (
            <div className="animate-slide-up">
              <div
                style={{
                  background: "rgba(46, 204, 113, 0.1)",
                  border: "2px solid rgba(46, 204, 113, 0.4)",
                  borderRadius: 12,
                  padding: "14px 18px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#2ECC71",
                    marginBottom: 6,
                  }}
                >
                  ✅ {step.answer}
                </div>
                <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6, fontWeight: 600 }}>
                  💡 {step.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
