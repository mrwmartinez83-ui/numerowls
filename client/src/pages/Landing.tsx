import { useEffect, useRef, useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

// ── Animated number ticker ───────────────────────────────────────────────────
function Ticker({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = () => {
        start += Math.ceil((to - start) / 8);
        setVal(start >= to ? to : start);
        if (start < to) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Sample question preview ──────────────────────────────────────────────────
const SAMPLE_QUESTIONS = [
  {
    label: "5 pts · Year 4–5 · Think of a Number",
    text: "Three consecutive odd numbers sum to 57. What is the LARGEST?",
    options: ["A  17", "B  19", "C  21", "D  23", "E  25"],
    answer: 2,
    explanation: "Middle = 57÷3 = 19, so numbers are 17, 19, 21. Largest = 21.",
  },
  {
    label: "4 pts · Year 3–4 · Balance Scales",
    text: "3 apples = 1 melon. 1 melon = 5 oranges.\nHow many oranges balance 6 apples?",
    options: ["A  8", "B  9", "C  10", "D  12", "E  15"],
    answer: 2,
    explanation: "6 apples = 2 melons = 10 oranges.",
  },
  {
    label: "5 pts · Year 5–6 · Logic",
    text: "What is the smallest number leaving remainder 1\nwhen divided by 3, 4, or 5?",
    options: ["A  31", "B  41", "C  51", "D  61", "E  121"],
    answer: 3,
    explanation: "LCM(3,4,5)=60. Smallest = 60+1 = 61.",
  },
];

function QuestionPreview() {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const q = SAMPLE_QUESTIONS[qi];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => {
      setQi((qi + 1) % SAMPLE_QUESTIONS.length);
      setSelected(null);
    }, 2200);
  };

  return (
    <div style={{
      background: "#1A2E4A",
      borderRadius: 24,
      padding: "24px",
      border: "2px solid rgba(245,166,35,0.25)",
      boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
      maxWidth: 480,
      width: "100%",
    }}>
      {/* Badge */}
      <div style={{
        display: "inline-flex",
        background: "rgba(155,89,182,0.2)",
        border: "1.5px solid rgba(155,89,182,0.4)",
        borderRadius: 99,
        padding: "3px 12px",
        fontSize: 11, fontWeight: 800, color: "#9B59B6",
        marginBottom: 14,
        fontFamily: "'Nunito', sans-serif",
      }}>
        {q.label}
      </div>

      {/* Question */}
      <p style={{
        fontSize: 16, fontWeight: 700, color: "white",
        lineHeight: 1.65, marginBottom: 18,
        whiteSpace: "pre-line",
        fontFamily: "'Nunito', sans-serif",
        minHeight: 52,
      }}>
        {q.text}
      </p>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isSelected = selected === i;
          const revealed = selected !== null;
          let bg = "rgba(255,255,255,0.04)";
          let border = "rgba(255,255,255,0.1)";
          let color = "#B0C4DE";
          if (revealed && isCorrect) { bg = "rgba(46,204,113,0.14)"; border = "rgba(46,204,113,0.5)"; color = "white"; }
          else if (revealed && isSelected) { bg = "rgba(231,76,60,0.12)"; border = "rgba(231,76,60,0.4)"; }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                background: bg, border: `2px solid ${border}`,
                borderRadius: 12, padding: "10px 14px",
                color, fontSize: 14, fontWeight: 700,
                cursor: revealed ? "default" : "pointer",
                textAlign: "left", transition: "all 0.2s",
                fontFamily: "'Nunito', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              {opt}
              {revealed && isCorrect && <span>✅</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <div style={{
        minHeight: 36,
        opacity: selected !== null ? 1 : 0,
        transition: "opacity 0.3s",
        background: "rgba(78,205,196,0.08)",
        borderRadius: 10, padding: "8px 12px",
        fontSize: 13, color: "#4ECDC4", fontWeight: 600,
        fontFamily: "'Nunito', sans-serif",
      }}>
        💡 {q.explanation}
      </div>
    </div>
  );
}

// ── Competition logos/badges ─────────────────────────────────────────────────
const COMPETITION_BADGES = [
  { name: "UK Junior\nMathematical\nChallenge", short: "UKMT", color: "#F5A623" },
  { name: "Primary\nMaths\nChallenge", short: "PMC", color: "#4ECDC4" },
  { name: "Kangourou\ndes\nMathématiques", short: "🦘", color: "#9B59B6" },
  { name: "AMC 8\nAmerican\nMaths", short: "AMC", color: "#E74C3C" },
];

// ── Feature cards ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "🏆",
    title: "Competition-Style Questions",
    desc: "PMC, UKMT Junior, and Kangourou-inspired problems. Each has a single elegant 'aha!' insight — not just grinding arithmetic.",
    accent: "#F5A623",
  },
  {
    icon: "⏱️",
    title: "Timed Paper Mode",
    desc: "Simulate the real exam. 25 questions, 60-minute countdown. Flag questions, skip and return, just like the actual competition.",
    accent: "#E74C3C",
  },
  {
    icon: "🧩",
    title: "Shape Value Puzzles",
    desc: "Pictorial simultaneous equations — your unique edge. Three emojis, two rows, find both values. Builds algebraic thinking early.",
    accent: "#9B59B6",
  },
  {
    icon: "📊",
    title: "Teacher Dashboard",
    desc: "See exactly which question types your class struggles with. Assign targeted practice. Track improvement over time.",
    accent: "#4ECDC4",
  },
  {
    icon: "💡",
    title: "Worked Solutions",
    desc: "Every question has a step-by-step explanation. Not just the answer — the mathematical thinking behind it.",
    accent: "#2ECC71",
  },
  {
    icon: "🗓️",
    title: "Problem of the Week",
    desc: "A new competition-style challenge every week. Class leaderboard. Solution revealed on Friday. Builds the habit of mathematical thinking.",
    accent: "#FF6B6B",
  },
];

// ── Testimonial-style endorsements ──────────────────────────────────────────
const ENDORSEMENTS = [
  { role: "Year 5 Teacher", text: "The shape value puzzles are unlike anything else — my pupils actually look forward to maths homework.", initial: "S" },
  { role: "Parent, Year 4", text: "My daughter went from dreading the PMC to asking for 'just one more question'. The explanations finally make it click.", initial: "R" },
  { role: "Maths Lead, Primary", text: "The teacher heatmap shows me exactly which topics need more whole-class work. Saves hours of analysis.", initial: "T" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D", fontFamily: "'Nunito', sans-serif" }}>
      <NavBar />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: "72px", paddingBottom: "80px" }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 50% at 20% 40%, rgba(245,166,35,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 60%, rgba(78,205,196,0.06) 0%, transparent 55%)",
        }} />
        {/* Grid lines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}>
            {/* Left — copy */}
            <div>
              {/* Pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(245,166,35,0.1)",
                border: "1.5px solid rgba(245,166,35,0.3)",
                borderRadius: 99, padding: "6px 16px",
                fontSize: 12, fontWeight: 800, color: "#F5A623",
                marginBottom: 24,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                🏅 PMC · UKMT · Kangourou Competition Prep
              </div>

              <h1 style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(36px, 4.5vw, 58px)",
                color: "white",
                lineHeight: 1.1,
                margin: "0 0 20px",
                letterSpacing: "-1px",
              }}>
                The smartest way<br />
                to prepare for<br />
                <span style={{
                  color: "#F5A623",
                  position: "relative",
                  display: "inline-block",
                }}>
                  competition maths
                  <svg style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 8 }} viewBox="0 0 300 8" preserveAspectRatio="none">
                    <path d="M0,6 Q75,0 150,6 Q225,12 300,6" stroke="#F5A623" strokeWidth="2.5" fill="none" opacity="0.6" />
                  </svg>
                </span>
              </h1>

              <p style={{
                fontSize: 17, color: "#B0C4DE", lineHeight: 1.7,
                marginBottom: 16, maxWidth: 440,
              }}>
                NumerOwls gives primary school pupils the <strong style={{ color: "white" }}>exact thinking skills</strong> needed for PMC, UKMT Junior, and Kangourou — through elegant problems, animated solutions, and targeted practice.
              </p>

              <p style={{ fontSize: 14, color: "#4ECDC4", fontWeight: 700, marginBottom: 36 }}>
                ✓ Free · ✓ Years 1–6 · ✓ No email required · ✓ Start in 30 seconds
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <button style={{
                        background: "linear-gradient(135deg, #F5A623, #E8941A)",
                        border: "none", borderRadius: 14,
                        padding: "15px 32px", fontSize: 16, fontWeight: 800,
                        color: "#0F1B2D", cursor: "pointer",
                        boxShadow: "0 4px 24px rgba(245,166,35,0.4)",
                        fontFamily: "'Nunito', sans-serif",
                      }}>
                        Go to My Dashboard →
                      </button>
                    </Link>
                    <Link href="/competition">
                      <button style={{
                        background: "transparent",
                        border: "2px solid rgba(78,205,196,0.4)",
                        borderRadius: 14, padding: "15px 28px",
                        fontSize: 15, fontWeight: 800,
                        color: "#4ECDC4", cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                      }}>
                        🏆 Competition Mode
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <a href={getLoginUrl()}>
                      <button style={{
                        background: "linear-gradient(135deg, #F5A623, #E8941A)",
                        border: "none", borderRadius: 14,
                        padding: "15px 32px", fontSize: 16, fontWeight: 800,
                        color: "#0F1B2D", cursor: "pointer",
                        boxShadow: "0 4px 24px rgba(245,166,35,0.4)",
                        fontFamily: "'Nunito', sans-serif",
                      }}>
                        🦉 Start Free — No Sign-Up Needed →
                      </button>
                    </a>
                    <Link href="/competition">
                      <button style={{
                        background: "transparent",
                        border: "2px solid rgba(255,255,255,0.15)",
                        borderRadius: 14, padding: "15px 28px",
                        fontSize: 15, fontWeight: 800,
                        color: "#B0C4DE", cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                      }}>
                        Try a Question First →
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Competition logos */}
              <div style={{ marginTop: 40 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#B0C4DE", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                  Questions inspired by
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {COMPETITION_BADGES.map(b => (
                    <div key={b.short} style={{
                      background: `${b.color}12`,
                      border: `1.5px solid ${b.color}30`,
                      borderRadius: 10, padding: "6px 14px",
                      fontSize: 12, fontWeight: 800, color: b.color,
                    }}>
                      {b.short}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — interactive question demo */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative" }}>
                <QuestionPreview />
                {/* Floating decoration */}
                <div style={{
                  position: "absolute", top: -16, right: -16,
                  background: "rgba(155,89,182,0.9)",
                  borderRadius: 12, padding: "8px 14px",
                  fontSize: 12, fontWeight: 800, color: "white",
                  boxShadow: "0 4px 16px rgba(155,89,182,0.4)",
                  whiteSpace: "nowrap",
                }}>
                  ⭐ Try it — it's live!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: "rgba(255,255,255,0.025)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 0",
      }}>
        <div className="container">
          <div style={{ display: "flex", gap: 0, justifyContent: "space-around", flexWrap: "wrap" }}>
            {[
              { val: 50, suffix: "+", label: "Competition questions" },
              { val: 4, suffix: "", label: "Year-group sets" },
              { val: 9, suffix: "", label: "Skill categories" },
              { val: 100, suffix: "%", label: "Free forever" },
            ].map(({ val, suffix, label }) => (
              <div key={label} style={{ textAlign: "center", padding: "8px 24px" }}>
                <div style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 36, fontWeight: 900, color: "#F5A623",
                  lineHeight: 1,
                }}>
                  <Ticker to={val} suffix={suffix} />
                </div>
                <div style={{ fontSize: 13, color: "#B0C4DE", fontWeight: 600, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHAT MAKES COMPETITION MATHS HARD ════════════════════════════════ */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{
              display: "inline-block",
              background: "rgba(231,76,60,0.12)",
              border: "1.5px solid rgba(231,76,60,0.3)",
              borderRadius: 99, padding: "5px 16px",
              fontSize: 12, fontWeight: 800, color: "#E74C3C",
              marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              The Problem
            </div>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: "clamp(26px, 4vw, 40px)", color: "white",
              margin: "0 0 16px", letterSpacing: "-0.5px",
            }}>
              Competition maths isn't about knowing more.<br />
              <span style={{ color: "#E74C3C" }}>It's about thinking differently.</span>
            </h2>
            <p style={{ fontSize: 16, color: "#B0C4DE", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Most maths apps prepare pupils for school tests. NumerOwls prepares them for
              the <em>elegant surprise</em> that makes competition maths special — the single
              insight that makes a hard problem suddenly obvious.
            </p>
          </div>

          {/* Comparison */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
          }}>
            <div style={{
              background: "rgba(231,76,60,0.05)",
              border: "2px solid rgba(231,76,60,0.2)",
              borderRadius: 20, padding: "28px 24px",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#E74C3C", marginBottom: 16 }}>
                ❌ Standard maths question
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 12 }}>
                "Calculate 3 × 8 − 6"
              </p>
              <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6 }}>
                Tests arithmetic speed. No insight required. Doesn't prepare pupils for competition thinking.
              </p>
            </div>
            <div style={{
              background: "rgba(78,205,196,0.05)",
              border: "2px solid rgba(78,205,196,0.25)",
              borderRadius: 20, padding: "28px 24px",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#4ECDC4", marginBottom: 16 }}>
                ✓ NumerOwls competition question
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 12 }}>
                "A number doubled then reduced by 6 equals the same as tripled then reduced by 15. What is it?"
              </p>
              <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.6 }}>
                Requires <strong style={{ color: "white" }}>one key insight</strong>. Builds the algebraic thinking that competition maths rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: "20px 0 80px", background: "rgba(255,255,255,0.015)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: "clamp(24px, 3.5vw, 36px)", color: "white",
              margin: "0 0 12px",
            }}>
              Everything a competition-ready pupil needs
            </h2>
            <p style={{ color: "#B0C4DE", fontSize: 15 }}>
              Built specifically for PMC, UKMT Junior, and Kangourou preparation
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: "#1A2E4A",
                border: `2px solid ${f.accent}22`,
                borderRadius: 20, padding: "28px 24px",
                transition: "all 0.25s",
              }}>
                <div style={{
                  width: 48, height: 48,
                  background: `${f.accent}18`,
                  borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 16,
                  border: `1.5px solid ${f.accent}30`,
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                  fontSize: 17, color: "white", margin: "0 0 10px",
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "#B0C4DE", lineHeight: 1.65, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ YEAR GROUPS ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: "clamp(24px, 3.5vw, 34px)", color: "white",
              margin: "0 0 10px",
            }}>
              Tailored to every year group
            </h2>
            <p style={{ color: "#B0C4DE", fontSize: 15 }}>
              Questions that are genuinely appropriate for each stage — not just easier or harder numbers
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}>
            {[
              { year: 1, emoji: "🌱", topics: "Counting, adding to 20, number bonds", badge: "Foundation" },
              { year: 2, emoji: "🌿", topics: "2×, 5×, 10× tables · Halving · Patterns", badge: "Building" },
              { year: 3, emoji: "🌳", topics: "All times tables · 3-digit numbers · Data", badge: "Growing" },
              { year: 4, emoji: "⭐", topics: "Decimals · Area · Factors · Roman numerals", badge: "Stretching" },
              { year: 5, emoji: "🚀", topics: "Fractions · Percentages · Prime numbers", badge: "Advanced" },
              { year: 6, emoji: "🏆", topics: "Ratio · Algebra · Complex geometry · SATs", badge: "Competition-ready" },
            ].map(y => (
              <div key={y.year} style={{
                background: "#1A2E4A",
                border: "1.5px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 28 }}>{y.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "white" }}>Year {y.year}</div>
                    <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 700 }}>{y.badge}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#B0C4DE", margin: 0, lineHeight: 1.5 }}>{y.topics}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ENDORSEMENTS ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: "60px 0",
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: 28, color: "white",
            textAlign: "center", marginBottom: 36,
          }}>
            What teachers and parents say
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {ENDORSEMENTS.map(e => (
              <div key={e.initial} style={{
                background: "#1A2E4A",
                border: "1.5px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "24px",
              }}>
                <p style={{
                  fontSize: 15, color: "white", fontWeight: 600,
                  lineHeight: 1.7, margin: "0 0 18px",
                  fontStyle: "italic",
                }}>
                  "{e.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #F5A623, #E8941A)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: 15, color: "#0F1B2D",
                  }}>
                    {e.initial}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#B0C4DE" }}>{e.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 680, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🦉</div>
          <h2 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: "clamp(28px, 4vw, 42px)", color: "white",
            margin: "0 0 16px", letterSpacing: "-0.5px",
          }}>
            Ready to think like a competition mathematician?
          </h2>
          <p style={{ fontSize: 17, color: "#B0C4DE", marginBottom: 36, lineHeight: 1.7 }}>
            Free, no email required, works on any device.
            Your first competition question is waiting.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {isAuthenticated ? (
              <Link href="/competition">
                <button style={{
                  background: "linear-gradient(135deg, #F5A623, #E8941A)",
                  border: "none", borderRadius: 14,
                  padding: "16px 36px", fontSize: 17, fontWeight: 900,
                  color: "#0F1B2D", cursor: "pointer",
                  boxShadow: "0 6px 28px rgba(245,166,35,0.45)",
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  🏆 Go to Competition Mode →
                </button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <button style={{
                    background: "linear-gradient(135deg, #F5A623, #E8941A)",
                    border: "none", borderRadius: 14,
                    padding: "16px 36px", fontSize: 17, fontWeight: 900,
                    color: "#0F1B2D", cursor: "pointer",
                    boxShadow: "0 6px 28px rgba(245,166,35,0.45)",
                    fontFamily: "'Nunito', sans-serif",
                  }}>
                    🦉 Get Started — It's Free →
                  </button>
                </a>
                <Link href="/competition">
                  <button style={{
                    background: "transparent",
                    border: "2px solid rgba(255,255,255,0.15)",
                    borderRadius: 14, padding: "16px 28px",
                    fontSize: 16, fontWeight: 800, color: "#B0C4DE",
                    cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                  }}>
                    Try Without Signing In →
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 0", textAlign: "center",
      }}>
        <p style={{ fontSize: 13, color: "#B0C4DE", margin: 0 }}>
          🦉 NumerOwls · Free competition maths for Years 1–6 · Made with ❤️ for teachers and pupils
        </p>
      </footer>
    </div>
  );
}
