import NavBar from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const MEDALS = ["🥇","🥈","🥉"];

export default function Leaderboard() {
  const [yearFilter, setYearFilter] = useState<number | undefined>(undefined);
  const { data, isLoading } = trpc.leaderboard.top.useQuery({ yearGroup: yearFilter, limit: 50 });

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "720px" }}>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", marginBottom: "8px" }}>🏆 Leaderboard</h1>
        <p style={{ color: "#B0C4DE", marginBottom: "28px" }}>Top NumerOwls ranked by total points earned</p>
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
          {[undefined,1,2,3,4,5,6].map(y => (
            <button key={y ?? "all"} onClick={() => setYearFilter(y)}
              className={yearFilter === y ? "no-btn-gold" : "no-btn-ghost"}
              style={{ fontSize: "13px", padding: "6px 14px" }}>
              {y ? `Year ${y}` : "All Years"}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#F5A623", fontSize: "32px" }}>🦉</div>
        ) : !data || data.length === 0 ? (
          <div className="no-card" style={{ textAlign: "center", padding: "48px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🦉</div>
            <p style={{ color: "#B0C4DE" }}>No pupils on the leaderboard yet. Be the first!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {data.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "14px", background: i < 3 ? "rgba(245,166,35,0.07)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${i < 3 ? "rgba(245,166,35,0.25)" : "rgba(255,255,255,0.07)"}` }}>
                <div style={{ width: "32px", textAlign: "center", fontSize: i < 3 ? "22px" : "15px", fontWeight: 800, color: i < 3 ? "#F5A623" : "#B0C4DE" }}>
                  {i < 3 ? MEDALS[i] : `#${i+1}`}
                </div>
                <div style={{ fontSize: "24px" }}>{p.avatarEmoji ?? "🦉"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: "15px", color: "white" }}>{p.displayName ?? p.name ?? "Owl"}</div>
                  {p.yearGroup && <div style={{ fontSize: "12px", color: "#B0C4DE" }}>Year {p.yearGroup}</div>}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#F5A623" }}>{p.totalPoints ?? 0}</div>
                <div style={{ fontSize: "12px", color: "#B0C4DE" }}>pts</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
