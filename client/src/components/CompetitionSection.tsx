import { useState } from "react";
import { competitionQuestions, CompetitionQuestion } from "@/lib/lessonData";

const POINT_COLORS: Record<number, { bg: string; border: string; shadow: string; label: string }> =
  {
    3: { bg: "#FF6B6B", border: "#c0392b", shadow: "#c0392b", label: "3 Points" },
    4: { bg: "#FF8E00", border: "#d35400", shadow: "#d35400", label: "4 Points" },
    5: { bg: "#9B59B6", border: "#7d3c98", shadow: "#7d3c98", label: "5 Points" },
  };

function QuestionCard({ q, index }: { q: CompetitionQuestion; index: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const colors = POINT_COLORS[q.points];
  const answered = selected !== null;

  const handleSelect = (letter: string) => {
    if (answered) return;
    setSelected(letter);
    setShowExplanation(true);
  };

  const reset = () => {
    setSelected(null);
    setShowExplanation(false);
  };

  const isCorrect = selected === q.correctLetter;

  return (
    <div
      className="km-card"
      style={{
        padding: "24px",
        borderColor: answered ? (isCorrect ? "#28a745" : "#dc3545") : "#2D3436",
        boxShadow: answered
          ? `6px 6px 0px ${isCorrect ? "#28a745" : "#dc3545"}`
          : "6px 6px 0px #2D3436",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4" style={{ flexWrap: "wrap" }}>
        <div
          style={{
            background: colors.bg,
            color: "white",
            fontFamily: "'Fredoka One', cursive",
            fontSize: 14,
            padding: "4px 12px",
            borderRadius: 8,
            border: `2px solid ${colors.border}`,
          }}
        >
          {colors.label}
        </div>
        <div
          style={{
            background: "#2D3436",
            color: "white",
            fontFamily: "'Fredoka One', cursive",
            fontSize: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Q{index + 1}
        </div>
        {q.visual && (
          <span style={{ fontSize: 28, marginLeft: "auto" }}>{q.visual}</span>
        )}
      </div>

      {/* Question text */}
      <p
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#2D3436",
          lineHeight: 1.6,
          marginBottom: 20,
          whiteSpace: "pre-line",
        }}
      >
        {q.text}
      </p>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {q.options.map((opt) => {
          let extraStyle: React.CSSProperties = {};
          if (answered) {
            if (opt.letter === q.correctLetter) {
              extraStyle = {
                background: "#d4edda",
                borderColor: "#28a745",
                boxShadow: "3px 3px 0px #28a745",
              };
            } else if (opt.letter === selected) {
              extraStyle = {
                background: "#f8d7da",
                borderColor: "#dc3545",
                boxShadow: "3px 3px 0px #dc3545",
              };
            }
          }

          return (
            <button
              key={opt.letter}
              className="km-option"
              style={{
                ...extraStyle,
                cursor: answered ? "default" : "pointer",
                textAlign: "left",
              }}
              onClick={() => handleSelect(opt.letter)}
            >
              <span className="km-option-letter">({opt.letter})</span>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{opt.text}</span>
              {answered && opt.letter === q.correctLetter && (
                <span style={{ marginLeft: "auto", fontSize: 20 }}>✅</span>
              )}
              {answered && opt.letter === selected && opt.letter !== q.correctLetter && (
                <span style={{ marginLeft: "auto", fontSize: 20 }}>❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="animate-slide-up">
          <div
            style={{
              background: isCorrect ? "#d4edda" : "#fff3cd",
              border: `3px solid ${isCorrect ? "#28a745" : "#ffc107"}`,
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 12,
            }}
          >
            <p
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 18,
                color: isCorrect ? "#155724" : "#856404",
                marginBottom: 6,
              }}
            >
              {isCorrect ? "🎉 Correct!" : `😅 Not quite — the answer is (${q.correctLetter})`}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#2D3436", lineHeight: 1.6 }}>
              💡 {q.explanation}
            </p>
          </div>
          <button
            className="km-btn"
            style={{
              background: "#F0F0F0",
              color: "#555",
              border: "2px solid #ccc",
              boxShadow: "none",
              fontSize: 14,
            }}
            onClick={reset}
          >
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default function CompetitionSection() {
  const q3 = competitionQuestions.filter((q) => q.points === 3);
  const q4 = competitionQuestions.filter((q) => q.points === 4);
  const q5 = competitionQuestions.filter((q) => q.points === 5);

  const groups = [
    {
      label: "3-Point Questions",
      emoji: "🟥",
      desc: "Warm-up — take your time!",
      color: "#FF6B6B",
      questions: q3,
      offset: 0,
    },
    {
      label: "4-Point Questions",
      emoji: "🟧",
      desc: "Medium challenge",
      color: "#FF8E00",
      questions: q4,
      offset: q3.length,
    },
    {
      label: "5-Point Questions",
      emoji: "🟪",
      desc: "Super challenge!",
      color: "#9B59B6",
      questions: q5,
      offset: q3.length + q4.length,
    },
  ];

  return (
    <section id="competition">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          style={{
            background: "#2D3436",
            border: "4px solid #2D3436",
            borderRadius: 16,
            padding: "10px 24px",
            boxShadow: "5px 5px 0px #FF6B6B",
          }}
        >
          <h2
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: 30,
              color: "white",
            }}
          >
            🦘 Competition Practice
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
          Click an option to answer!
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {groups.map((group) => (
          <div key={group.label}>
            {/* Group header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                style={{
                  background: group.color,
                  color: "white",
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 20,
                  padding: "8px 20px",
                  borderRadius: 12,
                  border: "3px solid #2D3436",
                  boxShadow: "4px 4px 0px #2D3436",
                }}
              >
                {group.label}
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#555" }}>
                — {group.desc}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 24,
              }}
            >
              {group.questions.map((q, i) => (
                <QuestionCard key={q.id} q={q} index={group.offset + i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
