import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState } from "react";

// ── Badge Definitions — tied to REAL mathematical milestones ────────────────
// Each badge has: what you DO to earn it, not just a count

export const ALL_BADGES = [
  // ── Bronze — first achievements ──────────────────────────────────────────
  {
    id: "first_question", icon: "🌟", name: "First Steps",
    desc: "Answer your very first question",
    howTo: "Just start! Answer any question.",
    tier: "bronze", category: "milestone",
  },
  {
    id: "work_backwards_3", icon: "⏪", name: "Time Traveller",
    desc: "Solve 3 'work backwards' problems correctly",
    howTo: "Look for questions with function machines and work from the output back.",
    tier: "bronze", category: "skill",
  },
  {
    id: "first_5pt", icon: "💥", name: "Big Brain",
    desc: "Answer a 5-point question correctly (no hint)",
    howTo: "Attempt a 5-point question without using the hint button.",
    tier: "bronze", category: "skill",
  },
  {
    id: "streak_3", icon: "🔥", name: "Hat-Trick",
    desc: "Get 3 questions in a row correct",
    howTo: "Answer three consecutive questions correctly in any session.",
    tier: "bronze", category: "streak",
  },
  {
    id: "all_skill_types", icon: "🗺️", name: "Explorer",
    desc: "Attempt at least one question from all 9 skill areas",
    howTo: "Try every skill category — addition, shapes, fractions, and all the rest.",
    tier: "bronze", category: "breadth",
  },
  {
    id: "potw_enter", icon: "📬", name: "Weekly Regular",
    desc: "Enter the Problem of the Week",
    howTo: "Submit an answer to any Problem of the Week competition.",
    tier: "bronze", category: "engagement",
  },

  // ── Silver — developing competition skills ────────────────────────────────
  {
    id: "logic_ace", icon: "🧠", name: "Logic Master",
    desc: "Get 5 logic/deduction problems correct",
    howTo: "Solve logic problems — Knights & Knaves, ordering clues, tournament tables.",
    tier: "silver", category: "skill",
  },
  {
    id: "handshakes_insight", icon: "🤝", name: "Social Butterfly",
    desc: "Solve a handshakes/counting problem using the n(n-1)/2 method",
    howTo: "Correctly answer a handshakes or matches-in-a-tournament problem.",
    tier: "silver", category: "skill",
  },
  {
    id: "consecutive_5", icon: "📶", name: "In Sequence",
    desc: "Solve 5 consecutive-numbers problems",
    howTo: "Answer questions about consecutive numbers, triangular numbers, and sequences.",
    tier: "silver", category: "skill",
  },
  {
    id: "timed_pass", icon: "⏱️", name: "Under Pressure",
    desc: "Score 60% or more in Timed Paper Mode",
    howTo: "Complete a timed exam paper and achieve at least 60%.",
    tier: "silver", category: "exam",
  },
  {
    id: "no_hints_10", icon: "🎯", name: "Pure Thinking",
    desc: "Answer 10 questions correctly without using a single hint",
    howTo: "Resist the hint button! Trust your reasoning.",
    tier: "silver", category: "strategy",
  },
  {
    id: "potw_correct", icon: "⭐", name: "Star of the Week",
    desc: "Solve the Problem of the Week correctly",
    howTo: "Submit the correct answer to a weekly competition problem.",
    tier: "silver", category: "engagement",
  },
  {
    id: "streak_7", icon: "🏅", name: "7-Day Champion",
    desc: "Practise 7 days in a row",
    howTo: "Come back every day for a week — even one question counts!",
    tier: "silver", category: "streak",
  },

  // ── Gold — competition-ready ──────────────────────────────────────────────
  {
    id: "timed_merit", icon: "🥇", name: "Gold Standard",
    desc: "Score 80% or more in Timed Paper Mode",
    howTo: "Complete a timed exam paper and achieve 80% or above.",
    tier: "gold", category: "exam",
  },
  {
    id: "all_styles_correct", icon: "🔮", name: "All-Rounder",
    desc: "Get at least one question right in every question style",
    howTo: "Correctly answer questions across all different problem types.",
    tier: "gold", category: "breadth",
  },
  {
    id: "pmc_ready", icon: "🏆", name: "PMC Ready",
    desc: "Score 80%+ on a full Y5-6 paper in Timed Mode",
    howTo: "Complete the Senior Timed Paper and score 80% or above.",
    tier: "gold", category: "exam",
  },
  {
    id: "top_10", icon: "🌟", name: "Top 10",
    desc: "Reach the top 10 on the leaderboard",
    howTo: "Keep practising and climbing the rankings!",
    tier: "gold", category: "social",
  },
  {
    id: "perfect_paper", icon: "💎", name: "Perfect Paper",
    desc: "Score 100% on any Timed Paper",
    howTo: "Get every single question right in a timed exam. The ultimate challenge!",
    tier: "gold", category: "exam",
  },
  {
    id: "kangaroo_spirit", icon: "🦘", name: "Kangourou Spirit",
    desc: "Answer 25 competition-style questions correctly (no hints)",
    howTo: "Work through 25 competition questions without any hints across any number of sessions.",
    tier: "gold", category: "skill",
  },
];

const TIER_CONFIG = {
  gold:   { color: "#F5A623", glow: "rgba(245,166,35,0.3)", label: "🥇 Gold Badges", subtitle: "Competition-ready achievements" },
  silver: { color: "#B0BEC5", glow: "rgba(176,190,197,0.2)", label: "🥈 Silver Badges", subtitle: "Developing competition skills" },
  bronze: { color: "#CD7F32", glow: "rgba(205,127,50,0.2)", label: "🥉 Bronze Badges", subtitle: "Getting started" },
} as const;

const CATEGORY_ICONS: Record<string, string> = {
  milestone: "🎯", skill: "🧩", streak: "🔥",
  breadth: "🗺️", engagement: "📅", exam: "⏱️",
  strategy: "💡", social: "👥",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function BadgesPage() {
  const { isAuthenticated } = useAuth();
  const { data: myBadges } = trpc.badges.myBadges.useQuery(undefined, { enabled: isAuthenticated });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");

  const earnedIds = new Set(myBadges?.map(b => b.badgeId) ?? []);
  const earnedCount = earnedIds.size;
  const totalCount = ALL_BADGES.length;

  const filteredBadges = (tier: keyof typeof TIER_CONFIG) => {
    return ALL_BADGES.filter(b => {
      if (b.tier !== tier) return false;
      if (filter === "earned") return earnedIds.has(b.id);
      if (filter === "locked") return !earnedIds.has(b.id);
      return true;
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D", fontFamily: "'Nunito', sans-serif" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 32, color: "white", margin: "0 0 6px" }}>
                🎖️ Badges
              </h1>
              <p style={{ color: "#B0C4DE", fontSize: 14, fontWeight: 600, margin: 0 }}>
                Earn badges by developing real competition maths skills — not just answering more questions
              </p>
            </div>
            {isAuthenticated && (
              <div style={{
                background: "rgba(245,166,35,0.1)",
                border: "2px solid rgba(245,166,35,0.3)",
                borderRadius: 14, padding: "12px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#F5A623" }}>
                  {earnedCount}<span style={{ fontSize: 16, color: "#B0C4DE" }}>/{totalCount}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#B0C4DE" }}>badges earned</div>
              </div>
            )}
          </div>
        </div>

        {/* Sign-in prompt */}
        {!isAuthenticated && (
          <div style={{
            background: "rgba(78,205,196,0.06)",
            border: "2px solid rgba(78,205,196,0.2)",
            borderRadius: 16, padding: "20px 24px",
            marginBottom: 32, textAlign: "center",
          }}>
            <p style={{ color: "#B0C4DE", fontWeight: 600, marginBottom: 12 }}>
              Sign in to track which badges you've earned!
            </p>
            <a href={getLoginUrl()}>
              <button style={{
                background: "linear-gradient(135deg, #F5A623, #E8941A)",
                border: "none", borderRadius: 12, padding: "10px 24px",
                fontSize: 14, fontWeight: 800, color: "#0F1B2D", cursor: "pointer",
              }}>
                Sign In Free →
              </button>
            </a>
          </div>
        )}

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {(["all", "earned", "locked"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
                border: `2px solid ${filter === f ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10, padding: "8px 18px",
                fontSize: 13, fontWeight: 800,
                color: filter === f ? "#F5A623" : "#B0C4DE",
                cursor: "pointer", textTransform: "capitalize",
              }}
            >
              {f === "all" ? `All (${totalCount})` : f === "earned" ? `✅ Earned (${earnedCount})` : `🔒 Locked (${totalCount - earnedCount})`}
            </button>
          ))}
        </div>

        {/* Tiers */}
        {(["gold", "silver", "bronze"] as const).map(tier => {
          const cfg = TIER_CONFIG[tier];
          const badges = filteredBadges(tier);
          if (badges.length === 0) return null;
          return (
            <div key={tier} style={{ marginBottom: 48 }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontWeight: 900, fontSize: 22, color: cfg.color, margin: "0 0 4px" }}>
                  {cfg.label}
                </h2>
                <p style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600, margin: 0 }}>
                  {cfg.subtitle}
                </p>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 14,
              }}>
                {badges.map(b => {
                  const earned = earnedIds.has(b.id);
                  const isHovered = hoveredId === b.id;
                  return (
                    <div
                      key={b.id}
                      onMouseEnter={() => setHoveredId(b.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        background: earned
                          ? `${cfg.color}12`
                          : isHovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
                        border: `2px solid ${earned ? cfg.color + "50" : isHovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
                        borderRadius: 18,
                        padding: "22px 18px",
                        transition: "all 0.2s",
                        boxShadow: earned ? `0 0 30px ${cfg.glow}` : "none",
                        opacity: earned ? 1 : 0.65,
                        position: "relative",
                      }}
                    >
                      {/* Earned checkmark */}
                      {earned && (
                        <div style={{
                          position: "absolute", top: 10, right: 10,
                          background: cfg.color,
                          borderRadius: "50%", width: 20, height: 20,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 900, color: "#0F1B2D",
                        }}>
                          ✓
                        </div>
                      )}

                      {/* Icon */}
                      <div style={{
                        fontSize: 40, marginBottom: 12,
                        filter: earned ? `drop-shadow(0 0 8px ${cfg.color}60)` : "grayscale(60%)",
                        transition: "filter 0.2s",
                      }}>
                        {b.icon}
                      </div>

                      {/* Category tag */}
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 99, padding: "2px 8px",
                        fontSize: 10, fontWeight: 700, color: "#B0C4DE",
                        marginBottom: 8,
                      }}>
                        {CATEGORY_ICONS[b.category]} {b.category}
                      </div>

                      <h3 style={{
                        fontWeight: 900, fontSize: 16,
                        color: earned ? "white" : "#B0C4DE",
                        margin: "0 0 6px",
                      }}>
                        {b.name}
                      </h3>

                      <p style={{ fontSize: 13, color: "#B0C4DE", lineHeight: 1.5, margin: "0 0 10px" }}>
                        {b.desc}
                      </p>

                      {/* How to earn (shown on hover or if not earned) */}
                      {!earned && (
                        <p style={{
                          fontSize: 11, color: cfg.color + "cc",
                          fontWeight: 700, lineHeight: 1.4,
                          margin: 0, fontStyle: "italic",
                        }}>
                          💡 {b.howTo}
                        </p>
                      )}

                      {earned && (
                        <div style={{
                          fontSize: 12, fontWeight: 800, color: cfg.color,
                          marginTop: 4,
                        }}>
                          ✓ Earned!
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
