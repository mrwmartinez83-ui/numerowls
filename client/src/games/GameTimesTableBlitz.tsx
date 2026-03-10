import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

const BLITZ_DURATION = 60;

function generateQ(table: number) {
  const b = table === 0 ? Math.floor(Math.random() * 11) + 2 : table;
  const a = Math.floor(Math.random() * 12) + 1;
  return { a, b, answer: a * b };
}

interface HistoryItem { q: string; answer: number; given: number; correct: boolean; }
interface Props { onBack: () => void; }

export default function GameTimesTableBlitz({ onBack }: Props) {
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [table, setTable] = useState(0);
  const [q, setQ] = useState<{ a: number; b: number; answer: number } | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BLITZ_DURATION);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [lives, setLives] = useState(3);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextQ = useCallback(() => {
    setQ(generateQ(table)); setInput(""); setAnimKey(k => k + 1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [table]);

  const startGame = () => {
    setPhase("playing"); setScore(0); setStreak(0); setLives(3);
    setTimeLeft(BLITZ_DURATION); setHistory([]); setFeedback(null);
    nextQ();
  };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase("result"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  const submit = () => {
    if (!input || !q) return;
    const correct = parseInt(input) === q.answer;
    setHistory(h => [...h, { q: `${q.a} × ${q.b}`, answer: q.answer, given: parseInt(input), correct }]);
    if (correct) {
      const pts = 1 + Math.floor(streak / 3);
      setScore(s => s + pts); setStreak(s => s + 1); setFeedback("correct");
    } else {
      setLives(l => {
        if (l - 1 <= 0) { clearInterval(timerRef.current!); setPhase("result"); return 0; }
        return l - 1;
      });
      setStreak(0); setFeedback("wrong");
    }
    setTimeout(() => { setFeedback(null); nextQ(); }, 350);
  };

  const timerPct = timeLeft / BLITZ_DURATION;
  const timerColor = timerPct > 0.5 ? T.teal : timerPct > 0.25 ? T.gold : T.red;

  if (phase === "setup") return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>✖️</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Times Table Blitz</h2>
        <p style={{ color: T.muted, fontSize: 14 }}>Answer as many as you can in 60 seconds. Build streaks for bonus points!</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>CHOOSE YOUR TABLE</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(t => (
            <button key={t} onClick={() => setTable(t)} style={{
              padding: "8px 14px", borderRadius: 10, border: `2px solid ${table === t ? T.gold : T.border}`,
              background: table === t ? `${T.gold}20` : "transparent",
              color: table === t ? T.gold : T.muted, fontWeight: 700, cursor: "pointer",
              fontSize: 14, transition: "all 0.15s", fontFamily: "'Nunito',sans-serif",
            }}>{t === 0 ? "🎲 Mixed" : `${t}×`}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <span style={{ padding: "8px 20px", borderRadius: 99, background: `${T.teal}20`, border: `1px solid ${T.teal}50`, color: T.teal, fontSize: 13, fontWeight: 700 }}>⏱ 60s · 3 lives · streak bonuses</span>
      </div>
      <button onClick={startGame} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", background: T.gold, color: T.bg, border: "none", cursor: "pointer" }}>🚀 Start Blitz!</button>
    </div>
  );

  if (phase === "result") {
    const correct = history.filter(h => h.correct).length;
    const wrong = history.filter(h => !h.correct).length;
    const bestStreak = history.reduce((acc, h) => {
      if (h.correct) { acc[acc.length - 1]++; } else { acc.push(0); } return acc;
    }, [0]).reduce((a, b) => Math.max(a, b), 0);
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>{score > 20 ? "🏆" : score > 10 ? "🦉" : "💪"}</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: T.white, marginBottom: 4 }}>Time's Up!</h2>
        <div style={{ fontSize: 56, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>{score}</div>
        <p style={{ color: T.muted, marginBottom: 24 }}>points scored</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          {([["Correct", correct, T.teal], ["Wrong", wrong, T.red], ["Best Streak", bestStreak, T.gold]] as const).map(([label, val, col]) => (
            <div key={label} style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 24px" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: col, fontFamily: "'Nunito',sans-serif" }}>{val}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{label}</div>
            </div>
          ))}
        </div>
        {history.length > 0 && (
          <div style={{ background: T.s1, borderRadius: 14, padding: 16, marginBottom: 20, maxHeight: 180, overflowY: "auto", textAlign: "left" }}>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 10, fontWeight: 700 }}>LAST 10 ANSWERS</p>
            {history.slice(-10).reverse().map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ color: T.muted }}>{h.q} = ?</span>
                <span style={{ color: h.correct ? T.green : T.red, fontWeight: 700 }}>{h.correct ? `✓ ${h.answer}` : `✗ ${h.given} (${h.answer})`}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={startGame} style={{ padding: "11px 24px", borderRadius: 12, background: T.gold, color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>🔁 Play Again</button>
          <button onClick={() => setPhase("setup")} style={{ padding: "11px 24px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>Change Table</button>
          <button onClick={onBack} style={{ padding: "11px 24px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>← All Games</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[...Array(3)].map((_, i) => <span key={i} style={{ fontSize: 20, opacity: i < lives ? 1 : 0.2 }}>❤️</span>)}
        </div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: T.gold }}>{score} pts</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, color: timerColor, fontWeight: 700 }}>{timeLeft}s</div>
          {streak >= 3 && <div style={{ fontSize: 11, color: T.teal, fontWeight: 700 }}>🔥 ×{1 + Math.floor(streak / 3)} bonus</div>}
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: timerColor, width: `${timerPct * 100}%`, transition: "width 1s linear, background 0.5s" }} />
      </div>
      <div key={animKey} style={{ background: T.s1, border: `2px solid ${feedback === "correct" ? T.green : feedback === "wrong" ? T.red : T.border}`, borderRadius: 18, padding: "36px 24px", textAlign: "center", marginBottom: 20, transition: "border-color 0.2s" }}>
        {streak >= 3 && <div style={{ fontSize: 12, color: T.teal, fontWeight: 700, marginBottom: 8 }}>🔥 Streak: {streak}</div>}
        <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Nunito',sans-serif", marginBottom: 8, color: T.white }}>{q?.a} × {q?.b} = ?</div>
        {feedback === "correct" && <div style={{ color: T.green, fontWeight: 700, fontSize: 16 }}>✓ Correct{streak >= 3 ? " +bonus!" : "!"}</div>}
        {feedback === "wrong" && <div style={{ color: T.red, fontWeight: 700, fontSize: 16 }}>✗ Answer was {q?.answer}</div>}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input ref={inputRef} type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Your answer…" style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: `1.5px solid ${T.border}`, borderRadius: 12, color: T.white, fontSize: 20, fontWeight: 700, padding: "14px 18px", outline: "none", fontFamily: "'Nunito',sans-serif", textAlign: "center" }} />
        <button onClick={submit} disabled={!input} style={{ padding: "11px 24px", borderRadius: 12, background: !input ? "rgba(255,255,255,0.08)" : T.gold, color: !input ? T.muted : T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, border: "none", cursor: !input ? "not-allowed" : "pointer", opacity: !input ? 0.5 : 1 }}>Go →</button>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 10 }}>Press Enter or tap Go</p>
    </div>
  );
}
