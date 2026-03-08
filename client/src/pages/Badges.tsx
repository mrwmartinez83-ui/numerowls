import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

const ALL_BADGES = [
  { id: "first_question", icon: "🌟", name: "First Steps", desc: "Answer your first question", tier: "bronze" },
  { id: "ten_correct", icon: "🔥", name: "On Fire", desc: "Get 10 questions correct", tier: "bronze" },
  { id: "fifty_correct", icon: "⚡", name: "Lightning Owl", desc: "Get 50 questions correct", tier: "silver" },
  { id: "hundred_correct", icon: "💫", name: "Century Owl", desc: "Get 100 questions correct", tier: "gold" },
  { id: "perfect_test", icon: "💎", name: "Perfect Score", desc: "Score 100% on a timed test", tier: "gold" },
  { id: "all_skills", icon: "🦉", name: "Wise Owl", desc: "Try all 9 skill categories", tier: "silver" },
  { id: "potw_correct", icon: "⭐", name: "Star of the Week", desc: "Solve the Problem of the Week correctly", tier: "bronze" },
  { id: "streak_5", icon: "🏅", name: "5-Day Streak", desc: "Practice 5 days in a row", tier: "silver" },
  { id: "top_10", icon: "🏆", name: "Top 10", desc: "Reach the top 10 on the leaderboard", tier: "gold" },
  { id: "certificate", icon: "📜", name: "Certified Owl", desc: "Earn your first certificate", tier: "silver" },
];

const TIER_COLORS: Record<string, string> = { bronze: "#CD7F32", silver: "#C0C0C0", gold: "#F5A623" };

export default function Badges() {
  const { isAuthenticated } = useAuth();
  const { data: myBadges } = trpc.badges.myBadges.useQuery(undefined, { enabled: isAuthenticated });
  const earnedIds = new Set(myBadges?.map(b => b.badgeId) ?? []);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "8px" }}>🎖️ Badges</h1>
        <p style={{ color: "#B0C4DE", marginBottom: "32px" }}>Earn badges by practising skills, taking tests, and solving challenges</p>
        {!isAuthenticated && (
          <div className="no-card" style={{ textAlign: "center", marginBottom: "28px" }}>
            <p style={{ color: "#B0C4DE", marginBottom: "14px" }}>Sign in to track your badges!</p>
            <a href={getLoginUrl()}><button className="no-btn-gold">Sign In →</button></a>
          </div>
        )}
        {["gold","silver","bronze"].map(tier => (
          <div key={tier} style={{ marginBottom: "36px" }}>
            <h2 style={{ fontWeight: 800, fontSize: "18px", marginBottom: "16px", color: TIER_COLORS[tier], textTransform: "capitalize" }}>
              {tier === "gold" ? "🥇" : tier === "silver" ? "🥈" : "🥉"} {tier} Badges
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
              {ALL_BADGES.filter(b => b.tier === tier).map(b => {
                const earned = earnedIds.has(b.id);
                return (
                  <div key={b.id} style={{ padding: "20px", borderRadius: "16px", background: earned ? `${TIER_COLORS[tier]}10` : "rgba(255,255,255,0.03)", border: `2px solid ${earned ? TIER_COLORS[tier] + "50" : "rgba(255,255,255,0.07)"}`, opacity: earned ? 1 : 0.5, textAlign: "center" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>{b.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: earned ? "white" : "#B0C4DE", marginBottom: "6px" }}>{b.name}</div>
                    <div style={{ fontSize: "12px", color: "#B0C4DE", lineHeight: 1.4 }}>{b.desc}</div>
                    {earned && <div style={{ marginTop: "10px", fontSize: "12px", fontWeight: 700, color: TIER_COLORS[tier] }}>✓ Earned!</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
