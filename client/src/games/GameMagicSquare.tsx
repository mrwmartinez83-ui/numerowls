import { useState } from "react";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  pink: "#E91E8C", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

// Pre-built magic squares (3x3 and 4x4)
const MAGIC_3x3 = [
  { grid: [2,7,6,9,5,1,4,3,8], magic: 15, label: "Classic" },
  { grid: [4,9,2,3,5,7,8,1,6], magic: 15, label: "Rotated" },
  { grid: [6,1,8,7,5,3,2,9,4], magic: 15, label: "Mirror" },
  { grid: [8,1,6,3,5,7,4,9,2], magic: 15, label: "Variant" },
];
const MAGIC_4x4 = [
  { grid: [16,2,3,13,5,11,10,8,9,7,6,12,4,14,15,1], magic: 34, label: "Dürer" },
  { grid: [1,15,14,4,12,6,7,9,8,10,11,5,13,3,2,16], magic: 34, label: "Classic 4×4" },
];

function makePuzzle(grid: number[], hideCount: number): (number | null)[] {
  const indices = Array.from({ length: grid.length }, (_, i) => i);
  const toHide = [...indices].sort(() => Math.random() - 0.5).slice(0, hideCount);
  return grid.map((v, i) => toHide.includes(i) ? null : v);
}

interface Props { onBack: () => void; }

export default function GameMagicSquare({ onBack }: Props) {
  const [size, setSize] = useState<3 | 4>(3);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [puzzle, setPuzzle] = useState<(number | null)[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [magic, setMagic] = useState(15);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<Record<number, boolean>>({});
  const [won, setWon] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const startGame = () => {
    const pool = size === 3 ? MAGIC_3x3 : MAGIC_4x4;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const hideCount = size === 3
      ? (difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 7)
      : (difficulty === "easy" ? 5 : difficulty === "medium" ? 9 : 13);
    const p = makePuzzle(chosen.grid, hideCount);
    setPuzzle(p); setSolution(chosen.grid); setMagic(chosen.magic);
    setInputs({}); setChecked(false); setCorrect({}); setWon(false); setAttempts(0);
    setPhase("playing");
  };

  const checkAnswers = () => {
    setAttempts(a => a + 1);
    const res: Record<number, boolean> = {};
    let allRight = true;
    puzzle.forEach((cell, i) => {
      if (cell === null) {
        const given = parseInt(inputs[i] || "");
        res[i] = given === solution[i];
        if (given !== solution[i]) allRight = false;
      }
    });
    setCorrect(res); setChecked(true);
    if (allRight) setWon(true);
  };

  const cellSz = size === 3 ? 72 : 58;

  if (phase === "setup") return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>✨</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Magic Square</h2>
        <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>Fill the grid so every row, column and diagonal adds to the magic number!</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>GRID SIZE</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([3, 4] as const).map(s => (
            <button key={s} onClick={() => setSize(s)} style={{
              flex: 1, padding: "12px 0", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${size === s ? T.pink : T.border}`,
              background: size === s ? `${T.pink}22` : "transparent",
              color: size === s ? T.pink : T.muted, fontWeight: 800,
              fontFamily: "'Nunito',sans-serif", fontSize: 16,
            }}>{s}×{s}</button>
          ))}
        </div>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>DIFFICULTY</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([["easy", "🌱", T.green], ["medium", "⭐", T.gold], ["hard", "🔥", T.red]] as const).map(([d, icon, col]) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${difficulty === d ? col : T.border}`,
              background: difficulty === d ? `${col}22` : "transparent",
              color: difficulty === d ? col : T.muted, fontWeight: 800,
              fontFamily: "'Nunito',sans-serif", fontSize: 13,
            }}>{icon} {d[0].toUpperCase() + d.slice(1)}</button>
          ))}
        </div>
      </div>
      <button onClick={startGame} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", background: T.pink, color: T.white, border: "none", cursor: "pointer" }}>✨ Generate Square!</button>
    </div>
  );

  if (phase === "result") return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 12 }}>🏆</div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: T.white, marginBottom: 4 }}>Magic Complete!</h2>
      <p style={{ color: T.muted, marginBottom: 8 }}>Every row, column & diagonal adds to <strong style={{ color: T.pink }}>{magic}</strong></p>
      <p style={{ color: T.teal, fontSize: 14, marginBottom: 24 }}>Solved in {attempts} {attempts === 1 ? "attempt" : "attempts"}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={startGame} style={{ padding: "11px 24px", borderRadius: 12, background: T.pink, color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>🔁 New Square</button>
        <button onClick={onBack} style={{ padding: "11px 24px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>← All Games</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 99, background: `${T.pink}22`, border: `1px solid ${T.pink}55`, color: T.pink, fontSize: 12, fontWeight: 700 }}>Magic = {magic}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 99, background: `${T.muted}22`, border: `1px solid ${T.muted}55`, color: T.muted, fontSize: 12, fontWeight: 700 }}>Attempts: {attempts}</span>
      </div>

      {won && (
        <div style={{ textAlign: "center", background: `${T.green}15`, border: `1.5px solid ${T.green}50`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: T.green }}>Magic Square Complete!</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            <button onClick={startGame} style={{ padding: "10px 20px", borderRadius: 12, background: T.green, color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>Next Square →</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 20 }}>
        {Array.from({ length: size }, (_, row) => (
          <div key={row} style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: size }, (_, col) => {
              const i = row * size + col;
              const cell = puzzle[i];
              const isHidden = cell === null;
              const isCorrect = checked && correct[i] === true;
              const isWrong = checked && correct[i] === false;
              return (
                <div key={col} style={{
                  width: cellSz, height: cellSz, borderRadius: 12,
                  background: !isHidden ? T.s2 : isCorrect ? `${T.green}20` : isWrong ? `${T.red}15` : T.s1,
                  border: `2px solid ${!isHidden ? "rgba(255,255,255,0.15)" : isCorrect ? T.green : isWrong ? T.red : T.pink}`,
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                }}>
                  {!isHidden
                    ? <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: cellSz * 0.32, color: T.gold }}>{cell}</span>
                    : <input type="number" value={inputs[i] || ""} onChange={e => { setInputs(p => ({ ...p, [i]: e.target.value })); setChecked(false); setCorrect({}); }}
                        style={{ width: "100%", height: "100%", background: "transparent", border: "none", color: isCorrect ? T.green : isWrong ? T.red : T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: cellSz * 0.32, textAlign: "center", outline: "none", padding: 0 }} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ background: `${T.pink}10`, border: `1px solid ${T.pink}30`, borderRadius: 12, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: T.muted }}>
        💡 Every row, column and diagonal must add to <strong style={{ color: T.pink }}>{magic}</strong>
      </div>

      {!won && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={checkAnswers} disabled={Object.keys(inputs).length === 0} style={{ flex: 1, padding: "12px 0", borderRadius: 12, background: Object.keys(inputs).length === 0 ? "rgba(255,255,255,0.08)" : T.pink, color: Object.keys(inputs).length === 0 ? T.muted : T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: Object.keys(inputs).length === 0 ? "not-allowed" : "pointer", opacity: Object.keys(inputs).length === 0 ? 0.5 : 1 }}>✓ Check</button>
          <button onClick={startGame} style={{ padding: "12px 20px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>🔁 New</button>
        </div>
      )}
      {checked && !won && <p style={{ textAlign: "center", color: T.red, fontSize: 13, marginTop: 12, fontWeight: 700 }}>✗ Some cells are wrong — keep trying! (Attempt {attempts})</p>}
    </div>
  );
}
