import NavBar from "@/components/NavBar";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { ALL_COMPETITION_QUESTIONS } from "@/lib/competitionBank";
import { QUESTIONS } from "@shared/questionBank";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderText(text: string) {
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  toast.success("Link copied to clipboard!");
}

// ── Competition question view ─────────────────────────────────────────────────

function CompetitionQuestionView({ id }: { id: string }) {
  const q = ALL_COMPETITION_QUESTIONS.find(x => x.id === id);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  if (!q) return null;

  const isCorrect = selected === q.correctLetter;

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      {/* Meta bar */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#F5A623", background: "rgba(245,166,35,0.12)", padding: "4px 10px", borderRadius: "8px" }}>
          Year {q.year}–{q.yearMax}
        </span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#4ECDC4", background: "rgba(78,205,196,0.12)", padding: "4px 10px", borderRadius: "8px" }}>
          {q.points} points
        </span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: "8px" }}>
          {q.style.replace(/-/g, " ")}
        </span>
      </div>

      {/* Question */}
      <div className="no-card" style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "18px", color: "white", lineHeight: 1.6, marginBottom: q.svgDiagram || q.diagram ? "16px" : "0" }}>
          {renderText(q.text)}
        </p>
        {(q.svgDiagram || q.diagram) && (
          <div
            style={{ marginTop: "12px" }}
            dangerouslySetInnerHTML={{ __html: q.svgDiagram || q.diagram || "" }}
          />
        )}
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {q.options.map(opt => {
          let bg = "rgba(255,255,255,0.04)";
          let border = "rgba(255,255,255,0.1)";
          let color = "white";
          if (revealed) {
            if (opt.letter === q.correctLetter) { bg = "rgba(46,204,113,0.15)"; border = "#2ECC71"; color = "#2ECC71"; }
            else if (opt.letter === selected) { bg = "rgba(231,76,60,0.15)"; border = "#E74C3C"; color = "#E74C3C"; }
          } else if (opt.letter === selected) {
            bg = "rgba(245,166,35,0.12)"; border = "#F5A623"; color = "#F5A623";
          }
          return (
            <button
              key={opt.letter}
              onClick={() => !revealed && setSelected(opt.letter)}
              disabled={revealed}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 18px", borderRadius: "12px",
                background: bg, border: `2px solid ${border}`, color,
                textAlign: "left", cursor: revealed ? "default" : "pointer",
                fontSize: "15px", fontWeight: 600, transition: "all 0.15s",
              }}
            >
              <span style={{ fontWeight: 900, fontSize: "16px", minWidth: "24px" }}>{opt.letter}.</span>
              <span>{renderText(opt.text)}</span>
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        {!revealed && selected && (
          <button
            className="no-btn-gold"
            onClick={() => setRevealed(true)}
          >
            Check Answer
          </button>
        )}
        {!revealed && !selected && (
          <button
            style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#B0C4DE", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
            onClick={() => setRevealed(true)}
          >
            Show Answer
          </button>
        )}
      </div>

      {/* Result + explanation */}
      {revealed && (
        <div style={{
          padding: "18px 20px", borderRadius: "14px", marginBottom: "20px",
          background: isCorrect ? "rgba(46,204,113,0.08)" : "rgba(231,76,60,0.08)",
          border: `1px solid ${isCorrect ? "rgba(46,204,113,0.3)" : "rgba(231,76,60,0.3)"}`,
        }}>
          <div style={{ fontWeight: 800, fontSize: "16px", color: isCorrect ? "#2ECC71" : "#E74C3C", marginBottom: "10px" }}>
            {selected ? (isCorrect ? "🎉 Correct!" : `❌ The answer is ${q.correctLetter}`) : `✅ Answer: ${q.correctLetter}`}
          </div>
          <div style={{ fontSize: "14px", color: "#B0C4DE", lineHeight: 1.7 }}>
            {renderText(q.explanation)}
          </div>
        </div>
      )}

      {/* Hint */}
      {!revealed && (
        <details style={{ marginBottom: "20px" }}>
          <summary style={{ cursor: "pointer", color: "#4ECDC4", fontSize: "14px", fontWeight: 600 }}>
            💡 Show hint (no penalty here)
          </summary>
          <div style={{ marginTop: "10px", padding: "14px", borderRadius: "10px", background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.2)", color: "#B0C4DE", fontSize: "14px", lineHeight: 1.6 }}>
            {q.hint}
          </div>
        </details>
      )}
    </div>
  );
}

// ── Practice question view ────────────────────────────────────────────────────

function PracticeQuestionView({ id }: { id: string }) {
  const q = QUESTIONS.find(x => x.id === id);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  if (!q) return null;

  const isCorrect = selected === q.answer;

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#F5A623", background: "rgba(245,166,35,0.12)", padding: "4px 10px", borderRadius: "8px" }}>
          Year {q.year}
        </span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#4ECDC4", background: "rgba(78,205,196,0.12)", padding: "4px 10px", borderRadius: "8px" }}>
          {q.skill}
        </span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: "8px" }}>
          Difficulty {q.difficulty}
        </span>
      </div>

      <div className="no-card" style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "18px", color: "white", lineHeight: 1.6 }}>{renderText(q.text)}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {q.options.map(opt => {
          let bg = "rgba(255,255,255,0.04)";
          let border = "rgba(255,255,255,0.1)";
          let color = "white";
          if (revealed) {
            if (opt === q.answer) { bg = "rgba(46,204,113,0.15)"; border = "#2ECC71"; color = "#2ECC71"; }
            else if (opt === selected) { bg = "rgba(231,76,60,0.15)"; border = "#E74C3C"; color = "#E74C3C"; }
          } else if (opt === selected) {
            bg = "rgba(245,166,35,0.12)"; border = "#F5A623"; color = "#F5A623";
          }
          return (
            <button
              key={opt}
              onClick={() => !revealed && setSelected(opt)}
              disabled={revealed}
              style={{
                padding: "14px 18px", borderRadius: "12px",
                background: bg, border: `2px solid ${border}`, color,
                textAlign: "left", cursor: revealed ? "default" : "pointer",
                fontSize: "15px", fontWeight: 600, transition: "all 0.15s",
              }}
            >
              {renderText(opt)}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        {!revealed && selected && (
          <button className="no-btn-gold" onClick={() => setRevealed(true)}>Check Answer</button>
        )}
        {!revealed && !selected && (
          <button
            style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#B0C4DE", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
            onClick={() => setRevealed(true)}
          >
            Show Answer
          </button>
        )}
      </div>

      {revealed && (
        <div style={{
          padding: "18px 20px", borderRadius: "14px", marginBottom: "20px",
          background: isCorrect ? "rgba(46,204,113,0.08)" : "rgba(231,76,60,0.08)",
          border: `1px solid ${isCorrect ? "rgba(46,204,113,0.3)" : "rgba(231,76,60,0.3)"}`,
        }}>
          <div style={{ fontWeight: 800, fontSize: "16px", color: isCorrect ? "#2ECC71" : "#E74C3C", marginBottom: "10px" }}>
            {selected ? (isCorrect ? "🎉 Correct!" : `❌ The answer is: ${q.answer}`) : `✅ Answer: ${q.answer}`}
          </div>
          {q.explanation && (
            <div style={{ fontSize: "14px", color: "#B0C4DE", lineHeight: 1.7 }}>
              {renderText(q.explanation)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function QuestionPermalink() {
  const { id } = useParams<{ id: string }>();

  const compQ = ALL_COMPETITION_QUESTIONS.find(x => x.id === id);
  const practiceQ = QUESTIONS.find(x => x.id === id);
  const found = compQ || practiceQ;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px", fontSize: "13px", color: "#B0C4DE" }}>
          <Link href="/" style={{ color: "#B0C4DE", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          {compQ ? (
            <Link href="/competition" style={{ color: "#B0C4DE", textDecoration: "none" }}>Competition Mode</Link>
          ) : (
            <Link href="/practice" style={{ color: "#B0C4DE", textDecoration: "none" }}>Practice</Link>
          )}
          <span>›</span>
          <span style={{ color: "white" }}>Question {id}</span>
        </div>

        {!found ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔍</div>
            <h2 style={{ color: "white", fontWeight: 800, fontSize: "22px", marginBottom: "10px" }}>Question not found</h2>
            <p style={{ color: "#B0C4DE", marginBottom: "24px" }}>The question ID <code style={{ color: "#F5A623" }}>{id}</code> doesn't exist in the question bank.</p>
            <Link href="/competition">
              <button className="no-btn-gold">Browse Competition Questions →</button>
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "22px", color: "white", margin: 0 }}>
                {compQ ? "🦘 Competition Question" : "📚 Practice Question"}
              </h1>
              <button
                onClick={copyLink}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#B0C4DE", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
              >
                🔗 Copy link
              </button>
            </div>

            {compQ ? <CompetitionQuestionView id={id!} /> : <PracticeQuestionView id={id!} />}

            {/* Try more */}
            <div style={{ marginTop: "40px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
              <p style={{ color: "#B0C4DE", marginBottom: "14px" }}>Want to practise more questions like this?</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                {compQ && (
                  <Link href="/competition">
                    <button className="no-btn-gold">Competition Mode →</button>
                  </Link>
                )}
                <Link href="/practice">
                  <button style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 700 }}>
                    Skill Practice →
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
