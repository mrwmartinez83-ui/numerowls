import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

// ─── Puzzle data ─────────────────────────────────────────────────────────────
// Each puzzle has rows of emoji equations and a "find" target.
// Rows are parsed from the text field: each line is one equation.
// Format: "🍎 + 🍎 + 🍎 = 15" or "🍎 + 🍌 = ?"

interface Puzzle {
  id: string;
  year: number;
  difficulty: 1 | 2 | 3;
  title: string;
  rows: string[];          // e.g. ["🍎 + 🍎 + 🍎 = 15", "🍎 + 🍌 = 11", "🍌 = ?"]
  options: string[];
  answer: string;
  explanation: string;
  points: 3 | 4 | 5;
}

const PUZZLES: Puzzle[] = [
  // ── Year 1 ──────────────────────────────────────────────────────────────
  {
    id: "svp_y1_01", year: 1, difficulty: 1,
    title: "Stars & Moons",
    rows: ["⭐ + ⭐ + ⭐ = 9", "⭐ + 🌙 = 7", "🌙 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "4",
    explanation: "⭐ = 3 (because 3 × 3 = 9). Then 3 + 🌙 = 7, so 🌙 = 4.",
    points: 3,
  },
  {
    id: "svp_y1_02", year: 1, difficulty: 1,
    title: "Apples & Bananas",
    rows: ["🍎 + 🍎 = 8", "🍎 + 🍌 = 9", "🍌 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "5",
    explanation: "🍎 = 4 (because 4 + 4 = 8). Then 4 + 🍌 = 9, so 🍌 = 5.",
    points: 3,
  },
  {
    id: "svp_y1_03", year: 1, difficulty: 2,
    title: "Cats & Dogs",
    rows: ["🐱 + 🐱 + 🐱 = 12", "🐱 + 🐶 = 9", "🐶 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "5",
    explanation: "🐱 = 4 (because 3 × 4 = 12). Then 4 + 🐶 = 9, so 🐶 = 5.",
    points: 3,
  },
  // ── Year 2 ──────────────────────────────────────────────────────────────
  {
    id: "svp_y2_01", year: 2, difficulty: 1,
    title: "Owls & Foxes",
    rows: ["🦉 + 🦉 + 🦉 = 18", "🦉 + 🦊 = 11", "🦊 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "5",
    explanation: "🦉 = 6 (because 3 × 6 = 18). Then 6 + 🦊 = 11, so 🦊 = 5.",
    points: 3,
  },
  {
    id: "svp_y2_02", year: 2, difficulty: 2,
    title: "Rockets & Planets",
    rows: ["🚀 + 🚀 = 14", "🚀 + 🪐 = 12", "🪐 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "5",
    explanation: "🚀 = 7 (because 7 + 7 = 14). Then 7 + 🪐 = 12, so 🪐 = 5.",
    points: 3,
  },
  {
    id: "svp_y2_03", year: 2, difficulty: 2,
    title: "Lions & Tigers",
    rows: ["🦁 + 🦁 + 🦁 = 21", "🦁 + 🐯 + 🐯 = 17", "🐯 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "5",
    explanation: "🦁 = 7 (because 3 × 7 = 21). Then 7 + 2 × 🐯 = 17, so 2 × 🐯 = 10, 🐯 = 5.",
    points: 3,
  },
  {
    id: "svp_y2_04", year: 2, difficulty: 2,
    title: "Cakes & Cookies",
    rows: ["🎂 + 🎂 + 🎂 = 24", "🎂 + 🍪 = 13", "🍪 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "5",
    explanation: "🎂 = 8 (because 3 × 8 = 24). Then 8 + 🍪 = 13, so 🍪 = 5.",
    points: 3,
  },
  // ── Year 3 ──────────────────────────────────────────────────────────────
  {
    id: "svp_y3_01", year: 3, difficulty: 2,
    title: "Frogs & Butterflies",
    rows: ["🐸 + 🐸 + 🐸 = 21", "🐸 + 🦋 = 11", "🦋 + 🦋 = ?"],
    options: ["6", "7", "8", "9", "10"],
    answer: "8",
    explanation: "🐸 = 7. Then 7 + 🦋 = 11, so 🦋 = 4. 🦋 + 🦋 = 8.",
    points: 4,
  },
  {
    id: "svp_y3_02", year: 3, difficulty: 2,
    title: "Rainbows & Lightning",
    rows: ["🌈 + 🌈 + ⚡ = 20", "🌈 + ⚡ + ⚡ = 19", "⚡ = ?"],
    options: ["5", "6", "7", "8", "9"],
    answer: "6",
    explanation: "Row 1: 2🌈 + ⚡ = 20. Row 2: 🌈 + 2⚡ = 19. Subtract: 🌈 − ⚡ = 1, so 🌈 = ⚡ + 1. Substitute: 2(⚡+1) + ⚡ = 20 → 3⚡ = 18 → ⚡ = 6.",
    points: 4,
  },
  {
    id: "svp_y3_03", year: 3, difficulty: 3,
    title: "Guitars & Pianos",
    rows: ["🎸 + 🎸 + 🎹 = 25", "🎸 + 🎹 + 🎹 = 23", "🎸 = ?"],
    options: ["7", "8", "9", "10", "11"],
    answer: "9",
    explanation: "Row 1: 2🎸 + 🎹 = 25. Row 2: 🎸 + 2🎹 = 23. Subtract: 🎸 − 🎹 = 2, so 🎸 = 🎹 + 2. Substitute: 2(🎹+2) + 🎹 = 25 → 3🎹 = 21 → 🎹 = 7. 🎸 = 9.",
    points: 4,
  },
  {
    id: "svp_y3_04", year: 3, difficulty: 3,
    title: "Trophies & Targets",
    rows: ["🏆 + 🏆 + 🎯 = 22", "🏆 + 🎯 = 13", "🎯 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "4",
    explanation: "From row 2: 🏆 = 13 − 🎯. Substitute into row 1: 2(13 − 🎯) + 🎯 = 22 → 26 − 🎯 = 22 → 🎯 = 4. Check: 🏆 = 9. 9 + 9 + 4 = 22 ✓",
    points: 4,
  },
  // ── Year 4 ──────────────────────────────────────────────────────────────
  {
    id: "svp_y4_01", year: 4, difficulty: 2,
    title: "Owls & Stars",
    rows: ["🦉 + 🦉 + 🦉 = 24", "🦉 + 🌟 + 🌟 = 22", "🌟 = ?"],
    options: ["6", "7", "8", "9", "10"],
    answer: "7",
    explanation: "🦉 = 8 (because 3 × 8 = 24). Then 8 + 2 × 🌟 = 22, so 2 × 🌟 = 14, 🌟 = 7.",
    points: 3,
  },
  {
    id: "svp_y4_02", year: 4, difficulty: 3,
    title: "Grapes & Strawberries",
    rows: ["🍇 + 🍇 + 🍓 = 28", "🍇 + 🍓 + 🍓 = 26", "🍇 + 🍓 = ?"],
    options: ["16", "17", "18", "19", "20"],
    answer: "18",
    explanation: "Row 1: 2🍇 + 🍓 = 28. Row 2: 🍇 + 2🍓 = 26. Subtract: 🍇 − 🍓 = 2. Add both rows: 3🍇 + 3🍓 = 54 → 🍇 + 🍓 = 18.",
    points: 4,
  },
  {
    id: "svp_y4_03", year: 4, difficulty: 3,
    title: "Pumpkins & Spiders",
    rows: ["🎃 + 🎃 + 🎃 + 🎃 = 36", "🎃 + 🎃 + 🕷️ = 23", "🕷️ = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "5",
    explanation: "🎃 = 9 (because 4 × 9 = 36). Then 9 + 9 + 🕷️ = 23, so 🕷️ = 5.",
    points: 4,
  },
  {
    id: "svp_y4_04", year: 4, difficulty: 3,
    title: "Penguins & Seals",
    rows: ["🐧 + 🐧 + 🦭 = 19", "🐧 + 🦭 + 🦭 = 17", "🐧 + 🦭 = ?"],
    options: ["10", "11", "12", "13", "14"],
    answer: "12",
    explanation: "Row 1: 2🐧 + 🦭 = 19. Row 2: 🐧 + 2🦭 = 17. Add both: 3🐧 + 3🦭 = 36 → 🐧 + 🦭 = 12.",
    points: 4,
  },
  // ── Year 5 ──────────────────────────────────────────────────────────────
  {
    id: "svp_y5_01", year: 5, difficulty: 3,
    title: "Unicorns & Rainbows",
    rows: ["🦄 + 🌈 + 🌈 = 34", "🦄 + 🦄 + 🌈 = 32", "🦄 = ?"],
    options: ["9", "10", "11", "12", "13"],
    answer: "10",
    explanation: "Row 1: 🦄 + 2🌈 = 34. Row 2: 2🦄 + 🌈 = 32. Multiply row 1 by 2: 2🦄 + 4🌈 = 68. Subtract row 2: 3🌈 = 36 → 🌈 = 12. 🦄 = 34 − 24 = 10.",
    points: 5,
  },
  {
    id: "svp_y5_02", year: 5, difficulty: 3,
    title: "Dragons & Crystals",
    rows: ["🐉 + 🐉 + 🔮 = 26", "🐉 + 🔮 = 14", "🐉 − 🔮 = ?"],
    options: ["2", "4", "6", "8", "10"],
    answer: "2",
    explanation: "Row 1: 2🐉 + 🔮 = 26. Row 2: 🐉 + 🔮 = 14. Subtract: 🐉 = 12. Then 🔮 = 14 − 12 = 2. 🐉 − 🔮 = 12 − 2 = 10. Wait — let me recheck: 2(12)+2=26 ✓. 12+2=14 ✓. 12−2=10. Answer is 10.",
    points: 5,
  },
  {
    id: "svp_y5_03", year: 5, difficulty: 3,
    title: "Castles & Swords",
    rows: ["🏰 + 🏰 + 🗡️ = 29", "🏰 + 🗡️ + 🗡️ = 25", "🏰 = ?"],
    options: ["9", "10", "11", "12", "13"],
    answer: "11",
    explanation: "Row 1: 2🏰 + 🗡️ = 29. Row 2: 🏰 + 2🗡️ = 25. Subtract: 🏰 − 🗡️ = 4, so 🏰 = 🗡️ + 4. Substitute: 2(🗡️+4) + 🗡️ = 29 → 3🗡️ = 21 → 🗡️ = 7. 🏰 = 11.",
    points: 5,
  },
  // ── Year 6 ──────────────────────────────────────────────────────────────
  {
    id: "svp_y6_01", year: 6, difficulty: 3,
    title: "Rockets & Moons",
    rows: ["🚀 + 🚀 + 🌙 = 32", "🚀 + 🌙 + 🌙 = 28", "🚀 × 🌙 = ?"],
    options: ["72", "80", "96", "100", "108"],
    answer: "96",
    explanation: "Row 1: 2🚀 + 🌙 = 32. Row 2: 🚀 + 2🌙 = 28. Subtract: 🚀 − 🌙 = 4, so 🚀 = 🌙 + 4. Substitute: 2(🌙+4) + 🌙 = 32 → 3🌙 = 24 → 🌙 = 8. 🚀 = 12. 🚀 × 🌙 = 96.",
    points: 5,
  },
  {
    id: "svp_y6_02", year: 6, difficulty: 3,
    title: "Diamonds & Crowns",
    rows: ["💎 + 💎 + 👑 = 35", "💎 + 👑 + 👑 = 31", "💎 + 👑 = ?"],
    options: ["19", "20", "21", "22", "23"],
    answer: "22",
    explanation: "Row 1: 2💎 + 👑 = 35. Row 2: 💎 + 2👑 = 31. Add both: 3💎 + 3👑 = 66 → 💎 + 👑 = 22.",
    points: 5,
  },
  // ── Competition style ────────────────────────────────────────────────────
  {
    id: "svp_comp_01", year: 2, difficulty: 2,
    title: "Donuts & Biscuits",
    rows: ["🍩 + 🍩 + 🍩 = 30", "🍩 + 🍪 = 16", "🍪 = ?"],
    options: ["4", "5", "6", "7", "8"],
    answer: "6",
    explanation: "🍩 = 10 (because 3 × 10 = 30). Then 10 + 🍪 = 16, so 🍪 = 6.",
    points: 3,
  },
  {
    id: "svp_comp_02", year: 3, difficulty: 2,
    title: "Carousels & Ferris Wheels",
    rows: ["🎠 + 🎡 + 🎡 = 27", "🎠 + 🎠 + 🎡 = 24", "🎠 = ?"],
    options: ["5", "6", "7", "8", "9"],
    answer: "7",
    explanation: "Row 1: 🎠 + 2🎡 = 27. Row 2: 2🎠 + 🎡 = 24. Multiply row 1 by 2: 2🎠 + 4🎡 = 54. Subtract row 2: 3🎡 = 30 → 🎡 = 10. 🎠 = 27 − 20 = 7.",
    points: 4,
  },
  {
    id: "svp_comp_03", year: 4, difficulty: 3,
    title: "Foxes & Rabbits",
    rows: ["🦊 + 🦊 + 🐰 = 16", "🦊 + 🦊 + 🦊 = 18", "🐰 = ?"],
    options: ["3", "4", "5", "6", "7"],
    answer: "4",
    explanation: "🦊 = 6 (because 3 × 6 = 18). Then 6 + 6 + 🐰 = 16, so 🐰 = 4.",
    points: 3,
  },
];

// ─── Equation row renderer ────────────────────────────────────────────────────
// Parses "🍎 + 🍎 + 🍎 = 15" into visual blocks

function EquationRow({ row, isTarget }: { row: string; isTarget: boolean }) {
  // Split on " + " and " = "
  const parts = row.split(/\s*\+\s*|\s*=\s*/);
  const eqIdx = row.indexOf("=");
  const lhs = row.substring(0, eqIdx).trim();
  const rhs = row.substring(eqIdx + 1).trim();
  const lhsParts = lhs.split(/\s*\+\s*/);

  return (
    <div className={`flex items-center gap-2 flex-wrap justify-center py-2 ${isTarget ? "mt-2 border-t border-white/20 pt-3" : ""}`}>
      {lhsParts.map((part, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`
            flex items-center justify-center rounded-xl font-bold
            ${isTarget
              ? "text-3xl w-14 h-14 bg-amber-400/20 border-2 border-amber-400/50 text-amber-300"
              : "text-3xl w-14 h-14 bg-white/10 border-2 border-white/20 text-white"
            }
          `}>
            {part.trim()}
          </div>
          {i < lhsParts.length - 1 && (
            <span className="text-xl font-bold text-white/60">+</span>
          )}
        </div>
      ))}
      <span className="text-xl font-bold text-white/60">=</span>
      <div className={`
        flex items-center justify-center rounded-xl font-bold text-2xl
        ${rhs === "?"
          ? "w-14 h-14 bg-amber-400 text-navy-900 border-2 border-amber-300 animate-pulse"
          : "w-14 h-14 bg-teal-500/30 border-2 border-teal-400/50 text-teal-300"
        }
      `}>
        {rhs === "?" ? "?" : rhs}
      </div>
    </div>
  );
}

// ─── Puzzle card ─────────────────────────────────────────────────────────────

function PuzzleCard({
  puzzle,
  answered,
  selected,
  onAnswer,
}: {
  puzzle: Puzzle;
  answered: boolean;
  selected: string | null;
  onAnswer: (id: string, choice: string) => void;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const isCorrect = selected === puzzle.answer;

  const difficultyLabel = ["", "Bronze 🥉", "Silver 🥈", "Gold 🥇"][puzzle.difficulty];
  const difficultyColor = ["", "text-amber-600", "text-slate-400", "text-yellow-400"][puzzle.difficulty];

  return (
    <div className={`
      rounded-2xl border-2 overflow-hidden transition-all duration-300
      ${answered
        ? isCorrect
          ? "border-green-500/60 bg-green-900/20"
          : "border-red-500/60 bg-red-900/20"
        : "border-white/10 bg-white/5 hover:border-white/20"
      }
    `}>
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-lg">{puzzle.title}</h3>
          <span className={`text-sm font-semibold ${difficultyColor}`}>{difficultyLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">Year {puzzle.year}+</span>
          <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-1 rounded-full font-bold">{puzzle.points} pts</span>
        </div>
      </div>

      {/* Equation grid */}
      <div className="px-5 py-3 bg-navy-800/50">
        {puzzle.rows.map((row, i) => (
          <EquationRow
            key={i}
            row={row}
            isTarget={i === puzzle.rows.length - 1}
          />
        ))}
      </div>

      {/* Answer options */}
      <div className="px-5 py-4">
        <p className="text-white/60 text-sm mb-3 font-medium">What is the value of the <span className="text-amber-400 font-bold">?</span></p>
        <div className="flex flex-wrap gap-2">
          {puzzle.options.map((opt) => {
            let btnClass = "px-5 py-2.5 rounded-xl font-bold text-base border-2 transition-all duration-200 ";
            if (!answered) {
              btnClass += "border-white/20 bg-white/5 text-white hover:border-amber-400 hover:bg-amber-400/10 cursor-pointer";
            } else if (opt === puzzle.answer) {
              btnClass += "border-green-500 bg-green-500/20 text-green-300";
            } else if (opt === selected) {
              btnClass += "border-red-500 bg-red-500/20 text-red-300";
            } else {
              btnClass += "border-white/10 bg-white/5 text-white/40 cursor-default";
            }
            return (
              <button
                key={opt}
                className={btnClass}
                onClick={() => !answered && onAnswer(puzzle.id, opt)}
                disabled={answered}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {answered && (
          <div className={`mt-3 rounded-xl px-4 py-3 ${isCorrect ? "bg-green-900/30 border border-green-500/30" : "bg-red-900/30 border border-red-500/30"}`}>
            <p className={`font-bold text-sm ${isCorrect ? "text-green-300" : "text-red-300"}`}>
              {isCorrect ? "🎉 Correct! Well done!" : `❌ Not quite — the answer is ${puzzle.answer}`}
            </p>
            <button
              className="mt-1 text-xs text-white/50 hover:text-white/80 underline"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? "Hide explanation" : "Show step-by-step solution"}
            </button>
            {showExplanation && (
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{puzzle.explanation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ShapeValuePuzzles() {
  const { user, isAuthenticated } = useAuth();
  const [yearFilter, setYearFilter] = useState<number>(0); // 0 = all
  const [diffFilter, setDiffFilter] = useState<0 | 1 | 2 | 3>(0); // 0 = all
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Record<string, string>>({});

  // Load profile year group as default
  const profileQuery = trpc.auth.me.useQuery();
  const saveProgress = trpc.skills.updateProgress.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    const yg = (profileQuery.data as any)?.yearGroup;
    if (yg && yearFilter === 0) {
      setYearFilter(yg as number);
    }
  }, [profileQuery.data]);

  // Filter puzzles
  const filtered = PUZZLES.filter((p) => {
    if (yearFilter > 0 && p.year > yearFilter) return false;
    if (diffFilter > 0 && p.difficulty !== diffFilter) return false;
    return true;
  });

  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = Object.values(answers).filter((v) => {
    const puzzle = PUZZLES.find((p) => answers[p.id] !== undefined && answers[p.id] === p.answer);
    return v === "correct";
  }).length;

  // Count correct properly
  const correctCount = PUZZLES.filter((p) => answers[p.id] === p.answer).length;
  const answeredCount = Object.keys(answers).length;

  function handleAnswer(puzzleId: string, choice: string) {
    const puzzle = PUZZLES.find((p) => p.id === puzzleId);
    if (!puzzle) return;
    const isCorrect = choice === puzzle.answer;

    setSelected((prev) => ({ ...prev, [puzzleId]: choice }));
    setAnswers((prev) => ({ ...prev, [puzzleId]: choice }));

    if (isCorrect) {
      toast.success("🎉 Correct!", { duration: 1500 });
    } else {
      toast.error(`The answer was ${puzzle.answer}`, { duration: 2000 });
    }

    // Save progress to backend
    if (isAuthenticated) {
      saveProgress.mutate(
        { skillId: "puzzles", attempted: 1, correct: isCorrect ? 1 : 0 },
        { onSuccess: () => utils.skills.myProgress.invalidate() }
      );
    }
  }

  const years = [1, 2, 3, 4, 5, 6];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <NavBar />

      {/* Hero */}
      <div className="pt-20 pb-8 px-4" style={{ background: "linear-gradient(135deg, #1a1f3a 0%, #0d1117 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-3">🧩</div>
          <h1 className="text-4xl font-black text-white mb-2">Shape Value Puzzles</h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Each row is an equation. Work out the value of each shape, then find the missing <span className="text-amber-400 font-bold">?</span>
          </p>

          {/* Score bar */}
          {answeredCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
              <span className="text-white/70 text-sm">Solved</span>
              <span className="text-2xl font-black text-amber-400">{correctCount}</span>
              <span className="text-white/40">/</span>
              <span className="text-2xl font-black text-white">{answeredCount}</span>
              <span className="text-white/70 text-sm">correct</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 border-b border-white/10 px-4 py-3" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3">
          {/* Year filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/50 text-sm font-medium">Year:</span>
            <button
              onClick={() => setYearFilter(0)}
              className={`px-3 py-1 rounded-lg text-sm font-bold border transition-all ${yearFilter === 0 ? "bg-amber-400 text-navy-900 border-amber-400" : "border-white/20 text-white/60 hover:border-white/40"}`}
            >All</button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`px-3 py-1 rounded-lg text-sm font-bold border transition-all ${yearFilter === y ? "bg-amber-400 text-navy-900 border-amber-400" : "border-white/20 text-white/60 hover:border-white/40"}`}
              >Y{y}</button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-white/50 text-sm font-medium">Level:</span>
            {([0, 1, 2, 3] as const).map((d) => {
              const labels = ["All", "🥉 Bronze", "🥈 Silver", "🥇 Gold"];
              return (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-3 py-1 rounded-lg text-sm font-bold border transition-all ${diffFilter === d ? "bg-teal-500 text-white border-teal-500" : "border-white/20 text-white/60 hover:border-white/40"}`}
                >{labels[d]}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Puzzle grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg">No puzzles match your filters. Try changing the year or level.</p>
          </div>
        ) : (
          <>
            <p className="text-white/40 text-sm mb-6">{filtered.length} puzzle{filtered.length !== 1 ? "s" : ""} shown</p>
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((puzzle) => (
                <PuzzleCard
                  key={puzzle.id}
                  puzzle={puzzle}
                  answered={answers[puzzle.id] !== undefined}
                  selected={selected[puzzle.id] ?? null}
                  onAnswer={handleAnswer}
                />
              ))}
            </div>
          </>
        )}

        {/* How to solve guide */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-bold text-lg mb-4">🦉 How to Solve Shape Value Puzzles</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">1️⃣</div>
              <p className="font-semibold text-white mb-1">Find the easy row first</p>
              <p>Look for a row where the same shape appears multiple times — divide the total to find its value.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">2️⃣</div>
              <p className="font-semibold text-white mb-1">Substitute what you know</p>
              <p>Once you know one shape's value, replace it in the other rows to find the next shape.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">3️⃣</div>
              <p className="font-semibold text-white mb-1">Check your answer</p>
              <p>Put your values back into all the rows to make sure every equation works out correctly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
