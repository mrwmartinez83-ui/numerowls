import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
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

const PAIR_COLORS = [
  "#4ECDC4", "#F5A623", "#9B59B6", "#2ECC71",
  "#E74C3C", "#3498DB", "#E67E22", "#1ABC9C",
];

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
  const [matchAnim, setMatchAnim] = useState(new Set<number>());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  const pairCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8;

  const startGame = () => {
    const c = makePairs(target, pairCount);
    setCards(c); setFlipped([]); setMatched(new Set());
    setMoves(0); setElapsed(0); setWrongAnim(new Set()); setMatchAnim(new Set());
    setStartTime(Date.now()); setPhase("playing");
    lockRef.current = false;
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
        setMatchAnim(new Set([cards[a].id, cards[b].id]));
        setTimeout(() => {
          setMatched(m => { const next = new Set(Array.from(m)); next.add(cards[a].pairId); return next; });
          setMatchAnim(new Set());
          setFlipped([]);
          lockRef.current = false;
        }, 400);
      } else {
        setWrongAnim(new Set([cards[a].id, cards[b].id]));
        setTimeout(() => { setFlipped([]); setWrongAnim(new Set()); lockRef.current = false; }, 900);
      }
    }
  };

  useEffect(() => {
    if (phase === "playing" && matched.size === pairCount) {
      clearInterval(timerRef.current!);
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.4 }, colors: ["#4ECDC4", "#F5A623", "#fff", "#9B59B6"] });
      setTimeout(() => setPhase("result"), 700);
    }
  }, [matched, phase, pairCount]);

  const secs = (elapsed / 1000).toFixed(1);
  const cols = pairCount <= 4 ? 4 : 4;
  const score = Math.max(0, 100 - (moves - pairCount) * 5);

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(78,205,196,0.7))" }}>🃏</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Number Bond Memory</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Flip cards to find pairs that add up to the target!<br />Remember where each number is to find matches faster.</p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>BOND TARGET</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[10, 20, 50, 100].map(t => (
            <button key={t} onClick={() => setTarget(t)} style={{
              flex: 1, padding: "14px 0", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${target === t ? T.teal : T.border}`,
              background: target === t ? `${T.teal}22` : "transparent",
              color: target === t ? T.teal : T.muted,
              fontWeight: 900, fontFamily: "'Nunito',sans-serif", fontSize: 20,
              transition: "all 0.15s",
              boxShadow: target === t ? `0 4px 16px ${T.teal}44` : "none",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>DIFFICULTY</div>
        <div style={{ display: "flex", gap: 10 }}>
          {([["easy", "🌱", T.green, "4 pairs", "Beginner"], ["medium", "⭐", T.gold, "6 pairs", "Standard"], ["hard", "🔥", T.red, "8 pairs", "Expert"]] as const).map(([d, icon, col, pairs, label]) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              flex: 1, padding: "14px 8px", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${difficulty === d ? col : T.border}`,
              background: difficulty === d ? `${col}22` : "transparent",
              color: difficulty === d ? col : T.muted,
              fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 13,
              lineHeight: 1.6, transition: "all 0.15s",
              boxShadow: difficulty === d ? `0 4px 16px ${col}33` : "none",
            }}>{icon} {label}<br /><span style={{ fontSize: 11, opacity: 0.7 }}>{pairs}</span></button>
          ))}
        </div>
      </div>

      <button onClick={startGame} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.teal}, #38b2ac)`,
        color: T.bg, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.teal}55`,
        transition: "transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >🃏 Start!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 14, filter: "drop-shadow(0 0 28px rgba(78,205,196,0.6))" }}>🎉</div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 34, color: T.white, margin: "0 0 8px" }}>All Matched!</h2>
      <p style={{ color: T.muted, marginBottom: 32, fontSize: 15 }}>Every pair adds to <strong style={{ color: T.teal }}>{target}</strong></p>

      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        {([["Score", score, T.gold], ["Moves", moves, T.teal], ["Time", secs + "s", T.purple]] as const).map(([label, val, col]) => (
          <div key={label} style={{ flex: 1, background: T.s1, borderRadius: 16, padding: "18px 8px", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: col, fontFamily: "'Nunito',sans-serif" }}>{val}</div>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={startGame} style={{
          padding: "14px 32px", borderRadius: 14,
          background: `linear-gradient(135deg, ${T.teal}, #38b2ac)`,
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

  // ── Playing ──
  return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{
          padding: "8px 18px", borderRadius: 99,
          background: `${T.teal}22`, border: `1px solid ${T.teal}55`,
          color: T.teal, fontSize: 14, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
        }}>Bond: <strong>{target}</strong></span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.gold, fontSize: 22, textShadow: `0 0 16px ${T.gold}88` }}>
          {matched.size}/{pairCount} ✓
        </span>
        <span style={{
          padding: "8px 18px", borderRadius: 99,
          background: "rgba(255,255,255,0.07)", border: `1px solid ${T.border}`,
          color: T.muted, fontSize: 14, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
        }}>Moves: {moves}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: T.teal,
          width: `${(matched.size / pairCount) * 100}%`, transition: "width 0.4s ease",
          boxShadow: `0 0 10px ${T.teal}88`,
        }} />
      </div>

      {/* Card grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
        {cards.map((card, idx) => {
          const isFaceUp = flipped.includes(idx) || matched.has(card.pairId);
          const isMatched = matched.has(card.pairId);
          const isWrong = wrongAnim.has(card.id);
          const isMatchAnim = matchAnim.has(card.id);
          const pairColor = PAIR_COLORS[card.pairId % PAIR_COLORS.length];
          return (
            <button
              key={card.id}
              onClick={() => flip(idx)}
              style={{
                aspectRatio: "1",
                borderRadius: 18,
                border: `3px solid ${isMatched ? pairColor : isWrong ? T.red : isFaceUp ? T.gold : "rgba(255,255,255,0.12)"}`,
                background: isMatched ? `${pairColor}22` : isWrong ? `${T.red}15` : isFaceUp ? `${T.gold}15` : T.s2,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: isMatched ? "default" : "pointer",
                transition: "all 0.25s",
                transform: isMatchAnim ? "scale(1.12)" : isWrong ? "scale(0.94)" : isFaceUp ? "scale(1.04)" : "scale(1)",
                boxShadow: isMatched ? `0 0 20px ${pairColor}55` : isMatchAnim ? `0 0 28px ${T.gold}88` : "none",
              }}
            >
              {isFaceUp
                ? <span style={{
                    fontFamily: "'Nunito',sans-serif", fontWeight: 900,
                    fontSize: pairCount <= 4 ? 28 : 22,
                    color: isMatched ? pairColor : T.white,
                    textShadow: isMatched ? `0 0 12px ${pairColor}88` : "none",
                  }}>{card.value}</span>
                : <span style={{ fontSize: 28, opacity: 0.25 }}>?</span>}
            </button>
          );
        })}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: T.muted, marginTop: 18 }}>
        Find pairs that add to <strong style={{ color: T.teal }}>{target}</strong>
      </p>
    </div>
  );
}
