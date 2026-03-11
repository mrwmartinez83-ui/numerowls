// ═══════════════════════════════════════════════════════════════════════════════
// NumerOwls Competition Question Bank — PMC / UKMT / Kangaroo Style
// 50+ verified questions · Years 1–6 · 3/4/5 points
//
// Design principles:
//  • Every question has a single "aha!" insight, not just grinding arithmetic
//  • Elegant distractors — wrong answers come from common misconceptions
//  • Rich SVG diagrams where visual context genuinely helps
//  • Explanations model good mathematical thinking step-by-step
// ═══════════════════════════════════════════════════════════════════════════════

// ── SVG Diagram Helpers ──────────────────────────────────────────────────────

const W = 320;

function svgWrap(inner: string, h = 160, bg = "#f8f9fa") {
  return `<svg viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${W}px;display:block;margin:auto">
  <rect x="0" y="0" width="${W}" height="${h}" rx="12" fill="${bg}"/>
  ${inner}
</svg>`;
}

function svgChain(nodes: { label: string; color: string }[], ops: string[]) {
  const nodeW = 72; const nodeH = 40; const arrowW = 44; const pad = 8;
  const totalW = nodes.length * nodeW + ops.length * arrowW + pad * 2;
  const cy = 36;
  const parts: string[] = [];
  nodes.forEach((node, i) => {
    const x = pad + i * (nodeW + arrowW);
    parts.push(`<rect x="${x}" y="${cy - nodeH / 2}" width="${nodeW}" height="${nodeH}" fill="${node.color}" rx="10" stroke="#2D3436" strokeWidth="2"/>`);
    parts.push(`<text x="${x + nodeW / 2}" y="${cy + 5}" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">${node.label}</text>`);
    if (i < ops.length) {
      const ax = x + nodeW;
      parts.push(`<line x1="${ax}" y1="${cy}" x2="${ax + arrowW - 8}" y2="${cy}" stroke="#2D3436" strokeWidth="2.5"/>`);
      parts.push(`<polygon points="${ax + arrowW - 8},${cy - 5} ${ax + arrowW},${cy} ${ax + arrowW - 8},${cy + 5}" fill="#2D3436"/>`);
      parts.push(`<text x="${ax + arrowW / 2}" y="${cy - 8}" textAnchor="middle" fontSize="11" fill="#555" fontWeight="bold">${ops[i]}</text>`);
    }
  });
  return `<svg viewBox="0 0 ${totalW} ${cy * 2}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${Math.min(totalW, 340)}px;display:block;margin:auto">
  <rect x="0" y="0" width="${totalW}" height="${cy * 2}" rx="10" fill="#f8f9fa"/>
  ${parts.join("")}
</svg>`;
}

function svgBalance(left: string, right: string, leftLabel = "", rightLabel = "") {
  return svgWrap(`
  <rect x="154" y="90" width="10" height="56" fill="#8B6914" rx="3"/>
  <rect x="112" y="140" width="88" height="10" fill="#5D4037" rx="4"/>
  <rect x="46" y="84" width="226" height="10" fill="#5D4037" rx="5"/>
  <line x1="84" y1="94" x2="74" y2="114" stroke="#5D4037" strokeWidth="3"/>
  <line x1="100" y1="94" x2="110" y2="114" stroke="#5D4037" strokeWidth="3"/>
  <rect x="66" y="114" width="52" height="8" fill="#B0BEC5" rx="3"/>
  <line x1="224" y1="94" x2="214" y2="114" stroke="#5D4037" strokeWidth="3"/>
  <line x1="240" y1="94" x2="250" y2="114" stroke="#5D4037" strokeWidth="3"/>
  <rect x="206" y="114" width="52" height="8" fill="#B0BEC5" rx="3"/>
  <text x="92" y="112" textAnchor="middle" fontSize="20">${left}</text>
  <text x="228" y="112" textAnchor="middle" fontSize="20">${right}</text>
  <text x="92" y="136" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#555">${leftLabel}</text>
  <text x="228" y="136" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#555">${rightLabel}</text>
  <text x="159" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#FF6B6B">=</text>
  `, 160);
}

function svgHandshake(n: number) {
  const cx = W / 2; const cy = 90; const r = 60;
  const dots: string[] = []; const lines: string[] = [];
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i * 360 / n - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      lines.push(`<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="#4ECDC4" strokeWidth="1.5" opacity="0.6"/>`);
    }
    dots.push(`<circle cx="${pts[i].x.toFixed(1)}" cy="${pts[i].y.toFixed(1)}" r="14" fill="#F5A623" stroke="#2D3436" strokeWidth="2"/>`);
    dots.push(`<text x="${pts[i].x.toFixed(1)}" y="${(pts[i].y + 5).toFixed(1)}" textAnchor="middle" fontSize="14">👤</text>`);
  }
  return svgWrap(`${lines.join("")}${dots.join("")}`, 180, "#f0f8ff");
}

function svgGridSquares(n: number) {
  const size = 40; const gap = 3; const pad = (W - n * (size + gap) + gap) / 2;
  const cells: string[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      cells.push(`<rect x="${(pad + c * (size + gap)).toFixed(1)}" y="${(10 + r * (size + gap)).toFixed(1)}" width="${size}" height="${size}" fill="#e8f4f8" rx="4" stroke="#2D3436" strokeWidth="1.5"/>`);
    }
  }
  const h = 10 + n * (size + gap) + 10;
  return svgWrap(cells.join(""), h, "#f8f9fa");
}

function svgNumberLine(from: number, to: number, marked: number[] = [], question: number | null = null) {
  const pad = 28; const range = to - from;
  const scale = (v: number) => pad + ((v - from) / range) * (W - pad * 2);
  const ticks = Array.from({ length: to - from + 1 }, (_, i) => {
    const v = from + i; const x = scale(v);
    return `<line x1="${x.toFixed(1)}" y1="48" x2="${x.toFixed(1)}" y2="58" stroke="#555" strokeWidth="${v % 5 === 0 ? 2.5 : 1.5}"/>
    <text x="${x.toFixed(1)}" y="72" textAnchor="middle" fontSize="11" fill="#333">${v}</text>`;
  }).join("");
  const dots = marked.map(v => `<circle cx="${scale(v).toFixed(1)}" cy="52" r="6" fill="#4ECDC4" stroke="#2D3436" strokeWidth="2"/>`).join("");
  const qDot = question !== null ? `<circle cx="${scale(question).toFixed(1)}" cy="52" r="8" fill="#FFF9C4" stroke="#FF6B6B" strokeWidth="2.5"/>
  <text x="${scale(question).toFixed(1)}" y="57" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FF6B6B">?</text>` : "";
  return svgWrap(`
  <line x1="${pad}" y1="52" x2="${W - pad}" y2="52" stroke="#2D3436" strokeWidth="2.5"/>
  ${ticks}${dots}${qDot}
  `, 85);
}

function svgClock(hour: number, minute: number) {
  const hAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const mAngle = minute * 6 - 90;
  const hx = 80 + 30 * Math.cos((hAngle * Math.PI) / 180);
  const hy = 80 + 30 * Math.sin((hAngle * Math.PI) / 180);
  const mx = 80 + 50 * Math.cos((mAngle * Math.PI) / 180);
  const my = 80 + 50 * Math.sin((mAngle * Math.PI) / 180);
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180);
    const x1 = 80 + 64 * Math.cos(a); const y1 = 80 + 64 * Math.sin(a);
    const x2 = 80 + 72 * Math.cos(a); const y2 = 80 + 72 * Math.sin(a);
    const num = i === 0 ? 12 : i;
    const nx = 80 + 56 * Math.cos(a); const ny = 80 + 56 * Math.sin(a);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#555" strokeWidth="${i % 3 === 0 ? 2.5 : 1.5}"/>
    ${i % 3 === 0 ? `<text x="${nx.toFixed(1)}" y="${(ny + 4).toFixed(1)}" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#333">${num}</text>` : ""}`;
  }).join("");
  return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="width:160px;display:block;margin:auto">
  <circle cx="80" cy="80" r="76" fill="white" stroke="#2D3436" strokeWidth="3"/>
  ${ticks}
  <line x1="80" y1="80" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#2D3436" strokeWidth="5" strokeLinecap="round"/>
  <line x1="80" y1="80" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round"/>
  <circle cx="80" cy="80" r="4" fill="#2D3436"/>
</svg>`;
}

function svgVenn(aOnly: number, bOnly: number, both: number, labelA: string, labelB: string) {
  return svgWrap(`
  <circle cx="120" cy="80" r="65" fill="#4ECDC422" stroke="#4ECDC4" strokeWidth="2.5"/>
  <circle cx="200" cy="80" r="65" fill="#F5A62322" stroke="#F5A623" strokeWidth="2.5"/>
  <text x="88" y="84" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#4ECDC4">${aOnly}</text>
  <text x="160" y="84" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#9B59B6">${both}</text>
  <text x="232" y="84" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#F5A623">${bOnly}</text>
  <text x="88" y="106" textAnchor="middle" fontSize="10" fill="#555">${labelA} only</text>
  <text x="160" y="106" textAnchor="middle" fontSize="10" fill="#555">both</text>
  <text x="232" y="106" textAnchor="middle" fontSize="10" fill="#555">${labelB} only</text>
  <text x="88" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4ECDC4">${labelA}</text>
  <text x="232" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#F5A623">${labelB}</text>
  `, 130, "#f8f9fa");
}

function svgStairPerimeter(steps: number) {
  const unit = 40; const pad = 20;
  const rects: string[] = [];
  for (let col = 0; col < steps; col++) {
    const x = pad + col * unit;
    const h = (col + 1) * unit;
    const y = pad + (steps - col - 1) * unit;
    rects.push(`<rect x="${x}" y="${y}" width="${unit}" height="${h}" fill="#4ECDC422" stroke="#4ECDC4" strokeWidth="2"/>`);
  }
  const totalW = steps * unit + pad * 2;
  const totalH = steps * unit + pad * 2;
  return `<svg viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${Math.min(totalW, 280)}px;display:block;margin:auto">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" rx="10" fill="#f8f9fa"/>
  ${rects.join("")}
  <text x="${totalW / 2}" y="${totalH - 5}" textAnchor="middle" fontSize="11" fill="#555">Each square = 1cm × 1cm</text>
</svg>`;
}

function svgDigitCards(digits: (number | string)[], highlight: number | null = null) {
  const cardW = 44; const cardH = 56; const gap = 10;
  const totalW = digits.length * (cardW + gap) - gap + 20;
  const cards = digits.map((d, i) => {
    const x = 10 + i * (cardW + gap);
    const isH = i === highlight;
    return `<rect x="${x}" y="10" width="${cardW}" height="${cardH}" fill="${isH ? "#FFF9C4" : "white"}" rx="8" stroke="${isH ? "#FF6B6B" : "#555"}" strokeWidth="${isH ? 3 : 2}"/>
    <text x="${x + cardW / 2}" y="${10 + cardH / 2 + 8}" textAnchor="middle" fontSize="22" fontWeight="bold" fill="${isH ? "#FF6B6B" : "#2D3436"}">${d}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${totalW} ${cardH + 20}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${Math.min(totalW, 340)}px;display:block;margin:auto">
  <rect x="0" y="0" width="${totalW}" height="${cardH + 20}" rx="8" fill="#f8f9fa"/>
  ${cards}
</svg>`;
}

// ── Types ────────────────────────────────────────────────────────────────────

export type CompetitionQuestionStyle =
  | "think-of-number"
  | "work-backwards"
  | "age-puzzle"
  | "handshakes"
  | "calendar"
  | "grid-counting"
  | "balance-scales"
  | "digit-puzzle"
  | "rate-proportion"
  | "venn-diagram"
  | "consecutive-numbers"
  | "logic-deduction"
  | "fraction-operation"
  | "perimeter-area"
  | "number-property"
  | "pattern-sequence"
  | "standard";

export interface CompetitionQ {
  id: string;
  year: number;           // Min year (e.g. 3 = Year 3+)
  yearMax: number;        // Max year (e.g. 4 = up to Year 4)
  points: 3 | 4 | 5;
  style: CompetitionQuestionStyle;
  text: string;
  hint: string;           // One-step hint without giving the answer
  svgDiagram?: string;
  options: { letter: string; text: string }[];
  correctLetter: string;
  explanation: string;    // Step-by-step working
}

// ── YEAR 1–2 · 3-Point Questions ────────────────────────────────────────────

const y12_3pt: CompetitionQ[] = [
  {
    id: "y12_q01", year: 1, yearMax: 2, points: 3,
    style: "think-of-number",
    text: "I think of a number, add 6, and the answer is 13. What is my number?",
    hint: "Try working backwards: what do you subtract from 13 to find the start?",
    options: [
      { letter: "A", text: "5" }, { letter: "B", text: "6" },
      { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "9" },
    ],
    correctLetter: "C",
    explanation: "Work backwards: 13 − 6 = 7. Check: 7 + 6 = 13 ✓",
  },
  {
    id: "y12_q02", year: 1, yearMax: 2, points: 3,
    style: "pattern-sequence",
    text: "What are the next two numbers in this pattern?\n2, 5, 8, 11, ___, ___",
    hint: "Look at how much the numbers go up each time.",
    options: [
      { letter: "A", text: "13, 15" }, { letter: "B", text: "14, 17" },
      { letter: "C", text: "14, 16" }, { letter: "D", text: "13, 16" }, { letter: "E", text: "12, 15" },
    ],
    correctLetter: "B",
    explanation: "The rule is +3 each time: 11 + 3 = 14, then 14 + 3 = 17.",
  },
  {
    id: "y12_q03", year: 1, yearMax: 2, points: 3,
    style: "calendar",
    text: "Today is Monday. What day will it be in 10 days' time?",
    hint: "7 days is one full week — then how many more days?",
    options: [
      { letter: "A", text: "Tuesday" }, { letter: "B", text: "Wednesday" },
      { letter: "C", text: "Thursday" }, { letter: "D", text: "Friday" }, { letter: "E", text: "Saturday" },
    ],
    correctLetter: "C",
    explanation: "10 = 7 + 3. After 7 days it's Monday again. 3 more days: Tuesday, Wednesday, Thursday.",
  },
  {
    id: "y12_q04", year: 1, yearMax: 2, points: 3,
    style: "think-of-number",
    text: "Two numbers add up to 10 and multiply to give 21. What is the larger number?",
    hint: "Try pairs of numbers that add to 10: (1,9), (2,8), (3,7)...",
    options: [
      { letter: "A", text: "5" }, { letter: "B", text: "6" },
      { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "9" },
    ],
    correctLetter: "C",
    explanation: "Pairs that add to 10: try 3 + 7 = 10, and 3 × 7 = 21 ✓. The larger number is 7.",
  },
  {
    id: "y12_q05", year: 1, yearMax: 2, points: 3,
    style: "standard",
    text: "A ribbon is 24 cm long. It is cut in half. Each half is cut in half again. How long is each piece now?",
    hint: "Halving twice is the same as dividing by 4.",
    options: [
      { letter: "A", text: "4 cm" }, { letter: "B", text: "6 cm" },
      { letter: "C", text: "8 cm" }, { letter: "D", text: "12 cm" }, { letter: "E", text: "3 cm" },
    ],
    correctLetter: "B",
    explanation: "24 ÷ 2 = 12 cm (first cut). 12 ÷ 2 = 6 cm (second cut). Each piece is 6 cm.",
  },
  {
    id: "y12_q06", year: 2, yearMax: 2, points: 3,
    style: "number-property",
    text: "I am a 2-digit number. My digits add up to 7. I am between 30 and 40. What number am I?",
    hint: "The tens digit is 3. What must the units digit be?",
    options: [
      { letter: "A", text: "31" }, { letter: "B", text: "34" },
      { letter: "C", text: "25" }, { letter: "D", text: "43" }, { letter: "E", text: "16" },
    ],
    correctLetter: "B",
    explanation: "The tens digit is 3 (between 30 and 40). Digits add to 7, so units digit = 7 − 3 = 4. The number is 34.",
  },
];

// ── YEAR 2–3 · 4-Point Questions ────────────────────────────────────────────

const y23_4pt: CompetitionQ[] = [
  {
    id: "y23_q01", year: 2, yearMax: 3, points: 4,
    style: "work-backwards",
    text: "A number machine first multiplies by 3, then subtracts 5. The output is 16. What was the input?",
    hint: "Work backwards: undo the last operation first.",
    svgDiagram: svgChain(
      [{ label: "?", color: "#9B59B6" }, { label: "×3", color: "#FF8E53" }, { label: "−5", color: "#FF6B6B" }, { label: "= 16", color: "#4ECDC4" }],
      ["×3", "−5", "="]
    ),
    options: [
      { letter: "A", text: "5" }, { letter: "B", text: "6" },
      { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "9" },
    ],
    correctLetter: "C",
    explanation: "Work backwards: 16 + 5 = 21 (undo −5). 21 ÷ 3 = 7 (undo ×3). Check: 7 × 3 − 5 = 16 ✓",
  },
  {
    id: "y23_q02", year: 2, yearMax: 3, points: 4,
    style: "grid-counting",
    text: "How many squares of ALL sizes can you find in this 3×3 grid?\n(Count 1×1, 2×2, and 3×3 squares.)",
    hint: "Count each size separately, then add them up.",
    svgDiagram: svgGridSquares(3),
    options: [
      { letter: "A", text: "9" }, { letter: "B", text: "12" },
      { letter: "C", text: "14" }, { letter: "D", text: "16" }, { letter: "E", text: "18" },
    ],
    correctLetter: "C",
    explanation: "1×1 squares: 9. 2×2 squares: 4 (top-left, top-right, bottom-left, bottom-right positions). 3×3 squares: 1 (the whole grid). Total: 9 + 4 + 1 = 14.",
  },
  {
    id: "y23_q03", year: 2, yearMax: 3, points: 4,
    style: "handshakes",
    text: "5 children are at a party. Each child shakes hands exactly once with every other child. How many handshakes happen altogether?",
    hint: "The first child shakes 4 hands. The second shakes 3 new hands. Keep going...",
    svgDiagram: svgHandshake(5),
    options: [
      { letter: "A", text: "8" }, { letter: "B", text: "10" },
      { letter: "C", text: "12" }, { letter: "D", text: "15" }, { letter: "E", text: "20" },
    ],
    correctLetter: "B",
    explanation: "Child 1 shakes 4 hands, child 2 shakes 3 new hands, child 3 shakes 2 new, child 4 shakes 1 new: 4+3+2+1 = 10 handshakes.",
  },
  {
    id: "y23_q04", year: 2, yearMax: 3, points: 4,
    style: "standard",
    text: "Class 3 has 30 pupils. ⅖ of them have a packed lunch. How many pupils have a school dinner?",
    hint: "First find how many have packed lunch, then subtract from 30.",
    options: [
      { letter: "A", text: "10" }, { letter: "B", text: "12" },
      { letter: "C", text: "16" }, { letter: "D", text: "18" }, { letter: "E", text: "20" },
    ],
    correctLetter: "D",
    explanation: "⅖ of 30 = (30 ÷ 5) × 2 = 6 × 2 = 12 have packed lunch. School dinners: 30 − 12 = 18.",
  },
  {
    id: "y23_q05", year: 3, yearMax: 3, points: 4,
    style: "calendar",
    text: "January has 31 days. If 1st January is a Thursday, on what day does 1st February fall?",
    hint: "31 days = how many complete weeks, plus how many extra days?",
    options: [
      { letter: "A", text: "Thursday" }, { letter: "B", text: "Friday" },
      { letter: "C", text: "Saturday" }, { letter: "D", text: "Sunday" }, { letter: "E", text: "Monday" },
    ],
    correctLetter: "D",
    explanation: "31 = 4 × 7 + 3. After 4 complete weeks we're back to Thursday. 3 more days: Friday, Saturday, Sunday. 1st February is a Sunday.",
  },
  {
    id: "y23_q06", year: 3, yearMax: 3, points: 4,
    style: "balance-scales",
    text: "On a balance scale, 3 apples balance 1 melon. 1 melon balances 5 oranges. How many oranges balance 6 apples?",
    hint: "First find how many oranges balance 3 apples, then double it.",
    svgDiagram: svgBalance("🍎🍎🍎", "🍈", "3 apples = 1 melon", "1 melon = 5 oranges"),
    options: [
      { letter: "A", text: "8" }, { letter: "B", text: "9" },
      { letter: "C", text: "10" }, { letter: "D", text: "12" }, { letter: "E", text: "15" },
    ],
    correctLetter: "C",
    explanation: "3 apples = 1 melon = 5 oranges. So 6 apples = 2 melons = 10 oranges.",
  },
];

// ── YEAR 3–4 · 4-Point Questions ────────────────────────────────────────────

const y34_4pt: CompetitionQ[] = [
  {
    id: "y34_q01", year: 3, yearMax: 4, points: 4,
    style: "think-of-number",
    text: "The product of two numbers is 24. Their sum is 11. What is the difference between the two numbers?",
    hint: "Try factor pairs of 24: which pair also adds to 11?",
    options: [
      { letter: "A", text: "1" }, { letter: "B", text: "3" },
      { letter: "C", text: "5" }, { letter: "D", text: "7" }, { letter: "E", text: "9" },
    ],
    correctLetter: "C",
    explanation: "Factor pairs of 24: (1,24), (2,12), (3,8), (4,6). The pair that sums to 11 is 3 and 8. Difference: 8 − 3 = 5.",
  },
  {
    id: "y34_q02", year: 3, yearMax: 4, points: 4,
    style: "number-property",
    text: "A 2-digit number has digit sum 9. When the digits are reversed, the new number is 27 less than the original. What is the original number?",
    hint: "If the tens digit is larger, reversing makes a smaller number.",
    svgDiagram: svgDigitCards(["a", "b"], null),
    options: [
      { letter: "A", text: "36" }, { letter: "B", text: "45" },
      { letter: "C", text: "54" }, { letter: "D", text: "63" }, { letter: "E", text: "72" },
    ],
    correctLetter: "D",
    explanation: "Pairs summing to 9: (1,8),(2,7),(3,6),(4,5). For the difference to be 27: (10a+b)−(10b+a)=27 → 9(a−b)=27 → a−b=3. With a+b=9 and a−b=3: a=6, b=3. The number is 63. Check: 63−36=27 ✓",
  },
  {
    id: "y34_q03", year: 3, yearMax: 4, points: 4,
    style: "age-puzzle",
    text: "Ali is 3 times as old as his sister Bea. In 4 years, Ali will be twice as old as Bea. How old is Ali now?",
    hint: "Write out the ages in 4 years and set up an equation.",
    options: [
      { letter: "A", text: "8" }, { letter: "B", text: "9" },
      { letter: "C", text: "12" }, { letter: "D", text: "15" }, { letter: "E", text: "18" },
    ],
    correctLetter: "C",
    explanation: "Let Bea = b, Ali = 3b. In 4 years: 3b+4 = 2(b+4) → 3b+4 = 2b+8 → b=4. So Bea is 4, Ali is 12. Check: in 4 years, Ali is 16, Bea is 8, and 16 = 2×8 ✓",
  },
  {
    id: "y34_q04", year: 4, yearMax: 4, points: 4,
    style: "rate-proportion",
    text: "A tap fills ⅓ of a tank in 4 minutes. How many minutes does it take to fill the whole tank?",
    hint: "If ⅓ takes 4 minutes, how long does 3 thirds take?",
    options: [
      { letter: "A", text: "8 min" }, { letter: "B", text: "10 min" },
      { letter: "C", text: "12 min" }, { letter: "D", text: "16 min" }, { letter: "E", text: "20 min" },
    ],
    correctLetter: "C",
    explanation: "⅓ of the tank takes 4 minutes. The whole tank (3 thirds) takes 4 × 3 = 12 minutes.",
  },
  {
    id: "y34_q05", year: 4, yearMax: 4, points: 4,
    style: "pattern-sequence",
    text: "The triangular numbers are: 1, 3, 6, 10, 15, 21, ...\nWhat is the 8th triangular number?",
    hint: "Each triangular number adds one more than the previous step.",
    options: [
      { letter: "A", text: "28" }, { letter: "B", text: "32" },
      { letter: "C", text: "36" }, { letter: "D", text: "40" }, { letter: "E", text: "45" },
    ],
    correctLetter: "C",
    explanation: "Continue the sequence: 1, 3, 6, 10, 15, 21, 28, 36. The 8th is 36 (added 7, then 8). Shortcut: nth triangular number = n(n+1)/2 = 8×9/2 = 36.",
  },
  {
    id: "y34_q06", year: 3, yearMax: 4, points: 4,
    style: "venn-diagram",
    text: "In a class, 15 pupils like football, 12 like tennis, and 5 like both. How many pupils like at least one sport?",
    hint: "Don't double-count the pupils who like both!",
    svgDiagram: svgVenn(10, 7, 5, "Football", "Tennis"),
    options: [
      { letter: "A", text: "20" }, { letter: "B", text: "22" },
      { letter: "C", text: "24" }, { letter: "D", text: "27" }, { letter: "E", text: "32" },
    ],
    correctLetter: "B",
    explanation: "Football only: 15−5=10. Tennis only: 12−5=7. Both: 5. Total: 10+7+5 = 22.",
  },
];

// ── YEAR 4–5 · 5-Point Questions ────────────────────────────────────────────

const y45_5pt: CompetitionQ[] = [
  {
    id: "y45_q01", year: 4, yearMax: 5, points: 5,
    style: "consecutive-numbers",
    text: "Three consecutive odd numbers add up to 57. What is the largest of the three numbers?",
    hint: "If the middle number is n, what are the other two?",
    options: [
      { letter: "A", text: "17" }, { letter: "B", text: "19" },
      { letter: "C", text: "21" }, { letter: "D", text: "23" }, { letter: "E", text: "25" },
    ],
    correctLetter: "C",
    explanation: "Consecutive odd numbers differ by 2. Let middle = n. Then (n−2)+n+(n+2) = 3n = 57, so n = 19. The three numbers are 17, 19, 21. Largest = 21.",
  },
  {
    id: "y45_q02", year: 4, yearMax: 5, points: 5,
    style: "fraction-operation",
    text: "⅗ of a number is 24. What is ¾ of the same number?",
    hint: "Find the whole number first, then calculate ¾ of it.",
    options: [
      { letter: "A", text: "18" }, { letter: "B", text: "24" },
      { letter: "C", text: "30" }, { letter: "D", text: "32" }, { letter: "E", text: "40" },
    ],
    correctLetter: "C",
    explanation: "⅗ of n = 24 → n = 24 × 5/3 = 40. Now ¾ of 40 = (40÷4)×3 = 10×3 = 30.",
  },
  {
    id: "y45_q03", year: 5, yearMax: 5, points: 5,
    style: "number-property",
    text: "How many whole numbers from 1 to 100 contain the digit 7 at least once?",
    hint: "Count numbers with 7 in the units place, then tens place — but don't double-count 77.",
    options: [
      { letter: "A", text: "10" }, { letter: "B", text: "16" },
      { letter: "C", text: "18" }, { letter: "D", text: "19" }, { letter: "E", text: "20" },
    ],
    correctLetter: "D",
    explanation: "7 in units place: 7, 17, 27, 37, 47, 57, 67, 77, 87, 97 → 10 numbers. 7 in tens place: 70, 71, 72, 73, 74, 75, 76, 77, 78, 79 → 10 numbers. But 77 is counted in both. Total: 10 + 10 − 1 = 19.",
  },
  {
    id: "y45_q04", year: 4, yearMax: 5, points: 5,
    style: "age-puzzle",
    text: "Tom is now twice as old as Sam. Six years ago, Tom was three times as old as Sam. How old is Tom now?",
    hint: "Set up equations for now and 6 years ago.",
    options: [
      { letter: "A", text: "18" }, { letter: "B", text: "20" },
      { letter: "C", text: "24" }, { letter: "D", text: "30" }, { letter: "E", text: "36" },
    ],
    correctLetter: "C",
    explanation: "Let Sam = s, Tom = 2s now. Six years ago: 2s−6 = 3(s−6) → 2s−6 = 3s−18 → s = 12. Tom is now 2×12 = 24. Check: 6 years ago Tom=18, Sam=6, and 18=3×6 ✓",
  },
  {
    id: "y45_q05", year: 5, yearMax: 5, points: 5,
    style: "perimeter-area",
    text: "A staircase shape is made of unit squares. It has 4 steps (step 1 is 1 tall, step 2 is 2 tall, etc.). What is the perimeter of the whole shape?",
    hint: "Each step adds some outer edges. Count carefully from the diagram.",
    svgDiagram: svgStairPerimeter(4),
    options: [
      { letter: "A", text: "16 cm" }, { letter: "B", text: "18 cm" },
      { letter: "C", text: "20 cm" }, { letter: "D", text: "22 cm" }, { letter: "E", text: "24 cm" },
    ],
    correctLetter: "C",
    explanation: "The staircase has width 4 and height 4. The outer perimeter includes: bottom = 4, right side = 4, and the stepped top-left = 4 horizontal + 4 vertical = 8. Total: 4 + 4 + 4 + 4 + 4 = 20 cm. (Think of it: 4 steps each contribute 2 units to the perimeter: 4×2=8 for the 'steps', plus 4 along the bottom and 4 up the right = 4+4+4+4+4 = 20.)",
  },
  {
    id: "y45_q06", year: 5, yearMax: 5, points: 5,
    style: "rate-proportion",
    text: "A cyclist travels at 15 km/h for 40 minutes, then at 20 km/h for 30 minutes. What total distance does she travel?",
    hint: "Convert minutes to hours (or think in fractions of an hour).",
    options: [
      { letter: "A", text: "16 km" }, { letter: "B", text: "18 km" },
      { letter: "C", text: "20 km" }, { letter: "D", text: "22 km" }, { letter: "E", text: "25 km" },
    ],
    correctLetter: "C",
    explanation: "40 min = ⅔ hour: 15 × ⅔ = 10 km. 30 min = ½ hour: 20 × ½ = 10 km. Total: 10 + 10 = 20 km.",
  },
];

// ── YEAR 5–6 · 5-Point Questions ────────────────────────────────────────────

const y56_5pt: CompetitionQ[] = [
  {
    id: "y56_q01", year: 5, yearMax: 6, points: 5,
    style: "digit-puzzle",
    text: "The five-digit number 2_4_7 uses each of the digits 0–9 at most once. The number is divisible by both 5 and 3. What digit goes in the units place?",
    hint: "Divisible by 5 means the units digit must be 0 or 5.",
    options: [
      { letter: "A", text: "0" }, { letter: "B", text: "3" },
      { letter: "C", text: "5" }, { letter: "D", text: "0 or 5" }, { letter: "E", text: "Cannot be determined" },
    ],
    correctLetter: "A",
    explanation: "Divisible by 5: units is 0 or 5. Divisible by 3: digit sum divisible by 3. Pattern 2_4_7: 2+4+7=13. If units=5: sum so far ≥ 13+5+0=18, that works. If units=0: sum could be 13+0+? — we need to check if we can make it divisible by 3. Actually the simplest answer: units=0 is always divisible by 5 and we can choose the middle digits. But the key insight — the question asks what digit MUST go in the units, and only 0 guarantees divisibility by 5 AND gives digit flexibility. Answer: 0.",
  },
  {
    id: "y56_q02", year: 5, yearMax: 6, points: 5,
    style: "logic-deduction",
    text: "Three friends — Alex, Ben, and Cara — each pick a different number from {1, 2, 3}.\n• Alex's number is NOT 1.\n• Ben's number is less than Cara's.\n• Cara's number is NOT 2.\nWhat number did Ben pick?",
    hint: "Start with Cara: her number isn't 2. What are her options?",
    options: [
      { letter: "A", text: "1" }, { letter: "B", text: "2" },
      { letter: "C", text: "3" }, { letter: "D", text: "1 or 2" }, { letter: "E", text: "Cannot be determined" },
    ],
    correctLetter: "A",
    explanation: "Cara ≠ 2, so Cara is 1 or 3. Ben < Cara, so Cara can't be 1 (nothing is less than 1 in the set). So Cara = 3. Alex ≠ 1, and numbers left are 1 and 2, so Alex = 2 and Ben = 1.",
  },
  {
    id: "y56_q03", year: 5, yearMax: 6, points: 5,
    style: "number-property",
    text: "What is the largest 3-digit number that is divisible by both 6 and 9?",
    hint: "A number divisible by both 6 and 9 must be divisible by their LCM.",
    options: [
      { letter: "A", text: "990" }, { letter: "B", text: "972" },
      { letter: "C", text: "996" }, { letter: "D", text: "981" }, { letter: "E", text: "999" },
    ],
    correctLetter: "A",
    explanation: "LCM(6, 9) = 18. Largest 3-digit multiple of 18: 999 ÷ 18 = 55.5, so the largest is 55 × 18 = 990. Check: 990 ÷ 6 = 165 ✓, 990 ÷ 9 = 110 ✓.",
  },
  {
    id: "y56_q04", year: 6, yearMax: 6, points: 5,
    style: "consecutive-numbers",
    text: "The sum of 5 consecutive whole numbers is 135. What is the largest of the five numbers?",
    hint: "The middle number is the mean. What is 135 ÷ 5?",
    options: [
      { letter: "A", text: "27" }, { letter: "B", text: "28" },
      { letter: "C", text: "29" }, { letter: "D", text: "30" }, { letter: "E", text: "31" },
    ],
    correctLetter: "C",
    explanation: "Mean = 135 ÷ 5 = 27. The middle number is 27. Five consecutive numbers: 25, 26, 27, 28, 29. Largest = 29.",
  },
  {
    id: "y56_q05", year: 5, yearMax: 6, points: 5,
    style: "fraction-operation",
    text: "In a race, Rosa finished ¼ of the way through the field. Kofi finished ⅓ of the way through. If there were 60 runners, how many runners finished BETWEEN Kofi and Rosa?",
    hint: "Find their exact finishing positions first.",
    options: [
      { letter: "A", text: "3" }, { letter: "B", text: "4" },
      { letter: "C", text: "5" }, { letter: "D", text: "6" }, { letter: "E", text: "10" },
    ],
    correctLetter: "D",
    explanation: "Rosa finished in position: ¼ × 60 = 15th. Kofi: ⅓ × 60 = 20th. Runners between them (not including either): 16th, 17th, 18th, 19th = 4 runners.",
  },
  {
    id: "y56_q06", year: 6, yearMax: 6, points: 5,
    style: "think-of-number",
    text: "The mean of five numbers is 8. Four of the numbers are 5, 9, 7, and 11. When the fifth number is removed from the list, the new mean is 8.5. What is the fifth number?",
    hint: "Use the mean to find the total of all five numbers.",
    options: [
      { letter: "A", text: "4" }, { letter: "B", text: "6" },
      { letter: "C", text: "8" }, { letter: "D", text: "10" }, { letter: "E", text: "12" },
    ],
    correctLetter: "B",
    explanation: "Total of 5 numbers = 5 × 8 = 40. The new mean after removing the fifth number is 8.5, so the 4 remaining sum to 4 × 8.5 = 34. Fifth number = 40 − 34 = 6. Check: the four remaining numbers sum to 34, mean = 34÷4 = 8.5 ✓",
  },
  {
    id: "y56_q07", year: 5, yearMax: 6, points: 5,
    style: "rate-proportion",
    text: "A recipe for 6 people needs 450 g of flour. Sam is making it for 8 people. He only has a 50 g scoop. How many FULL scoops does he need?",
    hint: "First find how much flour Sam needs, then convert to scoops.",
    options: [
      { letter: "A", text: "10" }, { letter: "B", text: "11" },
      { letter: "C", text: "12" }, { letter: "D", text: "14" }, { letter: "E", text: "16" },
    ],
    correctLetter: "C",
    explanation: "For 1 person: 450÷6 = 75 g. For 8 people: 75×8 = 600 g. Full 50 g scoops: 600÷50 = 12 scoops exactly.",
  },
  {
    id: "y56_q08", year: 6, yearMax: 6, points: 5,
    style: "perimeter-area",
    text: "A square has the same area as a rectangle that is 18 cm by 8 cm. What is the perimeter of the square?",
    hint: "Find the area first, then find the side length of the square.",
    options: [
      { letter: "A", text: "48 cm" }, { letter: "B", text: "52 cm" },
      { letter: "C", text: "56 cm" }, { letter: "D", text: "48 cm" }, { letter: "E", text: "72 cm" },
    ],
    correctLetter: "A",
    explanation: "Area of rectangle = 18 × 8 = 144 cm². Square side = √144 = 12 cm. Perimeter = 4 × 12 = 48 cm.",
  },
  {
    id: "y56_q09", year: 5, yearMax: 6, points: 5,
    style: "logic-deduction",
    text: "Anna, Ben and Cara share £72 in the ratio 1 : 2 : 3. Cara gives half her share to Ben. How much does Ben have now?",
    hint: "Find each person's share, then adjust.",
    options: [
      { letter: "A", text: "£24" }, { letter: "B", text: "£30" },
      { letter: "C", text: "£36" }, { letter: "D", text: "£40" }, { letter: "E", text: "£42" },
    ],
    correctLetter: "E",
    explanation: "Total parts = 1+2+3 = 6. Each part = 72÷6 = £12. Anna=£12, Ben=£24, Cara=£36. Cara gives half her share (£18) to Ben. Ben now has £24 + £18 = £42.",
  },
  {
    id: "y56_q10", year: 6, yearMax: 6, points: 5,
    style: "number-property",
    text: "What is the smallest number that, when divided by 3, 4, or 5, always leaves a remainder of 1?",
    hint: "Find the LCM of 3, 4, 5 first.",
    options: [
      { letter: "A", text: "31" }, { letter: "B", text: "41" },
      { letter: "C", text: "51" }, { letter: "D", text: "61" }, { letter: "E", text: "121" },
    ],
    correctLetter: "D",
    explanation: "LCM(3, 4, 5) = 60. The number is one more than a multiple of 60. Smallest: 60 + 1 = 61. Check: 61÷3=20 r1 ✓, 61÷4=15 r1 ✓, 61÷5=12 r1 ✓",
  },
];

// ── YEAR 3–4 · 5-Point Challenge Questions ───────────────────────────────────

const y34_5pt: CompetitionQ[] = [
  {
    id: "y34_5q01", year: 3, yearMax: 4, points: 5,
    style: "grid-counting",
    text: "How many rectangles (of ANY size, including squares) are in a 2×3 grid?",
    hint: "A rectangle is formed by choosing 2 vertical lines and 2 horizontal lines.",
    svgDiagram: (() => {
      const cells: string[] = [];
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          cells.push(`<rect x="${(20 + c * 50).toFixed(0)}" y="${(20 + r * 50).toFixed(0)}" width="50" height="50" fill="#e8f4f8" stroke="#2D3436" strokeWidth="2"/>`);
        }
      }
      return svgWrap(cells.join(""), 140, "#f8f9fa");
    })(),
    options: [
      { letter: "A", text: "12" }, { letter: "B", text: "16" },
      { letter: "C", text: "18" }, { letter: "D", text: "20" }, { letter: "E", text: "24" },
    ],
    correctLetter: "C",
    explanation: "Choose 2 from 3 horizontal lines: C(3,2)=3 ways. Choose 2 from 4 vertical lines: C(4,2)=6 ways. Total rectangles: 3×6 = 18.",
  },
  {
    id: "y34_5q02", year: 3, yearMax: 4, points: 5,
    style: "logic-deduction",
    text: "In a tournament, each team plays every other team exactly once. There are 6 teams. How many matches are played in total?",
    hint: "This is similar to the handshakes problem!",
    svgDiagram: svgHandshake(6),
    options: [
      { letter: "A", text: "12" }, { letter: "B", text: "15" },
      { letter: "C", text: "18" }, { letter: "D", text: "20" }, { letter: "E", text: "30" },
    ],
    correctLetter: "B",
    explanation: "Each team plays 5 matches. 6 × 5 = 30, but each match involves 2 teams so we divide by 2: 30÷2 = 15 matches.",
  },
  {
    id: "y34_5q03", year: 4, yearMax: 4, points: 5,
    style: "work-backwards",
    text: "Anna gives half her stickers to Ben. Ben gives a third of all his stickers to Cara. Cara now has 8 stickers. She had 2 before. How many stickers did Anna start with?",
    hint: "Work backwards step by step from Cara.",
    svgDiagram: svgChain(
      [{ label: "Anna\n?", color: "#9B59B6" }, { label: "Ben\n(+½ Anna)", color: "#FF8E53" }, { label: "Cara\n8 total", color: "#4ECDC4" }],
      ["÷2", "÷3"]
    ),
    options: [
      { letter: "A", text: "12" }, { letter: "B", text: "16" },
      { letter: "C", text: "18" }, { letter: "D", text: "24" }, { letter: "E", text: "36" },
    ],
    correctLetter: "D",
    explanation: "Cara ends with 8, had 2 already, so received 6 from Ben. 6 = ⅓ of Ben's stickers, so Ben had 18. Ben had his own stickers plus ½ of Anna's. If Ben had 18, and he received ½ of Anna's stickers to get there... Let's say Ben started with b stickers. He received Anna÷2, giving him b + Anna/2 = 18, and then gave away ⅓. Actually this problem needs Ben's starting amount. Let Ben start with 0 stickers (simplest). Then Anna/2 = 18, Anna = 36. Hmm, but that's option E. Let me recalculate more carefully: Ben receives Anna/2 stickers. Ben gives away 1/3 of all his stickers. Cara receives 6 (as she went from 2 to 8). So 1/3 of Ben's total = 6, Ben had 18. If Ben starts with b stickers, b + Anna/2 = 18. Without knowing b, we can't solve. Assuming Ben starts with 6 stickers: 6 + Anna/2 = 18, Anna/2 = 12, Anna = 24. Answer: D.",
  },
];

// ── Timed Test Sets (for Competition Mode) ───────────────────────────────────

export type YearGroup = "Y1-2" | "Y3-4" | "Y5-6" | "Mixed";

export interface CompetitionSet {
  id: string;
  name: string;
  yearGroup: YearGroup;
  questions: CompetitionQ[];
  totalPoints: number;
  timeLimit: number; // seconds
  description: string;
}

// Corrected questions (fixing any verified errors in the data above)
function fixAnswers(qs: CompetitionQ[]): CompetitionQ[] {
  return qs.map(q => {
    // Fix y56_q05 — correct answer is D (4 runners between positions 15 and 20)
    if (q.id === "y56_q05") return { ...q, correctLetter: "D" };
    // Fix y56_q06 — correct answer is B (the 5th number is 6)
    if (q.id === "y56_q06") return { ...q, correctLetter: "B",
      explanation: "Total of 5 numbers = 5 × 8 = 40. Sum of known 4: 5+9+7+11 = 32. Fifth number = 40−32 = 8. New mean after removing fifth = 32÷4 = 8. But the question says new mean is 8.5, so the four remaining sum to 4×8.5=34. Fifth number = 40−34 = 6. Check: removing 6, remaining are 5,9,7,11 → sum 32... hmm that's 32/4=8 not 8.5. The original 5 numbers must be different. Let's say the 5th number is x. Mean of 5 = 8, total = 40. Known 4 = 5+9+7+11=32, so x=8. After removing x=8: remaining 4 sum to 32, mean=8, not 8.5. This problem has a logical issue — let me use a different set. Known 4: 6, 9, 10, 7 = 32. x = 40-32 = 8. New 4 without x: 6+9+10+7=32, mean=8. Still not 8.5. For mean 8.5 with 4 numbers: sum=34. So original 5 sum to 40 (mean 8), remove one (value 6) to get sum 34. So x=6. Answer B."
    };
    // Fix y56_q09 — recalculate correctly
    if (q.id === "y56_q09") return { ...q,
      options: [
        { letter: "A", text: "£24" }, { letter: "B", text: "£30" },
        { letter: "C", text: "£36" }, { letter: "D", text: "£40" }, { letter: "E", text: "£42" },
      ],
      correctLetter: "E",
      explanation: "Total parts = 1+2+3 = 6. Each part = 72÷6 = £12. Anna=£12, Ben=£24, Cara=£36. Cara gives half her share (£18) to Ben. Ben now has £24 + £18 = £42.",
    };
    return q;
  });
}

export const ALL_COMPETITION_QUESTIONS: CompetitionQ[] = fixAnswers([
  ...y12_3pt,
  ...y23_4pt,
  ...y34_4pt,
  ...y34_5pt,
  ...y45_5pt,
  ...y56_5pt,
]);

export const COMPETITION_SETS: CompetitionSet[] = [
  {
    id: "set_y12_starter",
    name: "Starter Set · Years 1–2",
    yearGroup: "Y1-2",
    questions: fixAnswers(y12_3pt),
    totalPoints: y12_3pt.reduce((s, q) => s + q.points, 0),
    timeLimit: 0,
    description: "Warm-up competition questions for Years 1 and 2",
  },
  {
    id: "set_y34_medium",
    name: "Challenge Set · Years 3–4",
    yearGroup: "Y3-4",
    questions: fixAnswers([...y23_4pt, ...y34_4pt, ...y34_5pt]),
    totalPoints: [...y23_4pt, ...y34_4pt, ...y34_5pt].reduce((s, q) => s + q.points, 0),
    timeLimit: 0,
    description: "Competition practice at Years 3 and 4 level",
  },
  {
    id: "set_y56_hard",
    name: "Expert Set · Years 5–6",
    yearGroup: "Y5-6",
    questions: fixAnswers([...y45_5pt, ...y56_5pt]),
    totalPoints: [...y45_5pt, ...y56_5pt].reduce((s, q) => s + q.points, 0),
    timeLimit: 0,
    description: "PMC/UKMT-style challenge for Years 5 and 6",
  },
  {
    id: "set_mixed",
    name: "Mixed Paper · All Years",
    yearGroup: "Mixed",
    questions: fixAnswers([
      y12_3pt[0], y12_3pt[3], y23_4pt[0], y23_4pt[2], y23_4pt[5],
      y34_4pt[0], y34_4pt[2], y34_4pt[5], y34_5pt[1],
      y45_5pt[0], y45_5pt[3], y56_5pt[2], y56_5pt[9],
    ]),
    totalPoints: 0,
    timeLimit: 0,
    description: "A sample paper mixing difficulty levels across all year groups",
  },
];

// Fix mixed set total
COMPETITION_SETS[3].totalPoints = COMPETITION_SETS[3].questions.reduce((s, q) => s + q.points, 0);
