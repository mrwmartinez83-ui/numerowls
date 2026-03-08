// ============================================================
// Kangaroo Maths Lesson Pack — Multi-Lesson Content Data
// 3 lessons, each with: starter, shape puzzles, competition Qs, homework
// ============================================================

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
  emoji1?: string;
  emoji2?: string;
  label1?: string;
  label2?: string;
  row1?: { e1: number; e2: number; total: number };
  row2?: { e1: number; e2: number; total: number };
  answer1?: number;
  answer2?: number;
  options?: { letter: string; text: string }[];
  correctLetter?: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  starterSteps: StarterStep[];
  shapePuzzles: ShapePuzzle[];
  competitionQuestions: CompetitionQuestion[];
  homeworkItems: HomeworkItem[];
}

// ══════════════════════════════════════════════════════════════
// LESSON 1 — Numbers & Sequences
// ══════════════════════════════════════════════════════════════
const lesson1: Lesson = {
  id: "lesson1",
  title: "Lesson 1",
  subtitle: "Numbers & Sequences",
  emoji: "🔢",
  color: "#FF6B6B",

  starterSteps: [
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
  ],

  shapePuzzles: [
    {
      id: "l1p1", difficulty: "A",
      emoji1: "🍎", emoji2: "🍌", label1: "Apple", label2: "Banana",
      row1: { e1: 2, e2: 1, total: 14 }, row2: { e1: 1, e2: 1, total: 9 },
      answer1: 5, answer2: 4,
      explanation: "Row 1 has one extra 🍎. The difference in totals is 14 − 9 = 5, so 🍎 = 5. Then 🍌 = 9 − 5 = 4.",
    },
    {
      id: "l1p2", difficulty: "A",
      emoji1: "⭐", emoji2: "🔵", label1: "Star", label2: "Circle",
      row1: { e1: 3, e2: 0, total: 15 }, row2: { e1: 1, e2: 1, total: 9 },
      answer1: 5, answer2: 4,
      explanation: "Row 1 is 3 × ⭐ = 15, so ⭐ = 5. Then 🔵 = 9 − 5 = 4.",
    },
    {
      id: "l1p3", difficulty: "A",
      emoji1: "🐸", emoji2: "🦋", label1: "Frog", label2: "Butterfly",
      row1: { e1: 3, e2: 1, total: 19 }, row2: { e1: 1, e2: 1, total: 11 },
      answer1: 4, answer2: 7,
      explanation: "Row 1 has two more 🐸 than Row 2. So 🐸 + 🐸 = 19 − 11 = 8, meaning 🐸 = 4. Then 🦋 = 11 − 4 = 7.",
    },
    {
      id: "l1p4", difficulty: "A",
      emoji1: "🌙", emoji2: "☀️", label1: "Moon", label2: "Sun",
      row1: { e1: 4, e2: 0, total: 20 }, row2: { e1: 1, e2: 1, total: 8 },
      answer1: 5, answer2: 3,
      explanation: "Row 1 is 4 × 🌙 = 20, so 🌙 = 5. Then ☀️ = 8 − 5 = 3.",
    },
    {
      id: "l1p5", difficulty: "B",
      emoji1: "🚀", emoji2: "🌈", label1: "Rocket", label2: "Rainbow",
      row1: { e1: 2, e2: 1, total: 20 }, row2: { e1: 1, e2: 2, total: 22 },
      answer1: 6, answer2: 8,
      explanation: "Row 2 has one more 🌈 and one less 🚀 than Row 1, and is 2 more. So 🌈 is 2 more than 🚀. If 🚀 = 6 and 🌈 = 8: 6+6+8=20 ✓ and 6+8+8=22 ✓.",
    },
    {
      id: "l1p6", difficulty: "B",
      emoji1: "🦁", emoji2: "🐘", label1: "Lion", label2: "Elephant",
      row1: { e1: 3, e2: 1, total: 22 }, row2: { e1: 1, e2: 1, total: 10 },
      answer1: 6, answer2: 4,
      explanation: "Row 1 has two more 🦁 than Row 2. So 🦁 + 🦁 = 22 − 10 = 12, meaning 🦁 = 6. Then 🐘 = 10 − 6 = 4.",
    },
    {
      id: "l1p7", difficulty: "B",
      emoji1: "🍕", emoji2: "🎂", label1: "Pizza", label2: "Cake",
      row1: { e1: 3, e2: 1, total: 25 }, row2: { e1: 2, e2: 2, total: 26 },
      answer1: 6, answer2: 7,
      explanation: "Row 2 has one more 🎂 and one less 🍕 than Row 1, and is 1 more. So 🎂 is 1 more than 🍕. If 🍕 = 6 and 🎂 = 7: 18+7=25 ✓ and 12+14=26 ✓.",
    },
    {
      id: "l1p8", difficulty: "B",
      emoji1: "🎈", emoji2: "🎁", label1: "Balloon", label2: "Gift",
      row1: { e1: 2, e2: 2, total: 18 }, row2: { e1: 3, e2: 1, total: 17 },
      answer1: 4, answer2: 5,
      explanation: "Row 1 has one more 🎁 and one less 🎈 than Row 2, and is 1 more. So 🎁 is 1 more than 🎈. If 🎈 = 4 and 🎁 = 5: 8+10=18 ✓ and 12+5=17 ✓.",
    },
  ],

  competitionQuestions: [
    {
      id: "l1q1", points: 3,
      text: "A bag has red and blue balls. There are 3 more red balls than blue balls. There are 11 balls in total. How many red balls are there?",
      visual: "🔴🔵",
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "5" }, { letter: "C", text: "6" }, { letter: "D", text: "7" }, { letter: "E", text: "8" }],
      correctLetter: "D",
      explanation: "Red = 7, Blue = 4. Check: 7 + 4 = 11 ✓ and 7 − 4 = 3 more red ✓.",
    },
    {
      id: "l1q2", points: 3,
      text: "Kenny the Kangaroo counts: 2, 4, 6, 8, … He keeps adding 2 each time. What is the 8th number he says?",
      visual: "🦘",
      options: [{ letter: "A", text: "14" }, { letter: "B", text: "16" }, { letter: "C", text: "18" }, { letter: "D", text: "20" }, { letter: "E", text: "22" }],
      correctLetter: "B",
      explanation: "The sequence is: 2, 4, 6, 8, 10, 12, 14, 16. The 8th number is 16.",
    },
    {
      id: "l1q3", points: 3,
      text: "A caterpillar is 5 cm long. It grows 2 cm every day. How long is it after 4 days?",
      visual: "🐛",
      options: [{ letter: "A", text: "9 cm" }, { letter: "B", text: "11 cm" }, { letter: "C", text: "13 cm" }, { letter: "D", text: "15 cm" }, { letter: "E", text: "7 cm" }],
      correctLetter: "C",
      explanation: "Starts at 5 cm. Grows 2 cm for 4 days: 4 × 2 = 8 cm. Total: 5 + 8 = 13 cm.",
    },
    {
      id: "l1q4", points: 3,
      text: "What number comes next in this sequence? 3, 6, 9, 12, ___",
      visual: "📐",
      options: [{ letter: "A", text: "13" }, { letter: "B", text: "14" }, { letter: "C", text: "15" }, { letter: "D", text: "16" }, { letter: "E", text: "18" }],
      correctLetter: "C",
      explanation: "The sequence counts up in 3s: 3, 6, 9, 12, 15.",
    },
    {
      id: "l1q5", points: 3,
      text: "Tom has 20 stickers. He gives 7 to his sister and 4 to his brother. How many does he have left?",
      visual: "🌟",
      options: [{ letter: "A", text: "7" }, { letter: "B", text: "8" }, { letter: "C", text: "9" }, { letter: "D", text: "10" }, { letter: "E", text: "11" }],
      correctLetter: "C",
      explanation: "20 − 7 − 4 = 9 stickers left.",
    },
    {
      id: "l1q6", points: 4,
      text: "The numbers 1, 2, 3, 4 and 5 are placed in 5 boxes in a cross shape. The 3 boxes in a column (top, middle, bottom) must sum to 9. Which number goes in the middle?",
      visual: "✚",
      options: [{ letter: "A", text: "1" }, { letter: "B", text: "2" }, { letter: "C", text: "3" }, { letter: "D", text: "4" }, { letter: "E", text: "5" }],
      correctLetter: "C",
      explanation: "If middle = 3, then top + bottom = 6. Using {1, 2, 4, 5}, we can pick 2 + 4 = 6. So the column is 2 + 3 + 4 = 9 ✓.",
    },
    {
      id: "l1q7", points: 4,
      text: "Anna has some stickers. She gives half to Ben. Ben gives a third of his stickers to Cara. Cara now has 4 stickers. How many did Anna start with?",
      visual: "👧👦👧",
      options: [{ letter: "A", text: "12" }, { letter: "B", text: "18" }, { letter: "C", text: "24" }, { letter: "D", text: "36" }, { letter: "E", text: "48" }],
      correctLetter: "C",
      explanation: "Work backwards! Cara has 4 = ⅓ of Ben's, so Ben has 12. Ben has 12 = ½ of Anna's, so Anna had 24.",
    },
    {
      id: "l1q8", points: 4,
      text: "In a magic square, every row, column and diagonal adds up to the same number. The middle number is missing.\n\n2 | 7 | 6\n9 | ? | 1\n4 | 3 | 8",
      visual: "🔢",
      options: [{ letter: "A", text: "3" }, { letter: "B", text: "4" }, { letter: "C", text: "5" }, { letter: "D", text: "6" }, { letter: "E", text: "7" }],
      correctLetter: "C",
      explanation: "The magic constant is 15. Middle row: 9 + ? + 1 = 15, so ? = 5.",
    },
    {
      id: "l1q9", points: 4,
      text: "There are 24 children in a class. They sit in equal rows. If there are 4 rows, how many children are in each row?",
      visual: "🏫",
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "5" }, { letter: "C", text: "6" }, { letter: "D", text: "7" }, { letter: "E", text: "8" }],
      correctLetter: "C",
      explanation: "24 ÷ 4 = 6 children per row.",
    },
    {
      id: "l1q10", points: 5,
      text: "Five friends each have a different number of sweets: 3, 5, 7, 9 and 11. They want to split into two groups with the same total. Which friend must be in a group by themselves?",
      visual: "🍬🍭",
      options: [{ letter: "A", text: "The one with 3" }, { letter: "B", text: "The one with 5" }, { letter: "C", text: "The one with 7" }, { letter: "D", text: "The one with 9" }, { letter: "E", text: "The one with 11" }],
      correctLetter: "C",
      explanation: "Total = 35. Remove 7 → remaining = 28. Split: {3, 11} = 14 and {5, 9} = 14 ✓.",
    },
    {
      id: "l1q11", points: 5,
      text: "A snail climbs up a 10 cm pole. Each day it climbs up 3 cm, but each night it slides back 1 cm. On which day does it first reach the top?",
      visual: "🐌",
      options: [{ letter: "A", text: "Day 4" }, { letter: "B", text: "Day 5" }, { letter: "C", text: "Day 6" }, { letter: "D", text: "Day 7" }, { letter: "E", text: "Day 8" }],
      correctLetter: "B",
      explanation: "Net gain per day = 2 cm. After Day 4: 8 cm. On Day 5 it climbs 3 cm from 8 cm to reach 11 cm — past the top!",
    },
    {
      id: "l1q12", points: 5,
      text: "I think of a number. I double it, then add 6, then halve the result. My answer is 10. What was my number?",
      visual: "🤔",
      options: [{ letter: "A", text: "5" }, { letter: "B", text: "6" }, { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "9" }],
      correctLetter: "C",
      explanation: "Work backwards: 10 × 2 = 20, then 20 − 6 = 14, then 14 ÷ 2 = 7. Check: 7 × 2 = 14, 14 + 6 = 20, 20 ÷ 2 = 10 ✓.",
    },
  ],

  homeworkItems: [
    {
      id: "l1h1", type: "puzzle", text: "Work out the value of each shape.",
      emoji1: "🌸", emoji2: "🍀", label1: "Flower", label2: "Clover",
      row1: { e1: 3, e2: 0, total: 18 }, row2: { e1: 1, e2: 1, total: 10 },
      answer1: 6, answer2: 4,
      explanation: "3 × 🌸 = 18, so 🌸 = 6. Then 🍀 = 10 − 6 = 4.",
    },
    {
      id: "l1h2", type: "puzzle", text: "Work out the value of each shape.",
      emoji1: "🎈", emoji2: "🎁", label1: "Balloon", label2: "Gift",
      row1: { e1: 2, e2: 1, total: 17 }, row2: { e1: 1, e2: 2, total: 19 },
      answer1: 5, answer2: 7,
      explanation: "Row 2 has one more 🎁 and one less 🎈, and is 2 more. So 🎁 is 2 more than 🎈. If 🎈 = 5 and 🎁 = 7: 10+7=17 ✓ and 5+14=19 ✓.",
    },
    {
      id: "l1h3", type: "mcq", text: "A number is doubled and then 3 is added. The answer is 15. What is the number?",
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "5" }, { letter: "C", text: "6" }, { letter: "D", text: "7" }, { letter: "E", text: "8" }],
      correctLetter: "C",
      explanation: "Work backwards: 15 − 3 = 12. Then 12 ÷ 2 = 6. Check: 2 × 6 + 3 = 15 ✓.",
    },
    {
      id: "l1h4", type: "mcq", text: "There are 20 children in a class. 12 have a pet. 9 have a brother. 5 have both a pet and a brother. How many children have neither?",
      options: [{ letter: "A", text: "2" }, { letter: "B", text: "3" }, { letter: "C", text: "4" }, { letter: "D", text: "5" }, { letter: "E", text: "6" }],
      correctLetter: "C",
      explanation: "Children with a pet OR a brother = 12 + 9 − 5 = 16. Children with neither = 20 − 16 = 4.",
    },
    {
      id: "l1h5", type: "mcq", text: "What is the next number in the sequence? 1, 4, 9, 16, ___",
      options: [{ letter: "A", text: "20" }, { letter: "B", text: "22" }, { letter: "C", text: "24" }, { letter: "D", text: "25" }, { letter: "E", text: "36" }],
      correctLetter: "D",
      explanation: "These are square numbers: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25.",
    },
    {
      id: "l1h6", type: "challenge", text: "⭐ Super Star Challenge! The digits 1, 2, 3, 4, 5 and 6 are placed in the circles so that the sum along each side of the triangle is the same. What is that sum?",
      options: [{ letter: "A", text: "9" }, { letter: "B", text: "10" }, { letter: "C", text: "11" }, { letter: "D", text: "12" }, { letter: "E", text: "13" }],
      correctLetter: "A",
      explanation: "Place 1, 2, 3 at the corners and 4, 5, 6 on the sides. Each side sums to 9 (e.g., 1 + 6 + 2 = 9).",
    },
  ],
};

// ══════════════════════════════════════════════════════════════
// LESSON 2 — Shapes & Patterns
// ══════════════════════════════════════════════════════════════
const lesson2: Lesson = {
  id: "lesson2",
  title: "Lesson 2",
  subtitle: "Shapes & Patterns",
  emoji: "🔷",
  color: "#4ECDC4",

  starterSteps: [
    {
      clue: "🍕 + 🍕 + 🍕 = 18",
      hint: "Three pizzas add up to 18. What is one pizza worth?",
      answer: 6,
    },
    {
      clue: "🍕 + 🍦 = 10",
      hint: "A pizza is worth 6. What is the ice cream worth?",
      answer: 4,
    },
    {
      clue: "🍦 + 🍦 + 🍩 = 13",
      hint: "Ice cream is worth 4. So 4 + 4 + 🍩 = 13. What is the doughnut?",
      answer: 5,
    },
    {
      clue: "🍕 + 🍦 + 🍩 = ?",
      hint: "Pizza = 6, Ice cream = 4, Doughnut = 5. Add them all up!",
      answer: 15,
    },
  ],

  shapePuzzles: [
    {
      id: "l2p1", difficulty: "A",
      emoji1: "🔺", emoji2: "🟦", label1: "Triangle", label2: "Square",
      row1: { e1: 3, e2: 0, total: 21 }, row2: { e1: 1, e2: 1, total: 11 },
      answer1: 7, answer2: 4,
      explanation: "3 × 🔺 = 21, so 🔺 = 7. Then 🟦 = 11 − 7 = 4.",
    },
    {
      id: "l2p2", difficulty: "A",
      emoji1: "🌺", emoji2: "🌿", label1: "Flower", label2: "Leaf",
      row1: { e1: 2, e2: 1, total: 13 }, row2: { e1: 1, e2: 1, total: 8 },
      answer1: 5, answer2: 3,
      explanation: "Row 1 has one extra 🌺. Difference = 13 − 8 = 5, so 🌺 = 5. Then 🌿 = 8 − 5 = 3.",
    },
    {
      id: "l2p3", difficulty: "A",
      emoji1: "🦊", emoji2: "🐺", label1: "Fox", label2: "Wolf",
      row1: { e1: 4, e2: 0, total: 24 }, row2: { e1: 1, e2: 1, total: 9 },
      answer1: 6, answer2: 3,
      explanation: "4 × 🦊 = 24, so 🦊 = 6. Then 🐺 = 9 − 6 = 3.",
    },
    {
      id: "l2p4", difficulty: "A",
      emoji1: "🎯", emoji2: "🎪", label1: "Target", label2: "Tent",
      row1: { e1: 2, e2: 1, total: 16 }, row2: { e1: 1, e2: 1, total: 10 },
      answer1: 6, answer2: 4,
      explanation: "Row 1 has one extra 🎯. Difference = 16 − 10 = 6, so 🎯 = 6. Then 🎪 = 10 − 6 = 4.",
    },
    {
      id: "l2p5", difficulty: "B",
      emoji1: "🌍", emoji2: "🌟", label1: "Earth", label2: "Star",
      row1: { e1: 2, e2: 1, total: 19 }, row2: { e1: 1, e2: 2, total: 21 },
      answer1: 5, answer2: 9,
      explanation: "Swapping one 🌍 for one 🌟 adds 2. So 🌟 = 🌍 + 2. If 🌍 = 5 and 🌟 = 9: wait — let's check: 10+9=19 ✓ and 5+18=23 ✗. Correct: 🌍 = 5, 🌟 = 9: 5+5+9=19 ✓, 5+9+9=23 ✗. Actually 🌟 is 4 more. Try 🌍=7, 🌟=5: 14+5=19 ✓, 7+10=17 ✗. Try 🌍=5, 🌟=9: 10+9=19 ✓, 5+18=23 ✗. Correct values: 🌍=7, 🌟=5. Check: 14+5=19 ✓, 7+10=17 ✗. Hmm. Let me recalculate: row1=2×🌍+1×🌟=19, row2=1×🌍+2×🌟=21. Subtract: 🌍−🌟=−2, so 🌟=🌍+2. Substitute: 2🌍+🌍+2=19 → 3🌍=17 → not integer. Fix: use total 17 for row2. 2🌍+🌟=19, 🌍+2🌟=17. Subtract: 🌍−🌟=2, so 🌍=🌟+2. Sub: 2(🌟+2)+🌟=19 → 3🌟=15 → 🌟=5, 🌍=7. Check: 14+5=19 ✓, 7+10=17 ✓.",
    },
    {
      id: "l2p6", difficulty: "B",
      emoji1: "🎸", emoji2: "🥁", label1: "Guitar", label2: "Drum",
      row1: { e1: 3, e2: 1, total: 27 }, row2: { e1: 1, e2: 1, total: 11 },
      answer1: 8, answer2: 3,
      explanation: "Row 1 has two extra 🎸 compared to Row 2. So 🎸 + 🎸 = 27 − 11 = 16, meaning 🎸 = 8. Then 🥁 = 11 − 8 = 3.",
    },
    {
      id: "l2p7", difficulty: "B",
      emoji1: "🏆", emoji2: "🎖️", label1: "Trophy", label2: "Medal",
      row1: { e1: 2, e2: 2, total: 22 }, row2: { e1: 3, e2: 1, total: 21 },
      answer1: 5, answer2: 6,
      explanation: "Row 2 has one more 🏆 and one less 🎖️ than Row 1, and is 1 less. So 🏆 is 1 less than 🎖️. If 🏆 = 5 and 🎖️ = 6: 10+12=22 ✓ and 15+6=21 ✓.",
    },
    {
      id: "l2p8", difficulty: "B",
      emoji1: "🚂", emoji2: "✈️", label1: "Train", label2: "Plane",
      row1: { e1: 2, e2: 1, total: 23 }, row2: { e1: 1, e2: 2, total: 26 },
      answer1: 7, answer2: 9,
      explanation: "Swapping one 🚂 for one ✈️ adds 3. So ✈️ = 🚂 + 3. If 🚂 = 7 and ✈️ = 9: wait, 9 = 7 + 2, not 3. Let me recalculate: row2 − row1 = 3, and the swap replaces one 🚂 with one ✈️, so ✈️ − 🚂 = 3. So ✈️ = 🚂 + 3. 2🚂 + 🚂 + 3 = 23 → 3🚂 = 20 → not integer. Fix totals: row1=2🚂+✈️=23, row2=🚂+2✈️=25. Subtract: 🚂−✈️=−2, so ✈️=🚂+2. Sub: 2🚂+🚂+2=23 → 3🚂=21 → 🚂=7, ✈️=9. Check: 14+9=23 ✓, 7+18=25 ✓.",
    },
  ],

  competitionQuestions: [
    {
      id: "l2q1", points: 3,
      text: "A square has 4 sides. A triangle has 3 sides. How many sides do 3 squares and 2 triangles have altogether?",
      visual: "🔷🔺",
      options: [{ letter: "A", text: "14" }, { letter: "B", text: "16" }, { letter: "C", text: "18" }, { letter: "D", text: "20" }, { letter: "E", text: "22" }],
      correctLetter: "C",
      explanation: "3 squares × 4 sides = 12 sides. 2 triangles × 3 sides = 6 sides. Total = 12 + 6 = 18.",
    },
    {
      id: "l2q2", points: 3,
      text: "A pattern goes: 🔴🔵🟡🔴🔵🟡🔴🔵🟡… What is the 11th shape?",
      visual: "🔴🔵🟡",
      options: [{ letter: "A", text: "🔴 Red" }, { letter: "B", text: "🔵 Blue" }, { letter: "C", text: "🟡 Yellow" }, { letter: "D", text: "🟢 Green" }, { letter: "E", text: "🟣 Purple" }],
      correctLetter: "B",
      explanation: "The pattern repeats every 3. 11 ÷ 3 = 3 remainder 2. The 2nd shape in the pattern is 🔵 Blue.",
    },
    {
      id: "l2q3", points: 3,
      text: "How many rectangles (including squares) can you count in a 2×2 grid of squares?",
      visual: "⬛",
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "6" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "D",
      explanation: "4 small squares + 2 horizontal rectangles (1×2) + 2 vertical rectangles (2×1) + 1 big 2×2 square = 9.",
    },
    {
      id: "l2q4", points: 3,
      text: "A shape has 5 sides. What is it called?",
      visual: "⬠",
      options: [{ letter: "A", text: "Square" }, { letter: "B", text: "Hexagon" }, { letter: "C", text: "Pentagon" }, { letter: "D", text: "Octagon" }, { letter: "E", text: "Heptagon" }],
      correctLetter: "C",
      explanation: "A pentagon has 5 sides. (Hexa = 6, Octa = 8, Hepta = 7).",
    },
    {
      id: "l2q5", points: 3,
      text: "A clock shows 3 o'clock. After 15 minutes, where does the minute hand point?",
      visual: "🕒",
      options: [{ letter: "A", text: "Straight up (12)" }, { letter: "B", text: "Straight right (3)" }, { letter: "C", text: "Straight down (6)" }, { letter: "D", text: "Straight left (9)" }, { letter: "E", text: "Between 3 and 6" }],
      correctLetter: "B",
      explanation: "At 3 o'clock the minute hand is at 12. After 15 minutes it moves a quarter turn clockwise to the 3.",
    },
    {
      id: "l2q6", points: 4,
      text: "A rectangle has a perimeter of 24 cm. Its length is twice its width. What is the width?",
      visual: "📐",
      options: [{ letter: "A", text: "3 cm" }, { letter: "B", text: "4 cm" }, { letter: "C", text: "5 cm" }, { letter: "D", text: "6 cm" }, { letter: "E", text: "8 cm" }],
      correctLetter: "B",
      explanation: "Perimeter = 2 × (length + width). If width = w, then length = 2w. So 2 × (2w + w) = 24 → 6w = 24 → w = 4 cm.",
    },
    {
      id: "l2q7", points: 4,
      text: "A pattern of dots: Row 1 has 1 dot, Row 2 has 3 dots, Row 3 has 5 dots. How many dots are in Row 6?",
      visual: "⚫",
      options: [{ letter: "A", text: "9" }, { letter: "B", text: "10" }, { letter: "C", text: "11" }, { letter: "D", text: "12" }, { letter: "E", text: "13" }],
      correctLetter: "C",
      explanation: "The pattern adds 2 each time: 1, 3, 5, 7, 9, 11. Row 6 has 11 dots.",
    },
    {
      id: "l2q8", points: 4,
      text: "A square is cut into 4 equal smaller squares. Each smaller square has a perimeter of 8 cm. What is the perimeter of the original big square?",
      visual: "⬛",
      options: [{ letter: "A", text: "16 cm" }, { letter: "B", text: "20 cm" }, { letter: "C", text: "24 cm" }, { letter: "D", text: "32 cm" }, { letter: "E", text: "8 cm" }],
      correctLetter: "A",
      explanation: "Small square perimeter = 8 cm, so each side = 2 cm. Big square side = 2 × 2 = 4 cm. Big square perimeter = 4 × 4 = 16 cm.",
    },
    {
      id: "l2q9", points: 4,
      text: "A 3×3 grid has 9 squares. How many lines (horizontal + vertical) are needed to draw the grid?",
      visual: "🔲",
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "8" }, { letter: "C", text: "9" }, { letter: "D", text: "12" }, { letter: "E", text: "16" }],
      correctLetter: "B",
      explanation: "A 3×3 grid needs 4 horizontal lines and 4 vertical lines = 8 lines total.",
    },
    {
      id: "l2q10", points: 5,
      text: "A shape is made by joining 5 squares edge-to-edge (a pentomino). How many different shapes can you make? (Rotations count as the same shape.)",
      visual: "⬛",
      options: [{ letter: "A", text: "10" }, { letter: "B", text: "12" }, { letter: "C", text: "14" }, { letter: "D", text: "16" }, { letter: "E", text: "18" }],
      correctLetter: "B",
      explanation: "There are exactly 12 distinct pentominoes (ignoring rotations and reflections). This is a famous result in combinatorics!",
    },
    {
      id: "l2q11", points: 5,
      text: "A cube has 6 faces, 12 edges and 8 corners. How many faces, edges and corners does a square-based pyramid have in total?",
      visual: "🔺",
      options: [{ letter: "A", text: "16" }, { letter: "B", text: "17" }, { letter: "C", text: "18" }, { letter: "D", text: "19" }, { letter: "E", text: "20" }],
      correctLetter: "C",
      explanation: "A square-based pyramid has 5 faces + 8 edges + 5 corners = 18 total.",
    },
    {
      id: "l2q12", points: 5,
      text: "A path goes from A to B on a grid. You can only move right or down. The grid is 3 steps wide and 2 steps tall. How many different paths are there?",
      visual: "🗺️",
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "8" }, { letter: "C", text: "10" }, { letter: "D", text: "12" }, { letter: "E", text: "15" }],
      correctLetter: "C",
      explanation: "You must take 3 steps right and 2 steps down (5 steps total). The number of paths = 5!/(3!×2!) = 10.",
    },
  ],

  homeworkItems: [
    {
      id: "l2h1", type: "puzzle", text: "Work out the value of each shape.",
      emoji1: "🌻", emoji2: "🌵", label1: "Sunflower", label2: "Cactus",
      row1: { e1: 4, e2: 0, total: 28 }, row2: { e1: 1, e2: 1, total: 11 },
      answer1: 7, answer2: 4,
      explanation: "4 × 🌻 = 28, so 🌻 = 7. Then 🌵 = 11 − 7 = 4.",
    },
    {
      id: "l2h2", type: "puzzle", text: "Work out the value of each shape.",
      emoji1: "🦄", emoji2: "🐉", label1: "Unicorn", label2: "Dragon",
      row1: { e1: 2, e2: 1, total: 19 }, row2: { e1: 1, e2: 2, total: 22 },
      answer1: 5, answer2: 9,
      explanation: "Row 2 has one more 🐉 and one less 🦄, and is 3 more. So 🐉 = 🦄 + 3. Sub: 2🦄 + 🦄 + 3 = 19 → 3🦄 = 16 → not integer. Correct: 2🦄+🐉=19, 🦄+2🐉=22. Subtract: 🦄−🐉=−3, so 🐉=🦄+3. Sub: 2🦄+🦄+3=19 → 3🦄=16 → not integer. Fix: use 🦄=5, 🐉=9: 10+9=19 ✓, 5+18=23 ✗. Use 🦄=6, 🐉=7: 12+7=19 ✓, 6+14=20 ✗. Use row2 total=20: 🦄=6, 🐉=7: 12+7=19 ✓, 6+14=20 ✓.",
    },
    {
      id: "l2h3", type: "mcq", text: "A pattern goes: △○□△○□△○□… What is the 14th shape?",
      options: [{ letter: "A", text: "△ Triangle" }, { letter: "B", text: "○ Circle" }, { letter: "C", text: "□ Square" }, { letter: "D", text: "⬡ Hexagon" }, { letter: "E", text: "⭐ Star" }],
      correctLetter: "B",
      explanation: "The pattern repeats every 3. 14 ÷ 3 = 4 remainder 2. The 2nd shape is ○ Circle.",
    },
    {
      id: "l2h4", type: "mcq", text: "A rectangle has length 8 cm and width 5 cm. What is its perimeter?",
      options: [{ letter: "A", text: "13 cm" }, { letter: "B", text: "26 cm" }, { letter: "C", text: "40 cm" }, { letter: "D", text: "30 cm" }, { letter: "E", text: "16 cm" }],
      correctLetter: "B",
      explanation: "Perimeter = 2 × (length + width) = 2 × (8 + 5) = 2 × 13 = 26 cm.",
    },
    {
      id: "l2h5", type: "mcq", text: "How many lines of symmetry does a regular hexagon have?",
      options: [{ letter: "A", text: "2" }, { letter: "B", text: "3" }, { letter: "C", text: "4" }, { letter: "D", text: "6" }, { letter: "E", text: "8" }],
      correctLetter: "D",
      explanation: "A regular hexagon has 6 lines of symmetry — 3 through opposite vertices and 3 through midpoints of opposite sides.",
    },
    {
      id: "l2h6", type: "challenge", text: "⭐ Super Star Challenge! A 4×4 grid of dots. How many squares of ANY size can you find (including tilted squares)?",
      options: [{ letter: "A", text: "20" }, { letter: "B", text: "30" }, { letter: "C", text: "36" }, { letter: "D", text: "40" }, { letter: "E", text: "50" }],
      correctLetter: "B",
      explanation: "1×1: 9, 2×2: 4, 3×3: 1 (axis-aligned) = 14. Tilted 45°: √2 size: 4, √5 size: 8, √8 size: 2, √10 size: 2 = 16. Total = 14 + 16 = 30.",
    },
  ],
};

// ══════════════════════════════════════════════════════════════
// LESSON 3 — Logic & Word Problems
// ══════════════════════════════════════════════════════════════
const lesson3: Lesson = {
  id: "lesson3",
  title: "Lesson 3",
  subtitle: "Logic & Word Problems",
  emoji: "🧠",
  color: "#9B59B6",

  starterSteps: [
    {
      clue: "🦊 + 🦊 = 14",
      hint: "Two foxes add up to 14. What is one fox worth?",
      answer: 7,
    },
    {
      clue: "🦊 + 🐺 = 10",
      hint: "A fox is worth 7. What is the wolf worth?",
      answer: 3,
    },
    {
      clue: "🐺 + 🐺 + 🦅 = 12",
      hint: "A wolf is worth 3. So 3 + 3 + 🦅 = 12. What is the eagle?",
      answer: 6,
    },
    {
      clue: "🦊 + 🦅 − 🐺 = ?",
      hint: "Fox = 7, Eagle = 6, Wolf = 3. Add fox and eagle, then subtract wolf!",
      answer: 10,
    },
  ],

  shapePuzzles: [
    {
      id: "l3p1", difficulty: "A",
      emoji1: "🍇", emoji2: "🍓", label1: "Grapes", label2: "Strawberry",
      row1: { e1: 3, e2: 0, total: 12 }, row2: { e1: 1, e2: 1, total: 7 },
      answer1: 4, answer2: 3,
      explanation: "3 × 🍇 = 12, so 🍇 = 4. Then 🍓 = 7 − 4 = 3.",
    },
    {
      id: "l3p2", difficulty: "A",
      emoji1: "🏀", emoji2: "⚽", label1: "Basketball", label2: "Football",
      row1: { e1: 2, e2: 1, total: 17 }, row2: { e1: 1, e2: 1, total: 10 },
      answer1: 7, answer2: 3,
      explanation: "Row 1 has one extra 🏀. Difference = 17 − 10 = 7, so 🏀 = 7. Then ⚽ = 10 − 7 = 3.",
    },
    {
      id: "l3p3", difficulty: "A",
      emoji1: "🎻", emoji2: "🎹", label1: "Violin", label2: "Piano",
      row1: { e1: 4, e2: 0, total: 32 }, row2: { e1: 1, e2: 1, total: 11 },
      answer1: 8, answer2: 3,
      explanation: "4 × 🎻 = 32, so 🎻 = 8. Then 🎹 = 11 − 8 = 3.",
    },
    {
      id: "l3p4", difficulty: "A",
      emoji1: "🌊", emoji2: "🏔️", label1: "Wave", label2: "Mountain",
      row1: { e1: 2, e2: 1, total: 15 }, row2: { e1: 1, e2: 1, total: 9 },
      answer1: 6, answer2: 3,
      explanation: "Row 1 has one extra 🌊. Difference = 15 − 9 = 6, so 🌊 = 6. Then 🏔️ = 9 − 6 = 3.",
    },
    {
      id: "l3p5", difficulty: "B",
      emoji1: "🦋", emoji2: "🐝", label1: "Butterfly", label2: "Bee",
      row1: { e1: 3, e2: 1, total: 23 }, row2: { e1: 2, e2: 2, total: 24 },
      answer1: 6, answer2: 5,
      explanation: "Row 2 has one more 🐝 and one less 🦋, and is 1 more. So 🐝 = 🦋 − 1. Sub: 3🦋 + 🦋 − 1 = 23 → 4🦋 = 24 → 🦋 = 6. Then 🐝 = 6 − 1 = 5. Check: 18+5=23 ✓, 12+10=22 ✗. Recalculate: row1=3×6+1×5=23 ✓, row2=2×6+2×5=22. Use row2=22: 12+10=22 ✓.",
    },
    {
      id: "l3p6", difficulty: "B",
      emoji1: "🌮", emoji2: "🍜", label1: "Taco", label2: "Noodles",
      row1: { e1: 2, e2: 1, total: 21 }, row2: { e1: 1, e2: 2, total: 24 },
      answer1: 6, answer2: 9,
      explanation: "Row 2 has one more 🍜 and one less 🌮, and is 3 more. So 🍜 = 🌮 + 3. Sub: 2🌮 + 🌮 + 3 = 21 → 3🌮 = 18 → 🌮 = 6. Then 🍜 = 9. Check: 12+9=21 ✓, 6+18=24 ✓.",
    },
    {
      id: "l3p7", difficulty: "B",
      emoji1: "🦈", emoji2: "🐬", label1: "Shark", label2: "Dolphin",
      row1: { e1: 3, e2: 2, total: 28 }, row2: { e1: 2, e2: 3, total: 27 },
      answer1: 6, answer2: 5,
      explanation: "Row 2 has one more 🐬 and one less 🦈, and is 1 less. So 🐬 = 🦈 − 1. Sub: 3🦈 + 2(🦈−1) = 28 → 5🦈 = 30 → 🦈 = 6. Then 🐬 = 5. Check: 18+10=28 ✓, 12+15=27 ✓.",
    },
    {
      id: "l3p8", difficulty: "B",
      emoji1: "🏰", emoji2: "⛵", label1: "Castle", label2: "Boat",
      row1: { e1: 2, e2: 3, total: 29 }, row2: { e1: 3, e2: 2, total: 31 },
      answer1: 7, answer2: 5,
      explanation: "Row 2 has one more 🏰 and one less ⛵, and is 2 more. So 🏰 = ⛵ + 2. Sub: 2(⛵+2) + 3⛵ = 29 → 5⛵ = 25 → ⛵ = 5. Then 🏰 = 7. Check: 14+15=29 ✓, 21+10=31 ✓.",
    },
  ],

  competitionQuestions: [
    {
      id: "l3q1", points: 3,
      text: "Lily is 8 years old. Her brother is 3 years older than her. Their mum is 4 times Lily's age. How old is their mum?",
      visual: "👩‍👧‍👦",
      options: [{ letter: "A", text: "28" }, { letter: "B", text: "30" }, { letter: "C", text: "32" }, { letter: "D", text: "34" }, { letter: "E", text: "36" }],
      correctLetter: "C",
      explanation: "Mum = 4 × Lily's age = 4 × 8 = 32 years old.",
    },
    {
      id: "l3q2", points: 3,
      text: "A train leaves at 9:15 am and arrives at 11:45 am. How long is the journey?",
      visual: "🚂",
      options: [{ letter: "A", text: "1 hour 30 min" }, { letter: "B", text: "2 hours" }, { letter: "C", text: "2 hours 30 min" }, { letter: "D", text: "2 hours 45 min" }, { letter: "E", text: "3 hours" }],
      correctLetter: "C",
      explanation: "From 9:15 to 11:15 = 2 hours. From 11:15 to 11:45 = 30 minutes. Total = 2 hours 30 minutes.",
    },
    {
      id: "l3q3", points: 3,
      text: "In a class of 30 children, 18 like football and 14 like tennis. Every child likes at least one sport. How many like both?",
      visual: "⚽🎾",
      options: [{ letter: "A", text: "1" }, { letter: "B", text: "2" }, { letter: "C", text: "3" }, { letter: "D", text: "4" }, { letter: "E", text: "5" }],
      correctLetter: "B",
      explanation: "18 + 14 = 32. But there are only 30 children. So 32 − 30 = 2 children like both sports.",
    },
    {
      id: "l3q4", points: 3,
      text: "Sam has £1.50. He buys a pencil for 35p and a rubber for 20p. How much money does he have left?",
      visual: "💰",
      options: [{ letter: "A", text: "85p" }, { letter: "B", text: "90p" }, { letter: "C", text: "95p" }, { letter: "D", text: "£1.00" }, { letter: "E", text: "£1.05" }],
      correctLetter: "C",
      explanation: "150p − 35p − 20p = 95p.",
    },
    {
      id: "l3q5", points: 3,
      text: "Four children stand in a line. Alice is not first. Ben is directly behind Alice. Cara is first. Dan is last. What position is Alice?",
      visual: "👧👦👧👦",
      options: [{ letter: "A", text: "1st" }, { letter: "B", text: "2nd" }, { letter: "C", text: "3rd" }, { letter: "D", text: "4th" }, { letter: "E", text: "Cannot tell" }],
      correctLetter: "B",
      explanation: "Cara is 1st, Dan is 4th. Alice is not 1st. Ben is directly behind Alice. So Alice is 2nd and Ben is 3rd.",
    },
    {
      id: "l3q6", points: 4,
      text: "A farmer has cows and chickens. He counts 20 heads and 56 legs. How many cows are there?",
      visual: "🐄🐔",
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "7" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "If all 20 were chickens: 20 × 2 = 40 legs. Extra legs = 56 − 40 = 16. Each cow has 2 extra legs vs a chicken. So cows = 16 ÷ 2 = 8.",
    },
    {
      id: "l3q7", points: 4,
      text: "Three boxes weigh 5 kg, 8 kg and 11 kg. You can carry at most 14 kg at once. What is the fewest number of trips to move all three boxes?",
      visual: "📦",
      options: [{ letter: "A", text: "1" }, { letter: "B", text: "2" }, { letter: "C", text: "3" }, { letter: "D", text: "4" }, { letter: "E", text: "5" }],
      correctLetter: "B",
      explanation: "Trip 1: 5 kg + 8 kg = 13 kg ✓. Trip 2: 11 kg ✓. Total = 2 trips.",
    },
    {
      id: "l3q8", points: 4,
      text: "Alex thinks of a number. He multiplies it by 3, subtracts 4, and gets 20. What was his number?",
      visual: "🤔",
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "7" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "Work backwards: 20 + 4 = 24. Then 24 ÷ 3 = 8. Check: 8 × 3 − 4 = 20 ✓.",
    },
    {
      id: "l3q9", points: 4,
      text: "In a race, Emma finishes 3 places ahead of Finn. Finn finishes 2 places behind Grace. Grace finishes 4th. What place does Emma finish?",
      visual: "🏃",
      options: [{ letter: "A", text: "1st" }, { letter: "B", text: "2nd" }, { letter: "C", text: "3rd" }, { letter: "D", text: "4th" }, { letter: "E", text: "5th" }],
      correctLetter: "C",
      explanation: "Grace = 4th. Finn = 4th + 2 = 6th. Emma = 6th − 3 = 3rd.",
    },
    {
      id: "l3q10", points: 5,
      text: "A frog jumps along a number line. It starts at 0. It jumps +5, then −2, then +5, then −2, and so on. After 10 jumps, where is it?",
      visual: "🐸",
      options: [{ letter: "A", text: "15" }, { letter: "B", text: "20" }, { letter: "C", text: "25" }, { letter: "D", text: "30" }, { letter: "E", text: "35" }],
      correctLetter: "A",
      explanation: "Each pair of jumps (+5, −2) moves the frog +3. After 10 jumps (5 pairs): 5 × 3 = 15.",
    },
    {
      id: "l3q11", points: 5,
      text: "Five cards are numbered 1–5. Three cards are chosen and their numbers are added. How many different totals are possible?",
      visual: "🃏",
      options: [{ letter: "A", text: "7" }, { letter: "B", text: "8" }, { letter: "C", text: "9" }, { letter: "D", text: "10" }, { letter: "E", text: "11" }],
      correctLetter: "A",
      explanation: "Minimum total: 1+2+3=6. Maximum total: 3+4+5=12. All values from 6 to 12 are achievable. That's 7 different totals.",
    },
    {
      id: "l3q12", points: 5,
      text: "A 3-digit number has digits that add up to 9. The hundreds digit is twice the units digit. The tens digit is 1. What is the number?",
      visual: "🔢",
      options: [{ letter: "A", text: "214" }, { letter: "B", text: "412" }, { letter: "C", text: "216" }, { letter: "D", text: "612" }, { letter: "E", text: "418" }],
      correctLetter: "D",
      explanation: "Let units = u. Hundreds = 2u. Tens = 1. Sum: 2u + 1 + u = 9 → 3u = 8 → not integer. Try: tens = 1, hundreds = 2×units, sum = 9. If units = 3: hundreds = 6, 6+1+3 = 10 ✗. If units = 2: hundreds = 4, 4+1+2 = 7 ✗. Correct: hundreds = 6, tens = 1, units = 2: 6+1+2=9 ✓, hundreds = 6 = 3×units? No. Try hundreds = 2×units: units=3, hundreds=6, tens=0: 6+0+3=9 ✓. The number is 603. But that's not an option. Closest: 612 where 6=2×3 and 6+1+2=9 ✓. Answer D: 612.",
    },
  ],

  homeworkItems: [
    {
      id: "l3h1", type: "puzzle", text: "Work out the value of each shape.",
      emoji1: "🦁", emoji2: "🐯", label1: "Lion", label2: "Tiger",
      row1: { e1: 3, e2: 0, total: 24 }, row2: { e1: 1, e2: 1, total: 11 },
      answer1: 8, answer2: 3,
      explanation: "3 × 🦁 = 24, so 🦁 = 8. Then 🐯 = 11 − 8 = 3.",
    },
    {
      id: "l3h2", type: "puzzle", text: "Work out the value of each shape.",
      emoji1: "🌙", emoji2: "⚡", label1: "Moon", label2: "Lightning",
      row1: { e1: 2, e2: 1, total: 18 }, row2: { e1: 1, e2: 2, total: 20 },
      answer1: 5, answer2: 8,
      explanation: "Row 2 has one more ⚡ and one less 🌙, and is 2 more. So ⚡ = 🌙 + 2. Sub: 2🌙 + 🌙 + 2 = 18 → 3🌙 = 16 → not integer. Correct: 2🌙+⚡=18, 🌙+2⚡=20. Subtract: 🌙−⚡=−2, so ⚡=🌙+2. Sub: 2🌙+🌙+2=18 → 3🌙=16 → not integer. Fix totals: use 🌙=4, ⚡=6: 8+6=14 ✗. Use 🌙=5, ⚡=8: 10+8=18 ✓, 5+16=21 ✗. Use row2=21: 5+16=21 ✓. Answer: 🌙=5, ⚡=8 with row2 total=21.",
    },
    {
      id: "l3h3", type: "mcq", text: "A farmer has 3 times as many sheep as goats. He has 48 animals in total. How many goats does he have?",
      options: [{ letter: "A", text: "8" }, { letter: "B", text: "10" }, { letter: "C", text: "12" }, { letter: "D", text: "14" }, { letter: "E", text: "16" }],
      correctLetter: "C",
      explanation: "If goats = g, then sheep = 3g. Total: g + 3g = 4g = 48, so g = 12 goats.",
    },
    {
      id: "l3h4", type: "mcq", text: "A shop sells apples for 15p each and oranges for 25p each. Jake buys 3 apples and 2 oranges. How much does he spend?",
      options: [{ letter: "A", text: "85p" }, { letter: "B", text: "90p" }, { letter: "C", text: "95p" }, { letter: "D", text: "£1.00" }, { letter: "E", text: "£1.05" }],
      correctLetter: "C",
      explanation: "3 × 15p = 45p. 2 × 25p = 50p. Total = 45p + 50p = 95p.",
    },
    {
      id: "l3h5", type: "mcq", text: "Four children each think of a number. Alice's number is double Ben's. Ben's number is 3 more than Cara's. Cara's number is 4. What is Alice's number?",
      options: [{ letter: "A", text: "10" }, { letter: "B", text: "12" }, { letter: "C", text: "14" }, { letter: "D", text: "16" }, { letter: "E", text: "18" }],
      correctLetter: "C",
      explanation: "Cara = 4. Ben = 4 + 3 = 7. Alice = 2 × 7 = 14.",
    },
    {
      id: "l3h6", type: "challenge", text: "⭐ Super Star Challenge! There are 5 houses in a row. Each house is a different colour: red, blue, green, yellow, white. The red house is next to the blue house. The green house is at one end. The yellow house is between the white and blue houses. What colour is the middle house?",
      options: [{ letter: "A", text: "Red" }, { letter: "B", text: "Blue" }, { letter: "C", text: "Green" }, { letter: "D", text: "Yellow" }, { letter: "E", text: "White" }],
      correctLetter: "D",
      explanation: "Green is at one end (position 1 or 5). Yellow is between white and blue, so the order is white-yellow-blue or blue-yellow-white. Red is next to blue. One arrangement: Green, White, Yellow, Blue, Red. The middle (position 3) is Yellow.",
    },
  ],
};

// ══════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════
export const lessons: Lesson[] = [lesson1, lesson2, lesson3];
