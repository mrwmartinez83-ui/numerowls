import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function ComingSoon() {
  return (
    <Layout>
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 24px",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 24 }}>⚡</div>
        <div className="no-section-pill" style={{ marginBottom: 20 }}>Coming Soon</div>
        <h1
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(32px, 5vw, 56px)",
            color: "white",
            marginBottom: 16,
          }}
        >
          Competitions are coming!
        </h1>
        <p style={{ fontSize: 18, color: "#B0C4DE", maxWidth: 480, lineHeight: 1.6, fontWeight: 600, marginBottom: 40 }}>
          Timed competitions, leaderboards, and certificates are on the way. Keep practising and you'll be ready!
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/practice">
            <button className="no-btn-gold">🧩 Practice Now</button>
          </Link>
          <Link href="/badges">
            <button className="no-btn-teal">🏆 View Badges</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
