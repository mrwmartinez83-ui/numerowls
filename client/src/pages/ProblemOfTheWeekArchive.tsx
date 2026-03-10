import { useState } from "react";
import NavBar from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { POTW_QUESTIONS } from "@shared/potwQuestionBank";

function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function successRate(correct: number, total: number) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

function difficultyLabel(d: number) {
  if (d >= 5) return { label: "⭐⭐⭐ Very Hard", color: "#E74C3C" };
  if (d >= 4) return { label: "⭐⭐ Hard", color: "#F5A623" };
  return { label: "⭐ Medium", color: "#2ECC71" };
}

export default function ProblemOfTheWeekArchive() {
  const { data: archive, isLoading } = trpc.potw.archive.useQuery();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "36px", paddingBottom: "60px", maxWidth: "860px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <Link href="/potw">
              <button style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#B0C4DE", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>
                ← Back to POTW
              </button>
            </Link>
          </div>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "32px", color: "white", margin: "0 0 8px 0" }}>
            📚 POTW Archive
          </h1>
          <p style={{ color: "#B0C4DE", margin: 0, fontSize: "15px" }}>
            All past Problems of the Week — with questions, worked solutions, and results.
          </p>
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#B0C4DE" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📖</div>
            <p>Loading archive…</p>
          </div>
        )}

        {!isLoading && (!archive || archive.length === 0) && (
          <div style={{ textAlign: "center", padding: "60px", background: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📭</div>
            <h2 style={{ color: "white", fontWeight: 800, fontSize: "20px", marginBottom: "8px" }}>No past competitions yet</h2>
            <p style={{ color: "#B0C4DE", margin: 0 }}>Once a competition has been ended by a teacher, it will appear here with full results and worked solutions.</p>
          </div>
        )}

        {archive && archive.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {archive.map((comp, idx) => {
              const question = POTW_QUESTIONS.find(q => q.id === comp.questionId);
              const rate = successRate(Number(comp.correct), Number(comp.total));
              const isOpen = expanded === comp.id;
              const diff = question ? difficultyLabel(question.difficulty) : null;

              return (
                <div key={comp.id} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}>
                  {/* Card header — always visible */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : comp.id)}
                    style={{ padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "16px" }}
                  >
                    {/* Week number badge */}
                    <div style={{
                      minWidth: "44px", height: "44px", borderRadius: "12px",
                      background: "linear-gradient(135deg, #F5A623, #E8960A)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: "16px", color: "white", flexShrink: 0,
                    }}>
                      #{archive.length - idx}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                        <h3 style={{ fontWeight: 800, fontSize: "17px", color: "white", margin: 0 }}>{comp.title}</h3>
                        {comp.yearLabel && (
                          <span style={{ background: "rgba(245,166,35,0.15)", color: "#F5A623", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", border: "1px solid rgba(245,166,35,0.3)" }}>
                            {comp.yearLabel}
                          </span>
                        )}
                        {diff && (
                          <span style={{ fontSize: "11px", fontWeight: 700, color: diff.color }}>
                            {diff.label}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <span style={{ color: "#B0C4DE", fontSize: "13px" }}>📅 Ended {fmtDate(comp.endedAt)}</span>
                        <span style={{ color: "#B0C4DE", fontSize: "13px" }}>👥 {Number(comp.total)} entries</span>
                        <span style={{ color: rate >= 50 ? "#2ECC71" : rate >= 25 ? "#F5A623" : "#E74C3C", fontSize: "13px", fontWeight: 700 }}>
                          ✓ {rate}% correct
                        </span>
                        <span style={{ color: "#B0C4DE", fontSize: "13px" }}>🏅 {comp.points} pts</span>
                      </div>
                    </div>

                    <div style={{ color: "#B0C4DE", fontSize: "20px", flexShrink: 0, marginTop: "4px" }}>
                      {isOpen ? "▲" : "▼"}
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isOpen && question && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "24px" }}>

                      {/* Question */}
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#F5A623", letterSpacing: "0.08em", marginBottom: "10px" }}>THE QUESTION</div>
                        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ color: "white", fontSize: "15px", lineHeight: "1.7" }}
                            dangerouslySetInnerHTML={{ __html: question.text }} />
                          {question.diagram && (
                            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
                              dangerouslySetInnerHTML={{ __html: question.diagram }} />
                          )}
                        </div>
                      </div>

                      {/* Options */}
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#F5A623", letterSpacing: "0.08em", marginBottom: "10px" }}>OPTIONS</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px" }}>
                          {question.options.map((opt) => {
                            const isCorrect = opt === question.answer;
                            return (
                              <div key={opt} style={{
                                padding: "10px 14px",
                                borderRadius: "10px",
                                border: isCorrect ? "2px solid #2ECC71" : "1px solid rgba(255,255,255,0.1)",
                                background: isCorrect ? "rgba(46,204,113,0.12)" : "rgba(255,255,255,0.03)",
                                color: isCorrect ? "#2ECC71" : "#B0C4DE",
                                fontWeight: isCorrect ? 800 : 400,
                                fontSize: "14px",
                                display: "flex", alignItems: "center", gap: "6px",
                              }}>
                                {isCorrect && <span>✓</span>}
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Worked solution */}
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#2ECC71", letterSpacing: "0.08em", marginBottom: "10px" }}>WORKED SOLUTION</div>
                        <div style={{ background: "rgba(46,204,113,0.06)", borderRadius: "12px", padding: "16px", border: "1px solid rgba(46,204,113,0.2)" }}>
                          <div style={{ color: "#E8F8F0", fontSize: "14px", lineHeight: "1.7" }}
                            dangerouslySetInnerHTML={{ __html: question.solution }} />
                        </div>
                      </div>

                      {/* Stats bar */}
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#B0C4DE", letterSpacing: "0.08em", marginBottom: "10px" }}>CLASS RESULTS</div>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: "120px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "12px 16px", textAlign: "center" }}>
                            <div style={{ fontSize: "24px", fontWeight: 900, color: "white" }}>{Number(comp.total)}</div>
                            <div style={{ fontSize: "12px", color: "#B0C4DE" }}>Total Entries</div>
                          </div>
                          <div style={{ flex: 1, minWidth: "120px", background: "rgba(46,204,113,0.08)", borderRadius: "10px", padding: "12px 16px", textAlign: "center", border: "1px solid rgba(46,204,113,0.2)" }}>
                            <div style={{ fontSize: "24px", fontWeight: 900, color: "#2ECC71" }}>{Number(comp.correct)}</div>
                            <div style={{ fontSize: "12px", color: "#B0C4DE" }}>Correct</div>
                          </div>
                          <div style={{ flex: 1, minWidth: "120px", background: "rgba(231,76,60,0.08)", borderRadius: "10px", padding: "12px 16px", textAlign: "center", border: "1px solid rgba(231,76,60,0.2)" }}>
                            <div style={{ fontSize: "24px", fontWeight: 900, color: "#E74C3C" }}>{Number(comp.total) - Number(comp.correct)}</div>
                            <div style={{ fontSize: "12px", color: "#B0C4DE" }}>Incorrect</div>
                          </div>
                          <div style={{ flex: 1, minWidth: "120px", background: "rgba(245,166,35,0.08)", borderRadius: "10px", padding: "12px 16px", textAlign: "center", border: "1px solid rgba(245,166,35,0.2)" }}>
                            <div style={{ fontSize: "24px", fontWeight: 900, color: "#F5A623" }}>{rate}%</div>
                            <div style={{ fontSize: "12px", color: "#B0C4DE" }}>Success Rate</div>
                          </div>
                        </div>
                        {/* Success rate bar */}
                        <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${rate}%`,
                            background: rate >= 50 ? "linear-gradient(90deg,#2ECC71,#27AE60)" : rate >= 25 ? "linear-gradient(90deg,#F5A623,#E8960A)" : "linear-gradient(90deg,#E74C3C,#C0392B)",
                            borderRadius: "999px",
                            transition: "width 0.6s ease",
                          }} />
                        </div>
                      </div>

                      {/* Winners podium */}
                      {comp.winners && comp.winners.length > 0 && (
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#F5A623", letterSpacing: "0.08em", marginBottom: "10px" }}>🏆 FIRST CORRECT ANSWERS</div>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {comp.winners.map((w, i) => {
                              const medals = ["🥇", "🥈", "🥉"];
                              return (
                                <div key={i} style={{
                                  display: "flex", alignItems: "center", gap: "8px",
                                  background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "8px 14px",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }}>
                                  <span style={{ fontSize: "18px" }}>{medals[i] ?? "🌟"}</span>
                                  <span style={{ fontSize: "16px" }}>{w.avatarEmoji ?? "🦉"}</span>
                                  <span style={{ fontWeight: 700, color: "white", fontSize: "14px" }}>{w.displayName ?? "Anonymous Owl"}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question not found fallback */}
                  {isOpen && !question && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px" }}>
                      <p style={{ color: "#B0C4DE", margin: 0, fontSize: "14px" }}>
                        Question details not available (question ID: {comp.questionId}).
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
