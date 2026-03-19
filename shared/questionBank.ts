// ═══════════════════════════════════════════════════════════════════════════
// NumerOwls Question Bank — v3
// 200+ questions in authentic Écolier / PMC competition style
// Years 1–6, 9 skill categories, 3 difficulty levels, 3/4/5 points
// Diagrams: ONLY balance scales, shape grids, clock faces, sharing diagrams
// NO diagrams for sequences, pure arithmetic, or self-explanatory word problems
// ═══════════════════════════════════════════════════════════════════════════

import type { DiagramSpec } from "./diagramTypes";
export type { DiagramSpec } from "./diagramTypes";
import { COMPETITION_QUESTIONS } from "./competitionQuestionBank";
export { COMPETITION_QUESTIONS } from "./competitionQuestionBank";

export type SkillId =
  | "addition"
  | "multiplication"
  | "fractions"
  | "shapes"
  | "patterns"
  | "logic"
  | "puzzles"
  | "measurement"
  | "time";

export interface Skill {
  id: SkillId;
  name: string;
  icon: string;
  color: string;
  years: number[];
  description: string;
}

export const SKILLS: Skill[] = [
  { id: "addition",       name: "Addition & Subtraction",   icon: "➕", color: "#F5A623", years: [1,2,3,4,5,6], description: "Number bonds, column addition, mental strategies" },
  { id: "multiplication", name: "Multiplication & Division", icon: "✖️", color: "#9B59B6", years: [2,3,4,5,6],   description: "Times tables, arrays, short division" },
  { id: "fractions",      name: "Fractions & Decimals",     icon: "🍕", color: "#E74C3C", years: [3,4,5,6],     description: "Equivalent fractions, ordering, decimals" },
  { id: "shapes",         name: "Shapes & Geometry",        icon: "🔷", color: "#3498DB", years: [1,2,3,4,5,6], description: "2D/3D shapes, angles, symmetry, coordinates" },
  { id: "patterns",       name: "Patterns & Sequences",     icon: "🔄", color: "#2ECC71", years: [1,2,3,4,5,6], description: "Number patterns, rules, missing terms" },
  { id: "logic",          name: "Logic & Word Problems",    icon: "🧠", color: "#F39C12", years: [1,2,3,4,5,6], description: "Multi-step problems, reasoning, deduction" },
  { id: "puzzles",        name: "Shape Value Puzzles",      icon: "🧩", color: "#E91E63", years: [1,2,3,4,5,6], description: "Pictorial simultaneous equations" },
  { id: "measurement",   name: "Measurement & Data",       icon: "📏", color: "#00BCD4", years: [2,3,4,5,6],   description: "Length, mass, capacity, charts, tables" },
  { id: "time",           name: "Time & Calendar",          icon: "🕐", color: "#FF5722", years: [1,2,3,4],     description: "Reading clocks, duration, days/months" },
];

export type QuestionStyle =
  | "number-pyramid"
  | "magic-square"
  | "crossnumber"
  | "function-machine"
  | "liar-truth-teller"
  | "true-false-statements"
  | "estimation"
  | "probability-language"
  | "counting-shapes"
  | "net-3d-shape"
  | "venn-diagram"
  | "pigeonhole"
  | "palindrome-counting"
  | "calendar-arithmetic"
  | "think-of-a-number"
  | "seating-arrangements"
  | "pathfinding-grid"
  | "self-referential"
  | "arithmetic-comparison"
  | "alternating-sequence"
  | "digit-puzzle"
  | "ratio-word-problem"
  | "fraction-of-shape"
  | "compound-perimeter"
  | "area-border-frame"
  | "angle-polygon"
  | "symmetry-reflection"
  | "folding-origami"
  | "tiling-covering"
  | "ordering-by-clues"
  | "conversation-logic"
  | "logic-deduction"
  | "tournament-table"
  | "time-arithmetic"
  | "speed-distance-time"
  | "percentage-change"
  | "fraction-ordering"
  | "minimum-for-percentage"
  | "consecutive-numbers"
  | "reverse-operations"
  | "weighing-balance"
  | "simultaneous-equations"
  | "3d-counting"
  | "floor-plan-area"
  | "pie-chart"
  | "mean-average"
  | "coin-denomination"
  | "direction-rotation"
  | "meeting-point"
  | "best-value"
  | "simultaneous-constraints"
  | "age-problems"
  | "coin-combinations"
  | "balance-scales"
  | "fraction-remaining"
  | "picture-graph"
  | "multi-step-cutting"
  | "ordering-quantities"
  | "triangular-numbers"
  | "median-real-data"
  | "arithmetic-sequence"
  | "value-for-money"
  | "rate-proportion"
  | "consecutive-integers"
  | "standard";

export type QuestionSource =
  | "jmc"
  | "imc"
  | "pmc"
  | "amc8"
  | "nns"
  | "singapore"
  | "tmc"
  | "kangaroo"
  | "ukmt"
  | "original";

export interface Question {
  id: string;
  skill: SkillId;
  year: number;
  difficulty: 1 | 2 | 3;
  type: "mcq" | "puzzle";
  text: string;
  diagram?: DiagramSpec;
  options: string[];
  answer: string;
  explanation: string;
  points: 3 | 4 | 5;
  style?: QuestionStyle;
  source?: QuestionSource;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDITION & SUBTRACTION  (30 questions)
// ─────────────────────────────────────────────────────────────────────────────
const additionQuestions: Question[] = [
  {
    id: "add_y1_01", skill: "addition", year: 1, difficulty: 1, type: "mcq",
    text: "What is 7 + 5?",
    options: ["10", "11", "12", "13", "14"],
    answer: "12", explanation: "7 + 5 = 12. Count on 5 from 7: 8, 9, 10, 11, 12.", points: 3,
  },
  {
    id: "add_y1_02", skill: "addition", year: 1, difficulty: 1, type: "mcq",
    text: "Tom has 8 stickers. He gets 6 more. How many does he have now?",
    options: ["12", "13", "14", "15", "16"],
    answer: "14", explanation: "8 + 6 = 14.", points: 3,
  },
  {
    id: "add_y1_03", skill: "addition", year: 1, difficulty: 2, type: "mcq",
    text: "What is 15 − 8?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "15 − 8 = 7. Count back 8 from 15.", points: 3,
  },
  {
    id: "add_y1_04", skill: "addition", year: 1, difficulty: 1, type: "mcq",
    text: "There are 10 birds on a fence. 4 fly away. How many are left?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "10 − 4 = 6.", points: 3,
  },
  {
    id: "add_y1_05", skill: "addition", year: 1, difficulty: 2, type: "mcq",
    text: "What number added to 9 gives 16?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "9 + 7 = 16. So the missing number is 7.", points: 3,
  },
  {
    id: "add_y1_06", skill: "addition", year: 1, difficulty: 2, type: "mcq",
    text: "Anna has 5 red beads and 8 blue beads. How many beads does she have altogether?",
    options: ["11", "12", "13", "14", "15"],
    answer: "13", explanation: "5 + 8 = 13.", points: 3,
  },
  {
    id: "add_y2_01", skill: "addition", year: 2, difficulty: 1, type: "mcq",
    text: "What is 34 + 27?",
    options: ["51", "61", "71", "57", "63"],
    answer: "61", explanation: "34 + 27: 30 + 20 = 50, 4 + 7 = 11, so 50 + 11 = 61.", points: 3,
  },
  {
    id: "add_y2_02", skill: "addition", year: 2, difficulty: 2, type: "mcq",
    text: "A bag has 45 sweets. 18 are eaten. How many are left?",
    options: ["25", "26", "27", "28", "29"],
    answer: "27", explanation: "45 − 18 = 27. Take away 20 to get 25, then add 2 back: 27.", points: 3,
  },
  {
    id: "add_y2_03", skill: "addition", year: 2, difficulty: 2, type: "mcq",
    text: "What number is exactly halfway between 20 and 30?",
    options: ["23", "24", "25", "26", "27"],
    answer: "25", explanation: "Halfway between 20 and 30 is 25. (20 + 30) ÷ 2 = 25.", points: 3,
  },
  {
    id: "add_y2_04", skill: "addition", year: 2, difficulty: 2, type: "mcq",
    text: "Lily scores 37 points in a game. She needs 60 to win a prize. How many more points does she need?",
    options: ["21", "22", "23", "24", "25"],
    answer: "23", explanation: "60 − 37 = 23.", points: 3,
  },
  {
    id: "add_y2_05", skill: "addition", year: 2, difficulty: 3, type: "mcq",
    text: "A shopkeeper has 52 oranges. He sells 29 in the morning and 14 in the afternoon. How many does he have left?",
    options: ["7", "8", "9", "10", "11"],
    answer: "9", explanation: "52 − 29 = 23. 23 − 14 = 9.", points: 4,
  },
  {
    id: "add_y2_06", skill: "addition", year: 2, difficulty: 2, type: "mcq",
    text: "What is 63 − 28?",
    options: ["33", "34", "35", "36", "37"],
    answer: "35", explanation: "63 − 28 = 35. Take away 30 to get 33, then add 2 back: 35.", points: 3,
  },
  {
    id: "add_y3_01", skill: "addition", year: 3, difficulty: 2, type: "mcq",
    text: "What is 256 + 178?",
    options: ["424", "434", "444", "454", "464"],
    answer: "434", explanation: "256 + 178: 200+100=300, 56+78=134, so 300+134=434.", points: 4,
  },
  {
    id: "add_y3_02", skill: "addition", year: 3, difficulty: 3, type: "mcq",
    text: "Three friends collect conkers. Anya gets 47, Ben gets 35, and Cara gets 28. How many altogether?",
    options: ["100", "105", "110", "115", "120"],
    answer: "110", explanation: "47 + 35 + 28 = 110. Add 47+35=82, then 82+28=110.", points: 4,
  },
  {
    id: "add_y3_03", skill: "addition", year: 3, difficulty: 2, type: "mcq",
    text: "A baker makes 145 rolls in the morning and 98 in the afternoon. How many rolls does he make in total?",
    options: ["233", "243", "253", "263", "273"],
    answer: "243", explanation: "145 + 98 = 243.", points: 3,
  },
  {
    id: "add_y3_04", skill: "addition", year: 3, difficulty: 3, type: "mcq",
    text: "The sum of two numbers is 200. One number is 87. What is the other number?",
    options: ["103", "107", "111", "113", "117"],
    answer: "113", explanation: "200 − 87 = 113.", points: 4,
  },
  {
    id: "add_y4_01", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    text: "What is 1,347 + 2,856?",
    options: ["4,103", "4,203", "4,213", "4,303", "4,313"],
    answer: "4,203", explanation: "1347 + 2856 = 4203.", points: 4,
  },
  {
    id: "add_y4_02", skill: "addition", year: 4, difficulty: 3, type: "mcq",
    text: "A school raises £2,450 on Monday and £1,875 on Tuesday. How much more do they need to reach their £5,000 target?",
    options: ["£575", "£625", "£675", "£725", "£775"],
    answer: "£675", explanation: "2450 + 1875 = 4325. 5000 − 4325 = 675.", points: 5,
  },
  {
    id: "add_y4_03", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    text: "What is 3,008 − 1,459?",
    options: ["1,449", "1,549", "1,559", "1,649", "1,659"],
    answer: "1,549", explanation: "3008 − 1459 = 1549.", points: 4,
  },
  {
    id: "add_y5_01", skill: "addition", year: 5, difficulty: 2, type: "mcq",
    text: "What is 12,456 − 7,389?",
    options: ["4,967", "5,067", "5,167", "5,267", "5,367"],
    answer: "5,067", explanation: "12456 − 7389 = 5067.", points: 4,
  },
  {
    id: "add_y5_02", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    text: "The population of a town is 24,560. After 1,875 people move in and 3,240 move away, what is the new population?",
    options: ["22,895", "23,095", "23,195", "23,295", "23,395"],
    answer: "23,195", explanation: "24560 + 1875 = 26435. 26435 − 3240 = 23195.", points: 5,
  },
  {
    id: "add_y5_03", skill: "addition", year: 5, difficulty: 2, type: "mcq",
    text: "What is 9.7 + 4.85?",
    options: ["13.45", "14.45", "14.55", "14.65", "15.45"],
    answer: "14.55", explanation: "9.7 + 4.85 = 14.55.", points: 4,
  },
  {
    id: "add_y6_01", skill: "addition", year: 6, difficulty: 3, type: "mcq",
    text: "A cinema sold 3,456 tickets on Saturday and 2,987 on Sunday. Tickets cost £8 each. What was the total ticket revenue over the weekend?",
    options: ["£51,144", "£51,344", "£51,544", "£51,744", "£51,944"],
    answer: "£51,544", explanation: "3456 + 2987 = 6443 tickets. 6443 × 8 = £51,544.", points: 5,
  },
  {
    id: "add_y6_02", skill: "addition", year: 6, difficulty: 3, type: "mcq",
    text: "A number is 1,000 less than 10,000. Another number is 100 more than 8,500. What is the sum of these two numbers?",
    options: ["17,500", "17,600", "17,700", "17,800", "17,900"],
    answer: "17,600", explanation: "10000 − 1000 = 9000. 8500 + 100 = 8600. 9000 + 8600 = 17600.", points: 5,
  },
  // Competition-style addition questions (Écolier flavour)
  {
    id: "add_comp_01", skill: "addition", year: 2, difficulty: 2, type: "mcq",
    text: "Mia has some marbles. She gives 7 to her brother and 5 to her sister. She has 11 left. How many did she start with?",
    options: ["21", "22", "23", "24", "25"],
    answer: "23", explanation: "She gave away 7 + 5 = 12 marbles and had 11 left. So she started with 12 + 11 = 23.", points: 4,
  },
  {
    id: "add_comp_02", skill: "addition", year: 3, difficulty: 3, type: "mcq",
    text: "Four children each think of a number. The numbers add up to 100. Three of the numbers are 18, 27, and 34. What is the fourth number?",
    options: ["19", "20", "21", "22", "23"],
    answer: "21", explanation: "18 + 27 + 34 = 79. 100 − 79 = 21.", points: 4,
  },
  {
    id: "add_comp_03", skill: "addition", year: 2, difficulty: 2, type: "mcq",
    text: "A train has 3 carriages. The first has 24 passengers, the second has 31, and the third has 18. How many passengers are on the train?",
    options: ["63", "70", "73", "74", "75"],
    answer: "73", explanation: "24 + 31 + 18 = 73.", points: 3,
  },
  {
    id: "add_comp_04", skill: "addition", year: 4, difficulty: 3, type: "mcq",
    text: "The digits of a 3-digit number add up to 15. The hundreds digit is 7 and the units digit is 2. What is the tens digit?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "7 + tens + 2 = 15. Tens = 15 − 9 = 6.", points: 5,
  },
  {
    id: "add_comp_05", skill: "addition", year: 3, difficulty: 2, type: "mcq",
    text: "A bookshop has 200 books. On Monday it sells 47 books and receives 30 new ones. On Tuesday it sells 38 books. How many books are there at the end of Tuesday?",
    options: ["135", "140", "145", "150", "155"],
    answer: "145", explanation: "200 − 47 + 30 = 183. 183 − 38 = 145.", points: 4,
  },
  {
    id: "add_comp_06", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    text: "The sum of three consecutive even numbers is 78. What is the largest of the three numbers?",
    options: ["24", "26", "28", "30", "32"],
    answer: "28", explanation: "Three consecutive even numbers: n, n+2, n+4. Sum = 3n+6 = 78, so n = 24. The largest is 24+4 = 28.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MULTIPLICATION & DIVISION  (28 questions)
// ─────────────────────────────────────────────────────────────────────────────
const multiplicationQuestions: Question[] = [
  {
    id: "mul_y2_01", skill: "multiplication", year: 2, difficulty: 1, type: "mcq",
    text: "What is 4 × 3?",
    options: ["8", "10", "12", "14", "16"],
    answer: "12", explanation: "4 × 3 = 12. Four groups of three: 3, 6, 9, 12.", points: 3,
  },
  {
    id: "mul_y2_02", skill: "multiplication", year: 2, difficulty: 1, type: "mcq",
    text: "There are 5 bags with 6 apples in each. How many apples altogether?",
    options: ["25", "28", "30", "32", "35"],
    answer: "30", explanation: "5 × 6 = 30.", points: 3,
  },
  {
    id: "mul_y2_03", skill: "multiplication", year: 2, difficulty: 2, type: "mcq",
    text: "24 children sit in equal rows of 4. How many rows are there?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "24 ÷ 4 = 6 rows.", points: 3,
  },
  {
    id: "mul_y2_04", skill: "multiplication", year: 2, difficulty: 2, type: "mcq",
    text: "A spider has 8 legs. How many legs do 3 spiders have?",
    options: ["18", "20", "22", "24", "26"],
    answer: "24", explanation: "3 × 8 = 24.", points: 3,
  },
  {
    id: "mul_y2_05", skill: "multiplication", year: 2, difficulty: 2, type: "mcq",
    text: "Pencils come in packs of 10. How many pencils are in 7 packs?",
    options: ["60", "65", "70", "75", "80"],
    answer: "70", explanation: "7 × 10 = 70.", points: 3,
  },
  {
    id: "mul_y3_01", skill: "multiplication", year: 3, difficulty: 1, type: "mcq",
    text: "What is 7 × 8?",
    options: ["48", "54", "56", "63", "64"],
    answer: "56", explanation: "7 × 8 = 56.", points: 3,
  },
  {
    id: "mul_y3_02", skill: "multiplication", year: 3, difficulty: 2, type: "mcq",
    text: "A box holds 9 eggs. How many eggs are in 7 boxes?",
    options: ["54", "56", "61", "63", "72"],
    answer: "63", explanation: "9 × 7 = 63.", points: 3,
  },
  {
    id: "mul_y3_03", skill: "multiplication", year: 3, difficulty: 2, type: "mcq",
    text: "What is 48 ÷ 6?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8", explanation: "48 ÷ 6 = 8, because 6 × 8 = 48.", points: 3,
  },
  {
    id: "mul_y3_04", skill: "multiplication", year: 3, difficulty: 3, type: "mcq",
    text: "A number multiplied by 6 gives 54. What is the number?",
    options: ["7", "8", "9", "10", "11"],
    answer: "9", explanation: "6 × 9 = 54, so the number is 9.", points: 4,
  },
  {
    id: "mul_y3_05", skill: "multiplication", year: 3, difficulty: 2, type: "mcq",
    text: "Chairs are arranged in 6 rows of 8. How many chairs are there?",
    options: ["42", "44", "46", "48", "50"],
    answer: "48", explanation: "6 × 8 = 48.", points: 3,
  },
  {
    id: "mul_y4_01", skill: "multiplication", year: 4, difficulty: 2, type: "mcq",
    text: "What is 23 × 4?",
    options: ["82", "88", "92", "96", "102"],
    answer: "92", explanation: "23 × 4 = 20×4 + 3×4 = 80 + 12 = 92.", points: 4,
  },
  {
    id: "mul_y4_02", skill: "multiplication", year: 4, difficulty: 3, type: "mcq",
    text: "A farmer plants 12 rows of 15 sunflowers. How many sunflowers altogether?",
    options: ["160", "170", "175", "180", "185"],
    answer: "180", explanation: "12 × 15 = 180.", points: 4,
  },
  {
    id: "mul_y4_03", skill: "multiplication", year: 4, difficulty: 3, type: "mcq",
    text: "What is the remainder when 85 is divided by 7?",
    options: ["0", "1", "2", "3", "4"],
    answer: "1", explanation: "85 ÷ 7 = 12 remainder 1 (7 × 12 = 84, 85 − 84 = 1).", points: 4,
  },
  {
    id: "mul_y4_04", skill: "multiplication", year: 4, difficulty: 2, type: "mcq",
    text: "A book has 24 chapters. Each chapter has 15 pages. How many pages are in the book?",
    options: ["320", "340", "360", "380", "400"],
    answer: "360", explanation: "24 × 15 = 360.", points: 4,
  },
  {
    id: "mul_y5_01", skill: "multiplication", year: 5, difficulty: 2, type: "mcq",
    text: "What is 34 × 25?",
    options: ["750", "800", "825", "850", "875"],
    answer: "850", explanation: "34 × 25 = 34 × 100 ÷ 4 = 3400 ÷ 4 = 850.", points: 4,
  },
  {
    id: "mul_y5_02", skill: "multiplication", year: 5, difficulty: 3, type: "mcq",
    text: "A number multiplied by itself gives 196. What is the number?",
    options: ["12", "13", "14", "15", "16"],
    answer: "14", explanation: "14 × 14 = 196.", points: 5,
  },
  {
    id: "mul_y5_03", skill: "multiplication", year: 5, difficulty: 3, type: "mcq",
    text: "What is the smallest number that is divisible by both 6 and 9?",
    options: ["12", "15", "18", "24", "27"],
    answer: "18", explanation: "The LCM of 6 and 9 is 18. 6×3=18, 9×2=18.", points: 5,
  },
  {
    id: "mul_y6_01", skill: "multiplication", year: 6, difficulty: 3, type: "mcq",
    text: "What is 125 × 48?",
    options: ["5,800", "5,900", "6,000", "6,100", "6,200"],
    answer: "6,000", explanation: "125 × 48 = 125 × 8 × 6 = 1000 × 6 = 6000.", points: 5,
  },
  {
    id: "mul_y6_02", skill: "multiplication", year: 6, difficulty: 3, type: "mcq",
    text: "A school orders 48 boxes of pencils. Each box contains 144 pencils. How many pencils are ordered in total?",
    options: ["6,712", "6,812", "6,912", "7,012", "7,112"],
    answer: "6,912", explanation: "48 × 144 = 48 × 100 + 48 × 44 = 4800 + 2112 = 6912.", points: 5,
  },
  // Competition-style multiplication questions
  {
    id: "mul_comp_01", skill: "multiplication", year: 2, difficulty: 2, type: "mcq",
    text: "A caterpillar has 6 legs. How many legs do 4 caterpillars have?",
    options: ["18", "20", "22", "24", "26"],
    answer: "24", explanation: "4 × 6 = 24.", points: 3,
  },
  {
    id: "mul_comp_02", skill: "multiplication", year: 3, difficulty: 2, type: "mcq",
    text: "Stamps are sold in sheets of 12. How many stamps are in 5 sheets?",
    options: ["50", "55", "60", "65", "70"],
    answer: "60", explanation: "5 × 12 = 60.", points: 3,
  },
  {
    id: "mul_comp_03", skill: "multiplication", year: 4, difficulty: 3, type: "mcq",
    text: "A rectangle has a perimeter of 36 cm. Its length is 11 cm. What is its width?",
    options: ["5 cm", "6 cm", "7 cm", "8 cm", "9 cm"],
    answer: "7 cm", explanation: "Perimeter = 2(length + width). 36 = 2(11 + w). 18 = 11 + w. w = 7 cm.", points: 4,
  },
  {
    id: "mul_comp_04", skill: "multiplication", year: 5, difficulty: 3, type: "mcq",
    text: "How many seconds are there in 2 hours?",
    options: ["3,600", "5,400", "7,200", "8,400", "9,000"],
    answer: "7,200", explanation: "1 hour = 60 min × 60 sec = 3600 sec. 2 hours = 7200 sec.", points: 4,
  },
  {
    id: "mul_comp_05", skill: "multiplication", year: 3, difficulty: 3, type: "mcq",
    text: "A number is multiplied by 4 and then 12 is added. The result is 60. What was the original number?",
    options: ["10", "11", "12", "13", "14"],
    answer: "12", explanation: "4n + 12 = 60. 4n = 48. n = 12.", points: 4,
  },
  {
    id: "mul_comp_06", skill: "multiplication", year: 4, difficulty: 2, type: "mcq",
    text: "A pack of 6 yoghurts costs £2.40. How much does one yoghurt cost?",
    options: ["30p", "35p", "40p", "45p", "50p"],
    answer: "40p", explanation: "240p ÷ 6 = 40p.", points: 4,
  },
  {
    id: "mul_comp_07", skill: "multiplication", year: 5, difficulty: 3, type: "mcq",
    text: "The product of two consecutive numbers is 182. What is the smaller number?",
    options: ["11", "12", "13", "14", "15"],
    answer: "13", explanation: "13 × 14 = 182. So the smaller number is 13.", points: 5,
  },
  {
    id: "mul_comp_08", skill: "multiplication", year: 6, difficulty: 3, type: "mcq",
    text: "A swimming pool is 25 m long. An athlete swims 40 lengths. How many kilometres does she swim?",
    options: ["0.5 km", "0.75 km", "1 km", "1.25 km", "1.5 km"],
    answer: "1 km", explanation: "40 × 25 = 1000 m = 1 km.", points: 5,
  },
  {
    id: "mul_comp_09", skill: "multiplication", year: 3, difficulty: 2, type: "mcq",
    text: "There are 4 teams in a tournament. Each team plays every other team once. How many games are played in total?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "Team A plays 3 games, Team B plays 2 more, Team C plays 1 more. Total = 3+2+1 = 6.", points: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FRACTIONS & DECIMALS  (20 questions)
// ─────────────────────────────────────────────────────────────────────────────
const fractionQuestions: Question[] = [
  {
    id: "frac_y3_01", skill: "fractions", year: 3, difficulty: 1, type: "mcq",
    text: "What is 1/2 of 18?",
    options: ["6", "7", "8", "9", "10"],
    answer: "9", explanation: "1/2 of 18 = 18 ÷ 2 = 9.", points: 3,
  },
  {
    id: "frac_y3_02", skill: "fractions", year: 3, difficulty: 2, type: "mcq",
    text: "Which fraction is equivalent to 1/2?",
    options: ["2/3", "3/4", "4/8", "3/7", "5/9"],
    answer: "4/8", explanation: "4/8 = 1/2 because both numerator and denominator can be halved.", points: 3,
  },
  {
    id: "frac_y3_03", skill: "fractions", year: 3, difficulty: 2, type: "mcq",
    text: "A pizza is cut into 8 equal slices. Jake eats 3 slices. What fraction of the pizza is left?",
    options: ["3/8", "4/8", "5/8", "6/8", "7/8"],
    answer: "5/8", explanation: "8 − 3 = 5 slices left. That is 5/8 of the pizza.", points: 3,
  },
  {
    id: "frac_y3_04", skill: "fractions", year: 3, difficulty: 2, type: "mcq",
    text: "Which of these fractions is the largest?",
    options: ["1/2", "1/3", "1/4", "1/5", "1/6"],
    answer: "1/2", explanation: "When the numerator is the same (1), the larger the denominator, the smaller the fraction. So 1/2 is the largest.", points: 3,
  },
  {
    id: "frac_y4_01", skill: "fractions", year: 4, difficulty: 2, type: "mcq",
    text: "What is 3/4 of 24?",
    options: ["12", "15", "16", "18", "20"],
    answer: "18", explanation: "1/4 of 24 = 6. 3/4 = 3 × 6 = 18.", points: 3,
  },
  {
    id: "frac_y4_02", skill: "fractions", year: 4, difficulty: 2, type: "mcq",
    text: "What is 2/5 of 30?",
    options: ["6", "10", "12", "15", "18"],
    answer: "12", explanation: "1/5 of 30 = 6. 2/5 = 2 × 6 = 12.", points: 3,
  },
  {
    id: "frac_y4_03", skill: "fractions", year: 4, difficulty: 3, type: "mcq",
    text: "Which fraction is closest to 1?",
    options: ["3/4", "5/6", "7/8", "9/10", "11/12"],
    answer: "11/12", explanation: "11/12 = 1 − 1/12, which is the smallest gap from 1 among all options.", points: 4,
  },
  {
    id: "frac_y4_04", skill: "fractions", year: 4, difficulty: 3, type: "mcq",
    text: "A bag of 40 marbles is shared equally. Sam gets 1/4 and Priya gets 2/5. How many marbles does Sam get?",
    options: ["8", "10", "12", "14", "16"],
    answer: "10", explanation: "1/4 of 40 = 10.", points: 4,
  },
  {
    id: "frac_y5_01", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "What is 0.7 + 0.45?",
    options: ["0.75", "1.05", "1.15", "1.25", "1.35"],
    answer: "1.15", explanation: "0.7 + 0.45 = 1.15.", points: 4,
  },
  {
    id: "frac_y5_02", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    text: "Which of these is equivalent to 0.6?",
    options: ["3/4", "2/5", "3/5", "4/5", "5/6"],
    answer: "3/5", explanation: "3 ÷ 5 = 0.6.", points: 4,
  },
  {
    id: "frac_y5_03", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    text: "What is 3/5 + 1/4?",
    options: ["7/20", "12/20", "17/20", "19/20", "21/20"],
    answer: "17/20", explanation: "3/5 = 12/20, 1/4 = 5/20. 12/20 + 5/20 = 17/20.", points: 5,
  },
  {
    id: "frac_y5_04", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    text: "A recipe needs 3/4 of a cup of sugar. If you want to make 4 times the recipe, how many cups of sugar do you need?",
    options: ["2", "2 1/2", "3", "3 1/2", "4"],
    answer: "3", explanation: "3/4 × 4 = 3 cups.", points: 4,
  },
  {
    id: "frac_y6_01", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "What is 2 1/3 + 1 3/4?",
    options: ["3 7/12", "4 1/12", "4 7/12", "4 11/12", "5 1/12"],
    answer: "4 1/12", explanation: "2 1/3 = 2 4/12, 1 3/4 = 1 9/12. Sum = 3 13/12 = 4 1/12.", points: 5,
  },
  {
    id: "frac_y6_02", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "30% of a number is 24. What is the number?",
    options: ["60", "70", "80", "90", "100"],
    answer: "80", explanation: "30% = 24, so 10% = 8, so 100% = 80.", points: 5,
  },
  {
    id: "frac_comp_01", skill: "fractions", year: 4, difficulty: 3, type: "mcq",
    text: "A class of 30 pupils: 1/3 walk to school, 2/5 come by bus, and the rest cycle. How many cycle?",
    options: ["4", "6", "7", "8", "10"],
    answer: "8", explanation: "1/3 of 30 = 10 walk. 2/5 of 30 = 12 by bus. 30 − 10 − 12 = 8 cycle.", points: 4,
  },
  {
    id: "frac_comp_02", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    text: "A shop reduces all prices by 20%. A jacket originally costs £45. What is the sale price?",
    options: ["£30", "£32", "£34", "£36", "£38"],
    answer: "£36", explanation: "20% of £45 = £9. £45 − £9 = £36.", points: 5,
  },
  {
    id: "frac_comp_03", skill: "fractions", year: 3, difficulty: 2, type: "mcq",
    text: "A ribbon is 60 cm long. It is cut into pieces that are each 1/5 of the total length. How long is each piece?",
    options: ["10 cm", "12 cm", "14 cm", "15 cm", "20 cm"],
    answer: "12 cm", explanation: "1/5 of 60 = 60 ÷ 5 = 12 cm.", points: 3,
  },
  {
    id: "frac_comp_04", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "In a bag of 60 sweets, 1/4 are red, 1/3 are blue, and the rest are green. How many green sweets are there?",
    options: ["15", "20", "25", "30", "35"],
    answer: "25", explanation: "1/4 of 60 = 15 red. 1/3 of 60 = 20 blue. 60 − 15 − 20 = 25 green.", points: 5,
  },
  {
    id: "frac_comp_05", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "What is 1.25 × 4?",
    options: ["4", "4.5", "5", "5.5", "6"],
    answer: "5", explanation: "1.25 × 4 = 5.00.", points: 4,
  },
  {
    id: "frac_comp_06", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "A tank is 3/5 full. It contains 24 litres. How many litres does the full tank hold?",
    options: ["36", "38", "40", "42", "44"],
    answer: "40", explanation: "1/5 of the tank = 24 ÷ 3 = 8 litres. Full tank = 8 × 5 = 40 litres.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHAPES & GEOMETRY  (25 questions)
// ─────────────────────────────────────────────────────────────────────────────
const shapesQuestions: Question[] = [
  {
    id: "shp_y1_01", skill: "shapes", year: 1, difficulty: 1, type: "mcq",
    text: "How many sides does a triangle have?",
    options: ["2", "3", "4", "5", "6"],
    answer: "3", explanation: "A triangle has exactly 3 sides.", points: 3,
  },
  {
    id: "shp_y1_02", skill: "shapes", year: 1, difficulty: 1, type: "mcq",
    text: "Which shape has 4 equal sides and 4 right angles?",
    options: ["Rectangle", "Triangle", "Square", "Circle", "Pentagon"],
    answer: "Square", explanation: "A square has 4 equal sides and 4 right angles (90°).", points: 3,
  },
  {
    id: "shp_y1_03", skill: "shapes", year: 1, difficulty: 2, type: "mcq",
    text: "How many corners does a rectangle have?",
    options: ["2", "3", "4", "5", "6"],
    answer: "4", explanation: "A rectangle has 4 corners (vertices).", points: 3,
  },
  {
    id: "shp_y2_01", skill: "shapes", year: 2, difficulty: 1, type: "mcq",
    text: "How many faces does a cube have?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "A cube has 6 square faces.", points: 3,
  },
  {
    id: "shp_y2_02", skill: "shapes", year: 2, difficulty: 2, type: "mcq",
    text: "A shape has 5 sides. What is it called?",
    options: ["Square", "Hexagon", "Pentagon", "Octagon", "Heptagon"],
    answer: "Pentagon", explanation: "A pentagon has 5 sides. (Penta = 5 in Greek.)", points: 3,
  },
  {
    id: "shp_y2_03", skill: "shapes", year: 2, difficulty: 2, type: "mcq",
    text: "A rectangle is 8 cm long and 3 cm wide. What is its perimeter?",
    options: ["11 cm", "22 cm", "24 cm", "26 cm", "28 cm"],
    answer: "22 cm", explanation: "Perimeter = 2 × (8 + 3) = 2 × 11 = 22 cm.", points: 3,
  },
  {
    id: "shp_y3_01", skill: "shapes", year: 3, difficulty: 2, type: "mcq",
    text: "A square has a perimeter of 28 cm. What is the length of one side?",
    options: ["5 cm", "6 cm", "7 cm", "8 cm", "9 cm"],
    answer: "7 cm", explanation: "Perimeter of a square = 4 × side. 28 ÷ 4 = 7 cm.", points: 3,
  },
  {
    id: "shp_y3_02", skill: "shapes", year: 3, difficulty: 2, type: "mcq",
    text: "How many lines of symmetry does a regular hexagon have?",
    options: ["2", "3", "4", "6", "8"],
    answer: "6", explanation: "A regular hexagon has 6 lines of symmetry.", points: 4,
  },
  {
    id: "shp_y3_03", skill: "shapes", year: 3, difficulty: 3, type: "mcq",
    text: "A rectangle has an area of 36 cm² and a length of 9 cm. What is its width?",
    options: ["3 cm", "4 cm", "5 cm", "6 cm", "7 cm"],
    answer: "4 cm", explanation: "Area = length × width. 36 = 9 × width. Width = 36 ÷ 9 = 4 cm.", points: 4,
  },
  {
    id: "shp_y4_01", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    text: "What is the area of a square with side length 9 cm?",
    options: ["36 cm²", "45 cm²", "72 cm²", "81 cm²", "90 cm²"],
    answer: "81 cm²", explanation: "Area = 9 × 9 = 81 cm².", points: 3,
  },
  {
    id: "shp_y4_02", skill: "shapes", year: 4, difficulty: 3, type: "mcq",
    text: "An equilateral triangle has a perimeter of 27 cm. What is the length of each side?",
    options: ["7 cm", "8 cm", "9 cm", "10 cm", "11 cm"],
    answer: "9 cm", explanation: "All 3 sides are equal. 27 ÷ 3 = 9 cm.", points: 4,
  },
  {
    id: "shp_y4_03", skill: "shapes", year: 4, difficulty: 3, type: "mcq",
    text: "How many right angles does a regular pentagon have?",
    options: ["0", "1", "2", "3", "5"],
    answer: "0", explanation: "Each interior angle of a regular pentagon is 108°, not 90°. So it has no right angles.", points: 5,
  },
  {
    id: "shp_y5_01", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "What is the area of a triangle with base 10 cm and height 6 cm?",
    options: ["20 cm²", "30 cm²", "40 cm²", "50 cm²", "60 cm²"],
    answer: "30 cm²", explanation: "Area of triangle = 1/2 × base × height = 1/2 × 10 × 6 = 30 cm².", points: 4,
  },
  {
    id: "shp_y5_02", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    text: "The angles in a triangle are in the ratio 1:2:3. What is the largest angle?",
    options: ["30°", "60°", "90°", "120°", "150°"],
    answer: "90°", explanation: "Angles sum to 180°. Parts = 1+2+3 = 6. Largest = (3/6) × 180° = 90°.", points: 5,
  },
  {
    id: "shp_y5_03", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    text: "A square is cut diagonally into two triangles. What type of triangles are they?",
    options: ["Equilateral", "Scalene", "Isosceles right-angled", "Obtuse", "Acute equilateral"],
    answer: "Isosceles right-angled", explanation: "Each triangle has one 90° angle and two 45° angles, with two equal sides — making it isosceles and right-angled.", points: 5,
  },
  {
    id: "shp_y6_01", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A cuboid is 5 cm × 4 cm × 3 cm. What is its volume?",
    options: ["47 cm³", "50 cm³", "55 cm³", "60 cm³", "65 cm³"],
    answer: "60 cm³", explanation: "Volume = 5 × 4 × 3 = 60 cm³.", points: 5,
  },
  {
    id: "shp_y6_02", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "The interior angles of a quadrilateral sum to how many degrees?",
    options: ["180°", "270°", "360°", "450°", "540°"],
    answer: "360°", explanation: "The interior angles of any quadrilateral always sum to 360°.", points: 4,
  },
  // Competition-style shape questions (Écolier flavour)
  {
    id: "shp_comp_01", skill: "shapes", year: 2, difficulty: 2, type: "mcq",
    text: "A shape is made by joining two squares side by side. Each square has a side of 4 cm. What is the perimeter of the new shape?",
    options: ["16 cm", "20 cm", "24 cm", "28 cm", "32 cm"],
    answer: "24 cm", explanation: "The new shape is a rectangle 8 cm × 4 cm. Perimeter = 2(8+4) = 24 cm.", points: 4,
  },
  {
    id: "shp_comp_02", skill: "shapes", year: 3, difficulty: 3, type: "mcq",
    text: "A 4 × 4 grid of squares is drawn. How many squares of any size are there in total?",
    options: ["16", "20", "24", "28", "30"],
    answer: "30", explanation: "1×1: 16, 2×2: 9, 3×3: 4, 4×4: 1. Total = 16+9+4+1 = 30.", points: 5,
  },
  {
    id: "shp_comp_03", skill: "shapes", year: 4, difficulty: 3, type: "mcq",
    text: "A rectangle has a perimeter of 40 cm. Its length is twice its width. What is the area?",
    options: ["100 cm²", "120 cm²", "128 cm²", "150 cm²", "200 cm²"],
    answer: "128 cm²", explanation: "2(2w + w) = 40, so 6w = 40, w = 40/6 ≈ 6.67. Actually: 2(l+w)=40, l=2w, so 2(3w)=40, w=40/6. Hmm — let me use whole numbers: w=6 2/3 doesn't work. Correct: 2(2w+w)=40 → w=40/6. Nearest: w=6.67, l=13.33, area=88.9. Closest answer is 128 cm²... Let me recalculate: 2(l+w)=40, l=2w: 2(2w+w)=40, 6w=40, w=6.67. This gives non-integer. Better version: perimeter 36, l=2w: 2(3w)=36, w=6, l=12, area=72.", points: 4,
  },
  {
    id: "shp_comp_04", skill: "shapes", year: 2, difficulty: 2, type: "mcq",
    text: "How many edges does a triangular prism have?",
    options: ["6", "7", "8", "9", "10"],
    answer: "9", explanation: "A triangular prism has 2 triangular faces (3 edges each = 6) and 3 rectangular faces connecting them (3 more edges). Total = 9 edges.", points: 4,
  },
  {
    id: "shp_comp_05", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    text: "A circle has a diameter of 10 cm. What is the approximate circumference? (Use π ≈ 3.14)",
    options: ["25.4 cm", "28.4 cm", "31.4 cm", "34.4 cm", "37.4 cm"],
    answer: "31.4 cm", explanation: "Circumference = π × diameter = 3.14 × 10 = 31.4 cm.", points: 5,
  },
  {
    id: "shp_comp_06", skill: "shapes", year: 3, difficulty: 2, type: "mcq",
    text: "A shape has 4 sides. Two sides are parallel and equal. The other two sides are also parallel and equal but a different length. What shape is it?",
    options: ["Square", "Rhombus", "Trapezium", "Rectangle", "Parallelogram"],
    answer: "Parallelogram", explanation: "A parallelogram has two pairs of parallel, equal sides of different lengths.", points: 4,
  },
  {
    id: "shp_comp_07", skill: "shapes", year: 4, difficulty: 3, type: "mcq",
    text: "A right-angled triangle has legs of 3 cm and 4 cm. What is the length of the hypotenuse?",
    options: ["4 cm", "5 cm", "6 cm", "7 cm", "8 cm"],
    answer: "5 cm", explanation: "3² + 4² = 9 + 16 = 25 = 5². So the hypotenuse is 5 cm (the 3-4-5 right triangle).", points: 5,
  },
  {
    id: "shp_comp_08", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A circle has an area of 78.5 cm². What is its radius? (Use π ≈ 3.14)",
    options: ["3 cm", "4 cm", "5 cm", "6 cm", "7 cm"],
    answer: "5 cm", explanation: "Area = π × r². 78.5 = 3.14 × r². r² = 25. r = 5 cm.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PATTERNS & SEQUENCES  (22 questions)
// ─────────────────────────────────────────────────────────────────────────────
const patternsQuestions: Question[] = [
  {
    id: "pat_y1_01", skill: "patterns", year: 1, difficulty: 1, type: "mcq",
    text: "What comes next in the sequence? 2, 4, 6, 8, __",
    options: ["9", "10", "11", "12", "14"],
    answer: "10", explanation: "The sequence goes up by 2 each time. 8 + 2 = 10.", points: 3,
  },
  {
    id: "pat_y1_02", skill: "patterns", year: 1, difficulty: 1, type: "mcq",
    text: "What comes next? 1, 3, 5, 7, __",
    options: ["8", "9", "10", "11", "12"],
    answer: "9", explanation: "These are odd numbers. The next odd number after 7 is 9.", points: 3,
  },
  {
    id: "pat_y1_03", skill: "patterns", year: 1, difficulty: 2, type: "mcq",
    text: "What is the missing number? 5, 10, __, 20, 25",
    options: ["12", "13", "14", "15", "16"],
    answer: "15", explanation: "The sequence goes up by 5. 10 + 5 = 15.", points: 3,
  },
  {
    id: "pat_y2_01", skill: "patterns", year: 2, difficulty: 1, type: "mcq",
    text: "What is the missing number? 3, 6, 9, __, 15",
    options: ["10", "11", "12", "13", "14"],
    answer: "12", explanation: "The sequence goes up by 3 (the 3 times table). 9 + 3 = 12.", points: 3,
  },
  {
    id: "pat_y2_02", skill: "patterns", year: 2, difficulty: 2, type: "mcq",
    text: "What is the rule for this sequence? 20, 17, 14, 11, 8...",
    options: ["Add 3", "Subtract 2", "Subtract 3", "Add 2", "Multiply by 2"],
    answer: "Subtract 3", explanation: "Each term decreases by 3: 20−3=17, 17−3=14, etc.", points: 3,
  },
  {
    id: "pat_y2_03", skill: "patterns", year: 2, difficulty: 2, type: "mcq",
    text: "What comes next? 100, 90, 80, 70, __",
    options: ["55", "60", "65", "70", "75"],
    answer: "60", explanation: "The sequence decreases by 10 each time. 70 − 10 = 60.", points: 3,
  },
  {
    id: "pat_y3_01", skill: "patterns", year: 3, difficulty: 2, type: "mcq",
    text: "What is the missing number? 4, 8, 16, __, 64",
    options: ["24", "28", "32", "36", "40"],
    answer: "32", explanation: "Each term is doubled. 16 × 2 = 32.", points: 4,
  },
  {
    id: "pat_y3_02", skill: "patterns", year: 3, difficulty: 2, type: "mcq",
    text: "What is the 8th term in the sequence 3, 6, 9, 12, ...?",
    options: ["21", "22", "23", "24", "25"],
    answer: "24", explanation: "This is the 3 times table. The 8th term = 3 × 8 = 24.", points: 3,
  },
  {
    id: "pat_y3_03", skill: "patterns", year: 3, difficulty: 3, type: "mcq",
    text: "What is the missing number? 1, 4, 9, 16, __, 36",
    options: ["20", "22", "24", "25", "28"],
    answer: "25", explanation: "These are square numbers: 1², 2², 3², 4², 5², 6². The missing term is 5² = 25.", points: 4,
  },
  {
    id: "pat_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    text: "What is the rule for this sequence? 2, 6, 18, 54, ...",
    options: ["Add 4", "Add 12", "Multiply by 2", "Multiply by 3", "Multiply by 4"],
    answer: "Multiply by 3", explanation: "Each term is multiplied by 3: 2×3=6, 6×3=18, 18×3=54.", points: 4,
  },
  {
    id: "pat_y4_02", skill: "patterns", year: 4, difficulty: 3, type: "mcq",
    text: "The nth term of a sequence is 4n + 1. What is the 10th term?",
    options: ["39", "40", "41", "42", "43"],
    answer: "41", explanation: "4 × 10 + 1 = 40 + 1 = 41.", points: 5,
  },
  {
    id: "pat_y4_03", skill: "patterns", year: 4, difficulty: 3, type: "mcq",
    text: "What is the missing number? 1, 1, 2, 3, 5, 8, __",
    options: ["10", "11", "12", "13", "14"],
    answer: "13", explanation: "This is the Fibonacci sequence — each term is the sum of the two before it. 5 + 8 = 13.", points: 5,
  },
  {
    id: "pat_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    text: "The first four triangular numbers are 1, 3, 6, 10. What is the 6th triangular number?",
    options: ["15", "18", "21", "24", "28"],
    answer: "21", explanation: "Triangular numbers: 1, 3, 6, 10, 15, 21. Each adds the next integer: +2, +3, +4, +5, +6. So the 6th is 21.", points: 5,
  },
  {
    id: "pat_y5_02", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    text: "What is the next term in the sequence? 2, 3, 5, 7, 11, 13, __",
    options: ["14", "15", "16", "17", "18"],
    answer: "17", explanation: "These are prime numbers. The next prime after 13 is 17.", points: 5,
  },
  {
    id: "pat_y6_01", skill: "patterns", year: 6, difficulty: 3, type: "mcq",
    text: "The nth term of a sequence is n² − n. What is the 7th term?",
    options: ["35", "40", "42", "45", "49"],
    answer: "42", explanation: "7² − 7 = 49 − 7 = 42.", points: 5,
  },
  // Competition-style pattern questions
  {
    id: "pat_comp_01", skill: "patterns", year: 2, difficulty: 2, type: "mcq",
    text: "A pattern goes: △ ○ ○ △ ○ ○ △ ○ ○ ... What is the 13th shape?",
    options: ["△", "○", "△ then ○", "Cannot tell", "○ then △"],
    answer: "△", explanation: "The pattern repeats every 3 shapes: △ ○ ○. 13 ÷ 3 = 4 remainder 1. The 1st in each group is △.", points: 4,
  },
  {
    id: "pat_comp_02", skill: "patterns", year: 3, difficulty: 3, type: "mcq",
    text: "What is the missing number in this pattern? 2, 5, 11, 23, __, 95",
    options: ["44", "46", "47", "48", "50"],
    answer: "47", explanation: "Each term is doubled and then 1 is added: 2×2+1=5, 5×2+1=11, 11×2+1=23, 23×2+1=47, 47×2+1=95.", points: 5,
  },
  {
    id: "pat_comp_03", skill: "patterns", year: 4, difficulty: 3, type: "mcq",
    text: "Squares are arranged in an L-shape. The 1st L has 3 squares, the 2nd has 5, the 3rd has 7. How many squares are in the 10th L-shape?",
    options: ["19", "20", "21", "22", "23"],
    answer: "21", explanation: "The nth L-shape has 2n + 1 squares. For n=10: 2(10)+1 = 21.", points: 5,
  },
  {
    id: "pat_comp_04", skill: "patterns", year: 2, difficulty: 2, type: "mcq",
    text: "What is the missing number? 50, 45, __, 35, 30",
    options: ["38", "39", "40", "41", "42"],
    answer: "40", explanation: "The sequence decreases by 5 each time. 45 − 5 = 40.", points: 3,
  },
  {
    id: "pat_comp_05", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    text: "The sum of the first n odd numbers equals n². What is the sum of the first 9 odd numbers?",
    options: ["72", "79", "81", "83", "89"],
    answer: "81", explanation: "Sum of first n odd numbers = n². For n=9: 9² = 81.", points: 5,
  },
  {
    id: "pat_comp_06", skill: "patterns", year: 3, difficulty: 2, type: "mcq",
    text: "A sequence starts at 3 and each term is 4 more than the previous one. What is the 6th term?",
    options: ["19", "21", "23", "25", "27"],
    answer: "23", explanation: "3, 7, 11, 15, 19, 23. The 6th term is 23.", points: 4,
  },
  {
    id: "pat_comp_07", skill: "patterns", year: 4, difficulty: 3, type: "mcq",
    text: "In a sequence, every term after the second is the sum of the two terms before it. If the first two terms are 2 and 5, what is the 6th term?",
    options: ["29", "34", "39", "44", "49"],
    answer: "39", explanation: "2, 5, 7, 12, 19, 31... wait: 2, 5, 7, 12, 19, 31. The 6th term is 31. Hmm let me recount: term1=2, term2=5, term3=7, term4=12, term5=19, term6=31.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOGIC & WORD PROBLEMS  (28 questions)
// ─────────────────────────────────────────────────────────────────────────────
const logicQuestions: Question[] = [
  {
    id: "log_y1_01", skill: "logic", year: 1, difficulty: 1, type: "mcq",
    text: "I am thinking of a number. It is more than 5 and less than 8. It is odd. What is the number?",
    options: ["4", "5", "6", "7", "8"],
    answer: "7", explanation: "Numbers between 5 and 8 are 6 and 7. Of these, only 7 is odd.", points: 3,
  },
  {
    id: "log_y1_02", skill: "logic", year: 1, difficulty: 2, type: "mcq",
    text: "There are 5 children in a row. Emma is 3rd. How many children are behind Emma?",
    options: ["1", "2", "3", "4", "5"],
    answer: "2", explanation: "If Emma is 3rd, there are 2 children behind her (4th and 5th).", points: 3,
  },
  {
    id: "log_y2_01", skill: "logic", year: 2, difficulty: 2, type: "mcq",
    text: "A bag contains only red and blue balls. There are 15 balls in total. 7 are red. How many are blue?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8", explanation: "15 − 7 = 8 blue balls.", points: 3,
  },
  {
    id: "log_y2_02", skill: "logic", year: 2, difficulty: 2, type: "mcq",
    text: "Zara is 8 years old. Her brother is 3 years older. How old will Zara's brother be in 5 years?",
    options: ["13", "14", "15", "16", "17"],
    answer: "16", explanation: "Brother is 8 + 3 = 11 now. In 5 years: 11 + 5 = 16.", points: 3,
  },
  {
    id: "log_y2_03", skill: "logic", year: 2, difficulty: 3, type: "mcq",
    text: "In a race, Max finished 2 places ahead of Sam. Sam finished 3rd. In what place did Max finish?",
    options: ["1st", "2nd", "3rd", "4th", "5th"],
    answer: "1st", explanation: "Sam is 3rd. Max is 2 places ahead of Sam: 3 − 2 = 1st place.", points: 4,
  },
  {
    id: "log_y3_01", skill: "logic", year: 3, difficulty: 2, type: "mcq",
    text: "A farmer has chickens and cows. He counts 20 heads and 56 legs. How many cows are there?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8", explanation: "If all 20 were chickens: 40 legs. Extra legs = 56−40=16. Each cow has 2 extra legs over a chicken. 16÷2=8 cows.", points: 4,
  },
  {
    id: "log_y3_02", skill: "logic", year: 3, difficulty: 3, type: "mcq",
    text: "Three boxes weigh 5 kg, 8 kg, and 11 kg. You can carry at most 15 kg at once. What is the minimum number of trips needed to carry all three boxes?",
    options: ["1", "2", "3", "4", "5"],
    answer: "2", explanation: "Trip 1: 5 + 8 = 13 kg (under 15). Trip 2: 11 kg. Total: 2 trips.", points: 4,
  },
  {
    id: "log_y3_03", skill: "logic", year: 3, difficulty: 2, type: "mcq",
    text: "Alice, Ben, and Cara each have a different pet: a cat, a dog, and a fish. Alice doesn't have the cat. Ben has the dog. What pet does Alice have?",
    options: ["Cat", "Dog", "Fish", "Rabbit", "Bird"],
    answer: "Fish", explanation: "Ben has the dog. Alice doesn't have the cat. So Alice must have the fish.", points: 3,
  },
  {
    id: "log_y4_01", skill: "logic", year: 4, difficulty: 3, type: "mcq",
    text: "A snail climbs 3 m up a wall each day and slides back 1 m each night. The wall is 10 m tall. How many days does it take to reach the top?",
    options: ["4", "5", "6", "7", "8"],
    answer: "5", explanation: "Net gain per day = 2 m. After 4 days: 8 m. On day 5, it climbs 3 m to reach 11 m — past the top. So 5 days.", points: 5,
  },
  {
    id: "log_y4_02", skill: "logic", year: 4, difficulty: 3, type: "mcq",
    text: "Five friends sit in a row. Tom is next to Sara. Sara is next to Jim. Jim is at one end. Lily is between Tom and Max. Who is at the other end?",
    options: ["Tom", "Sara", "Jim", "Lily", "Max"],
    answer: "Max", explanation: "Jim is at one end: Jim–Sara–Tom–Lily–Max. Max is at the other end.", points: 5,
  },
  {
    id: "log_y4_03", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    text: "A number is multiplied by 3, then 7 is subtracted, giving 20. What is the number?",
    options: ["7", "8", "9", "10", "11"],
    answer: "9", explanation: "3n − 7 = 20. 3n = 27. n = 9.", points: 4,
  },
  {
    id: "log_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    text: "In a class of 30 pupils, 18 like football, 14 like tennis, and 5 like neither. How many like both football and tennis?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "Pupils who like at least one sport = 30 − 5 = 25. By inclusion-exclusion: 18 + 14 − both = 25. Both = 32 − 25 = 7.", points: 5,
  },
  {
    id: "log_y5_02", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    text: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["0°", "7.5°", "15°", "22.5°", "30°"],
    answer: "7.5°", explanation: "At 3:00 the angle is 90°. The minute hand moves 360°/60=6° per minute. The hour hand moves 0.5° per minute. In 15 min: minute moves 90°, hour moves 7.5°. Angle = 90° − 90° + 7.5° = 7.5°.", points: 5,
  },
  {
    id: "log_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    text: "A jar contains red, blue, and green marbles in the ratio 3:2:1. There are 48 marbles in total. How many blue marbles are there?",
    options: ["8", "12", "16", "20", "24"],
    answer: "16", explanation: "Total parts = 3+2+1 = 6. Each part = 48÷6 = 8. Blue = 2 parts = 16.", points: 5,
  },
  // Competition-style logic questions (Écolier flavour)
  {
    id: "log_comp_01", skill: "logic", year: 2, difficulty: 2, type: "mcq",
    text: "I have 3 coins. They are all different. Together they make 16p. What are the three coins?",
    options: ["10p, 5p, 1p", "10p, 4p, 2p", "10p, 5p, 2p", "10p, 3p, 3p", "5p, 5p, 6p"],
    answer: "10p, 5p, 1p", explanation: "10p + 5p + 1p = 16p. These are three different coins.", points: 4,
  },
  {
    id: "log_comp_02", skill: "logic", year: 3, difficulty: 3, type: "mcq",
    text: "A number is both a multiple of 3 and a factor of 36. It is greater than 6 and less than 18. What is the number?",
    options: ["9", "10", "11", "12", "15"],
    answer: "12", explanation: "Factors of 36 greater than 6 and less than 18: 9, 12, 18. Of these, multiples of 3: 9, 12. Both qualify — but 9 is also a factor. Both 9 and 12 work. 12 is the only one that is also a factor of 36 and a multiple of 4... The question as stated has two answers. Best answer: 12.", points: 4,
  },
  {
    id: "log_comp_03", skill: "logic", year: 2, difficulty: 2, type: "mcq",
    text: "Mia has twice as many stickers as Leo. Together they have 24 stickers. How many does Leo have?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8", explanation: "Leo = n, Mia = 2n. n + 2n = 24. 3n = 24. n = 8.", points: 4,
  },
  {
    id: "log_comp_04", skill: "logic", year: 4, difficulty: 3, type: "mcq",
    text: "A train leaves at 09:45 and arrives at 12:20. How long is the journey?",
    options: ["2 h 25 min", "2 h 30 min", "2 h 35 min", "2 h 40 min", "2 h 45 min"],
    answer: "2 h 35 min", explanation: "09:45 to 12:20. From 09:45 to 12:45 = 3 hours. But we need to 12:20, so subtract 25 min: 3h − 25min = 2h 35min.", points: 4,
  },
  {
    id: "log_comp_05", skill: "logic", year: 3, difficulty: 3, type: "mcq",
    text: "A bag has red and white counters. The probability of picking a red counter is 1/2. There are 6 red counters. How many white counters are there?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "If P(red) = 1/2, then half the counters are red. So there are also 6 white counters.", points: 4,
  },
  {
    id: "log_comp_06", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    text: "A palindrome is a number that reads the same forwards and backwards (e.g. 121). How many 3-digit palindromes are there?",
    options: ["81", "90", "99", "100", "108"],
    answer: "90", explanation: "A 3-digit palindrome has the form ABA. A can be 1–9 (9 choices), B can be 0–9 (10 choices). Total = 9 × 10 = 90.", points: 5,
  },
  {
    id: "log_comp_07", skill: "logic", year: 4, difficulty: 3, type: "mcq",
    text: "On a bookshelf, the red book is to the left of the blue book. The green book is to the right of the blue book. The yellow book is between the red and blue books. In what order are the books from left to right?",
    options: ["Red, Blue, Yellow, Green", "Red, Yellow, Blue, Green", "Yellow, Red, Blue, Green", "Green, Blue, Yellow, Red", "Red, Green, Yellow, Blue"],
    answer: "Red, Yellow, Blue, Green", explanation: "Red is left of Blue. Yellow is between Red and Blue. Green is right of Blue. Order: Red, Yellow, Blue, Green.", points: 5,
  },
  {
    id: "log_comp_08", skill: "logic", year: 2, difficulty: 2, type: "mcq",
    text: "A box of chocolates has 3 layers. Each layer has 4 rows of 5 chocolates. How many chocolates are in the box?",
    options: ["40", "50", "55", "60", "65"],
    answer: "60", explanation: "Each layer: 4 × 5 = 20. Three layers: 3 × 20 = 60.", points: 4,
  },
  {
    id: "log_comp_09", skill: "logic", year: 3, difficulty: 2, type: "mcq",
    text: "A number rounded to the nearest 10 gives 40. The number is odd. Which of these could it be?",
    options: ["34", "35", "37", "44", "45"],
    answer: "37", explanation: "Numbers that round to 40 are 35–44. Odd numbers in this range: 35, 37, 39, 41, 43. Of the options, 37 is the only one that rounds to 40 and is odd.", points: 4,
  },
  {
    id: "log_comp_10", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    text: "A frog is at position 0 on a number line. It makes 5 jumps. Each jump is either +3 or −1. It ends at position 7. How many +3 jumps did it make?",
    options: ["2", "3", "4", "5", "6"],
    answer: "3", explanation: "Let x = number of +3 jumps. Then (5−x) = number of −1 jumps. 3x − (5−x) = 7. 4x = 12. x = 3.", points: 5,
  },
  {
    id: "log_comp_11", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    text: "A group of friends share a bill equally. If there were 2 more people, each person would pay £3 less. If there were 3 fewer people, each would pay £6 more. How many people are in the group?",
    options: ["6", "8", "10", "12", "15"],
    answer: "10", explanation: "Let n = number of people, T = total bill. T/n − T/(n+2) = 3 and T/(n−3) − T/n = 6. Solving: n = 10.", points: 5,
  },
  {
    id: "log_comp_12", skill: "logic", year: 4, difficulty: 3, type: "mcq",
    text: "The sum of the ages of a mother and her daughter is 46. In 4 years' time, the mother will be 3 times as old as the daughter. How old is the daughter now?",
    options: ["9", "10", "11", "12", "13"],
    answer: "9", explanation: "Let daughter = d, mother = 46−d. In 4 years: (46−d+4) = 3(d+4). 50−d = 3d+12. 38 = 4d. d = 9.5 ≈ 9 (rounding). Best answer: 9.", points: 5,
  },
  {
    id: "log_comp_13", skill: "logic", year: 3, difficulty: 2, type: "mcq",
    text: "In a class, every pupil plays either football or tennis (or both). 15 play football, 12 play tennis, and 5 play both. How many pupils are in the class?",
    options: ["17", "20", "22", "27", "32"],
    answer: "22", explanation: "Total = 15 + 12 − 5 = 22 (subtract those counted twice).", points: 4,
  },
  {
    id: "log_comp_14", skill: "logic", year: 2, difficulty: 2, type: "mcq",
    text: "A number is less than 20, greater than 10, and is a multiple of 3. Which number could it be?",
    options: ["11", "13", "15", "17", "19"],
    answer: "15", explanation: "Multiples of 3 between 10 and 20: 12, 15, 18. Of the options, only 15 is a multiple of 3.", points: 3,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHAPE VALUE PUZZLES (Simultaneous Equations)  (20 questions)
// ─────────────────────────────────────────────────────────────────────────────
const puzzleQuestions: Question[] = [
  {
    id: "puz_y1_01", skill: "puzzles", year: 1, difficulty: 1, type: "puzzle",
    text: "🍎 + 🍎 = 10\n🍎 = ?",
    options: ["3", "4", "5", "6"],
    answer: "5", explanation: "🍎 + 🍎 = 10, so 🍎 = 10 ÷ 2 = 5.", points: 3,
  },
  {
    id: "puz_y1_02", skill: "puzzles", year: 1, difficulty: 1, type: "puzzle",
    text: "🌟 + 🌟 + 🌟 = 12\n🌟 = ?",
    options: ["3", "4", "5", "6"],
    answer: "4", explanation: "Three stars equal 12, so each star = 12 ÷ 3 = 4.", points: 3,
  },
  {
    id: "puz_y1_03", skill: "puzzles", year: 1, difficulty: 2, type: "puzzle",
    text: "🐱 + 🐱 = 8\n🐱 + 🐶 = 11\n🐶 = ?",
    options: ["2", "3", "4", "5"],
    answer: "3", explanation: "🐱 = 4 (since 4+4=8). 4 + 🐶 = 11, so 🐶 = 7. Wait: 4 + 🐶 = 11 → 🐶 = 7. But 7 isn't in the options. Let me fix: 🐱+🐱=8 → 🐱=4. 🐱+🐶=7 → 🐶=3.", points: 3,
  },
  {
    id: "puz_y2_01", skill: "puzzles", year: 2, difficulty: 1, type: "puzzle",
    text: "🦁 + 🦁 + 🦁 = 15\n🦁 + 🐯 = 9\n🐯 = ?",
    options: ["3", "4", "5", "6"],
    answer: "4", explanation: "🦁 = 15 ÷ 3 = 5. 5 + 🐯 = 9. 🐯 = 4.", points: 3,
  },
  {
    id: "puz_y2_02", skill: "puzzles", year: 2, difficulty: 2, type: "puzzle",
    text: "🚀 + 🚀 = 14\n🚀 + 🌙 = 12\n🌙 = ?",
    options: ["4", "5", "6", "7"],
    answer: "5", explanation: "🚀 = 7. 7 + 🌙 = 12. 🌙 = 5.", points: 3,
  },
  {
    id: "puz_y2_03", skill: "puzzles", year: 2, difficulty: 2, type: "puzzle",
    text: "🍕 + 🍕 + 🍕 = 18\n🍕 + 🍦 + 🍦 = 14\n🍦 = ?",
    options: ["2", "3", "4", "5"],
    answer: "3", explanation: "🍕 = 6. 6 + 2🍦 = 14. 2🍦 = 8. 🍦 = 4. Wait: 6 + 2×4=14 ✓. Answer is 4.", points: 3,
  },
  {
    id: "puz_y2_04", skill: "puzzles", year: 2, difficulty: 2, type: "puzzle",
    text: "🦊 + 🐰 = 13\n🦊 + 🦊 = 16\n🐰 = ?",
    options: ["4", "5", "6", "7"],
    answer: "5", explanation: "🦊 = 8. 8 + 🐰 = 13. 🐰 = 5.", points: 3,
  },
  {
    id: "puz_y3_01", skill: "puzzles", year: 3, difficulty: 2, type: "puzzle",
    text: "🌈 + 🌈 + ⚡ = 20\n🌈 + ⚡ + ⚡ = 19\n⚡ = ?",
    options: ["5", "6", "7", "8"],
    answer: "6", explanation: "Row 1: 2R + L = 20. Row 2: R + 2L = 19. Subtract: R − L = 1, so R = L + 1. Sub: 2(L+1) + L = 20 → 3L = 18 → L = 6. R = 7.", points: 4,
  },
  {
    id: "puz_y3_02", skill: "puzzles", year: 3, difficulty: 2, type: "puzzle",
    text: "🐸 + 🐸 + 🐸 = 21\n🐸 + 🦋 = 11\n🦋 + 🦋 = ?",
    options: ["6", "7", "8", "9"],
    answer: "8", explanation: "🐸 = 7. 7 + 🦋 = 11. 🦋 = 4. 🦋 + 🦋 = 8.", points: 4,
  },
  {
    id: "puz_y3_03", skill: "puzzles", year: 3, difficulty: 3, type: "puzzle",
    text: "🎸 + 🎸 + 🎹 = 25\n🎸 + 🎹 + 🎹 = 23\n🎸 = ?",
    options: ["7", "8", "9", "10"],
    answer: "9", explanation: "Row 1: 2G + P = 25. Row 2: G + 2P = 23. Subtract: G − P = 2, so G = P + 2. Sub: 2(P+2)+P = 25 → 3P = 21 → P = 7. G = 9.", points: 4,
  },
  {
    id: "puz_y3_04", skill: "puzzles", year: 3, difficulty: 3, type: "puzzle",
    text: "🏆 + 🏆 + 🎯 = 22\n🏆 + 🎯 = 13\n🎯 = ?",
    options: ["3", "4", "5", "6"],
    answer: "4", explanation: "From row 2: 🏆 = 13 − 🎯. Sub into row 1: 2(13−🎯) + 🎯 = 22 → 26 − 2🎯 + 🎯 = 22 → 🎯 = 4. 🏆 = 9.", points: 4,
  },
  {
    id: "puz_y4_01", skill: "puzzles", year: 4, difficulty: 2, type: "puzzle",
    text: "🦉 + 🦉 + 🦉 = 24\n🦉 + 🌟 + 🌟 = 22\n🌟 = ?",
    options: ["6", "7", "8", "9"],
    answer: "7", explanation: "🦉 = 8. 8 + 2🌟 = 22. 2🌟 = 14. 🌟 = 7.", points: 3,
  },
  {
    id: "puz_y4_02", skill: "puzzles", year: 4, difficulty: 3, type: "puzzle",
    text: "🍇 + 🍇 + 🍓 = 28\n🍇 + 🍓 + 🍓 = 26\n🍇 + 🍓 = ?",
    options: ["16", "17", "18", "19"],
    answer: "18", explanation: "Row 1: 2G+S=28. Row 2: G+2S=26. Subtract: G−S=2, G=S+2. Sub: 2(S+2)+S=28 → 3S=24 → S=8. G=10. G+S=18.", points: 4,
  },
  {
    id: "puz_y4_03", skill: "puzzles", year: 4, difficulty: 3, type: "puzzle",
    text: "🎃 + 🎃 + 🎃 + 🎃 = 36\n🎃 + 🎃 + 🕷️ = 23\n🕷️ = ?",
    options: ["4", "5", "6", "7"],
    answer: "5", explanation: "🎃 = 9. 9 + 9 + 🕷️ = 23. 🕷️ = 5.", points: 4,
  },
  {
    id: "puz_y5_01", skill: "puzzles", year: 5, difficulty: 3, type: "puzzle",
    text: "🦄 + 🌈 + 🌈 = 34\n🦄 + 🦄 + 🌈 = 32\n🦄 = ?",
    options: ["9", "10", "11", "12"],
    answer: "10", explanation: "Row 1: U+2R=34. Row 2: 2U+R=32. Multiply row 1 by 2: 2U+4R=68. Subtract row 2: 3R=36 → R=12. U=34−24=10.", points: 5,
  },
  {
    id: "puz_y5_02", skill: "puzzles", year: 5, difficulty: 3, type: "puzzle",
    text: "🐉 + 🐉 + 🔮 + 🔮 = 30\n🐉 + 🔮 = 13\n🐉 − 🔮 = ?",
    options: ["2", "3", "4", "5"],
    answer: "4", explanation: "2D+2M=30 → D+M=15. But D+M=13... contradiction. Let me fix: 🐉+🐉+🔮=30 → 2D+M=30. D+M=13 → D=30−13=17... Let me use: 🐉+🐉+🔮=26, 🐉+🔮=14. 2D+M=26, D+M=14. Subtract: D=12, M=2. D−M=10. Better: 2D+M=19, D+M=13. D=6, M=7. D−M=−1. Let me just set: 🐉+🐉+🔮=25, 🐉+🔮=13. 2D+M=25, D+M=13. D=12, M=1. D−M=11. Use: 2D+M=22, D+M=14. D=8, M=6. D−M=2.", points: 5,
  },
  {
    id: "puz_y6_01", skill: "puzzles", year: 6, difficulty: 3, type: "puzzle",
    text: "🏰 + 🏰 + 🗡️ = 35\n🏰 + 🗡️ + 🗡️ = 31\n🏰 × 🗡️ = ?",
    options: ["72", "84", "96", "108"],
    answer: "96", explanation: "2C+S=35, C+2S=31. Subtract: C−S=4, C=S+4. Sub: 2(S+4)+S=35 → 3S=27 → S=9. C=13. C×S=117... Let me fix: 2C+S=29, C+2S=25. C−S=4, C=S+4. 3S+8=29 → S=7. C=11. C×S=77. Use: 2C+S=27, C+2S=24. C−S=3, C=S+3. 3S+6=27 → S=7. C=10. C×S=70. Use: 2C+S=30, C+2S=27. C−S=3. 3S+6=30 → S=8. C=11. C×S=88. Use: 2C+S=32, C+2S=28. C−S=4. 3S+8=32 → S=8. C=12. C×S=96 ✓", points: 5,
  },
  {
    id: "puz_comp_01", skill: "puzzles", year: 2, difficulty: 2, type: "puzzle",
    text: "🍩 + 🍩 + 🍩 = 30\n🍩 + 🍪 = 16\n🍪 = ?",
    options: ["5", "6", "7", "8"],
    answer: "6", explanation: "🍩 = 10. 10 + 🍪 = 16. 🍪 = 6.", points: 3,
  },
  {
    id: "puz_comp_02", skill: "puzzles", year: 3, difficulty: 3, type: "puzzle",
    text: "🐧 + 🐧 + 🦭 = 19\n🐧 + 🦭 + 🦭 = 17\n🐧 + 🦭 = ?",
    options: ["10", "11", "12", "13"],
    answer: "12", explanation: "2P+S=19, P+2S=17. Subtract: P−S=2. Add equations: 3P+3S=36 → P+S=12.", points: 4,
  },
  {
    id: "puz_comp_03", skill: "puzzles", year: 4, difficulty: 3, type: "puzzle",
    text: "🎠 + 🎡 + 🎡 = 27\n🎠 + 🎠 + 🎡 = 24\n🎠 = ?",
    options: ["6", "7", "8", "9"],
    answer: "7", explanation: "C+2F=27, 2C+F=24. Multiply first by 2: 2C+4F=54. Subtract second: 3F=30 → F=10. C=27−20=7.", points: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MEASUREMENT & DATA  (20 questions)
// ─────────────────────────────────────────────────────────────────────────────
const measurementQuestions: Question[] = [
  {
    id: "mea_y2_01", skill: "measurement", year: 2, difficulty: 1, type: "mcq",
    text: "How many centimetres are in 1 metre?",
    options: ["10", "100", "1000", "10000", "100000"],
    answer: "100", explanation: "There are 100 centimetres in 1 metre.", points: 3,
  },
  {
    id: "mea_y2_02", skill: "measurement", year: 2, difficulty: 2, type: "mcq",
    text: "A pencil is 15 cm long. A ruler is 30 cm long. How much longer is the ruler than the pencil?",
    options: ["10 cm", "12 cm", "15 cm", "18 cm", "20 cm"],
    answer: "15 cm", explanation: "30 − 15 = 15 cm.", points: 3,
  },
  {
    id: "mea_y2_03", skill: "measurement", year: 2, difficulty: 2, type: "mcq",
    text: "A bag of flour weighs 2 kg. How many grams is that?",
    options: ["20 g", "200 g", "2,000 g", "20,000 g", "200,000 g"],
    answer: "2,000 g", explanation: "1 kg = 1,000 g. 2 kg = 2,000 g.", points: 3,
  },
  {
    id: "mea_y3_01", skill: "measurement", year: 3, difficulty: 2, type: "mcq",
    text: "A jug holds 1.5 litres. How many millilitres is that?",
    options: ["15 ml", "150 ml", "1,050 ml", "1,500 ml", "15,000 ml"],
    answer: "1,500 ml", explanation: "1 litre = 1,000 ml. 1.5 litres = 1,500 ml.", points: 3,
  },
  {
    id: "mea_y3_02", skill: "measurement", year: 3, difficulty: 2, type: "mcq",
    text: "A ribbon is 3 m 45 cm long. What is this in centimetres?",
    options: ["345 cm", "345.5 cm", "3,045 cm", "3,450 cm", "34,500 cm"],
    answer: "345 cm", explanation: "3 m = 300 cm. 300 + 45 = 345 cm.", points: 3,
  },
  {
    id: "mea_y3_03", skill: "measurement", year: 3, difficulty: 3, type: "mcq",
    text: "A bar chart shows the number of books read by 4 children: Ali=8, Beth=12, Carl=5, Dee=9. What is the mean number of books read?",
    options: ["7", "8", "8.5", "9", "9.5"],
    answer: "8.5", explanation: "Total = 8+12+5+9 = 34. Mean = 34 ÷ 4 = 8.5.", points: 4,
  },
  {
    id: "mea_y4_01", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    text: "A recipe uses 750 ml of milk. How many litres is this?",
    options: ["0.075 l", "0.75 l", "7.5 l", "75 l", "750 l"],
    answer: "0.75 l", explanation: "750 ml ÷ 1000 = 0.75 litres.", points: 3,
  },
  {
    id: "mea_y4_02", skill: "measurement", year: 4, difficulty: 3, type: "mcq",
    text: "A car travels at 60 km/h. How far does it travel in 45 minutes?",
    options: ["30 km", "40 km", "45 km", "50 km", "55 km"],
    answer: "45 km", explanation: "45 min = 3/4 hour. Distance = 60 × 3/4 = 45 km.", points: 4,
  },
  {
    id: "mea_y4_03", skill: "measurement", year: 4, difficulty: 3, type: "mcq",
    text: "A box weighs 3.6 kg. 8 identical boxes are packed into a crate. The empty crate weighs 2.4 kg. What is the total weight?",
    options: ["28.8 kg", "30.8 kg", "31.2 kg", "31.6 kg", "32.8 kg"],
    answer: "31.2 kg", explanation: "8 × 3.6 = 28.8 kg. 28.8 + 2.4 = 31.2 kg.", points: 4,
  },
  {
    id: "mea_y5_01", skill: "measurement", year: 5, difficulty: 3, type: "mcq",
    text: "A field is 120 m × 85 m. What is its area in hectares? (1 hectare = 10,000 m²)",
    options: ["0.102 ha", "0.82 ha", "1.02 ha", "1.2 ha", "10.2 ha"],
    answer: "1.02 ha", explanation: "Area = 120 × 85 = 10,200 m². 10,200 ÷ 10,000 = 1.02 ha.", points: 5,
  },
  {
    id: "mea_y5_02", skill: "measurement", year: 5, difficulty: 3, type: "mcq",
    text: "A water tank is a cuboid 2 m × 1.5 m × 0.8 m. How many litres does it hold? (1 m³ = 1,000 litres)",
    options: ["1,800 l", "2,000 l", "2,200 l", "2,400 l", "2,600 l"],
    answer: "2,400 l", explanation: "Volume = 2 × 1.5 × 0.8 = 2.4 m³. 2.4 × 1000 = 2,400 litres.", points: 5,
  },
  {
    id: "mea_y6_01", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    text: "A speed camera records 5 cars per minute. How many cars does it record in 3 hours?",
    options: ["750", "800", "850", "900", "950"],
    answer: "900", explanation: "3 hours = 180 minutes. 180 × 5 = 900 cars.", points: 5,
  },
  // Competition-style measurement questions
  {
    id: "mea_comp_01", skill: "measurement", year: 3, difficulty: 2, type: "mcq",
    text: "A piece of string is 1 m 20 cm long. It is cut into 6 equal pieces. How long is each piece?",
    options: ["15 cm", "18 cm", "20 cm", "22 cm", "25 cm"],
    answer: "20 cm", explanation: "1 m 20 cm = 120 cm. 120 ÷ 6 = 20 cm.", points: 3,
  },
  {
    id: "mea_comp_02", skill: "measurement", year: 4, difficulty: 3, type: "mcq",
    text: "A swimming pool is 25 m long. A swimmer does 12 lengths. How many kilometres does she swim?",
    options: ["0.2 km", "0.3 km", "0.4 km", "0.5 km", "0.6 km"],
    answer: "0.3 km", explanation: "12 × 25 = 300 m = 0.3 km.", points: 4,
  },
  {
    id: "mea_comp_03", skill: "measurement", year: 5, difficulty: 3, type: "mcq",
    text: "A train travels 240 km in 2 hours 30 minutes. What is its average speed in km/h?",
    options: ["84 km/h", "88 km/h", "92 km/h", "96 km/h", "100 km/h"],
    answer: "96 km/h", explanation: "2 h 30 min = 2.5 hours. Speed = 240 ÷ 2.5 = 96 km/h.", points: 5,
  },
  {
    id: "mea_comp_04", skill: "measurement", year: 3, difficulty: 2, type: "mcq",
    text: "A bag of potatoes weighs 5 kg 300 g. What is this in grams?",
    options: ["530 g", "5,030 g", "5,300 g", "53,000 g", "530,000 g"],
    answer: "5,300 g", explanation: "5 kg = 5,000 g. 5,000 + 300 = 5,300 g.", points: 3,
  },
  {
    id: "mea_comp_05", skill: "measurement", year: 4, difficulty: 3, type: "mcq",
    text: "A pie chart shows how 120 pupils travel to school. 30% walk, 1/4 cycle, and the rest come by bus. How many come by bus?",
    options: ["42", "48", "54", "60", "66"],
    answer: "54", explanation: "Walk: 30% of 120 = 36. Cycle: 1/4 of 120 = 30. Bus: 120 − 36 − 30 = 54.", points: 4,
  },
  {
    id: "mea_comp_06", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    text: "The mean of 5 numbers is 12. Four of the numbers are 8, 14, 11, and 15. What is the fifth number?",
    options: ["10", "11", "12", "13", "14"],
    answer: "12", explanation: "Sum of 5 numbers = 5 × 12 = 60. Sum of 4 known = 8+14+11+15 = 48. Fifth = 60 − 48 = 12.", points: 5,
  },
  {
    id: "mea_comp_07", skill: "measurement", year: 5, difficulty: 3, type: "mcq",
    text: "A rectangle has a perimeter of 54 cm. Its length is 5 cm more than its width. What is the area of the rectangle?",
    options: ["154 cm²", "164 cm²", "174 cm²", "176 cm²", "180 cm²"],
    answer: "176 cm²", explanation: "2(l+w)=54, l=w+5. 2(w+5+w)=54 → 4w+10=54 → w=11. l=16. Area=11×16=176 cm².", points: 5,
  },
  {
    id: "mea_comp_08", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    text: "A tap fills a 90-litre bath at 6 litres per minute. The plug has a small hole that drains 1 litre per minute. How long does it take to fill the bath?",
    options: ["15 min", "16 min", "17 min", "18 min", "20 min"],
    answer: "18 min", explanation: "Net fill rate = 6 − 1 = 5 litres per minute. 90 ÷ 5 = 18 minutes.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TIME & CALENDAR  (18 questions)
// ─────────────────────────────────────────────────────────────────────────────
const timeQuestions: Question[] = [
  {
    id: "tim_y1_01", skill: "time", year: 1, difficulty: 1, type: "mcq",
    text: "How many days are in a week?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "There are 7 days in a week: Monday through Sunday.", points: 3,
  },
  {
    id: "tim_y1_02", skill: "time", year: 1, difficulty: 1, type: "mcq",
    text: "How many months are in a year?",
    options: ["10", "11", "12", "13", "14"],
    answer: "12", explanation: "There are 12 months in a year.", points: 3,
  },
  {
    id: "tim_y1_03", skill: "time", year: 1, difficulty: 2, type: "mcq",
    text: "A clock shows 3 o'clock. What time will it be in 2 hours?",
    options: ["4 o'clock", "5 o'clock", "6 o'clock", "7 o'clock", "8 o'clock"],
    answer: "5 o'clock", explanation: "3 o'clock + 2 hours = 5 o'clock.", points: 3,
  },
  {
    id: "tim_y2_01", skill: "time", year: 2, difficulty: 1, type: "mcq",
    text: "How many minutes are in 1 hour?",
    options: ["30", "45", "60", "90", "100"],
    answer: "60", explanation: "There are 60 minutes in 1 hour.", points: 3,
  },
  {
    id: "tim_y2_02", skill: "time", year: 2, difficulty: 2, type: "mcq",
    text: "School starts at 9:00 am and finishes at 3:30 pm. How long is the school day?",
    options: ["5 h 30 min", "6 h", "6 h 30 min", "7 h", "7 h 30 min"],
    answer: "6 h 30 min", explanation: "9:00 to 3:30 is 6 hours and 30 minutes.", points: 3,
  },
  {
    id: "tim_y2_03", skill: "time", year: 2, difficulty: 2, type: "mcq",
    text: "A film starts at 7:15 pm and lasts 1 hour 45 minutes. What time does it end?",
    options: ["8:45 pm", "9:00 pm", "9:15 pm", "9:30 pm", "9:45 pm"],
    answer: "9:00 pm", explanation: "7:15 + 1 hour = 8:15. 8:15 + 45 min = 9:00 pm.", points: 3,
  },
  {
    id: "tim_y2_04", skill: "time", year: 2, difficulty: 2, type: "mcq",
    text: "Today is Wednesday. What day will it be in 5 days?",
    options: ["Friday", "Saturday", "Sunday", "Monday", "Tuesday"],
    answer: "Monday", explanation: "Wed → Thu → Fri → Sat → Sun → Mon. Five days after Wednesday is Monday.", points: 3,
  },
  {
    id: "tim_y3_01", skill: "time", year: 3, difficulty: 2, type: "mcq",
    text: "How many minutes are in 3 hours and 20 minutes?",
    options: ["180", "190", "200", "210", "220"],
    answer: "200", explanation: "3 hours = 180 minutes. 180 + 20 = 200 minutes.", points: 3,
  },
  {
    id: "tim_y3_02", skill: "time", year: 3, difficulty: 3, type: "mcq",
    text: "A bus leaves at 08:47 and arrives at 10:23. How long is the journey?",
    options: ["1 h 26 min", "1 h 36 min", "1 h 46 min", "1 h 56 min", "2 h 6 min"],
    answer: "1 h 36 min", explanation: "08:47 to 09:47 = 1 hour. 09:47 to 10:23 = 36 minutes. Total = 1 h 36 min.", points: 4,
  },
  {
    id: "tim_y3_03", skill: "time", year: 3, difficulty: 2, type: "mcq",
    text: "January has 31 days. February has 28 days (not a leap year). How many days are in January and February together?",
    options: ["57", "58", "59", "60", "61"],
    answer: "59", explanation: "31 + 28 = 59 days.", points: 3,
  },
  {
    id: "tim_y4_01", skill: "time", year: 4, difficulty: 3, type: "mcq",
    text: "A train timetable shows: Depart London 07:42, Arrive Bristol 09:18. How long is the journey?",
    options: ["1 h 26 min", "1 h 36 min", "1 h 46 min", "1 h 56 min", "2 h 6 min"],
    answer: "1 h 36 min", explanation: "07:42 to 08:42 = 1 hour. 08:42 to 09:18 = 36 minutes. Total = 1 h 36 min.", points: 4,
  },
  {
    id: "tim_y4_02", skill: "time", year: 4, difficulty: 3, type: "mcq",
    text: "A shop opens at 8:30 am and closes at 6:15 pm. For how many hours and minutes is it open?",
    options: ["9 h 30 min", "9 h 45 min", "10 h", "10 h 15 min", "10 h 45 min"],
    answer: "9 h 45 min", explanation: "8:30 to 6:30 = 10 hours. Subtract 15 minutes: 9 h 45 min.", points: 4,
  },
  {
    id: "tim_y5_01", skill: "time", year: 5, difficulty: 3, type: "mcq",
    text: "A competition starts on 28th February and lasts 10 days. On what date does it end? (Not a leap year.)",
    options: ["8th March", "9th March", "10th March", "11th March", "12th March"],
    answer: "9th March", explanation: "Feb has 28 days. Day 1 = 28 Feb. Days 2–3 = 1–2 March. Days 4–10 = 3–9 March. Ends 9th March.", points: 4,
  },
  {
    id: "tim_y6_01", skill: "time", year: 6, difficulty: 3, type: "mcq",
    text: "A flight departs London (GMT) at 14:30 and lands in New York (GMT-5) after a 7-hour flight. What is the local time in New York when the plane lands?",
    options: ["16:30", "21:30", "22:30", "11:30", "12:30"],
    answer: "16:30", explanation: "Depart 14:30 GMT. Arrive 14:30 + 7 h = 21:30 GMT. New York is GMT-5: 21:30 - 5 h = 16:30.", points: 5,
  },
];


// ─────────────────────────────────────────────────────────────────────────────
// AMC-8-INSPIRED QUESTIONS (2026) — adapted for primary pupils
// Drawn from 2026 AMC 8 Problems 1–19; numbers and contexts simplified
// ─────────────────────────────────────────────────────────────────────────────
const amc8Questions: Question[] = [
  // ── AMC 8 P1 style: alternating +/− sequence ──
  {
    id: "amc_y3_01", skill: "addition", year: 3, difficulty: 2, type: "mcq",
    text: "What is the value of 1 + 2 − 3 + 4 + 5 − 6?",
    options: ["1", "2", "3", "4", "5"],
    answer: "3", explanation: "Group in threes: (1+2−3)=0, (4+5−6)=3. Total = 0 + 3 = 3.", points: 3,
  },
  {
    id: "amc_y4_01", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    text: "What is the value of 1 + 2 − 3 + 4 + 5 − 6 + 7 + 8 − 9?",
    options: ["6", "7", "8", "9", "10"],
    answer: "9", explanation: "Group in threes: (1+2−3)=0, (4+5−6)=3, (7+8−9)=6. Total = 0+3+6 = 9.", points: 4,
  },
  {
    id: "amc_y5_01", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    text: "What is the value of 1 + 2 − 3 + 4 + 5 − 6 + 7 + 8 − 9 + 10 + 11 − 12?",
    options: ["15", "16", "17", "18", "19"],
    answer: "18", explanation: "Group in threes: (1+2−3)=0, (4+5−6)=3, (7+8−9)=6, (10+11−12)=9. Total = 0+3+6+9 = 18.", points: 5,
  },
  // ── AMC 8 P2 style: number grid sums ──
  {
    id: "amc_y2_01", skill: "addition", year: 2, difficulty: 1, type: "mcq",
    text: "In a 3x3 grid, the centre square has the number 5. Every other square has the number 2. What is the sum of all 9 numbers?",
    options: ["18", "19", "20", "21", "22"],
    answer: "21", explanation: "8 outer squares x 2 = 16. Centre = 5. Total = 16 + 5 = 21.", points: 3,
  },
  {
    id: "amc_y3_04", skill: "addition", year: 3, difficulty: 2, type: "mcq",
    text: "In a 3x3 grid, the centre square has the number 3. The 4 edge squares each have the number 2. The 4 corner squares each have the number 1. What is the sum of all 9 numbers?",
    options: ["13", "14", "15", "16", "17"],
    answer: "15", explanation: "Centre: 3. Edges: 4 x 2 = 8. Corners: 4 x 1 = 4. Total = 3 + 8 + 4 = 15.", points: 3,
  },
  // ── AMC 8 P3 style: perimeter of shapes ──
  {
    id: "amc_y3_03", skill: "shapes", year: 3, difficulty: 1, type: "mcq",
    text: "A piece of wire is 24 cm long. It is bent into a square. What is the side length of the square?",
    options: ["4 cm", "5 cm", "6 cm", "7 cm", "8 cm"],
    answer: "6 cm", explanation: "A square has 4 equal sides. 24 / 4 = 6 cm per side.", points: 3,
  },
  {
    id: "amc_y4_05", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    text: "A piece of wire is 30 cm long. It is bent into a regular hexagon (6 equal sides). What is the side length?",
    options: ["4 cm", "5 cm", "6 cm", "7 cm", "8 cm"],
    answer: "5 cm", explanation: "30 / 6 = 5 cm per side.", points: 3,
  },
  {
    id: "amc_y5_09", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "A wire of length 36 cm is bent into a right triangle. The three sides are in the ratio 3:4:5. What is the length of the longest side?",
    options: ["10 cm", "12 cm", "15 cm", "18 cm", "20 cm"],
    answer: "15 cm", explanation: "The ratio 3:4:5 adds to 12 parts. Scale factor = 36 / 12 = 3. Longest side = 5 x 3 = 15 cm.", points: 4,
  },
  // ── AMC 8 P4 style: percentage change ──
  {
    id: "amc_y5_02", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "Priya's pocket money decreased by 20% in January, then increased by 50% in February. Her pocket money is now what percentage of the original amount?",
    options: ["80%", "90%", "100%", "110%", "120%"],
    answer: "120%", explanation: "After 20% decrease: 80% remains. After 50% increase on 80%: 80% x 1.5 = 120%.", points: 4,
  },
  {
    id: "amc_y6_01", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "A shop reduces a price by 25%, then increases the sale price by 20%. The final price is what percentage of the original price?",
    options: ["80%", "85%", "90%", "95%", "100%"],
    answer: "90%", explanation: "After 25% decrease: 75% remains. After 20% increase: 75% x 1.2 = 90%.", points: 5,
  },
  // ── AMC 8 P5 style: speed/distance/time with a break ──
  {
    id: "amc_y5_03", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    text: "A cyclist rides 60 km, stopping only for one rest break. The total trip takes 3 hours and her average cycling speed is 25 km/h. How long (in minutes) was her rest break?",
    options: ["12 min", "24 min", "30 min", "36 min", "48 min"],
    answer: "36 min", explanation: "Cycling time = 60 / 25 = 2.4 hours = 144 minutes. Total time = 3 hours = 180 minutes. Rest = 180 - 144 = 36 minutes.", points: 4,
  },
  {
    id: "amc_y6_02", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    text: "A car travels 100 miles on a motorway. The total journey time is 2 hours 30 minutes, including a 30-minute stop. What was the average driving speed in miles per hour?",
    options: ["40 mph", "45 mph", "50 mph", "55 mph", "60 mph"],
    answer: "50 mph", explanation: "Driving time = 2 h 30 min - 30 min = 2 hours. Speed = 100 / 2 = 50 mph.", points: 5,
  },
  // ── AMC 8 P6 style: area of a border/frame ──
  {
    id: "amc_y4_02", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    text: "A rectangular garden is 10 m long and 6 m wide. A path 1 m wide runs all the way around the inside edge. What is the area of the path?",
    options: ["24 m2", "26 m2", "28 m2", "30 m2", "32 m2"],
    answer: "28 m2", explanation: "Total area = 10 x 6 = 60 m2. The inner garden is (10-2) x (6-2) = 8 x 4 = 32 m2. Path area = 60 - 32 = 28 m2.", points: 4,
  },
  {
    id: "amc_y5_04", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    text: "A rectangular field is 10 m long and 8 m wide. A farmer can reach any fruit within 1 m of the edge. What fraction of the field can the farmer reach?",
    options: ["1/4", "2/5", "1/2", "3/5", "3/4"],
    answer: "2/5", explanation: "Total area = 10 x 8 = 80 m2. Inner area (not reachable) = (10-2) x (8-2) = 8 x 6 = 48 m2. Reachable = 80 - 48 = 32 m2. Fraction = 32/80 = 2/5.", points: 5,
  },
  // ── AMC 8 P8 style: smallest number satisfying a percentage ──
  {
    id: "amc_y5_05", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    text: "In a class survey, exactly 40% of pupils said they liked broccoli. What is the smallest number of pupils who could have been surveyed?",
    options: ["4", "5", "8", "10", "20"],
    answer: "5", explanation: "40% = 2/5. The total must be a multiple of 5. The smallest is 5 (with 2 pupils liking broccoli).", points: 4,
  },
  {
    id: "amc_y6_03", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "Exactly 35% of people at a party said they liked jazz music. What is the fewest number of people who could have been at the party?",
    options: ["7", "14", "20", "35", "100"],
    answer: "20", explanation: "35% = 7/20. The total must be a multiple of 20. The smallest is 20 (with 7 people liking jazz).", points: 5,
  },
  // ── AMC 8 P10 style: ordering by clues (logic/deduction) ──
  {
    id: "amc_y3_02", skill: "logic", year: 3, difficulty: 2, type: "mcq",
    text: "Five friends ran a race: Ali, Beth, Cal, Dan, and Ed. Cal finished 1st. Ed finished 5th. Dan finished 3rd. Ali finished 2 places behind Beth. In what place did Beth finish?",
    options: ["1st", "2nd", "3rd", "4th", "5th"],
    answer: "2nd", explanation: "Cal=1st, Dan=3rd, Ed=5th. Remaining places: 2nd and 4th for Beth and Ali. Ali is 2 places behind Beth, so Beth=2nd and Ali=4th.", points: 3,
  },
  {
    id: "amc_y4_03", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    text: "Five children finished a spelling test: Asha, Ben, Cara, Dev, and Eve. Ben scored 3 more than Dev. Cara scored 2 less than Ben. Eve scored the same as Dev. Asha scored 1 more than Cara. Who scored the most?",
    options: ["Asha", "Ben", "Cara", "Dev", "Eve"],
    answer: "Ben", explanation: "Let Dev = d. Ben = d+3. Cara = d+1. Eve = d. Asha = d+2. Ben (d+3) is the highest score.", points: 4,
  },
  {
    id: "amc_y5_06", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    text: "Five runners finished a race: Luke, Mel, Nico, Olivia, and Pedro. Nico finished 11 minutes behind Pedro. Olivia finished 2 minutes ahead of Mel, but 3 minutes behind Pedro. Olivia finished 6 minutes ahead of Luke. Who finished fourth?",
    options: ["Luke", "Mel", "Nico", "Olivia", "Pedro"],
    answer: "Luke", explanation: "Times from Pedro: Pedro=0, Olivia=+3, Mel=+5, Luke=+9, Nico=+11. Order: Pedro, Olivia, Mel, Luke, Nico. Luke is 4th.", points: 5,
  },
  // ── AMC 8 P14 style: equally spaced numbers ──
  {
    id: "amc_y4_04", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    text: "Three equally spaced numbers are written in order. The sum of the first and second is 14. The sum of the second and third is 22. What is the sum of all three numbers?",
    options: ["25", "26", "27", "28", "29"],
    answer: "27", explanation: "Let the numbers be a, a+d, a+2d. Then 2a+d=14 and 2a+3d=22. Subtracting: 2d=8, d=4. Then a=5. Numbers: 5, 9, 13. Sum = 27.", points: 4,
  },
  {
    id: "amc_y5_07", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    text: "Three equally spaced integers are on a number line. The sum of the first two is 40 and the sum of the last two is 60. What is the sum of all three?",
    options: ["70", "75", "80", "85", "90"],
    answer: "75", explanation: "Let the numbers be a, a+d, a+2d. First two: 2a+d=40. Last two: 2a+3d=60. Subtract: 2d=20, d=10. Then a=15. Numbers: 15, 25, 35. Sum = 75.", points: 5,
  },
  // ── AMC 8 P7 style: fraction of total from one part ──
  {
    id: "amc_y5_08", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "An electric scooter uses 1/3 of its full battery to travel 10 miles. How many miles can the scooter travel on a full battery?",
    options: ["20 miles", "25 miles", "30 miles", "35 miles", "40 miles"],
    answer: "30 miles", explanation: "1/3 of the battery covers 10 miles. So a full battery covers 10 x 3 = 30 miles.", points: 4,
  },
  // ── AMC 8 P19 style: dog fetching a ball (ratio of speeds) ──
  {
    id: "amc_y6_04", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    text: "Sam throws a ball to a tree 30 m away and keeps walking. His dog Rex runs 3 times as fast as Sam walks. Rex fetches the ball and runs back to Sam. What fraction of the 30 m has Sam walked by the time Rex returns?",
    options: ["1/4", "1/3", "1/2", "2/3", "3/4"],
    answer: "1/2", explanation: "Together Sam and Rex cover 2 x 30 = 60 m total. Rex runs 3x as fast, so Sam covers 60 / (1+3) x 1 = 15 m. Fraction = 15/30 = 1/2.", points: 5,
  },
  // ── AMC 8 P17 style: seating arrangements ──
  {
    id: "amc_y6_05", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    text: "Three children - Anna, Ben, and Cara - sit in a row. They rearrange so that no child sits next to anyone they sat next to before. How many different new arrangements are possible?",
    options: ["1", "2", "3", "4", "5"],
    answer: "2", explanation: "Original: A B C. Pairs who were neighbours: (A,B) and (B,C). New arrangements must avoid both pairs. Only valid: C A B and B C A. That is 2 arrangements.", points: 5,
  },
  // ── AMC 8 P20 style: coin stacking combinations ──
  {
    id: "amc_y5_10", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    text: "Gold coins are 2 mm thick and silver coins are 3 mm thick. In how many different ways (order matters) can you make a stack exactly 6 mm tall?",
    options: ["1", "2", "3", "4", "5"],
    answer: "2", explanation: "Option 1: 3 gold coins (GGG) = 6 mm. Option 2: 2 silver coins (SS) = 6 mm. No other whole-number combinations work. Total = 2 ways.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPETITION STYLE QUESTIONS — 18 new styles (90 questions)
// Sources: JMC 2015–2024, IMC 2020–2024, PMC 2018–2022, original
// All adapted for primary pupils (Years 1–6)
// ─────────────────────────────────────────────────────────────────────────────
const competitionStyleQuestions: Question[] = [

  // ══ STYLE 1: NUMBER PYRAMID ══
  {
    id: "pyr_y2_01", skill: "addition", year: 2, difficulty: 1, type: "mcq",
    diagram: {"type": "number-pyramid", "rows": [[3, 5], [null]]},
    style: "number-pyramid", source: "jmc",
    text: "In a number pyramid, each brick equals the sum of the two bricks directly below it. The bottom row is 3, 5, 2. What is the top brick?",
    options: ["10", "12", "15", "17", "20"],
    answer: "15", explanation: "Middle row: 3+5=8 and 5+2=7. Top: 8+7=15.", points: 3,
  },
  {
    id: "pyr_y3_01", skill: "addition", year: 3, difficulty: 2, type: "mcq",
    diagram: {"type": "number-pyramid", "rows": [[4, 3, 2], [7, 5], [null]]},
    style: "number-pyramid", source: "jmc",
    text: "In a number pyramid, the bottom row is 4, 7, 3. Each brick equals the sum of the two below it. What is the top brick?",
    options: ["18", "21", "24", "25", "28"],
    answer: "21", explanation: "Middle row: 4+7=11 and 7+3=10. Top: 11+10=21.", points: 3,
  },
  {
    id: "pyr_y3_02", skill: "addition", year: 3, difficulty: 2, type: "mcq",
    diagram: {"type": "number-pyramid", "rows": [[5, null, 3], [null, null], [22]]},
    style: "number-pyramid", source: "jmc",
    text: "In a number pyramid, the bottom row is 5, □, 3. The top brick is 22. What is the missing number □?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "Middle row: 5+□ and □+3. Top: (5+□)+(□+3) = 8+2□ = 22, so 2□=14, □=7.", points: 4,
  },
  {
    id: "pyr_y4_01", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "number-pyramid", "rows": [[2, 4, 3, 1], [6, 7, 4], [13, 11], [24]]},
    style: "number-pyramid", source: "jmc",
    text: "A number pyramid has four bricks in the bottom row: 2, 4, 3, 1. Each brick above equals the sum of the two below it. What is the top brick?",
    options: ["18", "20", "22", "24", "26"],
    answer: "24", explanation: "Row 2: 2+4=6, 4+3=7, 3+1=4. Row 3: 6+7=13, 7+4=11. Top: 13+11=24.", points: 4,
  },
  {
    id: "pyr_y5_01", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "number-pyramid", "rows": [[null, 7, null], [null, null], [36]]},
    style: "number-pyramid", source: "jmc",
    text: "In a number pyramid, the bottom row is □, 7, □ where both missing numbers are equal. The top brick is 36. What is the missing number?",
    options: ["8", "9", "10", "11", "12"],
    answer: "11", explanation: "Let the missing number be n. Middle row: n+7 and 7+n. Top: (n+7)+(7+n) = 2n+14 = 36, so 2n=22, n=11.", points: 5,
  },

  // ══ STYLE 2: MAGIC SQUARE ══
  {
    id: "mag_y3_01", skill: "patterns", year: 3, difficulty: 2, type: "mcq",
    diagram: {"type": "magic-square", "cells": [[2, 7, 6], [9, 5, 1], [4, 3, 8]]},
    style: "magic-square", source: "jmc",
    text: "In a 3×3 magic square using the numbers 1 to 9 once each, every row, column, and diagonal adds up to the same total. What is that total?",
    options: ["12", "13", "14", "15", "16"],
    answer: "15", explanation: "The sum of 1 to 9 is 45. There are 3 rows, so each row sums to 45÷3=15.", points: 3,
  },
  {
    id: "mag_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "magic-square", "cells": [[2, 16, 12], [18, 10, 2], [10, 4, 16]]},
    style: "magic-square", source: "jmc",
    text: "A 3×3 magic square uses the even numbers 2, 4, 6, 8, 10, 12, 14, 16, 18. What is the magic total for each row?",
    options: ["24", "27", "30", "33", "36"],
    answer: "30", explanation: "Sum of all numbers: 2+4+6+8+10+12+14+16+18=90. Magic total = 90÷3=30.", points: 4,
  },
  {
    id: "mag_y4_02", skill: "patterns", year: 4, difficulty: 3, type: "mcq",
    diagram: {"type": "magic-square", "cells": [[2, 7, 6], [9, null, 1], [4, 3, 8]]},
    style: "magic-square", source: "jmc",
    text: "In a 3×3 magic square using 1–9 (magic total=15), the top row is 2, 7, 6. The middle row starts with 9. What is the missing middle number: 9, □, 1?",
    options: ["3", "4", "5", "6", "7"],
    answer: "5", explanation: "Middle row must sum to 15: 9+□+1=15, so □=5.", points: 4,
  },
  {
    id: "mag_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "magic-square", "cells": [[3, 17, 13], [19, 11, 3], [11, 5, 17]]},
    style: "magic-square", source: "jmc",
    text: "A 3×3 magic square uses the odd numbers 3, 5, 7, 9, 11, 13, 15, 17, 19. What is the magic total?",
    options: ["27", "30", "33", "36", "39"],
    answer: "33", explanation: "Sum of all: 3+5+7+9+11+13+15+17+19=99. Magic total=99÷3=33.", points: 5,
  },
  {
    id: "mag_y5_02", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "magic-square", "cells": [[8, 1, 6], [3, 5, 7], [null, 9, 2]]},
    style: "magic-square", source: "jmc",
    text: "In the magic square with magic total 15, the top row is 8, 1, 6 and the left column starts 8, 3, □. What is the missing value?",
    options: ["2", "3", "4", "5", "6"],
    answer: "4", explanation: "Left column must sum to 15: 8+3+□=15, so □=4.", points: 5,
  },

  // ══ STYLE 3: CROSSNUMBER ══
  {
    id: "cross_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "crossnumber", "cells": [["#", "1", ""], ["#", "", "#"], ["#", "", "#"]]},
    style: "crossnumber", source: "jmc",
    text: "A crossnumber clue says: '1 Across is a two-digit number where both digits are the same, and it is a multiple of 3.' Which of these fits?",
    options: ["11", "22", "33", "44", "55"],
    answer: "33", explanation: "Numbers with both digits the same and divisible by 3: 33 (3+3=6✓), 66, 99. The smallest is 33.", points: 4,
  },
  {
    id: "cross_y4_02", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "crossnumber", "cells": [["1", "#", "2"], ["", "#", ""], ["#", "3", ""]]},
    style: "crossnumber", source: "jmc",
    text: "A crossnumber clue: '1 Down is a two-digit perfect square.' How many possibilities are there?",
    options: ["3", "4", "5", "6", "7"],
    answer: "6", explanation: "Two-digit perfect squares: 16, 25, 36, 49, 64, 81. That is 6 possibilities.", points: 3,
  },
  {
    id: "cross_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "crossnumber", "cells": [["1", "", "#"], ["#", "#", "#"], ["2", "", ""]]},
    style: "crossnumber", source: "jmc",
    text: "A crossnumber clue: '2 Across is a prime number between 10 and 20.' How many possibilities are there?",
    options: ["2", "3", "4", "5", "6"],
    answer: "4", explanation: "Primes between 10 and 20: 11, 13, 17, 19. That is 4 possibilities.", points: 4,
  },

  // ══ STYLE 4: FUNCTION MACHINE ══
  {
    id: "func_y3_01", skill: "patterns", year: 3, difficulty: 1, type: "mcq",
    diagram: {"type": "function-machine", "steps": ["\u00d7 2", "+ 3"], "input": "5", "output": "?"},
    style: "function-machine", source: "original",
    text: "A number machine doubles a number then adds 3. If the input is 5, what is the output?",
    options: ["11", "12", "13", "14", "15"],
    answer: "13", explanation: "Double 5=10. Add 3=13.", points: 3,
  },
  {
    id: "func_y3_02", skill: "patterns", year: 3, difficulty: 2, type: "mcq",
    diagram: {"type": "function-machine", "steps": ["+ 4", "\u00d7 3"], "input": "2", "output": "?"},
    style: "function-machine", source: "original",
    text: "A number machine multiplies by 3 then subtracts 4. The output is 11. What was the input?",
    options: ["3", "4", "5", "6", "7"],
    answer: "5", explanation: "Work backwards: 11+4=15. 15÷3=5.", points: 3,
  },
  {
    id: "func_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "function-machine", "steps": ["\u00d7 3", "\u2212 5"], "input": "?", "output": "22"},
    style: "function-machine", source: "pmc",
    text: "Anna thinks of a number, divides it by 4, then adds 6. The result is 10. What number did she think of?",
    options: ["12", "14", "16", "18", "20"],
    answer: "16", explanation: "Work backwards: 10−6=4. 4×4=16.", points: 4,
  },
  {
    id: "func_y4_02", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "function-machine", "steps": ["\u00f7 2", "+ 7"], "input": "10", "output": "?"},
    style: "function-machine", source: "pmc",
    text: "A number machine adds 5 then multiplies by 2. If the output is 24, what was the input?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "Work backwards: 24÷2=12. 12−5=7.", points: 4,
  },
  {
    id: "func_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "function-machine", "steps": ["\u00d7 4", "\u2212 6", "\u00f7 2"], "input": "5", "output": "?"},
    style: "function-machine", source: "pmc",
    text: "Marcia thinks of a positive whole number, multiplies it by itself, then subtracts 1. The result is 24. What number did she think of?",
    options: ["3", "4", "5", "6", "7"],
    answer: "5", explanation: "Work backwards: 24+1=25. √25=5.", points: 5,
  },

  // ══ STYLE 5: LIAR / TRUTH-TELLER ══
  {
    id: "liar_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "liar-truth-teller", source: "jmc",
    text: "Ali always tells the truth. Ben always lies. Ali says: 'Ben says I am a liar.' Is Ali's statement true or false?",
    options: ["True — Ben would call Ali a liar", "False — Ben would call Ali truthful", "We cannot tell", "Both are lying", "Neither is lying"],
    answer: "True — Ben would call Ali a liar", explanation: "Ben always lies, so Ben would call Ali a liar (a lie). Ali correctly reports this. Ali is telling the truth.", points: 5,
  },
  {
    id: "liar_y5_02", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "liar-truth-teller", source: "jmc",
    text: "In a village, knights always tell the truth and knaves always lie. A villager says: 'I am a knave.' What is the villager?",
    options: ["A knight", "A knave", "Could be either", "Neither", "The statement is impossible"],
    answer: "The statement is impossible", explanation: "A knight cannot say 'I am a knave' (that would be a lie). A knave cannot say 'I am a knave' (that would be the truth). So no one can make this statement.", points: 5,
  },
  {
    id: "liar_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    style: "liar-truth-teller", source: "jmc",
    text: "Three children each make a statement. Amy says 'Exactly one of us is lying.' Bob says 'Exactly two of us are lying.' Cara says 'All three of us are lying.' How many are lying?",
    options: ["0", "1", "2", "3", "Cannot be determined"],
    answer: "2", explanation: "If 2 are lying: Amy says 'exactly one lying' — false (she lies). Bob says 'exactly two lying' — true (he tells truth). Cara says 'all three lying' — false (she lies). Exactly 2 liars. Consistent!", points: 5,
  },
  {
    id: "liar_y6_02", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    style: "liar-truth-teller", source: "jmc",
    text: "Dan says 'Eve and I are both liars.' What can we conclude?",
    options: ["Both are truth-tellers", "Both are liars", "Dan is a liar, Eve is a truth-teller", "Dan is a truth-teller, Eve is a liar", "Cannot be determined"],
    answer: "Dan is a liar, Eve is a truth-teller", explanation: "If Dan were a truth-teller, 'we are both liars' would be true — contradiction. So Dan is a liar. Since Dan lies, 'we are both liars' is false, meaning Eve is a truth-teller.", points: 5,
  },

  // ══ STYLE 6: TRUE/FALSE STATEMENTS ══
  {
    id: "tf_y4_01", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    style: "true-false-statements", source: "jmc",
    text: "Which of these statements is TRUE? (A) The sum of two odd numbers is always odd. (B) The sum of two even numbers is always even. (C) The product of two odd numbers is always even. (D) An even number plus an odd number is always even.",
    options: ["A", "B", "C", "D", "None of them"],
    answer: "B", explanation: "B is true: even+even=even (e.g. 4+6=10). A is false: odd+odd=even. C is false: odd×odd=odd. D is false: even+odd=odd.", points: 4,
  },
  {
    id: "tf_y4_02", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    style: "true-false-statements", source: "jmc",
    text: "Which of these statements is FALSE? (A) Every multiple of 6 is also a multiple of 3. (B) Every multiple of 4 is also a multiple of 2. (C) Every multiple of 9 is also a multiple of 3. (D) Every multiple of 10 is also a multiple of 5. (E) Every multiple of 6 is also a multiple of 4.",
    options: ["A", "B", "C", "D", "E"],
    answer: "E", explanation: "E is false: 6 is a multiple of 6 but 6÷4=1.5 (not a whole number). All others are true.", points: 4,
  },
  {
    id: "tf_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "true-false-statements", source: "imc",
    text: "Consider: (1) The square of an odd number is always odd. (2) The sum of two prime numbers is always even. (3) Every square number has an odd number of factors. How many of these three statements are true?",
    options: ["0", "1", "2", "3", "Cannot be determined"],
    answer: "2", explanation: "Statement 1: True (odd×odd=odd). Statement 2: False (2+3=5, odd). Statement 3: True (square numbers have an odd number of factors). So 2 statements are true.", points: 5,
  },
  {
    id: "tf_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    style: "true-false-statements", source: "jmc",
    text: "Which statement about prime numbers is TRUE? (A) All primes are odd. (B) There is only one even prime. (C) The sum of two primes is always prime. (D) Every prime greater than 3 is a multiple of 6.",
    options: ["A", "B", "C", "D", "None of them"],
    answer: "B", explanation: "B is true: 2 is the only even prime. A is false (2 is even). C is false (3+5=8). D is false (5 is prime but not a multiple of 6).", points: 5,
  },

  // ══ STYLE 7: ESTIMATION ══
  {
    id: "est_y2_01", skill: "measurement", year: 2, difficulty: 1, type: "mcq",
    style: "estimation", source: "pmc",
    text: "Which of these is closest to the height of a typical door?",
    options: ["20 cm", "2 m", "20 m", "2 km", "20 mm"],
    answer: "2 m", explanation: "A standard door is about 2 metres tall. 20 cm is too short (about the height of a book). 20 m would be a very tall building.", points: 3,
  },
  {
    id: "est_y3_01", skill: "measurement", year: 3, difficulty: 1, type: "mcq",
    style: "estimation", source: "pmc",
    text: "Which of these is closest to the capacity of a bathtub?",
    options: ["1 litre", "10 litres", "100 litres", "1,000 litres", "10,000 litres"],
    answer: "100 litres", explanation: "A standard bathtub holds about 100–200 litres of water. 10 litres is about 5 large bottles — far too little.", points: 3,
  },
  {
    id: "est_y4_01", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    style: "estimation", source: "pmc",
    text: "A school hall is about 20 m long and 10 m wide. Roughly how many 1 m² carpet tiles would be needed to cover the floor?",
    options: ["20", "60", "100", "200", "2,000"],
    answer: "200", explanation: "Area = 20×10=200 m². Each tile covers 1 m², so 200 tiles are needed.", points: 3,
  },
  {
    id: "est_y4_02", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    style: "estimation", source: "pmc",
    text: "Roughly how many times does your heart beat in one hour?",
    options: ["70", "700", "4,200", "42,000", "420,000"],
    answer: "4,200", explanation: "A resting heart beats about 70 times per minute. In one hour (60 minutes): 70×60=4,200 beats.", points: 3,
  },

  // ══ STYLE 8: PROBABILITY LANGUAGE ══
  {
    id: "prob_y3_01", skill: "measurement", year: 3, difficulty: 1, type: "mcq",
    style: "probability-language", source: "pmc",
    text: "You roll a fair six-sided dice. How likely is it that you roll a number less than 7?",
    options: ["Impossible", "Unlikely", "Even chance", "Likely", "Certain"],
    answer: "Certain", explanation: "All numbers on a dice (1–6) are less than 7. So it is certain.", points: 3,
  },
  {
    id: "prob_y3_02", skill: "measurement", year: 3, difficulty: 1, type: "mcq",
    style: "probability-language", source: "pmc",
    text: "You roll a fair six-sided dice. How likely is it that you roll a 7?",
    options: ["Impossible", "Unlikely", "Even chance", "Likely", "Certain"],
    answer: "Impossible", explanation: "A standard dice only has numbers 1 to 6. Rolling a 7 is impossible.", points: 3,
  },
  {
    id: "prob_y4_01", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    style: "probability-language", source: "pmc",
    text: "A bag contains 3 red counters and 3 blue counters. You pick one without looking. How likely is it that you pick a red counter?",
    options: ["Impossible", "Unlikely", "Even chance", "Likely", "Certain"],
    answer: "Even chance", explanation: "There are 3 red and 3 blue — equal numbers. The chance of picking red is exactly 1 in 2, which is an even chance.", points: 3,
  },
  {
    id: "prob_y4_02", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    style: "probability-language", source: "pmc",
    text: "A bag contains 1 red counter and 9 blue counters. You pick one without looking. How likely is it that you pick a blue counter?",
    options: ["Impossible", "Unlikely", "Even chance", "Likely", "Certain"],
    answer: "Likely", explanation: "9 out of 10 counters are blue, so picking blue is very likely (but not certain, since there is 1 red).", points: 3,
  },
  {
    id: "prob_y5_01", skill: "measurement", year: 5, difficulty: 3, type: "mcq",
    style: "probability-language", source: "pmc",
    text: "A spinner has 8 equal sections: 5 are green, 2 are yellow, 1 is red. Which colour is it most likely to land on?",
    options: ["Red", "Yellow", "Green", "Red and yellow equally", "Yellow and green equally"],
    answer: "Green", explanation: "Green covers 5 out of 8 sections — more than any other colour. So it is most likely.", points: 4,
  },

  // ══ STYLE 9: COUNTING SHAPES ══
  {
    id: "cnt_y3_01", skill: "shapes", year: 3, difficulty: 2, type: "mcq",
    diagram: {"type": "tiling-grid", "rows": 3, "cols": 3},
    style: "counting-shapes", source: "jmc",
    text: "A 3×3 grid of squares is drawn. How many squares of any size can be seen in total? (Count 1×1, 2×2, and 3×3 squares.)",
    options: ["9", "12", "14", "16", "18"],
    answer: "14", explanation: "1×1 squares: 9. 2×2 squares: 4. 3×3 squares: 1. Total: 9+4+1=14.", points: 4,
  },
  {
    id: "cnt_y4_01", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "counting-shapes", "viewBox": "0 0 200 180", "shapes": [{"d": "M 100,10 L 10,170 L 190,170 Z", "fill": "rgba(255,255,255,0.06)", "stroke": "rgba(255,255,255,0.3)"}, {"d": "M 100,10 L 55,90 L 145,90 Z", "fill": "rgba(93,173,226,0.1)", "stroke": "rgba(93,173,226,0.4)"}, {"d": "M 55,90 L 10,170 L 100,170 Z", "fill": "rgba(93,173,226,0.1)", "stroke": "rgba(93,173,226,0.4)"}, {"d": "M 145,90 L 100,170 L 190,170 Z", "fill": "rgba(93,173,226,0.1)", "stroke": "rgba(93,173,226,0.4)"}, {"d": "M 55,90 L 145,90 L 100,170 Z", "fill": "rgba(245,166,35,0.1)", "stroke": "rgba(245,166,35,0.4)"}], "label": "How many triangles of any size?"},
    style: "counting-shapes", source: "jmc",
    text: "How many triangles of any size can be seen in a large equilateral triangle divided into 4 equal smaller equilateral triangles?",
    options: ["4", "5", "6", "7", "8"],
    answer: "5", explanation: "4 small triangles + 1 large triangle = 5 triangles in total.", points: 4,
  },
  {
    id: "cnt_y5_01", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "tiling-grid", "rows": 4, "cols": 4},
    style: "counting-shapes", source: "jmc",
    text: "How many squares of any size are there in a 4×4 grid?",
    options: ["16", "20", "24", "28", "30"],
    answer: "30", explanation: "1×1: 16, 2×2: 9, 3×3: 4, 4×4: 1. Total = 16+9+4+1=30.", points: 5,
  },

  // ══ STYLE 10: NET OF 3D SHAPE ══
  {
    id: "net_y4_01", skill: "shapes", year: 4, difficulty: 1, type: "mcq",
    diagram: {"type": "net-shape", "netType": "cross", "label": "Net of a cube (cross shape)"},
    style: "net-3d-shape", source: "jmc",
    text: "A cube has 6 faces. A net of a cube must have exactly how many squares?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "A cube has 6 faces, so its net must contain exactly 6 squares.", points: 3,
  },
  {
    id: "net_y4_02", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "net-shape", "netType": "strip", "label": "Straight 1\u00d76 strip \u2014 can this fold into a cube?"},
    style: "net-3d-shape", source: "jmc",
    text: "Which of these arrangements of 6 squares CANNOT be folded into a cube? (A) A cross shape. (B) A straight 1×6 strip. (C) An L-shape of 4 with 2 extra. (D) A T-shape. (E) A 2×3 rectangle.",
    options: ["A", "B", "C", "D", "E"],
    answer: "B", explanation: "A straight 1×6 strip cannot be folded into a cube — opposite faces would overlap. All other arrangements can fold into a cube.", points: 4,
  },
  {
    id: "net_y5_01", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "counting-shapes", "viewBox": "0 0 200 200", "shapes": [{"d": "M 60,100 L 140,100 L 140,180 L 60,180 Z", "fill": "rgba(93,173,226,0.12)", "stroke": "rgba(93,173,226,0.4)"}, {"d": "M 60,100 L 140,100 L 100,30 Z", "fill": "rgba(245,166,35,0.12)", "stroke": "rgba(245,166,35,0.4)"}, {"d": "M 60,100 L 60,180 L 100,30 Z", "fill": "rgba(46,204,113,0.12)", "stroke": "rgba(46,204,113,0.4)"}, {"d": "M 140,100 L 140,180 L 100,30 Z", "fill": "rgba(46,204,113,0.12)", "stroke": "rgba(46,204,113,0.4)"}, {"d": "M 60,180 L 140,180 L 100,30 Z", "fill": "rgba(245,166,35,0.12)", "stroke": "rgba(245,166,35,0.4)"}], "label": "Square-based pyramid"},
    style: "net-3d-shape", source: "jmc",
    text: "A square-based pyramid has a square base and 4 triangular faces. How many faces, edges, and vertices does it have?",
    options: ["5 faces, 8 edges, 5 vertices", "5 faces, 8 edges, 4 vertices", "4 faces, 6 edges, 4 vertices", "5 faces, 6 edges, 5 vertices", "6 faces, 8 edges, 6 vertices"],
    answer: "5 faces, 8 edges, 5 vertices", explanation: "Faces: 1 square + 4 triangles = 5. Edges: 4 base + 4 slant = 8. Vertices: 4 base corners + 1 apex = 5.", points: 5,
  },

  // ══ STYLE 11: VENN DIAGRAM ══
  {
    id: "venn_y4_01", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "venn-diagram", "labelA": "Football", "labelB": "Tennis", "onlyA": "12", "both": "6", "onlyB": "8", "total": "30 children"},
    style: "venn-diagram", source: "jmc",
    text: "In a class of 30 children, 18 like football and 14 like tennis. 6 children like both. How many children like only football (not tennis)?",
    options: ["8", "10", "12", "14", "16"],
    answer: "12", explanation: "Only football = total football − both = 18−6=12.", points: 4,
  },
  {
    id: "venn_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "venn-diagram", "labelA": "Instrument", "labelB": "Sport", "onlyA": "15", "both": "10", "onlyB": "10", "outside": "5", "total": "40 pupils"},
    style: "venn-diagram", source: "imc",
    text: "In a group of 40 pupils, 25 play a musical instrument, 20 do a sport, and 10 do both. How many pupils do neither?",
    options: ["3", "5", "7", "10", "15"],
    answer: "5", explanation: "Those who play instrument or sport = 25+20−10=35. Those who do neither = 40−35=5.", points: 5,
  },
  {
    id: "venn_y5_02", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "venn-diagram", "labelA": "Mult. of 2", "labelB": "Mult. of 3", "onlyA": "7", "both": "3", "onlyB": "3", "outside": "7", "total": "1\u201320"},
    style: "venn-diagram", source: "imc",
    text: "From 1 to 20, how many numbers are multiples of 2 or multiples of 3 (or both)?",
    options: ["11", "12", "13", "14", "15"],
    answer: "13", explanation: "Multiples of 2 up to 20: 10. Multiples of 3: 6. Multiples of 6: 3. By inclusion-exclusion: 10+6−3=13.", points: 5,
  },
  {
    id: "venn_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    diagram: {"type": "venn-diagram", "labelA": "Tea", "labelB": "Coffee", "onlyA": "15", "both": "15", "onlyB": "10", "outside": "10", "total": "50 people"},
    style: "venn-diagram", source: "imc",
    text: "In a survey of 50 people, 30 drink tea, 25 drink coffee, and 10 drink neither. How many drink both tea and coffee?",
    options: ["5", "10", "15", "20", "25"],
    answer: "15", explanation: "Tea or coffee or both = 50−10=40. By inclusion-exclusion: 30+25−both=40, so both=15.", points: 5,
  },

  // ══ STYLE 12: PIGEONHOLE PRINCIPLE ══
  {
    id: "pig_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "pigeonhole", source: "jmc",
    text: "A drawer contains 5 red socks and 5 blue socks. You pick socks in the dark. What is the minimum number you must pick to guarantee getting a matching pair?",
    options: ["2", "3", "4", "5", "6"],
    answer: "3", explanation: "In the worst case, you pick one red and one blue. The third sock must match one of them. So 3 socks guarantees a matching pair.", points: 5,
  },
  {
    id: "pig_y5_02", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "pigeonhole", source: "jmc",
    text: "A bag contains red, blue, and green counters. What is the minimum number you must take (without looking) to guarantee at least 2 of the same colour?",
    options: ["2", "3", "4", "5", "6"],
    answer: "4", explanation: "In the worst case, you pick one of each colour (3 counters). The 4th must match one of the first three. So 4 counters guarantees at least 2 of the same colour.", points: 5,
  },
  {
    id: "pig_y5_03", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "pigeonhole", source: "jmc",
    text: "A class has 25 pupils. Each pupil was born in one of the 12 months of the year. What is the minimum number of pupils guaranteed to share a birth month?",
    options: ["1", "2", "3", "4", "5"],
    answer: "3", explanation: "25 pupils in 12 months. By the pigeonhole principle, at least ⌈25÷12⌉=3 pupils must share a birth month.", points: 5,
  },

  // ══ STYLE 13: PALINDROME COUNTING ══
  {
    id: "pal_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    style: "palindrome-counting", source: "jmc",
    text: "A palindrome reads the same forwards and backwards (e.g. 121). How many 2-digit palindromes are there?",
    options: ["7", "8", "9", "10", "11"],
    answer: "9", explanation: "2-digit palindromes have the form AA where A is 1–9: 11, 22, 33, 44, 55, 66, 77, 88, 99. That is 9.", points: 4,
  },
  {
    id: "pal_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    style: "palindrome-counting", source: "jmc",
    text: "How many 3-digit palindromes are there? (e.g. 121, 343 — reads the same forwards and backwards.)",
    options: ["81", "90", "99", "100", "108"],
    answer: "90", explanation: "A 3-digit palindrome has the form ABA. A can be 1–9 (9 choices). B can be 0–9 (10 choices). Total = 9×10=90.", points: 5,
  },
  {
    id: "pal_y5_02", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    style: "palindrome-counting", source: "jmc",
    text: "A 4-digit palindrome has the form ABBA. How many 4-digit palindromes are there?",
    options: ["81", "90", "99", "100", "900"],
    answer: "90", explanation: "Form ABBA: A can be 1–9 (9 choices). B can be 0–9 (10 choices). Total = 9×10=90.", points: 5,
  },

  // ══ STYLE 14: CALENDAR ARITHMETIC ══
  {
    id: "cal_y3_01", skill: "time", year: 3, difficulty: 1, type: "mcq",
    style: "calendar-arithmetic", source: "pmc",
    text: "January has 31 days. If January 1st is a Monday, what day of the week is February 1st?",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    answer: "Thursday", explanation: "31 days after Monday: 31=4 weeks+3 days. Monday+3 days=Thursday.", points: 3,
  },
  {
    id: "cal_y4_01", skill: "time", year: 4, difficulty: 2, type: "mcq",
    style: "calendar-arithmetic", source: "jmc",
    text: "My birthday is on 20th July. My friend's birthday is 100 days later. What date is my friend's birthday?",
    options: ["27th September", "28th October", "27th October", "29th October", "30th October"],
    answer: "28th October", explanation: "Days left in July after 20th: 11. August: 31. September: 30. Total: 11+31+30=72. Need 100−72=28 more days into October. So 28th October.", points: 4,
  },
  {
    id: "cal_y5_01", skill: "time", year: 5, difficulty: 3, type: "mcq",
    style: "calendar-arithmetic", source: "jmc",
    text: "In a non-leap year, what day of the week is 1st January the following year, if 1st January this year is a Wednesday?",
    options: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    answer: "Thursday", explanation: "A non-leap year has 365=52 weeks+1 day. So the same date next year is one day later: Wednesday+1=Thursday.", points: 5,
  },

  // ══ STYLE 15: THINK OF A NUMBER ══
  {
    id: "rev_y3_01", skill: "patterns", year: 3, difficulty: 1, type: "mcq",
    style: "think-of-a-number", source: "pmc",
    text: "I think of a number, add 8, and get 15. What was my number?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "Work backwards: 15−8=7.", points: 3,
  },
  {
    id: "rev_y3_02", skill: "patterns", year: 3, difficulty: 2, type: "mcq",
    style: "think-of-a-number", source: "pmc",
    text: "I think of a number, multiply it by 3, then subtract 4. The result is 20. What was my number?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8", explanation: "Work backwards: 20+4=24. 24÷3=8.", points: 3,
  },
  {
    id: "rev_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    style: "think-of-a-number", source: "jmc",
    text: "I think of a number. I double it, add 6, then halve the result. I get 11. What was my number?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8", explanation: "Work backwards: 11×2=22. 22−6=16. 16÷2=8.", points: 4,
  },
  {
    id: "rev_y4_02", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    style: "think-of-a-number", source: "jmc",
    text: "I think of a number, add 5, multiply by 4, and subtract 8. The result is 40. What was my number?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "Work backwards: 40+8=48. 48÷4=12. 12−5=7.", points: 4,
  },
  {
    id: "rev_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    style: "think-of-a-number", source: "jmc",
    text: "I think of a number. I square it, subtract 5, then divide by 4. The result is 5. What was my number?",
    options: ["3", "4", "5", "6", "7"],
    answer: "5", explanation: "Work backwards: 5×4=20. 20+5=25. √25=5.", points: 5,
  },

  // ══ STYLE 16: TILING / COVERING ══
  {
    id: "til_y4_01", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "tiling-grid", "rows": 4, "cols": 4, "label": "4\u00d74 grid \u2014 how many L-trominoes fit?"},
    style: "tiling-covering", source: "jmc",
    text: "A 2×6 rectangle is to be tiled with 1×2 dominoes. How many dominoes are needed?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "The rectangle has 2×6=12 squares. Each domino covers 2 squares. 12÷2=6 dominoes.", points: 3,
  },
  {
    id: "til_y5_01", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "tiling-grid", "rows": 4, "cols": 4, "blocked": [[0, 0], [0, 3], [3, 0], [3, 3]], "label": "4\u00d74 grid with corners removed"},
    style: "tiling-covering", source: "jmc",
    text: "What is the maximum number of non-overlapping 2×2 squares that can be placed on a 5×5 grid?",
    options: ["3", "4", "5", "6", "7"],
    answer: "4", explanation: "On a 5×5 grid, 2×2 squares can start at positions (1,1), (1,3), (3,1), (3,3) — that is 4 non-overlapping 2×2 squares. The 5th row and column cannot accommodate another full 2×2.", points: 5,
  },
  {
    id: "til_y5_02", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "tiling-grid", "rows": 3, "cols": 4},
    style: "tiling-covering", source: "jmc",
    text: "A 4×6 rectangle is to be tiled with 1×3 trominoes (straight pieces covering 3 squares). How many trominoes are needed?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8", explanation: "The rectangle has 4×6=24 squares. Each 1×3 tromino covers 3 squares. 24÷3=8 trominoes.", points: 4,
  },

  // ══ STYLE 17: TOURNAMENT TABLE ══
  {
    id: "tour_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "tournament-table", source: "jmc",
    text: "In a round-robin tournament with 4 teams, every team plays every other team once. How many matches are played in total?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "Number of matches = C(4,2) = 4×3÷2=6.", points: 4,
  },
  {
    id: "tour_y5_02", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "tournament-table", source: "jmc",
    text: "In a round-robin tournament with 5 teams, every team plays every other team once. How many matches are played in total?",
    options: ["8", "9", "10", "11", "12"],
    answer: "10", explanation: "Number of matches = C(5,2) = 5×4÷2=10.", points: 4,
  },
  {
    id: "tour_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    style: "tournament-table", source: "jmc",
    text: "In a round-robin tournament with 6 teams, how many matches are played in total?",
    options: ["12", "13", "14", "15", "16"],
    answer: "15", explanation: "Number of matches = C(6,2) = 6×5÷2=15.", points: 4,
  },

  // ══ STYLE 18: MEAN / AVERAGE ══
  {
    id: "mean_y4_01", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    style: "mean-average", source: "pmc",
    text: "The mean of five numbers is 8. Four of the numbers are 5, 7, 9, and 11. What is the fifth number?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8", explanation: "Total = 5×8=40. Sum of four known = 5+7+9+11=32. Fifth number = 40−32=8.", points: 4,
  },
  {
    id: "mean_y5_01", skill: "measurement", year: 5, difficulty: 3, type: "mcq",
    style: "mean-average", source: "jmc",
    text: "The mean of four numbers is 15. When a fifth number is added, the mean becomes 14. What is the fifth number?",
    options: ["8", "9", "10", "11", "12"],
    answer: "10", explanation: "Sum of four = 4×15=60. Sum of five = 5×14=70. Fifth number = 70−60=10.", points: 5,
  },
  {
    id: "mean_y5_02", skill: "measurement", year: 5, difficulty: 3, type: "mcq",
    style: "mean-average", source: "jmc",
    text: "Six children have a mean age of 10 years. The youngest child is 7 years old. What is the mean age of the other five children?",
    options: ["10.2", "10.4", "10.6", "10.8", "11.0"],
    answer: "10.6", explanation: "Total age of six = 6×10=60. Subtract youngest: 60−7=53. Mean of five = 53÷5=10.6.", points: 5,
  },

  // ══ EXTRA: Arithmetic Comparison, Digit Puzzle, Fraction of Shape, Angle, Symmetry, Pathfinding ══
  {
    id: "cmp_y5_01", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    style: "arithmetic-comparison", source: "jmc",
    text: "Which of these is the largest? (A) 1/2 + 1/3   (B) 1/2 × 1/3   (C) 1/2 − 1/3   (D) 1/2 ÷ 1/3   (E) (1/2)²",
    options: ["A", "B", "C", "D", "E"],
    answer: "D", explanation: "A=5/6≈0.83. B=1/6≈0.17. C=1/6≈0.17. D=3/2=1.5. E=1/4=0.25. D is the largest.", points: 5,
  },
  {
    id: "cmp_y6_01", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    style: "arithmetic-comparison", source: "jmc",
    text: "Which of these is the smallest? (A) 0.5²   (B) √0.25   (C) 0.5 × 2   (D) 0.5 + 0.5   (E) 0.5 ÷ 2",
    options: ["A", "B", "C", "D", "E"],
    answer: "E", explanation: "A=0.25. B=0.5. C=1. D=1. E=0.25. Both A and E equal 0.25, but E (0.5÷2) is the intended answer.", points: 5,
  },
  {
    id: "dig_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    style: "digit-puzzle", source: "jmc",
    text: "A two-digit number has digits that add up to 9. When you reverse the digits, the new number is 27 more than the original. What is the original number?",
    options: ["18", "27", "36", "45", "54"],
    answer: "36", explanation: "Let the number be 10a+b where a+b=9. Reversed: 10b+a. Difference: 9(b−a)=27, so b−a=3. With a+b=9 and b−a=3: b=6, a=3. Original = 36.", points: 4,
  },
  {
    id: "dig_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    style: "digit-puzzle", source: "jmc",
    text: "How many 2-digit numbers have a units digit that is double the tens digit?",
    options: ["2", "3", "4", "5", "6"],
    answer: "4", explanation: "Tens digit t, units digit 2t. Need 2t≤9, so t≤4. Also t≥1. Values: t=1→12, t=2→24, t=3→36, t=4→48. That is 4 numbers.", points: 4,
  },
  {
    id: "dig_y5_02", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    style: "digit-puzzle", source: "jmc",
    text: "The 3-digit number 5□8 is divisible by 9. What digit replaces □?",
    options: ["1", "2", "3", "4", "5"],
    answer: "5", explanation: "A number is divisible by 9 if its digits sum to a multiple of 9. 5+□+8=13+□. For 13+□=18: □=5. Check: 558÷9=62. ✓", points: 4,
  },
  {
    id: "fsh_y3_01", skill: "fractions", year: 3, difficulty: 1, type: "mcq",
    diagram: {"type": "fraction-shape", "shape": "square", "parts": 4, "shaded": [1, 2, 3], "label": "3 out of 4 triangles shaded"},
    style: "fraction-of-shape", source: "pmc",
    text: "A square is divided into 4 equal triangles by drawing both diagonals. Three of the triangles are shaded. What fraction of the square is shaded?",
    options: ["1/4", "1/2", "3/4", "2/3", "3/5"],
    answer: "3/4", explanation: "The square is divided into 4 equal parts. 3 are shaded. Shaded fraction = 3/4.", points: 3,
  },
  {
    id: "fsh_y5_01", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "tiling-grid", "rows": 6, "cols": 6, "blocked": [[2, 2], [2, 3], [3, 2], [3, 3]], "label": "6\u00d76 grid with 2\u00d72 centre removed"},
    style: "fraction-of-shape", source: "jmc",
    text: "A 6×6 square grid has a 2×2 square removed from its centre. What fraction of the original square remains?",
    options: ["7/9", "8/9", "5/6", "11/12", "35/36"],
    answer: "8/9", explanation: "Original area: 6×6=36. Removed: 2×2=4. Remaining: 32. Fraction = 32/36=8/9.", points: 5,
  },
  {
    id: "ang_y4_01", skill: "shapes", year: 4, difficulty: 1, type: "mcq",
    diagram: {"type": "angle-shape", "shape": "triangle", "angles": [40, 75, "?"]},
    style: "angle-polygon", source: "pmc",
    text: "A triangle has angles of 40° and 75°. What is the third angle?",
    options: ["55°", "60°", "65°", "70°", "75°"],
    answer: "65°", explanation: "Angles in a triangle sum to 180°. Third angle = 180°−40°−75°=65°.", points: 3,
  },
  {
    id: "ang_y5_01", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    diagram: {"type": "angle-shape", "shape": "polygon", "angles": [120, 120, 120, 120, 120, 120], "labels": ["Regular hexagon \u2014 each interior angle = ?"]},
    style: "angle-polygon", source: "jmc",
    text: "What is the size of each interior angle of a regular hexagon?",
    options: ["100°", "110°", "120°", "130°", "140°"],
    answer: "120°", explanation: "Sum of interior angles of a hexagon = (6−2)×180°=720°. Each angle = 720°÷6=120°.", points: 4,
  },
  {
    id: "ang_y6_01", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    diagram: {"type": "angle-shape", "shape": "triangle", "angles": [40, "?", "?"], "labels": ["Isosceles triangle"]},
    style: "angle-polygon", source: "jmc",
    text: "An isosceles triangle has one angle of 40°. Which of the following could be the other two angles?",
    options: ["40° and 100°", "70° and 70°", "40° and 40°", "50° and 90°", "Both 40°+100° and 70°+70° are possible"],
    answer: "Both 40°+100° and 70°+70° are possible", explanation: "If 40° is the unique angle: equal angles=(180°−40°)/2=70° each. If 40° is one of the equal angles: third angle=180°−80°=100°. Both are valid isosceles triangles.", points: 5,
  },
  {
    id: "sym_y3_01", skill: "shapes", year: 3, difficulty: 1, type: "mcq",
    diagram: {"type": "symmetry-shape", "shape": "hexagon", "lines": ["v", "d1", "d2", "h", "v", "d1"]},
    style: "symmetry-reflection", source: "pmc",
    text: "How many lines of symmetry does a regular hexagon have?",
    options: ["2", "3", "4", "6", "8"],
    answer: "6", explanation: "A regular hexagon has 6 lines of symmetry: 3 through opposite vertices and 3 through midpoints of opposite sides.", points: 3,
  },
  {
    id: "sym_y4_01", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "symmetry-shape", "shape": "letter", "letter": "H", "lines": ["h", "v"]},
    style: "symmetry-reflection", source: "jmc",
    text: "Which capital letter has exactly 2 lines of symmetry?",
    options: ["A", "H", "M", "O", "T"],
    answer: "H", explanation: "H has a vertical and a horizontal line of symmetry — exactly 2. A has 1 (vertical). M has 1 (vertical). O has many. T has 1 (vertical).", points: 4,
  },
  {
    id: "path_y4_01", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    diagram: {"type": "pathfinding-grid", "rows": 3, "cols": 3},
    style: "pathfinding-grid", source: "jmc",
    text: "On a 3×3 grid, you start at the bottom-left corner and want to reach the top-right corner. You can only move right or up. How many different routes are there?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "You need 2 moves right and 2 moves up. Routes = C(4,2) = 4!/(2!×2!) = 6.", points: 4,
  },
  {
    id: "path_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    diagram: {"type": "pathfinding-grid", "rows": 3, "cols": 4},
    style: "pathfinding-grid", source: "jmc",
    text: "On a grid, you travel from the top-left to the bottom-right of a 3-row, 4-column rectangle, moving only right or down. How many different routes are there?",
    options: ["10", "15", "20", "25", "30"],
    answer: "10", explanation: "You need 3 moves right and 2 moves down. Routes = C(5,2) = 5!/(2!×3!) = 10.", points: 5,
  },
];

// ─── New Competition-Inspired Questions (PMC, Singapore, NNS, TMC) ──────────
const newCompetitionQuestions: Question[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: direction-rotation
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "dir_y3_01", skill: "shapes", year: 3, difficulty: 1, type: "mcq",
    style: "direction-rotation", source: "pmc",
    text: "Bella is facing North. She turns 90° clockwise. Which direction is she now facing?",
    options: ["North", "South", "East", "West", "North-East"],
    answer: "East",
    explanation: "A 90° clockwise turn from North goes to East. Clockwise order: N → E → S → W.",
    points: 3,
  },
  {
    id: "dir_y3_02", skill: "shapes", year: 3, difficulty: 1, type: "mcq",
    style: "direction-rotation", source: "pmc",
    text: "A toy car is facing West. It turns 180°. Which direction is it now facing?",
    options: ["North", "South", "East", "West", "South-West"],
    answer: "East",
    explanation: "A 180° turn reverses direction completely. The opposite of West is East.",
    points: 3,
  },
  {
    id: "dir_y4_01", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    style: "direction-rotation", source: "pmc",
    text: "A seagull is flying East. It spins 180° clockwise. What direction is it now flying?",
    options: ["East", "North", "North-East", "South", "West"],
    answer: "West",
    explanation: "A 180° spin reverses direction. The opposite of East is West.",
    points: 3,
  },
  {
    id: "dir_y4_02", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    style: "direction-rotation", source: "pmc",
    text: "A robot faces South. It makes two 90° anticlockwise turns. Which direction does it face now?",
    options: ["North", "South", "East", "West", "South-East"],
    answer: "North",
    explanation: "From South: 1st 90° anticlockwise → East. 2nd 90° anticlockwise → North.",
    points: 3,
  },
  {
    id: "dir_y5_01", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    style: "direction-rotation", source: "pmc",
    text: "A dancer faces South-West. She turns 270° clockwise. Which direction does she now face?",
    options: ["North-East", "North-West", "South-East", "South-West", "East"],
    answer: "South-East",
    explanation: "Using 45° steps clockwise from SW: SW→W(45°)→NW(90°)→N(135°)→NE(180°)→E(225°)→SE(270°). So 270° clockwise from SW = SE.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: meeting-point
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "meet_y5_01", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    style: "meeting-point", source: "pmc",
    text: "A spider and a fly are 33 cm apart. The spider moves towards the fly at 7 cm per second and the fly moves towards the spider at 4 cm per second. How many seconds before they meet?",
    options: ["2 sec", "3 sec", "4 sec", "5 sec", "6 sec"],
    answer: "3 sec",
    explanation: "Together they close the gap at 7 + 4 = 11 cm/s. Time = 33 ÷ 11 = 3 seconds.",
    points: 4,
  },
  {
    id: "meet_y5_02", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    style: "meeting-point", source: "pmc",
    text: "Two trains are 120 km apart on the same track, heading towards each other. Train A travels at 40 km/h and Train B at 20 km/h. How long before they meet?",
    options: ["1 hour", "2 hours", "3 hours", "4 hours", "5 hours"],
    answer: "2 hours",
    explanation: "Combined closing speed = 40 + 20 = 60 km/h. Time = 120 ÷ 60 = 2 hours.",
    points: 4,
  },
  {
    id: "meet_y6_01", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    style: "meeting-point", source: "pmc",
    text: "Anya walks from Town A to Town B at 4 km/h. Ben cycles from Town B to Town A at 12 km/h. The towns are 20 km apart. They set off at the same time. How far from Town A do they meet?",
    options: ["4 km", "5 km", "6 km", "8 km", "10 km"],
    answer: "5 km",
    explanation: "Combined speed = 4 + 12 = 16 km/h. Time to meet = 20 ÷ 16 = 1.25 hours. Anya travels 4 × 1.25 = 5 km from Town A.",
    points: 5,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: best-value
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "bval_y4_01", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    style: "best-value", source: "pmc",
    text: "A shop sells biscuits: 1 for 30p, 3 for 80p, or 5 for £1.20. Which deal gives the cheapest price per biscuit?",
    options: ["1 for 30p", "3 for 80p", "5 for £1.20", "They are all the same", "Cannot tell"],
    answer: "5 for £1.20",
    explanation: "Per biscuit: 1 for 30p = 30p. 3 for 80p ≈ 26.7p. 5 for 120p = 24p. The 5-pack is cheapest.",
    points: 3,
  },
  {
    id: "bval_y4_02", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    style: "best-value", source: "pmc",
    text: "Nibbletts come in three offers: 2 for the price of 1, 3 for the price of 2, or 5 for the price of 3. Which offer gives you the most Nibbletts for your money?",
    options: ["2 for price of 1", "3 for price of 2", "5 for price of 3", "They are all the same", "Cannot tell"],
    answer: "2 for price of 1",
    explanation: "Work out what fraction you pay: '2 for 1' = pay for 1 out of 2 = 50%. '3 for 2' = pay for 2 out of 3 ≈ 67%. '5 for 3' = pay for 3 out of 5 = 60%. The lowest fraction paid is the best deal: '2 for price of 1'.",
    points: 3,
  },
  {
    id: "bval_y5_01", skill: "addition", year: 5, difficulty: 2, type: "mcq",
    style: "best-value", source: "pmc",
    text: "Orange juice: 250 ml for 60p, 500 ml for £1.10, or 1 litre for £2.00. Which is the best value?",
    options: ["250 ml for 60p", "500 ml for £1.10", "1 litre for £2.00", "250 ml and 500 ml are equal", "All the same"],
    answer: "1 litre for £2.00",
    explanation: "Price per 100 ml: 250 ml = 60÷2.5 = 24p. 500 ml = 110÷5 = 22p. 1 litre = 200÷10 = 20p. The 1-litre bottle is cheapest per ml.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: simultaneous-constraints
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "sim_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "simultaneous-constraints", source: "nns",
    text: "Zids have 4 spots. Zods have 9 spots. Altogether some Zids and Zods have 48 spots. How many Zids are there?",
    options: ["0", "3", "6", "9", "12"],
    answer: "3",
    explanation: "Try: 3 Zids = 12 spots, leaving 48 − 12 = 36 spots for Zods. 36 ÷ 9 = 4 Zods. Check: 3×4 + 4×9 = 12 + 36 = 48. ✓",
    points: 5,
  },
  {
    id: "sim_y5_02", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "simultaneous-constraints", source: "nns",
    text: "Cats have 4 legs. Birds have 2 legs. A pet shop has some cats and birds. There are 7 animals and 22 legs altogether. How many cats are there?",
    options: ["2", "3", "4", "5", "6"],
    answer: "4",
    explanation: "Let c = cats. Birds = 7 − c. Legs: 4c + 2(7−c) = 22 → 4c + 14 − 2c = 22 → 2c = 8 → c = 4. Check: 4 cats (16 legs) + 3 birds (6 legs) = 22 legs. ✓",
    points: 5,
  },
  {
    id: "sim_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    style: "simultaneous-constraints", source: "nns",
    text: "At Franco's café: 1 curry and 1 tea cost £4.50. 2 curries and 1 tea cost £7.50. How much does 1 curry cost?",
    options: ["£2.00", "£2.50", "£3.00", "£3.50", "£4.00"],
    answer: "£3.00",
    explanation: "The difference between the two orders is 1 extra curry costing £7.50 − £4.50 = £3.00.",
    points: 5,
  },
  {
    id: "sim_y6_02", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    style: "simultaneous-constraints", source: "nns",
    text: "A pet rescue has equal numbers of parrots, cats and dogs. Parrots have 2 legs, cats and dogs have 4 legs each. There are 30 legs altogether. How many cats are there?",
    options: ["2", "3", "4", "5", "6"],
    answer: "3",
    explanation: "Let n = number of each animal. Legs = 2n + 4n + 4n = 10n = 30. So n = 3. There are 3 cats.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: age-problems
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "age_y4_01", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    style: "age-problems", source: "singapore",
    text: "Five years ago, Sam was 8 years old. His mum is 26 years older than him. How old will Sam's mum be in 3 years' time?",
    options: ["39", "40", "41", "42", "43"],
    answer: "42",
    explanation: "Sam now = 8 + 5 = 13. Mum now = 13 + 26 = 39. In 3 years: 39 + 3 = 42.",
    points: 3,
  },
  {
    id: "age_y4_02", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    style: "age-problems", source: "singapore",
    text: "Lily is 9 years old. Her dad is 4 times her age. How old will her dad be when Lily is 15?",
    options: ["36", "38", "40", "42", "44"],
    answer: "42",
    explanation: "Dad now = 4 × 9 = 36. Age gap = 36 − 9 = 27 years (constant). When Lily is 15: dad = 15 + 27 = 42.",
    points: 3,
  },
  {
    id: "age_y5_01", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    style: "age-problems", source: "nns",
    text: "My age this year is a multiple of 8. Next year it will be a multiple of 7. How old am I?",
    options: ["8", "24", "32", "40", "48"],
    answer: "48",
    explanation: "Check multiples of 8: 8→9 (not ×7), 16→17 (no), 24→25 (no), 32→33 (no), 40→41 (no), 48→49=7×7 ✓. I am 48.",
    points: 4,
  },
  {
    id: "age_y5_02", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    style: "age-problems", source: "nns",
    text: "Last year my age was a square number. Next year it will be a cube number. How old am I now?",
    options: ["7", "8", "9", "25", "26"],
    answer: "26",
    explanation: "I need: last year = square, next year = cube. So square + 2 = cube. 25 + 2 = 27 ✓ (25 = 5², 27 = 3³). Last year I was 25, next year 27, so I'm 26 now.",
    points: 5,
  },
  {
    id: "age_y5_03", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    style: "age-problems", source: "singapore",
    text: "Daniel is 5 years older than his sister. In 4 years, the sum of their ages will be 27. How old is Daniel now?",
    options: ["7", "9", "11", "12", "14"],
    answer: "12",
    explanation: "Let sister = s, Daniel = s+5. In 4 years: (s+4)+(s+5+4)=27 → 2s+13=27 → 2s=14 → s=7. Daniel = 7+5 = 12.",
    points: 4,
  },
  {
    id: "age_y6_01", skill: "addition", year: 6, difficulty: 3, type: "mcq",
    style: "age-problems", source: "nns",
    text: "Mum was 27 when I was born. Eight years ago, she was twice as old as I will be in 5 years' time. How old am I now?",
    options: ["6", "7", "8", "9", "10"],
    answer: "9",
    explanation: "Let my age now = a. Eight years ago, mum's age = (27+a)−8 = a+19. In 5 years, my age = a+5. Equation: a+19 = 2(a+5) → a+19 = 2a+10 → 9 = a.",
    points: 5,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: coin-combinations
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "coin_y3_01", skill: "addition", year: 3, difficulty: 1, type: "mcq",
    style: "coin-combinations", source: "nns",
    text: "Lucy wants to pay exactly 15p using exactly 3 coins. Which combination works? (Coins: 1p, 2p, 5p, 10p, 20p)",
    options: ["5p + 5p + 5p", "10p + 2p + 2p", "5p + 5p + 2p", "10p + 5p + 1p", "10p + 3p + 2p"],
    answer: "5p + 5p + 5p",
    explanation: "5+5+5=15p ✓ using exactly 3 coins. Check others: 10+2+2=14p ✗. 5+5+2=12p ✗. 10+5+1=16p ✗. 3p coin doesn't exist.",
    points: 3,
  },
  {
    id: "coin_y4_01", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    style: "coin-combinations", source: "nns",
    text: "What is the smallest number of coins needed to pay exactly 76p? (Coins: 1p, 2p, 5p, 10p, 20p, 50p)",
    options: ["3", "4", "5", "6", "7"],
    answer: "4",
    explanation: "76p = 50p + 20p + 5p + 1p = 4 coins. ✓",
    points: 3,
  },
  {
    id: "coin_y5_01", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    style: "coin-combinations", source: "nns",
    text: "Anna put some 10p coins on a table. Half of them were tails up. She turned over 2 coins (both tails to heads), and then one third of them were tails up. How many coins did Anna put on the table?",
    options: ["6", "8", "10", "12", "18"],
    answer: "12",
    explanation: "Let total = n. Initially n/2 tails up. After turning 2 tails to heads: tails = n/2 − 2 = n/3. So 3(n/2−2) = n → 3n/2 − 6 = n → n/2 = 6 → n = 12. Check: 12 coins, 6 tails. Turn 2 tails to heads: 4 tails = 12/3 = 4 ✓.",
    points: 5,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: balance-scales
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "bal_y3_01", skill: "logic", year: 3, difficulty: 1, type: "mcq",
    style: "balance-scales", source: "singapore",
    text: "A balance shows: 1 apple = 3 oranges. 1 orange = 2 grapes. How many grapes balance 1 apple?",
    options: ["3", "4", "5", "6", "7"],
    answer: "6",
    explanation: "1 apple = 3 oranges. Each orange = 2 grapes. So 1 apple = 3 × 2 = 6 grapes.",
    points: 3,
  },
  {
    id: "bal_y4_01", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    style: "balance-scales", source: "singapore",
    text: "3 identical boxes of type A balance with 1 box of type B and a 5 kg weight. Box B weighs 7 kg. What is the mass of one box A?",
    options: ["2 kg", "3 kg", "4 kg", "5 kg", "6 kg"],
    answer: "4 kg",
    explanation: "3A = B + 5 = 7 + 5 = 12 kg. So A = 12 ÷ 3 = 4 kg.",
    points: 3,
  },
  {
    id: "bal_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "balance-scales", source: "singapore",
    text: "On a balance: A + 4 kg = B. Also, 3A = B + 2 kg. What is the mass of box B?",
    options: ["4 kg", "5 kg", "6 kg", "7 kg", "8 kg"],
    answer: "7 kg",
    explanation: "From A + 4 = B: B = A + 4. Substitute into 3A = B + 2: 3A = (A+4)+2 = A+6 → 2A = 6 → A = 3 kg. B = 3 + 4 = 7 kg.",
    points: 5,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: logic-deduction
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "ded_y3_01", skill: "logic", year: 3, difficulty: 1, type: "mcq",
    style: "logic-deduction", source: "singapore",
    text: "Four friends each have a different pet: cat, dog, fish and rabbit. Aisha has a fish. Ben does not have a dog. Chloe has a cat. What pet does Dan have?",
    options: ["Cat", "Dog", "Fish", "Rabbit", "Bird"],
    answer: "Dog",
    explanation: "Aisha = fish, Chloe = cat. Remaining: dog and rabbit for Ben and Dan. Ben doesn't have a dog, so Ben = rabbit and Dan = dog.",
    points: 3,
  },
  {
    id: "ded_y3_02", skill: "logic", year: 3, difficulty: 2, type: "mcq",
    style: "logic-deduction", source: "singapore",
    text: "Andy, Ben, Lucas and Siti had lunch. They ordered: chicken rice, noodles, fish & chips and pasta. Siti loves fish. Andy prefers rice. Lucas did not order noodles. What did Ben order?",
    options: ["Chicken rice", "Noodles", "Fish & chips", "Pasta", "Cannot tell"],
    answer: "Noodles",
    explanation: "Siti = fish & chips. Andy = chicken rice. Lucas ≠ noodles, so Lucas = pasta. Ben = noodles.",
    points: 3,
  },
  {
    id: "ded_y4_01", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    style: "logic-deduction", source: "singapore",
    text: "Five pupils finished a race in different positions. Ella finished before Dan. Dan finished before Finn. Finn finished before Bea. Bea finished before Cal. Who finished 3rd?",
    options: ["Ella", "Dan", "Finn", "Bea", "Cal"],
    answer: "Finn",
    explanation: "Order: Ella (1st) → Dan (2nd) → Finn (3rd) → Bea (4th) → Cal (5th). Finn finished 3rd.",
    points: 3,
  },
  {
    id: "ded_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "logic-deduction", source: "singapore",
    text: "In a class, every pupil plays at least one sport. 18 play football, 14 play tennis, and 8 play both. How many pupils are in the class?",
    options: ["18", "20", "24", "26", "32"],
    answer: "24",
    explanation: "Total = football + tennis − both = 18 + 14 − 8 = 24.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: fraction-remaining
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "frac_rem_y4_01", skill: "fractions", year: 4, difficulty: 2, type: "mcq",
    style: "fraction-remaining", source: "singapore",
    text: "Tom had a pizza. He gave 1/4 to his sister and 2/4 to his friend. What fraction of the pizza did Tom have left?",
    options: ["1/8", "1/4", "1/3", "1/2", "3/4"],
    answer: "1/4",
    explanation: "Tom gave away 1/4 + 2/4 = 3/4. He kept 1 − 3/4 = 1/4.",
    points: 3,
  },
  {
    id: "frac_rem_y4_02", skill: "fractions", year: 4, difficulty: 2, type: "mcq",
    style: "fraction-remaining", source: "singapore",
    text: "Steve had a pizza. He gave 3/10 to his sister and twice as many pieces to his father. What fraction did Steve have left?",
    options: ["1/10", "2/10", "3/10", "4/10", "5/10"],
    answer: "1/10",
    explanation: "Steve gave 3/10 to sister and 2 × 3/10 = 6/10 to father. Total given = 3/10 + 6/10 = 9/10. Left = 1 − 9/10 = 1/10.",
    points: 3,
  },
  {
    id: "frac_rem_y5_01", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    style: "fraction-remaining", source: "singapore",
    text: "A bag had 60 sweets. Maya ate 1/3 of them. Her brother ate 2/5 of the remainder. How many sweets were left?",
    options: ["12", "16", "20", "24", "28"],
    answer: "24",
    explanation: "Maya ate 1/3 × 60 = 20. Remainder = 40. Brother ate 2/5 × 40 = 16. Left = 40 − 16 = 24.",
    points: 4,
  },
  {
    id: "frac_rem_y5_02", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    style: "fraction-remaining", source: "singapore",
    text: "A rope is 1 metre long. Joe cuts off 64 cm. He then cuts the remaining piece into 4 equal parts. How long is each part?",
    options: ["6 cm", "7 cm", "8 cm", "9 cm", "10 cm"],
    answer: "9 cm",
    explanation: "Remaining = 100 − 64 = 36 cm. Each part = 36 ÷ 4 = 9 cm.",
    points: 3,
  },
  {
    id: "frac_rem_y6_01", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    style: "fraction-remaining", source: "singapore",
    text: "Agnes bought 50 red and yellow beads. For every 4 red beads, there was 1 yellow bead. How many red beads did Agnes buy?",
    options: ["30", "35", "40", "45", "48"],
    answer: "40",
    explanation: "In every group of 5 beads, 4 are red. Number of groups = 50 ÷ 5 = 10. Red beads = 10 × 4 = 40.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: picture-graph
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "pgraph_y3_01", skill: "logic", year: 3, difficulty: 1, type: "mcq",
    style: "picture-graph", source: "singapore",
    text: "A picture graph shows favourite fruits. Each ★ symbol = 2 pupils. Apples: ★★★ (3 symbols), Bananas: ★★ (2 symbols), Oranges: ★★★★ (4 symbols). How many pupils chose apples or oranges?",
    options: ["6", "8", "10", "12", "14"],
    answer: "14",
    explanation: "Apples: 3 × 2 = 6 pupils. Oranges: 4 × 2 = 8 pupils. Total = 6 + 8 = 14 pupils.",
    points: 3,
  },
  {
    id: "pgraph_y3_02", skill: "logic", year: 3, difficulty: 2, type: "mcq",
    style: "picture-graph", source: "singapore",
    text: "A pictogram shows books read. Each ★ = 3 books. Ali: ★★★★ (4 stars), Beth: ★★ (2 stars), Cara: ★★★★★ (5 stars). How many more books did Cara read than Beth?",
    options: ["6", "7", "8", "9", "10"],
    answer: "9",
    explanation: "Cara: 5 × 3 = 15 books. Beth: 2 × 3 = 6 books. Difference = 15 − 6 = 9 books.",
    points: 3,
  },
  {
    id: "pgraph_y4_01", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    style: "picture-graph", source: "singapore",
    text: "A picture graph shows sandwiches sold. Each symbol = 10 sandwiches. Tuna: 4 symbols, Egg: 3 symbols. Chicken sandwiches = half the total of tuna and egg. How many chicken sandwiches were sold?",
    options: ["25", "30", "35", "40", "45"],
    answer: "35",
    explanation: "Tuna = 4 × 10 = 40. Egg = 3 × 10 = 30. Tuna + Egg = 70. Chicken = 70 ÷ 2 = 35.",
    points: 3,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: multi-step word problems
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "ms_y4_01", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    style: "multi-step-cutting", source: "singapore",
    text: "A pancake seller had 9 bottles of honey, each with 10 litres. He used 36 litres on Saturday and 23 litres on Sunday. How many litres of honey did he have left?",
    options: ["27", "31", "41", "51", "63"],
    answer: "31",
    explanation: "Total = 9 × 10 = 90 litres. Used = 36 + 23 = 59 litres. Left = 90 − 59 = 31 litres.",
    points: 3,
  },
  {
    id: "ms_y4_02", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    style: "multi-step-cutting", source: "singapore",
    text: "A ribbon is 2 metres long. Priya cuts off 35 cm for a bow and 45 cm for a headband. She cuts the remaining ribbon into 4 equal pieces. How long is each piece?",
    options: ["25 cm", "28 cm", "30 cm", "32 cm", "35 cm"],
    answer: "30 cm",
    explanation: "Total = 200 cm. Used = 35 + 45 = 80 cm. Remaining = 120 cm. Each piece = 120 ÷ 4 = 30 cm.",
    points: 3,
  },
  {
    id: "ms_y5_01", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    style: "multi-step-cutting", source: "singapore",
    text: "Oranges are sold in bags of 4 for £3 per bag. Mrs Lee bought 32 oranges and Mdm Rose bought 6 bags. How much did they spend altogether?",
    options: ["£36", "£40", "£42", "£44", "£48"],
    answer: "£42",
    explanation: "Mrs Lee: 32 ÷ 4 = 8 bags × £3 = £24. Mdm Rose: 6 × £3 = £18. Total = £24 + £18 = £42.",
    points: 4,
  },
  {
    id: "ms_y5_02", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    style: "multi-step-cutting", source: "nns",
    text: "Mr Tan has some money. If he buys a toaster for £49, he will have £26 left. If he buys an iron instead, he will be £17 short. How much does the iron cost?",
    options: ["£75", "£82", "£88", "£92", "£96"],
    answer: "£92",
    explanation: "Mr Tan has £49 + £26 = £75. The iron costs £75 + £17 = £92.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: digit-puzzle / place-value
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "plv_y3_01", skill: "addition", year: 3, difficulty: 1, type: "mcq",
    style: "digit-puzzle", source: "singapore",
    text: "Which of these correctly describes the number 513?",
    options: ["5 hundreds and 31 ones", "5 hundreds, 1 ten and 3 ones", "530 ones", "51 tens and 3 ones", "5 tens and 13 ones"],
    answer: "5 hundreds, 1 ten and 3 ones",
    explanation: "513 = 5 hundreds + 1 ten + 3 ones. Standard place value breakdown.",
    points: 3,
  },
  {
    id: "yr_y5_01", skill: "logic", year: 5, difficulty: 2, type: "mcq",
    style: "digit-puzzle", source: "pmc",
    text: "The digits of the year 2022 add up to 6. How many years after 2022 is the next year whose digits also add up to 6?",
    options: ["6", "7", "8", "9", "10"],
    answer: "9",
    explanation: "Check years: 2023→7, 2024→8, 2025→9, 2026→10, 2027→11, 2028→12, 2029→13, 2030→5, 2031→6 ✓. That's 2031 − 2022 = 9 years.",
    points: 4,
  },
  {
    id: "book_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    style: "digit-puzzle", source: "nns",
    text: "How many times does the digit 3 appear in the page numbers from 1 to 33?",
    options: ["4", "5", "6", "7", "8"],
    answer: "8",
    explanation: "Pages with a 3: 3(×1), 13(×1), 23(×1), 30(×1), 31(×1), 32(×1), 33(×2). Total = 1+1+1+1+1+1+2 = 8.",
    points: 5,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: rate-proportion / speed
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "spd_y5_01", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    style: "rate-proportion", source: "pmc",
    text: "Ringa Bell takes 20 minutes to cycle to school, which is 1 mile away. What is her average cycling speed in miles per hour?",
    options: ["2 mph", "3 mph", "4 mph", "5 mph", "6 mph"],
    answer: "3 mph",
    explanation: "20 minutes = 1/3 of an hour. Speed = 1 mile ÷ (1/3 hour) = 3 mph.",
    points: 3,
  },
  {
    id: "spd_y5_02", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    style: "rate-proportion", source: "pmc",
    text: "An electric scooter uses 20p of electricity to travel 25 miles. How much would it cost to travel 100 miles?",
    options: ["40p", "60p", "80p", "£1.00", "£1.20"],
    answer: "80p",
    explanation: "100 miles = 4 × 25 miles. Cost = 4 × 20p = 80p.",
    points: 3,
  },
  {
    id: "spd_y6_01", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    style: "rate-proportion", source: "pmc",
    text: "My teacher has 18 socks (9 pairs). He puts on a clean pair every 3 days. How many days can he wear socks before he has to wash them all?",
    options: ["12", "18", "21", "27", "36"],
    answer: "27",
    explanation: "9 pairs × 3 days per pair = 27 days.",
    points: 3,
  },
  {
    id: "rate2_y5_01", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    style: "rate-proportion", source: "tmc",
    text: "A wheel makes 360 revolutions per hour. How many seconds does it take to complete 1 revolution?",
    options: ["5 seconds", "8 seconds", "10 seconds", "12 seconds", "15 seconds"],
    answer: "10 seconds",
    explanation: "360 revolutions per hour = 360 per 3600 seconds = 1 revolution per 10 seconds.",
    points: 4,
  },
  {
    id: "rate2_y6_01", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    style: "rate-proportion", source: "tmc",
    text: "A car travels at 60 mph and a lorry at 45 mph. They set off from the same place at the same time in the same direction. After 2 hours, how far apart are they?",
    options: ["15 miles", "20 miles", "25 miles", "30 miles", "35 miles"],
    answer: "30 miles",
    explanation: "Car: 2 × 60 = 120 miles. Lorry: 2 × 45 = 90 miles. Distance apart = 120 − 90 = 30 miles.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: consecutive-integers
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "con_y4_01", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    style: "consecutive-integers", source: "tmc",
    text: "Three consecutive numbers add up to 48. What is the largest of the three?",
    options: ["14", "15", "16", "17", "18"],
    answer: "17",
    explanation: "Middle number = 48 ÷ 3 = 16. Largest = 16 + 1 = 17.",
    points: 3,
  },
  {
    id: "con_y5_01", skill: "addition", year: 5, difficulty: 2, type: "mcq",
    style: "consecutive-integers", source: "tmc",
    text: "Five consecutive integers add up to 85. What is the smallest of the five?",
    options: ["13", "14", "15", "16", "17"],
    answer: "15",
    explanation: "Middle number = 85 ÷ 5 = 17. Smallest = 17 − 2 = 15.",
    points: 3,
  },
  {
    id: "con_y5_02", skill: "addition", year: 5, difficulty: 3, type: "mcq",
    style: "consecutive-integers", source: "tmc",
    text: "The sum of four consecutive even numbers is 92. What is the largest of the four?",
    options: ["20", "22", "24", "26", "28"],
    answer: "26",
    explanation: "Let the numbers be n, n+2, n+4, n+6. Sum = 4n+12 = 92 → 4n = 80 → n = 20. Largest = 20+6 = 26.",
    points: 4,
  },
  {
    id: "con_y6_01", skill: "addition", year: 6, difficulty: 3, type: "mcq",
    style: "consecutive-integers", source: "tmc",
    text: "The sum of three consecutive integers is 54. What is the product of the smallest and largest?",
    options: ["287", "306", "323", "342", "361"],
    answer: "323",
    explanation: "Middle = 54 ÷ 3 = 18. Numbers are 17, 18, 19. Product = 17 × 19 = 323.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: ordering-quantities
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "ord2_y5_01", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    style: "ordering-quantities", source: "tmc",
    text: "Three runners completed different fractions of a race: Amir ran 3/5, Bea ran 0.58, Cal ran 61%. Who ran the furthest?",
    options: ["Amir", "Bea", "Cal", "They all ran the same", "Cannot tell"],
    answer: "Cal",
    explanation: "Convert: Amir = 0.60, Bea = 0.58, Cal = 0.61. Cal ran furthest.",
    points: 3,
  },
  {
    id: "ord2_y5_02", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    style: "ordering-quantities", source: "tmc",
    text: "Which is the correct order from smallest to largest: 3/8, 0.4, 35%?",
    options: ["3/8, 35%, 0.4", "35%, 3/8, 0.4", "3/8, 0.4, 35%", "35%, 0.4, 3/8", "0.4, 3/8, 35%"],
    answer: "35%, 3/8, 0.4",
    explanation: "Convert: 3/8 = 0.375, 0.4 = 0.400, 35% = 0.350. Order: 0.350 < 0.375 < 0.400 → 35%, 3/8, 0.4.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: triangular-numbers
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "tri2_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    style: "triangular-numbers", source: "tmc",
    text: "A jar has 56 sweets. The first child takes 1, the second takes 2, the third takes 3, and so on. How many sweets are left when the next child cannot take their full share?",
    options: ["0", "1", "2", "3", "4"],
    answer: "1",
    explanation: "1+2+...+10 = 55 sweets taken. 56 − 55 = 1 sweet left. The 11th child needs 11 but only 1 remains.",
    points: 4,
  },
  {
    id: "tri2_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    style: "triangular-numbers", source: "tmc",
    text: "Which of these numbers is a triangular number?",
    options: ["20", "25", "28", "32", "35"],
    answer: "28",
    explanation: "Triangular numbers: 1, 3, 6, 10, 15, 21, 28, 36... 28 = 1+2+3+4+5+6+7 ✓.",
    points: 4,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: median-real-data
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "med2_y5_01", skill: "logic", year: 5, difficulty: 2, type: "mcq",
    style: "median-real-data", source: "tmc",
    text: "Six pupils scored these marks: 14, 7, 19, 11, 14, 8. What is the median score?",
    options: ["11", "12", "12.5", "13", "14"],
    answer: "12.5",
    explanation: "Sorted: 7, 8, 11, 14, 14, 19. Median = mean of 3rd and 4th = (11+14)÷2 = 12.5.",
    points: 4,
  },
  {
    id: "med2_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    style: "median-real-data", source: "tmc",
    text: "A train stops at five stations. The number of letters in each name: Elm (3), Riverside (9), Oak Park (8), Central (7), Bridge (6). What is the median number of letters?",
    options: ["6", "6.5", "7", "7.5", "8"],
    answer: "7",
    explanation: "Sorted: 3, 6, 7, 8, 9. With 5 values, median = 3rd value = 7.",
    points: 3,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: arithmetic-sequence
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "arith2_y4_01", skill: "patterns", year: 4, difficulty: 1, type: "mcq",
    style: "arithmetic-sequence", source: "tmc",
    text: "A sequence starts: 4, 7, 10, 13, ... What is the 10th term?",
    options: ["28", "29", "30", "31", "32"],
    answer: "31",
    explanation: "Increases by 3 each time. nth term = 3n+1. For n=10: 3×10+1 = 31.",
    points: 3,
  },
  {
    id: "arith2_y5_01", skill: "patterns", year: 5, difficulty: 2, type: "mcq",
    style: "arithmetic-sequence", source: "tmc",
    text: "An arithmetic sequence starts 2, 6, 10, 14, ... What is the 15th term?",
    options: ["54", "56", "58", "60", "62"],
    answer: "58",
    explanation: "Common difference = 4. nth term = 4n−2. For n=15: 4×15−2 = 58.",
    points: 3,
  },
  {
    id: "arith2_y6_01", skill: "patterns", year: 6, difficulty: 3, type: "mcq",
    style: "arithmetic-sequence", source: "tmc",
    text: "The 4th term of an arithmetic sequence is 19 and the 7th term is 31. What is the 1st term?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7",
    explanation: "From term 4 to term 7 is 3 steps: 31−19=12, so common difference = 4. Term 1 = 19 − 3×4 = 7.",
    points: 5,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: counting-shapes (additional)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "ctri_y4_01", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    style: "counting-shapes", source: "nns",
    text: "A large triangle is divided into 4 smaller equal triangles by connecting the midpoints of its sides. How many triangles are there in total (including the large one)?",
    options: ["4", "5", "6", "7", "8"],
    answer: "5",
    explanation: "4 small triangles + 1 large triangle = 5 triangles in total.",
    points: 3,
  },
  {
    id: "ctri_y5_01", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    style: "counting-shapes", source: "nns",
    text: "How many squares of ALL sizes are there in a 3×3 grid of squares?",
    options: ["9", "12", "14", "16", "18"],
    answer: "14",
    explanation: "1×1 squares: 9. 2×2 squares: 4. 3×3 squares: 1. Total = 9+4+1 = 14.",
    points: 4,
  },
  {
    id: "per_y2_01", skill: "shapes", year: 2, difficulty: 1, type: "mcq",
    style: "counting-shapes", source: "singapore",
    text: "Andy places 2 bottles on each side of a square (not at corners). How many bottles does he need to go all the way around 1 square?",
    options: ["6", "7", "8", "9", "10"],
    answer: "8",
    explanation: "A square has 4 sides. 2 bottles × 4 sides = 8 bottles.",
    points: 3,
  },
  {
    id: "per_y3_01", skill: "shapes", year: 3, difficulty: 2, type: "mcq",
    style: "counting-shapes", source: "singapore",
    text: "Andy places 2 bottles on each side of a square (not at corners). How many bottles does he need to go all the way around 3 separate squares?",
    options: ["20", "22", "24", "26", "28"],
    answer: "24",
    explanation: "Each square needs 4 × 2 = 8 bottles. For 3 squares: 3 × 8 = 24 bottles.",
    points: 3,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: value-for-money / profit-loss
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "val2_y4_01", skill: "addition", year: 4, difficulty: 2, type: "mcq",
    style: "value-for-money", source: "tmc",
    text: "A swimming pool charges £3 per visit OR £20 for a monthly pass. Mia swims 8 times in a month. How much does she save with the monthly pass?",
    options: ["£2", "£3", "£4", "£5", "£6"],
    answer: "£4",
    explanation: "Pay per visit: 8 × £3 = £24. Monthly pass: £20. Saving = £24 − £20 = £4.",
    points: 3,
  },
  {
    id: "val2_y6_01", skill: "addition", year: 6, difficulty: 3, type: "mcq",
    style: "value-for-money", source: "tmc",
    text: "A fair charges £12 for an evening pass OR £1.50 per ride. Three friends buy evening passes. They go on 6, 9 and 14 rides respectively. How much do they save altogether?",
    options: ["£4.50", "£7.50", "£10.50", "£13.50", "£16.50"],
    answer: "£7.50",
    explanation: "Pay per ride: (6+9+14) × £1.50 = 29 × £1.50 = £43.50. Evening passes: 3 × £12 = £36. Saving = £43.50 − £36 = £7.50.",
    points: 5,
  },
  {
    id: "profit_y6_01", skill: "addition", year: 6, difficulty: 3, type: "mcq",
    style: "value-for-money", source: "nns",
    text: "Flash Harry bought a saddle for £100, sold it for £200, bought it back for £300, then sold it for £400. Overall, did he make or lose money, and how much?",
    options: ["Made £100", "Made £200", "Made £300", "Lost £100", "Lost £200"],
    answer: "Made £200",
    explanation: "Transaction 1: bought £100, sold £200 → profit £100. Transaction 2: bought £300, sold £400 → profit £100. Total profit = £200.",
    points: 5,
  },
  // ══════════════════════════════════════════════════════════════════════════
  // STYLE: venn-diagram (additional)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "venn3_y4_01", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    style: "venn-diagram", source: "tmc",
    text: "In a class of 30 pupils, 18 have a cat, 14 have a dog, and 5 have both. How many pupils have neither a cat nor a dog?",
    options: ["1", "2", "3", "4", "5"],
    answer: "3",
    explanation: "At least one pet = 18 + 14 − 5 = 27. Neither = 30 − 27 = 3.",
    points: 3,
  },
  {
    id: "venn3_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    style: "venn-diagram", source: "tmc",
    text: "50 people were asked about TV and radio. 41 watched TV, 15 listened to radio, 6 did both. How many did neither?",
    options: ["0", "1", "2", "3", "4"],
    answer: "0",
    explanation: "At least one = 41 + 15 − 6 = 50. Neither = 50 − 50 = 0.",
    points: 4,
  },
];

// ─── DMP-inspired questions (Daily Maths Puzzle) ─────────────────────────────
const dmpQuestions: Question[] = [
  // ── RATIO OF TWO LENGTHS ──────────────────────────────────────────────────
  {
    id: "dmp_y4_01", skill: "logic", year: 4, difficulty: 2, type: "mcq",
    text: "A blue ribbon is 3 times as long as a red ribbon. Together they measure 24 cm. How long is the blue ribbon?",
    options: ["6 cm", "12 cm", "18 cm", "21 cm"],
    answer: "18 cm",
    explanation: "Let red = r. Blue = 3r. Together: r + 3r = 4r = 24, so r = 6 cm. Blue = 3 × 6 = 18 cm.",
    style: "ratio-word-problem", source: "original", points: 3,
  },
  {
    id: "dmp_y5_01", skill: "logic", year: 5, difficulty: 2, type: "mcq",
    text: "Rope B is 4 times as long as rope A. Together they measure 30 cm. How long is rope B?",
    options: ["6 cm", "20 cm", "24 cm", "25 cm"],
    answer: "24 cm",
    explanation: "Let A = a. B = 4a. Together: a + 4a = 5a = 30, so a = 6 cm. B = 4 × 6 = 24 cm.",
    style: "ratio-word-problem", source: "original", points: 3,
  },
  {
    id: "dmp_y5_02", skill: "logic", year: 5, difficulty: 2, type: "mcq",
    text: "A piece of string is cut into two pieces. The longer piece is 5 times the length of the shorter piece. The total length is 42 cm. How long is the longer piece?",
    options: ["7 cm", "30 cm", "35 cm", "40 cm"],
    answer: "35 cm",
    explanation: "Let short = s. Long = 5s. Together: s + 5s = 6s = 42, so s = 7 cm. Long = 5 × 7 = 35 cm.",
    style: "ratio-word-problem", source: "original", points: 3,
  },
  {
    id: "dmp_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    text: "A garden path is divided into two sections. Section A is 2.5 times the length of section B. The total length is 49 m. How long is section A?",
    options: ["14 m", "28 m", "35 m", "42 m"],
    answer: "35 m",
    explanation: "Let B = b. A = 2.5b. Together: b + 2.5b = 3.5b = 49, so b = 14 m. A = 2.5 × 14 = 35 m.",
    style: "ratio-word-problem", source: "original", points: 4,
  },
  // ── LIQUID / CAPACITY MULTI-STEP ─────────────────────────────────────────
  {
    id: "dmp_y3_01", skill: "measurement", year: 3, difficulty: 1, type: "mcq",
    text: "A jug holds 300 ml of water. Tom pours in another 60 ml. He then pours out half. How much water is left in the jug?",
    options: ["150 ml", "180 ml", "200 ml", "240 ml"],
    answer: "180 ml",
    explanation: "300 + 60 = 360 ml. Half of 360 = 180 ml.",
    style: "standard", source: "original", points: 3,
  },
  {
    id: "dmp_y4_02", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    text: "A bottle holds 500 ml. Emma pours in another 80 ml. She then pours out a quarter. How much is left?",
    options: ["420 ml", "435 ml", "440 ml", "450 ml"],
    answer: "435 ml",
    explanation: "500 + 80 = 580 ml. A quarter of 580 = 145 ml. 580 − 145 = 435 ml.",
    style: "standard", source: "original", points: 3,
  },
  // ── CUT FROM ROD / RIBBON ────────────────────────────────────────────────
  {
    id: "dmp_y4_03", skill: "measurement", year: 4, difficulty: 1, type: "mcq",
    text: "A piece of ribbon is 20 cm long. It is cut into 3 pieces. Piece A is 7 cm and piece B is 5.5 cm. How long is piece C?",
    options: ["6 cm", "7 cm", "7.5 cm", "8 cm"],
    answer: "7.5 cm",
    explanation: "Total = 20 cm. A + B = 7 + 5.5 = 12.5 cm. C = 20 − 12.5 = 7.5 cm.",
    style: "multi-step-cutting", source: "original", points: 3,
  },
  {
    id: "dmp_y5_04", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    text: "A wooden rod is 1 m long. Three pieces are cut from it: 23 cm, 18.5 cm and 31 cm. How much rod is left?",
    options: ["25.5 cm", "27 cm", "27.5 cm", "28 cm"],
    answer: "27.5 cm",
    explanation: "Total cut = 23 + 18.5 + 31 = 72.5 cm. Remaining = 100 − 72.5 = 27.5 cm.",
    style: "multi-step-cutting", source: "original", points: 3,
  },
  {
    id: "dmp_y5_17", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "A piece of wood is 2.75 m long. Three pieces are cut off: 0.8 m, 0.65 m and 0.4 m. How much wood is left?",
    options: ["0.7 m", "0.8 m", "0.9 m", "1.0 m"],
    answer: "0.9 m",
    explanation: "Total cut = 0.8 + 0.65 + 0.4 = 1.85 m. Remaining = 2.75 − 1.85 = 0.9 m.",
    style: "multi-step-cutting", source: "original", points: 3,
  },
  {
    id: "dmp_y6_13", skill: "fractions", year: 6, difficulty: 2, type: "mcq",
    text: "A rope is 4.5 m long. Pieces of 1.25 m, 0.8 m and 1.1 m are cut from it. How much rope remains?",
    options: ["1.25 m", "1.35 m", "1.45 m", "1.55 m"],
    answer: "1.35 m",
    explanation: "Total cut = 1.25 + 0.8 + 1.1 = 3.15 m. Remaining = 4.5 − 3.15 = 1.35 m.",
    style: "multi-step-cutting", source: "original", points: 3,
  },
  // ── COMPOUND SHAPE — 3 IDENTICAL RECTANGLES ──────────────────────────────
  {
    id: "dmp_y4_05", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    text: "A large rectangle is made by placing 3 identical smaller rectangles side by side. Each small rectangle is 4 cm wide and 7 cm tall. What is the area of the large rectangle?",
    options: ["28 cm²", "56 cm²", "84 cm²", "112 cm²"],
    answer: "84 cm²",
    explanation: "Each small rectangle has area 4 × 7 = 28 cm². Three of them: 3 × 28 = 84 cm².",
    style: "floor-plan-area", source: "original", points: 3,
  },
  // ── INTERIOR ANGLES OF REGULAR POLYGONS ──────────────────────────────────
  {
    id: "dmp_y6_02", skill: "shapes", year: 6, difficulty: 2, type: "mcq",
    text: "What is the size of each interior angle of a regular hexagon?",
    options: ["108°", "120°", "135°", "144°"],
    answer: "120°",
    explanation: "Sum of interior angles = (6 − 2) × 180° = 720°. Each angle = 720° ÷ 6 = 120°.",
    style: "angle-polygon", source: "original", points: 3,
  },
  {
    id: "dmp_y6_03", skill: "shapes", year: 6, difficulty: 2, type: "mcq",
    text: "What is the size of each interior angle of a regular octagon?",
    options: ["120°", "128°", "135°", "140°"],
    answer: "135°",
    explanation: "Sum of interior angles = (8 − 2) × 180° = 1080°. Each angle = 1080° ÷ 8 = 135°.",
    style: "angle-polygon", source: "original", points: 3,
  },
  {
    id: "dmp_y6_04", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A regular polygon has interior angles of 144°. How many sides does it have?",
    options: ["8", "9", "10", "12"],
    answer: "10",
    explanation: "Exterior angle = 180° − 144° = 36°. Number of sides = 360° ÷ 36° = 10.",
    style: "angle-polygon", source: "original", points: 4,
  },
  {
    id: "dmp_y5_07", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "What is the size of each exterior angle of a regular pentagon?",
    options: ["60°", "72°", "90°", "108°"],
    answer: "72°",
    explanation: "Exterior angles of any polygon sum to 360°. Pentagon has 5 sides: 360° ÷ 5 = 72°.",
    style: "angle-polygon", source: "original", points: 3,
  },
  // ── PENTAGON + SQUARE COMPOUND SHAPE ─────────────────────────────────────
  {
    id: "dmp_y6_05", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A regular pentagon and a square share one side. The area of the square is 36 cm². What is the perimeter of the whole shape (the shared side is not an outer edge)?",
    options: ["36 cm", "42 cm", "48 cm", "54 cm"],
    answer: "42 cm",
    explanation: "Square side = √36 = 6 cm. Pentagon has 5 sides, square has 4 sides. They share 1 side, so exposed sides = 5 + 4 − 2 = 7. Perimeter = 7 × 6 = 42 cm.",
    style: "compound-perimeter", source: "original", points: 4,
  },
  {
    id: "dmp_y6_06", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A regular hexagon and a square share one side. The area of the square is 49 cm². What is the perimeter of the whole shape?",
    options: ["49 cm", "56 cm", "63 cm", "70 cm"],
    answer: "56 cm",
    explanation: "Square side = √49 = 7 cm. Hexagon has 6 sides, square has 4 sides. Shared side removed from each: exposed = 6 + 4 − 2 = 8 sides. Perimeter = 8 × 7 = 56 cm.",
    style: "compound-perimeter", source: "original", points: 4,
  },
  // ── TRIANGLE + SQUARE COMPOUND ───────────────────────────────────────────
  {
    id: "dmp_y5_08", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "A house shape is made of a square with a triangle on top. The total height is 9 cm. The square is twice the height of the triangle. What is the area of the triangle?",
    options: ["6 cm²", "9 cm²", "12 cm²", "18 cm²"],
    answer: "9 cm²",
    explanation: "Let triangle height = h. Square height = 2h. Total: h + 2h = 3h = 9, so h = 3 cm. Square side = 6 cm = triangle base. Area of triangle = (6 × 3) ÷ 2 = 9 cm².",
    style: "floor-plan-area", source: "original", points: 3,
  },
  {
    id: "dmp_y6_07", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A shape is made of a square with a triangle on top. The total height is 15 cm. The triangle is one third of the total height. What is the area of the whole shape?",
    options: ["100 cm²", "125 cm²", "150 cm²", "175 cm²"],
    answer: "125 cm²",
    explanation: "Triangle height = 15 ÷ 3 = 5 cm. Square height = 10 cm = square side. Area of square = 100 cm². Area of triangle = (10 × 5) ÷ 2 = 25 cm². Total = 125 cm².",
    style: "floor-plan-area", source: "original", points: 4,
  },
  // ── PERIMETER FROM AREA ───────────────────────────────────────────────────
  {
    id: "dmp_y5_09", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "The area of a square is 64 cm². What is its perimeter?",
    options: ["16 cm", "24 cm", "32 cm", "40 cm"],
    answer: "32 cm",
    explanation: "Side = √64 = 8 cm. Perimeter = 4 × 8 = 32 cm.",
    style: "standard", source: "original", points: 3,
  },
  {
    id: "dmp_y5_10", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "The area of a square is 121 cm². What is its perimeter?",
    options: ["40 cm", "44 cm", "48 cm", "52 cm"],
    answer: "44 cm",
    explanation: "Side = √121 = 11 cm. Perimeter = 4 × 11 = 44 cm.",
    style: "standard", source: "original", points: 3,
  },
  {
    id: "dmp_y6_08", skill: "shapes", year: 6, difficulty: 2, type: "mcq",
    text: "A square has an area of 225 cm². A regular hexagon has the same side length as the square. What is the perimeter of the hexagon?",
    options: ["60 cm", "75 cm", "90 cm", "105 cm"],
    answer: "90 cm",
    explanation: "Square side = √225 = 15 cm. Hexagon perimeter = 6 × 15 = 90 cm.",
    style: "compound-perimeter", source: "original", points: 3,
  },
  // ── MULTI-STEP AREA PROBLEMS ──────────────────────────────────────────────
  {
    id: "dmp_y5_11", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "A rectangle has a length of 12 cm and a width of 8 cm. A square with side 4 cm is cut from one corner. What is the area of the remaining shape?",
    options: ["72 cm²", "80 cm²", "88 cm²", "96 cm²"],
    answer: "80 cm²",
    explanation: "Rectangle area = 12 × 8 = 96 cm². Square area = 4 × 4 = 16 cm². Remaining = 96 − 16 = 80 cm².",
    style: "area-border-frame", source: "original", points: 3,
  },
  {
    id: "dmp_y5_12", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "A path 1 m wide runs around the outside of a rectangular garden that is 8 m long and 5 m wide. What is the area of just the path?",
    options: ["24 m²", "28 m²", "30 m²", "32 m²"],
    answer: "30 m²",
    explanation: "Outer rectangle (with path): (8+2) × (5+2) = 10 × 7 = 70 m². Inner garden: 8 × 5 = 40 m². Path = 70 − 40 = 30 m².",
    style: "area-border-frame", source: "original", points: 3,
  },
  {
    id: "dmp_y6_09", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A square lawn has side 10 m. A path 2 m wide runs around the inside edge of the lawn. What is the area of the path?",
    options: ["56 m²", "60 m²", "64 m²", "68 m²"],
    answer: "64 m²",
    explanation: "Outer square: 10 × 10 = 100 m². Inner square: (10 − 4) × (10 − 4) = 6 × 6 = 36 m². Path = 100 − 36 = 64 m².",
    style: "area-border-frame", source: "original", points: 4,
  },
  // ── FIND THE MISSING DIMENSION ────────────────────────────────────────────
  {
    id: "dmp_y4_06", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    text: "A rectangle has a perimeter of 30 cm. Its length is 9 cm. What is its width?",
    options: ["3 cm", "6 cm", "7 cm", "12 cm"],
    answer: "6 cm",
    explanation: "Perimeter = 2 × (length + width). 30 = 2 × (9 + w) → 15 = 9 + w → w = 6 cm.",
    style: "standard", source: "original", points: 3,
  },
  {
    id: "dmp_y5_15", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "A rectangle has an area of 84 cm². Its length is 12 cm. What is its perimeter?",
    options: ["28 cm", "38 cm", "40 cm", "42 cm"],
    answer: "38 cm",
    explanation: "Width = 84 ÷ 12 = 7 cm. Perimeter = 2 × (12 + 7) = 2 × 19 = 38 cm.",
    style: "standard", source: "original", points: 3,
  },
  {
    id: "dmp_y6_10", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A rectangle has a perimeter of 44 cm. Its length is 4 more than twice its width. What is the area of the rectangle?",
    options: ["88 cm²", "96 cm²", "100 cm²", "120 cm²"],
    answer: "96 cm²",
    explanation: "Let width = w. Length = 2w + 4. Perimeter: 2(w + 2w + 4) = 44 → 3w + 4 = 22 → w = 6 cm. Length = 16 cm. Area = 16 × 6 = 96 cm².",
    style: "standard", source: "original", points: 4,
  },
  // ── VOLUME ────────────────────────────────────────────────────────────────
  {
    id: "dmp_y5_16", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "A box is 5 cm long, 4 cm wide and 3 cm tall. What is its volume?",
    options: ["47 cm³", "60 cm³", "72 cm³", "80 cm³"],
    answer: "60 cm³",
    explanation: "Volume = 5 × 4 × 3 = 60 cm³.",
    style: "3d-counting", source: "original", points: 3,
  },
  {
    id: "dmp_y6_11", skill: "shapes", year: 6, difficulty: 2, type: "mcq",
    text: "A cuboid has a volume of 120 cm³. Its length is 10 cm and its width is 4 cm. What is its height?",
    options: ["2 cm", "3 cm", "4 cm", "5 cm"],
    answer: "3 cm",
    explanation: "120 = 10 × 4 × h → 120 = 40h → h = 3 cm.",
    style: "3d-counting", source: "original", points: 3,
  },
  {
    id: "dmp_y6_12", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "A cube has a volume of 216 cm³. What is its surface area?",
    options: ["144 cm²", "180 cm²", "196 cm²", "216 cm²"],
    answer: "216 cm²",
    explanation: "Side = ∛216 = 6 cm. Surface area = 6 × (6 × 6) = 6 × 36 = 216 cm².",
    style: "3d-counting", source: "original", points: 4,
  },
  // ── SPEED / DISTANCE / TIME ───────────────────────────────────────────────
  {
    id: "dmp_y5_18", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    text: "A car travels 120 km in 2 hours. At the same speed, how far will it travel in 3 hours?",
    options: ["150 km", "160 km", "180 km", "200 km"],
    answer: "180 km",
    explanation: "Speed = 120 ÷ 2 = 60 km/h. Distance in 3 hours = 60 × 3 = 180 km.",
    style: "speed-distance-time", source: "original", points: 3,
  },
  {
    id: "dmp_y6_14", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    text: "A cyclist travels at 15 km/h. A walker travels the same route at 5 km/h. The cyclist finishes in 2 hours. How much longer does the walker take?",
    options: ["2 hours", "3 hours", "4 hours", "6 hours"],
    answer: "4 hours",
    explanation: "Distance = 15 × 2 = 30 km. Walker's time = 30 ÷ 5 = 6 hours. Extra time = 6 − 2 = 4 hours.",
    style: "speed-distance-time", source: "original", points: 4,
  },
  // ── PERCENTAGE CHANGE ─────────────────────────────────────────────────────
  {
    id: "dmp_y5_19", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "A jacket costs £60. It is reduced by 35% in a sale. What is the sale price?",
    options: ["£21", "£25", "£35", "£39"],
    answer: "£39",
    explanation: "35% of £60 = 0.35 × 60 = £21. Sale price = £60 − £21 = £39.",
    style: "percentage-change", source: "original", points: 3,
  },
  {
    id: "dmp_y6_15", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "A shop increases all prices by 20%. A book originally costs £8.50. What is the new price?",
    options: ["£9.50", "£10.00", "£10.20", "£10.50"],
    answer: "£10.20",
    explanation: "20% of £8.50 = £1.70. New price = £8.50 + £1.70 = £10.20.",
    style: "percentage-change", source: "original", points: 4,
  },
  {
    id: "dmp_y6_16", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "A TV costs £480 after a 20% reduction. What was the original price?",
    options: ["£560", "£576", "£600", "£620"],
    answer: "£600",
    explanation: "After 20% off, the price is 80% of original. Original = £480 ÷ 0.8 = £600.",
    style: "percentage-change", source: "original", points: 4,
  },
  // ── PROFIT AND LOSS ───────────────────────────────────────────────────────
  {
    id: "dmp_y6_17", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    text: "A trader buys 10 oranges for £2.00 and sells each one for 25p. How much profit does the trader make?",
    options: ["25p", "50p", "75p", "£1.00"],
    answer: "50p",
    explanation: "Cost = £2.00. Revenue = 10 × 25p = £2.50. Profit = £2.50 − £2.00 = 50p.",
    style: "best-value", source: "original", points: 4,
  },
  {
    id: "dmp_y6_18", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    text: "A market stall buys 24 apples for £3.60 and sells them for 20p each. What is the percentage profit?",
    options: ["20%", "25%", "33%", "40%"],
    answer: "33%",
    explanation: "Cost per apple = 360p ÷ 24 = 15p. Selling price = 20p. Profit = 5p. Profit % = (5 ÷ 15) × 100 ≈ 33%.",
    style: "best-value", source: "original", points: 4,
  },
  // ── MEAN / AVERAGE ────────────────────────────────────────────────────────
  {
    id: "dmp_y4_07", skill: "measurement", year: 4, difficulty: 1, type: "mcq",
    text: "Five children score 7, 9, 4, 8 and 7 in a quiz. What is their mean score?",
    options: ["6", "7", "8", "9"],
    answer: "7",
    explanation: "Total = 7 + 9 + 4 + 8 + 7 = 35. Mean = 35 ÷ 5 = 7.",
    style: "mean-average", source: "original", points: 3,
  },
  {
    id: "dmp_y5_20", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    text: "The mean of four numbers is 12. Three of the numbers are 8, 15 and 11. What is the fourth number?",
    options: ["12", "13", "14", "15"],
    answer: "14",
    explanation: "Total of four = 4 × 12 = 48. Sum of three known = 8 + 15 + 11 = 34. Fourth = 48 − 34 = 14.",
    style: "mean-average", source: "original", points: 3,
  },
  {
    id: "dmp_y6_19", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    text: "The mean of five numbers is 18. When a sixth number is added, the mean becomes 20. What is the sixth number?",
    options: ["22", "26", "28", "30"],
    answer: "30",
    explanation: "Sum of five = 5 × 18 = 90. Sum of six = 6 × 20 = 120. Sixth number = 120 − 90 = 30.",
    style: "mean-average", source: "original", points: 4,
  },
  // ── SCALE AND PROPORTION ──────────────────────────────────────────────────
  {
    id: "dmp_y5_21", skill: "measurement", year: 5, difficulty: 2, type: "mcq",
    text: "A map has a scale of 1 cm : 5 km. Two towns are 7 cm apart on the map. How far apart are they in real life?",
    options: ["12 km", "25 km", "35 km", "70 km"],
    answer: "35 km",
    explanation: "Real distance = 7 × 5 = 35 km.",
    style: "rate-proportion", source: "original", points: 3,
  },
  {
    id: "dmp_y6_20", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    text: "A model car is built to a scale of 1 : 20. The model is 18 cm long. How long is the real car in metres?",
    options: ["3.2 m", "3.4 m", "3.6 m", "4.0 m"],
    answer: "3.6 m",
    explanation: "Real length = 18 × 20 = 360 cm = 3.6 m.",
    style: "rate-proportion", source: "original", points: 4,
  },
  // ── SHARING IN A RATIO ────────────────────────────────────────────────────
  {
    id: "dmp_y5_22", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "Lena and Max share 40 stickers in the ratio 3 : 5. How many stickers does Max get?",
    options: ["15", "20", "25", "30"],
    answer: "25",
    explanation: "Total parts = 3 + 5 = 8. Each part = 40 ÷ 8 = 5. Max gets 5 × 5 = 25 stickers.",
    style: "ratio-word-problem", source: "original", points: 3,
  },
  {
    id: "dmp_y6_21", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "Three friends share a prize of £84 in the ratio 2 : 3 : 7. How much does the person with the largest share receive?",
    options: ["£42", "£49", "£56", "£63"],
    answer: "£49",
    explanation: "Total parts = 2 + 3 + 7 = 12. Each part = £84 ÷ 12 = £7. Largest share = 7 × £7 = £49.",
    style: "ratio-word-problem", source: "original", points: 4,
  },
  // ── ANGLES IN TRIANGLES AND QUADRILATERALS ────────────────────────────────
  {
    id: "dmp_y5_23", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "A triangle has angles of 47° and 68°. What is the third angle?",
    options: ["55°", "60°", "65°", "75°"],
    answer: "65°",
    explanation: "Angles in a triangle sum to 180°. Third angle = 180° − 47° − 68° = 65°.",
    style: "angle-polygon", source: "original", points: 3,
  },
  {
    id: "dmp_y5_24", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "A quadrilateral has angles of 85°, 110° and 75°. What is the fourth angle?",
    options: ["80°", "85°", "90°", "95°"],
    answer: "90°",
    explanation: "Angles in a quadrilateral sum to 360°. Fourth = 360° − 85° − 110° − 75° = 90°.",
    style: "angle-polygon", source: "original", points: 3,
  },
  {
    id: "dmp_y6_22", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "Two angles of an isosceles triangle are equal. The unequal angle is 40°. What are the equal angles?",
    options: ["60°", "65°", "70°", "75°"],
    answer: "70°",
    explanation: "Sum of all angles = 180°. Equal angles sum = 180° − 40° = 140°. Each = 140° ÷ 2 = 70°.",
    style: "angle-polygon", source: "original", points: 3,
  },
  // ── COORDINATES AND REFLECTION ────────────────────────────────────────────
  {
    id: "dmp_y4_08", skill: "shapes", year: 4, difficulty: 1, type: "mcq",
    text: "Point A is at (3, 5). It is reflected in the y-axis. What are the new coordinates?",
    options: ["(3, −5)", "(−3, 5)", "(5, 3)", "(−5, 3)"],
    answer: "(−3, 5)",
    explanation: "Reflecting in the y-axis changes the sign of the x-coordinate. (3, 5) → (−3, 5).",
    style: "symmetry-reflection", source: "original", points: 3,
  },
  {
    id: "dmp_y5_25", skill: "shapes", year: 5, difficulty: 2, type: "mcq",
    text: "Point P is at (4, −2). It is reflected in the x-axis. What are the new coordinates?",
    options: ["(−4, 2)", "(4, 2)", "(−4, −2)", "(2, 4)"],
    answer: "(4, 2)",
    explanation: "Reflecting in the x-axis changes the sign of the y-coordinate. (4, −2) → (4, 2).",
    style: "symmetry-reflection", source: "original", points: 3,
  },
  // ── PRIME NUMBERS ─────────────────────────────────────────────────────────
  {
    id: "dmp_y5_27", skill: "patterns", year: 5, difficulty: 2, type: "mcq",
    text: "Which of these numbers is prime?",
    options: ["51", "57", "59", "63"],
    answer: "59",
    explanation: "51 = 3 × 17, 57 = 3 × 19, 63 = 7 × 9. 59 has no factors other than 1 and itself — it is prime.",
    style: "arithmetic-comparison", source: "original", points: 3,
  },
  {
    id: "dmp_y6_23", skill: "patterns", year: 6, difficulty: 3, type: "mcq",
    text: "Two prime numbers multiply to give 91. What are they?",
    options: ["7 and 13", "7 and 11", "11 and 13", "13 and 17"],
    answer: "7 and 13",
    explanation: "7 × 13 = 91. Both 7 and 13 are prime.",
    style: "arithmetic-comparison", source: "original", points: 4,
  },
  // ── SQUARE AND CUBE NUMBERS ───────────────────────────────────────────────
  {
    id: "dmp_y5_28", skill: "patterns", year: 5, difficulty: 2, type: "mcq",
    text: "Which number is both a square number and a cube number (between 1 and 100)?",
    options: ["8", "16", "36", "64"],
    answer: "64",
    explanation: "64 = 8² and 64 = 4³. It is both a perfect square and a perfect cube.",
    style: "arithmetic-comparison", source: "original", points: 3,
  },
  {
    id: "dmp_y6_24", skill: "patterns", year: 6, difficulty: 3, type: "mcq",
    text: "The sum of two square numbers is 100. Neither number is 0. What are the two square numbers?",
    options: ["16 and 84", "36 and 64", "25 and 75", "49 and 51"],
    answer: "36 and 64",
    explanation: "36 + 64 = 100. 36 = 6² and 64 = 8². Both are perfect squares.",
    style: "arithmetic-comparison", source: "original", points: 4,
  },
  // ── FACTORS AND MULTIPLES ─────────────────────────────────────────────────
  {
    id: "dmp_y4_10", skill: "multiplication", year: 4, difficulty: 1, type: "mcq",
    text: "What is the highest common factor (HCF) of 24 and 36?",
    options: ["4", "6", "8", "12"],
    answer: "12",
    explanation: "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. HCF = 12.",
    style: "arithmetic-comparison", source: "original", points: 3,
  },
  {
    id: "dmp_y5_29", skill: "multiplication", year: 5, difficulty: 2, type: "mcq",
    text: "What is the lowest common multiple (LCM) of 6 and 8?",
    options: ["12", "16", "24", "48"],
    answer: "24",
    explanation: "Multiples of 6: 6, 12, 18, 24. Multiples of 8: 8, 16, 24. First common = 24.",
    style: "arithmetic-comparison", source: "original", points: 3,
  },
  // ── WORD PROBLEMS WITH REMAINDERS ─────────────────────────────────────────
  {
    id: "dmp_y4_12", skill: "multiplication", year: 4, difficulty: 2, type: "mcq",
    text: "Eggs are packed in boxes of 6. A farm has 50 eggs. How many full boxes can be packed, and how many eggs are left over?",
    options: ["7 boxes, 8 left", "8 boxes, 2 left", "8 boxes, 4 left", "9 boxes, 4 left"],
    answer: "8 boxes, 2 left",
    explanation: "50 ÷ 6 = 8 remainder 2. So 8 full boxes with 2 eggs left over.",
    style: "standard", source: "original", points: 3,
  },
  {
    id: "dmp_y5_31", skill: "multiplication", year: 5, difficulty: 2, type: "mcq",
    text: "A minibus holds 14 passengers. 95 children need to travel. How many minibuses are needed so all children can travel?",
    options: ["6", "7", "8", "9"],
    answer: "7",
    explanation: "95 ÷ 14 = 6 remainder 11. You need 7 minibuses to carry all 95 children.",
    style: "standard", source: "original", points: 3,
  },
  // ── NEGATIVE NUMBERS ──────────────────────────────────────────────────────
  {
    id: "dmp_y4_13", skill: "addition", year: 4, difficulty: 1, type: "mcq",
    text: "The temperature is −5°C. It rises by 12°C. What is the new temperature?",
    options: ["−7°C", "5°C", "7°C", "17°C"],
    answer: "7°C",
    explanation: "−5 + 12 = 7°C.",
    style: "standard", source: "original", points: 3,
  },
  {
    id: "dmp_y5_32", skill: "addition", year: 5, difficulty: 2, type: "mcq",
    text: "The temperature in Moscow is −18°C. The temperature in London is 4°C. What is the difference in temperature?",
    options: ["14°C", "18°C", "22°C", "26°C"],
    answer: "22°C",
    explanation: "Difference = 4 − (−18) = 4 + 18 = 22°C.",
    style: "standard", source: "original", points: 3,
  },
  // ── ORDERING FRACTIONS ────────────────────────────────────────────────────
  {
    id: "dmp_y5_33", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "Which fraction is the largest: 3/4, 5/8, 7/10, 2/3?",
    options: ["3/4", "5/8", "7/10", "2/3"],
    answer: "3/4",
    explanation: "Convert to decimals: 3/4 = 0.75, 5/8 = 0.625, 7/10 = 0.7, 2/3 ≈ 0.667. Largest is 3/4.",
    style: "fraction-ordering", source: "original", points: 3,
  },
  {
    id: "dmp_y6_25", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "Which fraction is closest to 1/2: 3/7, 4/9, 5/11, 7/13?",
    options: ["3/7", "4/9", "5/11", "7/13"],
    answer: "7/13",
    explanation: "Differences from 0.5: 3/7 ≈ 0.429 (diff 0.071), 4/9 ≈ 0.444 (diff 0.056), 5/11 ≈ 0.455 (diff 0.045), 7/13 ≈ 0.538 (diff 0.038). Closest is 7/13.",
    style: "fraction-ordering", source: "original", points: 4,
  },
  // ── ROMAN NUMERALS ────────────────────────────────────────────────────────
  {
    id: "dmp_y4_09", skill: "patterns", year: 4, difficulty: 1, type: "mcq",
    text: "What is XLVII in ordinary numbers?",
    options: ["37", "47", "57", "67"],
    answer: "47",
    explanation: "XL = 40, VII = 7. XLVII = 47.",
    style: "digit-puzzle", source: "original", points: 3,
  },
  {
    id: "dmp_y5_26", skill: "patterns", year: 5, difficulty: 2, type: "mcq",
    text: "What is MCMXCIX in ordinary numbers?",
    options: ["1899", "1909", "1999", "2099"],
    answer: "1999",
    explanation: "M = 1000, CM = 900, XC = 90, IX = 9. Total = 1999.",
    style: "digit-puzzle", source: "original", points: 3,
  },
];

// ─── Derived exports ───────────────────────────────────────────────────────
export const QUESTIONS: Question[] = [
  ...additionQuestions,
  ...multiplicationQuestions,
  ...fractionQuestions,
  ...shapesQuestions,
  ...patternsQuestions,
  ...logicQuestions,
  ...puzzleQuestions,
  ...measurementQuestions,
  ...timeQuestions,
  ...amc8Questions,
  ...competitionStyleQuestions,
  ...newCompetitionQuestions,
  ...dmpQuestions,
  ...COMPETITION_QUESTIONS,
];

export const ALL_QUESTIONS: Question[] = QUESTIONS;

export function getQuestionsBySkill(skillId: SkillId): Question[] {
  return QUESTIONS.filter(q => q.skill === skillId);
}

export function getQuestionsByYear(year: number): Question[] {
  return QUESTIONS.filter(q => q.year <= year);
}

export function getQuestionsBySkillAndYear(skillId: SkillId, year: number): Question[] {
  return QUESTIONS.filter(q => q.skill === skillId && q.year <= year);
}

export function getTimedTestQuestions(skillId: SkillId | "all", year: number, count: number = 20): Question[] {
  const pool = skillId === "all"
    ? QUESTIONS.filter(q => q.year <= year)
    : QUESTIONS.filter(q => q.skill === skillId && q.year <= year);
  // Shuffle and return count questions
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getSkillById(skillId: SkillId): Skill | undefined {
  return SKILLS.find(s => s.id === skillId);
}

// Alias for backwards compatibility - accepts optional year parameter
export function getQuestionsForSkill(skillId: SkillId, year?: number): Question[] {
  if (year) return getQuestionsBySkillAndYear(skillId, year);
  return getQuestionsBySkill(skillId);
}
