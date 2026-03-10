import { useState, useEffect, useRef } from "react";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C", blue: "#3498DB",
  muted: "#B0C4DE", white: "#FFFFFF",
};

const SMALL_NUMS = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
const LARGE_NUMS = [25,50,75,100];

function pickCountdownNums(largeCount = 1) {
  const large = [...LARGE_NUMS].sort(() => Math.random() - 0.5).slice(0, largeCount);
  const small = [...SMALL_NUMS].sort(() => Math.random() - 0.5).slice(0, 6 - largeCount);
  return [...large, ...small].sort(() => Math.random() - 0.5);
}

function evalExpr(expr: string): number | null {
  try {
    const safe = expr.replace(/[^0-9+\-*/().]/g, "");
    // eslint-disable-next-line no-new-func
    const val = Function('"use strict";return(' + safe + ")")();
    return typeof val === "number" && isFinite(val) && Number.isInteger(val) ? val : null;
  } catch { return null; }
}

interface GameCountdownProps {
  onBack: () => void;
}

export default function GameCountdown({ onBack }: GameCountdownProps) {
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [largeCount, setLargeCount] = useState(1);
  const [nums, setNums] = useState<number[]>([]);
  const [target, setTarget] = useState(0);
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<{ val: number | null; diff: number | null } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bestDiff, setBestDiff] = useState<number | null>(null);
  const [usedNums, setUsedNums] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = () => {
    const n = pickCountdownNums(largeCount);
    const t = Math.floor(Math.random() * 899) + 100;
    setNums(n); setTarget(t); setExpr(""); setResult(null);
    setBestDiff(null); setTimeLeft(30); setUsedNums([]); setPhase("playing");
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

  const tryExpr = () => {
    const val = evalExpr(expr);
    if (val === null) { setResult({ val: null, diff: null }); return; }
    const diff = Math.abs(val - target);
    setResult({ val, diff });
    if (bestDiff === null || diff < bestDiff) setBestDiff(diff);
    if (diff === 0) { clearInterval(timerRef.current!); setPhase("result"); }
  };

  const addNum = (n: number, i: number) => {
    if (usedNums.includes(i)) return;
    setUsedNums(u => [...u, i]);
    setExpr(e => e + n);
    setTimeout(() => inputRef.current?.focus(), 20);
  };

  const clearAll = () => { setExpr(""); setUsedNums([]); setResult(null); };
  const timerPct = timeLeft / 30;
  const timerCol = timerPct > 0.5 ? T.teal : timerPct > 0.25 ? T.gold : T.red;

  if (phase === "setup") return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🔢</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Countdown</h2>
        <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>Use the numbers with +−×÷ to reach the target. 30 seconds!</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 20 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>LARGE NUMBERS (25, 50, 75 or 100)</p>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setLargeCount(n)} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${largeCount === n ? T.gold : T.border}`,
              background: largeCount === n ? `${T.gold}22` : "transparent",
              color: largeCount === n ? T.gold : T.muted, fontWeight: 800,
              fontFamily: "'Nunito',sans-serif", fontSize: 14,
            }}>{n}</button>
          ))}
        </div>
      </div>
      <button onClick={start} style={{
        width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900,
        fontFamily: "'Nunito',sans-serif", background: T.blue, color: T.white, border: "none", cursor: "pointer",
      }}>🚀 Generate Numbers!</button>
    </div>
  );

  if (phase === "result") return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>{bestDiff === 0 ? "🏆" : bestDiff !== null && bestDiff <= 5 ? "🦉" : "💪"}</div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 4 }}>
        {bestDiff === 0 ? "EXACT! You got it!" : bestDiff !== null ? `${bestDiff} away from target` : "Time's Up!"}
      </h2>
      <div style={{ fontSize: 56, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", margin: "12px 0" }}>{target}</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
        {nums.map((n, i) => (
          <div key={i} style={{ background: T.s2, borderRadius: 10, padding: "8px 14px", fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 18, color: T.gold }}>{n}</div>
        ))}
      </div>
      {result?.val !== null && result?.val !== undefined &&
        <p style={{ color: T.teal, fontSize: 14, marginBottom: 20 }}>Your best: {expr} = {result.val}</p>}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={start} style={{ padding: "11px 24px", borderRadius: 12, background: T.blue, color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>🔁 New Round</button>
        <button onClick={onBack} style={{ padding: "11px 24px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>← All Games</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 99, background: `${timerCol}22`, border: `1px solid ${timerCol}55`, color: timerCol, fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>⏱ {timeLeft}s</span>
        {bestDiff !== null && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 99, background: `${bestDiff === 0 ? T.green : bestDiff <= 5 ? T.gold : T.muted}22`, border: `1px solid ${bestDiff === 0 ? T.green : bestDiff <= 5 ? T.gold : T.muted}55`, color: bestDiff === 0 ? T.green : bestDiff <= 5 ? T.gold : T.muted, fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>{bestDiff === 0 ? "✓ EXACT!" : `${bestDiff} away`}</span>}
        <button onClick={() => { clearInterval(timerRef.current!); setPhase("result"); }} style={{ padding: "7px 14px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, border: `1px solid ${T.border}`, cursor: "pointer" }}>Give Up</button>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: timerCol, width: `${timerPct * 100}%`, transition: "width 1s linear, background 0.5s" }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: T.muted, fontWeight: 700, marginBottom: 4, letterSpacing: 2 }}>TARGET</p>
        <div style={{ fontSize: 64, fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.gold, lineHeight: 1, background: `${T.gold}15`, borderRadius: 16, padding: "12px 32px", display: "inline-block" }}>{target}</div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
        {nums.map((n, i) => (
          <button key={i} onClick={() => addNum(n, i)} disabled={usedNums.includes(i)} style={{
            width: 58, height: 58, borderRadius: 12,
            background: usedNums.includes(i) ? T.s2 : `${T.blue}22`,
            border: `2px solid ${usedNums.includes(i) ? T.border : T.blue}`,
            color: usedNums.includes(i) ? T.muted : T.white,
            fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20,
            cursor: usedNums.includes(i) ? "not-allowed" : "pointer", transition: "all 0.15s",
          }}>{n}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 14 }}>
        {["+", "−", "×", "÷", "(", ")"].map(op => (
          <button key={op} onClick={() => {
            const map: Record<string, string> = { "−": "-", "×": "*", "÷": "/" };
            setExpr(e => e + (map[op] || op));
            setTimeout(() => inputRef.current?.focus(), 20);
          }} style={{
            width: 46, height: 46, borderRadius: 10, border: `2px solid ${T.purple}55`,
            background: `${T.purple}22`, color: T.purple, fontFamily: "'Nunito',sans-serif",
            fontWeight: 900, fontSize: 18, cursor: "pointer", transition: "all 0.12s",
          }}>{op}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input ref={inputRef} value={expr} onChange={e => setExpr(e.target.value)}
          onKeyDown={e => e.key === "Enter" && tryExpr()}
          placeholder="Tap numbers & ops, or type…"
          style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: `1.5px solid ${T.border}`, borderRadius: 12, color: T.white, fontSize: 16, padding: "12px 16px", outline: "none", fontFamily: "'DM Mono',monospace" }} />
        <button onClick={tryExpr} disabled={!expr} style={{ padding: "11px 24px", borderRadius: 12, background: !expr ? "rgba(255,255,255,0.08)" : T.gold, color: !expr ? T.muted : T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: !expr ? "not-allowed" : "pointer", opacity: !expr ? 0.5 : 1 }}>= ?</button>
      </div>
      {result && (
        <div style={{ textAlign: "center", padding: "10px", borderRadius: 12, marginBottom: 10, background: result.diff === 0 ? `${T.green}18` : result.val === null ? `${T.red}18` : `${T.gold}10`, border: `1px solid ${result.diff === 0 ? T.green : result.val === null ? T.red : T.gold}55` }}>
          {result.val === null
            ? <span style={{ color: T.red, fontWeight: 700 }}>⚠ Invalid — check your expression</span>
            : result.diff === 0
              ? <span style={{ color: T.green, fontWeight: 700, fontFamily: "'Nunito',sans-serif", fontSize: 18 }}>🎉 EXACT! = {result.val}</span>
              : <span style={{ color: T.gold, fontWeight: 700 }}>{expr} = {result.val} · {result.diff} away</span>}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={clearAll} style={{ padding: "7px 14px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, border: `1px solid ${T.border}`, cursor: "pointer" }}>🗑 Clear</button>
        <button onClick={() => setExpr(e => e.slice(0, -1))} style={{ padding: "7px 14px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, border: `1px solid ${T.border}`, cursor: "pointer" }}>⌫ Back</button>
      </div>
    </div>
  );
}
