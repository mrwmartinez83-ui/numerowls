import { useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { SKILLS } from "@shared/questionBank";
import { toast } from "sonner";
import type { SkillId } from "@shared/questionBank";

type Tab = "overview" | "pupils" | "setwork" | "results";

// ── helpers ──────────────────────────────────────────────────────────────────
function pct(correct: number, attempted: number) {
  if (!attempted) return 0;
  return Math.round((correct / attempted) * 100);
}
function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function dueBadge(d: Date | string | null | undefined) {
  if (!d) return null;
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return { label: "Overdue", color: "#E74C3C" };
  if (diff === 0) return { label: "Due today", color: "#F5A623" };
  if (diff <= 3) return { label: `${diff}d left`, color: "#F5A623" };
  return { label: `${diff}d left`, color: "#2ECC71" };
}

export default function TeacherDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  const [activeClass, setActiveClass] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [newClassName, setNewClassName] = useState("");
  const [newClassYear, setNewClassYear] = useState(2);
  const [showCreateClass, setShowCreateClass] = useState(false);

  // Set-work form state
  const [workTitle, setWorkTitle] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [workSkill, setWorkSkill] = useState<SkillId>(SKILLS[0].id);
  const [workType, setWorkType] = useState<"practice" | "timed">("practice");
  const [workDue, setWorkDue] = useState("");
  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: classes, refetch: refetchClasses } = trpc.classes.myClasses.useQuery(
    undefined, { enabled: isAuthenticated }
  );
  const { data: classMembers } = trpc.classes.classDetails.useQuery(
    { classId: activeClass! }, { enabled: !!activeClass }
  );
  const { data: setWorkItems, refetch: refetchWork } = trpc.setWork.forClass.useQuery(
    { classId: activeClass! }, { enabled: !!activeClass }
  );
  const { data: pupilProgress } = trpc.classes.pupilProgress.useQuery(
    { classId: activeClass! }, { enabled: !!activeClass && activeTab === "pupils" }
  );
  const { data: classResults } = trpc.classes.classResults.useQuery(
    { classId: activeClass!, limit: 50 }, { enabled: !!activeClass && activeTab === "results" }
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createClass = trpc.classes.create.useMutation({
    onSuccess: (data) => {
      refetchClasses();
      setNewClassName("");
      setShowCreateClass(false);
      toast.success(`Class created! Join code: ${data.joinCode}`);
    },
  });
  const createWork = trpc.setWork.create.useMutation({
    onSuccess: () => {
      refetchWork();
      utils.setWork.forClass.invalidate();
      resetWorkForm();
      toast.success("Work assigned to class!");
    },
  });
  const updateWork = trpc.setWork.update.useMutation({
    onSuccess: () => {
      refetchWork();
      resetWorkForm();
      toast.success("Work updated!");
    },
  });
  const deleteWork = trpc.setWork.delete.useMutation({
    onSuccess: () => { refetchWork(); toast.success("Work removed."); },
  });

  function resetWorkForm() {
    setWorkTitle(""); setWorkDesc(""); setWorkSkill(SKILLS[0].id);
    setWorkType("practice"); setWorkDue(""); setEditingWorkId(null);
  }
  function startEdit(w: NonNullable<typeof setWorkItems>[number]) {
    setEditingWorkId(w.id);
    setWorkTitle(w.title);
    setWorkDesc(w.description ?? "");
    setWorkSkill((w.skillId as SkillId) ?? SKILLS[0].id);
    setWorkType((w.testType as "practice" | "timed") ?? "practice");
    setWorkDue(w.dueDate ? new Date(w.dueDate).toISOString().split("T")[0] : "");
    setActiveTab("setwork");
  }

  function submitWork() {
    if (!workTitle || !activeClass) return;
    const payload = {
      classId: activeClass,
      title: workTitle,
      description: workDesc || undefined,
      skillId: workSkill,
      testType: workType,
      dueDate: workDue ? new Date(workDue) : undefined,
    };
    if (editingWorkId) {
      updateWork.mutate({ workId: editingWorkId, ...payload });
    } else {
      createWork.mutate(payload);
    }
  }

  // ── Active class info ──────────────────────────────────────────────────────
  const activeClassInfo = classes?.find(c => c.id === activeClass);

  // ── Build per-pupil progress summary ──────────────────────────────────────
  type PupilSummary = {
    userId: number;
    displayName: string | null;
    name: string | null;
    avatarEmoji: string | null;
    totalPoints: number | null;
    skills: Record<string, { attempted: number; correct: number }>;
  };
  const pupilSummaryMap: Record<number, PupilSummary> = {};
  (pupilProgress ?? []).forEach(row => {
    if (!pupilSummaryMap[row.userId]) {
      pupilSummaryMap[row.userId] = {
        userId: row.userId,
        displayName: row.displayName,
        name: row.name,
        avatarEmoji: row.avatarEmoji,
        totalPoints: row.totalPoints,
        skills: {},
      };
    }
    pupilSummaryMap[row.userId].skills[row.skillId] = {
      attempted: row.attempted,
      correct: row.correct,
    };
  });
  const pupilSummaries = Object.values(pupilSummaryMap);

  // ── Loading / auth guards ──────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#F5A623", fontSize: "40px", animation: "pulse 1s infinite" }}>🦉</div>
    </div>
  );
  if (!isAuthenticated) return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px" }}>
        <div style={{ fontSize: "64px" }}>👩‍🏫</div>
        <h2 style={{ color: "white", fontWeight: 800, fontSize: "24px" }}>Sign in to access the Teacher Dashboard</h2>
        <a href={getLoginUrl()}><button className="no-btn-gold">Sign In →</button></a>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "36px", paddingBottom: "60px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "4px" }}>
            👩‍🏫 Teacher Dashboard
          </h1>
          <p style={{ color: "#B0C4DE", margin: 0 }}>
            {user?.displayName ? `Welcome, ${user.displayName}` : "Manage your classes, set work, and track pupil progress"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start" }}>

          {/* ── Left sidebar: class list ──────────────────────────────────── */}
          <div>
            <div className="no-card" style={{ marginBottom: "0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h2 style={{ fontWeight: 800, fontSize: "15px", color: "white", margin: 0 }}>My Classes</h2>
                <button onClick={() => setShowCreateClass(v => !v)}
                  style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer", color: "#F5A623", lineHeight: 1 }}>
                  {showCreateClass ? "✕" : "+"}
                </button>
              </div>

              {/* Create class form */}
              {showCreateClass && (
                <div style={{ marginBottom: "14px", padding: "14px", borderRadius: "10px", background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#F5A623", marginBottom: "8px" }}>NEW CLASS</div>
                  <input value={newClassName} onChange={e => setNewClassName(e.target.value)}
                    placeholder="Class name (e.g. 2B Maths)" className="no-input"
                    style={{ width: "100%", marginBottom: "8px" }} />
                  <select value={newClassYear} onChange={e => setNewClassYear(Number(e.target.value))}
                    className="no-select" style={{ width: "100%", marginBottom: "10px" }}>
                    {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                  <button className="no-btn-gold" style={{ width: "100%", fontSize: "13px" }}
                    onClick={() => createClass.mutate({ name: newClassName, yearGroup: newClassYear })}
                    disabled={!newClassName || createClass.isPending}>
                    {createClass.isPending ? "Creating…" : "Create Class"}
                  </button>
                </div>
              )}

              {/* Class list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(!classes || classes.length === 0) && (
                  <p style={{ color: "#B0C4DE", fontSize: "13px", textAlign: "center", padding: "16px 0" }}>
                    No classes yet. Click + to create one.
                  </p>
                )}
                {classes?.map(c => (
                  <button key={c.id}
                    onClick={() => { setActiveClass(c.id); setActiveTab("overview"); }}
                    style={{
                      padding: "10px 14px", borderRadius: "10px", textAlign: "left", cursor: "pointer",
                      background: activeClass === c.id ? "rgba(245,166,35,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${activeClass === c.id ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: "white",
                    }}>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>📚 {c.name}</div>
                    {c.yearGroup && <div style={{ fontSize: "11px", color: "#B0C4DE", marginTop: "2px" }}>Year {c.yearGroup}</div>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel ──────────────────────────────────────────────── */}
          <div>
            {!activeClass ? (
              <div className="no-card" style={{ textAlign: "center", padding: "60px 40px" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
                <h3 style={{ color: "white", fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>Select a class</h3>
                <p style={{ color: "#B0C4DE", fontSize: "14px" }}>Choose a class from the left panel to view details, assign work, and track progress.</p>
              </div>
            ) : (
              <>
                {/* Class header + join code */}
                <div className="no-card" style={{ marginBottom: "16px", padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <h2 style={{ fontWeight: 900, fontSize: "20px", color: "white", margin: 0 }}>
                        {activeClassInfo?.name}
                        {activeClassInfo?.yearGroup && <span style={{ fontSize: "13px", color: "#B0C4DE", fontWeight: 600, marginLeft: "8px" }}>Year {activeClassInfo.yearGroup}</span>}
                      </h2>
                      <div style={{ fontSize: "13px", color: "#B0C4DE", marginTop: "4px" }}>
                        {classMembers?.length ?? 0} pupil{classMembers?.length !== 1 ? "s" : ""} enrolled
                      </div>
                    </div>
                    {activeClassInfo?.joinCode && (
                      <div style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", cursor: "pointer" }}
                        onClick={() => { navigator.clipboard.writeText(activeClassInfo.joinCode!); toast.success("Join code copied!"); }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#F5A623", letterSpacing: "0.08em" }}>JOIN CODE (click to copy)</div>
                        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "20px", color: "#F5A623", letterSpacing: "0.15em" }}>
                          {activeClassInfo.joinCode}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px" }}>
                  {([
                    { id: "overview", label: "📊 Overview" },
                    { id: "pupils",   label: "👥 Pupils & Progress" },
                    { id: "setwork",  label: "📋 Set Work" },
                    { id: "results",  label: "🏆 Recent Results" },
                  ] as { id: Tab; label: string }[]).map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                      style={{
                        flex: 1, padding: "8px 10px", borderRadius: "9px", border: "none", cursor: "pointer",
                        fontSize: "13px", fontWeight: 700,
                        background: activeTab === t.id ? "rgba(245,166,35,0.15)" : "transparent",
                        color: activeTab === t.id ? "#F5A623" : "#B0C4DE",
                        transition: "all 0.15s",
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* ── OVERVIEW TAB ─────────────────────────────────────── */}
                {activeTab === "overview" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                      {[
                        { label: "Pupils", value: classMembers?.length ?? 0, icon: "👥" },
                        { label: "Tasks Set", value: setWorkItems?.length ?? 0, icon: "📋" },
                        { label: "Total Points (class)", value: (classMembers ?? []).reduce((s, p) => s + (p.totalPoints ?? 0), 0), icon: "⭐" },
                      ].map(stat => (
                        <div key={stat.label} className="no-card" style={{ textAlign: "center", padding: "16px" }}>
                          <div style={{ fontSize: "28px", marginBottom: "6px" }}>{stat.icon}</div>
                          <div style={{ fontWeight: 900, fontSize: "24px", color: "#F5A623" }}>{stat.value}</div>
                          <div style={{ fontSize: "12px", color: "#B0C4DE", fontWeight: 600 }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Quick pupil list */}
                    <div className="no-card">
                      <h3 style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: "14px" }}>Top Pupils by Points</h3>
                      {(!classMembers || classMembers.length === 0) ? (
                        <div style={{ textAlign: "center", padding: "24px", color: "#B0C4DE", fontSize: "14px" }}>
                          No pupils yet. Share the join code so pupils can enrol.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {[...classMembers].sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0)).slice(0, 5).map((p, i) => (
                            <div key={p.userId} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)" }}>
                              <div style={{ fontWeight: 800, fontSize: "14px", color: i === 0 ? "#F5A623" : "#B0C4DE", width: "20px" }}>#{i+1}</div>
                              <span style={{ fontSize: "20px" }}>{p.avatarEmoji ?? "🦉"}</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: "14px", color: "white" }}>{p.displayName ?? p.name ?? "Owl"}</div>
                                {p.yearGroup && <div style={{ fontSize: "11px", color: "#B0C4DE" }}>Year {p.yearGroup}</div>}
                              </div>
                              <div style={{ fontWeight: 800, fontSize: "16px", color: "#F5A623" }}>{p.totalPoints ?? 0} pts</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Upcoming work */}
                    <div className="no-card">
                      <h3 style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: "14px" }}>Active Work</h3>
                      {(!setWorkItems || setWorkItems.length === 0) ? (
                        <div style={{ textAlign: "center", padding: "24px", color: "#B0C4DE", fontSize: "14px" }}>
                          No work set yet. Go to the Set Work tab to assign tasks.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {setWorkItems.slice(0, 4).map(w => {
                            const badge = dueBadge(w.dueDate);
                            const sk = SKILLS.find(s => s.id === w.skillId);
                            return (
                              <div key={w.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)" }}>
                                <span style={{ fontSize: "20px" }}>{sk?.icon ?? "📋"}</span>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 700, fontSize: "14px", color: "white" }}>{w.title}</div>
                                  <div style={{ fontSize: "12px", color: "#B0C4DE" }}>{sk?.name ?? "General"} · {w.testType === "timed" ? "Timed Test" : "Practice"}</div>
                                </div>
                                {badge && <span style={{ fontSize: "11px", fontWeight: 700, color: badge.color, background: `${badge.color}22`, padding: "3px 8px", borderRadius: "6px" }}>{badge.label}</span>}
                                <button onClick={() => startEdit(w)} style={{ fontSize: "13px", background: "none", border: "none", cursor: "pointer", color: "#B0C4DE" }}>✏️</button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── PUPILS & PROGRESS TAB ────────────────────────────── */}
                {activeTab === "pupils" && (
                  <div className="no-card">
                    <h3 style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: "16px" }}>👥 Pupil Progress by Skill</h3>
                    {(!classMembers || classMembers.length === 0) ? (
                      <div style={{ textAlign: "center", padding: "40px", color: "#B0C4DE" }}>
                        No pupils enrolled yet. Share the join code: <strong style={{ color: "#F5A623" }}>{activeClassInfo?.joinCode}</strong>
                      </div>
                    ) : pupilSummaries.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px", color: "#B0C4DE" }}>
                        Pupils haven't practised any skills yet. Assign some work to get them started!
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                              <th style={{ textAlign: "left", padding: "8px 12px", color: "#B0C4DE", fontWeight: 700 }}>Pupil</th>
                              <th style={{ textAlign: "right", padding: "8px 12px", color: "#B0C4DE", fontWeight: 700 }}>Points</th>
                              {SKILLS.map(s => (
                                <th key={s.id} style={{ textAlign: "center", padding: "8px 6px", color: "#B0C4DE", fontWeight: 700, minWidth: "60px" }}>
                                  <span title={s.name}>{s.icon}</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {pupilSummaries.map(p => (
                              <tr key={p.userId} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <td style={{ padding: "10px 12px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ fontSize: "18px" }}>{p.avatarEmoji ?? "🦉"}</span>
                                    <span style={{ fontWeight: 700, color: "white" }}>{p.displayName ?? p.name ?? "Owl"}</span>
                                  </div>
                                </td>
                                <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800, color: "#F5A623" }}>{p.totalPoints ?? 0}</td>
                                {SKILLS.map(s => {
                                  const prog = p.skills[s.id];
                                  if (!prog) return (
                                    <td key={s.id} style={{ textAlign: "center", padding: "10px 6px", color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>—</td>
                                  );
                                  const p_pct = pct(prog.correct, prog.attempted);
                                  const col = p_pct >= 80 ? "#2ECC71" : p_pct >= 50 ? "#F5A623" : "#E74C3C";
                                  return (
                                    <td key={s.id} style={{ textAlign: "center", padding: "10px 6px" }}>
                                      <div title={`${prog.correct}/${prog.attempted} correct`}
                                        style={{ fontWeight: 800, fontSize: "13px", color: col }}>
                                        {p_pct}%
                                      </div>
                                      <div style={{ fontSize: "10px", color: "#B0C4DE" }}>{prog.attempted}q</div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ marginTop: "12px", fontSize: "11px", color: "#B0C4DE", display: "flex", gap: "16px" }}>
                          <span>🟢 ≥80% · 🟡 50–79% · 🔴 &lt;50%</span>
                          <span>Hover percentage for question count</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── SET WORK TAB ─────────────────────────────────────── */}
                {activeTab === "setwork" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Assign work form */}
                    <div className="no-card">
                      <h3 style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: "16px" }}>
                        {editingWorkId ? "✏️ Edit Task" : "➕ Assign New Work"}
                      </h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={{ fontSize: "11px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "5px" }}>TASK TITLE *</label>
                          <input value={workTitle} onChange={e => setWorkTitle(e.target.value)}
                            placeholder="e.g. Practise Addition — Year 2" className="no-input" style={{ width: "100%" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "5px" }}>SKILL</label>
                          <select value={workSkill} onChange={e => setWorkSkill(e.target.value as SkillId)} className="no-select" style={{ width: "100%" }}>
                            {SKILLS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "5px" }}>TYPE</label>
                          <select value={workType} onChange={e => setWorkType(e.target.value as "practice" | "timed")} className="no-select" style={{ width: "100%" }}>
                            <option value="practice">🧩 Skill Practice</option>
                            <option value="timed">⏱️ Timed Test</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "5px" }}>DUE DATE (optional)</label>
                          <input type="date" value={workDue} onChange={e => setWorkDue(e.target.value)}
                            className="no-input" style={{ width: "100%" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "5px" }}>DESCRIPTION (optional)</label>
                          <input value={workDesc} onChange={e => setWorkDesc(e.target.value)}
                            placeholder="Any extra instructions…" className="no-input" style={{ width: "100%" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button className="no-btn-gold" onClick={submitWork}
                          disabled={!workTitle || createWork.isPending || updateWork.isPending}
                          style={{ flex: 1 }}>
                          {editingWorkId ? (updateWork.isPending ? "Saving…" : "Save Changes") : (createWork.isPending ? "Assigning…" : "Assign to Class")}
                        </button>
                        {editingWorkId && (
                          <button className="no-btn-ghost" onClick={resetWorkForm} style={{ flex: 1 }}>Cancel</button>
                        )}
                      </div>
                    </div>

                    {/* Existing work items */}
                    <div className="no-card">
                      <h3 style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: "14px" }}>📋 Current Tasks ({setWorkItems?.length ?? 0})</h3>
                      {(!setWorkItems || setWorkItems.length === 0) ? (
                        <p style={{ color: "#B0C4DE", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>No tasks assigned yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {setWorkItems.map(w => {
                            const badge = dueBadge(w.dueDate);
                            const sk = SKILLS.find(s => s.id === w.skillId);
                            return (
                              <div key={w.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <span style={{ fontSize: "22px", marginTop: "2px" }}>{sk?.icon ?? "📋"}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 700, fontSize: "14px", color: "white", marginBottom: "3px" }}>{w.title}</div>
                                  <div style={{ fontSize: "12px", color: "#B0C4DE", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    <span>{sk?.name ?? "General"}</span>
                                    <span>·</span>
                                    <span>{w.testType === "timed" ? "⏱️ Timed Test" : "🧩 Practice"}</span>
                                    {w.dueDate && <><span>·</span><span>Due {fmtDate(w.dueDate)}</span></>}
                                  </div>
                                  {w.description && <div style={{ fontSize: "12px", color: "#B0C4DE", marginTop: "4px", fontStyle: "italic" }}>{w.description}</div>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                                  {badge && <span style={{ fontSize: "11px", fontWeight: 700, color: badge.color, background: `${badge.color}22`, padding: "2px 8px", borderRadius: "6px" }}>{badge.label}</span>}
                                  <div style={{ display: "flex", gap: "6px" }}>
                                    <button onClick={() => startEdit(w)} style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "3px 8px", color: "#B0C4DE", cursor: "pointer" }}>✏️ Edit</button>
                                    <button onClick={() => { if (confirm("Remove this task?")) deleteWork.mutate({ workId: w.id }); }}
                                      style={{ fontSize: "12px", background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)", borderRadius: "6px", padding: "3px 8px", color: "#E74C3C", cursor: "pointer" }}>🗑️</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── RECENT RESULTS TAB ───────────────────────────────── */}
                {activeTab === "results" && (
                  <div className="no-card">
                    <h3 style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: "16px" }}>🏆 Recent Test Results</h3>
                    {(!classResults || classResults.length === 0) ? (
                      <div style={{ textAlign: "center", padding: "40px", color: "#B0C4DE" }}>
                        No test results yet. Pupils need to complete a timed test or practice session first.
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                              {["Pupil", "Type", "Skill", "Score", "Accuracy", "Points", "Date"].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#B0C4DE", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {classResults.map(r => {
                              const acc = pct(r.score, r.total);
                              const sk = SKILLS.find(s => s.id === r.skillId);
                              const accColor = acc >= 80 ? "#2ECC71" : acc >= 50 ? "#F5A623" : "#E74C3C";
                              return (
                                <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                  <td style={{ padding: "10px 12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <span>{r.avatarEmoji ?? "🦉"}</span>
                                      <span style={{ fontWeight: 700, color: "white" }}>{r.displayName ?? r.name ?? "Owl"}</span>
                                    </div>
                                  </td>
                                  <td style={{ padding: "10px 12px", color: "#B0C4DE" }}>
                                    {r.testType === "timed" ? "⏱️ Timed" : "🧩 Practice"}
                                  </td>
                                  <td style={{ padding: "10px 12px", color: "#B0C4DE" }}>
                                    {sk ? `${sk.icon} ${sk.name}` : "—"}
                                  </td>
                                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "white" }}>
                                    {r.score}/{r.total}
                                  </td>
                                  <td style={{ padding: "10px 12px", fontWeight: 800, color: accColor }}>
                                    {acc}%
                                  </td>
                                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "#F5A623" }}>
                                    +{r.pointsEarned}
                                  </td>
                                  <td style={{ padding: "10px 12px", color: "#B0C4DE", whiteSpace: "nowrap" }}>
                                    {fmtDate(r.completedAt)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
