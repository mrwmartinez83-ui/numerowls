import { useState } from "react";
import { Lesson, ShapePuzzle } from "@/lib/lessonData";

function buildRow(emoji1: string, emoji2: string, e1: number, e2: number, total: number) {
  const parts: string[] = [];
  for (let i = 0; i < e1; i++) parts.push(emoji1);
  for (let i = 0; i < e2; i++) parts.push(emoji2);
  return (
    <div className="km-equation">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {parts.map((p, idx) => (
          <span key={idx} style={{ fontSize: 36 }}>
            {p}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 22, fontWeight: 700, color: "#555", margin: "0 4px" }}>=</span>
      <span className="km-total-badge">{total}</span>
    </div>
  );
}

function PuzzleCard({ puzzle }: { puzzle: ShapePuzzle }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="km-card"
      style={{
        padding: "24px",
        borderColor: revealed ? "#28a745" : "#2D3436",
        boxShadow: revealed ? "6px 6px 0px #28a745" : "6px 6px 0px #2D3436",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Equations */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {buildRow(puzzle.emoji1, puzzle.emoji2, puzzle.row1.e1, puzzle.row1.e2, puzzle.row1.total)}
        {buildRow(puzzle.emoji1, puzzle.emoji2, puzzle.row2.e1, puzzle.row2.e2, puzzle.row2.total)}
      </div>

      {/* Question */}
      <div
        style={{
          background: "#F0F0F0",
          borderRadius: 12,
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 12,
          border: "2px dashed #4ECDC4",
        }}
      >
        {[
          { emoji: puzzle.emoji1, label: puzzle.label1 },
          { emoji: puzzle.emoji2, label: puzzle.label2 },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>{item.emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#555" }}>{item.label} = ?</div>
          </div>
        ))}
      </div>

      {/* Reveal */}
      {!revealed ? (
        <button className="km-btn km-btn-teal" onClick={() => setRevealed(true)}>
          👀 Show Answer
        </button>
      ) : (
        <div className="animate-slide-up">
          <div
            style={{
              background: "#d4edda",
              border: "3px solid #28a745",
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 20,
                justifyContent: "center",
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#155724" }}
              >
                {puzzle.emoji1} = {puzzle.answer1}
              </span>
              <span
                style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#155724" }}
              >
                {puzzle.emoji2} = {puzzle.answer2}
              </span>
            </div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#155724",
                lineHeight: 1.5,
                borderTop: "2px dashed #28a745",
                paddingTop: 8,
              }}
            >
              💡 {puzzle.explanation}
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
            onClick={() => setRevealed(false)}
          >
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShapePuzzlesSection({ lesson }: { lesson: Lesson }) {
  const setA = lesson.shapePuzzles.filter((p) => p.difficulty === "A");
  const setB = lesson.shapePuzzles.filter((p) => p.difficulty === "B");

  return (
    <section id="puzzles">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          style={{
            background: "#4ECDC4",
            border: "4px solid #2D3436",
            borderRadius: 16,
            padding: "10px 24px",
            boxShadow: "5px 5px 0px #2D3436",
          }}
        >
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "white" }}>
            🔢 Shape Value Puzzles
          </h2>
        </div>
      </div>

      {/* How it works */}
      <div
        className="km-card"
        style={{
          padding: "24px 28px",
          marginBottom: 32,
          background: "linear-gradient(135deg, #fff 50%, #e8fffe 100%)",
        }}
      >
        <h3
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 22,
            color: "#4ECDC4",
            marginBottom: 12,
          }}
        >
          How to think about it:
        </h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}
        >
          {[
            { icon: "🔍", text: "Look at what's the same and what's different between the two rows." },
            { icon: "➖", text: "If one row has one more shape, subtract the totals to find that shape's value." },
            { icon: "✅", text: "Then use that value to find the other shape!" },
          ].map((tip, i) => (
            <div
              key={i}
              style={{
                background: "#FDFBF7",
                border: "3px solid #4ECDC4",
                borderRadius: 14,
                padding: "14px 18px",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{tip.icon}</span>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#2D3436", lineHeight: 1.5 }}>
                {tip.text}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 20,
            background: "#FFF9C4",
            border: "3px solid #2D3436",
            borderRadius: 14,
            padding: "16px 20px",
          }}
        >
          <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "#FF6B6B", marginBottom: 8 }}>
            📖 Worked Example:
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              🌟 + 🌟 + 🔷 = 11<br />
              🌟 + 🌟 + 🌟 = 12
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#2D3436", lineHeight: 1.7, maxWidth: 400 }}>
              Row 2 has one extra 🌟 and is 1 more than Row 1. So{" "}
              <strong style={{ color: "#FF6B6B" }}>🌟 = 1</strong>.<br />
              Then 1 + 1 + 🔷 = 11, so{" "}
              <strong style={{ color: "#FF6B6B" }}>🔷 = 9</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* Set A */}
      <div style={{ marginBottom: 40 }}>
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
            Set A
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#555" }}>— Straightforward puzzles</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {setA.map((p) => (
            <PuzzleCard key={p.id} puzzle={p} />
          ))}
        </div>
      </div>

      {/* Set B */}
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
            Set B
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#555" }}>— Trickier puzzles! 🧠</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {setB.map((p) => (
            <PuzzleCard key={p.id} puzzle={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
