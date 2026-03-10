import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

type QType = "add" | "sub" | "mul" | "div" | "missing" | "double" | "half" | "square";

interface NinjaQ {
  question: string;
  answer: number;
  options: number[];
  type: QType;
}

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateNinjaQ(year: number): NinjaQ {
  const types: QType[] = year <= 2
    ? ["add", "sub", "double", "half"]
    : year <= 4
      ? ["add", "sub", "mul", "missing", "double", "half"]
      : ["add", "sub", "mul", "div", "missing", "square"];

  const type = types[Math.floor(Math.random() * types.length)];
  let question = "";
  let answer = 0;

  switch (type) {
    case "add": {
      const max = year <= 2 ? 20 : year <= 4 ? 100 : 1000;
      const a = rand(1, max); const b = rand(1, max);
      question = `${a} + ${b} = ?`; answer = a + b; break;
    }
    case "sub": {
      const max = year <= 2 ? 20 : year <= 4 ? 100 : 1000;
      const a = rand(2, max); const b = rand(1, a);
      question = `${a} − ${b} = ?`; answer = a - b; break;
    }
    case "mul": {
      const tMax = year <= 3 ? 5 : year <= 4 ? 10 : 12;
      const a = rand(2, tMax); const b = rand(2, 12);
      question = `${a} × ${b} = ?`; answer = a * b; break;
    }
    case "div": {
      const b = rand(2, 12); const answer_ = rand(2, 12); const a = b * answer_;
      question = `${a} ÷ ${b} = ?`; answer = answer_; break;
    }
    case "missing": {
      const a = rand(2, year <= 4 ? 10 : 12); const b = rand(2, 12); const c = a * b;
      const hide = Math.random() < 0.5 ? "a" : "b";
      question = hide === "a" ? `? × ${b} = ${c}` : `${a} × ? = ${c}`;
      answer = hide === "a" ? a : b; break;
    }
    case "double": {
      const a = rand(1, year <= 2 ? 20 : 50);
      question = `Double ${a} = ?`; answer = a * 2; break;
    }
    case "half": {
      const a = rand(1, year <= 2 ? 10 : 50) * 2;
      question = `Half of ${a} = ?`; answer = a / 2; break;
    }
    case "square": {
      const a = rand(2, year <= 5 ? 10 : 15);
      question = `${a}² = ?`; answer = a * a; break;
    }
  }

  // Generate 3 wrong options close to the answer
  const wrongSet = new Set<number>();
  while (wrongSet.size < 3) {
    const delta = rand(1, Math.max(5, Math.floor(answer * 0.3)));
    const sign = Math.random() < 0.5 ? 1 : -1;
    const wrong = answer + sign * delta;
    if (wrong !== answer && wrong > 0 && !wrongSet.has(wrong)) wrongSet.add(wrong);
  }
  const options = [answer, ...Array.from(wrongSet)].sort(() => Math.random() - 0.5);

  return { question, answer, options, type };
}

interface Props { onBack: () => void; }

export default function GameNumberNinja({ onBack }: Props) {
  const [year, setYear] = useState(4);
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [q, setQ] = useState<NinjaQ | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [timePerQ, setTimePerQ] = useState(8); // seconds per question
  const [timeLeft, setTimeLeft] = useState(8);
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [history, setHistory] = useState<{ correct: boolean }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  const nextQ = useCallback(() => {
    const newQ = generateNinjaQ(year);
    setQ(newQ); setChosen(null); setResult(null);
    const tpq = Math.max(4, 8 - Math.floor(round / 5));
    setTimePerQ(tpq); setTimeLeft(tpq);
    lockRef.current = false;
  }, [year, round]);

  const startGame = () => {
    setScore(0); setStreak(0); setLives(3); setRound(1); setHistory([]);
    setPhase("playing");
    const newQ = generateNinjaQ(year);
    setQ(newQ); setChosen(null); setResult(null); setTimeLeft(8); setTimePerQ(8);
    lockRef.current = false;
  };

  useEffect(() => {
    if (phase !== "playing" || result !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(timerRef.current!);
          if (!lockRef.current) {
            lockRef.current = true;
            setResult("timeout");
            setHistory(h => [...h, { correct: false }]);
            setStreak(0);
            setLives(l => {
              const newL = l - 1;
              if (newL <= 0) { setTimeout(() => setPhase("result"), 900); }
              return newL;
            });
            setTimeout(() => { setRound(r => r + 1); nextQ(); }, 900);
          }
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(timerRef.current!);
  }, [phase, result, nextQ]);

  const pick = (opt: number) => {
    if (lockRef.current || result !== null || !q) return;
    lockRef.current = true;
    clearInterval(timerRef.current!);
    setChosen(opt);
    const correct = opt === q.answer;
    setResult(correct ? "correct" : "wrong");
    setHistory(h => [...h, { correct }]);
    if (correct) {
      const bonus = streak >= 3 ? 2 : 1;
      setScore(s => s + 10 * bonus);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      setLives(l => {
        const newL = l - 1;
        if (newL <= 0) { setTimeout(() => setPhase("result"), 900); return 0; }
        return newL;
      });
    }
    setTimeout(() => { setRound(r => r + 1); nextQ(); }, 900);
  };

  const timerPct = timeLeft / timePerQ;
  const timerCol = timerPct > 0.5 ? T.teal : timerPct > 0.25 ? T.gold : T.red;

  if (phase === "setup") return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🥷</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Number Ninja</h2>
        <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>Pick the correct answer before the timer runs out! Speed up as you go. Build streaks for double points!</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>YEAR GROUP</p>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map(y => (
            <button key={y} onClick={() => setYear(y)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `2px solid ${year === y ? T.purple : T.border}`, background: year === y ? `${T.purple}22` : "transparent", color: year === y ? T.purple : T.muted, fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 14, cursor: "pointer" }}>Y{y}</button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: T.muted, marginTop: 10 }}>
          {year <= 2 ? "Addition, subtraction, doubles & halves" : year <= 4 ? "All four operations + missing numbers" : "Full range including squares & large numbers"}
        </p>
      </div>
      <button onClick={startGame} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", background: T.purple, color: T.white, border: "none", cursor: "pointer" }}>🥷 Start!</button>
    </div>
  );

  if (phase === "result") {
    const correct = history.filter(h => h.correct).length;
    return (
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>{score >= 100 ? "🏆" : score >= 50 ? "🥷" : "💪"}</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: T.white, marginBottom: 4 }}>Game Over!</h2>
        <div style={{ fontSize: 56, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>{score}</div>
        <p style={{ color: T.muted, marginBottom: 24 }}>{correct}/{history.length} correct · {round - 1} rounds</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={startGame} style={{ padding: "11px 24px", borderRadius: 12, background: T.purple, color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>🔁 Play Again</button>
          <button onClick={onBack} style={{ padding: "11px 24px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>← All Games</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[...Array(3)].map((_, i) => <span key={i} style={{ fontSize: 18, opacity: i < lives ? 1 : 0.2 }}>❤️</span>)}
        </div>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20, color: T.gold }}>{score} pts</span>
        <span style={{ padding: "4px 12px", borderRadius: 99, background: `${T.purple}22`, border: `1px solid ${T.purple}55`, color: T.purple, fontSize: 12, fontWeight: 700 }}>Q{round}</span>
      </div>

      {/* Timer bar */}
      <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: timerCol, width: `${timerPct * 100}%`, transition: "width 0.1s linear, background 0.3s" }} />
      </div>

      {/* Question */}
      <div style={{ background: T.s1, border: `2px solid ${result === "correct" ? T.green : result === "wrong" || result === "timeout" ? T.red : T.border}`, borderRadius: 18, padding: "32px 24px", textAlign: "center", marginBottom: 20, transition: "border-color 0.2s" }}>
        {streak >= 3 && <div style={{ fontSize: 12, color: T.teal, fontWeight: 700, marginBottom: 8 }}>🔥 Streak ×2 bonus!</div>}
        <div style={{ fontSize: 40, fontWeight: 900, fontFamily: "'Nunito',sans-serif", color: T.white, marginBottom: result ? 12 : 0 }}>{q?.question}</div>
        {result === "correct" && <div style={{ color: T.green, fontWeight: 700, fontSize: 16 }}>✓ Correct{streak >= 3 ? " — double points!" : "!"}</div>}
        {result === "wrong" && <div style={{ color: T.red, fontWeight: 700, fontSize: 16 }}>✗ Answer was {q?.answer}</div>}
        {result === "timeout" && <div style={{ color: T.red, fontWeight: 700, fontSize: 16 }}>⏱ Too slow! Answer: {q?.answer}</div>}
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {q?.options.map((opt, i) => {
          const isChosen = chosen === opt;
          const isCorrect = result !== null && opt === q.answer;
          const isWrong = isChosen && result === "wrong";
          return (
            <button key={i} onClick={() => pick(opt)} disabled={result !== null} style={{ padding: "20px 12px", borderRadius: 14, border: `2px solid ${isCorrect ? T.green : isWrong ? T.red : T.border}`, background: isCorrect ? `${T.green}22` : isWrong ? `${T.red}15` : T.s2, color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, cursor: result !== null ? "default" : "pointer", transition: "all 0.15s" }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
