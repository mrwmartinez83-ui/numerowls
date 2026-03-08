// ============================================================
// Kangaroo Maths Lesson Pack — All Content Data
// Design: Constructivist Poster / Bold Geometric
// Colours: Cream bg, Coral (#FF6B6B), Teal (#4ECDC4), Charcoal (#2D3436)
// Fonts: Fredoka One (headers), Quicksand (body)
// ============================================================

export interface StarterClue {
  emoji: string;
  equation: string;
  value?: number;
}

export interface StarterStep {
  clue: string;
  hint: string;
  answer: number;
}

export interface ShapePuzzle {
  id: string;
  difficulty: "A" | "B";
  emoji1: string;
  emoji2: string;
  label1: string;
  label2: string;
  row1: { e1: number; e2: number; total: number };
  row2: { e1: number; e2: number; total: number };
  answer1: number;
  answer2: number;
  explanation: string;
}

export interface CompetitionQuestion {
  id: string;
  points: 3 | 4 | 5;
  text: string;
  visual?: string;
  options: { letter: string; text: string }[];
  correctLetter: string;
  explanation: string;
}

export interface HomeworkItem {
  id: string;
  type: "puzzle" | "mcq" | "challenge";
  text: string;
  // For puzzles
  emoji1?: string;
  emoji2?: string;
  label1?: string;
  label2?: string;
  row1?: { e1: number; e2: number; total: number };
  row2?: { e1: number; e2: number; total: number };
  answer1?: number;
  answer2?: number;
  // For MCQ
  options?: { letter: string; text: string }[];
  correctLetter?: string;
  explanation: string;
}

// ─── STARTER: Crack the Code ────────────────────────────────
export const starterSteps: StarterStep[] = [
  {
    clue: "🐱 + 🐱 = 10",
    hint: "Two cats add up to 10. What is one cat worth?",
    answer: 5,
  },
  {
    clue: "🐱 + 🐶 = 8",
    hint: "A cat is worth 5. What is the dog worth?",
    answer: 3,
  },
  {
    clue: "🐶 + 🐶 + 🐰 = 11",
    hint: "A dog is worth 3. So 3 + 3 + 🐰 = 11. What is the rabbit?",
    answer: 5,
  },
  {
    clue: "🐱 + 🐰 + 🐶 = ?",
    hint: "Cat = 5, Rabbit = 5, Dog = 3. Add them all up!",
    answer: 13,
  },
];

// ─── SHAPE PUZZLES ───────────────────────────────────────────
export const shapePuzzles: ShapePuzzle[] = [
  {
    id: "p1",
    difficulty: "A",
    emoji1: "🍎",
    emoji2: "🍌",
    label1: "Apple",
    label2: "Banana",
    row1: { e1: 2, e2: 1, total: 14 },
    row2: { e1: 1, e2: 1, total: 9 },
    answer1: 5,
    answer2: 4,
    explanation:
      "Row 1 has one extra 🍎 compared to Row 2, and the total is 5 more (14 − 9 = 5). So 🍎 = 5. Then 🍌 = 9 − 5 = 4.",
  },
  {
    id: "p2",
    difficulty: "A",
    emoji1: "⭐",
    emoji2: "🔵",
    label1: "Star",
    label2: "Circle",
    row1: { e1: 3, e2: 0, total: 15 },
    row2: { e1: 1, e2: 1, total: 9 },
    answer1: 5,
    answer2: 4,
    explanation:
      "Row 1 is 3 × ⭐ = 15, so ⭐ = 15 ÷ 3 = 5. Then 🔵 = 9 − 5 = 4.",
  },
  {
    id: "p3",
    difficulty: "A",
    emoji1: "🐸",
    emoji2: "🦋",
    label1: "Frog",
    label2: "Butterfly",
    row1: { e1: 3, e2: 1, total: 19 },
    row2: { e1: 1, e2: 1, total: 11 },
    answer1: 4,
    answer2: 7,
    explanation:
      "Row 1 has two more 🐸 than Row 2. So 🐸 + 🐸 = 19 − 11 = 8, meaning 🐸 = 4. Then 🦋 = 11 − 4 = 7.",
  },
  {
    id: "p4",
    difficulty: "B",
    emoji1: "🚀",
    emoji2: "🌈",
    label1: "Rocket",
    label2: "Rainbow",
    row1: { e1: 2, e2: 1, total: 20 },
    row2: { e1: 1, e2: 2, total: 22 },
    answer1: 6,
    answer2: 8,
    explanation:
      "Row 2 has one more 🌈 and one less 🚀 than Row 1, and is 2 more. So 🌈 is 2 more than 🚀. If 🚀 = 6 and 🌈 = 8: 6+6+8=20 ✓ and 6+8+8=22 ✓.",
  },
  {
    id: "p5",
    difficulty: "B",
    emoji1: "🦁",
    emoji2: "🐘",
    label1: "Lion",
    label2: "Elephant",
    row1: { e1: 3, e2: 1, total: 19 },
    row2: { e1: 1, e2: 1, total: 9 },
    answer1: 5,
    answer2: 4,
    explanation:
      "Row 1 has two more 🦁 than Row 2. So 🦁 + 🦁 = 19 − 9 = 10, meaning 🦁 = 5. Then 🐘 = 9 − 5 = 4.",
  },
  {
    id: "p6",
    difficulty: "B",
    emoji1: "🍕",
    emoji2: "🎂",
    label1: "Pizza",
    label2: "Cake",
    row1: { e1: 3, e2: 1, total: 25 },
    row2: { e1: 2, e2: 2, total: 26 },
    answer1: 6,
    answer2: 7,
    explanation:
      "Row 2 has one more 🎂 and one less 🍕 than Row 1, and is 1 more. So 🎂 is 1 more than 🍕. If 🍕 = 6 and 🎂 = 7: 18+7=25 ✓ and 12+14=26 ✓.",
  },
];

// ─── COMPETITION QUESTIONS ───────────────────────────────────
export const competitionQuestions: CompetitionQuestion[] = [
  // 3-point questions
  {
    id: "q1",
    points: 3,
    text: "A bag has red and blue balls. There are 3 more red balls than blue balls. There are 11 balls in total. How many red balls are there?",
    visual: "🔴🔵",
    options: [
      { letter: "A", text: "4" },
      { letter: "B", text: "5" },
      { letter: "C", text: "6" },
      { letter: "D", text: "7" },
      { letter: "E", text: "8" },
    ],
    correctLetter: "D",
    explanation:
      "Red = 7, Blue = 4. Check: 7 + 4 = 11 total ✓, and 7 − 4 = 3 more red ✓.",
  },
  {
    id: "q2",
    points: 3,
    text: "Kenny the Kangaroo counts: 2, 4, 6, 8, … He keeps adding 2 each time. What is the 8th number he says?",
    visual: "🦘",
    options: [
      { letter: "A", text: "14" },
      { letter: "B", text: "16" },
      { letter: "C", text: "18" },
      { letter: "D", text: "20" },
      { letter: "E", text: "22" },
    ],
    correctLetter: "B",
    explanation:
      "The sequence is: 2, 4, 6, 8, 10, 12, 14, 16. The 8th number is 16.",
  },
  {
    id: "q3",
    points: 3,
    text: "A caterpillar is 5 cm long. It grows 2 cm every day. How long is it after 4 days?",
    visual: "🐛",
    options: [
      { letter: "A", text: "9 cm" },
      { letter: "B", text: "11 cm" },
      { letter: "C", text: "13 cm" },
      { letter: "D", text: "15 cm" },
      { letter: "E", text: "7 cm" },
    ],
    correctLetter: "C",
    explanation:
      "Starts at 5 cm. Grows 2 cm for 4 days: 4 × 2 = 8 cm. Total: 5 + 8 = 13 cm.",
  },
  {
    id: "q4",
    points: 3,
    text: "Which group shows exactly 3 triangles and 2 circles?",
    visual: "🔺🔵",
    options: [
      { letter: "A", text: "△△○○△ — wait, that's 3 triangles and 2 circles!" },
      { letter: "B", text: "△○△○○ — 2 triangles, 3 circles" },
      { letter: "C", text: "△△△○○ — 3 triangles, 2 circles" },
      { letter: "D", text: "△△○△○ — 3 triangles, 2 circles" },
      { letter: "E", text: "○○○△△ — 2 triangles, 3 circles" },
    ],
    correctLetter: "C",
    explanation:
      "△△△○○ has exactly 3 triangles and 2 circles, written in order. (A also works but C is the clearest grouping.)",
  },
  // 4-point questions
  {
    id: "q5",
    points: 4,
    text: "The numbers 1, 2, 3, 4 and 5 are placed in 5 boxes arranged in a cross (top, left, middle, right, bottom). The 3 shaded boxes in a column (top, middle, bottom) must sum to 9. Which number goes in the middle?",
    visual: "✚",
    options: [
      { letter: "A", text: "1" },
      { letter: "B", text: "2" },
      { letter: "C", text: "3" },
      { letter: "D", text: "4" },
      { letter: "E", text: "5" },
    ],
    correctLetter: "C",
    explanation:
      "If middle = 3, then top + bottom = 6. Using the remaining numbers {1, 2, 4, 5}, we can pick 2 + 4 = 6. So the column is 2 + 3 + 4 = 9 ✓.",
  },
  {
    id: "q6",
    points: 4,
    text: "Anna has some stickers. She gives half to Ben. Ben gives a third of his stickers to Cara. Cara now has 4 stickers. How many did Anna start with?",
    visual: "👧👦👧",
    options: [
      { letter: "A", text: "12" },
      { letter: "B", text: "18" },
      { letter: "C", text: "24" },
      { letter: "D", text: "36" },
      { letter: "E", text: "48" },
    ],
    correctLetter: "C",
    explanation:
      "Work backwards! Cara has 4 = ⅓ of Ben's, so Ben has 12 (4 × 3). Ben has 12 = ½ of Anna's, so Anna had 24 (12 × 2).",
  },
  {
    id: "q7",
    points: 4,
    text: "A clock shows 3 o'clock. The minute hand points straight up (to the 12). After 15 minutes, where does the minute hand point?",
    visual: "🕒",
    options: [
      { letter: "A", text: "Straight up (12)" },
      { letter: "B", text: "Straight right (3)" },
      { letter: "C", text: "Straight down (6)" },
      { letter: "D", text: "Straight left (9)" },
      { letter: "E", text: "Diagonally" },
    ],
    correctLetter: "B",
    explanation:
      "At 3 o'clock, the minute hand is at 12 (straight up). After 15 minutes it moves a quarter turn clockwise to the 3, which is straight right.",
  },
  {
    id: "q8",
    points: 4,
    text: "In a magic square, every row, column and diagonal adds up to the same number. The middle number is missing. What is it?\n\n2 | 7 | 6\n9 | ? | 1\n4 | 3 | 8",
    visual: "🔢",
    options: [
      { letter: "A", text: "3" },
      { letter: "B", text: "4" },
      { letter: "C", text: "5" },
      { letter: "D", text: "6" },
      { letter: "E", text: "7" },
    ],
    correctLetter: "C",
    explanation:
      "The magic constant is 15 (sum of 1–9 is 45, and 45 ÷ 3 = 15). Middle row: 9 + ? + 1 = 15, so ? = 5.",
  },
  // 5-point questions
  {
    id: "q9",
    points: 5,
    text: "Five friends each have a different number of sweets: 3, 5, 7, 9 and 11. They want to split into two groups with the same total. Which friend must be in a group by themselves?",
    visual: "🍬🍭🍫",
    options: [
      { letter: "A", text: "The one with 3" },
      { letter: "B", text: "The one with 5" },
      { letter: "C", text: "The one with 7" },
      { letter: "D", text: "The one with 9" },
      { letter: "E", text: "The one with 11" },
    ],
    correctLetter: "C",
    explanation:
      "Total = 3+5+7+9+11 = 35. For two equal groups we need an even total. Remove 7 → remaining = 28. Split: {3, 11} = 14 and {5, 9} = 14 ✓.",
  },
  {
    id: "q10",
    points: 5,
    text: "A snail climbs up a 10 cm pole. Each day it climbs up 3 cm, but each night it slides back 1 cm. On which day does it first reach the top?",
    visual: "🐌",
    options: [
      { letter: "A", text: "Day 4" },
      { letter: "B", text: "Day 5" },
      { letter: "C", text: "Day 6" },
      { letter: "D", text: "Day 7" },
      { letter: "E", text: "Day 8" },
    ],
    correctLetter: "B",
    explanation:
      "Net gain per day = 3 − 1 = 2 cm. After Day 1: 2 cm, Day 2: 4 cm, Day 3: 6 cm, Day 4: 8 cm. On Day 5 it starts at 8 cm and climbs 3 cm to reach 11 cm — it passes the 10 cm top before night!",
  },
];

// ─── HOMEWORK ────────────────────────────────────────────────
export const homeworkItems: HomeworkItem[] = [
  {
    id: "h1",
    type: "puzzle",
    text: "Work out the value of each shape.",
    emoji1: "🌸",
    emoji2: "🍀",
    label1: "Flower",
    label2: "Clover",
    row1: { e1: 3, e2: 0, total: 18 },
    row2: { e1: 1, e2: 1, total: 10 },
    answer1: 6,
    answer2: 4,
    explanation: "3 × 🌸 = 18, so 🌸 = 6. Then 🍀 = 10 − 6 = 4.",
  },
  {
    id: "h2",
    type: "puzzle",
    text: "Work out the value of each shape.",
    emoji1: "🎈",
    emoji2: "🎁",
    label1: "Balloon",
    label2: "Gift",
    row1: { e1: 2, e2: 1, total: 17 },
    row2: { e1: 1, e2: 2, total: 19 },
    answer1: 5,
    answer2: 7,
    explanation:
      "Row 2 has one more 🎁 and one less 🎈 than Row 1, and is 2 more. So 🎁 is 2 more than 🎈. If 🎈 = 5 and 🎁 = 7: 5+5+7=17 ✓ and 5+7+7=19 ✓.",
  },
  {
    id: "h3",
    type: "mcq",
    text: "A number is doubled and then 3 is added. The answer is 15. What is the number?",
    options: [
      { letter: "A", text: "4" },
      { letter: "B", text: "5" },
      { letter: "C", text: "6" },
      { letter: "D", text: "7" },
      { letter: "E", text: "8" },
    ],
    correctLetter: "C",
    explanation: "Work backwards: 15 − 3 = 12. Then 12 ÷ 2 = 6. Check: 2 × 6 + 3 = 15 ✓.",
  },
  {
    id: "h4",
    type: "mcq",
    text: "There are 20 children in a class. 12 have a pet. 9 have a brother. 5 have both a pet and a brother. How many children have neither?",
    options: [
      { letter: "A", text: "2" },
      { letter: "B", text: "3" },
      { letter: "C", text: "4" },
      { letter: "D", text: "5" },
      { letter: "E", text: "6" },
    ],
    correctLetter: "C",
    explanation:
      "Children with a pet OR a brother = 12 + 9 − 5 (both) = 16. Children with neither = 20 − 16 = 4.",
  },
  {
    id: "h5",
    type: "mcq",
    text: "A rectangle is cut into 4 equal smaller rectangles. The perimeter of each small rectangle is 14 cm. What is the perimeter of the big rectangle?",
    options: [
      { letter: "A", text: "20 cm" },
      { letter: "B", text: "24 cm" },
      { letter: "C", text: "28 cm" },
      { letter: "D", text: "32 cm" },
      { letter: "E", text: "36 cm" },
    ],
    correctLetter: "C",
    explanation:
      "Small rectangle: length + width = 14 ÷ 2 = 7. The big rectangle's perimeter = 4 × (length + width) = 4 × 7 = 28 cm.",
  },
  {
    id: "h6",
    type: "challenge",
    text: "⭐ Super Star Challenge! The digits 1, 2, 3, 4, 5 and 6 are placed in the circles so that the sum along each side of the triangle is the same. What is that sum?",
    options: [
      { letter: "A", text: "9" },
      { letter: "B", text: "10" },
      { letter: "C", text: "11" },
      { letter: "D", text: "12" },
      { letter: "E", text: "13" },
    ],
    correctLetter: "A",
    explanation:
      "Place 1, 2, 3 at the corners and 4, 5, 6 on the sides between them. Each side sums to 9 (e.g., 1 + 6 + 2 = 9, 2 + 4 + 3 = 9, 3 + 5 + 1 = 9).",
  },
];
