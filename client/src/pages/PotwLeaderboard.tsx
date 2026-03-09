import NavBar from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function PotwLeaderboard() {
  const { data: leaders, isLoading } = trpc.potw.potwLeaderboard.useQuery({ limit: 50 });

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "680px" }}>
        <div className="no-pill" style={{ marginBottom: "16px", width: "fit-content" }}>🏅 All-Time Leaderboard</div>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "4px" }}>
          Problem of the Week Champions
        </h1>
        <p style={{ color: "#B0C4DE", fontSize: "14px", marginBottom: "32px" }}>
          Ranked by correct answers across all competitions.
        </p>

        {isLoading && (
          <div style={{ textAlign: "center", color: "#B0C4DE", padding: "60px 0" }}>Loading…</div>
        )}

        {!isLoading && (!leaders || leaders.length === 0) && (
          <div className="no-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>No results yet</p>
            <p style={{ color: "#B0C4DE", fontSize: "14px" }}>Be the first to enter the Problem of the Week!</p>
          </div>
        )}

        {leaders && leaders.length > 0 && (
          <div className="no-card">
            {/* Top 3 podium */}
            {leaders.length >= 3 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "16px", marginBottom: "32px", padding: "24px 0 0" }}>
                {/* 2nd */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{leaders[1].avatarEmoji ?? "🦉"}</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{leaders[1].displayName ?? "Anonymous"}</div>
                  <div style={{ color: "#B0C4DE", fontSize: "12px", marginBottom: "8px" }}>{leaders[1].wins} wins</div>
                  <div style={{ background: "rgba(192,192,192,0.2)", border: "2px solid #C0C0C0", borderRadius: "8px 8px 0 0", height: "60px", width: "80px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🥈</div>
                </div>
                {/* 1st */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "40px", marginBottom: "8px" }}>{leaders[0].avatarEmoji ?? "🦉"}</div>
                  <div style={{ color: "#FFC800", fontWeight: 800, fontSize: "16px", marginBottom: "4px" }}>{leaders[0].displayName ?? "Anonymous"}</div>
                  <div style={{ color: "#FFC800", fontSize: "13px", marginBottom: "8px" }}>{leaders[0].wins} wins</div>
                  <div style={{ background: "rgba(255,200,0,0.2)", border: "2px solid #FFC800", borderRadius: "8px 8px 0 0", height: "80px", width: "80px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🥇</div>
                </div>
                {/* 3rd */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{leaders[2].avatarEmoji ?? "🦉"}</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{leaders[2].displayName ?? "Anonymous"}</div>
                  <div style={{ color: "#B0C4DE", fontSize: "12px", marginBottom: "8px" }}>{leaders[2].wins} wins</div>
                  <div style={{ background: "rgba(205,127,50,0.2)", border: "2px solid #CD7F32", borderRadius: "8px 8px 0 0", height: "48px", width: "80px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🥉</div>
                </div>
              </div>
            )}

            {/* Full table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {leaders.map((l, i) => (
                <div key={l.userId} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: i < 3 ? "rgba(255,200,0,0.04)" : "rgba(255,255,255,0.03)" }}>
                  <span style={{ fontSize: "16px", width: "28px", textAlign: "center", color: "#B0C4DE", fontWeight: 700 }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                  </span>
                  <span style={{ fontSize: "20px" }}>{l.avatarEmoji ?? "🦉"}</span>
                  <span style={{ color: "white", fontWeight: 600, flex: 1 }}>{l.displayName ?? "Anonymous"}</span>
                  {l.yearGroup && (
                    <span style={{ color: "#B0C4DE", fontSize: "12px", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "10px" }}>Y{l.yearGroup}</span>
                  )}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#FFC800", fontWeight: 700, fontSize: "15px" }}>{l.wins} ✓</div>
                    <div style={{ color: "#B0C4DE", fontSize: "11px" }}>{l.entries} entered</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link href="/potw">
            <button className="no-btn" style={{ fontSize: "14px" }}>← Back to Problem of the Week</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
