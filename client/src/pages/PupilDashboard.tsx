import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { SKILLS } from "@shared/questionBank";

const BADGE_DEFS = [
  { id: "first_question", icon: "🌟", name: "First Steps", desc: "Answer your first question" },
  { id: "ten_correct", icon: "🔥", name: "On Fire", desc: "Get 10 questions correct" },
  { id: "perfect_test", icon: "💎", name: "Perfect Score", desc: "Score 100% on a timed test" },
  { id: "all_skills", icon: "🦉", name: "Wise Owl", desc: "Try all 9 skill categories" },
  { id: "potw_correct", icon: "⭐", name: "Star of the Week", desc: "Solve the Problem of the Week" },
  { id: "streak_5", icon: "🏅", name: "5-Day Streak", desc: "Practice 5 days in a row" },
];

export default function PupilDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: history } = trpc.results.myHistory.useQuery(undefined, { enabled: isAuthenticated });
  const { data: skillData } = trpc.skills.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const { data: badges } = trpc.badges.myBadges.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) return <div style={{ minHeight: "100vh", background: "#0F1B2D", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "#F5A623", fontSize: "32px" }}>🦉</div></div>;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
        <NavBar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px" }}>
          <div style={{ fontSize: "64px" }}>🦉</div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "24px" }}>Sign in to see your dashboard</h2>
          <a href={getLoginUrl()}><button className="no-btn-gold">Sign In →</button></a>
        </div>
      </div>
    );
  }

  const totalAttempted = history?.reduce((s, r) => s + r.total, 0) ?? 0;
  const totalCorrect = history?.reduce((s, r) => s + r.score, 0) ?? 0;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const earnedBadgeIds = new Set(badges?.map((b) => b.badgeId) ?? []);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
          <div style={{ fontSize: "48px" }}>{user?.avatarEmoji ?? "🦉"}</div>
          <div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", margin: 0 }}>
              Welcome back, {user?.displayName ?? user?.name ?? "Owl"}!
            </h1>
            <div style={{ color: "#B0C4DE", fontSize: "14px", marginTop: "4px" }}>
              {user?.yearGroup ? `Year ${user.yearGroup}` : "Set your year group in settings"} · {user?.totalPoints ?? 0} points
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          {[
            { label: "Total Points", value: user?.totalPoints ?? 0, icon: "⭐", color: "#F5A623" },
            { label: "Questions Done", value: totalAttempted, icon: "📝", color: "#4ECDC4" },
            { label: "Correct", value: totalCorrect, icon: "✅", color: "#2ECC71" },
            { label: "Accuracy", value: `${accuracy}%`, icon: "🎯", color: "#9B59B6" },
            { label: "Badges", value: earnedBadgeIds.size, icon: "🎖️", color: "#E91E63" },
            { label: "Tests Taken", value: history?.filter(r => r.testType === "timed").length ?? 0, icon: "⏱️", color: "#3498DB" },
          ].map((s) => (
            <div key={s.label} className="no-stat">
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{s.icon}</div>
              <div className="no-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="no-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Skill Progress */}
          <div className="no-card">
            <h2 style={{ fontWeight: 800, fontSize: "18px", color: "white", marginBottom: "20px" }}>🧩 Skill Progress</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {SKILLS.map((skill) => {
                const prog = skillData?.find((p) => p.skillId === skill.id);
                const pct = prog && prog.attempted > 0 ? Math.round((prog.correct / prog.attempted) * 100) : 0;
                return (
                  <div key={skill.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>{skill.icon} {skill.name}</span>
                      <span style={{ fontSize: "13px", color: "#B0C4DE" }}>{prog ? `${prog.correct}/${prog.attempted}` : "Not started"}</span>
                    </div>
                    <div className="no-progress-track">
                      <div className="no-progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/practice" style={{ display: "block", marginTop: "20px" }}>
              <button className="no-btn-teal" style={{ width: "100%" }}>Practice a Skill →</button>
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Badges */}
            <div className="no-card">
              <h2 style={{ fontWeight: 800, fontSize: "18px", color: "white", marginBottom: "16px" }}>🎖️ Badges</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {BADGE_DEFS.map((b) => {
                  const earned = earnedBadgeIds.has(b.id);
                  return (
                    <div key={b.id} title={b.desc} style={{ textAlign: "center", padding: "10px 6px", borderRadius: "12px", background: earned ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${earned ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.06)"}`, opacity: earned ? 1 : 0.4 }}>
                      <div style={{ fontSize: "24px" }}>{b.icon}</div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: earned ? "#F5A623" : "#B0C4DE", marginTop: "4px", lineHeight: 1.2 }}>{b.name}</div>
                    </div>
                  );
                })}
              </div>
              <Link href="/badges" style={{ display: "block", marginTop: "14px" }}>
                <button className="no-btn-ghost" style={{ width: "100%", fontSize: "13px" }}>View All Badges →</button>
              </Link>
            </div>

            {/* Quick actions */}
            <div className="no-card">
              <h2 style={{ fontWeight: 800, fontSize: "18px", color: "white", marginBottom: "16px" }}>⚡ Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/test"><button className="no-btn-gold" style={{ width: "100%" }}>⏱️ Take a Timed Test</button></Link>
                <Link href="/potw"><button className="no-btn-teal" style={{ width: "100%" }}>🦉 Problem of the Week</button></Link>
                <Link href="/leaderboard"><button className="no-btn-ghost" style={{ width: "100%" }}>🏆 View Leaderboard</button></Link>
              </div>
            </div>

            {/* Recent results */}
            {history && history.length > 0 && (
              <div className="no-card">
                <h2 style={{ fontWeight: 800, fontSize: "18px", color: "white", marginBottom: "16px" }}>📋 Recent Results</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {history.slice(0, 5).map((r) => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.04)" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>{r.skillId ?? "Mixed Test"}</div>
                        <div style={{ fontSize: "11px", color: "#B0C4DE" }}>{new Date(r.completedAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: r.score / r.total >= 0.8 ? "#2ECC71" : r.score / r.total >= 0.5 ? "#F5A623" : "#E74C3C" }}>
                        {r.score}/{r.total}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
