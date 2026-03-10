import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

type Op = { fn: (x: number) => number; label: string };

const OPS: Op[] = [
  { fn: x => x + 2, label: "+2" }, { fn: x => x + 5, label: "+5" },
  { fn: x => x + 10, label: "+10" }, { fn: x => x - 3, label: "−3" },
  { fn: x => x - 5, label: "−5" }, { fn: x => x * 2, label: "×2" },
  { fn: x => x * 3, label: "×3" }, { fn: x => x * 5, label: "×5" },
  { fn: x => Math.floor(x / 2), label: "÷2" }, { fn: x => Math.floor(x / 3), label: "÷3" },
  { fn: x => x + 1, label: "+1" }, { fn: x => x - 1, label: "−1" },
  { fn: x => x + 4, label: "+4" }, { fn: x => x + 7, label: "+7" },
  { fn: x => x * 4, label: "×4" }, { fn: x => x - 2, label: "−2" },
];

type Mode = "output" | "input" | "rule";

interface Challenge {
  ops: Op[];
  input: number;
  output: number;
  mode: Mode;
  answer: number | string;
  examples?: { in: number; out: number }[];
}

function pickOps(count: number): Op[] {
  return [...OPS].sort(() => Math.random() - 0.5).slice(0, count);
}

function applyOps(x: number, ops: Op[]): number {
  return ops.reduce((acc, op) => op.fn(acc), x);
}

function generateChallenge(level: number): Challenge {
  const opCount = level <= 2 ? 1 : level <= 4 ? 2 : 3;
  const ops = pickOps(opCount);
  const input = Math.floor(Math.random() * 20) + 1;
  const output = applyOps(input, ops);
  const modes: Mode[] = ["output", "input", "rule"];
  const mode = modes[Math.floor(Math.random() * (level <= 2 ? 1 : level <= 4 ? 2 : 3))];
  if (mode === "rule") {
    const examples = Array.from({ length: 3 }, () => {
      const i = Math.floor(Math.random() * 15) + 1;
      return { in: i, out: applyOps(i, ops) };
    });
    const ruleLabel = ops.map(o => o.label).join(", then ");
    return { ops, input, output, mode, answer: ruleLabel, examples };
  }
  return { ops, input, output, mode, answer: mode === "output" ? output : input };
}

function makeRuleOptions(correctOps: Op[]): string[] {
  const correct = correctOps.map(o => o.label).join(", then ");
  const wrong: string[] = [];
  while (wrong.length < 3) {
    const fake = pickOps(correctOps.length).map(o => o.label).join(", then ");
    if (fake !== correct && !wrong.includes(fake)) wrong.push(fake);
  }
  return [...wrong, correct].sort(() => Math.random() - 0.5);
}

const PHRASES_CORRECT = ["⚙️ Brilliant!", "🔥 Genius!", "⭐ Spot on!", "🎯 Nailed it!", "💡 Exactly right!"];
const PHRASES_WRONG = ["💭 Almost!", "🤔 Think again!", "💪 Keep going!"];

interface Props { onBack: () => void; }

export default function GameFunctionMachine({ onBack }: Props) {
  const [level, setLevel] = useState(3);
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [phrase, setPhrase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [ruleOptions, setRuleOptions] = useState<string[]>([]);
  const [totalRounds] = useState(10);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = () => {
    setRound(1); setScore(0); setStreak(0);
    const c = generateChallenge(level);
    setChallenge(c); setResult(null); setUserInput(""); setSelectedRule(null); setPhrase("");
    if (c.mode === "rule") setRuleOptions(makeRuleOptions(c.ops));
    setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const submit = (ruleChoice?: string) => {
    if (!challenge) return;
    const given = ruleChoice ?? userInput;
    const correct = String(given).trim() === String(challenge.answer).trim();
    if (correct) {
      const pts = 10 + (streak >= 2 ? 5 : 0);
      setScore(s => s + pts); setStreak(s => s + 1); setResult("correct");
      setPhrase(PHRASES_CORRECT[Math.floor(Math.random() * PHRASES_CORRECT.length)]);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 }, colors: ["#9B59B6", "#F5A623", "#fff"] });
    } else {
      setStreak(0); setResult("wrong");
      setPhrase(PHRASES_WRONG[Math.floor(Math.random() * PHRASES_WRONG.length)]);
    }
  };

  const next = () => {
    if (round >= totalRounds) { setPhase("result"); return; }
    const c = generateChallenge(level);
    setChallenge(c); setResult(null); setUserInput(""); setSelectedRule(null); setPhrase("");
    setRound(r => r + 1);
    if (c.mode === "rule") setRuleOptions(makeRuleOptions(c.ops));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (phase === "playing") setTimeout(() => inputRef.current?.focus(), 100);
  }, [phase]);

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(155,89,182,0.7))" }}>⚙️</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Function Machine</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Find the output, input, or crack the rule!<br />10 rounds · Streak bonuses available</p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>YEAR GROUP</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map(y => (
            <button key={y} onClick={() => setLevel(y)} style={{
              flex: 1, padding: "12px 0", borderRadius: 12, cursor: "pointer",
              border: `2px solid ${level === y ? T.purple : T.border}`,
              background: level === y ? `${T.purple}22` : "transparent",
              color: level === y ? T.purple : T.muted,
              fontWeight: 900, fontFamily: "'Nunito',sans-serif", fontSize: 15,
              transition: "all 0.15s",
              boxShadow: level === y ? `0 4px 16px ${T.purple}44` : "none",
            }}>Y{y}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 12, margin: "12px 0 0", textAlign: "center" }}>
          {level <= 2 ? "1 operation · find the output only" : level <= 4 ? "1–2 operations · output or input" : "2–3 operations · all challenge types"}
        </p>
      </div>

      <button onClick={startGame} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.purple}, #6c3483)`,
        color: T.white, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.purple}55`,
        transition: "transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >⚙️ Start Machine!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") {
    const pct = score / (totalRounds * 15);
    const medal = pct >= 0.8 ? "🏆" : pct >= 0.5 ? "⭐" : "💪";
    if (pct >= 0.8) confetti({ particleCount: 140, spread: 110, origin: { y: 0.4 }, colors: ["#9B59B6", "#F5A623", "#fff", "#4ECDC4"] });
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 14, filter: "drop-shadow(0 0 28px rgba(155,89,182,0.6))" }}>{medal}</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 34, color: T.white, margin: "0 0 8px" }}>Machine Mastered!</h2>
        <div style={{ fontSize: 68, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", margin: "0 0 8px", textShadow: `0 0 40px ${T.gold}99` }}>{score}</div>
        <p style={{ color: T.muted, marginBottom: 32, fontSize: 15 }}>{totalRounds} rounds completed</p>
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

  if (!challenge) return null;
  const machineLabel = challenge.ops.map(o => o.label).join(" → ");
  const progress = (round - 1) / totalRounds;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          padding: "8px 16px", borderRadius: 99,
          background: `${T.purple}22`, border: `1px solid ${T.purple}55`,
          color: T.purple, fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
        }}>Round {round}/{totalRounds}</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: T.gold, textShadow: `0 0 20px ${T.gold}88` }}>{score} pts</span>
        {streak >= 2
          ? <span style={{
              padding: "8px 16px", borderRadius: 99,
              background: "rgba(255,100,0,0.2)", border: "1px solid rgba(255,100,0,0.5)",
              color: "#ff6400", fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
            }}>🔥 ×{streak}</span>
          : <span style={{ width: 80 }} />}
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${T.purple}, ${T.teal})`,
          width: `${progress * 100}%`, transition: "width 0.4s ease",
          boxShadow: `0 0 10px ${T.purple}88`,
        }} />
      </div>

      {/* Machine diagram */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        marginBottom: 24, padding: "20px 12px",
        background: T.s1, border: `1px solid ${T.border}`, borderRadius: 24,
      }}>
        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 800, letterSpacing: 1 }}>IN</div>
          <div style={{
            width: 80, height: 80, borderRadius: 18,
            background: challenge.mode === "input" ? `${T.gold}22` : T.s2,
            border: `3px solid ${challenge.mode === "input" ? T.gold : "rgba(255,255,255,0.15)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2,
            boxShadow: challenge.mode === "input" ? `0 0 20px ${T.gold}44` : "none",
          }}>
            {challenge.mode === "input"
              ? <span style={{ fontSize: 40, color: T.gold, fontFamily: "'Nunito',sans-serif", fontWeight: 900 }}>?</span>
              : challenge.mode === "rule"
                ? <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {challenge.examples?.map((e, i) => <span key={i} style={{ fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif", color: T.gold }}>{e.in}</span>)}
                  </div>
                : <span style={{ fontSize: 36, fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.white }}>{challenge.input}</span>}
          </div>
        </div>

        <div style={{ color: T.muted, fontSize: 28, paddingTop: 24 }}>→</div>

        {/* Machine box */}
        <div style={{
          background: `${T.purple}22`, border: `3px solid ${T.purple}88`,
          borderRadius: 22, padding: "16px 20px", minWidth: 140, textAlign: "center",
          boxShadow: `0 0 30px ${T.purple}33`,
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>⚙️</div>
          <div style={{ fontSize: 10, color: T.purple, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>MACHINE</div>
          {challenge.mode === "rule"
            ? <span style={{ fontSize: 32, color: T.purple, fontFamily: "'Nunito',sans-serif", fontWeight: 900 }}>???</span>
            : <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, color: T.white, lineHeight: 1.8 }}>{machineLabel}</span>}
        </div>

        <div style={{ color: T.muted, fontSize: 28, paddingTop: 24 }}>→</div>

        {/* Output */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 800, letterSpacing: 1 }}>OUT</div>
          <div style={{
            width: 80, height: 80, borderRadius: 18,
            background: challenge.mode === "output" ? `${T.teal}22` : T.s2,
            border: `3px solid ${challenge.mode === "output" ? T.teal : "rgba(255,255,255,0.15)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2,
            boxShadow: challenge.mode === "output" ? `0 0 20px ${T.teal}44` : "none",
          }}>
            {challenge.mode === "output"
              ? <span style={{ fontSize: 40, color: T.teal, fontFamily: "'Nunito',sans-serif", fontWeight: 900 }}>?</span>
              : challenge.mode === "rule"
                ? <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {challenge.examples?.map((e, i) => <span key={i} style={{ fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif", color: T.teal }}>{e.out}</span>)}
                  </div>
                : <span style={{ fontSize: 36, fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.white }}>{challenge.output}</span>}
          </div>
        </div>
      </div>

      {/* Feedback / prompt */}
      <div style={{
        background: result === "correct" ? `${T.green}15` : result === "wrong" ? `${T.red}15` : T.s1,
        border: `2px solid ${result === "correct" ? T.green : result === "wrong" ? T.red : T.border}`,
        borderRadius: 18, padding: "16px 20px", textAlign: "center", marginBottom: 18,
        transition: "all 0.25s",
        boxShadow: result === "correct" ? `0 0 24px ${T.green}33` : result === "wrong" ? `0 0 24px ${T.red}22` : "none",
      }}>
        {result === null && (
          <p style={{ color: T.muted, fontSize: 14, margin: 0, fontWeight: 700 }}>
            {challenge.mode === "output" ? "🤔 What number comes OUT?" : challenge.mode === "input" ? "🔍 What number went IN?" : "🕵️ What is the machine's RULE?"}
          </p>
        )}
        {result === "correct" && (
          <p style={{ color: T.green, fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "'Nunito',sans-serif" }}>
            {phrase}{streak >= 2 ? " 🔥 Streak bonus +5!" : ""}
          </p>
        )}
        {result === "wrong" && (
          <div>
            <p style={{ color: T.red, fontWeight: 900, fontSize: 16, margin: "0 0 4px", fontFamily: "'Nunito',sans-serif" }}>{phrase}</p>
            <p style={{ color: T.muted, fontSize: 13, margin: 0 }}>
              Answer: <strong style={{ color: T.white }}>{challenge.mode === "rule" ? challenge.ops.map(o => o.label).join(", then ") : challenge.answer}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Input area */}
      {result === null && (
        challenge.mode === "rule"
          ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ruleOptions.map((opt, i) => (
                <button key={i} onClick={() => { setSelectedRule(opt); submit(opt); }} style={{
                  padding: "14px 18px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                  border: `2px solid ${selectedRule === opt ? T.purple : T.border}`,
                  background: selectedRule === opt ? `${T.purple}22` : T.s1,
                  color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 15,
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.purple; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = selectedRule === opt ? T.purple : T.border; }}
                >{opt}</button>
              ))}
            </div>
          : <div style={{ display: "flex", gap: 10 }}>
              <input
                ref={inputRef}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="Type your answer…"
                style={{
                  flex: 1, background: "rgba(255,255,255,0.06)",
                  border: `2px solid ${T.border}`, borderRadius: 14,
                  color: T.white, fontSize: 24, padding: "14px 18px",
                  outline: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 900, textAlign: "center",
                }}
              />
              <button onClick={() => submit()} disabled={!userInput} style={{
                padding: "14px 26px", borderRadius: 14,
                background: !userInput ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg, ${T.purple}, #6c3483)`,
                color: !userInput ? T.muted : T.white,
                fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, border: "none",
                cursor: !userInput ? "not-allowed" : "pointer",
                opacity: !userInput ? 0.5 : 1,
                boxShadow: userInput ? `0 4px 16px ${T.purple}44` : "none",
              }}>→</button>
            </div>
      )}
      {result !== null && (
        <button onClick={next} style={{
          width: "100%", marginTop: 10, padding: "16px 0", borderRadius: 14,
          background: result === "correct"
            ? `linear-gradient(135deg, ${T.green}, #1a8a4a)`
            : `linear-gradient(135deg, ${T.gold}, #c0882a)`,
          color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 17, border: "none", cursor: "pointer",
          boxShadow: `0 4px 16px ${result === "correct" ? T.green : T.gold}55`,
        }}>{round >= totalRounds ? "🏆 See Results" : "Next Challenge →"}</button>
      )}
    </div>
  );
}
