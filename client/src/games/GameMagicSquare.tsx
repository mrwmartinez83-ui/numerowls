import { useState } from "react";
import confetti from "canvas-confetti";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  pink: "#E91E8C", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

const MAGIC_3x3 = [
  { grid: [2,7,6,9,5,1,4,3,8], magic: 15 },
  { grid: [4,9,2,3,5,7,8,1,6], magic: 15 },
  { grid: [6,1,8,7,5,3,2,9,4], magic: 15 },
  { grid: [8,1,6,3,5,7,4,9,2], magic: 15 },
];
const MAGIC_4x4 = [
  { grid: [16,2,3,13,5,11,10,8,9,7,6,12,4,14,15,1], magic: 34 },
  { grid: [1,15,14,4,12,6,7,9,8,10,11,5,13,3,2,16], magic: 34 },
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
  const [wonAt, setWonAt] = useState(0);

  const startGame = () => {
    const pool = size === 3 ? MAGIC_3x3 : MAGIC_4x4;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const hideCount = size === 3
      ? (difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 7)
      : (difficulty === "easy" ? 5 : difficulty === "medium" ? 9 : 13);
    const p = makePuzzle(chosen.grid, hideCount);
    setPuzzle(p); setSolution(chosen.grid); setMagic(chosen.magic);
    setInputs({}); setChecked(false); setCorrect({}); setWon(false); setAttempts(0); setWonAt(0);
    setPhase("playing");
  };

  const checkAnswers = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
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
    if (allRight) {
      setWon(true);
      setWonAt(newAttempts);
      confetti({ particleCount: 150, spread: 120, origin: { y: 0.4 }, colors: ["#E91E8C", "#F5A623", "#fff", "#4ECDC4"] });
      setTimeout(() => setPhase("result"), 1800);
    }
  };

  const cellSz = size === 3 ? 80 : 64;

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(233,30,140,0.7))" }}>✨</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Magic Square</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Fill the grid so every row, column and diagonal<br />adds to the magic number!</p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>GRID SIZE</div>
        <div style={{ display: "flex", gap: 12 }}>
          {([3, 4] as const).map(s => (
            <button key={s} onClick={() => setSize(s)} style={{
              flex: 1, padding: "16px 0", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${size === s ? T.pink : T.border}`,
              background: size === s ? `${T.pink}22` : "transparent",
              color: size === s ? T.pink : T.muted,
              fontWeight: 900, fontFamily: "'Nunito',sans-serif", fontSize: 22,
              transition: "all 0.15s",
              boxShadow: size === s ? `0 4px 16px ${T.pink}44` : "none",
            }}>{s}×{s}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 10, margin: "10px 0 0" }}>
          {size === 3 ? "Magic number = 15 · Numbers 1–9" : "Magic number = 34 · Numbers 1–16"}
        </p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>DIFFICULTY</div>
        <div style={{ display: "flex", gap: 10 }}>
          {([["easy", "🌱", T.green, "Few blanks"], ["medium", "⭐", T.gold, "Half blank"], ["hard", "🔥", T.red, "Most blank"]] as const).map(([d, icon, col, desc]) => (
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

      <button onClick={startGame} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.pink}, #9b0066)`,
        color: T.white, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.pink}55`,
        transition: "transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >✨ Generate Square!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 14, filter: "drop-shadow(0 0 28px rgba(233,30,140,0.6))" }}>🏆</div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 34, color: T.white, margin: "0 0 8px" }}>Magic Complete!</h2>
      <p style={{ color: T.muted, marginBottom: 12, fontSize: 15 }}>
        Every row, column & diagonal adds to <strong style={{ color: T.pink }}>{magic}</strong>
      </p>
      <p style={{ color: T.teal, fontSize: 14, marginBottom: 32 }}>
        Solved in {wonAt} {wonAt === 1 ? "attempt" : "attempts"} 🎉
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={startGame} style={{
          padding: "14px 32px", borderRadius: 14,
          background: `linear-gradient(135deg, ${T.pink}, #9b0066)`,
          color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer",
          boxShadow: `0 6px 20px ${T.pink}55`,
        }}>✨ New Square</button>
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
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{
          padding: "8px 18px", borderRadius: 99,
          background: `${T.pink}22`, border: `1px solid ${T.pink}55`,
          color: T.pink, fontSize: 14, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
        }}>Magic = <strong>{magic}</strong></span>
        <span style={{
          padding: "8px 18px", borderRadius: 99,
          background: "rgba(255,255,255,0.07)", border: `1px solid ${T.border}`,
          color: T.muted, fontSize: 14, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
        }}>Attempts: {attempts}</span>
      </div>

      {/* Win banner */}
      {won && (
        <div style={{
          textAlign: "center", background: `${T.green}18`,
          border: `2px solid ${T.green}55`, borderRadius: 20, padding: "20px 16px", marginBottom: 20,
          boxShadow: `0 0 40px ${T.green}33`,
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: T.green, margin: 0 }}>
            Magic Square Complete!
          </p>
          <p style={{ color: T.muted, fontSize: 13, margin: "6px 0 0" }}>Solved in {wonAt} {wonAt === 1 ? "attempt" : "attempts"}</p>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 20 }}>
        {Array.from({ length: size }, (_, row) => (
          <div key={row} style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: size }, (_, col) => {
              const i = row * size + col;
              const cell = puzzle[i];
              const isHidden = cell === null;
              const isCorrect = checked && correct[i] === true;
              const isWrong = checked && correct[i] === false;
              return (
                <div key={col} style={{
                  width: cellSz, height: cellSz, borderRadius: 14,
                  background: !isHidden ? T.s2 : isCorrect ? `${T.green}22` : isWrong ? `${T.red}18` : T.s1,
                  border: `2.5px solid ${!isHidden ? "rgba(255,255,255,0.18)" : isCorrect ? T.green : isWrong ? T.red : T.pink}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.25s",
                  boxShadow: isCorrect ? `0 0 16px ${T.green}55` : isWrong ? `0 0 16px ${T.red}33` : "none",
                  transform: isCorrect ? "scale(1.05)" : "scale(1)",
                }}>
                  {!isHidden
                    ? <span style={{
                        fontFamily: "'Nunito',sans-serif", fontWeight: 900,
                        fontSize: cellSz * 0.35, color: T.gold,
                        textShadow: `0 0 10px ${T.gold}55`,
                      }}>{cell}</span>
                    : <input
                        type="number"
                        value={inputs[i] || ""}
                        onChange={e => {
                          setInputs(p => ({ ...p, [i]: e.target.value }));
                          setChecked(false); setCorrect({});
                        }}
                        style={{
                          width: "100%", height: "100%",
                          background: "transparent", border: "none",
                          color: isCorrect ? T.green : isWrong ? T.red : T.white,
                          fontFamily: "'Nunito',sans-serif", fontWeight: 900,
                          fontSize: cellSz * 0.35, textAlign: "center",
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
        background: `${T.pink}10`, border: `1px solid ${T.pink}30`,
        borderRadius: 14, padding: "12px 18px", marginBottom: 20,
        fontSize: 13, color: T.muted, textAlign: "center",
      }}>
        💡 Every row, column and diagonal must add to <strong style={{ color: T.pink }}>{magic}</strong>
      </div>

      {!won && (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={checkAnswers} disabled={Object.keys(inputs).length === 0} style={{
            flex: 1, padding: "14px 0", borderRadius: 14,
            background: Object.keys(inputs).length === 0 ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg, ${T.pink}, #9b0066)`,
            color: Object.keys(inputs).length === 0 ? T.muted : T.white,
            fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, border: "none",
            cursor: Object.keys(inputs).length === 0 ? "not-allowed" : "pointer",
            opacity: Object.keys(inputs).length === 0 ? 0.5 : 1,
            boxShadow: Object.keys(inputs).length > 0 ? `0 4px 16px ${T.pink}44` : "none",
          }}>✓ Check Answers</button>
          <button onClick={startGame} style={{
            padding: "14px 22px", borderRadius: 14, background: T.s2,
            color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15,
            border: `1px solid ${T.border}`, cursor: "pointer",
          }}>🔁 New</button>
        </div>
      )}
      {checked && !won && (
        <p style={{ textAlign: "center", color: T.red, fontSize: 13, marginTop: 14, fontWeight: 700 }}>
          ✗ Some cells are wrong — keep trying! (Attempt {attempts})
        </p>
      )}
    </div>
  );
}
