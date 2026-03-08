import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { getLoginUrl } from "@/const";

const POTW_QUESTIONS = [
  {
    weekKey: "2026-W10",
    title: "The Owl's Orchard",
    question: "An owl has 3 apple trees. Each tree has 4 branches. Each branch has 5 apples. How many apples are there altogether?",
    options: ["48","50","60","55","45"],
    answer: "60",
    explanation: "3 trees × 4 branches × 5 apples = 60 apples. You can think of it as 3 × 20 = 60.",
    points: 10,
    yearGroup: "Years 2–4",
  },
];

export default function ProblemOfTheWeek() {
  const { isAuthenticated } = useAuth();
  const potw = POTW_QUESTIONS[0];
  const [chosen, setChosen] = useState<string | null>(null);
  const submitPotw = trpc.potw.submit.useMutation();
  const { data: myAnswers } = trpc.potw.myAnswers.useQuery(undefined, { enabled: isAuthenticated });
  const alreadyAnswered = myAnswers?.some(a => a.weekKey === potw.weekKey);

  const handleAnswer = (opt: string) => {
    if (chosen || alreadyAnswered) return;
    setChosen(opt);
    if (isAuthenticated) {
      submitPotw.mutate({ weekKey: potw.weekKey, correct: opt === potw.answer });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "680px" }}>
        <div className="no-pill" style={{ marginBottom: "16px", width: "fit-content" }}>🦉 Problem of the Week</div>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "4px" }}>{potw.title}</h1>
        <p style={{ color: "#B0C4DE", fontSize: "14px", marginBottom: "32px" }}>{potw.yearGroup} · {potw.points} bonus points · Week of 10 March 2026</p>
        <div className="no-card" style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "17px", fontWeight: 700, color: "white", lineHeight: 1.6, marginBottom: "24px" }}>{potw.question}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {potw.options.map(opt => {
              const isRevealed = !!chosen || !!alreadyAnswered;
              let bg = "rgba(255,255,255,0.04)";
              let border = "1.5px solid rgba(255,255,255,0.1)";
              let color = "white";
              if (isRevealed) {
                if (opt === potw.answer) { bg = "rgba(46,204,113,0.15)"; border = "1.5px solid #2ECC71"; color = "#2ECC71"; }
                else if (opt === chosen) { bg = "rgba(231,76,60,0.15)"; border = "1.5px solid #E74C3C"; color = "#E74C3C"; }
              }
              return (
                <button key={opt} onClick={() => handleAnswer(opt)}
                  style={{ padding: "12px 18px", borderRadius: "12px", background: bg, border, color, fontSize: "15px", fontWeight: 600, cursor: isRevealed ? "default" : "pointer", textAlign: "left" }}>
                  {opt}
                </button>
              );
            })}
          </div>
          {(chosen || alreadyAnswered) && (
            <div style={{ marginTop: "16px", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", fontSize: "14px", color: "#B0C4DE", lineHeight: 1.6 }}>
              💡 {potw.explanation}
            </div>
          )}
        </div>
        {!isAuthenticated && (
          <div className="no-card" style={{ textAlign: "center" }}>
            <p style={{ color: "#B0C4DE", marginBottom: "14px" }}>Sign in to save your answer and earn {potw.points} bonus points!</p>
            <a href={getLoginUrl()}><button className="no-btn-gold">Sign In →</button></a>
          </div>
        )}
      </div>
    </div>
  );
}
