import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

// ── Badge definitions tied to genuine mathematical milestones ─────────────────
// Each badge has a progress hint so pupils know exactly what to do next.
const ALL_BADGES = [
  // ── Competition thinking skills ──────────────────────────────────────────
  {
    id: "work_backwards_5",
    icon: "🔄",
    name: "Reverse Engineer",
    desc: "Solved 5 work-backwards problems correctly",
    hint: "Look for 'work-backwards' questions in Competition Mode",
    tier: "silver",
    category: "Competition Thinking",
  },
  {
    id: "five_point_solver",
    icon: "⭐",
    name: "Five-Point Thinker",
    desc: "Answered a 5-point competition question correctly",
    hint: "Attempt a 5-point (gold) question in Competition Mode",
    tier: "gold",
    category: "Competition Thinking",
  },
  {
    id: "no_hint_streak",
    icon: "🧠",
    name: "Pure Thinking",
    desc: "Completed a full competition set without using any hints",
    hint: "Finish any competition set without clicking 'Show Hint'",
    tier: "gold",
    category: "Competition Thinking",
  },
  {
    id: "hint_free_5pt",
    icon: "💡",
    name: "Unaided",
    desc: "Solved a 5-point question without using the hint",
    hint: "Answer a 5-point question correctly without using the hint",
    tier: "silver",
    category: "Competition Thinking",
  },
  {
    id: "potw_correct",
    icon: "🏅",
    name: "Problem Solver",
    desc: "Solved the Problem of the Week correctly",
    hint: "Submit a correct answer on the /potw page",
    tier: "bronze",
    category: "Competition Thinking",
  },
  {
    id: "potw_3wins",
    icon: "🔥",
    name: "Weekly Champion",
    desc: "Solved the Problem of the Week correctly 3 times",
    hint: "Keep solving the weekly problem — check /potw each week",
    tier: "gold",
    category: "Competition Thinking",
  },

  // ── Skill mastery ────────────────────────────────────────────────────────
  {
    id: "perfect_test",
    icon: "💎",
    name: "Perfect Score",
    desc: "Scored 100% on a timed test",
    hint: "Take a timed test and get every question right",
    tier: "gold",
    category: "Skill Mastery",
  },
  {
    id: "all_skills",
    icon: "🦉",
    name: "Wise Owl",
    desc: "Attempted all 9 skill categories",
    hint: "Try at least one question in every skill on the Practice page",
    tier: "silver",
    category: "Skill Mastery",
  },
  {
    id: "skill_master",
    icon: "🎯",
    name: "Skill Master",
    desc: "Scored ≥80% on 50+ questions in a single skill",
    hint: "Keep practising one skill until you've answered 50 questions at 80%+ accuracy",
    tier: "gold",
    category: "Skill Mastery",
  },
  {
    id: "fifty_correct",
    icon: "⚡",
    name: "Lightning Owl",
    desc: "Answered 50 questions correctly in total",
    hint: "Keep practising — you're building up your total correct answers",
    tier: "silver",
    category: "Skill Mastery",
  },
  {
    id: "hundred_correct",
    icon: "💫",
    name: "Century Owl",
    desc: "Answered 100 questions correctly in total",
    hint: "100 correct answers across all skills and modes",
    tier: "gold",
    category: "Skill Mastery",
  },
  {
    id: "shape_puzzle_5",
    icon: "🧩",
    name: "Puzzle Solver",
    desc: "Solved 5 Shape Value Puzzles correctly",
    hint: "Visit the Shape Value Puzzles page and solve 5 puzzles",
    tier: "bronze",
    category: "Skill Mastery",
  },

  // ── Consistency ──────────────────────────────────────────────────────────
  {
    id: "first_question",
    icon: "🌟",
    name: "First Steps",
    desc: "Answered your first question",
    hint: "Answer any question anywhere in the app",
    tier: "bronze",
    category: "Consistency",
  },
  {
    id: "ten_correct",
    icon: "🔥",
    name: "On Fire",
    desc: "Got 10 questions correct",
    hint: "Keep answering questions — you're getting there!",
    tier: "bronze",
    category: "Consistency",
  },
  {
    id: "streak_5",
    icon: "📅",
    name: "5-Day Streak",
    desc: "Practised 5 days in a row",
    hint: "Come back every day and answer at least one question",
    tier: "silver",
    category: "Consistency",
  },
  {
    id: "top_10",
    icon: "🏆",
    name: "Top 10",
    desc: "Reached the top 10 on the leaderboard",
    hint: "Earn points by practising, taking tests, and solving POTW",
    tier: "gold",
    category: "Consistency",
  },
  {
    id: "certificate",
    icon: "📜",
    name: "Certified Owl",
    desc: "Earned your first certificate",
    hint: "Score 80%+ on a timed test to earn a certificate",
    tier: "silver",
    category: "Consistency",
  },
];

const TIER_COLORS: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#F5A623",
};

const CATEGORIES = ["Competition Thinking", "Skill Mastery", "Consistency"];

export default function Badges() {
  const { isAuthenticated } = useAuth();
  const { data: myBadges } = trpc.badges.myBadges.useQuery(undefined, { enabled: isAuthenticated });
  const earnedIds = new Set(myBadges?.map(b => b.badgeId) ?? []);

  const earnedCount = ALL_BADGES.filter(b => earnedIds.has(b.id)).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "6px" }}>
            🎖️ Badges
          </h1>
          <p style={{ color: "#B0C4DE", margin: 0 }}>
            Each badge marks a genuine mathematical achievement — not just participation.
          </p>
          {isAuthenticated && (
            <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)", borderRadius: "12px", padding: "10px 18px" }}>
              <span style={{ fontSize: "24px" }}>🦉</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "16px", color: "#F5A623" }}>{earnedCount} / {ALL_BADGES.length} earned</div>
                <div style={{ fontSize: "12px", color: "#B0C4DE" }}>Keep practising to unlock more</div>
              </div>
            </div>
          )}
        </div>

        {!isAuthenticated && (
          <div className="no-card" style={{ textAlign: "center", marginBottom: "28px" }}>
            <p style={{ color: "#B0C4DE", marginBottom: "14px" }}>Sign in to track your badges!</p>
            <a href={getLoginUrl()}><button className="no-btn-gold">Sign In →</button></a>
          </div>
        )}

        {/* Badges by category */}
        {CATEGORIES.map(cat => {
          const catBadges = ALL_BADGES.filter(b => b.category === cat);
          const catEarned = catBadges.filter(b => earnedIds.has(b.id)).length;
          return (
            <div key={cat} style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <h2 style={{ fontWeight: 800, fontSize: "18px", color: "white", margin: 0 }}>{cat}</h2>
                {isAuthenticated && (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: "20px" }}>
                    {catEarned}/{catBadges.length}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
                {catBadges.map(b => {
                  const earned = earnedIds.has(b.id);
                  const tierColor = TIER_COLORS[b.tier];
                  return (
                    <div key={b.id} style={{
                      padding: "20px",
                      borderRadius: "16px",
                      background: earned ? `${tierColor}10` : "rgba(255,255,255,0.03)",
                      border: `2px solid ${earned ? tierColor + "50" : "rgba(255,255,255,0.07)"}`,
                      opacity: earned ? 1 : 0.65,
                      position: "relative",
                      transition: "all 0.2s",
                    }}>
                      {/* Tier badge */}
                      <div style={{
                        position: "absolute", top: "12px", right: "12px",
                        fontSize: "10px", fontWeight: 700, color: tierColor,
                        background: `${tierColor}18`, padding: "2px 7px", borderRadius: "8px",
                        textTransform: "capitalize",
                      }}>
                        {b.tier === "gold" ? "🥇" : b.tier === "silver" ? "🥈" : "🥉"} {b.tier}
                      </div>

                      <div style={{ fontSize: "40px", marginBottom: "10px" }}>{b.icon}</div>
                      <div style={{ fontWeight: 800, fontSize: "15px", color: earned ? "white" : "#B0C4DE", marginBottom: "6px" }}>{b.name}</div>
                      <div style={{ fontSize: "12px", color: "#B0C4DE", lineHeight: 1.5, marginBottom: earned ? "0" : "10px" }}>{b.desc}</div>

                      {earned ? (
                        <div style={{ marginTop: "10px", fontSize: "12px", fontWeight: 700, color: tierColor }}>
                          ✓ Earned!
                        </div>
                      ) : isAuthenticated ? (
                        <div style={{ fontSize: "11px", color: "rgba(78,205,196,0.7)", fontStyle: "italic", lineHeight: 1.4 }}>
                          💡 {b.hint}
                        </div>
                      ) : null}
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
