import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const OWL_AVATARS = [
  "🦉", "🐦", "🦅", "🦆", "🐧", "🦜", "🦚", "🦩",
  "🐸", "🐯", "🦁", "🐻", "🐼", "🐨", "🦊", "🐺",
  "🦋", "🐝", "🐙", "🦄", "🐉", "⭐", "🌟", "🔥",
];

const YEAR_OPTIONS = [
  { year: 1, emoji: "🌱", label: "Year 1", desc: "Ages 5–6 · Counting & adding" },
  { year: 2, emoji: "🌿", label: "Year 2", desc: "Ages 6–7 · Number bonds & tables" },
  { year: 3, emoji: "🌳", label: "Year 3", desc: "Ages 7–8 · All times tables" },
  { year: 4, emoji: "⭐", label: "Year 4", desc: "Ages 8–9 · Decimals & area" },
  { year: 5, emoji: "🚀", label: "Year 5", desc: "Ages 9–10 · Fractions & primes" },
  { year: 6, emoji: "🏆", label: "Year 6", desc: "Ages 10–11 · Ratio & algebra" },
];

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [yearGroup, setYearGroup] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("🦉");
  const [saving, setSaving] = useState(false);
  const [, navigate] = useLocation();

  const updateProfile = trpc.profile.update.useMutation();
  const utils = trpc.useUtils();

  const handleSave = async () => {
    if (!displayName.trim() || !yearGroup) return;
    setSaving(true);
    try {
      await updateProfile.mutateAsync({ displayName: displayName.trim(), yearGroup, avatarEmoji });
      await utils.auth.me.invalidate();
      onComplete();
      // Redirect to dashboard with a welcome message
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const card: React.CSSProperties = {
    background: "#1A2E4A",
    border: "2px solid rgba(245,166,35,0.3)",
    borderRadius: "24px",
    padding: "40px 36px",
    maxWidth: "500px",
    width: "100%",
    position: "relative",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={card}>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: "4px", borderRadius: "99px",
              background: s <= step ? "#F5A623" : "rgba(255,255,255,0.12)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* ── Step 1: Year Group ─────────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "52px", marginBottom: "12px" }}>📚</div>
              <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "24px", color: "white", marginBottom: "8px" }}>
                Welcome to NumerOwls! 🦉
              </h2>
              <p style={{ color: "#B0C4DE", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>
                First, which year are you in? We'll tailor your questions to the right level — you can always explore other years too.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {YEAR_OPTIONS.map(({ year, emoji, label, desc }) => (
                <button
                  key={year}
                  onClick={() => setYearGroup(year)}
                  style={{
                    padding: "14px 12px",
                    borderRadius: "14px",
                    background: yearGroup === year ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
                    border: `2px solid ${yearGroup === year ? "#F5A623" : "rgba(255,255,255,0.1)"}`,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "22px" }}>{emoji}</span>
                    <span style={{ fontWeight: 800, fontSize: "15px", color: yearGroup === year ? "#F5A623" : "white", fontFamily: "'Nunito', sans-serif" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#B0C4DE", lineHeight: 1.3 }}>{desc}</div>
                </button>
              ))}
            </div>
            <button
              className="no-btn-gold"
              style={{ width: "100%", fontSize: "16px", padding: "14px" }}
              onClick={() => setStep(2)}
              disabled={!yearGroup}
            >
              Next →
            </button>
          </div>
        )}

        {/* ── Step 2: Display Name ───────────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>👋</div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "24px", color: "white", marginBottom: "8px" }}>
              What's your name?
            </h2>
            <p style={{ color: "#B0C4DE", fontSize: "14px", marginBottom: "28px", lineHeight: 1.5 }}>
              This will appear on the leaderboard. Use your first name, a nickname, or a fun username!
            </p>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && displayName.trim() && setStep(3)}
              placeholder="e.g. Oliver, MathsWizard, SuperOwl..."
              maxLength={32}
              autoFocus
              className="no-input"
              style={{ width: "100%", fontSize: "18px", padding: "14px 18px", textAlign: "center", marginBottom: "20px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="no-btn-ghost" style={{ flex: 1, fontSize: "15px" }} onClick={() => setStep(1)}>← Back</button>
              <button
                className="no-btn-gold"
                style={{ flex: 2, fontSize: "15px" }}
                onClick={() => setStep(3)}
                disabled={!displayName.trim()}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Avatar ─────────────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>{avatarEmoji}</div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "24px", color: "white", marginBottom: "8px" }}>
              Pick your avatar!
            </h2>
            <p style={{ color: "#B0C4DE", fontSize: "14px", marginBottom: "20px" }}>
              This shows next to your name on the leaderboard.
            </p>

            {/* Avatar grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "8px", marginBottom: "20px" }}>
              {OWL_AVATARS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  style={{
                    width: "44px", height: "44px",
                    borderRadius: "10px",
                    background: avatarEmoji === emoji ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${avatarEmoji === emoji ? "#F5A623" : "transparent"}`,
                    fontSize: "22px",
                    cursor: "pointer",
                    transition: "all 0.12s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Preview card */}
            <div style={{
              padding: "14px 18px", borderRadius: "12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", gap: "12px",
              marginBottom: "20px", textAlign: "left",
            }}>
              <div style={{ fontSize: "34px" }}>{avatarEmoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: "16px", color: "white" }}>{displayName}</div>
                <div style={{ fontSize: "12px", color: "#B0C4DE" }}>
                  {YEAR_OPTIONS.find(y => y.year === yearGroup)?.label} · 0 points
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: "17px", color: "#F5A623" }}>0 pts</div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="no-btn-ghost" style={{ flex: 1, fontSize: "15px" }} onClick={() => setStep(2)}>← Back</button>
              <button
                className="no-btn-gold"
                style={{ flex: 2, fontSize: "16px" }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Setting up..." : "🦉 Start Learning!"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
