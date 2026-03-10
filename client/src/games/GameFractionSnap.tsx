import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
  orange: "#E67E22",
};

const FRACTION_FAMILIES: [number, number][][] = [
  [[1,2],[2,4],[3,6],[4,8],[5,10]],
  [[1,3],[2,6],[3,9],[4,12]],
  [[2,3],[4,6],[6,9],[8,12]],
  [[1,4],[2,8],[3,12],[4,16]],
  [[3,4],[6,8],[9,12]],
  [[1,5],[2,10],[3,15],[4,20]],
  [[2,5],[4,10],[6,15]],
  [[3,5],[6,10],[9,15]],
  [[4,5],[8,10],[12,15]],
  [[1,6],[2,12],[3,18]],
  [[5,6],[10,12]],
  [[1,8],[2,16],[3,24]],
  [[3,8],[6,16],[9,24]],
];

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }
function simplify(n: number, d: number): string {
  const g = gcd(n, d); return `${n/g}/${d/g}`;
}

interface FracCard { id: number; n: number; d: number; familyId: number; }

function buildRound(difficulty: string): { cards: FracCard[]; target: FracCard } {
  const count = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
  const familyIdx = Math.floor(Math.random() * FRACTION_FAMILIES.length);
  const family = FRACTION_FAMILIES[familyIdx];
  if (family.length < 2) return buildRound(difficulty);
  const shuffledFamily = [...family].sort(() => Math.random() - 0.5);
  const [targetFrac, ...matchFracs] = shuffledFamily;
  const matchCount = Math.min(count - 1, matchFracs.length);
  const correctMatches = matchFracs.slice(0, matchCount);
  const distractors: [number, number][] = [];
  const otherFamilies = FRACTION_FAMILIES.filter((_, i) => i !== familyIdx);
  while (distractors.length < count - 1 - matchCount) {
    const fam = otherFamilies[Math.floor(Math.random() * otherFamilies.length)];
    const frac = fam[Math.floor(Math.random() * fam.length)];
    const key = `${frac[0]}/${frac[1]}`;
    const alreadyIn = [...correctMatches, ...distractors].some(f => `${f[0]}/${f[1]}` === key);
    if (!alreadyIn) distractors.push(frac);
  }
  const allOptions = [
    ...correctMatches.map(f => ({ n: f[0], d: f[1], isMatch: true })),
    ...distractors.map(f => ({ n: f[0], d: f[1], isMatch: false })),
  ];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);
  const cards: FracCard[] = shuffled.map((f, i) => ({ id: i, n: f.n, d: f.d, familyId: f.isMatch ? familyIdx : -1 - i }));
  const target: FracCard = { id: 99, n: targetFrac[0], d: targetFrac[1], familyId: familyIdx };
  return { cards, target };
}

function FracDisplay({ n, d, size = 32, color = T.white }: { n: number; d: number; size?: number; color?: string }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1, gap: 3 }}>
      <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: size, color, lineHeight: 1 }}>{n}</span>
      <div style={{ width: "100%", height: 3, background: color, borderRadius: 2 }} />
      <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: size, color, lineHeight: 1 }}>{d}</span>
    </div>
  );
}

interface Props { onBack: () => void; }

export default function GameFractionSnap({ onBack }: Props) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [cards, setCards] = useState<FracCard[]>([]);
  const [target, setTarget] = useState<FracCard | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(90);
  const [feedback, setFeedback] = useState<{ id: number; correct: boolean } | null>(null);
  const [correctIds, setCorrectIds] = useState(new Set<number>());
  const [wrongIds, setWrongIds] = useState(new Set<number>());
  const [roundFlash, setRoundFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  const startGame = () => {
    const { cards: c, target: t } = buildRound(difficulty);
    setCards(c); setTarget(t); setScore(0); setRound(1); setTimeLeft(90);
    setCorrectIds(new Set()); setWrongIds(new Set()); setFeedback(null); setRoundFlash(false);
    lockRef.current = false;
    setPhase("playing");
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

  const tap = (card: FracCard) => {
    if (!target || lockRef.current || correctIds.has(card.id) || wrongIds.has(card.id)) return;
    const isMatch = card.familyId === target.familyId;
    setFeedback({ id: card.id, correct: isMatch });
    lockRef.current = true;

    if (isMatch) {
      const newCorrect = new Set(Array.from(correctIds));
      newCorrect.add(card.id);
      setCorrectIds(newCorrect);
      setScore(s => s + 10);
      const totalMatches = cards.filter(c => c.familyId === target.familyId).length;
      if (newCorrect.size >= totalMatches) {
        // Round complete!
        setRoundFlash(true);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 }, colors: ["#E67E22", "#F5A623", "#fff", "#4ECDC4"] });
        setTimeout(() => {
          const { cards: nc, target: nt } = buildRound(difficulty);
          setCards(nc); setTarget(nt); setRound(r => r + 1);
          setCorrectIds(new Set()); setWrongIds(new Set());
          setFeedback(null); setRoundFlash(false);
          lockRef.current = false;
        }, 600);
      } else {
        setTimeout(() => { setFeedback(null); lockRef.current = false; }, 400);
      }
    } else {
      const newWrong = new Set(Array.from(wrongIds));
      newWrong.add(card.id);
      setWrongIds(newWrong);
      setScore(s => Math.max(0, s - 3));
      setTimeout(() => { setFeedback(null); lockRef.current = false; }, 500);
    }
  };

  const timerPct = timeLeft / 90;
  const timerCol = timerPct > 0.5 ? T.teal : timerPct > 0.25 ? T.gold : T.red;

  // ── Setup ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(230,126,34,0.7))" }}>🍕</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: T.white, margin: "0 0 10px" }}>Fraction Snap</h2>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Tap all the fractions equivalent to the target!<br />+10 for correct · −3 for wrong · 90 seconds</p>
      </div>

      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: T.muted, letterSpacing: 1, marginBottom: 14 }}>DIFFICULTY</div>
        <div style={{ display: "flex", gap: 10 }}>
          {([["easy", "🌱", T.green, "3 cards", "Beginner"], ["medium", "⭐", T.gold, "4 cards", "Standard"], ["hard", "🔥", T.red, "5 cards", "Expert"]] as const).map(([d, icon, col, cards, label]) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              flex: 1, padding: "14px 8px", borderRadius: 14, cursor: "pointer",
              border: `2px solid ${difficulty === d ? col : T.border}`,
              background: difficulty === d ? `${col}22` : "transparent",
              color: difficulty === d ? col : T.muted,
              fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 13,
              lineHeight: 1.6, transition: "all 0.15s",
              boxShadow: difficulty === d ? `0 4px 16px ${col}33` : "none",
            }}>{icon} {label}<br /><span style={{ fontSize: 11, opacity: 0.7 }}>{cards}</span></button>
          ))}
        </div>
      </div>

      <button onClick={startGame} style={{
        width: "100%", padding: "18px 0", borderRadius: 16, fontSize: 20,
        fontWeight: 900, fontFamily: "'Nunito',sans-serif",
        background: `linear-gradient(135deg, ${T.orange}, #c0392b)`,
        color: T.white, border: "none", cursor: "pointer",
        boxShadow: `0 8px 28px ${T.orange}55`,
        transition: "transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >🍕 Start Snapping!</button>
    </div>
  );

  // ── Result ──
  if (phase === "result") {
    const medal = score >= 80 ? "🏆" : score >= 40 ? "⭐" : "💪";
    if (score >= 80) confetti({ particleCount: 120, spread: 100, origin: { y: 0.4 }, colors: ["#E67E22", "#F5A623", "#fff"] });
    return (
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 14, filter: "drop-shadow(0 0 28px rgba(230,126,34,0.6))" }}>{medal}</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 34, color: T.white, margin: "0 0 8px" }}>Time's Up!</h2>
        <div style={{ fontSize: 68, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", margin: "0 0 8px", textShadow: `0 0 40px ${T.gold}99` }}>{score}</div>
        <p style={{ color: T.muted, marginBottom: 12, fontSize: 15 }}>{round - 1} rounds completed</p>
        <p style={{ color: T.teal, fontSize: 13, marginBottom: 32 }}>💡 Equivalent fractions have the same simplified form</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={startGame} style={{
            padding: "14px 32px", borderRadius: 14,
            background: `linear-gradient(135deg, ${T.orange}, #c0392b)`,
            color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer",
            boxShadow: `0 6px 20px ${T.orange}55`,
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
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: `${timerCol}22`, border: `3px solid ${timerCol}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 18, color: timerCol,
          boxShadow: `0 0 16px ${timerCol}55`,
          transition: "border-color 0.5s, color 0.5s",
        }}>{timeLeft}</div>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: T.gold, textShadow: `0 0 20px ${T.gold}88` }}>{score} pts</span>
        <span style={{
          padding: "8px 18px", borderRadius: 99,
          background: `${T.purple}22`, border: `1px solid ${T.purple}55`,
          color: T.purple, fontSize: 14, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
        }}>Round {round}</span>
      </div>

      {/* Timer bar */}
      <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: timerCol,
          width: `${timerPct * 100}%`, transition: "width 1s linear, background 0.5s",
          boxShadow: `0 0 10px ${timerCol}88`,
        }} />
      </div>

      {/* Target fraction */}
      <div style={{
        textAlign: "center", marginBottom: 24,
        background: roundFlash ? `${T.green}22` : `${T.orange}15`,
        border: `3px solid ${roundFlash ? T.green : T.orange}`,
        borderRadius: 24, padding: "24px 20px",
        transition: "all 0.3s",
        boxShadow: roundFlash ? `0 0 40px ${T.green}55` : `0 0 20px ${T.orange}22`,
      }}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>FIND FRACTIONS EQUAL TO</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          {target && <FracDisplay n={target.n} d={target.d} size={48} color={roundFlash ? T.green : T.orange} />}
        </div>
        <div style={{ fontSize: 12, color: T.muted }}>= {target ? simplify(target.n, target.d) : ""} in simplest form</div>
        {roundFlash && <div style={{ fontSize: 18, fontWeight: 900, color: T.green, marginTop: 8, fontFamily: "'Nunito',sans-serif" }}>🎉 Round Complete!</div>}
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {cards.map(card => {
          const isCorrect = correctIds.has(card.id);
          const isWrong = wrongIds.has(card.id);
          const isFeedback = feedback?.id === card.id;
          return (
            <button
              key={card.id}
              onClick={() => tap(card)}
              disabled={isCorrect}
              style={{
                padding: "28px 16px", borderRadius: 20,
                border: `3px solid ${isCorrect ? T.green : isWrong ? T.red : isFeedback ? (feedback!.correct ? T.green : T.red) : "rgba(255,255,255,0.12)"}`,
                background: isCorrect ? `${T.green}22` : isWrong ? `${T.red}12` : T.s1,
                cursor: isCorrect ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
                transition: "all 0.2s",
                transform: isCorrect ? "scale(1.04)" : isFeedback && !feedback?.correct ? "scale(0.95)" : "scale(1)",
                boxShadow: isCorrect ? `0 0 24px ${T.green}55` : "none",
              }}
              onMouseEnter={e => { if (!isCorrect) { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; (e.currentTarget as HTMLButtonElement).style.borderColor = T.orange; } }}
              onMouseLeave={e => { if (!isCorrect) { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.borderColor = isWrong ? T.red : "rgba(255,255,255,0.12)"; } }}
            >
              <FracDisplay n={card.n} d={card.d} size={32} color={isCorrect ? T.green : isWrong ? T.red : T.white} />
              {isCorrect && <span style={{ position: "absolute", top: 8, right: 10, fontSize: 18 }}>✅</span>}
              {isWrong && <span style={{ position: "absolute", top: 8, right: 10, fontSize: 18 }}>❌</span>}
            </button>
          );
        })}
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 16 }}>Tap all equivalent fractions · +10 correct · −3 wrong</p>
    </div>
  );
}
