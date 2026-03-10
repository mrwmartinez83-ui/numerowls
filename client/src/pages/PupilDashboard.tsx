import NavBar from "@/components/NavBar";
import { getLevel, getXpIntoLevel, XP_PER_LEVEL } from "@/lib/xpUtils";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { SKILLS } from "@shared/questionBank";
import { useState } from "react";
import { toast } from "sonner";

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

// ─── Big Activity Card ────────────────────────────────────────────────────────
function ActivityCard({
  href, icon, label, desc, gradient, border, textColor,
}: {
  href: string; icon: string; label: string; desc: string;
  gradient: string; border: string; textColor: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        background: gradient,
        border: `2px solid ${border}`,
        borderRadius: "20px",
        padding: "22px 18px",
        cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", gap: "10px",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        minHeight: "130px", justifyContent: "center",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${border}44`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        <div style={{ fontSize: "44px", lineHeight: 1 }}>{icon}</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "17px", color: textColor, lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: "12px", color: "#8899AA", lineHeight: 1.4, maxWidth: "140px" }}>{desc}</div>
      </div>
    </Link>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "18px", color: "white", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
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

  const { data: history = [] }      = trpc.results.myHistory.useQuery(undefined, { enabled: isAuthenticated });
  const { data: skillData = [] }    = trpc.skills.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const { data: badges = [] }       = trpc.badges.myBadges.useQuery(undefined, { enabled: isAuthenticated });
  const { data: setWorkItems = [] } = trpc.setWork.forPupil.useQuery(undefined, { enabled: isAuthenticated });
  const { data: myClasses = [] }    = trpc.classMembers.myClasses.useQuery(undefined, { enabled: isAuthenticated });

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

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1B2D", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#F5A623", fontSize: "56px", animation: "pulse 1.5s infinite" }}>🦉</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
        <NavBar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px", padding: "40px 20px" }}>
          <div style={{ fontSize: "80px" }}>🦉</div>
          <h2 style={{ color: "white", fontWeight: 900, fontSize: "28px", margin: 0, textAlign: "center" }}>Sign in to see your dashboard</h2>
          <p style={{ color: "#8899AA", fontSize: "16px", margin: 0, textAlign: "center" }}>Track your progress, earn badges, and see work set by your teacher.</p>
          <a href={getLoginUrl()}><button className="no-btn-gold" style={{ fontSize: "16px", padding: "12px 28px" }}>🦉 Sign In →</button></a>
        </div>
      </div>
    );
  }

  // ── Computed stats ──────────────────────────────────────────────────────────
  const totalAttempted = history.reduce((s, r) => s + r.total, 0);
  const totalCorrect   = history.reduce((s, r) => s + r.score, 0);
  const accuracy       = pct(totalCorrect, totalAttempted);
  const testsTaken     = history.filter(r => r.testType === "timed").length;
  const earnedBadgeIds = new Set(badges.map(b => b.badgeId));
  const skillsTried    = new Set(skillData.filter(s => s.attempted > 0).map(s => s.skillId));
  const pendingWork    = setWorkItems.slice(0, 10);
  const level          = getLevel(user?.xp ?? 0);
  const xpIntoLevel    = getXpIntoLevel(user?.xp ?? 0);
  const xpPct          = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "32px", paddingBottom: "80px", maxWidth: "1100px" }}>

        {/* ── Hero greeting ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(245,166,35,0.14) 0%, rgba(78,205,196,0.08) 100%)",
          border: "1.5px solid rgba(245,166,35,0.22)",
          borderRadius: "24px", padding: "28px 32px",
          marginBottom: "32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "20px",
        }}>
          {/* Left: avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ fontSize: "64px", lineHeight: 1 }}>{user?.avatarEmoji ?? "🦉"}</div>
            <div>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "30px", color: "white", margin: 0 }}>
                Hi, {user?.displayName ?? user?.name ?? "Owl"}! 👋
              </h1>
              <div style={{ color: "#B0C4DE", fontSize: "14px", marginTop: "6px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                {user?.yearGroup && <span>📚 Year {user.yearGroup}</span>}
                <span>⭐ {user?.totalPoints ?? 0} points</span>
                {myClasses.length > 0 && <span>🏫 {myClasses.map(c => c.className).join(", ")}</span>}
              </div>
            </div>
          </div>

          {/* Right: XP bar + streak */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "220px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: 800, color: "#F5A623" }}>⚡ Level {level}</span>
                <span style={{ fontSize: "12px", color: "#8899AA" }}>{xpIntoLevel}/{XP_PER_LEVEL} XP</span>
              </div>
              <div style={{ height: "12px", borderRadius: "99px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "99px",
                  background: "linear-gradient(90deg, #F5A623, #FFD700)",
                  width: `${xpPct}%`, transition: "width 0.8s ease",
                  boxShadow: "0 0 8px rgba(245,166,35,0.5)",
                }} />
              </div>
            </div>
            {(user?.currentStreak ?? 0) > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px", borderRadius: "20px",
                background: "rgba(255,100,30,0.12)", border: "1.5px solid rgba(255,100,30,0.4)",
                fontSize: "14px", fontWeight: 800, color: "#FF6820",
              }}>
                🔥 {user?.currentStreak}-day streak! {(user?.currentStreak ?? 0) >= 3 ? "Keep it up!" : ""}
              </div>
            )}
          </div>
        </div>

        {/* ── Teacher set work (if any) ── */}
        {pendingWork.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <SectionHeading>📋 Work Set By Your Teacher</SectionHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {pendingWork.map(w => {
                const due = dueLabel(w.dueDate);
                const skill = SKILLS.find(s => s.id === w.skillId);
                return (
                  <div key={w.id} style={{
                    padding: "14px 18px", borderRadius: "16px",
                    background: "rgba(245,166,35,0.07)",
                    border: "1.5px solid rgba(245,166,35,0.2)",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: "4px" }}>{w.title}</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        {skill && <span style={{ fontSize: "12px", background: "rgba(78,205,196,0.15)", color: "#4ECDC4", borderRadius: "6px", padding: "2px 8px", fontWeight: 700 }}>{skill.icon} {skill.name}</span>}
                        {due && <span style={{ fontSize: "12px", color: due.colour, fontWeight: 700 }}>{due.text}</span>}
                        <span style={{ fontSize: "12px", color: "#8899AA" }}>from {w.teacherName ?? "Teacher"}</span>
                      </div>
                    </div>
                    <Link href={w.skillId ? `/practice/${w.skillId}` : "/practice"}>
                      <button className="no-btn-gold" style={{ fontSize: "13px", padding: "8px 16px", whiteSpace: "nowrap" }}>Start →</button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Big activity grid ── */}
        <div style={{ marginBottom: "32px" }}>
          <SectionHeading>🚀 What do you want to do?</SectionHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
            <ActivityCard
              href="/practice"
              icon="🧩"
              label="Practice"
              desc="Practise any maths skill"
              gradient="linear-gradient(135deg, rgba(78,205,196,0.18), rgba(52,152,219,0.12))"
              border="#4ECDC4"
              textColor="#4ECDC4"
            />
            <ActivityCard
              href="/test"
              icon="⏱️"
              label="Timed Test"
              desc="Race against the clock"
              gradient="linear-gradient(135deg, rgba(245,166,35,0.18), rgba(255,215,0,0.10))"
              border="#F5A623"
              textColor="#F5A623"
            />
            <ActivityCard
              href="/competition"
              icon="🏆"
              label="Competition"
              desc="Hard challenge questions"
              gradient="linear-gradient(135deg, rgba(231,76,60,0.18), rgba(192,57,43,0.10))"
              border="#E74C3C"
              textColor="#E74C3C"
            />
            <ActivityCard
              href="/escape-rooms"
              icon="🔐"
              label="Escape Rooms"
              desc="Solve puzzles to escape!"
              gradient="linear-gradient(135deg, rgba(155,89,182,0.18), rgba(142,68,173,0.10))"
              border="#9B59B6"
              textColor="#9B59B6"
            />
            <ActivityCard
              href="/games"
              icon="🎮"
              label="Games Hub"
              desc="Fun maths games"
              gradient="linear-gradient(135deg, rgba(52,152,219,0.18), rgba(41,128,185,0.10))"
              border="#3498DB"
              textColor="#3498DB"
            />
            <ActivityCard
              href="/puzzles"
              icon="🔢"
              label="Shape Puzzles"
              desc="Work out the values"
              gradient="linear-gradient(135deg, rgba(46,204,113,0.18), rgba(39,174,96,0.10))"
              border="#2ECC71"
              textColor="#2ECC71"
            />
            <ActivityCard
              href="/potw"
              icon="🦉"
              label="Problem of the Week"
              desc="This week's big challenge"
              gradient="linear-gradient(135deg, rgba(230,126,34,0.18), rgba(211,84,0,0.10))"
              border="#E67E22"
              textColor="#E67E22"
            />
            <ActivityCard
              href="/leaderboard"
              icon="🏅"
              label="Leaderboard"
              desc="See the top scores"
              gradient="linear-gradient(135deg, rgba(241,196,15,0.18), rgba(243,156,18,0.10))"
              border="#F1C40F"
              textColor="#F1C40F"
            />
            <ActivityCard
              href="/badges"
              icon="🎖️"
              label="My Badges"
              desc="Collect them all!"
              gradient="linear-gradient(135deg, rgba(231,76,60,0.14), rgba(192,57,43,0.08))"
              border="#E91E63"
              textColor="#E91E63"
            />
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          {[
            { icon: "⭐", value: user?.totalPoints ?? 0, label: "Points", colour: "#F5A623" },
            { icon: "📝", value: totalAttempted,          label: "Questions", colour: "#4ECDC4" },
            { icon: "🎯", value: `${accuracy}%`,          label: "Accuracy", colour: "#9B59B6" },
            { icon: "⏱️", value: testsTaken,              label: "Tests", colour: "#3498DB" },
            { icon: "🎖️", value: earnedBadgeIds.size,    label: "Badges", colour: "#E91E63" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "16px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>{s.icon}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "24px", color: s.colour, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#8899AA", marginTop: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Bottom grid: Skill Progress + Recent Results ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

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
                      <span style={{ fontSize: "11px", color: tried ? "#B0C4DE" : "#8899AA" }}>
                        {prog ? `${prog.correct}/${prog.attempted}` : "Not started"}
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
            <Link href="/practice" style={{ display: "block", marginTop: "16px" }}>
              <button className="no-btn-teal" style={{ width: "100%", fontSize: "14px" }}>Practice a Skill →</button>
            </Link>
          </Card>

          {/* Recent Results + Join class */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Card>
              <SectionHeading>📊 Recent Results</SectionHeading>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "8px" }}>📝</div>
                  <p style={{ color: "#8899AA", fontSize: "14px", margin: 0 }}>No tests taken yet.</p>
                  <Link href="/test" style={{ display: "block", marginTop: "12px" }}>
                    <button className="no-btn-gold" style={{ fontSize: "13px" }}>Take your first test →</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {history.slice(0, 6).map(r => {
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
                            {new Date(r.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
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
              )}
            </Card>

            {/* Join class */}
            <Card>
              <SectionHeading>🏫 My Classes</SectionHeading>
              {myClasses.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                  {myClasses.map(c => (
                    <div key={c.classId} style={{
                      padding: "10px 14px", borderRadius: "12px",
                      background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.2)",
                      fontSize: "14px", fontWeight: 700, color: "#4ECDC4",
                    }}>
                      🏫 {c.className}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#8899AA", fontSize: "13px", marginBottom: "12px" }}>
                  Join a class to see work from your teacher.
                </p>
              )}
              {!showJoin ? (
                <button
                  onClick={() => setShowJoin(true)}
                  style={{
                    background: "none", border: "1.5px dashed rgba(255,255,255,0.15)",
                    color: "#8899AA", borderRadius: "10px", padding: "10px 16px",
                    fontSize: "14px", cursor: "pointer", width: "100%", fontWeight: 700,
                  }}
                >
                  + Join a class with a code
                </button>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Class code (e.g. ABC123)"
                    maxLength={8}
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)",
                      borderRadius: "10px", padding: "9px 14px", color: "white", fontSize: "14px",
                      fontFamily: "'Space Grotesk', monospace", letterSpacing: "0.1em", outline: "none",
                    }}
                    onKeyDown={e => e.key === "Enter" && joinCode.length >= 4 && joinClass.mutate({ joinCode })}
                  />
                  <button
                    onClick={() => joinClass.mutate({ joinCode })}
                    disabled={joinCode.length < 4 || joinClass.isPending}
                    className="no-btn-gold"
                    style={{ padding: "9px 16px", fontSize: "13px" }}
                  >
                    {joinClass.isPending ? "..." : "Join"}
                  </button>
                  <button
                    onClick={() => { setShowJoin(false); setJoinCode(""); }}
                    style={{ background: "none", border: "none", color: "#8899AA", cursor: "pointer", fontSize: "22px", padding: "0 4px" }}
                  >×</button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
