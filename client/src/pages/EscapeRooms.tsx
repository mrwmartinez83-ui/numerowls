import { Link } from "wouter";

const ROOMS = [
  {
    tier: "bronze",
    emoji: "🌲",
    title: "The Enchanted Forest",
    subtitle: "Lift the curse and find your way home",
    yearRange: "Years 1–3",
    color: "#CD7F32",
    glow: "rgba(205,127,50,0.25)",
    bgCard: "linear-gradient(135deg, rgba(205,127,50,0.12), rgba(139,90,43,0.08))",
    badge: "🥉 Bronze",
    topics: ["Addition & Subtraction", "Doubling & Halving", "Multiplication", "Number Patterns"],
    stages: [
      { name: "The Mossy Gate", emoji: "🌿", desc: "Add three sacred stones to open the gate" },
      { name: "The Fairy Bridge", emoji: "🧚", desc: "Solve the fairy's two riddles to cross" },
      { name: "The Witch's Cauldron", emoji: "🧙", desc: "Find the right ingredient amounts" },
      { name: "The Troll's Toll", emoji: "👹", desc: "Complete the number pattern" },
      { name: "The Crystal Door", emoji: "💎", desc: "Solve four multiplications to escape" },
    ],
    description: "You are lost in an enchanted forest! Solve 5 magical puzzles — each one unlocks the next part of the path home. Work together and think carefully.",
  },
  {
    tier: "silver",
    emoji: "🏴‍☠️",
    title: "The Pirate's Vault",
    subtitle: "Crack the codes and escape the sunken ship",
    yearRange: "Years 3–5",
    color: "#C0C0C0",
    glow: "rgba(192,192,192,0.25)",
    bgCard: "linear-gradient(135deg, rgba(192,192,192,0.12), rgba(100,100,100,0.08))",
    badge: "🥈 Silver",
    topics: ["Multiplication (units digit)", "Division & Letter Codes", "Fractions of Amounts", "Factor Pairs", "Area & Perimeter"],
    stages: [
      { name: "The Sunken Deck", emoji: "🚢", desc: "Multiply and find units digits for the hatch code" },
      { name: "The Captain's Quarters", emoji: "🗺️", desc: "Solve divisions and decode a secret word" },
      { name: "The Treasure Hold", emoji: "💰", desc: "Calculate fractions of coin amounts" },
      { name: "The Engine Room", emoji: "⚙️", desc: "Count factor pairs to set the dials" },
      { name: "The Escape Hatch", emoji: "🔓", desc: "Calculate area and perimeter of shapes" },
    ],
    description: "Trapped in a sunken pirate ship! Crack 5 mathematical codes to unlock the vault, find the treasure, and reach the escape hatch.",
  },
  {
    tier: "gold",
    emoji: "🌌",
    title: "The Space Station Crisis",
    subtitle: "Solve the maths. Save the crew. Escape!",
    yearRange: "Years 5–6",
    color: "#FFD700",
    glow: "rgba(255,215,0,0.25)",
    bgCard: "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(200,150,0,0.08))",
    badge: "🥇 Gold",
    topics: ["BIDMAS / Order of Operations", "Prime Numbers", "Algebra (equations)", "Percentages & Ratio", "Speed, Distance, Time"],
    stages: [
      { name: "The Airlock", emoji: "🚀", desc: "Apply BIDMAS to open the emergency airlock" },
      { name: "The Reactor Core", emoji: "⚛️", desc: "Identify primes to stabilise the reactor" },
      { name: "The Navigation Bay", emoji: "🌌", desc: "Solve algebraic equations for coordinates" },
      { name: "The Life Support Room", emoji: "🫁", desc: "Calculate percentages and ratios for oxygen" },
      { name: "The Escape Pod", emoji: "🛸", desc: "Multi-step calculations to launch the pod" },
    ],
    description: "Space Station Omega is failing! Work through 5 high-stakes mathematical challenges to restore power and launch the escape pod before it's too late.",
  },
];

export default function EscapeRooms() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a 0%, #0d1a2e 100%)", fontFamily: "'Nunito', sans-serif", color: "white" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "64px", marginBottom: "12px" }}>🔐</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, margin: "0 0 10px", color: "white" }}>
            Maths Escape Rooms
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", margin: "0 0 20px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
            Story-driven maths adventures. Solve puzzles to escape — every run has different numbers!
          </p>
          <div style={{
            display: "inline-flex", gap: "20px", padding: "12px 24px", borderRadius: "12px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "13px", color: "rgba(255,255,255,0.6)", flexWrap: "wrap", justifyContent: "center",
          }}>
            <span>👥 Best played in groups of 2–4</span>
            <span>🎲 New numbers every time</span>
            <span>💡 Hints available (time penalty)</span>
            <span>⏱️ Race against the clock</span>
          </div>
        </div>

        {/* Room cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {ROOMS.map((room) => (
            <div
              key={room.tier}
              style={{
                background: room.bgCard,
                border: `1.5px solid ${room.color}30`,
                borderRadius: "20px",
                padding: "28px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* Left: emoji + tier */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "80px" }}>
                  <div style={{ fontSize: "56px", filter: `drop-shadow(0 0 16px ${room.glow})`, marginBottom: "8px" }}>
                    {room.emoji}
                  </div>
                  <div style={{
                    padding: "4px 10px", borderRadius: "20px",
                    background: `${room.color}20`, border: `1px solid ${room.color}50`,
                    color: room.color, fontSize: "12px", fontWeight: 800,
                  }}>
                    {room.badge}
                  </div>
                </div>

                {/* Right: content */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                    <div>
                      <h2 style={{ fontSize: "22px", fontWeight: 900, color: room.color, margin: "0 0 2px" }}>
                        {room.title}
                      </h2>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: "0 0 4px", fontStyle: "italic" }}>
                        {room.subtitle}
                      </p>
                      <span style={{
                        display: "inline-block", padding: "2px 10px", borderRadius: "20px",
                        background: "rgba(255,255,255,0.08)", fontSize: "12px", color: "rgba(255,255,255,0.5)",
                      }}>
                        📚 {room.yearRange}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "0 0 16px" }}>
                    {room.description}
                  </p>

                  {/* Topics */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: "6px" }}>
                      MATHS TOPICS
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {room.topics.map(t => (
                        <span key={t} style={{
                          padding: "3px 10px", borderRadius: "20px",
                          background: `${room.color}15`, border: `1px solid ${room.color}30`,
                          color: room.color, fontSize: "12px", fontWeight: 700,
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stages preview */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: "8px" }}>
                      5 STAGES
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {room.stages.map((stage, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "center", gap: "5px",
                          padding: "4px 10px", borderRadius: "8px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontSize: "12px", color: "rgba(255,255,255,0.6)",
                        }}>
                          <span>{stage.emoji}</span>
                          <span style={{ fontWeight: 700 }}>{stage.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link href={`/escape-rooms/${room.tier}`}>
                    <button style={{
                      padding: "12px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: 900,
                      background: `linear-gradient(135deg, ${room.color}, ${room.color}cc)`,
                      color: "#0a0a1a", border: "none", cursor: "pointer",
                      fontFamily: "'Nunito', sans-serif",
                      boxShadow: `0 4px 16px ${room.glow}`,
                    }}>
                      🔐 Enter {room.title} →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer tip */}
        <div style={{
          textAlign: "center", marginTop: "40px", padding: "20px",
          background: "rgba(255,255,255,0.04)", borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          fontSize: "14px", color: "rgba(255,255,255,0.5)",
        }}>
          💡 <strong style={{ color: "rgba(255,255,255,0.7)" }}>Teacher tip:</strong> Project the escape room on a whiteboard and let pupils work in teams. Each room takes 20–40 minutes depending on the group.
        </div>
      </div>
    </div>
  );
}
