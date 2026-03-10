import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "wouter";
import { generateBronzeRoom } from "../escape/roomBronze";
import { generateSilverRoom } from "../escape/roomSilver";
import { generateGoldRoom } from "../escape/roomGold";
import type { EscapeRoom, EscapeStage } from "../escape/escapeTypes";
import confetti from "canvas-confetti";

// ─── Room registry ────────────────────────────────────────────────────────────
const ROOM_GENERATORS: Record<string, () => EscapeRoom> = {
  bronze: generateBronzeRoom,
  silver: generateSilverRoom,
  gold: generateGoldRoom,
};

// ─── Markdown-lite renderer (bold + italic) ───────────────────────────────────
function renderMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part === "\n") return <br key={i} />;
    return part;
  });
}

// ─── Phase types ──────────────────────────────────────────────────────────────
type Phase = "intro" | "stage_intro" | "puzzle" | "stage_outro" | "escaped";

export default function EscapeRoomPlayer() {
  const params = useParams<{ tier: string }>();
  const tier = params.tier ?? "bronze";

  // Generate room once on mount
  const [room, setRoom] = useState<EscapeRoom | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [stageIndex, setStageIndex] = useState(0);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [inputSuccess, setInputSuccess] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]); // hint indices used this stage
  const [showHint, setShowHint] = useState<number | null>(null);
  const [totalHintPenalty, setTotalHintPenalty] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [stagesCompleted, setStagesCompleted] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const gen = ROOM_GENERATORS[tier];
    if (gen) setRoom(gen());
  }, [tier]);

  // Timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const currentStage: EscapeStage | undefined = room?.stages[stageIndex];

  const startRoom = () => {
    setPhase("stage_intro");
    setTimerRunning(true);
  };

  const startPuzzle = () => {
    setPhase("puzzle");
    setInput("");
    setInputError("");
    setInputSuccess(false);
    setHintsUsed([]);
    setShowHint(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const checkAnswer = useCallback(() => {
    if (!currentStage) return;
    const expected = currentStage.puzzle.lockCode.trim().toLowerCase();
    const given = input.trim().toLowerCase();
    if (given === expected) {
      setInputSuccess(true);
      setInputError("");
      setStagesCompleted(s => s + 1);
      // Small confetti burst on stage unlock
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ["#F5A623", "#4ECDC4", "#FF6B6B"] });
      setTimeout(() => setPhase("stage_outro"), 800);
    } else {
      setInputError("Not quite — check your working and try again! 🤔");
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentStage, input]);

  const nextStage = () => {
    if (!room) return;
    if (stageIndex + 1 >= room.stages.length) {
      // Escaped!
      setTimerRunning(false);
      setPhase("escaped");
      // Big celebration
      const duration = 4000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#FFD700", "#F5A623", "#4ECDC4"] });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#FFD700", "#F5A623", "#FF6B6B"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    } else {
      setStageIndex(i => i + 1);
      setPhase("stage_intro");
      setInput("");
      setInputError("");
      setInputSuccess(false);
      setHintsUsed([]);
      setShowHint(null);
    }
  };

  const useHint = (hintIndex: number) => {
    if (!currentStage) return;
    const hint = currentStage.puzzle.hints[hintIndex];
    if (!hint || hintsUsed.includes(hintIndex)) return;
    setHintsUsed(prev => [...prev, hintIndex]);
    setTotalHintPenalty(p => p + hint.cost);
    setShowHint(hintIndex);
  };

  const regenerateRoom = () => {
    const gen = ROOM_GENERATORS[tier];
    if (gen) {
      setRoom(gen());
      setPhase("intro");
      setStageIndex(0);
      setInput("");
      setInputError("");
      setInputSuccess(false);
      setHintsUsed([]);
      setShowHint(null);
      setElapsedSeconds(0);
      setTimerRunning(false);
      setStagesCompleted(0);
      setTotalHintPenalty(0);
    }
  };

  if (!room) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a1a" }}>
        <div style={{ color: "#F5A623", fontSize: "24px" }}>Loading escape room...</div>
      </div>
    );
  }

  const tierColors: Record<string, { primary: string; glow: string; badge: string }> = {
    bronze: { primary: "#CD7F32", glow: "rgba(205,127,50,0.3)", badge: "🥉" },
    silver: { primary: "#C0C0C0", glow: "rgba(192,192,192,0.3)", badge: "🥈" },
    gold: { primary: "#FFD700", glow: "rgba(255,215,0,0.3)", badge: "🥇" },
  };
  const tc = tierColors[tier] ?? tierColors.bronze;

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: room.bgGradient,
    fontFamily: "'Nunito', sans-serif",
    color: "white",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: `1.5px solid ${tc.primary}40`,
    borderRadius: "16px",
    padding: "28px",
    backdropFilter: "blur(8px)",
  };

  // ── INTRO SCREEN ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={containerStyle}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>
          {/* Back link */}
          <Link href="/escape-rooms" style={{ color: tc.primary, textDecoration: "none", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
            ← Back to Escape Rooms
          </Link>

          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "80px", marginBottom: "12px", filter: `drop-shadow(0 0 20px ${tc.glow})` }}>
              {room.emoji}
            </div>
            <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: "20px", background: `${tc.primary}20`, border: `1px solid ${tc.primary}60`, color: tc.primary, fontSize: "13px", fontWeight: 800, marginBottom: "12px" }}>
              {tc.badge} {tier.toUpperCase()} · {room.yearRange}
            </div>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, margin: "0 0 8px", color: "white" }}>
              {room.title}
            </h1>
            <p style={{ fontSize: "18px", color: `${tc.primary}cc`, fontStyle: "italic", margin: "0 0 20px" }}>
              {room.subtitle}
            </p>
          </div>

          {/* Story intro */}
          <div style={{ ...cardStyle, marginBottom: "24px", lineHeight: 1.7, fontSize: "16px" }}>
            <div style={{ fontSize: "20px", fontWeight: 800, color: tc.primary, marginBottom: "12px" }}>📖 The Story</div>
            <p style={{ margin: 0 }}>{renderMarkdown(room.storyIntro)}</p>
          </div>

          {/* Room info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
            {[
              { icon: "🎯", label: "Difficulty", value: tier.charAt(0).toUpperCase() + tier.slice(1) },
              { icon: "📚", label: "Year Group", value: room.yearRange },
              { icon: "🧩", label: "Stages", value: `${room.stages.length} puzzles` },
            ].map(item => (
              <div key={item.label} style={{ ...cardStyle, textAlign: "center", padding: "16px" }}>
                <div style={{ fontSize: "24px" }}>{item.icon}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{item.label}</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: tc.primary, marginTop: "2px" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div style={{ ...cardStyle, marginBottom: "28px", background: `${tc.primary}10`, borderColor: `${tc.primary}40` }}>
            <div style={{ fontWeight: 800, color: tc.primary, marginBottom: "8px" }}>💡 Tips for your team</div>
            <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: 2, fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
              <li>Read each puzzle carefully — the story gives you clues!</li>
              <li>Hints are available but cost time penalty seconds</li>
              <li>Work together — discuss your reasoning before entering the code</li>
              <li>Numbers are randomly generated each time — every run is different!</li>
            </ul>
          </div>

          {/* Start button */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={startRoom}
              style={{
                padding: "16px 48px", borderRadius: "12px", fontSize: "18px", fontWeight: 900,
                background: `linear-gradient(135deg, ${tc.primary}, ${tc.primary}cc)`,
                color: "#0a0a1a", border: "none", cursor: "pointer",
                boxShadow: `0 4px 20px ${tc.glow}`,
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              🚀 Start the Escape Room!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ESCAPED SCREEN ────────────────────────────────────────────────────────
  if (phase === "escaped") {
    const totalTime = elapsedSeconds + totalHintPenalty;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    return (
      <div style={containerStyle}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "80px", marginBottom: "16px", animation: "owlBounce 0.6s ease infinite alternate" }}>
            🎉
          </div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 900, color: tc.primary, marginBottom: "8px" }}>
            YOU ESCAPED!
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", marginBottom: "28px", fontStyle: "italic" }}>
            {room.storyOutro}
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
            {[
              { icon: "⏱️", label: "Total Time", value: `${minutes}m ${seconds}s` },
              { icon: "🧩", label: "Stages Solved", value: `${stagesCompleted} / ${room.stages.length}` },
              { icon: "💡", label: "Hints Used", value: `${hintsUsed.length} (+${totalHintPenalty}s)` },
            ].map(item => (
              <div key={item.label} style={{ ...cardStyle, padding: "20px 12px" }}>
                <div style={{ fontSize: "28px" }}>{item.icon}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{item.label}</div>
                <div style={{ fontSize: "18px", fontWeight: 900, color: tc.primary, marginTop: "4px" }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={regenerateRoom}
              style={{
                padding: "14px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: 800,
                background: `linear-gradient(135deg, ${tc.primary}, ${tc.primary}cc)`,
                color: "#0a0a1a", border: "none", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              🔄 Play Again (New Numbers)
            </button>
            <Link href="/escape-rooms">
              <button style={{
                padding: "14px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: 800,
                background: "rgba(255,255,255,0.1)", color: "white",
                border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
              }}>
                🏠 All Escape Rooms
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStage) return null;

  // ── STAGE INTRO ───────────────────────────────────────────────────────────
  if (phase === "stage_intro") {
    return (
      <div style={containerStyle}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>
          {/* Progress bar */}
          <StageProgress room={room} stageIndex={stageIndex} tc={tc} elapsedSeconds={elapsedSeconds} formatTime={formatTime} />

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "64px", marginBottom: "8px" }}>{currentStage.sceneEmoji}</div>
            <div style={{ fontSize: "13px", color: `${tc.primary}99`, fontWeight: 700, marginBottom: "6px" }}>
              Stage {stageIndex + 1} of {room.stages.length}
            </div>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, color: tc.primary, margin: "0 0 8px" }}>
              {currentStage.name}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: 0, fontStyle: "italic" }}>
              {currentStage.scene}
            </p>
          </div>

          <div style={{ ...cardStyle, marginBottom: "28px", lineHeight: 1.8, fontSize: "16px" }}>
            <div style={{ fontSize: "18px", fontWeight: 800, color: tc.primary, marginBottom: "12px" }}>📖 What's happening...</div>
            <p style={{ margin: 0 }}>{renderMarkdown(currentStage.storyIntro)}</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={startPuzzle}
              style={{
                padding: "14px 40px", borderRadius: "12px", fontSize: "17px", fontWeight: 900,
                background: `linear-gradient(135deg, ${tc.primary}, ${tc.primary}cc)`,
                color: "#0a0a1a", border: "none", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                boxShadow: `0 4px 16px ${tc.glow}`,
              }}
            >
              🔓 Attempt the Puzzle →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── STAGE OUTRO ───────────────────────────────────────────────────────────
  if (phase === "stage_outro") {
    return (
      <div style={containerStyle}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>
          <StageProgress room={room} stageIndex={stageIndex} tc={tc} elapsedSeconds={elapsedSeconds} formatTime={formatTime} />

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "64px", marginBottom: "8px" }}>✅</div>
            <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#4ECDC4", margin: "0 0 8px" }}>
              Stage {stageIndex + 1} Unlocked!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic", margin: 0 }}>
              {currentStage.puzzle.successText}
            </p>
          </div>

          <div style={{ ...cardStyle, marginBottom: "28px", lineHeight: 1.8, fontSize: "16px", borderColor: "#4ECDC440" }}>
            <p style={{ margin: 0 }}>{renderMarkdown(currentStage.storyOutro)}</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={nextStage}
              style={{
                padding: "14px 40px", borderRadius: "12px", fontSize: "17px", fontWeight: 900,
                background: stageIndex + 1 >= room.stages.length
                  ? "linear-gradient(135deg, #FFD700, #F5A623)"
                  : `linear-gradient(135deg, ${tc.primary}, ${tc.primary}cc)`,
                color: "#0a0a1a", border: "none", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {stageIndex + 1 >= room.stages.length ? "🎉 Escape!" : "➡️ Next Stage"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PUZZLE SCREEN ─────────────────────────────────────────────────────────
  const puzzle = currentStage.puzzle;
  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "24px 20px" }}>
        <StageProgress room={room} stageIndex={stageIndex} tc={tc} elapsedSeconds={elapsedSeconds} formatTime={formatTime} />

        {/* Puzzle header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "13px", color: `${tc.primary}99`, fontWeight: 700, marginBottom: "4px" }}>
            Stage {stageIndex + 1} · {currentStage.name}
          </div>
          <h2 style={{ fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 900, color: tc.primary, margin: "0 0 6px" }}>
            🔐 {puzzle.title}
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
            {renderMarkdown(puzzle.flavourText)}
          </p>
        </div>

        {/* Clues */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {puzzle.clues.map((clue) => (
            <div key={clue.id} style={{ ...cardStyle, padding: "18px 20px" }}>
              <div style={{ fontWeight: 800, color: tc.primary, fontSize: "14px", marginBottom: "8px" }}>
                {clue.label}
              </div>
              <div style={{ lineHeight: 1.7, fontSize: "15px" }}>
                {renderMarkdown(clue.question)}
              </div>
            </div>
          ))}
        </div>

        {/* Hint used display */}
        {showHint !== null && (
          <div style={{
            ...cardStyle, marginBottom: "16px",
            background: "rgba(245,166,35,0.12)", borderColor: "rgba(245,166,35,0.4)",
          }}>
            <div style={{ fontWeight: 800, color: "#F5A623", marginBottom: "6px" }}>
              💡 Hint {showHint + 1} (−{puzzle.hints[showHint]?.cost}s penalty)
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>
              {puzzle.hints[showHint]?.text}
            </div>
          </div>
        )}

        {/* Answer input */}
        <div style={{ ...cardStyle, marginBottom: "16px" }}>
          <div style={{ fontWeight: 800, color: "white", marginBottom: "12px", fontSize: "15px" }}>
            🔑 Enter the Code
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setInputError(""); }}
              onKeyDown={e => { if (e.key === "Enter") checkAnswer(); }}
              placeholder="Type your answer here..."
              style={{
                flex: 1, padding: "12px 16px", borderRadius: "10px", fontSize: "18px",
                fontWeight: 700, fontFamily: "'Nunito', sans-serif",
                background: inputSuccess ? "rgba(78,205,196,0.15)" : "rgba(255,255,255,0.08)",
                border: inputSuccess ? "2px solid #4ECDC4" : inputError ? "2px solid #FF6B6B" : "1.5px solid rgba(255,255,255,0.2)",
                color: "white", outline: "none",
                letterSpacing: "2px",
              }}
            />
            <button
              onClick={checkAnswer}
              style={{
                padding: "12px 24px", borderRadius: "10px", fontSize: "16px", fontWeight: 900,
                background: `linear-gradient(135deg, ${tc.primary}, ${tc.primary}cc)`,
                color: "#0a0a1a", border: "none", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              ✓ Unlock
            </button>
          </div>
          {inputError && (
            <div style={{ color: "#FF6B6B", fontSize: "13px", marginTop: "8px", fontWeight: 700 }}>
              {inputError}
            </div>
          )}
          {inputSuccess && (
            <div style={{ color: "#4ECDC4", fontSize: "13px", marginTop: "8px", fontWeight: 700 }}>
              ✅ Correct! Unlocking...
            </div>
          )}
        </div>

        {/* Hints */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {puzzle.hints.map((hint, i) => {
            const used = hintsUsed.includes(i);
            return (
              <button
                key={i}
                onClick={() => { if (!used) useHint(i); else setShowHint(i); }}
                style={{
                  padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 700,
                  background: used ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.06)",
                  border: used ? "1px solid rgba(245,166,35,0.5)" : "1px solid rgba(255,255,255,0.15)",
                  color: used ? "#F5A623" : "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                }}
              >
                {used ? `💡 Hint ${i + 1} (used)` : `💡 Hint ${i + 1} (−${hint.cost}s)`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Stage Progress Bar Component ────────────────────────────────────────────
function StageProgress({
  room, stageIndex, tc, elapsedSeconds, formatTime
}: {
  room: EscapeRoom;
  stageIndex: number;
  tc: { primary: string; glow: string; badge: string };
  elapsedSeconds: number;
  formatTime: (s: number) => string;
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Timer + stage dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {room.stages.map((_, i) => (
            <div key={i} style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: i < stageIndex ? "#4ECDC4" : i === stageIndex ? tc.primary : "rgba(255,255,255,0.1)",
              border: i === stageIndex ? `2px solid ${tc.primary}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 800, color: i <= stageIndex ? "#0a0a1a" : "rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
            }}>
              {i < stageIndex ? "✓" : i + 1}
            </div>
          ))}
        </div>
        <div style={{
          padding: "6px 14px", borderRadius: "20px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          fontSize: "14px", fontWeight: 800, color: "rgba(255,255,255,0.8)",
          fontVariantNumeric: "tabular-nums",
        }}>
          ⏱️ {formatTime(elapsedSeconds)}
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "99px" }}>
        <div style={{
          height: "100%", borderRadius: "99px",
          background: `linear-gradient(90deg, ${tc.primary}, ${tc.primary}99)`,
          width: `${(stageIndex / room.stages.length) * 100}%`,
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}
