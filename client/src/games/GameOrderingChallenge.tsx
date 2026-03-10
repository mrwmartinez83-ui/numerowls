import { useState, useCallback } from "react";

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

interface Props { onBack: () => void; }

export default function GameOrderingChallenge({ onBack }: Props) {
  const [type, setType] = useState("integers");
  const [year, setYear] = useState(4);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [phase, setPhase] = useState<"setup" | "playing">("setup");
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
    if (isCorrect) setScore(s => s + 10);
  };

  const next = () => { setRound(r => r + 1); newRound(); };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(i, 0, moved);
    setItems(newItems); setDragIdx(null); setResult(null);
  };

  const correctOrder = result === "wrong" ? [...items].sort((a, b) => direction === "asc" ? a.value - b.value : b.value - a.value) : null;

  if (phase === "setup") return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🔀</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Ordering Challenge</h2>
        <p style={{ color: T.muted, fontSize: 14 }}>Drag the tiles into the correct order!</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>WHAT TO ORDER</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ORDERING_TYPES.map(t => (
            <button key={t.id} onClick={() => setType(t.id)} style={{ padding: "8px 14px", borderRadius: 10, border: `2px solid ${type === t.id ? T.teal : T.border}`, background: type === t.id ? `${T.teal}20` : "transparent", color: type === t.id ? T.teal : T.muted, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Nunito',sans-serif" }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>DIRECTION</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([["asc", "⬆️ Smallest → Largest"], ["desc", "⬇️ Largest → Smallest"]] as const).map(([d, label]) => (
            <button key={d} onClick={() => setDirection(d)} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: `2px solid ${direction === d ? T.gold : T.border}`, background: direction === d ? `${T.gold}20` : "transparent", color: direction === d ? T.gold : T.muted, fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "'Nunito',sans-serif" }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>YEAR GROUP</p>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5, 6].map(y => (
            <button key={y} onClick={() => setYear(y)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: `2px solid ${year === y ? T.teal : T.border}`, background: year === y ? `${T.teal}20` : "transparent", color: year === y ? T.teal : T.muted, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Nunito',sans-serif" }}>Y{y}</button>
          ))}
        </div>
      </div>
      <button onClick={startGame} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", background: T.teal, color: T.bg, border: "none", cursor: "pointer" }}>Start Ordering! 🔀</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ padding: "4px 12px", borderRadius: 99, background: `${T.teal}22`, border: `1px solid ${T.teal}55`, color: T.teal, fontSize: 12, fontWeight: 700 }}>Round {round}</span>
          <span style={{ padding: "4px 12px", borderRadius: 99, background: `${T.gold}22`, border: `1px solid ${T.gold}55`, color: T.gold, fontSize: 12, fontWeight: 700 }}>{score} pts</span>
        </div>
        <button onClick={() => setPhase("setup")} style={{ padding: "7px 14px", borderRadius: 10, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, border: `1px solid ${T.border}`, cursor: "pointer" }}>Menu</button>
      </div>

      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 4 }}>Drag to order</p>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 18, color: T.white }}>
          {direction === "asc" ? "⬆️ Smallest → Largest" : "⬇️ Largest → Smallest"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {items.map((item, i) => (
          <div key={item.label + i} draggable onDragStart={() => onDragStart(i)} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(i)} style={{ padding: "16px 20px", borderRadius: 14, background: result === "correct" ? `${T.green}15` : result === "wrong" && showAnswer && correctOrder?.[i]?.label !== item.label ? `${T.red}15` : T.s1, border: `2px solid ${result === "correct" ? T.green : result === "wrong" && showAnswer && correctOrder?.[i]?.label !== item.label ? T.red : T.border}`, cursor: "grab", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s", userSelect: "none" }}>
            <span style={{ fontSize: 18, color: T.muted }}>⠿</span>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: T.white }}>{item.label}</span>
            <span style={{ fontSize: 14, width: 20, textAlign: "right" }}>
              {result === "correct" ? "✅" : result === "wrong" && showAnswer && correctOrder?.[i]?.label !== item.label ? "❌" : ""}
            </span>
          </div>
        ))}
      </div>

      {result === "wrong" && showAnswer && correctOrder && (
        <div style={{ background: `${T.teal}10`, border: `1px solid ${T.teal}40`, borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: T.teal, fontWeight: 700, marginBottom: 8 }}>✓ Correct order:</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {correctOrder.map((item, i) => (
              <span key={i} style={{ background: T.s2, padding: "4px 12px", borderRadius: 8, fontWeight: 700, fontSize: 15, color: T.white }}>{item.label}</span>
            ))}
          </div>
        </div>
      )}

      {result === null && <button onClick={checkOrder} style={{ width: "100%", padding: "12px 0", borderRadius: 12, background: T.teal, color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer" }}>✓ Check Order</button>}
      {result === "correct" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.green, fontSize: 20, marginBottom: 12 }}>Perfect! +10 points</p>
          <button onClick={next} style={{ width: "100%", padding: "12px 0", borderRadius: 12, background: T.green, color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer" }}>Next Round →</button>
        </div>
      )}
      {result === "wrong" && (
        <div style={{ display: "flex", gap: 8 }}>
          {!showAnswer && <button onClick={() => setShowAnswer(true)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>Show Answer</button>}
          <button onClick={next} style={{ flex: 1, padding: "12px 0", borderRadius: 12, background: T.gold, color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>Try Another →</button>
        </div>
      )}
    </div>
  );
}
