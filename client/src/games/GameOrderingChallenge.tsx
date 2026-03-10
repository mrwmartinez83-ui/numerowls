import { useState, useCallback } from "react";
import confetti from "canvas-confetti";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

interface OrderItem { label: string; value: number; }

function generateOrderingSet(type: string, year: number): OrderItem[] {
  if (type === "fractions") {
    const pairs: [number, number][] = [[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5],[3,5],[1,6],[5,6],[1,8],[3,8],[5,8],[7,8],[1,10],[3,10],[7,10]];
    const chosen = [...pairs].sort(() => Math.random() - 0.5).slice(0, 5);
    return chosen.map(([n, d]) => ({ label: `${n}/${d}`, value: n / d }));
  }
  if (type === "decimals") {
    const vals = Array.from({ length: 5 }, () => parseFloat((Math.random() * 9 + 0.1).toFixed(2)));
    return vals.map(v => ({ label: String(v), value: v }));
  }
  if (type === "measurements") {
    const options: OrderItem[] = [
      { label: "5mm", value: 0.5 }, { label: "2cm", value: 2 }, { label: "50cm", value: 50 },
      { label: "1m", value: 100 }, { label: "150cm", value: 150 }, { label: "2m", value: 200 },
      { label: "0.5km", value: 500 }, { label: "1km", value: 1000 },
    ];
    return [...options].sort(() => Math.random() - 0.5).slice(0, 5);
  }
  const base = year <= 2 ? 20 : year <= 4 ? 100 : 1000;
  const vals = new Set<number>();
  while (vals.size < 5) vals.add(Math.floor(Math.random() * base));
  return Array.from(vals).map(v => ({ label: String(v), value: v }));
}

const ORDERING_TYPES = [
  { id: "integers", label: "Whole Numbers", icon: "🔢" },
  { id: "decimals", label: "Decimals", icon: "🔟" },
  { id: "fractions", label: "Fractions", icon: "🍕" },
  { id: "measurements", label: "Measurements", icon: "📏" },
];

const TOTAL_ROUNDS = 10;

interface Props { onBack: () => void; }

export default function GameOrderingChallenge({ onBack }: Props) {
  const [type, setType] = useState("integers");
  const [year, setYear] = useState(4);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const newRound = useCallback(() => {
    const set = generateOrderingSet(type, year);
    setItems([...set].sort(() => Math.random() - 0.5));
    setResult(null); setShowAnswer(false);
  }, [type, year]);

  const startGame = () => { setPhase("playing"); setScore(0); setRound(1); newRound(); };

  const checkOrder = () => {
    const sorted = [...items].sort((a, b) => direction === "asc" ? a.value - b.value : b.value - a.value);
    const isCorrect = items.every((item, i) => item.value === sorted[i].value);
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore(s => s + 10);
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 }, colors: ["#4ECDC4", "#F5A623", "#fff"] });
    }
  };

  const next = () => {
    if (round >= TOTAL_ROUNDS) { setPhase("result"); return; }
    setRound(r => r + 1);
    newRound();
  };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(i, 0, moved);
    setItems(newItems); setDragIdx(null); setResult(null);
  };

  const correctOrder = result === "wrong" ? [...items].sort((a, b) => direction === "asc" ? a.value - b.value : b.value - a.value) : null;

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(78,205,196,0.7))" }}>🔀</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Ordering Challenge</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Drag the tiles into the correct order!<br />{TOTAL_ROUNDS} rounds · 10 points per correct answer</p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>WHAT TO ORDER</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {ORDERING_TYPES.map(t => (
            <button key={t.id} onClick={() => setType(t.id)} style={{
              padding: "12px 18px", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${type === t.id ? T.teal : T.border}`,
              background: type === t.id ? `${T.teal}22` : "transparent",
              color: type === t.id ? T.teal : T.muted,
              fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 14,
              transition: "all 0.15s",
              boxShadow: type === t.id ? `0 4px 16px ${T.teal}33` : "none",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>DIRECTION</div>
        <div style={{ display: "flex", gap: 10 }}>
          {([["asc", "⬆️ Smallest → Largest"], ["desc", "⬇️ Largest → Smallest"]] as const).map(([d, label]) => (
            <button key={d} onClick={() => setDirection(d)} style={{
              flex: 1, padding: "14px 8px", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${direction === d ? T.gold : T.border}`,
              background: direction === d ? `${T.gold}22` : "transparent",
              color: direction === d ? T.gold : T.muted,
              fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 13,
              transition: "all 0.15s",
              boxShadow: direction === d ? `0 4px 16px ${T.gold}33` : "none",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>YEAR GROUP</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map(y => (
            <button key={y} onClick={() => setYear(y)} style={{
              flex: 1, padding: "12px 0", borderRadius: 12, cursor: "pointer",
              border: `2px solid ${year === y ? T.teal : T.border}`,
              background: year === y ? `${T.teal}22` : "transparent",
              color: year === y ? T.teal : T.muted,
              fontWeight: 900, fontFamily: "'Nunito',sans-serif", fontSize: 15,
              transition: "all 0.15s",
            }}>Y{y}</button>
          ))}
        </div>
      </div>

      <button onClick={startGame} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.teal}, #1a8a7a)`,
        color: T.bg, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.teal}55`,
        transition: "transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >🔀 Start Ordering!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") {
    const pct = score / (TOTAL_ROUNDS * 10);
    const medal = pct >= 0.8 ? "🏆" : pct >= 0.5 ? "⭐" : "💪";
    if (pct >= 0.8) confetti({ particleCount: 140, spread: 110, origin: { y: 0.4 }, colors: ["#4ECDC4", "#F5A623", "#fff"] });
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 14, filter: "drop-shadow(0 0 28px rgba(78,205,196,0.6))" }}>{medal}</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 34, color: T.white, margin: "0 0 8px" }}>Ordering Complete!</h2>
        <div style={{ fontSize: 68, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", margin: "0 0 8px", textShadow: `0 0 40px ${T.gold}99` }}>{score}</div>
        <p style={{ color: T.muted, marginBottom: 32, fontSize: 15 }}>{TOTAL_ROUNDS} rounds completed</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={startGame} style={{
            padding: "14px 32px", borderRadius: 14,
            background: `linear-gradient(135deg, ${T.teal}, #1a8a7a)`,
            color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer",
            boxShadow: `0 6px 20px ${T.teal}55`,
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
  const progress = (round - 1) / TOTAL_ROUNDS;

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "24px 16px" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          padding: "8px 16px", borderRadius: 99,
          background: `${T.teal}22`, border: `1px solid ${T.teal}55`,
          color: T.teal, fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
        }}>Round {round}/{TOTAL_ROUNDS}</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: T.gold, textShadow: `0 0 20px ${T.gold}88` }}>{score} pts</span>
        <button onClick={() => setPhase("setup")} style={{
          padding: "8px 14px", borderRadius: 10, background: T.s2,
          color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12,
          border: `1px solid ${T.border}`, cursor: "pointer",
        }}>Menu</button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${T.teal}, ${T.gold})`,
          width: `${progress * 100}%`, transition: "width 0.4s ease",
          boxShadow: `0 0 10px ${T.teal}88`,
        }} />
      </div>

      {/* Direction prompt */}
      <div style={{
        background: T.s1, border: `2px solid ${T.teal}55`,
        borderRadius: 18, padding: "16px 20px", marginBottom: 20, textAlign: "center",
        boxShadow: `0 0 20px ${T.teal}22`,
      }}>
        <p style={{ fontSize: 13, color: T.muted, margin: "0 0 4px" }}>Drag to arrange</p>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20, color: T.white, margin: 0 }}>
          {direction === "asc" ? "⬆️ Smallest → Largest" : "⬇️ Largest → Smallest"}
        </p>
      </div>

      {/* Draggable tiles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {items.map((item, i) => {
          const isCorrect = result === "correct";
          const isWrongPos = result === "wrong" && showAnswer && correctOrder?.[i]?.label !== item.label;
          return (
            <div
              key={item.label + i}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(i)}
              style={{
                padding: "18px 22px", borderRadius: 18,
                background: isCorrect ? `${T.green}18` : isWrongPos ? `${T.red}15` : T.s1,
                border: `2.5px solid ${isCorrect ? T.green : isWrongPos ? T.red : T.border}`,
                cursor: result ? "default" : "grab",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "all 0.2s", userSelect: "none",
                boxShadow: isCorrect ? `0 0 16px ${T.green}44` : "none",
                transform: isCorrect ? "scale(1.02)" : "scale(1)",
              }}
            >
              <span style={{ fontSize: 22, color: result ? "transparent" : T.muted, transition: "color 0.2s" }}>⠿</span>
              <span style={{
                fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white,
                textShadow: isCorrect ? `0 0 12px ${T.green}66` : "none",
              }}>{item.label}</span>
              <span style={{ fontSize: 20, width: 28, textAlign: "right" }}>
                {isCorrect ? "✅" : isWrongPos ? "❌" : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* Correct order reveal */}
      {result === "wrong" && showAnswer && correctOrder && (
        <div style={{
          background: `${T.teal}10`, border: `1px solid ${T.teal}40`,
          borderRadius: 14, padding: "14px 18px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, color: T.teal, fontWeight: 800, margin: "0 0 10px" }}>✓ Correct order:</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {correctOrder.map((item, i) => (
              <span key={i} style={{
                background: T.s2, padding: "6px 14px", borderRadius: 10,
                fontWeight: 900, fontSize: 18, color: T.white,
                fontFamily: "'Nunito',sans-serif",
              }}>{item.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {result === null && (
        <button onClick={checkOrder} style={{
          width: "100%", padding: "16px 0", borderRadius: 14,
          background: `linear-gradient(135deg, ${T.teal}, #1a8a7a)`,
          color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 17, border: "none", cursor: "pointer",
          boxShadow: `0 4px 16px ${T.teal}44`,
        }}>✓ Check Order</button>
      )}
      {result === "correct" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.green, fontSize: 22, margin: "0 0 14px" }}>🎉 Perfect! +10 points</p>
          <button onClick={next} style={{
            width: "100%", padding: "16px 0", borderRadius: 14,
            background: `linear-gradient(135deg, ${T.green}, #1a8a4a)`,
            color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 17, border: "none", cursor: "pointer",
            boxShadow: `0 4px 16px ${T.green}44`,
          }}>{round >= TOTAL_ROUNDS ? "🏆 See Results" : "Next Round →"}</button>
        </div>
      )}
      {result === "wrong" && (
        <div style={{ display: "flex", gap: 10 }}>
          {!showAnswer && (
            <button onClick={() => setShowAnswer(true)} style={{
              flex: 1, padding: "14px 0", borderRadius: 14, background: T.s2,
              color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15,
              border: `1px solid ${T.border}`, cursor: "pointer",
            }}>Show Answer</button>
          )}
          <button onClick={next} style={{
            flex: 1, padding: "14px 0", borderRadius: 14,
            background: `linear-gradient(135deg, ${T.gold}, #c07a10)`,
            color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 15, border: "none", cursor: "pointer",
            boxShadow: `0 4px 16px ${T.gold}44`,
          }}>{round >= TOTAL_ROUNDS ? "🏆 See Results" : "Try Another →"}</button>
        </div>
      )}
    </div>
  );
}
