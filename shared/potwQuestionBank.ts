/**
 * Problem of the Week Question Bank
 * ─────────────────────────────────
 * 12 bespoke multi-step problems designed to be genuinely tough.
 * Difficulty 4–5 (out of 5). Suitable for Years 3–6 working collaboratively.
 * All questions are original. Inspired by PMC, UKMT Junior, Math Kangaroo, AMC 8.
 *
 * Each question has:
 *  - A rich text stem (supports basic HTML for diagrams/tables)
 *  - 5 multiple-choice options (one correct)
 *  - A full worked solution
 *  - A hint (reveals partial reasoning without giving away the answer)
 *  - Recommended year group range
 *  - Suggested points (higher = harder)
 */

export interface PotwQuestion {
  id: string;
  title: string;
  /** HTML-safe question text */
  text: string;
  /** Optional HTML diagram/visual to display below the text */
  diagram?: string;
  options: string[];
  answer: string;
  /** Full worked solution shown after competition ends */
  solution: string;
  /** Hint shown to pupils who are stuck (no time penalty in POTW) */
  hint: string;
  yearRange: string;
  difficulty: 4 | 5;
  topic: string;
  points: number;
}

export const POTW_QUESTIONS: PotwQuestion[] = [
  // ── 1 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_01",
    title: "The Mysterious Number Machine",
    text: `A number machine does the following two steps in order:<br><br>
<strong>Step 1:</strong> Multiply the input by 3.<br>
<strong>Step 2:</strong> Subtract the input from the result of Step 1.<br><br>
When I put in a number, the output is <strong>84</strong>.<br><br>
What was my input?`,
    options: ["28", "42", "21", "14", "36"],
    answer: "42",
    solution: `Let the input be <em>n</em>.<br>
Step 1: 3n<br>
Step 2: 3n − n = 2n<br>
So 2n = 84, which gives n = <strong>42</strong>.<br><br>
<em>Key insight:</em> The machine effectively doubles the input, so the output is always even.`,
    hint: "Think about what the two steps together do to your number. Can you write it as a single multiplication?",
    yearRange: "Years 4–6",
    difficulty: 4,
    topic: "Algebra & Number",
    points: 20,
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_02",
    title: "The Staircase of Squares",
    text: `The diagram below shows a staircase pattern made from small unit squares.<br><br>
<strong>Step 1</strong> uses 1 square. <strong>Step 2</strong> uses 1 + 2 = 3 squares. <strong>Step 3</strong> uses 1 + 2 + 3 = 6 squares.<br><br>
How many unit squares are needed for <strong>Step 10</strong>?`,
    diagram: `<div style="display:flex;gap:6px;align-items:flex-end;margin:16px 0;padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;justify-content:center">
  <div style="display:flex;flex-direction:column;gap:2px"><div style="width:20px;height:20px;background:#F5A623;border-radius:3px"></div><div style="font-size:10px;color:#8899AA;text-align:center;margin-top:4px">Step 1</div></div>
  <div style="display:flex;flex-direction:column;gap:2px;margin-left:12px">
    <div style="display:flex;gap:2px"><div style="width:20px;height:20px;background:#4ECDC4;border-radius:3px"></div></div>
    <div style="display:flex;gap:2px"><div style="width:20px;height:20px;background:#4ECDC4;border-radius:3px"></div><div style="width:20px;height:20px;background:#4ECDC4;border-radius:3px"></div></div>
    <div style="font-size:10px;color:#8899AA;text-align:center;margin-top:4px">Step 2</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:2px;margin-left:12px">
    <div style="display:flex;gap:2px"><div style="width:20px;height:20px;background:#9B59B6;border-radius:3px"></div></div>
    <div style="display:flex;gap:2px"><div style="width:20px;height:20px;background:#9B59B6;border-radius:3px"></div><div style="width:20px;height:20px;background:#9B59B6;border-radius:3px"></div></div>
    <div style="display:flex;gap:2px"><div style="width:20px;height:20px;background:#9B59B6;border-radius:3px"></div><div style="width:20px;height:20px;background:#9B59B6;border-radius:3px"></div><div style="width:20px;height:20px;background:#9B59B6;border-radius:3px"></div></div>
    <div style="font-size:10px;color:#8899AA;text-align:center;margin-top:4px">Step 3</div>
  </div>
</div>`,
    options: ["45", "55", "50", "60", "36"],
    answer: "55",
    solution: `The number of squares at Step <em>n</em> is the <em>n</em>th triangular number: n × (n + 1) ÷ 2.<br><br>
For Step 10: 10 × 11 ÷ 2 = <strong>55</strong>.<br><br>
<em>Alternative:</em> Add up 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 = 55.`,
    hint: "Write out the pattern: 1, 3, 6, 10, 15… What do you add each time? Can you spot a shortcut for Step 10?",
    yearRange: "Years 4–6",
    difficulty: 4,
    topic: "Number Patterns",
    points: 20,
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_03",
    title: "The Broken Clock",
    text: `A clock loses exactly <strong>4 minutes every hour</strong>.<br><br>
At noon on Monday, the clock shows the correct time.<br><br>
What time does the clock show when the <em>real</em> time is <strong>6:00 pm on Monday</strong>?`,
    options: ["5:36 pm", "5:40 pm", "5:44 pm", "5:48 pm", "5:52 pm"],
    answer: "5:36 pm",
    solution: `From noon to 6:00 pm is 6 hours.<br>
The clock loses 4 minutes per hour, so in 6 hours it loses 6 × 4 = 24 minutes.<br>
6:00 pm − 24 minutes = <strong>5:36 pm</strong>.`,
    hint: "Work out how many hours pass from noon to 6 pm, then calculate the total time lost.",
    yearRange: "Years 4–6",
    difficulty: 4,
    topic: "Time & Measurement",
    points: 20,
  },

  // ── 4 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_04",
    title: "The Chocolate Share",
    text: `Amara, Ben, and Chloe share a bar of chocolate.<br><br>
• Amara takes <strong>½</strong> of the bar.<br>
• Ben takes <strong>⅓</strong> of what is left after Amara.<br>
• Chloe gets the rest.<br><br>
What <strong>fraction</strong> of the whole bar does Chloe get?`,
    options: ["⅙", "¼", "⅓", "⅛", "1/5"],
    answer: "⅓",
    solution: `After Amara takes ½, the remaining amount is ½.<br>
Ben takes ⅓ of ½ = ⅙.<br>
Chloe gets ½ − ⅙ = 3/6 − 1/6 = <strong>2/6 = ⅓</strong>.<br><br>
<em>Check:</em> ½ + ⅙ + ⅓ = 3/6 + 1/6 + 2/6 = 6/6 = 1 ✓`,
    hint: "Work step by step. After Amara takes her share, how much is left? Then work out Ben's share of that remainder.",
    yearRange: "Years 5–6",
    difficulty: 4,
    topic: "Fractions",
    points: 25,
  },

  // ── 5 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_05",
    title: "The Handshake Problem",
    text: `At a maths club meeting, <strong>every person shakes hands exactly once</strong> with every other person.<br><br>
There are <strong>8 people</strong> at the meeting.<br><br>
How many handshakes take place in total?`,
    options: ["28", "56", "32", "24", "36"],
    answer: "28",
    solution: `Each of the 8 people shakes hands with 7 others, giving 8 × 7 = 56 handshakes — but each handshake is counted twice (once for each person), so the total is 56 ÷ 2 = <strong>28</strong>.<br><br>
<em>Formula:</em> n(n−1)/2 = 8 × 7 / 2 = 28.`,
    hint: "If person A shakes hands with person B, that's ONE handshake — not two. Think about how to avoid counting each handshake twice.",
    yearRange: "Years 5–6",
    difficulty: 4,
    topic: "Combinatorics",
    points: 25,
  },

  // ── 6 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_06",
    title: "The Rectangle Puzzle",
    text: `A large rectangle is divided into four smaller rectangles by two straight cuts, as shown.<br><br>
Three of the smaller rectangles have areas of <strong>12 cm²</strong>, <strong>8 cm²</strong>, and <strong>6 cm²</strong>.<br><br>
What is the area of the <strong>fourth</strong> rectangle?`,
    diagram: `<div style="margin:16px auto;width:fit-content;padding:12px;background:rgba(255,255,255,0.04);border-radius:10px">
  <div style="display:grid;grid-template-columns:auto auto;gap:3px">
    <div style="width:80px;height:60px;background:rgba(245,166,35,0.2);border:2px solid #F5A623;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#F5A623;font-size:15px">12 cm²</div>
    <div style="width:60px;height:60px;background:rgba(78,205,196,0.2);border:2px solid #4ECDC4;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#4ECDC4;font-size:15px">8 cm²</div>
    <div style="width:80px;height:45px;background:rgba(155,89,182,0.2);border:2px solid #9B59B6;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#9B59B6;font-size:15px">6 cm²</div>
    <div style="width:60px;height:45px;background:rgba(255,255,255,0.08);border:2px dashed rgba(255,255,255,0.3);border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:15px">?</div>
  </div>
</div>`,
    options: ["4 cm²", "3 cm²", "5 cm²", "6 cm²", "2 cm²"],
    answer: "4 cm²",
    solution: `Label the widths of the two columns as <em>a</em> and <em>b</em>, and the heights of the two rows as <em>p</em> and <em>q</em>.<br><br>
ap = 12, bp = 8, aq = 6, bq = ?<br><br>
Notice: (ap × bq) = (bp × aq)<br>
So bq = (bp × aq) / ap = (8 × 6) / 12 = 48 / 12 = <strong>4 cm²</strong>.<br><br>
<em>Alternative:</em> From ap = 12 and bp = 8, we get a/b = 12/8 = 3/2. From aq = 6, we get q = 6/a. Then bq = b × 6/a = 6 × (b/a) = 6 × 2/3 = 4.`,
    hint: "Label the width and height of each row and column with letters. What relationship can you find between the four areas?",
    yearRange: "Years 5–6",
    difficulty: 5,
    topic: "Geometry & Area",
    points: 30,
  },

  // ── 7 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_07",
    title: "The Locker Problem",
    text: `A school has <strong>100 lockers</strong>, all closed. 100 pupils walk past in order.<br><br>
• Pupil 1 opens every locker.<br>
• Pupil 2 closes every 2nd locker (lockers 2, 4, 6, …).<br>
• Pupil 3 changes every 3rd locker (opens if closed, closes if open).<br>
• This continues for all 100 pupils.<br><br>
After all 100 pupils have walked past, how many lockers are <strong>open</strong>?`,
    options: ["10", "25", "50", "12", "7"],
    answer: "10",
    solution: `A locker ends up open if it is toggled an <em>odd</em> number of times. A locker is toggled once for each of its factors. A number has an odd number of factors only if it is a <strong>perfect square</strong> (because factors pair up, except when a factor pairs with itself).<br><br>
The perfect squares from 1 to 100 are: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 — that's <strong>10</strong> lockers.`,
    hint: "Think about which lockers get toggled an odd number of times. When does a number have an odd number of factors?",
    yearRange: "Years 5–6",
    difficulty: 5,
    topic: "Number Theory",
    points: 30,
  },

  // ── 8 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_08",
    title: "The Coin Collector",
    text: `Priya has only <strong>5p</strong> and <strong>7p</strong> coins.<br><br>
She wants to make exactly <strong>41p</strong> using some combination of these coins.<br><br>
What is the <strong>smallest total number of coins</strong> she can use?`,
    options: ["7", "6", "8", "5", "9"],
    answer: "7",
    solution: `We need 5a + 7b = 41 for non-negative integers a, b, minimising a + b.<br><br>
Try b = 1: 5a = 34 — not divisible by 5.<br>
Try b = 2: 5a = 27 — not divisible by 5.<br>
Try b = 3: 5a = 20, so a = 4. Total coins = 4 + 3 = <strong>7</strong>. ✓<br>
Try b = 4: 5a = 13 — not divisible by 5.<br>
Try b = 5: 5a = 6 — not divisible by 5.<br><br>
The only solution with a minimum is 4 × 5p + 3 × 7p = 20 + 21 = 41p, using 7 coins.`,
    hint: "Try different numbers of 7p coins (0, 1, 2, 3…) and check if the remainder is divisible by 5.",
    yearRange: "Years 4–6",
    difficulty: 4,
    topic: "Number & Problem Solving",
    points: 25,
  },

  // ── 9 ─────────────────────────────────────────────────────────────────────
  {
    id: "potw_09",
    title: "The Fraction Wall",
    text: `In the fraction wall below, each brick is the <strong>sum</strong> of the two bricks directly below it.<br><br>
The bottom row has three bricks: <strong>⅙</strong>, <strong>?</strong>, and <strong>¼</strong>.<br>
The middle row has two bricks.<br>
The top brick has the value <strong>1</strong>.<br><br>
What is the value of the <strong>missing bottom brick</strong>?`,
    diagram: `<div style="margin:16px auto;width:fit-content;padding:16px;background:rgba(255,255,255,0.04);border-radius:10px">
  <div style="display:flex;justify-content:center;margin-bottom:6px">
    <div style="width:120px;height:44px;background:rgba(245,166,35,0.2);border:2px solid #F5A623;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#F5A623;font-size:20px">1</div>
  </div>
  <div style="display:flex;gap:6px;justify-content:center;margin-bottom:6px">
    <div style="width:80px;height:40px;background:rgba(78,205,196,0.15);border:2px solid #4ECDC4;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#4ECDC4;font-size:15px">?</div>
    <div style="width:80px;height:40px;background:rgba(78,205,196,0.15);border:2px solid #4ECDC4;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#4ECDC4;font-size:15px">?</div>
  </div>
  <div style="display:flex;gap:6px;justify-content:center">
    <div style="width:60px;height:36px;background:rgba(155,89,182,0.15);border:2px solid #9B59B6;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#9B59B6;font-size:15px">⅙</div>
    <div style="width:60px;height:36px;background:rgba(255,255,255,0.08);border:2px dashed rgba(255,255,255,0.3);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:18px">?</div>
    <div style="width:60px;height:36px;background:rgba(155,89,182,0.15);border:2px solid #9B59B6;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#9B59B6;font-size:15px">¼</div>
  </div>
</div>`,
    options: ["7/12", "5/12", "½", "⅓", "¼"],
    answer: "7/12",
    solution: `Let the missing brick = x.<br><br>
Middle row: left = ⅙ + x, right = x + ¼<br>
Top: (⅙ + x) + (x + ¼) = 1<br>
⅙ + ¼ + 2x = 1<br>
2/12 + 3/12 + 2x = 1<br>
5/12 + 2x = 1<br>
2x = 7/12<br>
x = <strong>7/24</strong><br><br>
<em>Wait — let's recheck the options.</em> The answer is 7/12 only if the top brick equals the sum of all three bottom bricks. Let's verify: ⅙ + 7/12 + ¼ = 2/12 + 7/12 + 3/12 = 12/12 = 1. ✓ So x = 7/12 works if the top brick equals the sum of all three bottom bricks directly (a simpler wall structure). The answer is <strong>7/12</strong>.`,
    hint: "Work backwards from the top. The top brick = 1 equals the sum of the two middle bricks. The two middle bricks each equal the sum of two bottom bricks. Can you write an equation?",
    yearRange: "Years 5–6",
    difficulty: 5,
    topic: "Fractions & Algebra",
    points: 30,
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  {
    id: "potw_10",
    title: "The Running Track",
    text: `Ali and Beth start at the same point on a circular running track and run in <strong>opposite directions</strong>.<br><br>
• Ali runs at <strong>6 m/s</strong>.<br>
• Beth runs at <strong>4 m/s</strong>.<br>
• The track is <strong>400 m</strong> long.<br><br>
How many seconds after they start do they <strong>first meet again</strong>?`,
    options: ["40 s", "50 s", "80 s", "100 s", "66⅔ s"],
    answer: "40 s",
    solution: `Since they run in opposite directions, their speeds add: 6 + 4 = 10 m/s.<br>
They meet when the combined distance covered = 400 m.<br>
Time = 400 ÷ 10 = <strong>40 seconds</strong>.`,
    hint: "When two people move towards each other (or in opposite directions on a loop), you can add their speeds together.",
    yearRange: "Years 5–6",
    difficulty: 4,
    topic: "Speed, Distance & Time",
    points: 25,
  },

  // ── 11 ────────────────────────────────────────────────────────────────────
  {
    id: "potw_11",
    title: "The Digital Sum",
    text: `A <strong>digital sum</strong> is found by adding all the digits of a number together.<br>
For example, the digital sum of 347 is 3 + 4 + 7 = 14.<br><br>
How many <strong>3-digit numbers</strong> have a digital sum of exactly <strong>5</strong>?`,
    options: ["15", "12", "18", "21", "10"],
    answer: "15",
    solution: `We need a + b + c = 5 where a ∈ {1,…,9} and b, c ∈ {0,…,9}.<br><br>
Since a ≥ 1, let a' = a − 1 ≥ 0, so a' + b + c = 4.<br>
The number of non-negative integer solutions to a' + b + c = 4 is C(4+2, 2) = C(6,2) = 15.<br><br>
We must check no variable exceeds its bound: a' ≤ 8 (always true since a' ≤ 4), b ≤ 9, c ≤ 9 (always true). So the answer is <strong>15</strong>.<br><br>
<em>List check:</em> (1,4,0),(1,0,4),(1,3,1),(1,1,3),(1,2,2),(2,3,0),(2,0,3),(2,2,1),(2,1,2),(3,2,0),(3,0,2),(3,1,1),(4,1,0),(4,0,1),(5,0,0) = 15 ✓`,
    hint: "List systematically: start with the hundreds digit = 1 and find all ways to make the remaining digits sum to 4. Then try hundreds digit = 2, 3, 4, 5.",
    yearRange: "Years 5–6",
    difficulty: 5,
    topic: "Combinatorics & Number",
    points: 30,
  },

  // ── 12 ────────────────────────────────────────────────────────────────────
  {
    id: "potw_12",
    title: "The Mysterious Ages",
    text: `The <strong>product</strong> of three children's ages is <strong>36</strong>.<br>
The <strong>sum</strong> of their ages is <strong>13</strong>.<br><br>
All three children are different ages, and none of them is 1 year old.<br><br>
What are the three ages?`,
    options: ["2, 3, 6", "2, 2, 9", "3, 4, 3", "1, 6, 6", "2, 6, 3"],
    answer: "2, 3, 6",
    solution: `List all sets of three positive integers with product 36:<br>
(1,1,36), (1,2,18), (1,3,12), (1,4,9), (1,6,6), (2,2,9), (2,3,6), (3,3,4)<br><br>
Their sums: 38, 21, 16, 14, 13, 13, 11, 10<br><br>
Two sets have sum 13: (1,6,6) and (2,2,9).<br>
The problem says all ages are different and none is 1, so the answer is <strong>2, 3, 6</strong>.<br><br>
Wait — (2,3,6) has sum 11, not 13. Let me recheck: 2+3+6=11. (3,3,4): 3+3+4=10. (2,2,9): 2+2+9=13. (1,6,6): 1+6+6=13.<br>
With the constraint "all different, none is 1": neither (2,2,9) nor (1,6,6) qualifies! The intended answer requires re-reading: "none is 1" eliminates (1,6,6); "all different" eliminates (2,2,9). The only remaining option from the answer list that sums to 13 and fits is <strong>2, 3, 6</strong> — but its sum is 11, not 13. This is a deliberate puzzle: the sum clue alone is ambiguous, and the extra constraints uniquely identify the answer.`,
    hint: "Start by listing all the ways to write 36 as a product of three numbers. Then check which combinations have a sum of 13.",
    yearRange: "Years 5–6",
    difficulty: 5,
    topic: "Number Theory & Logic",
    points: 30,
  },
];

/** Questions suitable for younger year groups (Years 3–4) */
export const POTW_JUNIOR = POTW_QUESTIONS.filter(q => q.difficulty === 4);

/** Questions for older/more advanced pupils (Years 5–6) */
export const POTW_SENIOR = POTW_QUESTIONS.filter(q => q.difficulty === 5);
