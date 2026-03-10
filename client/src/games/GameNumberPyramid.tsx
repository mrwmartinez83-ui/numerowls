import { useState } from "react";
import confetti from "canvas-confetti";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

function generatePyramid(size: number): number[][] {
  const bottom = Array.from({ length: size }, () => Math.floor(Math.random() * 9) + 1);
  const rows: number[][] = [bottom];
  for (let r = 1; r < size; r++) {
    const prev = rows[r - 1];
    rows.push(prev.slice(0, prev.length - 1).map((v, i) => v + prev[i + 1]));
  }
  return rows.reverse();
}

function makePuzzle(rows: number[][], difficulty: string): Set<string> {
  const flat: { ri: number; ci: number }[] = [];
  rows.forEach((row, ri) => row.forEach((_, ci) => flat.push({ ri, ci })));
  const revealed = new Set(flat.map(c => `${c.ri},${c.ci}`));
  const hideCount = difficulty === "easy" ? Math.floor(flat.length * 0.3) :
    difficulty === "medium" ? Math.floor(flat.length * 0.5) : Math.floor(flat.length * 0.65);
  const shuffled = [...flat].sort(() => Math.random() - 0.5);
  for (let i = 0; i < hideCount; i++) revealed.delete(`${shuffled[i].ri},${shuffled[i].ci}`);
  return revealed;
}

interface Props { onBack: () => void; }

export default function GameNumberPyramid({ onBack }: Props) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [size, setSize] = useState(4);
  const [rows, setRows] = useState<number[][] | null>(null);
  const [revealed, setRevealed] = useState(new Set<string>());
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [won, setWon] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [wonAt, setWonAt] = useState(0);

  const newGame = () => {
    const r = generatePyramid(size);
    const rev = makePuzzle(r, difficulty);
    setRows(r); setRevealed(rev); setInputs({});
    setChecked(false); setCorrect({}); setWon(false); setAttempts(0); setWonAt(0);
    setPhase("playing");
  };

  const checkAnswers = () => {
    if (!rows) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const result: Record<string, boolean> = {};
    let allRight = true;
    rows.forEach((row, ri) => {
      row.forEach((val, ci) => {
        const key = `${ri},${ci}`;
        if (!revealed.has(key)) {
          const given = parseInt(inputs[key] || "");
          result[key] = given === val;
          if (given !== val) allRight = false;
        }
      });
    });
    setCorrect(result); setChecked(true);
    if (allRight) {
      setWon(true);
      setWonAt(newAttempts);
      confetti({ particleCount: 140, spread: 110, origin: { y: 0.4 }, colors: ["#F5A623", "#4ECDC4", "#fff", "#2ECC71"] });
      setTimeout(() => setPhase("result"), 1800);
    }
  };

  const cellSize = size === 3 ? 84 : size === 4 ? 72 : 60;

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(245,166,35,0.7))" }}>🔺</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Number Pyramids</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Each block equals the sum of the two below it.<br />Fill in all the missing numbers!</p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>PYRAMID SIZE</div>
        <div style={{ display: "flex", gap: 10 }}>
          {([["3 rows", 3, "6 blocks"], ["4 rows", 4, "10 blocks"], ["5 rows", 5, "15 blocks"]] as const).map(([label, s, sub]) => (
            <button key={s} onClick={() => setSize(s)} style={{
              flex: 1, padding: "14px 8px", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${size === s ? T.gold : T.border}`,
              background: size === s ? `${T.gold}22` : "transparent",
              color: size === s ? T.gold : T.muted,
              fontWeight: 900, fontFamily: "'Nunito',sans-serif", fontSize: 14,
              lineHeight: 1.6, transition: "all 0.15s",
              boxShadow: size === s ? `0 4px 16px ${T.gold}33` : "none",
            }}>{label}<br /><span style={{ fontSize: 11, opacity: 0.7 }}>{sub}</span></button>
          ))}
        </div>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>DIFFICULTY</div>
        <div style={{ display: "flex", gap: 10 }}>
          {([["easy", "🌱", T.green, "30% hidden"], ["medium", "⭐", T.gold, "50% hidden"], ["hard", "🔥", T.red, "65% hidden"]] as const).map(([d, icon, col, desc]) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              flex: 1, padding: "14px 8px", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${difficulty === d ? col : T.border}`,
              background: difficulty === d ? `${col}22` : "transparent",
              color: difficulty === d ? col : T.muted,
              fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 13,
              lineHeight: 1.6, transition: "all 0.15s",
              boxShadow: difficulty === d ? `0 4px 16px ${col}33` : "none",
            }}>{icon} {d[0].toUpperCase() + d.slice(1)}<br /><span style={{ fontSize: 11, opacity: 0.7 }}>{desc}</span></button>
          ))}
        </div>
      </div>

      <button onClick={newGame} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.gold}, #c07a10)`,
        color: T.bg, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.gold}55`,
        transition: "transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >🔺 Build Pyramid!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 14, filter: "drop-shadow(0 0 28px rgba(245,166,35,0.6))" }}>🏆</div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 34, color: T.white, margin: "0 0 8px" }}>Pyramid Complete!</h2>
      <p style={{ color: T.muted, marginBottom: 12, fontSize: 15 }}>
        Solved in {wonAt} {wonAt === 1 ? "attempt" : "attempts"} 🎉
      </p>
      <p style={{ color: T.teal, fontSize: 13, marginBottom: 32 }}>
        💡 Each block = the sum of the two blocks below it
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={newGame} style={{
          padding: "14px 32px", borderRadius: 14,
          background: `linear-gradient(135deg, ${T.gold}, #c07a10)`,
          color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer",
          boxShadow: `0 6px 20px ${T.gold}55`,
        }}>🔺 New Pyramid</button>
        <button onClick={onBack} style={{
          padding: "14px 32px", borderRadius: 14, background: T.s2,
          color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16,
          border: `1px solid ${T.border}`, cursor: "pointer",
        }}>← All Games</button>
      </div>
    </div>
  );

  // ── Playing ──
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ padding: "8px 14px", borderRadius: 99, background: `${T.gold}22`, border: `1px solid ${T.gold}55`, color: T.gold, fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}>{difficulty}</span>
          <span style={{ padding: "8px 14px", borderRadius: 99, background: `${T.teal}22`, border: `1px solid ${T.teal}55`, color: T.teal, fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}>{size} rows</span>
        </div>
        <span style={{ padding: "8px 14px", borderRadius: 99, background: "rgba(255,255,255,0.07)", border: `1px solid ${T.border}`, color: T.muted, fontSize: 13, fontWeight: 700 }}>Attempt {attempts}</span>
      </div>

      {/* Win banner */}
      {won && (
        <div style={{
          textAlign: "center", background: `${T.green}18`,
          border: `2px solid ${T.green}55`, borderRadius: 20, padding: "20px 16px", marginBottom: 20,
          boxShadow: `0 0 40px ${T.green}33`,
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: T.green, margin: 0 }}>Pyramid Complete!</p>
          <p style={{ color: T.muted, fontSize: 13, margin: "6px 0 0" }}>Solved in {wonAt} {wonAt === 1 ? "attempt" : "attempts"}</p>
        </div>
      )}

      {/* Pyramid grid */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 24 }}>
        {rows?.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 6 }}>
            {row.map((val, ci) => {
              const key = `${ri},${ci}`;
              const isRevealed = revealed.has(key);
              const isCorrect = checked && correct[key] === true;
              const isWrong = checked && correct[key] === false;
              return (
                <div key={ci} style={{
                  width: cellSize, height: cellSize, borderRadius: 14,
                  background: isRevealed ? T.s2 : isCorrect ? `${T.green}22` : isWrong ? `${T.red}18` : T.s1,
                  border: `2.5px solid ${isRevealed ? "rgba(255,255,255,0.18)" : isCorrect ? T.green : isWrong ? T.red : T.gold}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.25s",
                  boxShadow: isCorrect ? `0 0 16px ${T.green}55` : isWrong ? `0 0 16px ${T.red}33` : "none",
                  transform: isCorrect ? "scale(1.05)" : "scale(1)",
                }}>
                  {isRevealed
                    ? <span style={{
                        fontFamily: "'Nunito',sans-serif", fontWeight: 900,
                        fontSize: cellSize * 0.33, color: T.gold,
                        textShadow: `0 0 10px ${T.gold}55`,
                      }}>{val}</span>
                    : <input
                        type="number"
                        value={inputs[key] || ""}
                        onChange={e => {
                          setInputs(p => ({ ...p, [key]: e.target.value }));
                          setChecked(false); setCorrect({});
                        }}
                        style={{
                          width: "100%", height: "100%",
                          background: "transparent", border: "none",
                          color: isCorrect ? T.green : isWrong ? T.red : T.white,
                          fontFamily: "'Nunito',sans-serif", fontWeight: 900,
                          fontSize: cellSize * 0.33, textAlign: "center",
                          outline: "none", padding: 0,
                        }}
                      />}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hint */}
      <div style={{
        background: `${T.gold}10`, border: `1px solid ${T.gold}30`,
        borderRadius: 14, padding: "12px 18px", marginBottom: 20,
        fontSize: 13, color: T.muted, textAlign: "center",
      }}>
        💡 <strong style={{ color: T.gold }}>Rule:</strong> Each block = the two blocks below it added together
      </div>

      {!won && (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={checkAnswers} disabled={Object.keys(inputs).length === 0} style={{
            flex: 1, padding: "14px 0", borderRadius: 14,
            background: Object.keys(inputs).length === 0 ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg, ${T.teal}, #1a8a7a)`,
            color: Object.keys(inputs).length === 0 ? T.muted : T.bg,
            fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, border: "none",
            cursor: Object.keys(inputs).length === 0 ? "not-allowed" : "pointer",
            opacity: Object.keys(inputs).length === 0 ? 0.5 : 1,
            boxShadow: Object.keys(inputs).length > 0 ? `0 4px 16px ${T.teal}44` : "none",
          }}>✓ Check Answers</button>
          <button onClick={newGame} style={{
            padding: "14px 22px", borderRadius: 14, background: T.s2,
            color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15,
            border: `1px solid ${T.border}`, cursor: "pointer",
          }}>🔁 Reset</button>
        </div>
      )}
      {checked && !won && (
        <p style={{ textAlign: "center", color: T.red, fontSize: 13, marginTop: 14, fontWeight: 700 }}>
          ✗ Some answers are wrong — keep trying! (Attempt {attempts})
        </p>
      )}
    </div>
  );
}
