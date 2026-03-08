import { useState, useEffect, useRef, useCallback } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { SKILLS, getQuestionsForSkill } from "@shared/questionBank";
import type { Question } from "@shared/questionBank";
import { toast } from "sonner";
import { Link } from "wouter";

type Phase = "setup" | "running" | "finished";

export default function TimedTest() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  // Pre-fill year group from profile if available
  const [yearGroup, setYearGroup] = useState(user?.yearGroup ?? 2);
  const [duration, setDuration] = useState(10);
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep yearGroup in sync if the user profile loads after mount
  useEffect(() => {
    if (user?.yearGroup) setYearGroup(user.yearGroup);
  }, [user?.yearGroup]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const saveResult       = trpc.results.save.useMutation();
  const updateProgress   = trpc.skills.updateProgress.useMutation();
  const awardBadge       = trpc.badges.award.useMutation();

  // ── Start test ─────────────────────────────────────────────────────────────
  const startTest = () => {
    const qs: Question[] = [];
    SKILLS.forEach(skill => {
      const skillQs = getQuestionsForSkill(skill.id, yearGroup);
      qs.push(...skillQs.slice(0, 3));
    });
    const shuffled = [...qs].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(shuffled);
    setAnswers({});
    setCurrent(0);
    setTimeLeft(duration * 60);
    setStartTime(Date.now());
    setSaved(false);
    setPhase("running");
  };

  // ── Timer ──────────────────────────────────────────────────────────────────
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("finished");
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { finishTest(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, finishTest]);

  // ── Answer handler ─────────────────────────────────────────────────────────
  const handleAnswer = (choice: string) => {
    const q = questions[current];
    if (answers[q.id]) return;
    setAnswers(prev => ({ ...prev, [q.id]: choice }));
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent(c => c + 1);
      else finishTest();
    }, 600);
  };

  // ── Save results when finished ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "finished" || !isAuthenticated || saved || questions.length === 0) return;
    setSaved(true); // prevent double-save

    const correctQs   = questions.filter(q => answers[q.id] === q.answer);
    const score        = correctQs.length;
    const total        = questions.length;
    const ratio        = score / total;
    const pts          = score * 5;
    const certEarned   = ratio >= 0.8;
    const elapsed      = Math.round((Date.now() - startTime) / 1000);

    // 1. Save the overall test result
    saveResult.mutate(
      { testType: "timed", yearGroup, score, total, durationSeconds: elapsed, pointsEarned: pts, certificateEarned: certEarned },
      {
        onSuccess: () => {
          // Invalidate dashboard queries so they refresh automatically
          utils.results.myHistory.invalidate();
          utils.auth.me.invalidate(); // refreshes totalPoints in nav/header
        },
      }
    );

    // 2. Save per-skill progress breakdown
    const skillMap: Record<string, { attempted: number; correct: number }> = {};
    questions.forEach(q => {
      if (!q.skill) return;
      if (!skillMap[q.skill]) skillMap[q.skill] = { attempted: 0, correct: 0 };
      skillMap[q.skill].attempted += 1;
      if (answers[q.id] === q.answer) skillMap[q.skill].correct += 1;
    });
    Object.entries(skillMap).forEach(([skillId, data]) => {
      updateProgress.mutate(
        { skillId, attempted: data.attempted, correct: data.correct },
        { onSuccess: () => utils.skills.myProgress.invalidate() }
      );
    });

    // 3. Award badges
    // "First Steps" — answered at least one question
    if (total > 0) awardBadge.mutate({ badgeId: "first_question" });

    // "Perfect Score" — 100%
    if (ratio === 1) {
      awardBadge.mutate({ badgeId: "perfect_test" }, {
        onSuccess: () => {
          toast.success("🏆 Badge unlocked: Perfect Score!");
          utils.badges.myBadges.invalidate();
        },
      });
    }

    // "Speed Demon" — finished in under 3 minutes
    if (elapsed < 180 && total >= 10) {
      awardBadge.mutate({ badgeId: "speed_demon" }, {
        onSuccess: () => {
          toast.success("⚡ Badge unlocked: Speed Demon!");
          utils.badges.myBadges.invalidate();
        },
      });
    }

    // Show toast for certificate
    if (certEarned) {
      toast.success(`🎉 Certificate earned! You scored ${Math.round(ratio * 100)}%`);
    }

    // Invalidate badges list
    utils.badges.myBadges.invalidate();

  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: intentionally only re-runs when phase changes to "finished"

  // ── Derived values ─────────────────────────────────────────────────────────
  const mins  = Math.floor(timeLeft / 60);
  const secs  = timeLeft % 60;
  const score = questions.filter(q => answers[q.id] === q.answer).length;
  const pct   = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "720px" }}>

        {/* ── Setup ── */}
        {phase === "setup" && (
          <div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "8px" }}>⏱️ Timed Test</h1>
            <p style={{ color: "#B0C4DE", marginBottom: "32px" }}>Answer as many questions as you can before the time runs out. Score 80%+ to earn a certificate!</p>
            <div className="no-card" style={{ maxWidth: "420px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "8px" }}>YEAR GROUP</label>
                <select value={yearGroup} onChange={e => setYearGroup(Number(e.target.value))} className="no-select" style={{ width: "100%" }}>
                  {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "8px" }}>DURATION</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {[5, 10, 15, 20].map(d => (
                    <button key={d} onClick={() => setDuration(d)}
                      style={{
                        padding: "10px", borderRadius: "10px", border: `1.5px solid ${duration === d ? "#F5A623" : "rgba(255,255,255,0.1)"}`,
                        background: duration === d ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
                        color: duration === d ? "#F5A623" : "#B0C4DE", fontWeight: 700, fontSize: "14px", cursor: "pointer",
                      }}>
                      {d} min
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.2)", marginBottom: "20px", fontSize: "13px", color: "#B0C4DE" }}>
                📝 20 questions · Mixed skills · {yearGroup ? `Year ${yearGroup}` : "Select year"} · Score 80%+ for a certificate
              </div>
              <button className="no-btn-gold" style={{ width: "100%", fontSize: "16px" }} onClick={startTest}>Start Test →</button>
            </div>
          </div>
        )}

        {/* ── Running ── */}
        {phase === "running" && questions.length > 0 && (() => {
          const q = questions[current];
          const chosen = answers[q.id];
          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "14px", color: "#B0C4DE", fontWeight: 700 }}>
                  Question {current + 1} / {questions.length}
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 800,
                  color: timeLeft < 60 ? "#E74C3C" : timeLeft < 120 ? "#F5A623" : "white",
                  padding: "4px 16px", borderRadius: "10px",
                  background: timeLeft < 60 ? "rgba(231,76,60,0.1)" : "rgba(255,255,255,0.05)",
                }}>
                  {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
                </div>
                <button className="no-btn-ghost" style={{ fontSize: "13px", padding: "6px 14px" }} onClick={finishTest}>
                  Finish Early
                </button>
              </div>

              {/* Progress bar */}
              <div style={{ height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.08)", marginBottom: "28px" }}>
                <div style={{ height: "100%", borderRadius: "99px", background: "#F5A623", width: `${(current / questions.length) * 100}%`, transition: "width 0.3s" }} />
              </div>

              <div className="no-card">
                {/* Skill tag */}
                {q.skill && (() => {
                  const sk = SKILLS.find(s => s.id === q.skill);
                  return sk ? (
                    <div style={{ marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: sk.color, background: `${sk.color}22`, padding: "3px 10px", borderRadius: "6px" }}>
                        {sk.icon} {sk.name}
                      </span>
                    </div>
                  ) : null;
                })()}

                <div style={{ fontSize: "17px", fontWeight: 700, color: "white", lineHeight: 1.6, marginBottom: "20px" }}>{q.text}</div>
                {q.diagram && (
                  <div style={{ marginBottom: "18px", padding: "14px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}
                    dangerouslySetInnerHTML={{ __html: q.diagram }} />
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {q.options.map(opt => {
                    let bg     = "rgba(255,255,255,0.05)";
                    let border = "1.5px solid rgba(255,255,255,0.1)";
                    let color  = "white";
                    if (chosen) {
                      if (opt === q.answer)  { bg = "rgba(46,204,113,0.15)";  border = "1.5px solid #2ECC71"; color = "#2ECC71"; }
                      else if (opt === chosen){ bg = "rgba(231,76,60,0.15)";  border = "1.5px solid #E74C3C"; color = "#E74C3C"; }
                    }
                    return (
                      <button key={opt} onClick={() => handleAnswer(opt)}
                        style={{ padding: "13px 16px", borderRadius: "12px", background: bg, border, color, fontSize: "15px", fontWeight: 600, cursor: chosen ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Finished ── */}
        {phase === "finished" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "72px", marginBottom: "16px" }}>{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "32px", color: "white", marginBottom: "8px" }}>Test Complete!</h1>
            <div style={{ fontSize: "64px", fontWeight: 900, color: pct >= 80 ? "#2ECC71" : pct >= 50 ? "#F5A623" : "#E74C3C", marginBottom: "8px", lineHeight: 1 }}>{pct}%</div>
            <div style={{ color: "#B0C4DE", fontSize: "16px", marginBottom: "8px" }}>{score} out of {questions.length} correct</div>
            <div style={{ color: "#8899AA", fontSize: "13px", marginBottom: "32px" }}>+{score * 5} points earned</div>

            {pct >= 80 && (
              <div style={{ padding: "20px 24px", borderRadius: "16px", background: "rgba(46,204,113,0.1)", border: "2px solid rgba(46,204,113,0.4)", marginBottom: "28px", textAlign: "left" }}>
                <div style={{ fontSize: "22px", marginBottom: "8px", textAlign: "center" }}>🏆 Certificate Earned!</div>
                <p style={{ color: "#B0C4DE", margin: 0, textAlign: "center", fontSize: "14px" }}>
                  You scored {pct}% — well done! A certificate has been added to your profile.
                </p>
              </div>
            )}

            {/* Per-question review */}
            <div className="no-card" style={{ textAlign: "left", marginBottom: "28px" }}>
              <h3 style={{ fontWeight: 800, color: "white", fontSize: "15px", marginBottom: "14px" }}>📋 Question Review</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                {questions.map((q, i) => {
                  const isCorrect = answers[q.id] === q.answer;
                  return (
                    <div key={q.id} style={{
                      display: "flex", gap: "10px", alignItems: "flex-start",
                      padding: "8px 12px", borderRadius: "10px",
                      background: isCorrect ? "rgba(46,204,113,0.06)" : "rgba(231,76,60,0.06)",
                      borderLeft: `3px solid ${isCorrect ? "#2ECC71" : "#E74C3C"}`,
                    }}>
                      <span style={{ fontSize: "14px", minWidth: "20px", fontWeight: 700, color: "#8899AA" }}>{i + 1}.</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", color: "white", lineHeight: 1.4, marginBottom: "3px" }}>{q.text}</div>
                        <div style={{ fontSize: "12px", color: isCorrect ? "#2ECC71" : "#E74C3C" }}>
                          {isCorrect ? "✅ Correct" : `❌ Your answer: ${answers[q.id] ?? "—"} · Correct: ${q.answer}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="no-btn-gold" onClick={() => { setSaved(false); setPhase("setup"); }}>Try Again</button>
              <Link href="/dashboard"><button className="no-btn-teal">View Dashboard →</button></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
