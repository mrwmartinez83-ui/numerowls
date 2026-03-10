import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

const BLITZ_DURATION = 60;

const PHRASES_CORRECT = ["⭐ Brilliant!", "🔥 On fire!", "💥 Nailed it!", "⚡ Fast!", "🎯 Perfect!"];
const PHRASES_WRONG   = ["💪 Keep going!", "🤔 Nearly!", "👊 You've got this!"];

function rand(n: number) { return Math.floor(Math.random() * n); }
function generateQ(table: number) {
  const b = table === 0 ? rand(11) + 2 : table;
  const a = rand(12) + 1;
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
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BLITZ_DURATION);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [feedbackPhrase, setFeedbackPhrase] = useState("");
  const [lives, setLives] = useState(3);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextQ = useCallback(() => {
    setQ(generateQ(table));
    setInput("");
    setFeedback(null);
    setFeedbackPhrase("");
    setAnimKey(k => k + 1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [table]);

  const startGame = () => {
    setPhase("playing"); setScore(0); setStreak(0); setBestStreak(0); setLives(3);
    setTimeLeft(BLITZ_DURATION); setHistory([]); setFeedback(null); setFeedbackPhrase("");
    setQ(generateQ(table)); setInput(""); setAnimKey(0);
    setTimeout(() => inputRef.current?.focus(), 100);
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
    const given = parseInt(input);
    const correct = given === q.answer;
    setHistory(h => [...h, { q: `${q.a} × ${q.b}`, answer: q.answer, given, correct }]);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(bs => Math.max(bs, newStreak));
      const pts = 1 + Math.floor(newStreak / 3);
      setScore(s => s + pts);
      setFeedback("correct");
      setFeedbackPhrase(PHRASES_CORRECT[rand(PHRASES_CORRECT.length)]);
      if (newStreak === 5 || newStreak === 10) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 }, colors: ["#F5A623", "#fff", "#4ECDC4"] });
      }
    } else {
      setStreak(0);
      setFeedback("wrong");
      setFeedbackPhrase(PHRASES_WRONG[rand(PHRASES_WRONG.length)]);
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0) { clearInterval(timerRef.current!); setTimeout(() => setPhase("result"), 500); return 0; }
        return nl;
      });
    }
    setTimeout(() => nextQ(), 400);
  };

  const timerPct = timeLeft / BLITZ_DURATION;
  const timerColor = timerPct > 0.5 ? T.teal : timerPct > 0.25 ? T.gold : T.red;

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(245,166,35,0.7))" }}>⚡</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Times Table Blitz</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Answer as many as you can in 60 seconds.<br />Build streaks for bonus points!</p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>CHOOSE YOUR TABLE</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(t => (
            <button key={t} onClick={() => setTable(t)} style={{
              padding: "10px 16px", borderRadius: 12,
              border: `2px solid ${table === t ? T.gold : T.border}`,
              background: table === t ? `${T.gold}22` : "transparent",
              color: table === t ? T.gold : T.muted,
              fontWeight: 800, cursor: "pointer", fontSize: 14,
              fontFamily: "'Nunito',sans-serif", transition: "all 0.15s",
              boxShadow: table === t ? `0 4px 16px ${T.gold}33` : "none",
            }}>{t === 0 ? "🎲 Mixed" : `${t}×`}</button>
          ))}
        </div>
      </div>

      <div style={{ background: T.s1, borderRadius: 18, padding: "16px 22px", marginBottom: 22, border: `1px solid ${T.border}`, display: "flex", gap: 20 }}>
        {[{ icon: "⏱", label: "60 seconds" }, { icon: "❤️❤️❤️", label: "3 lives" }, { icon: "🔥", label: "Streak bonuses" }].map(tip => (
          <div key={tip.label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{tip.icon}</div>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700 }}>{tip.label}</div>
          </div>
        ))}
      </div>

      <button onClick={startGame} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.gold}, #d4890a)`,
        color: T.bg, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.gold}55`,
        transition: "transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >🚀 Start Blitz!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") {
    const correct = history.filter(h => h.correct).length;
    const wrong = history.filter(h => !h.correct).length;
    const medal = score >= 25 ? "🏆" : score >= 12 ? "⭐" : "💪";
    if (score >= 25) confetti({ particleCount: 150, spread: 120, origin: { y: 0.4 }, colors: ["#F5A623", "#fff", "#4ECDC4"] });
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 14, filter: "drop-shadow(0 0 28px rgba(245,166,35,0.6))" }}>{medal}</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 34, color: T.white, margin: "0 0 8px" }}>Time's Up!</h2>
        <div style={{ fontSize: 68, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", margin: "0 0 8px", textShadow: `0 0 40px ${T.gold}99` }}>{score}</div>
        <p style={{ color: T.muted, marginBottom: 32, fontSize: 15 }}>points scored</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Correct", value: correct, color: T.green },
            { label: "Wrong", value: wrong, color: T.red },
            { label: "Best Streak", value: bestStreak, color: T.gold },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: T.s1, borderRadius: 16, padding: "18px 8px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: "'Nunito',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {history.length > 0 && (
          <div style={{ background: T.s1, borderRadius: 16, padding: "16px 20px", marginBottom: 28, maxHeight: 180, overflowY: "auto", textAlign: "left", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>LAST 10 ANSWERS</div>
            {history.slice(-10).reverse().map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ color: T.muted }}>{h.q} = ?</span>
                <span style={{ color: h.correct ? T.green : T.red, fontWeight: 700 }}>{h.correct ? `✓ ${h.answer}` : `✗ ${h.given} (${h.answer})`}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={startGame} style={{
            padding: "14px 28px", borderRadius: 14,
            background: `linear-gradient(135deg, ${T.gold}, #d4890a)`,
            color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 15, border: "none", cursor: "pointer",
            boxShadow: `0 6px 20px ${T.gold}44`,
          }}>🔁 Play Again</button>
          <button onClick={() => setPhase("setup")} style={{
            padding: "14px 28px", borderRadius: 14, background: T.s2,
            color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15,
            border: `1px solid ${T.border}`, cursor: "pointer",
          }}>Change Table</button>
          <button onClick={onBack} style={{
            padding: "14px 28px", borderRadius: 14, background: T.s2,
            color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15,
            border: `1px solid ${T.border}`, cursor: "pointer",
          }}>← All Games</button>
        </div>
      </div>
    );
  }

  // ── Playing ──
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px 20px" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[...Array(3)].map((_, i) => (
            <span key={i} style={{ fontSize: 24, opacity: i < lives ? 1 : 0.2, transition: "opacity 0.3s" }}>❤️</span>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          {streak >= 3 && (
            <div style={{ fontSize: 12, color: T.gold, fontWeight: 800, marginBottom: 2 }}>
              🔥 {streak} streak +{Math.floor(streak / 3)} bonus!
            </div>
          )}
          <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: T.gold, textShadow: `0 0 20px ${T.gold}88` }}>{score} pts</span>
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: `${timerColor}22`, border: `3px solid ${timerColor}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 18, color: timerColor,
          boxShadow: `0 0 16px ${timerColor}55`,
          transition: "border-color 0.5s, color 0.5s",
        }}>{timeLeft}</div>
      </div>

      {/* Timer bar */}
      <div style={{ height: 10, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 22, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: timerColor,
          width: `${timerPct * 100}%`, transition: "width 1s linear, background 0.5s",
          boxShadow: `0 0 10px ${timerColor}88`,
        }} />
      </div>

      {/* Question card */}
      <div key={animKey} style={{
        background: feedback === "correct" ? `${T.green}1a` : feedback === "wrong" ? `${T.red}12` : T.s1,
        border: `3px solid ${feedback === "correct" ? T.green : feedback === "wrong" ? T.red : "rgba(255,255,255,0.12)"}`,
        borderRadius: 24, padding: "40px 28px", textAlign: "center", marginBottom: 22,
        transition: "all 0.2s",
        boxShadow: feedback === "correct" ? `0 0 40px ${T.green}44` : feedback === "wrong" ? `0 0 40px ${T.red}33` : "none",
      }}>
        <div style={{
          fontSize: 52, fontWeight: 900, fontFamily: "'Nunito',sans-serif",
          color: T.white, marginBottom: feedbackPhrase ? 16 : 0,
          textShadow: "0 2px 16px rgba(255,255,255,0.12)",
        }}>{q?.a} × {q?.b} = ?</div>
        {feedbackPhrase && (
          <div style={{
            fontSize: 20, fontWeight: 900,
            color: feedback === "correct" ? T.green : T.red,
            fontFamily: "'Nunito',sans-serif",
          }}>{feedbackPhrase}</div>
        )}
        {feedback === "wrong" && (
          <div style={{ color: T.muted, fontSize: 14, marginTop: 6 }}>Answer was <strong style={{ color: T.white }}>{q?.answer}</strong></div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 12 }}>
        <input
          ref={inputRef}
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Your answer…"
          style={{
            flex: 1, background: "rgba(255,255,255,0.07)",
            border: `2px solid rgba(255,255,255,0.15)`, borderRadius: 14,
            color: T.white, fontSize: 24, fontWeight: 900, padding: "16px 20px",
            outline: "none", fontFamily: "'Nunito',sans-serif", textAlign: "center",
            transition: "border-color 0.15s",
          }}
          onFocus={e => { (e.target as HTMLInputElement).style.borderColor = T.gold; }}
          onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
        />
        <button onClick={submit} disabled={!input} style={{
          padding: "16px 28px", borderRadius: 14,
          background: !input ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg, ${T.gold}, #d4890a)`,
          color: !input ? T.muted : T.bg,
          fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 18, border: "none",
          cursor: !input ? "not-allowed" : "pointer",
          opacity: !input ? 0.5 : 1,
          boxShadow: input ? `0 4px 16px ${T.gold}44` : "none",
          transition: "all 0.15s",
        }}>Go →</button>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 10 }}>Press Enter or tap Go</p>
    </div>
  );
}
