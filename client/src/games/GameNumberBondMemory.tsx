import { useState, useEffect, useRef } from "react";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
};

function shuffleArr<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

interface CardItem { id: number; value: number; pairId: number; }

function makePairs(target: number, count: number): CardItem[] {
  const candidates: [number, number][] = [];
  for (let a = 1; a < target; a++) if (a < target - a) candidates.push([a, target - a]);
  const chosen = shuffleArr(candidates).slice(0, count);
  const cards: CardItem[] = [];
  chosen.forEach(([a, b], i) => {
    cards.push({ id: i * 2, value: a, pairId: i });
    cards.push({ id: i * 2 + 1, value: b, pairId: i });
  });
  return shuffleArr(cards);
}

interface Props { onBack: () => void; }

export default function GameNumberBondMemory({ onBack }: Props) {
  const [target, setTarget] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState(new Set<number>());
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [wrongAnim, setWrongAnim] = useState(new Set<number>());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  const pairCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8;

  const startGame = () => {
    const c = makePairs(target, pairCount);
    setCards(c); setFlipped([]); setMatched(new Set());
    setMoves(0); setElapsed(0); setWrongAnim(new Set());
    setStartTime(Date.now()); setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => setElapsed(Date.now() - (startTime ?? Date.now())), 100);
    return () => clearInterval(timerRef.current!);
  }, [phase, startTime]);

  const flip = (idx: number) => {
    if (lockRef.current || flipped.includes(idx) || matched.has(cards[idx].pairId)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      lockRef.current = true;
      const [a, b] = newFlipped;
      if (cards[a].pairId === cards[b].pairId) {
        setTimeout(() => {
          setMatched(m => { const next = new Set(Array.from(m)); next.add(cards[a].pairId); return next; });
          setFlipped([]);
          lockRef.current = false;
        }, 350);
      } else {
        setWrongAnim(new Set([cards[a].id, cards[b].id]));
        setTimeout(() => { setFlipped([]); setWrongAnim(new Set()); lockRef.current = false; }, 850);
      }
    }
  };

  useEffect(() => {
    if (phase === "playing" && matched.size === pairCount) {
      clearInterval(timerRef.current!);
      setTimeout(() => setPhase("result"), 500);
    }
  }, [matched, phase, pairCount]);

  const secs = (elapsed / 1000).toFixed(1);
  const cols = pairCount <= 4 ? 4 : 4;

  if (phase === "setup") return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🃏</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Number Bond Memory</h2>
        <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>Flip cards to find pairs that add up to the bond target!</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 16 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>BOND TARGET</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[10, 20, 50, 100].map(t => (
            <button key={t} onClick={() => setTarget(t)} style={{
              padding: "10px 20px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${target === t ? T.teal : T.border}`,
              background: target === t ? `${T.teal}22` : "transparent",
              color: target === t ? T.teal : T.muted, fontWeight: 800,
              fontFamily: "'Nunito',sans-serif", fontSize: 18, transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>DIFFICULTY</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([["easy", "🌱", T.green, "4 pairs"], ["medium", "⭐", T.gold, "6 pairs"], ["hard", "🔥", T.red, "8 pairs"]] as const).map(([d, icon, col, label]) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              flex: 1, padding: "12px 6px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${difficulty === d ? col : T.border}`,
              background: difficulty === d ? `${col}22` : "transparent",
              color: difficulty === d ? col : T.muted, fontWeight: 800,
              fontFamily: "'Nunito',sans-serif", fontSize: 12, lineHeight: 1.7,
            }}>{icon} {d[0].toUpperCase() + d.slice(1)}<br /><span style={{ fontSize: 10, opacity: 0.7 }}>{label}</span></button>
          ))}
        </div>
      </div>
      <button onClick={startGame} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", background: T.teal, color: T.bg, border: "none", cursor: "pointer" }}>🃏 Start!</button>
    </div>
  );

  if (phase === "result") return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 12 }}>🎉</div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: T.white, marginBottom: 4 }}>All Matched!</h2>
      <p style={{ color: T.muted, marginBottom: 24 }}>Every pair adds to <strong style={{ color: T.teal }}>{target}</strong></p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
        {([["Moves", moves, T.gold], ["Time", secs + "s", T.teal], ["Score", Math.max(0, 100 - (moves - pairCount) * 5), T.green]] as const).map(([label, val, col]) => (
          <div key={label} style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: col, fontFamily: "'Nunito',sans-serif" }}>{val}</div>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={startGame} style={{ padding: "11px 24px", borderRadius: 12, background: T.teal, color: T.bg, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>🔁 Play Again</button>
        <button onClick={onBack} style={{ padding: "11px 24px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>← All Games</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 99, background: `${T.teal}22`, border: `1px solid ${T.teal}55`, color: T.teal, fontSize: 12, fontWeight: 700 }}>Bond: {target}</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.gold, fontSize: 18 }}>{matched.size}/{pairCount}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 99, background: `${T.muted}22`, border: `1px solid ${T.muted}55`, color: T.muted, fontSize: 12, fontWeight: 700 }}>Moves: {moves}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 10 }}>
        {cards.map((card, idx) => {
          const isFaceUp = flipped.includes(idx) || matched.has(card.pairId);
          const isMatched = matched.has(card.pairId);
          const isWrong = wrongAnim.has(card.id);
          return (
            <button key={card.id} onClick={() => flip(idx)} style={{
              aspectRatio: "1", borderRadius: 14,
              border: `2px solid ${isMatched ? T.teal : isWrong ? T.red : isFaceUp ? T.gold : T.border}`,
              background: isMatched ? `${T.teal}22` : isWrong ? `${T.red}15` : isFaceUp ? `${T.gold}15` : T.s2,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: isMatched ? "default" : "pointer", transition: "all 0.25s",
            }}>
              {isFaceUp
                ? <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: isMatched ? T.teal : T.white }}>{card.value}</span>
                : <span style={{ fontSize: 22, opacity: 0.3 }}>?</span>}
            </button>
          );
        })}
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 16 }}>
        Find pairs that add to <strong style={{ color: T.teal }}>{target}</strong>
      </p>
    </div>
  );
}
