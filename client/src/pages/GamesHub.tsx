import { useState } from "react";
import GameCountdown from "@/games/GameCountdown";
import GameNumberBondMemory from "@/games/GameNumberBondMemory";
import GameMagicSquare from "@/games/GameMagicSquare";
import GameFunctionMachine from "@/games/GameFunctionMachine";
import GameTimesTableBlitz from "@/games/GameTimesTableBlitz";
import GameNumberPyramid from "@/games/GameNumberPyramid";
import GameOrderingChallenge from "@/games/GameOrderingChallenge";
import GameFractionSnap from "@/games/GameFractionSnap";
import GameNumberNinja from "@/games/GameNumberNinja";

const T = {
  bg: "#0F1B2D", s1: "#1A2E4A", s2: "#243B55",
  border: "rgba(255,255,255,0.09)", gold: "#F5A623", teal: "#4ECDC4",
  purple: "#9B59B6", green: "#2ECC71", red: "#E74C3C",
  pink: "#E91E8C", orange: "#E67E22", muted: "#B0C4DE", white: "#FFFFFF",
};

interface GameDef {
  id: string;
  icon: string;
  label: string;
  color: string;
  desc: string;
  badge?: string;
  years?: string;
}

const GAMES: GameDef[] = [
  { id: "ninja",    icon: "🥷",  label: "Number Ninja",         color: T.purple, desc: "Pick the right answer before the timer runs out! Speed increases every 5 rounds.", badge: "NEW", years: "Y1–Y6" },
  { id: "blitz",    icon: "✖️",  label: "Times Table Blitz",    color: T.gold,   desc: "60 seconds. Answer as many times tables as you can. Build streaks for bonus points!", years: "Y2–Y6" },
  { id: "pyramid",  icon: "🔺",  label: "Number Pyramids",      color: T.teal,   desc: "Each block equals the sum of the two below. Fill in the missing numbers!", years: "Y1–Y6" },
  { id: "countdown",icon: "🔢",  label: "Countdown",            color: "#3498DB",desc: "Use 6 numbers with +−×÷ to hit a 3-digit target. 30 seconds on the clock!", years: "Y4–Y6" },
  { id: "bonds",    icon: "🃏",  label: "Number Bond Memory",   color: T.teal,   desc: "Flip cards to find pairs that add up to the bond target. How fast can you match them all?", years: "Y1–Y4" },
  { id: "magic",    icon: "✨",  label: "Magic Square",         color: T.pink,   desc: "Fill the grid so every row, column and diagonal adds to the magic number!", years: "Y3–Y6" },
  { id: "ordering", icon: "🔀",  label: "Ordering Challenge",   color: T.teal,   desc: "Drag tiles into the right order — whole numbers, decimals, fractions or measurements.", years: "Y1–Y6" },
  { id: "fraction", icon: "🍕",  label: "Fraction Snap",        color: T.orange, desc: "Tap all the fractions equivalent to the target before time runs out!", badge: "NEW", years: "Y3–Y6" },
  { id: "function", icon: "⚙️",  label: "Function Machine",     color: T.purple, desc: "Find the output, input, or crack the rule of the mystery number machine!", years: "Y2–Y6" },
];

type GameId = typeof GAMES[number]["id"];

export default function GamesHub() {
  const [active, setActive] = useState<GameId | null>(null);
  const game = GAMES.find(g => g.id === active);

  const renderGame = () => {
    const back = () => setActive(null);
    switch (active) {
      case "ninja":     return <GameNumberNinja onBack={back} />;
      case "blitz":     return <GameTimesTableBlitz onBack={back} />;
      case "pyramid":   return <GameNumberPyramid onBack={back} />;
      case "countdown": return <GameCountdown onBack={back} />;
      case "bonds":     return <GameNumberBondMemory onBack={back} />;
      case "magic":     return <GameMagicSquare onBack={back} />;
      case "ordering":  return <GameOrderingChallenge onBack={back} />;
      case "fraction":  return <GameFractionSnap onBack={back} />;
      case "function":  return <GameFunctionMachine onBack={back} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "rgba(15,27,45,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}`, padding: "0 24px", display: "flex", alignItems: "center", height: 56, gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ fontSize: 22 }}>🦉</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, color: T.gold, fontSize: 16 }}>NumerOwls</span>
        <span style={{ color: T.border, fontSize: 20 }}>|</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 14, color: T.muted }}>🎮 Games Hub</span>
        {active && game && (
          <>
            <span style={{ color: T.border, fontSize: 20 }}>|</span>
            <span style={{ fontSize: 17 }}>{game.icon}</span>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 14, color: T.muted }}>{game.label}</span>
            <button onClick={() => setActive(null)} style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>← All Games</button>
          </>
        )}
      </div>

      {!active ? (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎮</div>
            <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: T.white, marginBottom: 8 }}>Games Hub</h1>
            <p style={{ color: T.muted, fontSize: 14 }}>9 maths games — pick one to play</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {GAMES.map((g, i) => (
              <button key={g.id} onClick={() => setActive(g.id)} style={{ background: T.s1, border: `2px solid ${T.border}`, borderRadius: 18, padding: "18px 22px", display: "flex", alignItems: "center", gap: 18, cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s", animationDelay: `${i * 0.05}s` }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = g.color; (e.currentTarget as HTMLButtonElement).style.background = T.s2; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; (e.currentTarget as HTMLButtonElement).style.background = T.s1; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${g.color}22`, border: `2px solid ${g.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{g.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, color: T.white }}>{g.label}</span>
                    {g.badge && <span style={{ padding: "2px 8px", borderRadius: 99, background: `${g.color}33`, border: `1px solid ${g.color}66`, color: g.color, fontSize: 10, fontWeight: 800 }}>{g.badge}</span>}
                    {g.years && <span style={{ padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.06)", color: T.muted, fontSize: 10, fontWeight: 700 }}>{g.years}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.4 }}>{g.desc}</div>
                </div>
                <div style={{ color: g.color, fontSize: 22, fontWeight: 900, fontFamily: "'Nunito',sans-serif", flexShrink: 0 }}>→</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ paddingTop: 8 }}>
          {renderGame()}
        </div>
      )}
    </div>
  );
}
