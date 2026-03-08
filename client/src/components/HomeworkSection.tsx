import { useState } from "react";
import { homeworkItems, HomeworkItem } from "@/lib/lessonData";

function buildRow(emoji1: string, emoji2: string, e1: number, e2: number, total: number) {
  const parts: string[] = [];
  for (let i = 0; i < e1; i++) parts.push(emoji1);
  for (let i = 0; i < e2; i++) parts.push(emoji2);
  return (
    <div className="km-equation" style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {parts.map((p, i) => (
          <span key={i} style={{ fontSize: 32 }}>{p}</span>
        ))}
      </div>
      <span style={{ fontSize: 20, fontWeight: 700, color: "#555", margin: "0 4px" }}>=</span>
      <span className="km-total-badge">{total}</span>
    </div>
  );
}

function HomeworkCard({ item, index }: { item: HomeworkItem; index: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const isChallenge = item.type === "challenge";
  const isPuzzle = item.type === "puzzle";
  const isMcq = item.type === "mcq";

  const handleSelect = (letter: string) => {
    if (selected !== null) return;
    setSelected(letter);
    setShowAnswer(true);
  };

  const isCorrect = selected === item.correctLetter;

  const reset = () => {
    setSelected(null);
    setShowAnswer(false);
  };

  return (
    <div
      className="km-card"
      style={{
        padding: "24px",
        borderColor: isChallenge ? "#9B59B6" : showAnswer ? (isCorrect ? "#28a745" : "#dc3545") : "#2D3436",
        boxShadow: isChallenge
          ? "6px 6px 0px #9B59B6"
          : showAnswer
          ? `6px 6px 0px ${isCorrect ? "#28a745" : "#dc3545"}`
          : "6px 6px 0px #2D3436",
        transition: "all 0.3s ease",
        background: isChallenge ? "linear-gradient(135deg, #fff 60%, #f3e5f5 100%)" : "white",
      }}
    >
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4" style={{ flexWrap: "wrap" }}>
        <div
          style={{
            background: isChallenge ? "#9B59B6" : "#4ECDC4",
            color: "white",
            fontFamily: "'Fredoka One', cursive",
            fontSize: 16,
            padding: "4px 14px",
            borderRadius: 8,
            border: "2px solid #2D3436",
          }}
        >
          H{index + 1}
        </div>
        {isChallenge && (
          <div
            style={{
              background: "#FFF9C4",
              border: "2px solid #9B59B6",
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: 14,
              fontWeight: 700,
              color: "#9B59B6",
            }}
          >
            ⭐ Super Star Challenge
          </div>
        )}
      </div>

      {/* Question text */}
      <p style={{ fontSize: 17, fontWeight: 700, color: "#2D3436", lineHeight: 1.6, marginBottom: 16 }}>
        {item.text}
      </p>

      {/* Puzzle equations */}
      {isPuzzle && item.emoji1 && item.emoji2 && item.row1 && item.row2 && (
        <div style={{ marginBottom: 16 }}>
          {buildRow(item.emoji1, item.emoji2, item.row1.e1, item.row1.e2, item.row1.total)}
          {buildRow(item.emoji1, item.emoji2, item.row2.e1, item.row2.e2, item.row2.total)}
          <div
            style={{
              background: "#F0F0F0",
              borderRadius: 10,
              padding: "10px 14px",
              display: "flex",
              justifyContent: "space-around",
              border: "2px dashed #4ECDC4",
              marginTop: 8,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              {item.emoji1} {item.label1} = ?
            </span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              {item.emoji2} {item.label2} = ?
            </span>
          </div>
        </div>
      )}

      {/* Triangle visual for challenge */}
      {isChallenge && (
        <div
          style={{
            textAlign: "center",
            marginBottom: 16,
            padding: "16px",
            background: "#f3e5f5",
            borderRadius: 14,
            border: "2px dashed #9B59B6",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: "#555", marginBottom: 8 }}>
            Place 1, 2, 3, 4, 5, 6 in the circles so each side sums to the same number:
          </div>
          <div style={{ display: "inline-block", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>◯</div>
            <div style={{ fontSize: 32, marginBottom: 4, letterSpacing: 12 }}>◯ ◯</div>
            <div style={{ fontSize: 32, letterSpacing: 12 }}>◯ ◯ ◯</div>
          </div>
        </div>
      )}

      {/* MCQ options */}
      {item.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {item.options.map((opt) => {
            let extraStyle: React.CSSProperties = {};
            if (showAnswer) {
              if (opt.letter === item.correctLetter) {
                extraStyle = { background: "#d4edda", borderColor: "#28a745", boxShadow: "3px 3px 0px #28a745" };
              } else if (opt.letter === selected) {
                extraStyle = { background: "#f8d7da", borderColor: "#dc3545", boxShadow: "3px 3px 0px #dc3545" };
              }
            }
            return (
              <button
                key={opt.letter}
                className="km-option"
                style={{ ...extraStyle, cursor: showAnswer ? "default" : "pointer", textAlign: "left" }}
                onClick={() => handleSelect(opt.letter)}
              >
                <span className="km-option-letter">({opt.letter})</span>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{opt.text}</span>
                {showAnswer && opt.letter === item.correctLetter && (
                  <span style={{ marginLeft: "auto", fontSize: 18 }}>✅</span>
                )}
                {showAnswer && opt.letter === selected && opt.letter !== item.correctLetter && (
                  <span style={{ marginLeft: "auto", fontSize: 18 }}>❌</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Puzzle reveal button */}
      {isPuzzle && !showAnswer && (
        <button className="km-btn km-btn-teal" onClick={() => setShowAnswer(true)}>
          👀 Show Answer
        </button>
      )}

      {/* Answer / explanation */}
      {showAnswer && (
        <div className="animate-slide-up">
          <div
            style={{
              background: isPuzzle || (isMcq && isCorrect) || (isChallenge && isCorrect) ? "#d4edda" : !isMcq ? "#d4edda" : "#fff3cd",
              border: `3px solid ${isMcq && selected && !isCorrect ? "#ffc107" : "#28a745"}`,
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 10,
            }}
          >
            {isPuzzle && item.emoji1 && item.emoji2 && (
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 22,
                  color: "#155724",
                  marginBottom: 6,
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <span>{item.emoji1} = {item.answer1}</span>
                <span>{item.emoji2} = {item.answer2}</span>
              </div>
            )}
            {isMcq && selected && (
              <p
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 18,
                  color: isCorrect ? "#155724" : "#856404",
                  marginBottom: 6,
                }}
              >
                {isCorrect ? "🎉 Correct!" : `😅 Not quite — the answer is (${item.correctLetter})`}
              </p>
            )}
            {isChallenge && (
              <p
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 18,
                  color: isCorrect ? "#155724" : "#856404",
                  marginBottom: 6,
                }}
              >
                {selected
                  ? isCorrect
                    ? "🎉 Brilliant!"
                    : `😅 Not quite — the answer is (${item.correctLetter})`
                  : `✅ Answer: (${item.correctLetter})`}
              </p>
            )}
            <p style={{ fontSize: 15, fontWeight: 600, color: "#155724", lineHeight: 1.6 }}>
              💡 {item.explanation}
            </p>
          </div>
          <button
            className="km-btn"
            style={{ background: "#F0F0F0", color: "#555", border: "2px solid #ccc", boxShadow: "none", fontSize: 14 }}
            onClick={reset}
          >
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomeworkSection() {
  const puzzles = homeworkItems.filter((h) => h.type === "puzzle");
  const mcqs = homeworkItems.filter((h) => h.type === "mcq");
  const challenge = homeworkItems.filter((h) => h.type === "challenge");

  return (
    <section id="homework">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          style={{
            background: "#FF6B6B",
            border: "4px solid #2D3436",
            borderRadius: 16,
            padding: "10px 24px",
            boxShadow: "5px 5px 0px #4ECDC4",
          }}
        >
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "white" }}>
            🏠 Homework
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
          Complete at home — good luck! 🍀
        </div>
      </div>

      {/* Section 1 — Shape Puzzles */}
      <div style={{ marginBottom: 36 }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              background: "#4ECDC4",
              color: "white",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 18,
              padding: "6px 18px",
              borderRadius: 10,
              border: "3px solid #2D3436",
            }}
          >
            Section 1 — Shape Puzzles
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {puzzles.map((item, i) => (
            <HomeworkCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Section 2 — Competition Questions */}
      <div style={{ marginBottom: 36 }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              background: "#FF6B6B",
              color: "white",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 18,
              padding: "6px 18px",
              borderRadius: 10,
              border: "3px solid #2D3436",
            }}
          >
            Section 2 — Competition Questions
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {mcqs.map((item, i) => (
            <HomeworkCard key={item.id} item={item} index={puzzles.length + i} />
          ))}
        </div>
      </div>

      {/* Section 3 — Challenge */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              background: "#9B59B6",
              color: "white",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 18,
              padding: "6px 18px",
              borderRadius: 10,
              border: "3px solid #2D3436",
            }}
          >
            Section 3 — Super Star Challenge ⭐
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {challenge.map((item, i) => (
            <HomeworkCard key={item.id} item={item} index={puzzles.length + mcqs.length + i} />
          ))}
        </div>
      </div>
    </section>
  );
}
