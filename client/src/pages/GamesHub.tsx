import NavBar from "@/components/NavBar";
import GameCountdown from "@/games/GameCountdown";
import GameNumberBondMemory from "@/games/GameNumberBondMemory";
import GameMagicSquare from "@/games/GameMagicSquare";
import GameFunctionMachine from "@/games/GameFunctionMachine";
import GameTimesTableBlitz from "@/games/GameTimesTableBlitz";
import GameNumberPyramid from "@/games/GameNumberPyramid";
import GameOrderingChallenge from "@/games/GameOrderingChallenge";
import GameFractionSnap from "@/games/GameFractionSnap";
import GameNumberNinja from "@/games/GameNumberNinja";
import { useState } from "react";

type GameId = "ninja" | "blitz" | "pyramid" | "countdown" | "bonds" | "magic" | "ordering" | "fraction" | "function";

const GAMES: {
  id: GameId; icon: string; label: string; desc: string;
  color: string; bg: string; badge?: string; years?: string;
}[] = [
  {
    id: "ninja", icon: "🥷", label: "Number Ninja",
    desc: "Pick the right answer before the timer runs out! Speed increases every 5 rounds.",
    color: "#9B59B6", bg: "linear-gradient(135deg,#2d1b4e 0%,#1a0d2e 100%)",
    badge: "⚡ Fast", years: "Y1–6",
  },
  {
    id: "blitz", icon: "⚡", label: "Times Table Blitz",
    desc: "60 seconds. Answer as many times tables as you can. Build streaks for bonus points!",
    color: "#F5A623", bg: "linear-gradient(135deg,#3d2800 0%,#1a1200 100%)",
    badge: "🔥 Hot", years: "Y2–6",
  },
  {
    id: "bonds", icon: "🃏", label: "Number Bond Memory",
    desc: "Flip cards to find pairs that add up to the target. How fast can you match them all?",
    color: "#4ECDC4", bg: "linear-gradient(135deg,#0d3535 0%,#061a1a 100%)",
    badge: "🧠 Memory", years: "Y1–4",
  },
  {
    id: "countdown", icon: "🔢", label: "Countdown",
    desc: "Use 6 numbers with +−×÷ to hit a 3-digit target — just like on TV!",
    color: "#3498DB", bg: "linear-gradient(135deg,#0d2035 0%,#06101a 100%)",
    badge: "📺 Classic", years: "Y4–6",
  },
  {
    id: "fraction", icon: "🍕", label: "Fraction Snap",
    desc: "Tap all the fractions equivalent to the target before time runs out!",
    color: "#E67E22", bg: "linear-gradient(135deg,#3d1a00 0%,#1a0d00 100%)",
    badge: "🍕 Yummy", years: "Y3–6",
  },
  {
    id: "magic", icon: "✨", label: "Magic Square",
    desc: "Fill the grid so every row, column and diagonal adds to the magic number!",
    color: "#E91E8C", bg: "linear-gradient(135deg,#3d0020 0%,#1a0010 100%)",
    badge: "🔮 Tricky", years: "Y3–6",
  },
  {
    id: "pyramid", icon: "🔺", label: "Number Pyramids",
    desc: "Each block equals the sum of the two below. Fill in the missing numbers!",
    color: "#2ECC71", bg: "linear-gradient(135deg,#0d3520 0%,#06180e 100%)",
    badge: "🏗 Build", years: "Y2–5",
  },
  {
    id: "ordering", icon: "📊", label: "Ordering Challenge",
    desc: "Drag tiles into the right order — whole numbers, decimals, fractions or measurements.",
    color: "#1ABC9C", bg: "linear-gradient(135deg,#0d2d28 0%,#061510 100%)",
    badge: "🔀 Sort", years: "Y1–6",
  },
  {
    id: "function", icon: "⚙️", label: "Function Machine",
    desc: "Find the output, input, or crack the mystery rule of the number machine!",
    color: "#E74C3C", bg: "linear-gradient(135deg,#3d0d0d 0%,#1a0606 100%)",
    badge: "🤔 Logic", years: "Y3–6",
  },
];

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
    <div style={{ minHeight: "100vh", background: "#0F1B2D", color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Real NavBar — always visible */}
      <NavBar />

      {!active ? (
        /* ─── Games Hub Landing ─── */
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "44px 20px 80px" }}>
          {/* Page header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 68, marginBottom: 14, lineHeight: 1, filter: "drop-shadow(0 0 24px rgba(245,166,35,0.5))" }}>🎮</div>
            <h1 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: 40, color: "#fff", margin: "0 0 10px",
              textShadow: "0 2px 20px rgba(255,255,255,0.1)",
            }}>
              Games Hub
            </h1>
            <p style={{ color: "#B0C4DE", fontSize: 16, margin: 0 }}>
              9 maths games — pick one and play!
            </p>
          </div>

          {/* Game cards grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 20,
          }}>
            {GAMES.map((g) => (
              <button
                key={g.id}
                onClick={() => setActive(g.id)}
                style={{
                  background: g.bg,
                  border: `2px solid ${g.color}44`,
                  borderRadius: 22,
                  padding: "24px 20px 20px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "translateY(-5px) scale(1.02)";
                  el.style.borderColor = g.color;
                  el.style.boxShadow = `0 16px 40px ${g.color}44`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "translateY(0) scale(1)";
                  el.style.borderColor = `${g.color}44`;
                  el.style.boxShadow = "none";
                }}
              >
                {/* Glow blob */}
                <div style={{
                  position: "absolute", top: -40, right: -40,
                  width: 120, height: 120, borderRadius: "50%",
                  background: `${g.color}1a`, filter: "blur(28px)", pointerEvents: "none",
                }} />

                {/* Icon circle */}
                <div style={{
                  width: 60, height: 60, borderRadius: 18,
                  background: `${g.color}22`, border: `2px solid ${g.color}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, flexShrink: 0,
                  boxShadow: `0 4px 16px ${g.color}33`,
                }}>
                  {g.icon}
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {g.badge && (
                    <span style={{
                      padding: "3px 10px", borderRadius: 99,
                      background: `${g.color}33`, border: `1px solid ${g.color}77`,
                      color: g.color, fontSize: 11, fontWeight: 800,
                    }}>{g.badge}</span>
                  )}
                  {g.years && (
                    <span style={{
                      padding: "3px 10px", borderRadius: 99,
                      background: "rgba(255,255,255,0.08)", color: "#B0C4DE",
                      fontSize: 11, fontWeight: 700,
                    }}>{g.years}</span>
                  )}
                </div>

                {/* Title */}
                <div style={{
                  fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                  fontSize: 18, color: "#fff", lineHeight: 1.2,
                }}>
                  {g.label}
                </div>

                {/* Description */}
                <div style={{ fontSize: 13, color: "#B0C4DE", lineHeight: 1.55, flexGrow: 1 }}>
                  {g.desc}
                </div>

                {/* Play button */}
                <div style={{
                  alignSelf: "flex-end",
                  width: 38, height: 38, borderRadius: "50%",
                  background: `${g.color}22`, border: `2px solid ${g.color}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: g.color, fontSize: 15, fontWeight: 900,
                  boxShadow: `0 2px 10px ${g.color}33`,
                }}>
                  ▶
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ─── Active Game ─── */
        <div style={{ minHeight: "calc(100vh - 60px)" }}>
          {/* Game sub-bar */}
          <div style={{
            background: "rgba(15,27,45,0.97)", backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.09)",
            padding: "0 20px", height: 46,
            display: "flex", alignItems: "center", gap: 12,
            position: "sticky", top: 60, zIndex: 90,
          }}>
            <button
              onClick={() => setActive(null)}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#B0C4DE", borderRadius: 8, padding: "5px 14px",
                cursor: "pointer", fontSize: 13, fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
                display: "flex", alignItems: "center", gap: 6,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
            >
              ← All Games
            </button>
            {game && (
              <>
                <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 18 }}>|</span>
                <span style={{ fontSize: 18 }}>{game.icon}</span>
                <span style={{
                  fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                  fontSize: 15, color: "#fff",
                }}>{game.label}</span>
              </>
            )}
          </div>

          <div style={{ paddingTop: 8 }}>
            {renderGame()}
          </div>
        </div>
      )}
    </div>
  );
}
