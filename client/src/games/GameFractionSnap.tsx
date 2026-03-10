import { useState, useEffect, useRef } from "react";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  green: "#2ECC71", red: "#E74C3C", muted: "#B0C4DE", white: "#FFFFFF",
  orange: "#E67E22",
};

// Fraction families: each group contains equivalent fractions
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
  const g = gcd(n, d);
  return `${n/g}/${d/g}`;
}

interface FracCard { id: number; n: number; d: number; familyId: number; }

function buildRound(difficulty: string): { cards: FracCard[]; target: FracCard } {
  const count = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
  // pick a random family
  const familyIdx = Math.floor(Math.random() * FRACTION_FAMILIES.length);
  const family = FRACTION_FAMILIES[familyIdx];
  if (family.length < 2) {
    // fallback
    return buildRound(difficulty);
  }
  const shuffledFamily = [...family].sort(() => Math.random() - 0.5);
  const [targetFrac, ...matchFracs] = shuffledFamily;
  const matchCount = Math.min(count - 1, matchFracs.length);
  const correctMatches = matchFracs.slice(0, matchCount);

  // pick distractors from OTHER families
  const distractors: [number, number][] = [];
  const otherFamilies = FRACTION_FAMILIES.filter((_, i) => i !== familyIdx);
  while (distractors.length < count - 1 - matchCount) {
    const fam = otherFamilies[Math.floor(Math.random() * otherFamilies.length)];
    const frac = fam[Math.floor(Math.random() * fam.length)];
    const key = `${frac[0]}/${frac[1]}`;
    const alreadyIn = [...correctMatches, ...distractors].some(f => `${f[0]}/${f[1]}` === key);
    if (!alreadyIn) distractors.push(frac);
  }

  const allOptions = [...correctMatches.map(f => ({ n: f[0], d: f[1], isMatch: true })), ...distractors.map(f => ({ n: f[0], d: f[1], isMatch: false }))];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  const cards: FracCard[] = shuffled.map((f, i) => ({ id: i, n: f.n, d: f.d, familyId: f.isMatch ? familyIdx : -1 - i }));
  const target: FracCard = { id: 99, n: targetFrac[0], d: targetFrac[1], familyId: familyIdx };
  return { cards, target };
}

function FracDisplay({ n, d, size = 32 }: { n: number; d: number; size?: number }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1, gap: 1 }}>
      <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: size, color: T.white }}>{n}</span>
      <div style={{ width: "100%", height: 2, background: T.white, borderRadius: 1 }} />
      <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: size, color: T.white }}>{d}</span>
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  const startGame = () => {
    const { cards: c, target: t } = buildRound(difficulty);
    setCards(c); setTarget(t); setScore(0); setRound(1); setTimeLeft(90);
    setCorrectIds(new Set()); setWrongIds(new Set()); setFeedback(null);
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
      // check if all correct matches found
      const totalMatches = cards.filter(c => c.familyId === target.familyId).length;
      setTimeout(() => {
        setFeedback(null);
        lockRef.current = false;
        if (newCorrect.size >= totalMatches) {
          // next round
          const { cards: nc, target: nt } = buildRound(difficulty);
          setCards(nc); setTarget(nt); setRound(r => r + 1);
          setCorrectIds(new Set()); setWrongIds(new Set());
        }
      }, 400);
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

  if (phase === "setup") return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🍕</div>
        <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: T.white, marginBottom: 8 }}>Fraction Snap</h2>
        <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>Tap all the fractions that are equivalent to the target! +10 for correct, −3 for wrong.</p>
      </div>
      <div style={{ background: T.s1, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: T.muted, marginBottom: 12 }}>DIFFICULTY</p>
        <div style={{ display: "flex", gap: 8 }}>
          {([["easy", "🌱", T.green, "3 cards"], ["medium", "⭐", T.gold, "4 cards"], ["hard", "🔥", T.red, "5 cards"]] as const).map(([d, icon, col, label]) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{ flex: 1, padding: "12px 6px", borderRadius: 10, cursor: "pointer", border: `2px solid ${difficulty === d ? col : T.border}`, background: difficulty === d ? `${col}22` : "transparent", color: difficulty === d ? col : T.muted, fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 12, lineHeight: 1.7 }}>{icon} {d[0].toUpperCase() + d.slice(1)}<br /><span style={{ fontSize: 10, opacity: 0.7 }}>{label}</span></button>
          ))}
        </div>
      </div>
      <button onClick={startGame} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", background: T.orange, color: T.white, border: "none", cursor: "pointer" }}>🍕 Start Snapping!</button>
    </div>
  );

  if (phase === "result") return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 12 }}>{score >= 80 ? "🏆" : score >= 40 ? "🦉" : "💪"}</div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: T.white, marginBottom: 4 }}>Time's Up!</h2>
      <div style={{ fontSize: 56, fontWeight: 900, color: T.gold, fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>{score}</div>
      <p style={{ color: T.muted, marginBottom: 8 }}>points · {round - 1} rounds completed</p>
      <p style={{ color: T.teal, fontSize: 13, marginBottom: 24 }}>Equivalent fractions have the same simplified form</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={startGame} style={{ padding: "11px 24px", borderRadius: 12, background: T.orange, color: T.white, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>🔁 Play Again</button>
        <button onClick={onBack} style={{ padding: "11px 24px", borderRadius: 12, background: T.s2, color: T.muted, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, border: `1px solid ${T.border}`, cursor: "pointer" }}>← All Games</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ padding: "4px 12px", borderRadius: 99, background: `${timerCol}22`, border: `1px solid ${timerCol}55`, color: timerCol, fontSize: 12, fontWeight: 700 }}>⏱ {timeLeft}s</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20, color: T.gold }}>{score} pts</span>
        <span style={{ padding: "4px 12px", borderRadius: 99, background: `${T.muted}22`, border: `1px solid ${T.muted}55`, color: T.muted, fontSize: 12, fontWeight: 700 }}>Round {round}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: timerCol, width: `${timerPct * 100}%`, transition: "width 1s linear" }} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: T.muted, fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>FIND FRACTIONS EQUAL TO</p>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: `${T.orange}22`, border: `2px solid ${T.orange}`, borderRadius: 20, padding: "16px 40px" }}>
          {target && <FracDisplay n={target.n} d={target.d} size={40} />}
        </div>
        <p style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>= {target ? simplify(target.n, target.d) : ""} in simplest form</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {cards.map(card => {
          const isCorrect = correctIds.has(card.id);
          const isWrong = wrongIds.has(card.id);
          const isFeedback = feedback?.id === card.id;
          return (
            <button key={card.id} onClick={() => tap(card)} disabled={isCorrect} style={{ padding: "20px 12px", borderRadius: 16, border: `2px solid ${isCorrect ? T.green : isWrong ? T.red : isFeedback ? (feedback.correct ? T.green : T.red) : T.border}`, background: isCorrect ? `${T.green}22` : isWrong ? `${T.red}10` : T.s1, cursor: isCorrect ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", position: "relative" }}>
              <FracDisplay n={card.n} d={card.d} size={28} />
              {isCorrect && <span style={{ position: "absolute", top: 6, right: 8, fontSize: 14 }}>✅</span>}
              {isWrong && <span style={{ position: "absolute", top: 6, right: 8, fontSize: 14 }}>❌</span>}
            </button>
          );
        })}
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 16 }}>Tap all equivalent fractions · +10 correct · −3 wrong</p>
    </div>
  );
}
