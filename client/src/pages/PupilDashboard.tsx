import NavBar from "@/components/NavBar";
import { getLevel, getXpIntoLevel, XP_PER_LEVEL } from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { SKILLS } from "@shared/questionBank";
import { useState } from "react";
import { toast } from "sonner";

// ─── Badge definitions ────────────────────────────────────────────────────────
const BADGE_DEFS = [
  { id: "first_question", icon: "🌟", name: "First Steps",      desc: "Answer your first question",        tier: "bronze" },
  { id: "ten_correct",    icon: "🔥", name: "On Fire",           desc: "Get 10 questions correct",          tier: "silver" },
  { id: "perfect_test",   icon: "💎", name: "Perfect Score",     desc: "Score 100% on a timed test",        tier: "gold"   },
  { id: "all_skills",     icon: "🦉", name: "Wise Owl",          desc: "Try all 9 skill categories",        tier: "gold"   },
  { id: "potw_correct",   icon: "⭐", name: "Star of the Week",  desc: "Solve the Problem of the Week",     tier: "silver" },
  { id: "streak_5",       icon: "🏅", name: "5-Day Streak",      desc: "Practice 5 days in a row",          tier: "gold"   },
  { id: "speed_demon",    icon: "⚡", name: "Speed Demon",       desc: "Complete a timed test in under 3 min", tier: "silver" },
  { id: "homework_hero",  icon: "📚", name: "Homework Hero",     desc: "Complete all set work on time",     tier: "bronze" },
];

const TIER_COLOURS: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#A8A9AD",
  gold:   "#F5A623",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pct(correct: number, attempted: number) {
  return attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
}

function scoreColour(ratio: number) {
  if (ratio >= 0.8) return "#2ECC71";
  if (ratio >= 0.5) return "#F5A623";
  return "#E74C3C";
}

function dueLabel(dueDate: Date | null | undefined) {
  if (!dueDate) return null;
  const d = new Date(dueDate);
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
  if (diff < 0) return { text: "Overdue", colour: "#E74C3C" };
  if (diff === 0) return { text: "Due today", colour: "#F5A623" };
  if (diff === 1) return { text: "Due tomorrow", colour: "#F5A623" };
  return { text: `Due in ${diff} days`, colour: "#4ECDC4" };
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, colour }: { icon: string; value: string | number; label: string; colour: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1.5px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "18px 16px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "26px", marginBottom: "6px" }}>{icon}</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "26px", color: colour, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#8899AA", marginTop: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "17px", color: "white", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
      {children}
    </h2>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1.5px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PupilDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  const { data: history = [] }    = trpc.results.myHistory.useQuery(undefined, { enabled: isAuthenticated });
  const { data: skillData = [] }  = trpc.skills.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const { data: badges = [] }     = trpc.badges.myBadges.useQuery(undefined, { enabled: isAuthenticated });
  const { data: setWorkItems = [] } = trpc.setWork.forPupil.useQuery(undefined, { enabled: isAuthenticated });
  const { data: myClasses = [] }  = trpc.classMembers.myClasses.useQuery(undefined, { enabled: isAuthenticated });

  const joinClass = trpc.classMembers.join.useMutation({
    onSuccess: (data) => {
      toast.success(`Joined class: ${data.className} 🎉`);
      utils.classMembers.myClasses.invalidate();
      utils.setWork.forPupil.invalidate();
      setJoinCode("");
      setShowJoin(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [joinCode, setJoinCode] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  // ── Loading / unauthenticated ───────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1B2D", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#F5A623", fontSize: "48px", animation: "pulse 1.5s infinite" }}>🦉</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
        <NavBar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px" }}>
          <div style={{ fontSize: "72px" }}>🦉</div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "24px", margin: 0 }}>Sign in to see your dashboard</h2>
          <p style={{ color: "#8899AA", fontSize: "15px", margin: 0 }}>Track your progress, earn badges, and see work set by your teacher.</p>
          <a href={getLoginUrl()}><button className="no-btn-gold">Sign In →</button></a>
        </div>
      </div>
    );
  }

  // ── Computed stats ──────────────────────────────────────────────────────────
  const totalAttempted  = history.reduce((s, r) => s + r.total, 0);
  const totalCorrect    = history.reduce((s, r) => s + r.score, 0);
  const accuracy        = pct(totalCorrect, totalAttempted);
  const testsTaken      = history.filter(r => r.testType === "timed").length;
  const earnedBadgeIds  = new Set(badges.map(b => b.badgeId));

  // Skills tried (for "Wise Owl" badge progress)
  const skillsTried     = new Set(skillData.filter(s => s.attempted > 0).map(s => s.skillId));

  // Set work: split into pending (no matching result) and done
  const pendingWork = setWorkItems.slice(0, 10);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "80px", maxWidth: "1100px" }}>

        {/* ── Hero header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "16px", marginBottom: "36px",
          background: "linear-gradient(135deg, rgba(245,166,35,0.12) 0%, rgba(78,205,196,0.08) 100%)",
          border: "1.5px solid rgba(245,166,35,0.2)", borderRadius: "24px", padding: "28px 32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ fontSize: "56px", lineHeight: 1 }}>{user?.avatarEmoji ?? "🦉"}</div>
            <div>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", margin: 0 }}>
                Welcome back, {user?.displayName ?? user?.name ?? "Owl"}!
              </h1>
              <div style={{ color: "#B0C4DE", fontSize: "14px", marginTop: "6px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {user?.yearGroup && <span>📚 Year {user.yearGroup}</span>}
                <span>⭐ {user?.totalPoints ?? 0} points</span>
                {myClasses.length > 0 && <span>🏫 {myClasses.map(c => c.className).join(", ")}</span>}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
            {/* XP bar */}
            <div style={{ minWidth: "200px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#F5A623" }}>
                  ⚡ Level {getLevel(user?.xp ?? 0)}
                </span>
                <span style={{ fontSize: "11px", color: "#8899AA" }}>
                  {getXpIntoLevel(user?.xp ?? 0)}/{XP_PER_LEVEL} XP
                </span>
              </div>
              <div style={{ height: "10px", borderRadius: "99px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "99px",
                  background: "linear-gradient(90deg, #F5A623, #FFD700)",
                  width: `${Math.round((getXpIntoLevel(user?.xp ?? 0) / XP_PER_LEVEL) * 100)}%`,
                  transition: "width 0.8s ease",
                  boxShadow: "0 0 8px rgba(245,166,35,0.5)",
                }} />
              </div>
            </div>
            {/* Streak */}
            {(user?.currentStreak ?? 0) > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "20px",
                background: "rgba(255,100,30,0.12)",
                border: "1.5px solid rgba(255,100,30,0.4)",
                fontSize: "14px", fontWeight: 800, color: "#FF6820",
              }}>
                🔥 {user?.currentStreak}-day streak!
                {(user?.currentStreak ?? 0) >= 3 && " Keep it up!"}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/practice"><button className="no-btn-teal">🧩 Practice</button></Link>
              <Link href="/test"><button className="no-btn-gold">⏱️ Take a Test</button></Link>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "14px", marginBottom: "36px" }}>
          <StatCard icon="⭐" value={user?.totalPoints ?? 0}  label="Total Points"  colour="#F5A623" />
          <StatCard icon="📝" value={totalAttempted}           label="Questions Done" colour="#4ECDC4" />
          <StatCard icon="✅" value={totalCorrect}             label="Correct"        colour="#2ECC71" />
          <StatCard icon="🎯" value={`${accuracy}%`}          label="Accuracy"       colour="#9B59B6" />
          <StatCard icon="⏱️" value={testsTaken}              label="Tests Taken"    colour="#3498DB" />
          <StatCard icon="🎖️" value={earnedBadgeIds.size}    label="Badges"         colour="#E91E63" />
        </div>

        {/* ── Main grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Set Work */}
            <Card>
              <SectionHeading>📋 Work Set By Your Teacher</SectionHeading>
              {pendingWork.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
                  <p style={{ color: "#8899AA", fontSize: "14px", margin: 0 }}>No work set yet.</p>
                  {myClasses.length === 0 && (
                    <p style={{ color: "#8899AA", fontSize: "13px", marginTop: "8px" }}>
                      Join a class to see work from your teacher.
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {pendingWork.map(w => {
                    const due = dueLabel(w.dueDate);
                    const skill = SKILLS.find(s => s.id === w.skillId);
                    return (
                      <div key={w.id} style={{
                        padding: "14px 16px", borderRadius: "14px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1.5px solid rgba(255,255,255,0.07)",
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px",
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: "14px", color: "white", marginBottom: "4px" }}>{w.title}</div>
                          {w.description && <div style={{ fontSize: "12px", color: "#8899AA", marginBottom: "6px", lineHeight: 1.4 }}>{w.description}</div>}
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                            {skill && <span style={{ fontSize: "11px", background: "rgba(78,205,196,0.15)", color: "#4ECDC4", borderRadius: "6px", padding: "2px 8px", fontWeight: 700 }}>{skill.icon} {skill.name}</span>}
                            {due && <span style={{ fontSize: "11px", color: due.colour, fontWeight: 700 }}>{due.text}</span>}
                            <span style={{ fontSize: "11px", color: "#8899AA" }}>from {w.teacherName ?? "Teacher"}</span>
                          </div>
                        </div>
                        <Link href={w.skillId ? `/practice/${w.skillId}` : "/practice"}>
                          <button style={{
                            background: "rgba(245,166,35,0.15)", border: "1.5px solid rgba(245,166,35,0.3)",
                            color: "#F5A623", borderRadius: "10px", padding: "6px 14px", fontSize: "12px",
                            fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap",
                          }}>Start →</button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Join class */}
              <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
                {!showJoin ? (
                  <button
                    onClick={() => setShowJoin(true)}
                    style={{ background: "none", border: "1.5px dashed rgba(255,255,255,0.15)", color: "#8899AA", borderRadius: "10px", padding: "8px 16px", fontSize: "13px", cursor: "pointer", width: "100%", fontWeight: 700 }}
                  >
                    + Join a class with a code
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      value={joinCode}
                      onChange={e => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Enter class code (e.g. ABC123)"
                      maxLength={8}
                      style={{
                        flex: 1, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)",
                        borderRadius: "10px", padding: "8px 14px", color: "white", fontSize: "14px",
                        fontFamily: "'Space Grotesk', monospace", letterSpacing: "0.1em", outline: "none",
                      }}
                      onKeyDown={e => e.key === "Enter" && joinCode.length >= 4 && joinClass.mutate({ joinCode })}
                    />
                    <button
                      onClick={() => joinClass.mutate({ joinCode })}
                      disabled={joinCode.length < 4 || joinClass.isPending}
                      className="no-btn-gold"
                      style={{ padding: "8px 16px", fontSize: "13px" }}
                    >
                      {joinClass.isPending ? "..." : "Join"}
                    </button>
                    <button
                      onClick={() => { setShowJoin(false); setJoinCode(""); }}
                      style={{ background: "none", border: "none", color: "#8899AA", cursor: "pointer", fontSize: "20px", padding: "0 4px" }}
                    >×</button>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Results */}
            <Card>
              <SectionHeading>📊 Recent Test Results</SectionHeading>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>📝</div>
                  <p style={{ color: "#8899AA", fontSize: "14px", margin: 0 }}>No tests taken yet.</p>
                  <Link href="/test" style={{ display: "block", marginTop: "12px" }}>
                    <button className="no-btn-gold" style={{ fontSize: "13px" }}>Take your first test →</button>
                  </Link>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {history.slice(0, 8).map(r => {
                      const ratio = r.total > 0 ? r.score / r.total : 0;
                      const skill = SKILLS.find(s => s.id === r.skillId);
                      return (
                        <div key={r.id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "10px 14px", borderRadius: "12px",
                          background: "rgba(255,255,255,0.04)",
                          borderLeft: `3px solid ${scoreColour(ratio)}`,
                        }}>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>
                              {skill ? `${skill.icon} ${skill.name}` : r.testType === "timed" ? "⏱️ Timed Test" : "🧩 Practice"}
                            </div>
                            <div style={{ fontSize: "11px", color: "#8899AA", marginTop: "2px" }}>
                              {new Date(r.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              {r.durationSeconds && ` · ${Math.round(r.durationSeconds / 60)}m`}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "16px", fontWeight: 900, color: scoreColour(ratio) }}>{r.score}/{r.total}</div>
                            <div style={{ fontSize: "11px", color: "#8899AA" }}>{Math.round(ratio * 100)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {history.length > 8 && (
                    <p style={{ color: "#8899AA", fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
                      Showing 8 of {history.length} results
                    </p>
                  )}
                </>
              )}
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Skill Progress */}
            <Card>
              <SectionHeading>🧩 Skill Progress</SectionHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                {SKILLS.map(skill => {
                  const prog = skillData.find(p => p.skillId === skill.id);
                  const p = prog ? pct(prog.correct, prog.attempted) : 0;
                  const tried = skillsTried.has(skill.id);
                  return (
                    <div key={skill.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", alignItems: "center" }}>
                        <Link href={`/practice/${skill.id}`} style={{ textDecoration: "none" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: tried ? "white" : "#8899AA", cursor: "pointer" }}>
                            {skill.icon} {skill.name}
                          </span>
                        </Link>
                        <span style={{ fontSize: "12px", color: tried ? "#B0C4DE" : "#8899AA" }}>
                          {prog ? `${prog.correct}/${prog.attempted} correct` : "Not started"}
                        </span>
                      </div>
                      <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${p}%`, borderRadius: "4px",
                          background: tried ? `linear-gradient(90deg, ${skill.color}, ${skill.color}bb)` : "transparent",
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/practice" style={{ display: "block", marginTop: "18px" }}>
                <button className="no-btn-teal" style={{ width: "100%", fontSize: "13px" }}>Practice a Skill →</button>
              </Link>
            </Card>

            {/* Badges */}
            <Card>
              <SectionHeading>🎖️ Badges</SectionHeading>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {BADGE_DEFS.map(b => {
                  const earned = earnedBadgeIds.has(b.id);
                  const colour = TIER_COLOURS[b.tier];
                  return (
                    <div
                      key={b.id}
                      title={`${b.name}: ${b.desc}`}
                      style={{
                        textAlign: "center", padding: "12px 6px", borderRadius: "14px",
                        background: earned ? `rgba(${b.tier === "gold" ? "245,166,35" : b.tier === "silver" ? "168,169,173" : "205,127,50"},0.12)` : "rgba(255,255,255,0.03)",
                        border: `1.5px solid ${earned ? colour + "55" : "rgba(255,255,255,0.06)"}`,
                        opacity: earned ? 1 : 0.35,
                        cursor: "default",
                      }}
                    >
                      <div style={{ fontSize: "22px" }}>{b.icon}</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: earned ? colour : "#8899AA", marginTop: "5px", lineHeight: 1.3 }}>{b.name}</div>
                    </div>
                  );
                })}
              </div>
              <Link href="/badges" style={{ display: "block", marginTop: "14px" }}>
                <button className="no-btn-ghost" style={{ width: "100%", fontSize: "13px" }}>View All Badges →</button>
              </Link>
            </Card>

            {/* Quick Actions */}
            <Card>
              <SectionHeading>⚡ Quick Actions</SectionHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/competition">
                  <button style={{
                    width: "100%", padding: "12px 16px", borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(245,166,35,0.2), rgba(255,215,0,0.15))",
                    border: "1.5px solid rgba(245,166,35,0.5)",
                    color: "#F5A623", fontWeight: 800, fontSize: "14px", cursor: "pointer",
                  }}>🏆 Competition Mode</button>
                </Link>
                <Link href="/games">
                  <button style={{
                    width: "100%", padding: "12px 16px", borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(155,89,182,0.2), rgba(142,68,173,0.15))",
                    border: "1.5px solid rgba(155,89,182,0.5)",
                    color: "#9B59B6", fontWeight: 800, fontSize: "14px", cursor: "pointer",
                  }}>🎮 Games Hub</button>
                </Link>
                <Link href="/test"><button className="no-btn-gold" style={{ width: "100%" }}>⏱️ Take a Timed Test</button></Link>
                <Link href="/potw"><button className="no-btn-teal" style={{ width: "100%" }}>🦉 Problem of the Week</button></Link>
                <Link href="/leaderboard"><button className="no-btn-ghost" style={{ width: "100%" }}>🏅 View Leaderboard</button></Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
