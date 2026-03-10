import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

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

interface GameCountdownProps { onBack: () => void; }

export default function GameCountdown({ onBack }: GameCountdownProps) {
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [largeCount, setLargeCount] = useState(1);
  const [nums, setNums] = useState<number[]>([]);
  const [target, setTarget] = useState(0);
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<{ val: number | null; diff: number | null } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bestDiff, setBestDiff] = useState<number | null>(null);
  const [bestExpr, setBestExpr] = useState("");
  const [usedNums, setUsedNums] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = () => {
    const n = pickCountdownNums(largeCount);
    const t = Math.floor(Math.random() * 899) + 100;
    setNums(n); setTarget(t); setExpr(""); setResult(null);
    setBestDiff(null); setBestExpr(""); setTimeLeft(30); setUsedNums([]); setPhase("playing");
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
    if (bestDiff === null || diff < bestDiff) {
      setBestDiff(diff);
      setBestExpr(expr);
    }
    if (diff === 0) {
      clearInterval(timerRef.current!);
      confetti({ particleCount: 160, spread: 120, origin: { y: 0.4 }, colors: ["#F5A623", "#4ECDC4", "#fff", "#2ECC71"] });
      setTimeout(() => setPhase("result"), 1200);
    }
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

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(52,152,219,0.7))" }}>🔢</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Countdown</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Use 6 numbers with +−×÷ to hit the target.<br />You have <strong style={{ color: T.gold }}>30 seconds</strong> — go!</p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>LARGE NUMBERS (25, 50, 75 or 100)</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[0, 1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setLargeCount(n)} style={{
              flex: 1, padding: "14px 0", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${largeCount === n ? T.gold : T.border}`,
              background: largeCount === n ? `${T.gold}22` : "transparent",
              color: largeCount === n ? T.gold : T.muted,
              fontWeight: 900, fontFamily: "'Nunito',sans-serif", fontSize: 18,
              transition: "all 0.15s",
              boxShadow: largeCount === n ? `0 4px 16px ${T.gold}33` : "none",
            }}>{n}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 10, textAlign: "center" }}>
          {largeCount === 0 ? "All small numbers (1–10)" : `${largeCount} large + ${6 - largeCount} small`}
        </p>
      </div>

      <button onClick={start} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.blue}, #1a5a8a)`,
        color: T.white, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.blue}55`,
        transition: "transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >🚀 Generate Numbers!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") {
    const isExact = bestDiff === 0;
    const isClose = bestDiff !== null && bestDiff <= 5;
    const medal = isExact ? "🏆" : isClose ? "⭐" : "💪";
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 14, filter: `drop-shadow(0 0 28px ${isExact ? T.gold : T.blue}88)` }}>{medal}</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: T.white, margin: "0 0 8px" }}>
          {isExact ? "EXACT! Brilliant!" : bestDiff !== null ? `${bestDiff} away from target` : "Time's Up!"}
        </h2>
        <p style={{ color: T.muted, fontSize: 14, margin: "0 0 20px" }}>The target was:</p>
        <div style={{
          fontSize: 80, fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.gold,
          lineHeight: 1, textShadow: `0 0 40px ${T.gold}99`, margin: "0 0 20px",
        }}>{target}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          {nums.map((n, i) => (
            <div key={i} style={{
              background: T.s2, borderRadius: 12, padding: "10px 16px",
              fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20, color: T.gold,
              border: `1px solid ${T.gold}33`,
            }}>{n}</div>
          ))}
        </div>
        {bestExpr && bestDiff !== null && (
          <div style={{
            background: isExact ? `${T.green}15` : `${T.teal}10`,
            border: `1px solid ${isExact ? T.green : T.teal}44`,
            borderRadius: 14, padding: "14px 20px", marginBottom: 24,
          }}>
            <p style={{ color: isExact ? T.green : T.teal, fontWeight: 800, fontSize: 15, margin: 0 }}>
              Your best: <strong style={{ fontFamily: "'DM Mono',monospace" }}>{bestExpr}</strong> = {evalExpr(bestExpr)}
              {!isExact && ` (${bestDiff} away)`}
            </p>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={start} style={{
            padding: "14px 32px", borderRadius: 14,
            background: `linear-gradient(135deg, ${T.blue}, #1a5a8a)`,
            color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer",
            boxShadow: `0 6px 20px ${T.blue}55`,
          }}>🔁 New Round</button>
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
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "20px 16px" }}>
      {/* Timer HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 18px", borderRadius: 99,
          background: `${timerCol}22`, border: `2px solid ${timerCol}66`,
          color: timerCol, fontSize: 18, fontWeight: 900, fontFamily: "'Nunito',sans-serif",
          boxShadow: timeLeft <= 10 ? `0 0 20px ${timerCol}66` : "none",
          transition: "all 0.5s",
        }}>⏱ {timeLeft}s</span>
        {bestDiff !== null && (
          <span style={{
            padding: "10px 16px", borderRadius: 99,
            background: `${bestDiff === 0 ? T.green : bestDiff <= 5 ? T.gold : T.muted}22`,
            border: `1px solid ${bestDiff === 0 ? T.green : bestDiff <= 5 ? T.gold : T.muted}55`,
            color: bestDiff === 0 ? T.green : bestDiff <= 5 ? T.gold : T.muted,
            fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
          }}>{bestDiff === 0 ? "✓ EXACT!" : `${bestDiff} away`}</span>
        )}
        <button onClick={() => { clearInterval(timerRef.current!); setPhase("result"); }} style={{
          padding: "10px 16px", borderRadius: 12, background: T.s2, color: T.muted,
          fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13,
          border: `1px solid ${T.border}`, cursor: "pointer",
        }}>Give Up</button>
      </div>

      {/* Timer bar */}
      <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: timerCol,
          width: `${timerPct * 100}%`, transition: "width 1s linear, background 0.5s",
          boxShadow: `0 0 12px ${timerCol}88`,
        }} />
      </div>

      {/* Target */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: T.muted, fontWeight: 800, marginBottom: 6, letterSpacing: 3 }}>TARGET</p>
        <div style={{
          fontSize: 80, fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.gold,
          lineHeight: 1, background: `${T.gold}15`, borderRadius: 22, padding: "16px 40px",
          display: "inline-block", textShadow: `0 0 40px ${T.gold}66`,
          border: `2px solid ${T.gold}33`,
        }}>{target}</div>
      </div>

      {/* Number tiles */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
        {nums.map((n, i) => (
          <button key={i} onClick={() => addNum(n, i)} disabled={usedNums.includes(i)} style={{
            width: 68, height: 68, borderRadius: 16,
            background: usedNums.includes(i) ? "rgba(255,255,255,0.04)" : `${T.blue}22`,
            border: `2.5px solid ${usedNums.includes(i) ? T.border : T.blue}`,
            color: usedNums.includes(i) ? "rgba(255,255,255,0.2)" : T.white,
            fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24,
            cursor: usedNums.includes(i) ? "not-allowed" : "pointer",
            transition: "all 0.15s",
            boxShadow: usedNums.includes(i) ? "none" : `0 4px 16px ${T.blue}33`,
            transform: usedNums.includes(i) ? "scale(0.92)" : "scale(1)",
          }}>{n}</button>
        ))}
      </div>

      {/* Operator buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
        {["+", "−", "×", "÷", "(", ")"].map(op => (
          <button key={op} onClick={() => {
            const map: Record<string, string> = { "−": "-", "×": "*", "÷": "/" };
            setExpr(e => e + (map[op] || op));
            setTimeout(() => inputRef.current?.focus(), 20);
          }} style={{
            width: 52, height: 52, borderRadius: 12,
            border: `2px solid ${T.purple}55`,
            background: `${T.purple}22`, color: T.purple,
            fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22,
            cursor: "pointer", transition: "all 0.12s",
            boxShadow: `0 2px 8px ${T.purple}22`,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${T.purple}44`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${T.purple}22`; }}
          >{op}</button>
        ))}
      </div>

      {/* Expression input */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          ref={inputRef}
          value={expr}
          onChange={e => setExpr(e.target.value)}
          onKeyDown={e => e.key === "Enter" && tryExpr()}
          placeholder="Tap numbers & ops, or type…"
          style={{
            flex: 1, background: "rgba(255,255,255,0.06)",
            border: `2px solid ${T.border}`, borderRadius: 14,
            color: T.white, fontSize: 18, padding: "14px 18px",
            outline: "none", fontFamily: "'DM Mono',monospace",
          }}
        />
        <button onClick={tryExpr} disabled={!expr} style={{
          padding: "14px 28px", borderRadius: 14,
          background: !expr ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg, ${T.gold}, #c07a10)`,
          color: !expr ? T.muted : T.bg,
          fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 18, border: "none",
          cursor: !expr ? "not-allowed" : "pointer",
          opacity: !expr ? 0.5 : 1,
          boxShadow: expr ? `0 4px 16px ${T.gold}44` : "none",
        }}>= ?</button>
      </div>

      {/* Result feedback */}
      {result && (
        <div style={{
          textAlign: "center", padding: "14px 18px", borderRadius: 14, marginBottom: 12,
          background: result.diff === 0 ? `${T.green}18` : result.val === null ? `${T.red}15` : `${T.gold}10`,
          border: `2px solid ${result.diff === 0 ? T.green : result.val === null ? T.red : T.gold}55`,
          boxShadow: result.diff === 0 ? `0 0 20px ${T.green}44` : "none",
        }}>
          {result.val === null
            ? <span style={{ color: T.red, fontWeight: 800, fontSize: 14 }}>⚠ Invalid — check your expression</span>
            : result.diff === 0
              ? <span style={{ color: T.green, fontWeight: 900, fontFamily: "'Nunito',sans-serif", fontSize: 20 }}>🎉 EXACT! = {result.val}</span>
              : <span style={{ color: T.gold, fontWeight: 800, fontSize: 15 }}>{expr} = {result.val} · {result.diff} away from {target}</span>}
        </div>
      )}

      {/* Clear / backspace */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={clearAll} style={{
          padding: "10px 20px", borderRadius: 12, background: T.s2, color: T.muted,
          fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13,
          border: `1px solid ${T.border}`, cursor: "pointer",
        }}>🗑 Clear</button>
        <button onClick={() => setExpr(e => e.slice(0, -1))} style={{
          padding: "10px 20px", borderRadius: 12, background: T.s2, color: T.muted,
          fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13,
          border: `1px solid ${T.border}`, cursor: "pointer",
        }}>⌫ Back</button>
      </div>
    </div>
  );
}
