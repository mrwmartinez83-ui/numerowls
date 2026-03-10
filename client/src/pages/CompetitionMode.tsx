import { useState, useEffect, useRef, useCallback } from "react";
import { fireCorrectConfetti, fireBigCelebration, firePerfectScore } from "@/hooks/useConfetti";
import OwlMascot from "@/components/OwlMascot";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { COMPETITION_QUESTIONS } from "@shared/questionBank";
import type { Question } from "@shared/questionBank";
import { toast } from "sonner";
import { Link } from "wouter";
import DiagramRenderer from "@/components/DiagramRenderer";
import { renderMath } from "@/lib/renderMath";

const CORRECT_PHRASES = [
  "⭐ Brilliant!", "🎉 Amazing!", "✨ Superstar!", "🔥 On fire!",
  "🌟 Fantastic!", "💫 Wow!", "🎊 Excellent!", "👏 Great job!",
];
const WRONG_PHRASES = [
  "💪 Keep going!", "🧠 Nearly!", "💡 Next one!",
  "🌱 Try again!", "📚 Check it!",
];

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

type Phase = "setup" | "running" | "finished";

const YEAR_EMOJI: Record<number, string> = { 1: "🌱", 2: "🌿", 3: "🌳", 4: "⭐", 5: "🚀", 6: "🏆" };

const SKILL_LABELS: Record<string, string> = {
  addition: "Addition & Subtraction",
  multiplication: "Multiplication & Division",
  fractions: "Fractions & Decimals",
  shapes: "Shapes & Geometry",
  patterns: "Patterns & Sequences",
  logic: "Logic & Word Problems",
  puzzles: "Shape Value Puzzles",
  measurement: "Measurement & Data",
  time: "Time & Calendar",
};

export default function CompetitionMode() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const [yearGroup, setYearGroup] = useState(user?.yearGroup ?? 4);
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [saved, setSaved] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; correct: boolean } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep yearGroup in sync if user profile loads after mount
  useEffect(() => {
    if (user?.yearGroup) setYearGroup(user.yearGroup);
  }, [user?.yearGroup]);

  const saveResult = trpc.results.save.useMutation();
  const awardBadge = trpc.badges.award.useMutation();

  // ── Start competition ──────────────────────────────────────────────────────
  const startCompetition = () => {
    // Only use competition questions for this year group and below
    const pool = COMPETITION_QUESTIONS.filter(q => q.year <= yearGroup);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(20, pool.length));
    setQuestions(shuffled);
    setAnswers({});
    setCurrent(0);
    setTimeLeft(25 * 60); // 25 minutes for competition mode
    setStartTime(Date.now());
    setSaved(false);
    setFeedbackMsg(null);
    setSelectedOption(null);
    setPhase("running");
  };

  // ── Timer ──────────────────────────────────────────────────────────────────
  const finishCompetition = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("finished");
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { finishCompetition(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, finishCompetition]);

  // ── Answer a question ──────────────────────────────────────────────────────
  const handleAnswer = (option: string) => {
    const q = questions[current];
    if (!q || answers[q.id] !== undefined) return;

    const correct = option === q.answer;
    setAnswers(prev => ({ ...prev, [q.id]: option }));
    setSelectedOption(option);

    if (correct) {
      fireCorrectConfetti();
      setFeedbackMsg({ text: pickRandom(CORRECT_PHRASES), correct: true });
    } else {
      setFeedbackMsg({ text: pickRandom(WRONG_PHRASES), correct: false });
    }

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackMsg(null);
      setSelectedOption(null);
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
      } else {
        finishCompetition();
      }
    }, 1200);
  };

  // ── Compute results ────────────────────────────────────────────────────────
  const correctCount = questions.filter(q => answers[q.id] === q.answer).length;
  const totalPoints = questions
    .filter(q => answers[q.id] === q.answer)
    .reduce((sum, q) => sum + q.points, 0);
  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const timeTaken = Math.round((Date.now() - startTime) / 1000);

  // ── Save result when finished ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "finished" || saved || !isAuthenticated || questions.length === 0) return;
    setSaved(true);

    if (pct === 100) firePerfectScore();
    else if (pct >= 70) fireBigCelebration();

    saveResult.mutate({
      testType: "competition",
      yearGroup,
      score: correctCount,
      total: questions.length,
      durationSeconds: timeTaken,
      pointsEarned: totalPoints,
      certificateEarned: pct >= 80,
    }, {
      onSuccess: (data) => {
        if (data?.success) {
          utils.auth.me.invalidate();
          if (data.newStreak && data.newStreak >= 3) {
            toast.success(`🔥 ${data.newStreak}-day streak! Keep it up!`);
          }
        }
      },
    });

    // Award competition badge for 80%+
    if (pct >= 80) {
      awardBadge.mutate({ badgeId: "competition_star" });
    }
    if (pct === 100) {
      awardBadge.mutate({ badgeId: "perfect_score" });
    }
  }, [phase]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const timerWarning = timeLeft <= 120; // last 2 minutes

  // ── Difficulty badge ───────────────────────────────────────────────────────
  const difficultyLabel = (d: number) => d === 1 ? "🟢 Bronze" : d === 2 ? "🟡 Silver" : "🔴 Gold";
  const difficultyColor = (d: number) => d === 1 ? "#4ECDC4" : d === 2 ? "#F5A623" : "#E74C3C";

  // ── Medal ──────────────────────────────────────────────────────────────────
  const medal = pct === 100 ? "🥇" : pct >= 80 ? "🥈" : pct >= 60 ? "🥉" : "🦉";
  const medalLabel = pct === 100 ? "Gold Medal!" : pct >= 80 ? "Silver Medal!" : pct >= 60 ? "Bronze Medal!" : "Keep Practising!";
  const owlMood = pct >= 80 ? "celebrating" : pct >= 50 ? "happy" : "sad";

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D", color: "white" }}>
      <NavBar />

      {/* ── SETUP PHASE ─────────────────────────────────────────────────── */}
      {phase === "setup" && (
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "72px", marginBottom: "12px", filter: "drop-shadow(0 8px 24px rgba(245,166,35,0.3))" }}>🏆</div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(28px,5vw,42px)", color: "white", marginBottom: "10px" }}>
              Competition Mode
            </h1>
            <p style={{ color: "#B0C4DE", fontSize: "16px", maxWidth: "480px", margin: "0 auto 8px" }}>
              20 hand-picked competition questions inspired by PMC, Math Kangaroo, and UKMT. You have <strong style={{ color: "#F5A623" }}>25 minutes</strong>. Good luck!
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginTop: "12px" }}>
              {["PMC", "Math Kangaroo", "UKMT", "AMC 8"].map(src => (
                <span key={src} style={{
                  padding: "3px 10px", borderRadius: "99px",
                  background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)",
                  color: "#F5A623", fontSize: "12px", fontWeight: 700,
                }}>{src}</span>
              ))}
            </div>
          </div>

          {/* Year group selector */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.09)",
            borderRadius: "16px", padding: "28px 24px", marginBottom: "24px",
          }}>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "16px", color: "white", marginBottom: "16px" }}>
              Choose your year group
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {[1, 2, 3, 4, 5, 6].map(y => (
                <button
                  key={y}
                  onClick={() => setYearGroup(y)}
                  style={{
                    padding: "14px 8px", borderRadius: "12px", border: "2px solid",
                    borderColor: yearGroup === y ? "#F5A623" : "rgba(255,255,255,0.1)",
                    background: yearGroup === y ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.03)",
                    color: yearGroup === y ? "#F5A623" : "#B0C4DE",
                    fontWeight: 800, fontSize: "14px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "22px" }}>{YEAR_EMOJI[y]}</span>
                  <span>Year {y}</span>
                </button>
              ))}
            </div>
            <p style={{ color: "#B0C4DE", fontSize: "13px", marginTop: "12px", textAlign: "center" }}>
              {COMPETITION_QUESTIONS.filter(q => q.year <= yearGroup).length} competition questions available for Year {yearGroup} and below
            </p>
          </div>

          {/* What to expect */}
          <div style={{
            background: "rgba(245,166,35,0.05)", border: "1.5px solid rgba(245,166,35,0.2)",
            borderRadius: "16px", padding: "20px 24px", marginBottom: "28px",
          }}>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "15px", color: "#F5A623", marginBottom: "12px" }}>
              📋 What to expect
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                ["🔢", "20 questions", "Mixed skills"],
                ["⏱️", "25 minutes", "Competition timing"],
                ["🟢🟡🔴", "Bronze / Silver / Gold", "3 difficulty levels"],
                ["🏅", "Earn a medal", "60% Bronze · 80% Silver · 100% Gold"],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "13px", color: "white" }}>{title}</div>
                    <div style={{ fontSize: "12px", color: "#B0C4DE" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startCompetition}
            style={{
              width: "100%", padding: "18px", borderRadius: "14px",
              background: "linear-gradient(135deg, #F5A623, #FFD700)",
              color: "#0F1B2D", fontWeight: 900, fontSize: "18px",
              border: "none", cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 4px 20px rgba(245,166,35,0.35)",
            }}
          >
            🏆 Start Competition — Year {yearGroup} →
          </button>
        </div>
      )}

      {/* ── RUNNING PHASE ───────────────────────────────────────────────── */}
      {phase === "running" && questions.length > 0 && (
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 20px" }}>
          {/* Header bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "20px", flexWrap: "wrap", gap: "10px",
          }}>
            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontWeight: 800, fontSize: "14px", color: "#F5A623" }}>
                Q{current + 1} / {questions.length}
              </span>
              <div style={{ width: "120px", height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.1)" }}>
                <div style={{
                  height: "100%", borderRadius: "99px",
                  background: "linear-gradient(90deg, #F5A623, #FFD700)",
                  width: `${((current + 1) / questions.length) * 100}%`,
                  transition: "width 0.3s ease",
                }} />
              </div>
            </div>

            {/* Timer */}
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 16px", borderRadius: "20px",
              background: timerWarning ? "rgba(231,76,60,0.15)" : "rgba(255,255,255,0.06)",
              border: `1.5px solid ${timerWarning ? "rgba(231,76,60,0.5)" : "rgba(255,255,255,0.12)"}`,
              color: timerWarning ? "#E74C3C" : "#B0C4DE",
              fontWeight: 800, fontSize: "16px",
              animation: timerWarning ? "owlPulse 1s ease-in-out infinite" : "none",
            }}>
              ⏱️ {formatTime(timeLeft)}
            </div>

            {/* Score so far */}
            <div style={{ fontWeight: 800, fontSize: "13px", color: "#4ECDC4" }}>
              ✅ {Object.values(answers).filter((a, i) => a === questions[i]?.answer).length} correct
            </div>
          </div>

          {/* Question card */}
          {(() => {
            const q = questions[current];
            const answered = answers[q.id] !== undefined;
            return (
              <div style={{
                background: "rgba(26,46,74,0.8)", border: "1.5px solid rgba(255,255,255,0.09)",
                borderRadius: "20px", padding: "28px 24px", marginBottom: "16px",
                position: "relative", overflow: "hidden",
              }}>
                {/* Difficulty badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 800,
                    background: `${difficultyColor(q.difficulty)}22`,
                    border: `1px solid ${difficultyColor(q.difficulty)}55`,
                    color: difficultyColor(q.difficulty),
                  }}>{difficultyLabel(q.difficulty)}</span>
                  <span style={{
                    padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700,
                    background: "rgba(255,255,255,0.06)", color: "#B0C4DE",
                  }}>{SKILL_LABELS[q.skill] ?? q.skill}</span>
                  <span style={{
                    padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700,
                    background: "rgba(245,166,35,0.1)", color: "#F5A623",
                  }}>⭐ {q.points} pts</span>
                </div>

                {/* Question text */}
                <p
                  style={{ fontSize: "clamp(15px,2.5vw,19px)", fontWeight: 600, color: "white", lineHeight: 1.6, marginBottom: "16px" }}
                  dangerouslySetInnerHTML={{ __html: renderMath(q.text) }}
                />

                {/* Diagram if present */}
                {q.diagram && (
                  <div style={{ marginBottom: "16px" }}>
                    <DiagramRenderer spec={q.diagram} />
                  </div>
                )}

                {/* Options */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {q.options.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = answered && opt === q.answer;
                    const isWrong = answered && isSelected && opt !== q.answer;
                    const label = ["A", "B", "C", "D", "E"][i];
                    return (
                      <button
                        key={opt}
                        onClick={() => !answered && handleAnswer(opt)}
                        disabled={answered}
                        style={{
                          padding: "14px 16px", borderRadius: "12px",
                          border: "2px solid",
                          borderColor: isCorrect ? "#4ECDC4" : isWrong ? "#E74C3C" : isSelected ? "#F5A623" : "rgba(255,255,255,0.1)",
                          background: isCorrect ? "rgba(78,205,196,0.15)" : isWrong ? "rgba(231,76,60,0.15)" : isSelected ? "rgba(245,166,35,0.12)" : "rgba(255,255,255,0.03)",
                          color: isCorrect ? "#4ECDC4" : isWrong ? "#E74C3C" : "white",
                          fontWeight: 700, fontSize: "14px", cursor: answered ? "default" : "pointer",
                          textAlign: "left", display: "flex", alignItems: "center", gap: "10px",
                          transition: "all 0.15s",
                          transform: isSelected ? "scale(1.02)" : "scale(1)",
                        }}
                      >
                        <span style={{
                          width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                          background: isCorrect ? "#4ECDC4" : isWrong ? "#E74C3C" : "rgba(255,255,255,0.1)",
                          color: isCorrect || isWrong ? "#0F1B2D" : "#B0C4DE",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: 900,
                        }}>{label}</span>
                        <span dangerouslySetInnerHTML={{ __html: renderMath(opt) }} />
                      </button>
                    );
                  })}
                </div>

                {/* Explanation after answer */}
                {answered && (
                  <div style={{
                    marginTop: "16px", padding: "12px 16px", borderRadius: "10px",
                    background: answers[q.id] === q.answer ? "rgba(78,205,196,0.1)" : "rgba(231,76,60,0.1)",
                    border: `1px solid ${answers[q.id] === q.answer ? "rgba(78,205,196,0.3)" : "rgba(231,76,60,0.3)"}`,
                    fontSize: "13px", color: "#B0C4DE", lineHeight: 1.5,
                  }}>
                    <strong style={{ color: answers[q.id] === q.answer ? "#4ECDC4" : "#E74C3C" }}>
                      {answers[q.id] === q.answer ? "✅ Correct! " : `❌ The answer was ${q.answer}. `}
                    </strong>
                    {q.explanation}
                  </div>
                )}

                {/* Feedback overlay */}
                {feedbackMsg && (
                  <div style={{
                    position: "absolute", top: "12px", right: "16px",
                    padding: "8px 16px", borderRadius: "99px",
                    background: feedbackMsg.correct ? "rgba(78,205,196,0.9)" : "rgba(231,76,60,0.85)",
                    color: "#0F1B2D", fontWeight: 900, fontSize: "14px",
                    animation: "owlBounce 0.4s ease",
                    pointerEvents: "none",
                  }}>
                    {feedbackMsg.text}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Skip / next button if answered */}
          {answers[questions[current]?.id] !== undefined && (
            <button
              onClick={() => {
                if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
                setFeedbackMsg(null);
                setSelectedOption(null);
                if (current < questions.length - 1) {
                  setCurrent(c => c + 1);
                } else {
                  finishCompetition();
                }
              }}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                background: "rgba(245,166,35,0.15)", border: "1.5px solid rgba(245,166,35,0.4)",
                color: "#F5A623", fontWeight: 800, fontSize: "15px", cursor: "pointer",
              }}
            >
              {current < questions.length - 1 ? "Next Question →" : "See Results →"}
            </button>
          )}
        </div>
      )}

      {/* ── FINISHED PHASE ──────────────────────────────────────────────── */}
      {phase === "finished" && (
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
          {/* Owl mascot */}
          <OwlMascot mood={owlMood} size={100} />

          {/* Medal */}
          <div style={{ fontSize: "72px", margin: "12px 0 4px", lineHeight: 1 }}>{medal}</div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(24px,5vw,36px)", color: "#F5A623", marginBottom: "6px" }}>
            {medalLabel}
          </h2>
          <p style={{ color: "#B0C4DE", fontSize: "15px", marginBottom: "28px" }}>
            {pct >= 80 ? "Outstanding competition performance! 🌟" : pct >= 60 ? "Great effort — keep practising! 💪" : "Every competition is practice for the next one! 🦉"}
          </p>

          {/* Score card */}
          <div style={{
            background: "rgba(26,46,74,0.8)", border: "1.5px solid rgba(255,255,255,0.09)",
            borderRadius: "20px", padding: "24px", marginBottom: "24px",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
              {[
                ["✅ Correct", `${correctCount} / ${questions.length}`, "#4ECDC4"],
                ["📊 Score", `${pct}%`, pct >= 80 ? "#F5A623" : pct >= 60 ? "#4ECDC4" : "#E74C3C"],
                ["⭐ Points", `${totalPoints}`, "#F5A623"],
              ].map(([label, value, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#B0C4DE", fontWeight: 700, marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: color as string, fontFamily: "'Nunito', sans-serif" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Per-question breakdown */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#B0C4DE", marginBottom: "10px", textAlign: "left" }}>Question breakdown</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {questions.map((q, i) => {
                  const correct = answers[q.id] === q.answer;
                  return (
                    <div
                      key={q.id}
                      title={`Q${i + 1}: ${correct ? "✅ Correct" : `❌ You: ${answers[q.id] ?? "—"} | Answer: ${q.answer}`}`}
                      style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: correct ? "rgba(78,205,196,0.2)" : answers[q.id] ? "rgba(231,76,60,0.2)" : "rgba(255,255,255,0.06)",
                        border: `1.5px solid ${correct ? "#4ECDC4" : answers[q.id] ? "#E74C3C" : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: 800,
                        color: correct ? "#4ECDC4" : answers[q.id] ? "#E74C3C" : "#B0C4DE",
                        cursor: "default",
                      }}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setPhase("setup")}
              style={{
                padding: "14px 28px", borderRadius: "12px",
                background: "linear-gradient(135deg, #F5A623, #FFD700)",
                color: "#0F1B2D", fontWeight: 900, fontSize: "15px",
                border: "none", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              🏆 Try Again
            </button>
            <Link href="/practice">
              <button style={{
                padding: "14px 28px", borderRadius: "12px",
                background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)",
                color: "white", fontWeight: 800, fontSize: "15px", cursor: "pointer",
              }}>
                🧩 Practice Skills
              </button>
            </Link>
            <Link href="/leaderboard">
              <button style={{
                padding: "14px 28px", borderRadius: "12px",
                background: "rgba(78,205,196,0.1)", border: "1.5px solid rgba(78,205,196,0.3)",
                color: "#4ECDC4", fontWeight: 800, fontSize: "15px", cursor: "pointer",
              }}>
                🏅 Leaderboard
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
