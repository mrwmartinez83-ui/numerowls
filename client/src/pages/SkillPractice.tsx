import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { SKILLS, getQuestionsForSkill } from "@shared/questionBank";
import { useParams } from "wouter";
import type { Question } from "@shared/questionBank";
import { toast } from "sonner";

export default function SkillPractice() {
  const { skillId } = useParams<{ skillId?: string }>();
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const [selectedSkill, setSelectedSkill] = useState<import("@shared/questionBank").SkillId>(
    (skillId as import("@shared/questionBank").SkillId) ?? SKILLS[0].id
  );
  // Pre-fill year group from profile
  const [yearGroup, setYearGroup] = useState(user?.yearGroup ?? 2);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const sessionStartRef = useRef<number>(Date.now());
  const sessionSavedRef = useRef(false);

  // Keep yearGroup in sync with profile
  useEffect(() => {
    if (user?.yearGroup) setYearGroup(user.yearGroup);
  }, [user?.yearGroup]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const updateProgress = trpc.skills.updateProgress.useMutation({
    onSuccess: () => utils.skills.myProgress.invalidate(),
  });
  const saveResult = trpc.results.save.useMutation({
    onSuccess: () => {
      utils.results.myHistory.invalidate();
      utils.auth.me.invalidate();
    },
  });

  // ── Reset on skill/year change ─────────────────────────────────────────────
  useEffect(() => {
    const qs = getQuestionsForSkill(selectedSkill, yearGroup);
    setQuestions(qs);
    setAnswers({});
    setRevealed({});
    setScore({ correct: 0, attempted: 0 });
    sessionStartRef.current = Date.now();
    sessionSavedRef.current = false;
  }, [selectedSkill, yearGroup]);

  // ── Save session result when all questions answered ────────────────────────
  useEffect(() => {
    if (!isAuthenticated || sessionSavedRef.current) return;
    if (questions.length === 0) return;
    const allAnswered = questions.every(q => revealed[q.id]);
    if (!allAnswered) return;

    sessionSavedRef.current = true;
    const elapsed = Math.round((Date.now() - sessionStartRef.current) / 1000);
    const pts = score.correct * 3;

    saveResult.mutate({
      testType: "practice",
      yearGroup,
      score: score.correct,
      total: questions.length,
      durationSeconds: elapsed,
      pointsEarned: pts,
      certificateEarned: false,
    });

    // Award "first_question" badge on first ever practice
    saveResult.mutate; // already called above
    if (score.correct === questions.length && questions.length >= 3) {
      toast.success(`🌟 Perfect practice session! +${pts} points`);
    }
  }, [revealed]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Answer handler ─────────────────────────────────────────────────────────
  const handleAnswer = (q: Question, choice: string) => {
    if (revealed[q.id]) return;
    const isCorrect = choice === q.answer;
    setAnswers(prev => ({ ...prev, [q.id]: choice }));
    setRevealed(prev => ({ ...prev, [q.id]: true }));
    setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), attempted: prev.attempted + 1 }));

    if (isAuthenticated) {
      updateProgress.mutate({ skillId: selectedSkill, attempted: 1, correct: isCorrect ? 1 : 0 });
    }
  };

  const skill = SKILLS.find(s => s.id === selectedSkill)!;
  const allAnswered = questions.length > 0 && questions.every(q => revealed[q.id]);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "36px", paddingBottom: "60px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "4px" }}>
              🧩 Skill Practice
            </h1>
            <p style={{ color: "#B0C4DE", fontSize: "14px", margin: 0 }}>
              Answer every question to save your progress to the dashboard.
            </p>
          </div>
          {/* Live score badge */}
          {score.attempted > 0 && (
            <div style={{
              padding: "10px 20px", borderRadius: "12px",
              background: score.correct === score.attempted ? "rgba(46,204,113,0.12)" : "rgba(245,166,35,0.12)",
              border: `1.5px solid ${score.correct === score.attempted ? "rgba(46,204,113,0.4)" : "rgba(245,166,35,0.4)"}`,
              fontSize: "16px", fontWeight: 800,
              color: score.correct === score.attempted ? "#2ECC71" : "#F5A623",
            }}>
              {score.correct}/{score.attempted} correct
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "6px" }}>SKILL</label>
            <select value={selectedSkill} onChange={e => setSelectedSkill(e.target.value as import("@shared/questionBank").SkillId)} className="no-select">
              {SKILLS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "6px" }}>YEAR GROUP</label>
            <select value={yearGroup} onChange={e => setYearGroup(Number(e.target.value))} className="no-select">
              {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
        </div>

        {/* Session complete banner */}
        {allAnswered && (
          <div style={{
            padding: "16px 20px", borderRadius: "14px", marginBottom: "28px",
            background: score.correct === questions.length ? "rgba(46,204,113,0.1)" : "rgba(245,166,35,0.1)",
            border: `2px solid ${score.correct === questions.length ? "rgba(46,204,113,0.4)" : "rgba(245,166,35,0.4)"}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontWeight: 800, color: "white", fontSize: "16px", marginBottom: "4px" }}>
                {score.correct === questions.length ? "🎉 Perfect session!" : `✅ Session complete — ${score.correct}/${questions.length} correct`}
              </div>
              <div style={{ color: "#B0C4DE", fontSize: "13px" }}>
                +{score.correct * 3} points · Progress saved to your dashboard
              </div>
            </div>
            <button className="no-btn-gold" style={{ whiteSpace: "nowrap" }}
              onClick={() => {
                sessionSavedRef.current = false;
                const qs = getQuestionsForSkill(selectedSkill, yearGroup);
                setQuestions(qs);
                setAnswers({});
                setRevealed({});
                setScore({ correct: 0, attempted: 0 });
                sessionStartRef.current = Date.now();
              }}>
              Try Again
            </button>
          </div>
        )}

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {questions.length === 0 ? (
            <div className="no-card" style={{ textAlign: "center", padding: "48px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🦉</div>
              <p style={{ color: "#B0C4DE" }}>No questions found for this skill and year group yet. Try another combination!</p>
            </div>
          ) : questions.map((q, qi) => {
            const chosen = answers[q.id];
            const isRevealed = revealed[q.id];
            return (
              <div key={q.id} className="no-card">
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{
                    minWidth: "28px", height: "28px", borderRadius: "8px",
                    background: isRevealed ? (chosen === q.answer ? "rgba(46,204,113,0.2)" : "rgba(231,76,60,0.2)") : "rgba(245,166,35,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 800,
                    color: isRevealed ? (chosen === q.answer ? "#2ECC71" : "#E74C3C") : "#F5A623",
                  }}>
                    {isRevealed ? (chosen === q.answer ? "✓" : "✗") : qi + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "white", lineHeight: 1.5, marginBottom: q.diagram ? "16px" : "0" }}>
                      {q.text}
                    </div>
                    {q.diagram && (
                      <div style={{ margin: "12px 0", padding: "16px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}
                        dangerouslySetInnerHTML={{ __html: q.diagram }} />
                    )}
                  </div>
                  {q.points && (
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#9B59B6", background: "rgba(155,89,182,0.12)", padding: "3px 8px", borderRadius: "6px", whiteSpace: "nowrap" }}>
                      {q.points}pt
                    </div>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {q.options.map((opt) => {
                    let bg     = "rgba(255,255,255,0.04)";
                    let border = "1.5px solid rgba(255,255,255,0.1)";
                    let color  = "white";
                    if (isRevealed) {
                      if (opt === q.answer)   { bg = "rgba(46,204,113,0.15)";  border = "1.5px solid #2ECC71"; color = "#2ECC71"; }
                      else if (opt === chosen) { bg = "rgba(231,76,60,0.15)";  border = "1.5px solid #E74C3C"; color = "#E74C3C"; }
                    } else if (chosen === opt) { bg = "rgba(245,166,35,0.12)"; border = "1.5px solid #F5A623"; }
                    return (
                      <button key={opt} onClick={() => handleAnswer(q, opt)}
                        style={{ padding: "10px 14px", borderRadius: "10px", background: bg, border, color, fontSize: "14px", fontWeight: 600, cursor: isRevealed ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {isRevealed && (
                  <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "10px", background: chosen === q.answer ? "rgba(46,204,113,0.08)" : "rgba(231,76,60,0.08)", fontSize: "13px", color: "#B0C4DE", lineHeight: 1.5 }}>
                    {chosen === q.answer ? "✅ " : "❌ "}{q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
