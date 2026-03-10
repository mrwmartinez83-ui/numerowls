import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { POTW_QUESTIONS } from "@shared/potwQuestionBank";

/**
 * POTWResultBanner
 * Shows a dismissible notification banner when a POTW competition has ended
 * and the pupil hasn't yet seen their result.
 * Place this near the top of the Dashboard or any main page.
 */
export default function POTWResultBanner() {
  const { isAuthenticated } = useAuth();
  const { data: unseen, refetch } = trpc.potw.unseenResults.useQuery(
    undefined,
    { enabled: isAuthenticated, refetchInterval: 60_000 }
  );
  const markSeen = trpc.potw.markResultSeen.useMutation({
    onSuccess: () => refetch(),
  });

  // Nothing to show
  if (!unseen || unseen.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
      {unseen.map((entry) => {
        const question = POTW_QUESTIONS.find(q => q.id === entry.questionId);
        const isCorrect = entry.correct;

        return (
          <div
            key={entry.entryId}
            style={{
              background: isCorrect
                ? "linear-gradient(135deg, rgba(46,204,113,0.15), rgba(39,174,96,0.08))"
                : "linear-gradient(135deg, rgba(231,76,60,0.15), rgba(192,57,43,0.08))",
              border: `1px solid ${isCorrect ? "rgba(46,204,113,0.4)" : "rgba(231,76,60,0.4)"}`,
              borderRadius: "14px",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            {/* Icon */}
            <div style={{ fontSize: "32px", flexShrink: 0 }}>
              {isCorrect ? "🎉" : "💪"}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{
                fontWeight: 800,
                fontSize: "15px",
                color: isCorrect ? "#2ECC71" : "#E74C3C",
                marginBottom: "2px",
              }}>
                {isCorrect
                  ? `✓ Correct! You got "${entry.title}" right!`
                  : `"${entry.title}" results are in`}
              </div>
              <div style={{ color: "#B0C4DE", fontSize: "13px" }}>
                {isCorrect
                  ? `You earned ${entry.points} points! The worked solution is now available.`
                  : `You answered ${entry.chosenOption}. The correct answer was ${question?.answer ?? "revealed"}. See the worked solution!`}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <Link href="/potw">
                <button style={{
                  background: isCorrect ? "rgba(46,204,113,0.2)" : "rgba(231,76,60,0.2)",
                  border: `1px solid ${isCorrect ? "rgba(46,204,113,0.4)" : "rgba(231,76,60,0.4)"}`,
                  color: isCorrect ? "#2ECC71" : "#E74C3C",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                  See Solution →
                </button>
              </Link>
              <button
                onClick={() => markSeen.mutate({ entryId: entry.entryId })}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#B0C4DE",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
