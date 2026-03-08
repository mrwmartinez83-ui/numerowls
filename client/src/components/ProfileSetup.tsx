import { useState } from "react";
import { trpc } from "@/lib/trpc";

const OWL_AVATARS = [
  "🦉", "🐦", "🦅", "🦆", "🐧", "🦜", "🦚", "🦩",
  "🐸", "🐯", "🦁", "🐻", "🐼", "🐨", "🦊", "🐺",
  "🦝", "🐮", "🐷", "🐸", "🐙", "🦋", "🐝", "⭐",
];

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [displayName, setDisplayName] = useState("");
  const [yearGroup, setYearGroup] = useState<number | null>(null);
  const [avatarEmoji, setAvatarEmoji] = useState("🦉");
  const [saving, setSaving] = useState(false);

  const updateProfile = trpc.profile.update.useMutation();
  const utils = trpc.useUtils();

  const handleSave = async () => {
    if (!displayName.trim() || !yearGroup) return;
    setSaving(true);
    try {
      await updateProfile.mutateAsync({ displayName: displayName.trim(), yearGroup, avatarEmoji });
      await utils.auth.me.invalidate();
      onComplete();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#1A2E4A",
        border: "2px solid rgba(245,166,35,0.3)",
        borderRadius: "24px",
        padding: "40px 36px",
        maxWidth: "480px",
        width: "100%",
        position: "relative",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: s === step ? "24px" : "8px",
              height: "8px",
              borderRadius: "99px",
              background: s <= step ? "#F5A623" : "rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>👋</div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "26px", color: "white", marginBottom: "8px" }}>
              Welcome to NumerOwls!
            </h2>
            <p style={{ color: "#B0C4DE", fontSize: "15px", marginBottom: "32px", lineHeight: 1.5 }}>
              Let's set up your profile. First, what would you like to be called?
            </p>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && displayName.trim() && setStep(2)}
              placeholder="e.g. Oliver, Mia, SuperOwl..."
              maxLength={32}
              autoFocus
              className="no-input"
              style={{ width: "100%", fontSize: "18px", padding: "14px 18px", textAlign: "center", marginBottom: "20px" }}
            />
            <button
              className="no-btn-gold"
              style={{ width: "100%", fontSize: "16px", padding: "14px" }}
              onClick={() => setStep(2)}
              disabled={!displayName.trim()}
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2 — Year Group */}
        {step === 2 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "26px", color: "white", marginBottom: "8px" }}>
              What year are you in?
            </h2>
            <p style={{ color: "#B0C4DE", fontSize: "15px", marginBottom: "28px" }}>
              We'll show you the right questions for your level.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              {[1, 2, 3, 4, 5, 6].map(y => (
                <button
                  key={y}
                  onClick={() => setYearGroup(y)}
                  style={{
                    padding: "18px 12px",
                    borderRadius: "14px",
                    background: yearGroup === y ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${yearGroup === y ? "#F5A623" : "rgba(255,255,255,0.1)"}`,
                    color: yearGroup === y ? "#F5A623" : "white",
                    fontSize: "18px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>
                    {["🌱", "🌿", "🌳", "⭐", "🚀", "🏆"][y - 1]}
                  </div>
                  Year {y}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="no-btn-ghost" style={{ flex: 1, fontSize: "15px" }} onClick={() => setStep(1)}>← Back</button>
              <button
                className="no-btn-gold"
                style={{ flex: 2, fontSize: "15px" }}
                onClick={() => setStep(3)}
                disabled={!yearGroup}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Avatar */}
        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>{avatarEmoji}</div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "26px", color: "white", marginBottom: "8px" }}>
              Pick your avatar!
            </h2>
            <p style={{ color: "#B0C4DE", fontSize: "15px", marginBottom: "24px" }}>
              This will show on the leaderboard next to your name.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "8px", marginBottom: "24px" }}>
              {OWL_AVATARS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: avatarEmoji === emoji ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${avatarEmoji === emoji ? "#F5A623" : "transparent"}`,
                    fontSize: "22px",
                    cursor: "pointer",
                    transition: "all 0.12s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Preview card */}
            <div style={{
              padding: "16px 20px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "24px",
              textAlign: "left",
            }}>
              <div style={{ fontSize: "36px" }}>{avatarEmoji}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "17px", color: "white" }}>{displayName}</div>
                <div style={{ fontSize: "13px", color: "#B0C4DE" }}>Year {yearGroup} · 0 points</div>
              </div>
              <div style={{ marginLeft: "auto", fontWeight: 700, fontSize: "18px", color: "#F5A623" }}>0 pts</div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="no-btn-ghost" style={{ flex: 1, fontSize: "15px" }} onClick={() => setStep(2)}>← Back</button>
              <button
                className="no-btn-gold"
                style={{ flex: 2, fontSize: "16px" }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "🦉 Start Learning!"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
