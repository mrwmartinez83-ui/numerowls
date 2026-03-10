import { useEffect, useState } from "react";

type OwlMood = "idle" | "happy" | "excited" | "sad" | "thinking" | "celebrating";

interface OwlMascotProps {
  mood?: OwlMood;
  message?: string;
  size?: number;
  showMessage?: boolean;
}

const MOOD_FACES: Record<OwlMood, string> = {
  idle:        "🦉",
  happy:       "🦉",
  excited:     "🦉",
  sad:         "🦉",
  thinking:    "🦉",
  celebrating: "🦉",
};

const MOOD_MESSAGES: Record<OwlMood, string[]> = {
  idle: [
    "Ready to practise?",
    "Let's do some maths!",
    "You can do it!",
    "Pick a skill to start!",
  ],
  happy: [
    "Well done! ⭐",
    "Brilliant! Keep going!",
    "You got it! 🎉",
    "Fantastic work!",
    "That's right! Amazing!",
    "Super star! ✨",
  ],
  excited: [
    "INCREDIBLE! 🌟",
    "YOU'RE ON FIRE! 🔥",
    "AMAZING STREAK! 💥",
    "UNSTOPPABLE! 🚀",
  ],
  sad: [
    "Not quite — try again! 💪",
    "Nearly there! Don't give up!",
    "Oops! Check the answer below.",
    "Mistakes help us learn! 🧠",
    "You'll get the next one!",
  ],
  thinking: [
    "Hmm, let me think... 🤔",
    "Take your time!",
    "Read it carefully...",
    "What do you notice?",
  ],
  celebrating: [
    "AMAZING SCORE! 🎊",
    "YOU'RE A MATHS STAR! ⭐",
    "BRILLIANT WORK! 🏆",
    "INCREDIBLE! 🎉",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function OwlMascot({
  mood = "idle",
  message,
  size = 64,
  showMessage = true,
}: OwlMascotProps) {
  const [displayMessage, setDisplayMessage] = useState(
    message ?? pickRandom(MOOD_MESSAGES[mood])
  );
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setDisplayMessage(message ?? pickRandom(MOOD_MESSAGES[mood]));
    setAnimKey((k) => k + 1);
  }, [mood, message]);

  const owlStyle: React.CSSProperties = {
    fontSize: `${size}px`,
    lineHeight: 1,
    display: "inline-block",
    animation: mood === "excited" || mood === "celebrating"
      ? "owlBounce 0.4s ease infinite alternate"
      : mood === "happy"
      ? "owlWiggle 0.5s ease 1"
      : mood === "sad"
      ? "owlShake 0.4s ease 1"
      : "none",
    filter: mood === "excited" ? "drop-shadow(0 0 12px #F5A623)" : "none",
    transition: "filter 0.3s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <span key={`owl-${animKey}`} style={owlStyle}>
        {MOOD_FACES[mood]}
      </span>
      {showMessage && (
        <div
          key={`msg-${animKey}`}
          style={{
            background: mood === "happy" || mood === "excited" || mood === "celebrating"
              ? "rgba(46,204,113,0.15)"
              : mood === "sad"
              ? "rgba(231,76,60,0.12)"
              : "rgba(245,166,35,0.12)",
            border: `1.5px solid ${
              mood === "happy" || mood === "excited" || mood === "celebrating"
                ? "rgba(46,204,113,0.4)"
                : mood === "sad"
                ? "rgba(231,76,60,0.35)"
                : "rgba(245,166,35,0.35)"
            }`,
            borderRadius: "14px",
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: 700,
            color: mood === "happy" || mood === "excited" || mood === "celebrating"
              ? "#2ECC71"
              : mood === "sad"
              ? "#E74C3C"
              : "#F5A623",
            textAlign: "center",
            maxWidth: "220px",
            animation: "owlMsgFadeIn 0.3s ease",
          }}
        >
          {displayMessage}
        </div>
      )}
    </div>
  );
}

/** Inline CSS keyframes — inject once at app level via index.css */
export const OWL_KEYFRAMES = `
@keyframes owlBounce {
  from { transform: translateY(0) scale(1); }
  to   { transform: translateY(-8px) scale(1.08); }
}
@keyframes owlWiggle {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-12deg) scale(1.1); }
  50%  { transform: rotate(12deg) scale(1.15); }
  75%  { transform: rotate(-6deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}
@keyframes owlShake {
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-6px); }
  40%  { transform: translateX(6px); }
  60%  { transform: translateX(-4px); }
  80%  { transform: translateX(4px); }
  100% { transform: translateX(0); }
}
@keyframes owlMsgFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
