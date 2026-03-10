import { useState, useEffect, useRef } from "react";

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

interface Props { onBack: () => void; }

export default function GameFunctionMachine({ onBack }: Props) {
  const [level, setLevel] = useState(2);
  const [phase, setPhase] = useState<"setup" | "playing">("setup");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [userInput, setUserInput] = useState("");
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [ruleOptions, setRuleOptions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = () => {
    setRound(1); setScore(0); setStreak(0);
    const c = generateChallenge(level);
    setChallenge(c); setResult(null); setUserInput(""); setSelectedRule(null);
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
    } else {
      setStreak(0); setResult("wrong");
    }
  };

  const next = () => {
    const c = generateChallenge(level);
    setChallenge(c); setResult(null); setUserInput(""); setSelectedRule(null);
    setRound(r => r + 1);
    if (c.mode === "rule") setRuleOptions(makeRuleOptions(c.ops));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (phase === "playing") setTimeout(() => inputRef.current?.focus(), 100);
  }, [phase]);

  if (phase === "setup") return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>⚙️</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Function Machine</h2>
        <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>Find the output, input, or crack the rule of the number machine!</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>YEAR GROUP</p>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map(y => (
            <button key={y} onClick={() => setLevel(y)} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${level === y ? T.purple : T.border}`,
              background: level === y ? `${T.purple}22` : "transparent",
              color: level === y ? T.purple : T.muted, fontWeight: 800,
              fontFamily: "'Nunito',sans-serif", fontSize: 14,
            }}>Y{y}</button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: T.muted, marginTop: 10 }}>
          {level <= 2 ? "1 operation, find the output only" : level <= 4 ? "1–2 operations, find output or input" : "2–3 operations, all challenge types"}
        </p>
      </div>
      <button onClick={startGame} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", background: T.purple, color: T.white, border: "none", cursor: "pointer" }}>⚙️ Start Machine!</button>
    </div>
  );

  if (!challenge) return null;
  const machineLabel = challenge.ops.map(o => o.label).join(" → ");

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 99, background: `${T.purple}22`, border: `1px solid ${T.purple}55`, color: T.purple, fontSize: 12, fontWeight: 700 }}>Round {round}</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20, color: T.gold }}>{score} pts</span>
        {streak >= 2 && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 99, background: `${T.teal}22`, border: `1px solid ${T.teal}55`, color: T.teal, fontSize: 12, fontWeight: 700 }}>🔥 Streak ×{streak >= 2 ? 2 : 1}</span>}
      </div>

      {/* Machine diagram */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1 }}>IN</div>
          <div style={{ width: 70, height: 70, borderRadius: 14, background: challenge.mode === "input" ? `${T.gold}22` : T.s2, border: `2px solid ${challenge.mode === "input" ? T.gold : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
            {challenge.mode === "input"
              ? <span style={{ fontSize: 32, color: T.gold, fontFamily: "'Nunito',sans-serif", fontWeight: 900 }}>?</span>
              : challenge.mode === "rule"
                ? challenge.examples?.map((e, i) => <span key={i} style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif", color: T.gold }}>{e.in}</span>)
                : <span style={{ fontSize: 32, fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.white }}>{challenge.input}</span>}
          </div>
        </div>
        <div style={{ color: T.muted, fontSize: 20, paddingTop: 20 }}>→</div>
        <div style={{ background: `${T.purple}22`, border: `2px solid ${T.purple}66`, borderRadius: 18, padding: "14px 22px", minWidth: 130, textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 10, color: T.purple, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>⚙️ MACHINE</div>
          {challenge.mode === "rule"
            ? <span style={{ fontSize: 28, color: T.purple, fontFamily: "'Nunito',sans-serif", fontWeight: 900 }}>???</span>
            : <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 15, color: T.white, lineHeight: 1.6 }}>{machineLabel}</span>}
        </div>
        <div style={{ color: T.muted, fontSize: 20, paddingTop: 20 }}>→</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1 }}>OUT</div>
          <div style={{ width: 70, height: 70, borderRadius: 14, background: challenge.mode === "output" ? `${T.teal}22` : T.s2, border: `2px solid ${challenge.mode === "output" ? T.teal : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
            {challenge.mode === "output"
              ? <span style={{ fontSize: 32, color: T.teal, fontFamily: "'Nunito',sans-serif", fontWeight: 900 }}>?</span>
              : challenge.mode === "rule"
                ? challenge.examples?.map((e, i) => <span key={i} style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif", color: T.teal }}>{e.out}</span>)
                : <span style={{ fontSize: 32, fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.white }}>{challenge.output}</span>}
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div style={{ background: T.s1, border: `1.5px solid ${result === "correct" ? T.green : result === "wrong" ? T.red : T.border}`, borderRadius: 16, padding: "16px 20px", textAlign: "center", marginBottom: 20, transition: "border-color 0.2s" }}>
        <p style={{ color: T.muted, fontSize: 13, marginBottom: result ? 8 : 0 }}>
          {challenge.mode === "output" ? "What number comes OUT?" : challenge.mode === "input" ? "What number went IN?" : "What is the machine's RULE?"}
        </p>
        {result === "correct" && <p style={{ color: T.green, fontWeight: 700, fontSize: 15 }}>✓ Correct!{streak >= 2 ? " 🔥 Streak bonus!" : ""}</p>}
        {result === "wrong" && <p style={{ color: T.red, fontWeight: 700, fontSize: 14 }}>✗ Answer: {challenge.mode === "rule" ? challenge.ops.map(o => o.label).join(", then ") : challenge.answer}</p>}
      </div>

      {result === null && (
        challenge.mode === "rule"
          ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ruleOptions.map((opt, i) => (
                <button key={i} onClick={() => { setSelectedRule(opt); submit(opt); }} style={{ padding: "12px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left", border: `2px solid ${selectedRule === opt ? T.purple : T.border}`, background: selectedRule === opt ? `${T.purple}22` : T.s1, color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14 }}>{opt}</button>
              ))}
            </div>
          : <div style={{ display: "flex", gap: 10 }}>
              <input ref={inputRef} value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Type your answer…" style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: `1.5px solid ${T.border}`, borderRadius: 12, color: T.white, fontSize: 20, padding: "12px 16px", outline: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 800, textAlign: "center" }} />
              <button onClick={() => submit()} disabled={!userInput} style={{ padding: "11px 24px", borderRadius: 12, background: !userInput ? "rgba(255,255,255,0.08)" : T.purple, color: !userInput ? T.muted : T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, border: "none", cursor: !userInput ? "not-allowed" : "pointer", opacity: !userInput ? 0.5 : 1 }}>→</button>
            </div>
      )}
      {result !== null && (
        <button onClick={next} style={{ width: "100%", marginTop: 8, padding: "12px 0", borderRadius: 12, background: result === "correct" ? T.green : T.gold, color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer" }}>Next Challenge →</button>
      )}
    </div>
  );
}
