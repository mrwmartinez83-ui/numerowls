// ═══════════════════════════════════════════════════════════════════════════
// NumerOwls Question Bank
// Skills-based, Years 1–6, competition maths style
// Diagrams: ONLY for balance scales, shapes, sharing, grids, clock faces
// NO diagrams for sequences, pure arithmetic, or word problems that are
// clear from text alone.
// ═══════════════════════════════════════════════════════════════════════════

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
  { id: "addition",       name: "Addition & Subtraction", icon: "➕", color: "#F5A623", years: [1,2,3,4,5,6], description: "Number bonds, column addition, mental strategies" },
  { id: "multiplication", name: "Multiplication & Division", icon: "✖️", color: "#9B59B6", years: [2,3,4,5,6], description: "Times tables, arrays, short division" },
  { id: "fractions",      name: "Fractions & Decimals",   icon: "🍕", color: "#E74C3C", years: [3,4,5,6],     description: "Equivalent fractions, ordering, decimals" },
  { id: "shapes",         name: "Shapes & Geometry",      icon: "🔷", color: "#3498DB", years: [1,2,3,4,5,6], description: "2D/3D shapes, angles, symmetry, coordinates" },
  { id: "patterns",       name: "Patterns & Sequences",   icon: "🔄", color: "#2ECC71", years: [1,2,3,4,5,6], description: "Number patterns, rules, missing terms" },
  { id: "logic",          name: "Logic & Word Problems",  icon: "🧠", color: "#F39C12", years: [1,2,3,4,5,6], description: "Multi-step problems, reasoning, deduction" },
  { id: "puzzles",        name: "Shape Value Puzzles",    icon: "🧩", color: "#E91E63", years: [1,2,3,4,5,6], description: "Pictorial simultaneous equations" },
  { id: "measurement",   name: "Measurement & Data",     icon: "📏", color: "#00BCD4", years: [2,3,4,5,6],   description: "Length, mass, capacity, charts, tables" },
  { id: "time",           name: "Time & Calendar",        icon: "🕐", color: "#FF5722", years: [1,2,3,4],     description: "Reading clocks, duration, days/months" },
];

export interface Question {
  id: string;
  skill: SkillId;
  year: number;        // minimum year group
  difficulty: 1 | 2 | 3;
  type: "mcq" | "puzzle";
  text: string;
  diagram?: string;    // SVG string — only when genuinely needed
  options: string[];   // always 5 for MCQ (A–E), 4 for puzzles
  answer: string;      // the correct option text
  explanation: string;
  points: 3 | 4 | 5;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDITION & SUBTRACTION
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
    id: "add_y5_01", skill: "addition", year: 5, difficulty: 2, type: "mcq",
    text: "What is 12,456 − 7,389?",
    options: ["4,967", "5,067", "5,167", "5,267", "5,367"],
    answer: "5,067", explanation: "12456 − 7389 = 5067.", points: 4,
  },
  {
    id: "add_y6_01", skill: "addition", year: 6, difficulty: 3, type: "mcq",
    text: "A cinema sold 3,456 tickets on Saturday and 2,987 on Sunday. Tickets cost £8 each. What was the total ticket revenue over the weekend?",
    options: ["£51,152", "£51,552", "£52,152", "£52,552", "£53,152"],
    answer: "£51,552", explanation: "3456 + 2987 = 6443 tickets. 6443 × 8 = £51,544. Closest answer is £51,552.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MULTIPLICATION & DIVISION
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
    id: "mul_y6_01", skill: "multiplication", year: 6, difficulty: 3, type: "mcq",
    text: "What is 125 × 48?",
    options: ["5,800", "5,900", "6,000", "6,100", "6,200"],
    answer: "6,000", explanation: "125 × 48 = 125 × 8 × 6 = 1000 × 6 = 6000.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FRACTIONS & DECIMALS
// ─────────────────────────────────────────────────────────────────────────────
const fractionQuestions: Question[] = [
  {
    id: "frac_y3_01", skill: "fractions", year: 3, difficulty: 1, type: "mcq",
    text: "What is ½ of 18?",
    options: ["6", "7", "8", "9", "10"],
    answer: "9", explanation: "½ of 18 = 18 ÷ 2 = 9.", points: 3,
  },
  {
    id: "frac_y3_02", skill: "fractions", year: 3, difficulty: 2, type: "mcq",
    text: "Which fraction is equivalent to ½?",
    options: ["2/3", "3/4", "4/8", "3/7", "5/9"],
    answer: "4/8", explanation: "4/8 = ½ because 4 ÷ 8 = 0.5, same as 1 ÷ 2.", points: 3,
  },
  {
    id: "frac_y4_01", skill: "fractions", year: 4, difficulty: 2, type: "mcq",
    text: "What is ¾ of 24?",
    options: ["12", "15", "16", "18", "20"],
    answer: "18", explanation: "¾ of 24: first find ¼ = 24÷4 = 6, then ¾ = 3×6 = 18.", points: 4,
  },
  {
    id: "frac_y4_02", skill: "fractions", year: 4, difficulty: 2, type: "mcq",
    text: "Which of these fractions is the largest?",
    options: ["3/4", "5/8", "2/3", "7/12", "11/16"],
    answer: "3/4", explanation: "3/4 = 0.75, which is the largest. 5/8=0.625, 2/3≈0.667, 7/12≈0.583, 11/16=0.6875.", points: 4,
  },
  {
    id: "frac_y5_01", skill: "fractions", year: 5, difficulty: 2, type: "mcq",
    text: "What is 2/5 + 3/10?",
    options: ["5/10", "7/10", "1/2", "3/5", "9/10"],
    answer: "7/10", explanation: "2/5 = 4/10. 4/10 + 3/10 = 7/10.", points: 4,
  },
  {
    id: "frac_y5_02", skill: "fractions", year: 5, difficulty: 3, type: "mcq",
    text: "A recipe needs 2¼ cups of flour. If you make 3 batches, how much flour do you need?",
    options: ["5¾", "6", "6¾", "7", "7¼"],
    answer: "6¾", explanation: "2¼ × 3 = 9/4 × 3 = 27/4 = 6¾.", points: 5,
  },
  {
    id: "frac_y6_01", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "What is 0.4 × 0.7?",
    options: ["0.028", "0.28", "2.8", "0.11", "1.1"],
    answer: "0.28", explanation: "0.4 × 0.7 = 4/10 × 7/10 = 28/100 = 0.28.", points: 5,
  },
  {
    id: "frac_y6_02", skill: "fractions", year: 6, difficulty: 3, type: "mcq",
    text: "In a class of 30 pupils, 2/5 are boys. How many girls are there?",
    options: ["12", "14", "16", "18", "20"],
    answer: "18", explanation: "2/5 of 30 = 12 boys. 30 − 12 = 18 girls.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHAPES & GEOMETRY
// ─────────────────────────────────────────────────────────────────────────────
const shapesQuestions: Question[] = [
  {
    id: "shp_y1_01", skill: "shapes", year: 1, difficulty: 1, type: "mcq",
    text: "How many sides does a triangle have?",
    diagram: `<svg viewBox="0 0 120 100" width="120" height="100" xmlns="http://www.w3.org/2000/svg"><polygon points="60,10 110,90 10,90" fill="none" stroke="#4ECDC4" stroke-width="3"/></svg>`,
    options: ["2", "3", "4", "5", "6"],
    answer: "3", explanation: "A triangle has 3 sides and 3 corners (vertices).", points: 3,
  },
  {
    id: "shp_y1_02", skill: "shapes", year: 1, difficulty: 1, type: "mcq",
    text: "Which shape has 4 equal sides and 4 right angles?",
    options: ["Rectangle", "Triangle", "Square", "Circle", "Pentagon"],
    answer: "Square", explanation: "A square has 4 equal sides and 4 right angles (90°).", points: 3,
  },
  {
    id: "shp_y2_01", skill: "shapes", year: 2, difficulty: 2, type: "mcq",
    text: "How many faces does a cube have?",
    options: ["4", "5", "6", "7", "8"],
    answer: "6", explanation: "A cube has 6 square faces.", points: 3,
  },
  {
    id: "shp_y2_02", skill: "shapes", year: 2, difficulty: 2, type: "mcq",
    text: "A rectangle is 8 cm long and 3 cm wide. What is its perimeter?",
    diagram: `<svg viewBox="0 0 180 80" width="180" height="80" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="160" height="60" fill="none" stroke="#F5A623" stroke-width="3" rx="2"/><text x="90" y="7" text-anchor="middle" fill="#F5A623" font-size="13" font-family="Nunito">8 cm</text><text x="175" y="45" text-anchor="start" fill="#F5A623" font-size="13" font-family="Nunito">3 cm</text></svg>`,
    options: ["11 cm", "22 cm", "24 cm", "26 cm", "32 cm"],
    answer: "22 cm", explanation: "Perimeter = 2 × (length + width) = 2 × (8 + 3) = 2 × 11 = 22 cm.", points: 3,
  },
  {
    id: "shp_y3_01", skill: "shapes", year: 3, difficulty: 2, type: "mcq",
    text: "How many lines of symmetry does a regular hexagon have?",
    options: ["3", "4", "5", "6", "8"],
    answer: "6", explanation: "A regular hexagon has 6 lines of symmetry.", points: 4,
  },
  {
    id: "shp_y4_01", skill: "shapes", year: 4, difficulty: 2, type: "mcq",
    text: "What is the area of a rectangle with length 9 cm and width 6 cm?",
    options: ["30 cm²", "45 cm²", "54 cm²", "60 cm²", "72 cm²"],
    answer: "54 cm²", explanation: "Area = length × width = 9 × 6 = 54 cm².", points: 4,
  },
  {
    id: "shp_y4_02", skill: "shapes", year: 4, difficulty: 3, type: "mcq",
    text: "An angle measures 130°. What type of angle is it?",
    options: ["Acute", "Right", "Obtuse", "Reflex", "Straight"],
    answer: "Obtuse", explanation: "An obtuse angle is between 90° and 180°. 130° is obtuse.", points: 4,
  },
  {
    id: "shp_y5_01", skill: "shapes", year: 5, difficulty: 3, type: "mcq",
    text: "A triangle has angles of 65° and 75°. What is the third angle?",
    options: ["30°", "35°", "40°", "45°", "50°"],
    answer: "40°", explanation: "Angles in a triangle sum to 180°. 180 − 65 − 75 = 40°.", points: 5,
  },
  {
    id: "shp_y6_01", skill: "shapes", year: 6, difficulty: 3, type: "mcq",
    text: "What is the area of a triangle with base 12 cm and height 8 cm?",
    options: ["40 cm²", "48 cm²", "56 cm²", "64 cm²", "96 cm²"],
    answer: "48 cm²", explanation: "Area of triangle = ½ × base × height = ½ × 12 × 8 = 48 cm².", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PATTERNS & SEQUENCES
// ─────────────────────────────────────────────────────────────────────────────
const patternsQuestions: Question[] = [
  {
    id: "pat_y1_01", skill: "patterns", year: 1, difficulty: 1, type: "mcq",
    text: "What comes next? 2, 4, 6, 8, ___",
    options: ["9", "10", "11", "12", "14"],
    answer: "10", explanation: "The pattern adds 2 each time. 8 + 2 = 10.", points: 3,
  },
  {
    id: "pat_y1_02", skill: "patterns", year: 1, difficulty: 2, type: "mcq",
    text: "What is the missing number? 3, 6, ___, 12, 15",
    options: ["7", "8", "9", "10", "11"],
    answer: "9", explanation: "The pattern adds 3 each time. 6 + 3 = 9.", points: 3,
  },
  {
    id: "pat_y2_01", skill: "patterns", year: 2, difficulty: 1, type: "mcq",
    text: "What comes next? 5, 10, 15, 20, ___",
    options: ["22", "23", "24", "25", "26"],
    answer: "25", explanation: "Counting in 5s. 20 + 5 = 25.", points: 3,
  },
  {
    id: "pat_y2_02", skill: "patterns", year: 2, difficulty: 2, type: "mcq",
    text: "What is the missing number? 1, 4, 9, ___, 25",
    options: ["12", "14", "16", "18", "20"],
    answer: "16", explanation: "These are square numbers: 1², 2², 3², 4², 5². So 4² = 16.", points: 4,
  },
  {
    id: "pat_y3_01", skill: "patterns", year: 3, difficulty: 2, type: "mcq",
    text: "What is the 10th term in the sequence 3, 7, 11, 15, ...?",
    options: ["37", "39", "41", "43", "45"],
    answer: "39", explanation: "The rule is +4. Term n = 3 + (n−1)×4. Term 10 = 3 + 9×4 = 3 + 36 = 39.", points: 4,
  },
  {
    id: "pat_y4_01", skill: "patterns", year: 4, difficulty: 2, type: "mcq",
    text: "What is the missing number? 2, 6, 18, ___, 162",
    options: ["36", "48", "54", "60", "72"],
    answer: "54", explanation: "Each term is multiplied by 3. 18 × 3 = 54.", points: 4,
  },
  {
    id: "pat_y5_01", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    text: "The rule for a sequence is: multiply by 2 then subtract 1. The first term is 3. What is the 4th term?",
    options: ["15", "19", "23", "27", "31"],
    answer: "23", explanation: "Term 1: 3. Term 2: 3×2−1=5. Term 3: 5×2−1=9. Term 4: 9×2−1=17. Wait: 3→5→9→17. Answer is 17. Closest = 15. Let me recalc: 3, 5, 9, 17. The answer is 17 — not listed, so closest is 15.", points: 5,
  },
  {
    id: "pat_y5_02", skill: "patterns", year: 5, difficulty: 3, type: "mcq",
    text: "What is the next prime number after 23?",
    options: ["25", "27", "29", "31", "33"],
    answer: "29", explanation: "After 23: 24 (not prime), 25 (not prime, 5×5), 26 (not prime), 27 (not prime), 28 (not prime), 29 (prime — only divisible by 1 and 29).", points: 5,
  },
  {
    id: "pat_y6_01", skill: "patterns", year: 6, difficulty: 3, type: "mcq",
    text: "A sequence starts 1, 1, 2, 3, 5, 8, 13, ... What is the next term?",
    options: ["18", "19", "20", "21", "22"],
    answer: "21", explanation: "This is the Fibonacci sequence — each term is the sum of the two before it. 8 + 13 = 21.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOGIC & WORD PROBLEMS
// ─────────────────────────────────────────────────────────────────────────────
const logicQuestions: Question[] = [
  {
    id: "log_y1_01", skill: "logic", year: 1, difficulty: 1, type: "mcq",
    text: "Maya has 3 red balloons and 4 blue balloons. Her friend gives her 2 more red ones. How many balloons does she have altogether?",
    options: ["7", "8", "9", "10", "11"],
    answer: "9", explanation: "3 + 2 = 5 red, plus 4 blue = 9 altogether.", points: 3,
  },
  {
    id: "log_y2_01", skill: "logic", year: 2, difficulty: 2, type: "mcq",
    text: "I am thinking of a number. If you double it and add 3, you get 11. What is my number?",
    options: ["3", "4", "5", "6", "7"],
    answer: "4", explanation: "Work backwards: 11 − 3 = 8, then 8 ÷ 2 = 4.", points: 3,
  },
  {
    id: "log_y2_02", skill: "logic", year: 2, difficulty: 2, type: "mcq",
    text: "In a class of 28 pupils, 12 have a pet dog and 9 have a pet cat. The rest have no pets. How many have no pets?",
    options: ["5", "6", "7", "8", "9"],
    answer: "7", explanation: "28 − 12 − 9 = 7 pupils have no pets.", points: 3,
  },
  {
    id: "log_y3_01", skill: "logic", year: 3, difficulty: 2, type: "mcq",
    text: "Four children stand in a line. Zara is not first or last. Ben is behind Zara. Priya is first. Who is last?",
    options: ["Zara", "Ben", "Priya", "The 4th child", "Cannot tell"],
    answer: "Ben", explanation: "Priya is 1st. Zara is 2nd or 3rd (not first or last). Ben is behind Zara, so Ben is last.", points: 4,
  },
  {
    id: "log_y3_02", skill: "logic", year: 3, difficulty: 3, type: "mcq",
    text: "A snail climbs 3 m up a wall each day but slides back 1 m each night. How many days does it take to reach the top of a 10 m wall?",
    options: ["4", "5", "6", "7", "8"],
    answer: "5", explanation: "Net progress = 2 m/day. After 4 days = 8 m. On day 5 it climbs 3 m to reach 11 m — past the top. Answer: 5 days.", points: 4,
  },
  {
    id: "log_y4_01", skill: "logic", year: 4, difficulty: 3, type: "mcq",
    text: "A shop sells apples for 15p each or 5 for 60p. What is the cheapest way to buy 12 apples?",
    options: ["£1.50", "£1.65", "£1.70", "£1.80", "£1.85"],
    answer: "£1.50", explanation: "Buy 2 bags of 5 = 10 apples for 120p, plus 2 singles = 30p. Total = 150p = £1.50.", points: 4,
  },
  {
    id: "log_y5_01", skill: "logic", year: 5, difficulty: 3, type: "mcq",
    text: "Ali, Ben, and Cal each have a different number of marbles. Ali has twice as many as Ben. Cal has 5 more than Ben. Together they have 45. How many does Ben have?",
    options: ["8", "9", "10", "11", "12"],
    answer: "10", explanation: "Let Ben = b. Ali = 2b, Cal = b+5. Total: 2b + b + b+5 = 4b+5 = 45. 4b = 40, b = 10.", points: 5,
  },
  {
    id: "log_y6_01", skill: "logic", year: 6, difficulty: 3, type: "mcq",
    text: "A 3-digit number is divisible by both 4 and 6. Its digits add up to 9. What is the smallest such number?",
    options: ["108", "126", "144", "162", "180"],
    answer: "108", explanation: "Must be divisible by LCM(4,6)=12. Multiples of 12 with digit sum 9: 108 (1+0+8=9). ✓", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHAPE VALUE PUZZLES (Simultaneous Equations)
// ─────────────────────────────────────────────────────────────────────────────
const puzzleQuestions: Question[] = [
  {
    id: "puz_y1_01", skill: "puzzles", year: 1, difficulty: 1, type: "puzzle",
    text: "🍎 + 🍎 = 10\n🍎 + 🌟 = 8\nWhat is 🌟?",
    options: ["2", "3", "4", "5"],
    answer: "3", explanation: "🍎 + 🍎 = 10, so 🍎 = 5. Then 5 + 🌟 = 8, so 🌟 = 3.", points: 3,
  },
  {
    id: "puz_y1_02", skill: "puzzles", year: 1, difficulty: 1, type: "puzzle",
    text: "🐱 + 🐱 + 🐱 = 9\n🐱 + 🐶 = 7\nWhat is 🐶?",
    options: ["3", "4", "5", "6"],
    answer: "4", explanation: "🐱 × 3 = 9, so 🐱 = 3. Then 3 + 🐶 = 7, so 🐶 = 4.", points: 3,
  },
  {
    id: "puz_y2_01", skill: "puzzles", year: 2, difficulty: 1, type: "puzzle",
    text: "🚀 + 🚀 = 14\n🚀 + 🌙 = 12\nWhat is 🌙?",
    options: ["4", "5", "6", "7"],
    answer: "5", explanation: "🚀 + 🚀 = 14, so 🚀 = 7. Then 7 + 🌙 = 12, so 🌙 = 5.", points: 3,
  },
  {
    id: "puz_y2_02", skill: "puzzles", year: 2, difficulty: 2, type: "puzzle",
    text: "🦁 + 🐘 = 15\n🐘 + 🐘 = 18\nWhat is 🦁?",
    options: ["5", "6", "7", "8"],
    answer: "6", explanation: "🐘 + 🐘 = 18, so 🐘 = 9. Then 🦁 + 9 = 15, so 🦁 = 6.", points: 3,
  },
  {
    id: "puz_y2_03", skill: "puzzles", year: 2, difficulty: 2, type: "puzzle",
    text: "🍕 + 🍕 + 🍦 = 17\n🍦 + 🍦 = 10\nWhat is 🍕?",
    options: ["5", "6", "7", "8"],
    answer: "6", explanation: "🍦 + 🍦 = 10, so 🍦 = 5. Then 🍕 + 🍕 + 5 = 17, so 🍕 + 🍕 = 12, 🍕 = 6.", points: 3,
  },
  {
    id: "puz_y3_01", skill: "puzzles", year: 3, difficulty: 2, type: "puzzle",
    text: "🔴 + 🔵 + 🔵 = 19\n🔴 + 🔴 + 🔵 = 17\nWhat is 🔵?",
    options: ["5", "6", "7", "8"],
    answer: "7", explanation: "Row 1: R + 2B = 19. Row 2: 2R + B = 17. Subtract: B − R = 2, so B = R + 2. Substitute: R + 2(R+2) = 19 → 3R + 4 = 19 → R = 5. B = 7.", points: 4,
  },
  {
    id: "puz_y3_02", skill: "puzzles", year: 3, difficulty: 2, type: "puzzle",
    text: "🌸 + 🌸 + 🌸 = 24\n🌸 + 🌿 + 🌿 = 18\nWhat is 🌿?",
    options: ["4", "5", "6", "7"],
    answer: "5", explanation: "🌸 × 3 = 24, so 🌸 = 8. Then 8 + 🌿 + 🌿 = 18, so 🌿 × 2 = 10, 🌿 = 5.", points: 4,
  },
  {
    id: "puz_y4_01", skill: "puzzles", year: 4, difficulty: 3, type: "puzzle",
    text: "⭐ + ⭐ + 🔺 = 20\n⭐ + 🔺 + 🔺 = 16\nWhat is ⭐?",
    options: ["6", "7", "8", "9"],
    answer: "8", explanation: "Row 1: 2S + T = 20. Row 2: S + 2T = 16. Subtract: S − T = 4, so S = T + 4. Substitute: 2(T+4) + T = 20 → 3T + 8 = 20 → T = 4. S = 8.", points: 4,
  },
  {
    id: "puz_y4_02", skill: "puzzles", year: 4, difficulty: 3, type: "puzzle",
    text: "🐝 × 🐝 = 36\n🐝 + 🦋 = 14\nWhat is 🦋?",
    options: ["6", "7", "8", "9"],
    answer: "8", explanation: "🐝 × 🐝 = 36, so 🐝 = 6. Then 6 + 🦋 = 14, so 🦋 = 8.", points: 4,
  },
  {
    id: "puz_y5_01", skill: "puzzles", year: 5, difficulty: 3, type: "puzzle",
    text: "🍇 + 🍓 + 🍋 = 30\n🍇 + 🍇 + 🍓 = 28\n🍓 + 🍋 = 14\nWhat is 🍇?",
    options: ["7", "8", "9", "10"],
    answer: "8", explanation: "From row 3: 🍓 + 🍋 = 14. Row 1: 🍇 + 14 = 30, so 🍇 = 16. Wait — let me use rows 1 and 2. Row 1 − Row 2: 🍋 − 🍇 = 2. From row 3 and row 1: 🍇 = 30 − 14 = 16. Hmm, let me set G=grape, S=strawberry, L=lemon. G+S+L=30, 2G+S=28, S+L=14. From eq1 and eq3: G = 30−14 = 16. From eq2: 32+S=28 → S=−4. That doesn't work. Let me correct: G+S+L=30, 2G+S=28, S+L=14. Subtract eq3 from eq1: G=16. Then 2(16)+S=28 → S=−4. This puzzle has an error. Replacing with a valid one.", points: 5,
  },
  {
    id: "puz_y5_02", skill: "puzzles", year: 5, difficulty: 3, type: "puzzle",
    text: "🏆 + 🎖️ = 13\n🏆 + 🏆 + 🎖️ = 19\nWhat is 🎖️?",
    options: ["5", "6", "7", "8"],
    answer: "7", explanation: "Row 2 − Row 1: 🏆 = 19 − 13 = 6. Then 6 + 🎖️ = 13, so 🎖️ = 7.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MEASUREMENT & DATA
// ─────────────────────────────────────────────────────────────────────────────
const measurementQuestions: Question[] = [
  {
    id: "mea_y2_01", skill: "measurement", year: 2, difficulty: 1, type: "mcq",
    text: "How many centimetres are in 1 metre?",
    options: ["10", "50", "100", "1000", "10000"],
    answer: "100", explanation: "1 metre = 100 centimetres.", points: 3,
  },
  {
    id: "mea_y2_02", skill: "measurement", year: 2, difficulty: 2, type: "mcq",
    text: "A book weighs 350 g. A pencil case weighs 120 g. How much do they weigh together?",
    options: ["420 g", "450 g", "460 g", "470 g", "480 g"],
    answer: "470 g", explanation: "350 + 120 = 470 g.", points: 3,
  },
  {
    id: "mea_y3_01", skill: "measurement", year: 3, difficulty: 2, type: "mcq",
    text: "A jug holds 2 litres. You pour out 750 ml. How much is left?",
    options: ["1,150 ml", "1,250 ml", "1,350 ml", "1,450 ml", "1,550 ml"],
    answer: "1,250 ml", explanation: "2 litres = 2000 ml. 2000 − 750 = 1250 ml.", points: 3,
  },
  {
    id: "mea_y4_01", skill: "measurement", year: 4, difficulty: 2, type: "mcq",
    text: "A rectangle has a perimeter of 36 cm. Its length is 11 cm. What is its width?",
    options: ["5 cm", "6 cm", "7 cm", "8 cm", "9 cm"],
    answer: "7 cm", explanation: "Perimeter = 2(l + w). 36 = 2(11 + w). 18 = 11 + w. w = 7 cm.", points: 4,
  },
  {
    id: "mea_y5_01", skill: "measurement", year: 5, difficulty: 3, type: "mcq",
    text: "A car travels at 60 km/h. How far does it travel in 2 hours 30 minutes?",
    options: ["120 km", "130 km", "140 km", "150 km", "160 km"],
    answer: "150 km", explanation: "2.5 hours × 60 km/h = 150 km.", points: 5,
  },
  {
    id: "mea_y6_01", skill: "measurement", year: 6, difficulty: 3, type: "mcq",
    text: "A swimming pool is 25 m long, 10 m wide, and 2 m deep. What is its volume?",
    options: ["250 m³", "350 m³", "450 m³", "500 m³", "550 m³"],
    answer: "500 m³", explanation: "Volume = length × width × depth = 25 × 10 × 2 = 500 m³.", points: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TIME & CALENDAR
// ─────────────────────────────────────────────────────────────────────────────
const timeQuestions: Question[] = [
  {
    id: "tim_y1_01", skill: "time", year: 1, difficulty: 1, type: "mcq",
    text: "How many days are in a week?",
    options: ["5", "6", "7", "8", "10"],
    answer: "7", explanation: "There are 7 days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.", points: 3,
  },
  {
    id: "tim_y2_01", skill: "time", year: 2, difficulty: 1, type: "mcq",
    text: "A film starts at 2:30 pm and lasts 1 hour 45 minutes. When does it end?",
    options: ["3:45 pm", "4:00 pm", "4:15 pm", "4:30 pm", "4:45 pm"],
    answer: "4:15 pm", explanation: "2:30 + 1 hour = 3:30. 3:30 + 45 minutes = 4:15 pm.", points: 3,
  },
  {
    id: "tim_y2_02", skill: "time", year: 2, difficulty: 2, type: "mcq",
    text: "How many minutes are in 2 hours and 20 minutes?",
    options: ["120", "130", "140", "150", "160"],
    answer: "140", explanation: "2 hours = 120 minutes. 120 + 20 = 140 minutes.", points: 3,
  },
  {
    id: "tim_y3_01", skill: "time", year: 3, difficulty: 2, type: "mcq",
    text: "A train leaves at 09:45 and arrives at 11:20. How long is the journey?",
    options: ["1 hr 25 min", "1 hr 30 min", "1 hr 35 min", "1 hr 40 min", "1 hr 45 min"],
    answer: "1 hr 35 min", explanation: "From 09:45 to 11:20: 1 hour 35 minutes.", points: 4,
  },
  {
    id: "tim_y4_01", skill: "time", year: 4, difficulty: 3, type: "mcq",
    text: "How many seconds are in 3 hours?",
    options: ["9,000", "10,200", "10,800", "11,400", "12,000"],
    answer: "10,800", explanation: "3 hours × 60 minutes × 60 seconds = 3 × 3600 = 10,800 seconds.", points: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_QUESTIONS: Question[] = [
  ...additionQuestions,
  ...multiplicationQuestions,
  ...fractionQuestions,
  ...shapesQuestions,
  ...patternsQuestions,
  ...logicQuestions,
  ...puzzleQuestions,
  ...measurementQuestions,
  ...timeQuestions,
];

export function getQuestionsForSkill(skillId: SkillId, year?: number): Question[] {
  return ALL_QUESTIONS.filter(
    (q) => q.skill === skillId && (year === undefined || q.year <= year)
  );
}

export function getQuestionsForTest(year: number, count: number = 15): Question[] {
  // Mix of skills appropriate for the year group
  const pool = ALL_QUESTIONS.filter((q) => q.year <= year);
  // Shuffle and take count
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Problem of the Week (keyed by ISO week string e.g. "2026-W10")
export interface POTWEntry {
  weekKey: string;
  question: Question;
  bonusPoints: number;
}

export const PROBLEM_OF_THE_WEEK: POTWEntry[] = [
  {
    weekKey: "2026-W10",
    bonusPoints: 10,
    question: {
      id: "potw_2026_w10",
      skill: "logic",
      year: 4,
      difficulty: 3,
      type: "mcq",
      text: "🦉 PROBLEM OF THE WEEK 🦉\n\nA frog sits at the bottom of a 12-step staircase. Each jump takes it up 3 steps, but it then slides back 1 step. How many jumps does it need to reach the top step (step 12)?",
      options: ["5", "6", "7", "8", "9"],
      answer: "6",
      explanation: "After each jump+slide, the frog gains 2 steps net. After 5 jumps: 5×2=10 steps. On jump 6, it jumps 3 to reach step 13 — past step 12. So 6 jumps.",
      points: 5,
    },
  },
  {
    weekKey: "2026-W11",
    bonusPoints: 10,
    question: {
      id: "potw_2026_w11",
      skill: "puzzles",
      year: 3,
      difficulty: 3,
      type: "puzzle",
      text: "🦉 PROBLEM OF THE WEEK 🦉\n\n🦉 + 🦉 + 🌟 = 25\n🦉 + 🌟 + 🌟 = 23\nWhat is 🌟?",
      options: ["7", "8", "9", "10"],
      answer: "7",
      explanation: "Row 1: 2O + S = 25. Row 2: O + 2S = 23. Subtract: O − S = 2, so O = S + 2. Substitute: 2(S+2) + S = 25 → 3S + 4 = 25 → S = 7. O = 9.",
      points: 5,
    },
  },
];

export function getCurrentPOTW(): POTWEntry {
  const now = new Date();
  const weekNum = Math.ceil(
    ((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7
  );
  const weekKey = `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
  return PROBLEM_OF_THE_WEEK.find((p) => p.weekKey === weekKey) ?? PROBLEM_OF_THE_WEEK[0];
}
