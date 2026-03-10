import { useState } from "react";

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
  return rows.reverse(); // top first
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
  const [phase, setPhase] = useState<"setup" | "playing">("setup");
  const [won, setWon] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const newGame = () => {
    const r = generatePyramid(size);
    const rev = makePuzzle(r, difficulty);
    setRows(r); setRevealed(rev); setInputs({});
    setChecked(false); setCorrect({}); setWon(false); setAttempts(0);
    setPhase("playing");
  };

  const checkAnswers = () => {
    if (!rows) return;
    setAttempts(a => a + 1);
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
    if (allRight) setWon(true);
  };

  const cellSize = size === 3 ? 72 : size === 4 ? 64 : 56;

  if (phase === "setup") return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🔺</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Number Pyramids</h2>
        <p style={{ color: T.muted, fontSize: 14 }}>Each block equals the sum of the two below it. Fill in the missing numbers!</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>PYRAMID SIZE</p>
        <div style={{ display: "flex", gap: 8 }}>
          {[3, 4, 5].map(s => (
            <button key={s} onClick={() => setSize(s)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `2px solid ${size === s ? T.gold : T.border}`, background: size === s ? `${T.gold}20` : "transparent", color: size === s ? T.gold : T.muted, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Nunito',sans-serif" }}>{s} rows</button>
          ))}
        </div>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>DIFFICULTY</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([["easy", "🌱", T.green], ["medium", "⭐", T.gold], ["hard", "🔥", T.red]] as const).map(([d, icon, col]) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `2px solid ${difficulty === d ? col : T.border}`, background: difficulty === d ? `${col}20` : "transparent", color: difficulty === d ? col : T.muted, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Nunito',sans-serif" }}>{icon} {d[0].toUpperCase() + d.slice(1)}</button>
          ))}
        </div>
      </div>
      <button onClick={newGame} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", background: T.gold, color: T.bg, border: "none", cursor: "pointer" }}>Build Pyramid 🔺</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ padding: "4px 12px", borderRadius: 99, background: `${T.gold}22`, border: `1px solid ${T.gold}55`, color: T.gold, fontSize: 12, fontWeight: 700 }}>{difficulty}</span>
          <span style={{ padding: "4px 12px", borderRadius: 99, background: `${T.teal}22`, border: `1px solid ${T.teal}55`, color: T.teal, fontSize: 12, fontWeight: 700 }}>{size} rows</span>
        </div>
        <button onClick={() => setPhase("setup")} style={{ padding: "7px 14px", borderRadius: 10, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, border: `1px solid ${T.border}`, cursor: "pointer" }}>New Game</button>
      </div>

      {won && (
        <div style={{ textAlign: "center", background: `${T.green}15`, border: `1.5px solid ${T.green}50`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: T.green }}>Pyramid Complete!</p>
          <p style={{ color: T.muted, fontSize: 13, margin: "4px 0 12px" }}>Solved in {attempts} {attempts === 1 ? "attempt" : "attempts"}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={newGame} style={{ padding: "10px 20px", borderRadius: 12, background: T.green, color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>Next Pyramid →</button>
            <button onClick={onBack} style={{ padding: "10px 20px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>← All Games</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 24 }}>
        {rows?.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 6 }}>
            {row.map((val, ci) => {
              const key = `${ri},${ci}`;
              const isRevealed = revealed.has(key);
              const isCorrect = checked && correct[key] === true;
              const isWrong = checked && correct[key] === false;
              return (
                <div key={ci} style={{ width: cellSize, height: cellSize, borderRadius: 12, background: isRevealed ? T.s2 : isCorrect ? `${T.green}20` : isWrong ? `${T.red}15` : T.s1, border: `2px solid ${isRevealed ? "rgba(255,255,255,0.15)" : isCorrect ? T.green : isWrong ? T.red : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  {isRevealed
                    ? <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: cellSize * 0.32, color: T.gold }}>{val}</span>
                    : <input type="number" value={inputs[key] || ""} onChange={e => { setInputs(p => ({ ...p, [key]: e.target.value })); setChecked(false); setCorrect({}); }} style={{ width: "100%", height: "100%", background: "transparent", border: "none", color: isCorrect ? T.green : isWrong ? T.red : T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: cellSize * 0.32, textAlign: "center", outline: "none", padding: 0 }} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ background: `${T.gold}10`, border: `1px solid ${T.gold}30`, borderRadius: 12, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: T.muted }}>
        💡 <strong style={{ color: T.gold }}>Rule:</strong> Each block = the two blocks below it added together
      </div>

      {!won && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={checkAnswers} disabled={Object.keys(inputs).length === 0} style={{ flex: 1, padding: "12px 0", borderRadius: 12, background: Object.keys(inputs).length === 0 ? "rgba(255,255,255,0.08)" : T.teal, color: Object.keys(inputs).length === 0 ? T.muted : T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: Object.keys(inputs).length === 0 ? "not-allowed" : "pointer", opacity: Object.keys(inputs).length === 0 ? 0.5 : 1 }}>✓ Check Answers</button>
          <button onClick={newGame} style={{ padding: "12px 20px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>🔁 Reset</button>
        </div>
      )}
      {checked && !won && <p style={{ textAlign: "center", color: T.red, fontSize: 13, marginTop: 12, fontWeight: 700 }}>✗ Some answers are wrong — keep trying! (Attempt {attempts})</p>}
    </div>
  );
}
