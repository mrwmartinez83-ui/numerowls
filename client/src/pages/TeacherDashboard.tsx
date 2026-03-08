import { useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { SKILLS } from "@shared/questionBank";

export default function TeacherDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeClass, setActiveClass] = useState<number | null>(null);
  const [newClassName, setNewClassName] = useState("");
  const [newClassYear, setNewClassYear] = useState(2);
  const [workTitle, setWorkTitle] = useState("");
  const [workSkill, setWorkSkill] = useState<import("@shared/questionBank").SkillId>(SKILLS[0].id);

  const { data: classes, refetch: refetchClasses } = trpc.classes.myClasses.useQuery(undefined, { enabled: isAuthenticated });
  const { data: classMembers } = trpc.classes.classDetails.useQuery({ classId: activeClass! }, { enabled: !!activeClass });
  const { data: setWorkItems, refetch: refetchWork } = trpc.setWork.forClass.useQuery({ classId: activeClass! }, { enabled: !!activeClass });

  const createClass = trpc.classes.create.useMutation({ onSuccess: () => { refetchClasses(); setNewClassName(""); } });
  const createWork = trpc.setWork.create.useMutation({ onSuccess: () => { refetchWork(); setWorkTitle(""); } });

  if (loading) return <div style={{ minHeight: "100vh", background: "#0F1B2D", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "#F5A623", fontSize: "32px" }}>🦉</div></div>;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
        <NavBar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px" }}>
          <div style={{ fontSize: "64px" }}>👩‍🏫</div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "24px" }}>Sign in to access the Teacher Dashboard</h2>
          <a href={getLoginUrl()}><button className="no-btn-gold">Sign In →</button></a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "4px" }}>👩‍🏫 Teacher Dashboard</h1>
        <p style={{ color: "#B0C4DE", marginBottom: "32px" }}>Manage your classes, set work, and track pupil progress</p>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>
          {/* Classes sidebar */}
          <div>
            <div className="no-card" style={{ marginBottom: "16px" }}>
              <h2 style={{ fontWeight: 800, fontSize: "16px", color: "white", marginBottom: "16px" }}>My Classes</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {classes?.map(c => (
                  <button key={c.id} onClick={() => setActiveClass(c.id)}
                    style={{ padding: "10px 14px", borderRadius: "10px", background: activeClass === c.id ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${activeClass === c.id ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.08)"}`, color: "white", fontSize: "14px", fontWeight: 700, textAlign: "left", cursor: "pointer" }}>
                    📚 {c.name}
                    {c.yearGroup && <span style={{ fontSize: "11px", color: "#B0C4DE", marginLeft: "6px" }}>Y{c.yearGroup}</span>}
                  </button>
                ))}
                {(!classes || classes.length === 0) && <p style={{ color: "#B0C4DE", fontSize: "13px" }}>No classes yet</p>}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", marginBottom: "8px" }}>CREATE NEW CLASS</div>
                <input value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="Class name" className="no-input" style={{ width: "100%", marginBottom: "8px" }} />
                <select value={newClassYear} onChange={e => setNewClassYear(Number(e.target.value))} className="no-select" style={{ width: "100%", marginBottom: "10px" }}>
                  {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
                <button className="no-btn-gold" style={{ width: "100%", fontSize: "13px" }} onClick={() => createClass.mutate({ name: newClassName, yearGroup: newClassYear })} disabled={!newClassName}>
                  + Create Class
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div>
            {!activeClass ? (
              <div className="no-card" style={{ textAlign: "center", padding: "60px" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📚</div>
                <p style={{ color: "#B0C4DE" }}>Select a class from the left to view details and set work</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Pupil list */}
                <div className="no-card">
                  <h2 style={{ fontWeight: 800, fontSize: "17px", color: "white", marginBottom: "16px" }}>👥 Pupils</h2>
                  {!classMembers || classMembers.length === 0 ? (
                    <div>
                      <p style={{ color: "#B0C4DE", fontSize: "14px", marginBottom: "12px" }}>No pupils have joined this class yet.</p>
                      <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", fontSize: "13px", color: "#F5A623" }}>
                        Share the class join code with your pupils so they can join.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {classMembers.map(p => (
                        <div key={p.userId} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)" }}>
                          <span style={{ fontSize: "20px" }}>{p.avatarEmoji ?? "🦉"}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: "14px", color: "white" }}>{p.displayName ?? p.name ?? "Owl"}</div>
                            {p.yearGroup && <div style={{ fontSize: "11px", color: "#B0C4DE" }}>Year {p.yearGroup}</div>}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: "15px", color: "#F5A623" }}>{p.totalPoints ?? 0} pts</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Set work */}
                <div className="no-card">
                  <h2 style={{ fontWeight: 800, fontSize: "17px", color: "white", marginBottom: "16px" }}>📋 Set Work</h2>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                    <input value={workTitle} onChange={e => setWorkTitle(e.target.value)} placeholder="Task title" className="no-input" style={{ flex: 1, minWidth: "180px" }} />
                    <select value={workSkill} onChange={e => setWorkSkill(e.target.value as import("@shared/questionBank").SkillId)} className="no-select">
                      {SKILLS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                    </select>
                    <button className="no-btn-gold" style={{ fontSize: "13px" }} onClick={() => createWork.mutate({ classId: activeClass, title: workTitle, skillId: workSkill })} disabled={!workTitle}>
                      + Set Work
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {setWorkItems?.map(w => (
                      <div key={w.id} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "white" }}>{w.title}</div>
                          {w.skillId && <div style={{ fontSize: "12px", color: "#B0C4DE" }}>{SKILLS.find(s => s.id === w.skillId)?.name}</div>}
                        </div>
                        <div style={{ fontSize: "11px", color: "#B0C4DE" }}>{new Date(w.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                    {(!setWorkItems || setWorkItems.length === 0) && <p style={{ color: "#B0C4DE", fontSize: "13px" }}>No work set yet</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
