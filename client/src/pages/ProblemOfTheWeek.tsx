import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { getLoginUrl } from "@/const";
import { QUESTIONS } from "@shared/questionBank";
import { POTW_QUESTIONS } from "@shared/potwQuestionBank";
import { Link } from "wouter";
import confetti from "canvas-confetti";

// ── Countdown helpers ──────────────────────────────────────────────────────────
function getNextSunday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(23, 59, 59, 0);
  return next;
}

function formatCountdown(ms: number): { d: number; h: number; m: number; s: number } {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { d, h, m, s };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

// ── Render question text (basic HTML passthrough) ─────────────────────────────
function renderText(text: string) {
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}

export default function ProblemOfTheWeek() {
  const { user, isAuthenticated } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(formatCountdown(getNextSunday().getTime() - Date.now()));
  const [revealedResult, setRevealedResult] = useState(false);
  const hasFiredConfetti = useRef(false);

  // Live countdown
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(formatCountdown(getNextSunday().getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const { data: competition, isLoading: compLoading } = trpc.potw.current.useQuery();
  const { data: lastEnded } = trpc.potw.lastEnded.useQuery();

  const { data: myEntry, refetch: refetchEntry } = trpc.potw.myEntry.useQuery(
    { competitionId: competition?.id ?? 0 },
    { enabled: !!competition && isAuthenticated }
  );

  const { data: entryCount } = trpc.potw.entryCount.useQuery(
    { competitionId: competition?.id ?? 0 },
    { enabled: !!competition, refetchInterval: 30_000 }
  );

  const { data: winners } = trpc.potw.winners.useQuery(
    { competitionId: lastEnded?.id ?? 0 },
    { enabled: !!lastEnded }
  );

  const { data: lastEndedEntryCount } = trpc.potw.entryCount.useQuery(
    { competitionId: lastEnded?.id ?? 0 },
    { enabled: !!lastEnded }
  );

  const submitMutation = trpc.potw.submit.useMutation({
    onSuccess: () => {
      setJustSubmitted(true);
      refetchEntry();
    },
  });

  // Find question — first check POTW bank, then fall back to main bank
  const question = competition
    ? (POTW_QUESTIONS.find(q => q.id === competition.questionId) as { text: string; options: string[]; answer: string; diagram?: string; solution?: string; hint?: string } | undefined)
      ?? (QUESTIONS.find(q => q.id === competition.questionId) as { text: string; options: string[]; answer: string; diagram?: string; solution?: string; hint?: string } | undefined)
    : null;

  const hasEntered = !!myEntry || justSubmitted;

  function handleSubmit() {
    if (!selected || !competition || !question) return;
    submitMutation.mutate({
      competitionId: competition.id,
      chosenOption: selected,
      correct: selected === question.answer,
    });
  }

  // Fire confetti when results are revealed and pupil was correct
  function handleRevealResult() {
    setRevealedResult(true);
    if (!hasFiredConfetti.current && myEntry?.correct) {
      hasFiredConfetti.current = true;
      confetti({ particleCount: 180, spread: 80, origin: { y: 0.5 } });
    }
  }

  const isPupilCorrect = myEntry?.correct;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "80px", maxWidth: "740px" }}>

        {/* ── Page header ─────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <span style={{ fontSize: "36px" }}>🏆</span>
          <div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "30px", color: "white", margin: 0 }}>
              Problem of the Week
            </h1>
            <p style={{ color: "#B0C4DE", fontSize: "14px", margin: 0 }}>
              One tough problem per week. Think carefully — you only get one attempt!
            </p>
          </div>
        </div>

        {/* ── Countdown banner ─────────────────────────────────────────────────── */}
        <div style={{ background: "rgba(255,200,0,0.07)", border: "1px solid rgba(255,200,0,0.2)", borderRadius: "14px", padding: "16px 20px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ color: "#B0C4DE", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Competition closes in</p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {[{ v: countdown.d, l: "days" }, { v: countdown.h, l: "hrs" }, { v: countdown.m, l: "min" }, { v: countdown.s, l: "sec" }].map(({ v, l }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "26px", color: "#FFC800", lineHeight: 1 }}>{pad(v)}</div>
                  <div style={{ fontSize: "10px", color: "#8899AA", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {entryCount && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white" }}>{entryCount.total}</div>
              <div style={{ color: "#B0C4DE", fontSize: "12px" }}>pupils entered</div>
            </div>
          )}
        </div>

        {/* ── Loading ─────────────────────────────────────────────────────────── */}
        {compLoading && (
          <div style={{ textAlign: "center", color: "#B0C4DE", padding: "60px 0" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            Loading this week's challenge…
          </div>
        )}

        {/* ── Active competition ───────────────────────────────────────────────── */}
        {!compLoading && competition && question && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h2 style={{ color: "white", fontWeight: 900, fontSize: "22px", margin: "0 0 4px", fontFamily: "'Nunito', sans-serif" }}>
                  {competition.title}
                </h2>
                {competition.yearLabel && (
                  <p style={{ color: "#B0C4DE", fontSize: "13px", margin: 0 }}>
                    For {competition.yearLabel} · <span style={{ color: "#FFC800", fontWeight: 700 }}>🏅 {competition.points} points</span> for correct answers
                  </p>
                )}
              </div>
              <span style={{ background: "rgba(46,204,113,0.15)", color: "#2ECC71", border: "1px solid #2ECC71", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                🟢 Open
              </span>
            </div>

            {/* Question text */}
            <div style={{ fontSize: "17px", fontWeight: 600, color: "white", lineHeight: 1.8, marginBottom: question.diagram ? "0" : "24px", padding: "20px 22px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", borderLeft: "4px solid #FFC800" }}>
              {renderText(question.text)}
            </div>

            {/* Diagram if present */}
            {question.diagram && (
              <div dangerouslySetInnerHTML={{ __html: question.diagram }} style={{ marginBottom: "24px" }} />
            )}

            {/* Hint (always visible for POTW — no time penalty) */}
            {(question as { hint?: string }).hint && !hasEntered && (
              <details style={{ marginBottom: "20px" }}>
                <summary style={{ cursor: "pointer", color: "#B0C4DE", fontSize: "13px", fontWeight: 600, userSelect: "none", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                  💡 Need a hint? Click to reveal
                </summary>
                <div style={{ marginTop: "8px", padding: "12px 16px", background: "rgba(255,200,0,0.06)", borderRadius: "8px", color: "#FFD966", fontSize: "14px", lineHeight: 1.6 }}>
                  {(question as { hint?: string }).hint}
                </div>
              </details>
            )}

            {/* ── Not logged in ─────────────────────────────────────────────────── */}
            {!isAuthenticated && (
              <div style={{ textAlign: "center", padding: "28px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "#B0C4DE", marginBottom: "14px" }}>Sign in to enter this week's competition.</p>
                <a href={getLoginUrl()}>
                  <button style={{ background: "linear-gradient(135deg,#FFC800,#FF8C00)", color: "#0F1B2D", fontWeight: 800, fontSize: "15px", padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
                    Sign In to Enter →
                  </button>
                </a>
              </div>
            )}

            {/* ── Already entered — sealed envelope state ───────────────────────── */}
            {isAuthenticated && hasEntered && !revealedResult && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "28px" }}>
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: "56px", marginBottom: "12px", animation: "owlBounce 2s ease-in-out infinite" }}>📬</div>
                  <p style={{ color: "white", fontWeight: 900, fontSize: "20px", marginBottom: "8px", fontFamily: "'Nunito', sans-serif" }}>
                    Your answer is sealed!
                  </p>
                  <p style={{ color: "#B0C4DE", fontSize: "14px", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 16px" }}>
                    Your entry has been recorded and locked. Results will be revealed when your teacher ends the competition — check back soon!
                  </p>
                  {myEntry && (
                    <div style={{ display: "inline-block", background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.25)", borderRadius: "10px", padding: "10px 20px", marginBottom: "16px" }}>
                      <span style={{ color: "#B0C4DE", fontSize: "13px" }}>Your answer: </span>
                      <strong style={{ color: "#FFC800" }}>{myEntry.chosenOption}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Result revealed ───────────────────────────────────────────────── */}
            {isAuthenticated && hasEntered && revealedResult && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "28px" }}>
                <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
                  <div style={{ fontSize: "64px", marginBottom: "12px" }}>
                    {isPupilCorrect ? "🎉" : "😔"}
                  </div>
                  <p style={{ color: isPupilCorrect ? "#2ECC71" : "#E74C3C", fontWeight: 900, fontSize: "22px", marginBottom: "8px", fontFamily: "'Nunito', sans-serif" }}>
                    {isPupilCorrect ? "Correct! Well done!" : "Not quite — keep trying!"}
                  </p>
                  {myEntry && (
                    <p style={{ color: "#B0C4DE", fontSize: "14px", marginBottom: "16px" }}>
                      You answered: <strong style={{ color: "white" }}>{myEntry.chosenOption}</strong>
                      {" · "}Correct answer: <strong style={{ color: "#2ECC71" }}>{question.answer}</strong>
                    </p>
                  )}
                  {/* Worked solution */}
                  {(question as { solution?: string }).solution && (
                    <div style={{ textAlign: "left", background: "rgba(46,204,113,0.06)", border: "1px solid rgba(46,204,113,0.2)", borderRadius: "12px", padding: "16px 20px", marginTop: "8px" }}>
                      <p style={{ color: "#2ECC71", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>✅ Worked Solution</p>
                      <div style={{ color: "#B0C4DE", fontSize: "14px", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: (question as { solution?: string }).solution ?? "" }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reveal result button — only shown after competition ends */}
            {isAuthenticated && hasEntered && !revealedResult && lastEnded && lastEnded.id === competition.id && (
              <div style={{ textAlign: "center", marginTop: "8px" }}>
                <button
                  onClick={handleRevealResult}
                  style={{ background: "linear-gradient(135deg,#9B59B6,#6C3483)", color: "white", fontWeight: 800, fontSize: "15px", padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer" }}
                >
                  🔓 Reveal My Result
                </button>
              </div>
            )}

            {/* ── Answer options ────────────────────────────────────────────────── */}
            {isAuthenticated && !hasEntered && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
                <p style={{ color: "#B0C4DE", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>
                  Choose your answer carefully — you only get one attempt:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  {question.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelected(opt)}
                      style={{
                        padding: "16px 18px",
                        borderRadius: "12px",
                        background: selected === opt ? "rgba(255,200,0,0.12)" : "rgba(255,255,255,0.04)",
                        border: selected === opt ? "2px solid #FFC800" : "2px solid rgba(255,255,255,0.1)",
                        color: selected === opt ? "#FFC800" : "white",
                        fontSize: "16px",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!selected || submitMutation.isPending}
                  style={{
                    width: "100%",
                    background: !selected ? "rgba(255,200,0,0.3)" : "linear-gradient(135deg,#FFC800,#FF8C00)",
                    color: "#0F1B2D",
                    fontWeight: 900,
                    fontSize: "16px",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: !selected ? "not-allowed" : "pointer",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  {submitMutation.isPending ? "Submitting…" : "🔒 Lock In My Answer"}
                </button>
                <p style={{ color: "#8899AA", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
                  Once submitted, your answer is locked until the teacher reveals results.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── No active competition ─────────────────────────────────────────────── */}
        {!compLoading && !competition && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", textAlign: "center", padding: "60px 20px", marginBottom: "24px" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📭</div>
            <p style={{ color: "white", fontWeight: 800, fontSize: "20px", marginBottom: "8px", fontFamily: "'Nunito', sans-serif" }}>No active challenge right now</p>
            <p style={{ color: "#B0C4DE", fontSize: "14px" }}>Check back soon — your teacher will post the next problem shortly.</p>
          </div>
        )}

        {/* ── Last ended competition winners podium ─────────────────────────────── */}
        {lastEnded && winners && winners.length > 0 && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h3 style={{ color: "white", fontWeight: 900, fontSize: "20px", margin: "0 0 4px", fontFamily: "'Nunito', sans-serif" }}>
                  🎉 Previous Winners
                </h3>
                <p style={{ color: "#B0C4DE", fontSize: "13px", margin: 0 }}>{lastEnded.title}</p>
              </div>
              {lastEndedEntryCount && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#B0C4DE", fontSize: "12px" }}>
                    {lastEndedEntryCount.total} entries · {lastEndedEntryCount.correct} correct
                  </div>
                  {lastEndedEntryCount.total > 0 && (
                    <div style={{ color: "#FFC800", fontSize: "12px", fontWeight: 700 }}>
                      {Math.round((Number(lastEndedEntryCount.correct) / Number(lastEndedEntryCount.total)) * 100)}% success rate
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Top 3 podium */}
            {winners.length >= 3 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "8px", marginBottom: "20px" }}>
                {/* 2nd */}
                <div style={{ textAlign: "center", flex: 1, maxWidth: "120px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "4px" }}>{winners[1].avatarEmoji ?? "🦉"}</div>
                  <div style={{ background: "rgba(192,192,192,0.15)", border: "1px solid #C0C0C0", borderRadius: "10px 10px 0 0", padding: "12px 8px 8px", height: "70px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: "18px" }}>🥈</div>
                    <div style={{ color: "white", fontSize: "12px", fontWeight: 700, marginTop: "4px" }}>{winners[1].displayName ?? "Anonymous"}</div>
                  </div>
                </div>
                {/* 1st */}
                <div style={{ textAlign: "center", flex: 1, maxWidth: "140px" }}>
                  <div style={{ fontSize: "36px", marginBottom: "4px" }}>{winners[0].avatarEmoji ?? "🦉"}</div>
                  <div style={{ background: "rgba(255,200,0,0.15)", border: "1px solid #FFC800", borderRadius: "10px 10px 0 0", padding: "12px 8px 8px", height: "90px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: "22px" }}>🥇</div>
                    <div style={{ color: "#FFC800", fontSize: "13px", fontWeight: 800, marginTop: "4px" }}>{winners[0].displayName ?? "Anonymous"}</div>
                  </div>
                </div>
                {/* 3rd */}
                <div style={{ textAlign: "center", flex: 1, maxWidth: "120px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "4px" }}>{winners[2].avatarEmoji ?? "🦉"}</div>
                  <div style={{ background: "rgba(205,127,50,0.15)", border: "1px solid #CD7F32", borderRadius: "10px 10px 0 0", padding: "12px 8px 8px", height: "55px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: "16px" }}>🥉</div>
                    <div style={{ color: "#CD7F32", fontSize: "12px", fontWeight: 700, marginTop: "4px" }}>{winners[2].displayName ?? "Anonymous"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Full list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {winners.slice(0, 10).map((w, i) => (
                <div key={w.entryId} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: i < 3 ? "rgba(255,200,0,0.05)" : "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: "18px", width: "28px", textAlign: "center" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                  </span>
                  <span style={{ fontSize: "18px" }}>{w.avatarEmoji ?? "🦉"}</span>
                  <span style={{ color: "white", fontWeight: 600, flex: 1, fontSize: "14px" }}>{w.displayName ?? "Anonymous"}</span>
                  {w.yearGroup && (
                    <span style={{ color: "#B0C4DE", fontSize: "11px", background: "rgba(255,255,255,0.07)", padding: "2px 8px", borderRadius: "10px" }}>Y{w.yearGroup}</span>
                  )}
                  <span style={{ color: "#8899AA", fontSize: "11px" }}>
                    {new Date(w.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── All-time leaderboard link ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center" }}>
          <Link href="/potw/leaderboard">
            <button style={{ background: "rgba(255,255,255,0.06)", color: "#B0C4DE", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "10px 22px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              🏅 View All-Time POTW Leaderboard
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
