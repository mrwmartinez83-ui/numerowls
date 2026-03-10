import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

const PHRASES_CORRECT = ["⭐ Brilliant!", "🔥 On fire!", "💥 Nailed it!", "🎯 Perfect!", "⚡ Lightning fast!", "🥷 Ninja move!", "🏆 Amazing!"];
const PHRASES_WRONG   = ["💪 Keep going!", "🤔 Nearly!", "😤 Next one!", "👊 You've got this!"];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface Question { question: string; answer: number; options: number[]; }

function makeQ(year: number): Question {
  let a: number, b: number, answer: number, question: string;
  if (year <= 2) {
    const op = rand(0, 1) ? "+" : "-";
    if (op === "+") { a = rand(1, 20); b = rand(1, 20); answer = a + b; question = `${a} + ${b}`; }
    else { a = rand(5, 30); b = rand(1, a); answer = a - b; question = `${a} − ${b}`; }
  } else if (year <= 4) {
    const ops = ["+", "-", "×", "÷"];
    const op = ops[rand(0, 3)];
    if (op === "+") { a = rand(10, 99); b = rand(10, 99); answer = a + b; question = `${a} + ${b}`; }
    else if (op === "-") { a = rand(20, 99); b = rand(1, a); answer = a - b; question = `${a} − ${b}`; }
    else if (op === "×") { a = rand(2, 12); b = rand(2, 12); answer = a * b; question = `${a} × ${b}`; }
    else { a = rand(2, 12); b = rand(2, 12); answer = a; question = `${a * b} ÷ ${b}`; }
  } else {
    const ops = ["+", "-", "×", "÷", "sq"];
    const op = ops[rand(0, 4)];
    if (op === "+") { a = rand(50, 500); b = rand(50, 500); answer = a + b; question = `${a} + ${b}`; }
    else if (op === "-") { a = rand(100, 999); b = rand(1, a); answer = a - b; question = `${a} − ${b}`; }
    else if (op === "×") { a = rand(3, 15); b = rand(3, 15); answer = a * b; question = `${a} × ${b}`; }
    else if (op === "÷") { a = rand(2, 15); b = rand(2, 15); answer = a; question = `${a * b} ÷ ${b}`; }
    else { a = rand(2, 15); answer = a * a; question = `${a}²`; }
  }
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const delta = rand(1, Math.max(3, Math.floor(answer * 0.3)));
    const w = rand(0, 1) ? answer + delta : Math.max(0, answer - delta);
    if (w !== answer) wrong.add(w);
  }
  return { question, answer, options: shuffle([answer, ...Array.from(wrong)]) };
}

const TIMER_START = 8;

interface Props { onBack: () => void; }

export default function GameNumberNinja({ onBack }: Props) {
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [year, setYear] = useState(3);
  const [q, setQ] = useState<Question | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(TIMER_START);
  const [maxTimer, setMaxTimer] = useState(TIMER_START);
  const [result, setResult] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [history, setHistory] = useState<{ correct: boolean }[]>([]);
  const [phrase, setPhrase] = useState("");
  const [cardFlash, setCardFlash] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  const nextQ = useCallback((r: number) => {
    const newMax = Math.max(4, TIMER_START - Math.floor(r / 5));
    setMaxTimer(newMax);
    setTimer(newMax);
    setQ(makeQ(year));
    setResult(null);
    setChosen(null);
    setCardFlash(null);
    setPhrase("");
    lockRef.current = false;
  }, [year]);

  const startGame = () => {
    setRound(1); setScore(0); setStreak(0); setLives(3);
    setHistory([]); setResult(null); setChosen(null); setCardFlash(null); setPhrase("");
    setMaxTimer(TIMER_START); setTimer(TIMER_START);
    setQ(makeQ(year));
    lockRef.current = false;
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing" || result !== null) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 0.05) {
          clearTimer();
          if (!lockRef.current) {
            lockRef.current = true;
            setResult("timeout");
            setPhrase(PHRASES_WRONG[rand(0, PHRASES_WRONG.length - 1)]);
            setCardFlash("wrong");
            setStreak(0);
            setHistory(h => [...h, { correct: false }]);
            setLives(l => {
              const nl = l - 1;
              if (nl <= 0) setTimeout(() => setPhase("result"), 1200);
              else setTimeout(() => { setRound(r => { nextQ(r + 1); return r + 1; }); }, 1200);
              return nl;
            });
          }
          return 0;
        }
        return t - 0.05;
      });
    }, 50);
    return clearTimer;
  }, [phase, result, nextQ]);

  const pick = (opt: number) => {
    if (lockRef.current || result !== null || !q) return;
    lockRef.current = true;
    clearTimer();
    setChosen(opt);
    const isCorrect = opt === q.answer;
    setResult(isCorrect ? "correct" : "wrong");
    setCardFlash(isCorrect ? "correct" : "wrong");
    setHistory(h => [...h, { correct: isCorrect }]);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 2 : 1;
      const pts = Math.round((10 + Math.round(timer / maxTimer * 10)) * bonus);
      setScore(s => s + pts);
      setPhrase(PHRASES_CORRECT[rand(0, PHRASES_CORRECT.length - 1)]);
      if (newStreak === 5 || newStreak === 10 || newStreak === 15) {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 }, colors: ["#9B59B6", "#F5A623", "#fff", "#4ECDC4"] });
      }
      setTimeout(() => { setRound(r => { nextQ(r + 1); return r + 1; }); }, 900);
    } else {
      setStreak(0);
      setPhrase(PHRASES_WRONG[rand(0, PHRASES_WRONG.length - 1)]);
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => setPhase("result"), 1200);
        else setTimeout(() => { setRound(r => { nextQ(r + 1); return r + 1; }); }, 1200);
        return nl;
      });
    }
  };

  const timerPct = maxTimer > 0 ? timer / maxTimer : 0;
  const timerCol = timerPct > 0.5 ? T.green : timerPct > 0.25 ? T.gold : T.red;

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(155,89,182,0.7))" }}>🥷</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Number Ninja</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Pick the right answer before the timer runs out!<br />Speed increases every 5 rounds. Build streaks for double points!</p>
      </div>

      <div style={{ background: T.s1, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 22, border: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>YEAR GROUP</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map(y => (
            <button key={y} onClick={() => setYear(y)} style={{
              flex: 1, padding: "12px 0", borderRadius: 12,
              border: `2px solid ${year === y ? T.purple : T.border}`,
              background: year === y ? `${T.purple}33` : "transparent",
              color: year === y ? T.white : T.muted,
              fontWeight: 900, fontFamily: "'Nunito',sans-serif", fontSize: 14, cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: year === y ? `0 4px 16px ${T.purple}44` : "none",
            }}>Y{y}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 12, margin: "12px 0 0", lineHeight: 1.5 }}>
          {year <= 2 ? "Addition & subtraction up to 30" : year <= 4 ? "All four operations + times tables" : "Full range including squares & large numbers"}
        </p>
      </div>

      <div style={{ background: T.s1, borderRadius: 18, padding: "16px 22px", marginBottom: 22, border: `1px solid ${T.border}`, display: "flex", gap: 20 }}>
        {[{ icon: "❤️❤️❤️", label: "3 lives" }, { icon: "🔥", label: "Streak × 2 bonus" }, { icon: "⚡", label: "Speed increases" }].map(tip => (
          <div key={tip.label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{tip.icon}</div>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700 }}>{tip.label}</div>
          </div>
        ))}
      </div>

      <button onClick={startGame} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.purple}, #6c3483)`,
        color: T.white, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.purple}55`,
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >🥷 Start!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") {
    const correct = history.filter(h => h.correct).length;
    const pct = history.length > 0 ? Math.round(correct / history.length * 100) : 0;
    const medal = score >= 200 ? "🏆" : score >= 100 ? "🥷" : "💪";
    if (score >= 200) confetti({ particleCount: 150, spread: 120, origin: { y: 0.4 }, colors: ["#9B59B6", "#F5A623", "#fff"] });
    return (
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 14, filter: "drop-shadow(0 0 28px rgba(245,166,35,0.6))" }}>{medal}</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 34, color: T.white, margin: "0 0 8px" }}>Game Over!</h2>
        <div style={{ fontSize: 68, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", margin: "0 0 8px", textShadow: `0 0 40px ${T.gold}99` }}>{score}</div>
        <p style={{ color: T.muted, marginBottom: 32, fontSize: 15 }}>{correct}/{history.length} correct · {pct}% accuracy</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Score", value: score, color: T.gold },
            { label: "Correct", value: correct, color: T.green },
            { label: "Rounds", value: history.length, color: T.purple },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: T.s1, borderRadius: 16, padding: "18px 8px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: "'Nunito',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={startGame} style={{
            padding: "14px 32px", borderRadius: 14,
            background: `linear-gradient(135deg, ${T.purple}, #6c3483)`,
            color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer",
            boxShadow: `0 6px 20px ${T.purple}55`,
          }}>🔁 Play Again</button>
          <button onClick={onBack} style={{
            padding: "14px 32px", borderRadius: 14, background: T.s2,
            color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16,
            border: `1px solid ${T.border}`, cursor: "pointer",
          }}>← All Games</button>
        </div>
      </div>
    );
  }

  // ── Playing ──
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[...Array(3)].map((_, i) => (
            <span key={i} style={{ fontSize: 24, opacity: i < lives ? 1 : 0.2, transition: "opacity 0.3s", filter: i < lives ? "drop-shadow(0 0 6px rgba(231,76,60,0.6))" : "none" }}>❤️</span>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          {streak >= 3 && (
            <div style={{ fontSize: 12, color: T.gold, fontWeight: 800, marginBottom: 2, animation: "owlPulse 0.8s ease infinite" }}>
              🔥 {streak} streak × 2!
            </div>
          )}
          <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: T.gold, textShadow: `0 0 20px ${T.gold}88` }}>{score}</span>
        </div>
        <span style={{
          padding: "6px 16px", borderRadius: 99,
          background: `${T.purple}22`, border: `1px solid ${T.purple}55`,
          color: T.purple, fontSize: 14, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
        }}>Q{round}</span>
      </div>

      {/* Timer bar */}
      <div style={{ height: 12, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 22, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: timerCol,
          width: `${timerPct * 100}%`, transition: "width 0.05s linear, background 0.3s",
          boxShadow: `0 0 10px ${timerCol}88`,
        }} />
      </div>

      {/* Question card */}
      <div style={{
        background: cardFlash === "correct" ? `${T.green}1a` : cardFlash === "wrong" ? `${T.red}12` : T.s1,
        border: `3px solid ${cardFlash === "correct" ? T.green : cardFlash === "wrong" ? T.red : "rgba(255,255,255,0.12)"}`,
        borderRadius: 24, padding: "40px 28px", textAlign: "center", marginBottom: 22,
        transition: "all 0.2s",
        boxShadow: cardFlash === "correct" ? `0 0 40px ${T.green}44` : cardFlash === "wrong" ? `0 0 40px ${T.red}33` : "none",
      }}>
        <div style={{
          fontSize: 52, fontWeight: 900, fontFamily: "'Nunito',sans-serif",
          color: T.white, marginBottom: phrase ? 16 : 0,
          textShadow: "0 2px 16px rgba(255,255,255,0.12)",
        }}>{q?.question}</div>
        {phrase && (
          <div style={{
            fontSize: 20, fontWeight: 900, color: result === "correct" ? T.green : T.red,
            fontFamily: "'Nunito',sans-serif",
          }}>{phrase}</div>
        )}
        {(result === "wrong" || result === "timeout") && (
          <div style={{ color: T.muted, fontSize: 14, marginTop: 6 }}>
            {result === "timeout" ? "⏱ Too slow! " : ""}Answer was <strong style={{ color: T.white }}>{q?.answer}</strong>
          </div>
        )}
      </div>

      {/* Answer options — big tappable buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {q?.options.map((opt, i) => {
          const isChosen = chosen === opt;
          const isCorrect = result !== null && opt === q.answer;
          const isWrong = isChosen && result === "wrong";
          return (
            <button
              key={i}
              onClick={() => pick(opt)}
              disabled={result !== null}
              style={{
                padding: "28px 12px", borderRadius: 18,
                border: `3px solid ${isCorrect ? T.green : isWrong ? T.red : "rgba(255,255,255,0.12)"}`,
                background: isCorrect ? `${T.green}22` : isWrong ? `${T.red}18` : T.s2,
                color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30,
                cursor: result !== null ? "default" : "pointer",
                transition: "all 0.15s",
                boxShadow: isCorrect ? `0 0 24px ${T.green}55` : isWrong ? `0 0 24px ${T.red}44` : "none",
                transform: isCorrect ? "scale(1.05)" : "scale(1)",
              }}
              onMouseEnter={e => { if (result === null) { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = T.purple; } }}
              onMouseLeave={e => { if (result === null) { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; } }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
