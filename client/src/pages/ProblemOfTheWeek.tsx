import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import { renderMath } from "@/lib/renderMath";
import { QUESTIONS } from "@shared/questionBank";
import { Link } from "wouter";

export default function ProblemOfTheWeek() {
  const { user, isAuthenticated } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const { data: competition, isLoading: compLoading } = trpc.potw.current.useQuery();
  const { data: lastEnded } = trpc.potw.lastEnded.useQuery();

  const { data: myEntry, refetch: refetchEntry } = trpc.potw.myEntry.useQuery(
    { competitionId: competition?.id ?? 0 },
    { enabled: !!competition && isAuthenticated }
  );

  const { data: winners } = trpc.potw.winners.useQuery(
    { competitionId: lastEnded?.id ?? 0 },
    { enabled: !!lastEnded }
  );

  const submitMutation = trpc.potw.submit.useMutation({
    onSuccess: () => {
      setJustSubmitted(true);
      refetchEntry();
    },
  });

  const question = competition ? QUESTIONS.find(q => q.id === competition.questionId) : null;
  const hasEntered = !!myEntry || justSubmitted;

  function handleSubmit() {
    if (!selected || !competition || !question) return;
    submitMutation.mutate({
      competitionId: competition.id,
      chosenOption: selected,
      correct: selected === question.answer,
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "720px" }}>

        {/* Page header */}
        <div className="no-pill" style={{ marginBottom: "16px", width: "fit-content" }}>🏆 Problem of the Week</div>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "4px" }}>
          Weekly Challenge
        </h1>
        <p style={{ color: "#B0C4DE", fontSize: "14px", marginBottom: "32px" }}>
          One problem per week. Submit your answer — results are revealed when your teacher ends the competition.
        </p>

        {/* ── Loading ─────────────────────────────────────────────────────────── */}
        {compLoading && (
          <div style={{ textAlign: "center", color: "#B0C4DE", padding: "60px 0" }}>Loading…</div>
        )}

        {/* ── Active competition ───────────────────────────────────────────────── */}
        {!compLoading && competition && question && (
          <div className="no-card" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ color: "white", fontWeight: 800, fontSize: "20px", marginBottom: "4px" }}>
                  {competition.title}
                </h2>
                {competition.yearLabel && (
                  <p style={{ color: "#B0C4DE", fontSize: "13px" }}>For {competition.yearLabel} · {competition.points} points</p>
                )}
              </div>
              <span style={{ background: "rgba(46,204,113,0.15)", color: "#2ECC71", border: "1px solid #2ECC71", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 700 }}>
                🟢 Open
              </span>
            </div>

            {/* Question */}
            <div style={{ fontSize: "18px", fontWeight: 700, color: "white", lineHeight: 1.7, marginBottom: "28px", padding: "20px", background: "rgba(255,255,255,0.04)", borderRadius: "12px" }}
              dangerouslySetInnerHTML={{ __html: renderMath(question.text) }}
            />

            {/* Not logged in */}
            {!isAuthenticated && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ color: "#B0C4DE", marginBottom: "14px" }}>Sign in to enter this week's competition.</p>
                <a href={getLoginUrl()}><button className="no-btn-gold">Sign In to Enter →</button></a>
              </div>
            )}

            {/* Already entered — pending state */}
            {isAuthenticated && hasEntered && (
              <div style={{ textAlign: "center", padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>⏳</div>
                <p style={{ color: "white", fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>Answer submitted!</p>
                <p style={{ color: "#B0C4DE", fontSize: "14px", lineHeight: 1.6 }}>
                  Your answer has been recorded. Results will be revealed when your teacher ends the competition.
                  Check back soon to find out if you were correct!
                </p>
                {myEntry && (
                  <p style={{ color: "#B0C4DE", fontSize: "13px", marginTop: "12px" }}>
                    Your answer: <strong style={{ color: "white" }} dangerouslySetInnerHTML={{ __html: renderMath(myEntry.chosenOption) }} />
                  </p>
                )}
              </div>
            )}

            {/* Answer options */}
            {isAuthenticated && !hasEntered && (
              <div>
                <p style={{ color: "#B0C4DE", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                  Choose your answer:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  {question.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelected(opt)}
                      style={{
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: selected === opt ? "rgba(255,200,0,0.15)" : "rgba(255,255,255,0.04)",
                        border: selected === opt ? "2px solid #FFC800" : "2px solid rgba(255,255,255,0.1)",
                        color: selected === opt ? "#FFC800" : "white",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                      dangerouslySetInnerHTML={{ __html: renderMath(opt) }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!selected || submitMutation.isPending}
                  className="no-btn-gold"
                  style={{ width: "100%", opacity: !selected ? 0.5 : 1 }}
                >
                  {submitMutation.isPending ? "Submitting…" : "Submit Answer 🚀"}
                </button>
                <p style={{ color: "#B0C4DE", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
                  You can only submit once. Your answer is locked in until the teacher reveals the results.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── No active competition ─────────────────────────────────────────────── */}
        {!compLoading && !competition && (
          <div className="no-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>No active competition right now</p>
            <p style={{ color: "#B0C4DE", fontSize: "14px" }}>Check back soon — your teacher will post the next problem shortly.</p>
          </div>
        )}

        {/* ── Last ended competition winners ───────────────────────────────────── */}
        {lastEnded && winners && winners.length > 0 && (
          <div className="no-card" style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "white", fontWeight: 800, fontSize: "18px", marginBottom: "4px" }}>
              🎉 Previous Winners
            </h3>
            <p style={{ color: "#B0C4DE", fontSize: "13px", marginBottom: "20px" }}>{lastEnded.title}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {winners.slice(0, 10).map((w, i) => (
                <div key={w.entryId} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: i < 3 ? "rgba(255,200,0,0.06)" : "rgba(255,255,255,0.03)" }}>
                  <span style={{ fontSize: "20px", width: "32px", textAlign: "center" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                  </span>
                  <span style={{ fontSize: "20px" }}>{w.avatarEmoji ?? "🦉"}</span>
                  <span style={{ color: "white", fontWeight: 600, flex: 1 }}>{w.displayName ?? "Anonymous"}</span>
                  {w.yearGroup && (
                    <span style={{ color: "#B0C4DE", fontSize: "12px", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "10px" }}>Y{w.yearGroup}</span>
                  )}
                  <span style={{ color: "#B0C4DE", fontSize: "12px" }}>
                    {new Date(w.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Leaderboard link ─────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center" }}>
          <Link href="/potw/leaderboard">
            <button className="no-btn" style={{ fontSize: "14px" }}>🏅 View All-Time Leaderboard</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
