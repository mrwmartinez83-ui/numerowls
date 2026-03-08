import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { SKILLS, getQuestionsForSkill } from "@shared/questionBank";
import type { Question } from "@shared/questionBank";

type Phase = "setup" | "running" | "finished";

export default function TimedTest() {
  const { isAuthenticated } = useAuth();
  const [phase, setPhase] = useState<Phase>("setup");
  const [yearGroup, setYearGroup] = useState(2);
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const saveResult = trpc.results.save.useMutation();
  const awardBadge = trpc.badges.award.useMutation();

  const startTest = () => {
    const qs: Question[] = [];
    SKILLS.forEach(skill => {
      const skillQs = getQuestionsForSkill(skill.id, yearGroup);
      qs.push(...skillQs.slice(0, 3));
    });
    const shuffled = qs.sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(shuffled);
    setAnswers({});
    setCurrent(0);
    setTimeLeft(duration * 60);
    setPhase("running");
  };

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); finishTest(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  const finishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("finished");
  };

  const handleAnswer = (choice: string) => {
    const q = questions[current];
    if (answers[q.id]) return;
    setAnswers(prev => ({ ...prev, [q.id]: choice }));
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent(c => c + 1);
      else finishTest();
    }, 600);
  };

  useEffect(() => {
    if (phase !== "finished" || !isAuthenticated) return;
    const score = questions.filter(q => answers[q.id] === q.answer).length;
    const pct = score / questions.length;
    const pts = score * 5;
    saveResult.mutate({ testType: "timed", yearGroup, score, total: questions.length, durationSeconds: duration * 60, pointsEarned: pts, certificateEarned: pct >= 0.8 });
    if (pct === 1) awardBadge.mutate({ badgeId: "perfect_test" });
  }, [phase]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const score = questions.filter(q => answers[q.id] === q.answer).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "720px" }}>
        {phase === "setup" && (
          <div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "8px" }}>⏱️ Timed Test</h1>
            <p style={{ color: "#B0C4DE", marginBottom: "32px" }}>Answer as many questions as you can before the time runs out. Score 80%+ to earn a certificate!</p>
            <div className="no-card" style={{ maxWidth: "400px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "8px" }}>YEAR GROUP</label>
                <select value={yearGroup} onChange={e => setYearGroup(Number(e.target.value))} className="no-select" style={{ width: "100%" }}>
                  {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "8px" }}>DURATION</label>
                <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="no-select" style={{ width: "100%" }}>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>
              <button className="no-btn-gold" style={{ width: "100%", fontSize: "16px" }} onClick={startTest}>Start Test →</button>
            </div>
          </div>
        )}

        {phase === "running" && questions.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "14px", color: "#B0C4DE", fontWeight: 700 }}>Question {current + 1} / {questions.length}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 700, color: timeLeft < 60 ? "#E74C3C" : "#F5A623" }}>
                {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
              </div>
              <button className="no-btn-ghost" style={{ fontSize: "13px", padding: "6px 14px" }} onClick={finishTest}>Finish Early</button>
            </div>
            <div style={{ height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.1)", marginBottom: "28px" }}>
              <div style={{ height: "100%", borderRadius: "99px", background: "#F5A623", width: `${((current) / questions.length) * 100}%`, transition: "width 0.3s" }} />
            </div>
            {(() => {
              const q = questions[current];
              const chosen = answers[q.id];
              return (
                <div className="no-card">
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "white", lineHeight: 1.5, marginBottom: "20px" }}>{q.text}</div>
                  {q.diagram && <div style={{ marginBottom: "16px", padding: "14px", background: "rgba(255,255,255,0.04)", borderRadius: "10px" }} dangerouslySetInnerHTML={{ __html: q.diagram }} />}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {q.options.map(opt => {
                      let bg = "rgba(255,255,255,0.05)";
                      let border = "1.5px solid rgba(255,255,255,0.1)";
                      let color = "white";
                      if (chosen) {
                        if (opt === q.answer) { bg = "rgba(46,204,113,0.15)"; border = "1.5px solid #2ECC71"; color = "#2ECC71"; }
                        else if (opt === chosen) { bg = "rgba(231,76,60,0.15)"; border = "1.5px solid #E74C3C"; color = "#E74C3C"; }
                      }
                      return (
                        <button key={opt} onClick={() => handleAnswer(opt)}
                          style={{ padding: "12px 16px", borderRadius: "10px", background: bg, border, color, fontSize: "15px", fontWeight: 600, cursor: chosen ? "default" : "pointer", textAlign: "left" }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {phase === "finished" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "32px", color: "white", marginBottom: "8px" }}>Test Complete!</h1>
            <div style={{ fontSize: "56px", fontWeight: 900, color: pct >= 80 ? "#2ECC71" : pct >= 50 ? "#F5A623" : "#E74C3C", marginBottom: "8px" }}>{pct}%</div>
            <div style={{ color: "#B0C4DE", fontSize: "16px", marginBottom: "32px" }}>{score} out of {questions.length} correct</div>
            {pct >= 80 && (
              <div style={{ padding: "20px", borderRadius: "16px", background: "rgba(46,204,113,0.1)", border: "2px solid #2ECC71", marginBottom: "28px" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>🏆 Certificate Earned!</div>
                <p style={{ color: "#B0C4DE", margin: 0 }}>You scored {pct}% — a printable certificate has been added to your profile.</p>
              </div>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="no-btn-gold" onClick={() => setPhase("setup")}>Try Again</button>
              <button className="no-btn-ghost" onClick={() => window.location.href = "/dashboard"}>View Dashboard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
