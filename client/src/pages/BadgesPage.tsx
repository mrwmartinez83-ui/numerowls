import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useProgress } from "@/hooks/useProgress";
import { lessons } from "@/lib/lessonData";

interface BadgeDef {
  id: string;
  icon: string;
  name: string;
  desc: string;
  tier: "bronze" | "silver" | "gold";
}

const ALL_BADGES: BadgeDef[] = [
  { id: "first_hoot", icon: "🦉", name: "First Hoot", desc: "Complete your first Starter Activity", tier: "bronze" },
  { id: "puzzle_starter", icon: "🧩", name: "Puzzle Starter", desc: "Attempt your first Shape Puzzle", tier: "bronze" },
  { id: "bookworm", icon: "📚", name: "Bookworm", desc: "Complete a Homework section", tier: "bronze" },
  { id: "star_pupil", icon: "⭐", name: "Star Pupil", desc: "Get 5 or more Competition questions correct", tier: "bronze" },
  { id: "sharp_shooter", icon: "🎯", name: "Sharp Shooter", desc: "Get 10 or more questions correct in total", tier: "silver" },
  { id: "puzzle_master", icon: "🔮", name: "Puzzle Master", desc: "Complete all Shape Puzzles in a lesson", tier: "silver" },
  { id: "gold_standard", icon: "🥇", name: "Gold Standard", desc: "Score 80% or more on Competition questions", tier: "gold" },
  { id: "top_of_tree", icon: "🌳", name: "Top of the Tree", desc: "Get 100% in every section of a lesson", tier: "gold" },
  { id: "night_owl", icon: "🌙", name: "Night Owl", desc: "Complete all 4 lessons fully", tier: "gold" },
  { id: "diamond_owl", icon: "💎", name: "Diamond Owl", desc: "Complete all homework in every lesson", tier: "gold" },
];

const TIER_STYLES: Record<string, { bg: string; border: string; label: string; glow: string }> = {
  bronze: { bg: "rgba(205, 127, 50, 0.12)", border: "rgba(205, 127, 50, 0.4)", label: "#CD7F32", glow: "rgba(205, 127, 50, 0.3)" },
  silver: { bg: "rgba(192, 192, 192, 0.1)", border: "rgba(192, 192, 192, 0.4)", label: "#C0C0C0", glow: "rgba(192, 192, 192, 0.25)" },
  gold: { bg: "rgba(245, 166, 35, 0.12)", border: "rgba(245, 166, 35, 0.45)", label: "#F5A623", glow: "rgba(245, 166, 35, 0.35)" },
};

export default function BadgesPage() {
  const { getEarnedBadges, getTotalScore, getLessonCompletion, getLessonProgress } = useProgress();
  const earnedIds = getEarnedBadges();
  const { correct, attempted } = getTotalScore();

  const earnedBadges = ALL_BADGES.filter((b) => earnedIds.includes(b.id));
  const lockedBadges = ALL_BADGES.filter((b) => !earnedIds.includes(b.id));

  return (
    <Layout>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A2E4A 0%, #243B55 100%)",
          borderBottom: "1px solid rgba(245, 166, 35, 0.2)",
          padding: "40px 0 32px",
        }}
      >
        <div className="container">
          <div className="no-section-pill" style={{ marginBottom: 16 }}>🏆 Your Achievements</div>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)", color: "white", marginBottom: 8 }}>
            Badge Collection
          </h1>
          <p style={{ fontSize: 16, color: "#B0C4DE", fontWeight: 600, maxWidth: 520 }}>
            Earn badges by completing activities and getting questions right. Can you collect them all?
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>

        {/* ── Overall Stats ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            { icon: "🏆", value: earnedIds.length, total: ALL_BADGES.length, label: "Badges Earned", color: "#F5A623" },
            { icon: "✅", value: correct, total: attempted, label: "Questions Correct", color: "#2ECC71" },
            { icon: "📊", value: attempted, total: null, label: "Questions Attempted", color: "#4ECDC4" },
            {
              icon: "📚",
              value: lessons.filter((l) => getLessonCompletion(l.id) === 100).length,
              total: lessons.length,
              label: "Lessons Completed",
              color: "#9B59B6",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="no-card"
              style={{ textAlign: "center", padding: "20px 16px" }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 32,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {stat.value}{stat.total !== null ? `/${stat.total}` : ""}
              </div>
              <div style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Per-Lesson Progress ── */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22, color: "white", marginBottom: 20 }}>
            Lesson Progress
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {lessons.map((lesson) => {
              const completion = getLessonCompletion(lesson.id);
              const lp = getLessonProgress(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className="no-card"
                  style={{
                    borderColor: completion === 100 ? "rgba(46,204,113,0.4)" : `${lesson.color}33`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${lesson.color}22`,
                        border: `2px solid ${lesson.color}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {lesson.emoji}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "white" }}>{lesson.title}</div>
                      <div style={{ fontSize: 12, color: "#B0C4DE", fontWeight: 600 }}>{lesson.subtitle}</div>
                    </div>
                    {completion === 100 && (
                      <span style={{ marginLeft: "auto", fontSize: 20 }}>✅</span>
                    )}
                  </div>

                  {/* Section breakdown */}
                  {lp && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { key: "starter" as const, label: "Starter", icon: "🎯" },
                        { key: "puzzles" as const, label: "Puzzles", icon: "🧩" },
                        { key: "competition" as const, label: "Competition", icon: "🦉" },
                        { key: "homework" as const, label: "Homework", icon: "📚" },
                      ].map((s) => {
                        const sec = lp[s.key];
                        const pct = sec.total > 0 ? Math.round((sec.attempted / sec.total) * 100) : 0;
                        return (
                          <div key={s.key}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#B0C4DE" }}>
                                {s.icon} {s.label}
                              </span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "#2ECC71" : "#B0C4DE" }}>
                                {sec.attempted}/{sec.total}
                              </span>
                            </div>
                            <div className="no-progress-track" style={{ height: 6 }}>
                              <div
                                className="no-progress-fill"
                                style={{
                                  width: `${pct}%`,
                                  background: pct === 100 ? "#2ECC71" : lesson.color,
                                  height: "100%",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!lp && (
                    <div style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600, textAlign: "center", padding: "8px 0" }}>
                      Not started yet
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Earned Badges ── */}
        {earnedBadges.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22, color: "white", marginBottom: 20 }}>
              🏆 Earned Badges ({earnedBadges.length})
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {earnedBadges.map((badge) => {
                const ts = TIER_STYLES[badge.tier];
                return (
                  <div
                    key={badge.id}
                    style={{
                      background: ts.bg,
                      border: `2px solid ${ts.border}`,
                      borderRadius: 16,
                      padding: "24px 16px",
                      textAlign: "center",
                      boxShadow: `0 0 20px ${ts.glow}`,
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{badge.icon}</div>
                    <div
                      style={{
                        background: `${ts.label}22`,
                        border: `1px solid ${ts.label}44`,
                        borderRadius: 99,
                        fontSize: 10,
                        fontWeight: 800,
                        color: ts.label,
                        padding: "2px 10px",
                        display: "inline-block",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {badge.tier}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "white", marginBottom: 6 }}>{badge.name}</div>
                    <p style={{ fontSize: 13, color: "#B0C4DE", lineHeight: 1.5, fontWeight: 600 }}>{badge.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Locked Badges ── */}
        <div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22, color: "white", marginBottom: 20 }}>
            🔒 Badges to Unlock ({lockedBadges.length})
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {lockedBadges.map((badge) => {
              const ts = TIER_STYLES[badge.tier];
              return (
                <div
                  key={badge.id}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "2px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "24px 16px",
                    textAlign: "center",
                    opacity: 0.65,
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 12, filter: "grayscale(1) opacity(0.4)" }}>{badge.icon}</div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 99,
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#B0C4DE",
                      padding: "2px 10px",
                      display: "inline-block",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {badge.tier}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#B0C4DE", marginBottom: 6 }}>{badge.name}</div>
                  <p style={{ fontSize: 13, color: "rgba(176,196,222,0.7)", lineHeight: 1.5, fontWeight: 600 }}>{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        {earnedIds.length === 0 && (
          <div
            style={{
              marginTop: 48,
              textAlign: "center",
              background: "rgba(245,166,35,0.06)",
              border: "1px solid rgba(245,166,35,0.2)",
              borderRadius: 20,
              padding: "40px 24px",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🦉</div>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "white", marginBottom: 12 }}>
              No badges yet — let's fix that!
            </h3>
            <p style={{ fontSize: 16, color: "#B0C4DE", fontWeight: 600, marginBottom: 24 }}>
              Start with the Warm-Up activity to earn your first badge.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/starter">
                <button className="no-btn-gold">🎯 Start Warm-Up</button>
              </Link>
              <Link href="/practice">
                <button className="no-btn-teal">🧩 Go to Practice</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
