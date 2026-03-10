import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { SKILLS, getQuestionsForSkill } from "@shared/questionBank";
import { useParams } from "wouter";
import type { Question } from "@shared/questionBank";
import { toast } from "sonner";
import DiagramRenderer from "@/components/DiagramRenderer";
import { renderMath } from "@/lib/renderMath";
import { fireCorrectConfetti, fireBigCelebration } from "@/hooks/useConfetti";

type Difficulty = 0 | 1 | 2 | 3; // 0 = All

const DIFFICULTY_CONFIG = {
  0: { label: "All",    icon: "✨", color: "#B0C4DE", bg: "rgba(176,196,222,0.12)", border: "rgba(176,196,222,0.3)" },
  1: { label: "Bronze", icon: "🥉", color: "#CD7F32", bg: "rgba(205,127,50,0.12)",  border: "rgba(205,127,50,0.4)" },
  2: { label: "Silver", icon: "🥈", color: "#C0C0C0", bg: "rgba(192,192,192,0.12)", border: "rgba(192,192,192,0.4)" },
  3: { label: "Gold",   icon: "🥇", color: "#FFD700", bg: "rgba(255,215,0,0.12)",   border: "rgba(255,215,0,0.4)" },
} as const;

const CORRECT_PHRASES = [
  "⭐ Brilliant!", "🎉 Amazing!", "✨ Superstar!", "🔥 On fire!",
  "🌟 Fantastic!", "💫 Wow!", "🎊 Excellent!", "👏 Great job!",
  "🦉 Hoot hoot!", "🚀 Incredible!", "💥 Outstanding!",
];
const WRONG_PHRASES = [
  "💪 Keep going!", "🧠 Nearly there!", "📚 Check the answer below!",
  "🌱 Mistakes help us learn!", "💡 You'll get the next one!",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SkillPractice() {
  const { skillId } = useParams<{ skillId?: string }>();
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const [selectedSkill, setSelectedSkill] = useState<import("@shared/questionBank").SkillId>(
    (skillId as import("@shared/questionBank").SkillId) ?? SKILLS[0].id
  );
  const [yearGroup, setYearGroup] = useState(user?.yearGroup ?? 2);
  const [difficulty, setDifficulty] = useState<Difficulty>(0);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const [feedbackMsg, setFeedbackMsg] = useState<{ id: string; text: string; correct: boolean } | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
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

  // ── Load questions on skill/year change ───────────────────────────────────
  useEffect(() => {
    const qs = getQuestionsForSkill(selectedSkill, yearGroup);
    setAllQuestions(qs);
    resetSession(qs, difficulty);
  }, [selectedSkill, yearGroup]);

  // ── Filter on difficulty change ────────────────────────────────────────────
  useEffect(() => {
    const filtered = difficulty === 0
      ? allQuestions
      : allQuestions.filter(q => q.difficulty === difficulty);
    resetSession(filtered, difficulty);
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  function resetSession(qs: Question[], _diff: Difficulty) {
    setQuestions(qs);
    setAnswers({});
    setRevealed({});
    setScore({ correct: 0, attempted: 0 });
    setFeedbackMsg(null);
    setFlashId(null);
    sessionStartRef.current = Date.now();
    sessionSavedRef.current = false;
  }

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

    if (score.correct === questions.length && questions.length >= 3) {
      fireBigCelebration();
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

    // Flash animation on card
    setFlashId(q.id);
    setTimeout(() => setFlashId(null), 600);

    // Feedback message
    const msg = isCorrect ? pickRandom(CORRECT_PHRASES) : pickRandom(WRONG_PHRASES);
    setFeedbackMsg({ id: q.id, text: msg, correct: isCorrect });
    setTimeout(() => setFeedbackMsg(prev => prev?.id === q.id ? null : prev), 2200);

    // Confetti on correct
    if (isCorrect) fireCorrectConfetti();

    if (isAuthenticated) {
      updateProgress.mutate({ skillId: selectedSkill, attempted: 1, correct: isCorrect ? 1 : 0 });
    }
  };

  const skill = SKILLS.find(s => s.id === selectedSkill)!;
  const allAnswered = questions.length > 0 && questions.every(q => revealed[q.id]);

  // Count questions per difficulty for the toggle badges
  const diffCounts: Record<number, number> = { 0: allQuestions.length, 1: 0, 2: 0, 3: 0 };
  allQuestions.forEach(q => { diffCounts[q.difficulty] = (diffCounts[q.difficulty] ?? 0) + 1; });

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

        {/* Controls row */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "24px" }}>
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

        {/* Difficulty toggle */}
        <div style={{ marginBottom: "32px" }}>
          <label style={{ fontSize: "12px", fontWeight: 700, color: "#B0C4DE", display: "block", marginBottom: "10px" }}>
            DIFFICULTY
          </label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {([0, 1, 2, 3] as Difficulty[]).map((d) => {
              const cfg = DIFFICULTY_CONFIG[d];
              const isActive = difficulty === d;
              const count = diffCounts[d] ?? 0;
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "9px 18px", borderRadius: "10px", cursor: "pointer",
                    fontWeight: 700, fontSize: "14px",
                    background: isActive ? cfg.bg : "rgba(255,255,255,0.04)",
                    border: `2px solid ${isActive ? cfg.border : "rgba(255,255,255,0.08)"}`,
                    color: isActive ? cfg.color : "#6B7F99",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                  <span style={{
                    fontSize: "11px", fontWeight: 800,
                    padding: "1px 7px", borderRadius: "20px",
                    background: isActive ? `${cfg.border}` : "rgba(255,255,255,0.06)",
                    color: isActive ? cfg.color : "#6B7F99",
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          {difficulty !== 0 && (
            <p style={{ fontSize: "12px", color: "#6B7F99", marginTop: "8px", marginBottom: 0 }}>
              {difficulty === 1 && "🥉 Bronze — warm-up questions to build confidence"}
              {difficulty === 2 && "🥈 Silver — standard competition-level questions"}
              {difficulty === 3 && "🥇 Gold — challenging questions for top competitors"}
            </p>
          )}
        </div>

        {/* Session complete banner */}
        {allAnswered && (
          <div style={{
            padding: "16px 20px", borderRadius: "14px", marginBottom: "28px",
            background: score.correct === questions.length ? "rgba(46,204,113,0.1)" : "rgba(245,166,35,0.1)",
            border: `2px solid ${score.correct === questions.length ? "rgba(46,204,113,0.4)" : "rgba(245,166,35,0.4)"}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "40px", animation: "owlWiggle 0.6s ease 1" }}>🦉</span>
              <div>
                <div style={{ fontWeight: 800, color: "white", fontSize: "16px", marginBottom: "4px" }}>
                  {score.correct === questions.length
                    ? "🎉 Perfect session! You're a maths superstar!"
                    : `✅ Session complete — ${score.correct}/${questions.length} correct`}
                </div>
                <div style={{ color: "#B0C4DE", fontSize: "13px" }}>
                  +{score.correct * 3} points · Progress saved to your dashboard
                </div>
              </div>
            </div>
            <button className="no-btn-gold" style={{ whiteSpace: "nowrap" }}
              onClick={() => {
                const qs = difficulty === 0
                  ? getQuestionsForSkill(selectedSkill, yearGroup)
                  : getQuestionsForSkill(selectedSkill, yearGroup).filter(q => q.difficulty === difficulty);
                resetSession(qs, difficulty);
              }}>
              Try Again 🔄
            </button>
          </div>
        )}

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {questions.length === 0 ? (
            <div className="no-card" style={{ textAlign: "center", padding: "48px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🦉</div>
              <p style={{ color: "#B0C4DE", marginBottom: "16px" }}>
                No {difficulty !== 0 ? DIFFICULTY_CONFIG[difficulty].label : ""} questions found for this skill and year group.
              </p>
              <button className="no-btn-ghost" onClick={() => setDifficulty(0)}>
                Show all difficulties
              </button>
            </div>
          ) : questions.map((q, qi) => {
            const chosen = answers[q.id];
            const isRevealed = revealed[q.id];
            const diffCfg = DIFFICULTY_CONFIG[q.difficulty as Difficulty];
            const isFlashing = flashId === q.id;
            const isCorrectAnswer = chosen === q.answer;
            const thisFeedback = feedbackMsg?.id === q.id ? feedbackMsg : null;

            return (
              <div
                key={q.id}
                className="no-card"
                style={{
                  transition: "all 0.3s",
                  outline: isFlashing
                    ? `3px solid ${isCorrectAnswer ? "#2ECC71" : "#E74C3C"}`
                    : "3px solid transparent",
                  transform: isFlashing ? "scale(1.01)" : "scale(1)",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
                  {/* Question number */}
                  <div style={{
                    minWidth: "32px", height: "32px", borderRadius: "10px",
                    background: isRevealed ? (isCorrectAnswer ? "rgba(46,204,113,0.25)" : "rgba(231,76,60,0.25)") : "rgba(245,166,35,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isRevealed ? "18px" : "13px", fontWeight: 800,
                    color: isRevealed ? (isCorrectAnswer ? "#2ECC71" : "#E74C3C") : "#F5A623",
                    transition: "all 0.3s",
                    animation: isFlashing ? (isCorrectAnswer ? "owlWiggle 0.5s ease 1" : "owlShake 0.4s ease 1") : "none",
                  }}>
                    {isRevealed ? (isCorrectAnswer ? "✓" : "✗") : qi + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "white", lineHeight: 1.5 }}
                      dangerouslySetInnerHTML={{ __html: renderMath(q.text) }}
                    />
                    {q.diagram && (
                      <DiagramRenderer spec={q.diagram} />
                    )}
                  </div>

                  {/* Difficulty badge */}
                  <div style={{
                    fontSize: "11px", fontWeight: 700,
                    padding: "3px 8px", borderRadius: "6px", whiteSpace: "nowrap",
                    background: diffCfg.bg, border: `1px solid ${diffCfg.border}`, color: diffCfg.color,
                  }}>
                    {diffCfg.icon} {diffCfg.label}
                  </div>
                </div>

                {/* Answer options */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {q.options.map((opt) => {
                    let bg     = "rgba(255,255,255,0.04)";
                    let border = "1.5px solid rgba(255,255,255,0.1)";
                    let color  = "white";
                    let transform = "scale(1)";
                    if (isRevealed) {
                      if (opt === q.answer)    { bg = "rgba(46,204,113,0.15)";  border = "1.5px solid #2ECC71"; color = "#2ECC71"; }
                      else if (opt === chosen) { bg = "rgba(231,76,60,0.15)";   border = "1.5px solid #E74C3C"; color = "#E74C3C"; }
                    } else if (chosen === opt) {
                      bg = "rgba(245,166,35,0.12)";  border = "1.5px solid #F5A623";
                      transform = "scale(1.02)";
                    }
                    return (
                      <button key={opt} onClick={() => handleAnswer(q, opt)}
                        style={{
                          padding: "12px 14px", borderRadius: "10px", background: bg, border, color,
                          fontSize: "14px", fontWeight: 600, cursor: isRevealed ? "default" : "pointer",
                          textAlign: "left", transition: "all 0.2s", transform,
                        }}>
                        <span dangerouslySetInnerHTML={{ __html: renderMath(opt) }} />
                      </button>
                    );
                  })}
                </div>

                {/* Instant feedback message */}
                {thisFeedback && (
                  <div style={{
                    marginTop: "10px",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    background: thisFeedback.correct ? "rgba(46,204,113,0.12)" : "rgba(231,76,60,0.1)",
                    border: `1.5px solid ${thisFeedback.correct ? "rgba(46,204,113,0.4)" : "rgba(231,76,60,0.35)"}`,
                    fontSize: "15px", fontWeight: 800,
                    color: thisFeedback.correct ? "#2ECC71" : "#E74C3C",
                    animation: "owlMsgFadeIn 0.25s ease",
                    textAlign: "center",
                  }}>
                    {thisFeedback.text}
                  </div>
                )}

                {/* Explanation */}
                {isRevealed && (
                  <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "10px", background: isCorrectAnswer ? "rgba(46,204,113,0.08)" : "rgba(231,76,60,0.08)", fontSize: "13px", color: "#B0C4DE", lineHeight: 1.5 }}>
                    {isCorrectAnswer ? "✅ " : "❌ "}<span dangerouslySetInnerHTML={{ __html: renderMath(q.explanation) }} />
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
