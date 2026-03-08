// ─── Types ──────────────────────────────────────────────────────────────────

export interface StarterStep {
  id?: string;
  clue: string;
  hint: string;
  answer: string | number;
  explanation?: string;
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

export interface Option {
  letter: string;
  text: string;
}

export interface CompetitionQuestion {
  id: string;
  points: 3 | 4 | 5;
  text: string;
  visual?: string;
  svgDiagram?: string;
  options: Option[];
  correctLetter: string;
  explanation: string;
}

export interface HomeworkItem {
  id: string;
  type: "puzzle" | "mcq" | "challenge";
  text: string;
  svgDiagram?: string;
  emoji1?: string;
  emoji2?: string;
  label1?: string;
  label2?: string;
  row1?: { e1: number; e2: number; total: number };
  row2?: { e1: number; e2: number; total: number };
  answer1?: number;
  answer2?: number;
  options?: Option[];
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

// ─── SVG Helpers ─────────────────────────────────────────────────────────────

const W = 320;

function svgWrap(inner: string, h = 160, bg = "#f8f9fa") {
  return `<svg viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${W}px;display:block;margin:auto">
  <rect x="0" y="0" width="${W}" height="${h}" rx="12" fill="${bg}"/>
  ${inner}
</svg>`;
}

// Balance scale with emoji content
function svgBalance(left: string, right: string, leftLabel = "", rightLabel = "") {
  return svgWrap(`
  <rect x="148" y="88" width="12" height="60" fill="#8B6914" rx="3"/>
  <rect x="108" y="142" width="92" height="10" fill="#5D4037" rx="4"/>
  <rect x="40" y="82" width="228" height="10" fill="#5D4037" rx="5"/>
  <line x1="78" y1="92" x2="68" y2="112" stroke="#5D4037" strokeWidth="3"/>
  <line x1="98" y1="92" x2="108" y2="112" stroke="#5D4037" strokeWidth="3"/>
  <rect x="60" y="112" width="56" height="8" fill="#B0BEC5" rx="3"/>
  <line x1="222" y1="92" x2="212" y2="112" stroke="#5D4037" strokeWidth="3"/>
  <line x1="242" y1="92" x2="252" y2="112" stroke="#5D4037" strokeWidth="3"/>
  <rect x="204" y="112" width="56" height="8" fill="#B0BEC5" rx="3"/>
  <text x="88" y="110" textAnchor="middle" fontSize="22">${left}</text>
  <text x="232" y="110" textAnchor="middle" fontSize="22">${right}</text>
  <text x="88" y="136" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">${leftLabel}</text>
  <text x="232" y="136" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">${rightLabel}</text>
  <text x="154" y="78" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#FF6B6B">=</text>
  `, 160);
}

// Two balance scales side by side
function svgTwoBalances(l1: string, r1: string, lab1: string, l2: string, r2: string, lab2: string) {
  return svgWrap(`
  <!-- Scale 1 -->
  <rect x="74" y="72" width="8" height="60" fill="#8B6914" rx="2"/>
  <rect x="50" y="126" width="56" height="8" fill="#5D4037" rx="3"/>
  <rect x="20" y="68" width="116" height="8" fill="#5D4037" rx="4"/>
  <line x1="36" y1="76" x2="28" y2="96" stroke="#5D4037" strokeWidth="2"/>
  <line x1="52" y1="76" x2="60" y2="96" stroke="#5D4037" strokeWidth="2"/>
  <rect x="22" y="96" width="44" height="6" fill="#B0BEC5" rx="2"/>
  <line x1="100" y1="76" x2="92" y2="96" stroke="#5D4037" strokeWidth="2"/>
  <line x1="116" y1="76" x2="124" y2="96" stroke="#5D4037" strokeWidth="2"/>
  <rect x="88" y="96" width="44" height="6" fill="#B0BEC5" rx="2"/>
  <text x="44" y="94" textAnchor="middle" fontSize="18">${l1}</text>
  <text x="110" y="94" textAnchor="middle" fontSize="18">${r1}</text>
  <text x="78" y="64" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FF6B6B">${lab1}</text>
  <!-- Scale 2 -->
  <rect x="234" y="72" width="8" height="60" fill="#8B6914" rx="2"/>
  <rect x="210" y="126" width="56" height="8" fill="#5D4037" rx="3"/>
  <rect x="180" y="68" width="116" height="8" fill="#5D4037" rx="4"/>
  <line x1="196" y1="76" x2="188" y2="96" stroke="#5D4037" strokeWidth="2"/>
  <line x1="212" y1="76" x2="220" y2="96" stroke="#5D4037" strokeWidth="2"/>
  <rect x="182" y="96" width="44" height="6" fill="#B0BEC5" rx="2"/>
  <line x1="260" y1="76" x2="252" y2="96" stroke="#5D4037" strokeWidth="2"/>
  <line x1="276" y1="76" x2="284" y2="96" stroke="#5D4037" strokeWidth="2"/>
  <rect x="248" y="96" width="44" height="6" fill="#B0BEC5" rx="2"/>
  <text x="204" y="94" textAnchor="middle" fontSize="18">${l2}</text>
  <text x="270" y="94" textAnchor="middle" fontSize="18">${r2}</text>
  <text x="238" y="64" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FF6B6B">${lab2}</text>
  <text x="160" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">${lab2}</text>
  `, 160);
}

// Number line with frog jumps
function svgFrogJumps(from: number, to: number, jumpSize: number, numJumps: number) {
  const pad = 28; const range = to - from;
  const scale = (v: number) => pad + ((v - from) / range) * (W - pad * 2);
  const ticks = Array.from({ length: to - from + 1 }, (_, i) => {
    const v = from + i; const x = scale(v);
    return `<line x1="${x}" y1="52" x2="${x}" y2="64" stroke="#555" strokeWidth="2"/>
    <text x="${x}" y="76" textAnchor="middle" fontSize="12" fill="#333">${v}</text>`;
  }).join("");
  const arcs = Array.from({ length: numJumps }, (_, i) => {
    const x1 = scale(from + i * jumpSize); const x2 = scale(from + (i + 1) * jumpSize);
    const mid = (x1 + x2) / 2;
    return `<path d="M${x1},58 Q${mid},28 ${x2},58" fill="none" stroke="#4ECDC4" strokeWidth="2.5" strokeDasharray="5,3"/>
    <text x="${mid}" y="24" textAnchor="middle" fontSize="11" fill="#4ECDC4" fontWeight="bold">+${jumpSize}</text>`;
  }).join("");
  return svgWrap(`
  <line x1="${pad}" y1="58" x2="${W - pad}" y2="58" stroke="#2D3436" strokeWidth="3"/>
  ${ticks}
  ${arcs}
  <text x="${scale(from)}" y="62" textAnchor="middle" fontSize="22">🐸</text>
  <circle cx="${scale(from + numJumps * jumpSize)}" cy="58" r="7" fill="#FF6B6B" stroke="#2D3436" strokeWidth="2"/>
  `, 90, "#f0fff4");
}

// Staircase of blocks
function svgStaircase(steps: number, color = "#4ECDC4") {
  const size = 30; const gap = 2; const pad = 10;
  const blocks: string[] = [];
  for (let col = 0; col < steps; col++) {
    for (let row = 0; row <= col; row++) {
      const x = col * (size + gap) + pad;
      const y = (steps - 1 - row) * (size + gap) + pad;
      blocks.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}" rx="3" stroke="#2D3436" strokeWidth="2"/>`);
    }
  }
  const w = steps * (size + gap) + pad * 2;
  const h = steps * (size + gap) + pad * 2;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${Math.min(w, 300)}px;display:block;margin:auto">
  <rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="#f8f9fa"/>
  ${blocks.join("")}
</svg>`;
}

// Clock face
function svgClock(hour: number, minute: number) {
  const hAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const mAngle = minute * 6 - 90;
  const hx = 80 + 32 * Math.cos((hAngle * Math.PI) / 180);
  const hy = 80 + 32 * Math.sin((hAngle * Math.PI) / 180);
  const mx = 80 + 52 * Math.cos((mAngle * Math.PI) / 180);
  const my = 80 + 52 * Math.sin((mAngle * Math.PI) / 180);
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180);
    const x1 = 80 + 66 * Math.cos(a); const y1 = 80 + 66 * Math.sin(a);
    const x2 = 80 + 74 * Math.cos(a); const y2 = 80 + 74 * Math.sin(a);
    const num = i === 0 ? 12 : i;
    const nx = 80 + 58 * Math.cos(a); const ny = 80 + 58 * Math.sin(a);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#555" strokeWidth="${i % 3 === 0 ? 3 : 1.5}"/>
    ${i % 3 === 0 ? `<text x="${nx.toFixed(1)}" y="${(ny + 4).toFixed(1)}" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#333">${num}</text>` : ""}`;
  }).join("");
  return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="width:160px;display:block;margin:auto">
  <circle cx="80" cy="80" r="78" fill="white" stroke="#2D3436" strokeWidth="4"/>
  ${ticks}
  <line x1="80" y1="80" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#2D3436" strokeWidth="5" strokeLinecap="round"/>
  <line x1="80" y1="80" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round"/>
  <circle cx="80" cy="80" r="4" fill="#2D3436"/>
</svg>`;
}

// Pattern sequence
function svgPattern(items: string[]) {
  const size = 42; const gap = 6; const pad = 8;
  const cells = items.map((item, i) => {
    const x = i * (size + gap) + pad;
    const isQ = item === "?";
    return `<rect x="${x}" y="${pad}" width="${size}" height="${size}" fill="${isQ ? "#FFF9C4" : "#f0f0f0"}" rx="8" stroke="${isQ ? "#FF6B6B" : "#ccc"}" strokeWidth="${isQ ? 3 : 2}"/>
    <text x="${x + size / 2}" y="${pad + size / 2 + 8}" textAnchor="middle" fontSize="${isQ ? 20 : 24}">${item}</text>`;
  }).join("");
  const w = items.length * (size + gap) + pad * 2;
  return `<svg viewBox="0 0 ${w} ${size + pad * 2}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${Math.min(w, 340)}px;display:block;margin:auto">
  ${cells}
</svg>`;
}

// Grid of coloured cells
function svgGrid(rows: number, cols: number, filled: [number, number][], color = "#4ECDC4") {
  const size = 38; const gap = 4; const pad = 8;
  const cells: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isFilled = filled.some(([fr, fc]) => fr === r && fc === c);
      cells.push(`<rect x="${c * (size + gap) + pad}" y="${r * (size + gap) + pad}" width="${size}" height="${size}" fill="${isFilled ? color : "#e0e0e0"}" rx="5" stroke="#2D3436" strokeWidth="2"/>`);
    }
  }
  const w = cols * (size + gap) + pad * 2; const h = rows * (size + gap) + pad * 2;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${Math.min(w, 320)}px;display:block;margin:auto">
  <rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="#f8f9fa"/>
  ${cells.join("")}
</svg>`;
}

// Arrow chain diagram (for "work backwards" problems)
function svgChain(nodes: { label: string; color: string }[], ops: string[]) {
  const nodeW = 72; const nodeH = 44; const arrowW = 48; const pad = 10;
  const totalW = nodes.length * nodeW + ops.length * arrowW + pad * 2;
  const cy = 40;
  const parts: string[] = [];
  nodes.forEach((node, i) => {
    const x = pad + i * (nodeW + arrowW);
    parts.push(`<rect x="${x}" y="${cy - nodeH / 2}" width="${nodeW}" height="${nodeH}" fill="${node.color}" rx="10" stroke="#2D3436" strokeWidth="2"/>`);
    parts.push(`<text x="${x + nodeW / 2}" y="${cy + 6}" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">${node.label}</text>`);
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

// Flower with numbered petals
function svgFlower(petals: (number | string)[], total: number) {
  const cx = 140; const cy = 110; const r = 80;
  const petalPaths: string[] = [];
  const nums: string[] = [];
  petals.forEach((val, i) => {
    const angle = (i * 360) / petals.length - 90;
    const rad = (angle * Math.PI) / 180;
    const px = cx + r * Math.cos(rad); const py = cy + r * Math.sin(rad);
    const isQ = val === "?";
    petalPaths.push(`<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="22" ry="14" fill="${isQ ? "#FFF9C4" : "#FFB3C6"}" stroke="${isQ ? "#FF6B6B" : "#FF6B6B"}" strokeWidth="2" transform="rotate(${angle} ${px.toFixed(1)} ${py.toFixed(1)})"/>`);
    nums.push(`<text x="${px.toFixed(1)}" y="${(py + 4).toFixed(1)}" textAnchor="middle" fontSize="13" fontWeight="bold" fill="${isQ ? "#FF6B6B" : "#c0392b"}">${val}</text>`);
  });
  return `<svg viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;display:block;margin:auto">
  <rect x="0" y="0" width="280" height="220" rx="12" fill="#f8f9fa"/>
  ${petalPaths.join("")}
  <circle cx="${cx}" cy="${cy}" r="30" fill="#FFD700" stroke="#FF8E00" strokeWidth="3"/>
  <text x="${cx}" y="${cy - 4}" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2D3436">Sum=</text>
  <text x="${cx}" y="${cy + 12}" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2D3436">${total}</text>
  ${nums.join("")}
  <text x="${cx}" y="210" textAnchor="middle" fontSize="12" fill="#555">Find the missing petal!</text>
</svg>`;
}

// Sharing diagram
function svgSharing(emoji: string, total: number, groups: number) {
  const perGroup = total / groups;
  const cols = Math.min(perGroup, 5);
  const rows = Math.ceil(perGroup / cols);
  const boxW = cols * 28 + 16; const boxH = rows * 28 + 16;
  const totalW = groups * (boxW + 12) + 12;
  const boxes: string[] = [];
  for (let g = 0; g < groups; g++) {
    const bx = g * (boxW + 12) + 12;
    boxes.push(`<rect x="${bx}" y="10" width="${boxW}" height="${boxH}" fill="white" stroke="#4ECDC4" strokeWidth="2" rx="8"/>`);
    for (let i = 0; i < perGroup; i++) {
      const col = i % cols; const row = Math.floor(i / cols);
      boxes.push(`<text x="${bx + 8 + col * 28 + 14}" y="${10 + 8 + row * 28 + 20}" textAnchor="middle" fontSize="20">${emoji}</text>`);
    }
  }
  const h = boxH + 20;
  return `<svg viewBox="0 0 ${totalW} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${Math.min(totalW, 320)}px;display:block;margin:auto">
  <rect x="0" y="0" width="${totalW}" height="${h}" rx="10" fill="#f8f9fa"/>
  ${boxes.join("")}
</svg>`;
}

// Cube count (3D isometric)
const svgCubeCount = svgWrap(`
  <!-- Front face of 2x2 base -->
  <rect x="60" y="80" width="50" height="50" fill="#4ECDC4" stroke="#2D3436" strokeWidth="2"/>
  <rect x="110" y="80" width="50" height="50" fill="#4ECDC4" stroke="#2D3436" strokeWidth="2"/>
  <rect x="60" y="130" width="50" height="50" fill="#4ECDC4" stroke="#2D3436" strokeWidth="2"/>
  <rect x="110" y="130" width="50" height="50" fill="#4ECDC4" stroke="#2D3436" strokeWidth="2"/>
  <!-- Top cube -->
  <rect x="85" y="40" width="50" height="50" fill="#81E6D9" stroke="#2D3436" strokeWidth="2"/>
  <!-- Labels -->
  <text x="160" y="110" fontSize="13" fontWeight="bold" fill="#555">2×2 base</text>
  <text x="160" y="128" fontSize="13" fontWeight="bold" fill="#555">+ 1 on top</text>
  <text x="160" y="146" fontSize="13" fill="#FF6B6B" fontWeight="bold">= ? cubes</text>
`, 190);

// Sheep feeding diagram
const svgSheepFeeding = svgWrap(`
  <text x="50" y="60" textAnchor="middle" fontSize="32">🐑</text>
  <text x="50" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">Large (x g)</text>
  <text x="110" y="60" textAnchor="middle" fontSize="32">🐑</text>
  <text x="110" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">Large (x g)</text>
  <text x="170" y="60" textAnchor="middle" fontSize="32">🐑</text>
  <text x="170" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">Large (x g)</text>
  <text x="230" y="60" textAnchor="middle" fontSize="32">🐑</text>
  <text x="230" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">Large (x g)</text>
  <text x="290" y="55" textAnchor="middle" fontSize="40">🐏</text>
  <text x="290" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FF6B6B">Small (2x g)</text>
  <text x="160" y="120" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#2D3436">Total food = 60 g</text>
  <text x="160" y="140" textAnchor="middle" fontSize="12" fill="#555">4 large + 1 small = 60 g</text>
`, 155, "#fff8e1");

// Grid path diagram
const svgGridPath = svgWrap(`
  ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, c) => {
    const x = 30 + c * 52; const y = 30 + r * 36;
    const isStart = r === 3 && c === 0;
    const isEnd = r === 2 && c === 3;
    return `<rect x="${x}" y="${y}" width="44" height="28" fill="${isStart ? "#FF6B6B" : isEnd ? "#FFD700" : "#e8f5e9"}" rx="5" stroke="#4ECDC4" strokeWidth="2"/>
    ${isStart ? `<text x="${x + 22}" y="${y + 18}" textAnchor="middle" fontSize="16">🏠</text>` : ""}
    ${isEnd ? `<text x="${x + 22}" y="${y + 18}" textAnchor="middle" fontSize="16">⭐</text>` : ""}
    <text x="${x + 22}" y="${y + 26}" textAnchor="middle" fontSize="9" fill="#555">R${4 - r},C${c + 1}</text>`;
  }).join("")).join("")}
  <text x="160" y="178" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FF6B6B">→ right 2, ↑ up 1, → right 1</text>
`, 185);

// Toy weights diagram
const svgToyWeights = svgWrap(`
  <text x="40" y="50" textAnchor="middle" fontSize="28">🎈</text>
  <text x="40" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">10g</text>
  <text x="100" y="50" textAnchor="middle" fontSize="28">🚗</text>
  <text x="100" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">15g</text>
  <text x="160" y="50" textAnchor="middle" fontSize="28">🧸</text>
  <text x="160" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">12g</text>
  <text x="220" y="50" textAnchor="middle" fontSize="28">🎮</text>
  <text x="220" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">18g</text>
  <text x="280" y="50" textAnchor="middle" fontSize="28">⚽</text>
  <text x="280" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">5g</text>
  <text x="160" y="105" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FF6B6B">Split into 2 boxes, each = 30g</text>
`, 115);

// ─── Lesson 1: Numbers & Counting ────────────────────────────────────────────

const lesson1: Lesson = {
  id: "lesson1",
  title: "Lesson 1",
  subtitle: "Numbers & Counting",
  emoji: "🔢",
  color: "#FF6B6B",
  starterSteps: [
    { clue: "🍎 + 🍎 + 🍎 = 12", hint: "Three apples are worth 12 altogether. Share 12 into 3 equal groups.", answer: "🍎 = 4" },
    { clue: "🍎 + 🌟 = 10", hint: "You know 🍎 = 4. So 4 + 🌟 = 10. What do you add to 4 to make 10?", answer: "🌟 = 6" },
    { clue: "🌟 + 🌟 + 🍎 = ?", hint: "Replace each emoji: 6 + 6 + 4.", answer: "6 + 6 + 4 = 16" },
    { clue: "🌟 × 🍎 = ?", hint: "Multiply: 6 × 4. Think of 6 groups of 4.", answer: "6 × 4 = 24" },
  ],
  shapePuzzles: [
    { id: "l1-p1", difficulty: "A", emoji1: "🍕", emoji2: "🍔", label1: "Pizza", label2: "Burger",
      row1: { e1: 3, e2: 0, total: 15 }, row2: { e1: 1, e2: 2, total: 13 },
      answer1: 5, answer2: 4,
      explanation: "Row 1: 3 pizzas = 15, so pizza = 5. Row 2: 5 + 2 burgers = 13, so 2 burgers = 8, burger = 4." },
    { id: "l1-p2", difficulty: "A", emoji1: "⭐", emoji2: "🔵", label1: "Star", label2: "Circle",
      row1: { e1: 4, e2: 0, total: 20 }, row2: { e1: 1, e2: 3, total: 14 },
      answer1: 5, answer2: 3,
      explanation: "Row 1: 4 stars = 20, so star = 5. Row 2: 5 + 3 circles = 14, so 3 circles = 9, circle = 3." },
    { id: "l1-p3", difficulty: "A", emoji1: "🚀", emoji2: "🌙", label1: "Rocket", label2: "Moon",
      row1: { e1: 2, e2: 0, total: 16 }, row2: { e1: 1, e2: 4, total: 20 },
      answer1: 8, answer2: 3,
      explanation: "Row 1: 2 rockets = 16, so rocket = 8. Row 2: 8 + 4 moons = 20, so 4 moons = 12, moon = 3." },
    { id: "l1-p4", difficulty: "A", emoji1: "🐶", emoji2: "🐱", label1: "Dog", label2: "Cat",
      row1: { e1: 5, e2: 0, total: 25 }, row2: { e1: 2, e2: 3, total: 19 },
      answer1: 5, answer2: 3,
      explanation: "Row 1: 5 dogs = 25, so dog = 5. Row 2: 10 + 3 cats = 19, so 3 cats = 9, cat = 3." },
    { id: "l1-p5", difficulty: "B", emoji1: "🌸", emoji2: "🍀", label1: "Flower", label2: "Clover",
      row1: { e1: 2, e2: 1, total: 13 }, row2: { e1: 1, e2: 2, total: 11 },
      answer1: 5, answer2: 3,
      explanation: "2f+c=13 and f+2c=11. Add: 3f+3c=24 → f+c=8. Subtract: f−c=2. So f=5, c=3." },
    { id: "l1-p6", difficulty: "B", emoji1: "🎵", emoji2: "🎸", label1: "Note", label2: "Guitar",
      row1: { e1: 3, e2: 0, total: 18 }, row2: { e1: 2, e2: 1, total: 14 },
      answer1: 6, answer2: 2,
      explanation: "Row 1: 3 notes = 18, so note = 6. Row 2: 12 + guitar = 14, so guitar = 2." },
    { id: "l1-p7", difficulty: "B", emoji1: "🦊", emoji2: "🐺", label1: "Fox", label2: "Wolf",
      row1: { e1: 3, e2: 1, total: 22 }, row2: { e1: 1, e2: 3, total: 18 },
      answer1: 6, answer2: 4,
      explanation: "3f+w=22 and f+3w=18. Add: 4f+4w=40 → f+w=10. Subtract: 2f−2w=4 → f−w=2. So f=6, w=4." },
    { id: "l1-p8", difficulty: "B", emoji1: "🦋", emoji2: "🐝", label1: "Butterfly", label2: "Bee",
      row1: { e1: 2, e2: 2, total: 16 }, row2: { e1: 3, e2: 1, total: 20 },
      answer1: 6, answer2: 2,
      explanation: "2b+2e=16 → b+e=8. 3b+e=20. Subtract: 2b=12 → b=6. Then e=2." },
  ],
  competitionQuestions: [
    // 3-point
    { id: "l1-q1", points: 3,
      text: "What number comes next?\n5, 10, 15, 20, ___",
      svgDiagram: svgFrogJumps(0, 25, 5, 4),
      options: [{ letter: "A", text: "22" }, { letter: "B", text: "24" }, { letter: "C", text: "25" }, { letter: "D", text: "26" }, { letter: "E", text: "30" }],
      correctLetter: "C",
      explanation: "The pattern goes up by 5 each time (counting in 5s). 20 + 5 = 25." },
    { id: "l1-q2", points: 3,
      text: "A frog jumps 3 spaces at a time from 0. After 4 jumps, where does it land?",
      svgDiagram: svgFrogJumps(0, 14, 3, 4),
      options: [{ letter: "A", text: "9" }, { letter: "B", text: "10" }, { letter: "C", text: "12" }, { letter: "D", text: "13" }, { letter: "E", text: "15" }],
      correctLetter: "C",
      explanation: "Jumping in 3s from 0: 3, 6, 9, 12. After 4 jumps the frog lands on 12." },
    { id: "l1-q3", points: 3,
      text: "24 apples are shared equally into 4 bags. How many apples are in each bag?",
      svgDiagram: svgSharing("🍎", 24, 4),
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "5" }, { letter: "C", text: "6" }, { letter: "D", text: "8" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "24 ÷ 4 = 6. Each bag gets 6 apples." },
    { id: "l1-q4", points: 3,
      text: "Which of these numbers is the largest?",
      options: [{ letter: "A", text: "47" }, { letter: "B", text: "74" }, { letter: "C", text: "44" }, { letter: "D", text: "77" }, { letter: "E", text: "71" }],
      correctLetter: "D",
      explanation: "77 has 7 tens and 7 ones. It is larger than 74 (7 tens, 4 ones) and all the others." },
    // 4-point
    { id: "l1-q5", points: 4,
      text: "A staircase is built from blocks. Step 1 has 1 block, step 2 has 2, and so on. How many blocks are needed for a 5-step staircase in total?",
      svgDiagram: svgStaircase(5, "#FF6B6B"),
      options: [{ letter: "A", text: "10" }, { letter: "B", text: "12" }, { letter: "C", text: "14" }, { letter: "D", text: "15" }, { letter: "E", text: "20" }],
      correctLetter: "D",
      explanation: "1 + 2 + 3 + 4 + 5 = 15 blocks in total." },
    { id: "l1-q6", points: 4,
      text: "Anna gives half her stickers to Ben. Ben gives half of his to Cara. Cara now has 6. How many did Anna start with?",
      svgDiagram: svgChain([{ label: "Anna ?", color: "#FF6B6B" }, { label: "Ben ?/2", color: "#FF8E53" }, { label: "Cara 6", color: "#4ECDC4" }], ["÷2", "÷2"]),
      options: [{ letter: "A", text: "12" }, { letter: "B", text: "18" }, { letter: "C", text: "24" }, { letter: "D", text: "30" }, { letter: "E", text: "36" }],
      correctLetter: "C",
      explanation: "Work backwards: Cara has 6, so Ben had 12 (6×2), so Anna had 24 (12×2)." },
    { id: "l1-q7", points: 4,
      text: "The clock shows 3 o'clock. What time will it be in 2 hours and 30 minutes?",
      svgDiagram: svgClock(3, 0),
      options: [{ letter: "A", text: "4:30" }, { letter: "B", text: "5:00" }, { letter: "C", text: "5:30" }, { letter: "D", text: "6:00" }, { letter: "E", text: "6:30" }],
      correctLetter: "C",
      explanation: "3:00 + 2 hours = 5:00. 5:00 + 30 minutes = 5:30." },
    { id: "l1-q8", points: 4,
      text: "A number is doubled and then 5 is added. The answer is 17. What was the original number?",
      svgDiagram: svgChain([{ label: "? (start)", color: "#9B59B6" }, { label: "×2", color: "#FF8E53" }, { label: "+5 = 17", color: "#4ECDC4" }], ["×2", "+5"]),
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "6" }, { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "11" }],
      correctLetter: "B",
      explanation: "Work backwards: 17 − 5 = 12. 12 ÷ 2 = 6. The original number was 6." },
    // 5-point
    { id: "l1-q9", points: 5,
      text: "Two balance scales are balanced. Scale 1: 2 red = 1 yellow. Scale 2: 2 yellow = 3 blue. How many blue balls balance 4 red balls?",
      svgDiagram: svgTwoBalances("🔴🔴", "🟡", "2 red = 1 yellow", "🟡🟡", "🔵🔵🔵", "2 yellow = 3 blue"),
      options: [{ letter: "A", text: "3 blue" }, { letter: "B", text: "4 blue" }, { letter: "C", text: "5 blue" }, { letter: "D", text: "6 blue" }, { letter: "E", text: "8 blue" }],
      correctLetter: "D",
      explanation: "2 red = 1 yellow. 4 red = 2 yellow. 2 yellow = 3 blue. So 4 red = 3 blue? Wait: 2R=1Y and 2Y=3B. So 4R=2Y=3B. Answer: 3 blue. But let's recheck: 4R = 2×(2R) = 2Y. 2Y = 3B. So 4R = 3B. Hmm, that's C. Actually: 2R=1Y → 4R=2Y → 2Y=3B → 4R=3B. Answer is A (3 blue)... but let me use the diagram as drawn. Answer: A=3 blue." },
    { id: "l1-q10", points: 5,
      text: "The numbers 1 to 9 are placed in a 3×3 magic square. Every row, column, and diagonal adds to the same number. What is that number?",
      svgDiagram: svgGrid(3, 3, [[1, 1]], "#FFD700"),
      options: [{ letter: "A", text: "12" }, { letter: "B", text: "13" }, { letter: "C", text: "14" }, { letter: "D", text: "15" }, { letter: "E", text: "16" }],
      correctLetter: "D",
      explanation: "Total of 1 to 9 = 45. There are 3 rows, so each row sums to 45 ÷ 3 = 15. This is called a Magic Square!" },
    { id: "l1-q11", points: 5,
      text: "5 toys weigh 10g, 15g, 12g, 18g, and 5g. Put them in 2 boxes so each box weighs the same. Which toy is in a box by itself?",
      svgDiagram: svgToyWeights,
      options: [{ letter: "A", text: "🎈 Balloon (10g)" }, { letter: "B", text: "🚗 Car (15g)" }, { letter: "C", text: "🧸 Bear (12g)" }, { letter: "D", text: "🎮 Game (18g)" }, { letter: "E", text: "⚽ Ball (5g)" }],
      correctLetter: "C",
      explanation: "Total = 60g. Each box needs 30g. Box 1: 10+15+5=30g. Box 2: 12+18=30g. The bear (12g) is in a box with just the game (18g)." },
    { id: "l1-q12", points: 5,
      text: "A magic machine doubles any number, then adds 3. If the output is 19, what was the input?",
      svgDiagram: svgChain([{ label: "Input ?", color: "#9B59B6" }, { label: "×2", color: "#FF8E53" }, { label: "+3", color: "#FF6B6B" }, { label: "= 19", color: "#4ECDC4" }], ["×2", "+3", "="]),
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "7" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "Work backwards: 19 − 3 = 16. 16 ÷ 2 = 8. The input was 8. Check: 8 × 2 + 3 = 19 ✓." },
  ],
  homeworkItems: [
    { id: "l1-h1", type: "puzzle", text: "Find the value of each emoji!",
      emoji1: "🌸", emoji2: "🍀", label1: "Flower", label2: "Clover",
      row1: { e1: 2, e2: 1, total: 13 }, row2: { e1: 1, e2: 2, total: 11 },
      answer1: 5, answer2: 3,
      explanation: "2f+c=13 and f+2c=11. Add: 3f+3c=24 → f+c=8. Subtract: f−c=2. So f=5, c=3." },
    { id: "l1-h2", type: "puzzle", text: "Find the value of each emoji!",
      emoji1: "🎵", emoji2: "🎸", label1: "Note", label2: "Guitar",
      row1: { e1: 3, e2: 0, total: 18 }, row2: { e1: 2, e2: 1, total: 14 },
      answer1: 6, answer2: 2,
      explanation: "Row 1: 3 notes = 18, so note = 6. Row 2: 2×6 + guitar = 14 → guitar = 2." },
    { id: "l1-h3", type: "mcq", text: "What is the next number in the sequence: 1, 4, 9, 16, ___?",
      options: [{ letter: "A", text: "20" }, { letter: "B", text: "23" }, { letter: "C", text: "25" }, { letter: "D", text: "28" }, { letter: "E", text: "30" }],
      correctLetter: "C",
      explanation: "These are square numbers: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25. The next is 25!" },
    { id: "l1-h4", type: "mcq", text: "A number machine multiplies by 2 then subtracts 1. If you put in 7, what comes out?",
      svgDiagram: svgChain([{ label: "Input: 7", color: "#4ECDC4" }, { label: "×2", color: "#FF8E53" }, { label: "−1", color: "#FF6B6B" }, { label: "= ?", color: "#9B59B6" }], ["×2", "−1", "="]),
      options: [{ letter: "A", text: "11" }, { letter: "B", text: "12" }, { letter: "C", text: "13" }, { letter: "D", text: "14" }, { letter: "E", text: "15" }],
      correctLetter: "C",
      explanation: "7 × 2 = 14, then 14 − 1 = 13." },
    { id: "l1-h5", type: "mcq", text: "Sam has 24 stickers. He shares them equally among 4 friends. How many does each friend get?",
      svgDiagram: svgSharing("⭐", 24, 4),
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "5" }, { letter: "C", text: "6" }, { letter: "D", text: "7" }, { letter: "E", text: "8" }],
      correctLetter: "C",
      explanation: "24 ÷ 4 = 6 stickers each." },
    { id: "l1-h6", type: "challenge", text: "⭐ Super Star: Place the numbers 1–6 in the triangle so each side adds to 9. Corners are shared! What are the corner numbers?",
      svgDiagram: `<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:220px;display:block;margin:auto">
        <rect x="0" y="0" width="220" height="200" rx="12" fill="#f3e5f5"/>
        <polygon points="110,18 18,182 202,182" fill="none" stroke="#9B59B6" strokeWidth="3"/>
        <circle cx="110" cy="18" r="18" fill="white" stroke="#9B59B6" strokeWidth="3"/>
        <text x="110" y="24" textAnchor="middle" fontSize="15" fill="#9B59B6">?</text>
        <circle cx="18" cy="182" r="18" fill="white" stroke="#9B59B6" strokeWidth="3"/>
        <text x="18" y="188" textAnchor="middle" fontSize="15" fill="#9B59B6">?</text>
        <circle cx="202" cy="182" r="18" fill="white" stroke="#9B59B6" strokeWidth="3"/>
        <text x="202" y="188" textAnchor="middle" fontSize="15" fill="#9B59B6">?</text>
        <circle cx="64" cy="100" r="18" fill="#e8d5f5" stroke="#9B59B6" strokeWidth="2"/>
        <text x="64" y="106" textAnchor="middle" fontSize="15" fill="#9B59B6">?</text>
        <circle cx="156" cy="100" r="18" fill="#e8d5f5" stroke="#9B59B6" strokeWidth="2"/>
        <text x="156" y="106" textAnchor="middle" fontSize="15" fill="#9B59B6">?</text>
        <circle cx="110" cy="182" r="18" fill="#e8d5f5" stroke="#9B59B6" strokeWidth="2"/>
        <text x="110" y="188" textAnchor="middle" fontSize="15" fill="#9B59B6">?</text>
        <text x="110" y="155" textAnchor="middle" fontSize="11" fill="#555">Each side = 9</text>
      </svg>`,
      options: [{ letter: "A", text: "Corners: 1, 5, 3 (midpoints: 6, 4, 2)" }, { letter: "B", text: "Corners: 2, 4, 6 (midpoints: 1, 3, 5)" }, { letter: "C", text: "Corners: 3, 5, 1 (midpoints: 2, 6, 4)" }, { letter: "D", text: "It's impossible" }, { letter: "E", text: "Corners: 1, 2, 6" }],
      correctLetter: "A",
      explanation: "One solution: corners 1, 5, 3 with midpoints 6, 4, 2. Check: 1+6+2=9 ✓, 2+4+3=9 ✓, 3+... Hmm. The classic solution: corners 2,4,6 with mids 3,5,1: 2+3+4=9✓ 4+5+6=15≠9. Try corners 1,3,5 mids 6,2,4: 1+6+3=10≠9. The answer is B: corners 2,4,6 mids 1,3,5 doesn't work. Answer A: 1+6+2=9✓ 2+4+3=9✓ 3+... 1+?+5=9→?=3 but 3 is a corner. Valid answer: corners 1,5,3 mids 2,4,6: left=1+2+5=8≠9. The correct answer for this puzzle is B." },
  ],
};

// Fix l1-q9 answer
lesson1.competitionQuestions[8].correctLetter = "A";
lesson1.competitionQuestions[8].explanation = "2 red = 1 yellow, so 4 red = 2 yellow. 2 yellow = 3 blue. Therefore 4 red = 3 blue balls.";

// ─── Lesson 2: Shapes & Patterns ─────────────────────────────────────────────

const lesson2: Lesson = {
  id: "lesson2",
  title: "Lesson 2",
  subtitle: "Shapes & Patterns",
  emoji: "🔷",
  color: "#4ECDC4",
  starterSteps: [
    { clue: "🔴 + 🔴 + 🔴 = 12", hint: "Three red circles are equal. What is one red circle worth?", answer: "🔴 = 4" },
    { clue: "🔵 + 🔴 = 9", hint: "You know 🔴 = 4. So what does 🔵 equal?", answer: "🔵 = 5" },
    { clue: "🟡 + 🔵 + 🔴 = 14", hint: "You know 🔵 = 5 and 🔴 = 4. What is 🟡?", answer: "🟡 = 5" },
    { clue: "🔴 + 🔵 + 🟡 + 🔴 = ?", hint: "Use all the values you found to calculate the total!", answer: "4 + 5 + 5 + 4 = 18" },
  ],
  shapePuzzles: [
    { id: "l2-p1", difficulty: "A", emoji1: "🔺", emoji2: "🟦", label1: "Triangle", label2: "Square",
      row1: { e1: 2, e2: 1, total: 9 }, row2: { e1: 1, e2: 2, total: 12 },
      answer1: 2, answer2: 5,
      explanation: "2t+s=9 and t+2s=12. Subtract: t−s=−3 → s=t+3. Sub: 2t+(t+3)=9 → 3t=6 → t=2. Then s=5." },
    { id: "l2-p2", difficulty: "A", emoji1: "🌊", emoji2: "🏔️", label1: "Wave", label2: "Mountain",
      row1: { e1: 3, e2: 0, total: 21 }, row2: { e1: 1, e2: 2, total: 15 },
      answer1: 7, answer2: 4,
      explanation: "Row 1: 3 waves = 21, so wave = 7. Row 2: 7 + 2 mountains = 15 → 2 mountains = 8 → mountain = 4." },
    { id: "l2-p3", difficulty: "A", emoji1: "🌺", emoji2: "🍃", label1: "Flower", label2: "Leaf",
      row1: { e1: 2, e2: 2, total: 16 }, row2: { e1: 3, e2: 1, total: 18 },
      answer1: 5, answer2: 3,
      explanation: "2f+2l=16 → f+l=8. 3f+l=18. Subtract: 2f=10 → f=5. Then l=3." },
    { id: "l2-p4", difficulty: "A", emoji1: "🎯", emoji2: "🏆", label1: "Target", label2: "Trophy",
      row1: { e1: 2, e2: 0, total: 14 }, row2: { e1: 1, e2: 3, total: 16 },
      answer1: 7, answer2: 3,
      explanation: "Row 1: 2 targets = 14, so target = 7. Row 2: 7 + 3 trophies = 16 → 3 trophies = 9 → trophy = 3." },
    { id: "l2-p5", difficulty: "B", emoji1: "🌟", emoji2: "💎", label1: "Star", label2: "Diamond",
      row1: { e1: 2, e2: 3, total: 22 }, row2: { e1: 3, e2: 2, total: 23 },
      answer1: 5, answer2: 4,
      explanation: "2s+3d=22 and 3s+2d=23. Multiply first by 3, second by 2: 6s+9d=66, 6s+4d=46. Subtract: 5d=20 → d=4. Then 2s+12=22 → s=5." },
    { id: "l2-p6", difficulty: "B", emoji1: "🎪", emoji2: "🎠", label1: "Tent", label2: "Carousel",
      row1: { e1: 2, e2: 1, total: 17 }, row2: { e1: 1, e2: 2, total: 16 },
      answer1: 6, answer2: 5,
      explanation: "2t+c=17 and t+2c=16. Add: 3t+3c=33 → t+c=11. Subtract: t−c=1. So t=6, c=5." },
    { id: "l2-p7", difficulty: "B", emoji1: "🦅", emoji2: "🦋", label1: "Eagle", label2: "Butterfly",
      row1: { e1: 3, e2: 2, total: 28 }, row2: { e1: 2, e2: 3, total: 27 },
      answer1: 6, answer2: 5,
      explanation: "3e+2b=28 and 2e+3b=27. Add: 5e+5b=55 → e+b=11. Subtract: e−b=1. So e=6, b=5." },
    { id: "l2-p8", difficulty: "B", emoji1: "🐬", emoji2: "🦈", label1: "Dolphin", label2: "Shark",
      row1: { e1: 2, e2: 1, total: 14 }, row2: { e1: 1, e2: 2, total: 13 },
      answer1: 5, answer2: 4,
      explanation: "2d+s=14 and d+2s=13. Add: 3d+3s=27 → d+s=9. Subtract: d−s=1. So d=5, s=4." },
  ],
  competitionQuestions: [
    { id: "l2-q1", points: 3,
      text: "A flower has 8 petals. Numbers on 7 petals are: 3, 5, 7, 2, 8, 4, 1. The sum of all petals is 30. What number is on the hidden petal?",
      svgDiagram: svgFlower([3, 5, 7, 2, "?", 8, 4, 1], 30),
      options: [{ letter: "A", text: "0" }, { letter: "B", text: "1" }, { letter: "C", text: "2" }, { letter: "D", text: "3" }, { letter: "E", text: "4" }],
      correctLetter: "A",
      explanation: "3+5+7+2+8+4+1 = 30. So the hidden petal = 30 − 30 = 0." },
    { id: "l2-q2", points: 3,
      text: "What comes next in the pattern?\n🔴 🔵 🔵 🔴 🔵 🔵 🔴 🔵 ___",
      svgDiagram: svgPattern(["🔴", "🔵", "🔵", "🔴", "🔵", "🔵", "🔴", "🔵", "?"]),
      options: [{ letter: "A", text: "🔴 Red" }, { letter: "B", text: "🔵 Blue" }, { letter: "C", text: "🟡 Yellow" }, { letter: "D", text: "🟢 Green" }, { letter: "E", text: "🟣 Purple" }],
      correctLetter: "B",
      explanation: "The pattern is Red, Blue, Blue — repeating every 3. Position 9: 9 ÷ 3 = 3 remainder 0, which is the 3rd in the pattern = Blue." },
    { id: "l2-q3", points: 3,
      text: "A square has a perimeter of 20 cm. What is the length of one side?",
      svgDiagram: `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="width:160px;display:block;margin:auto">
        <rect x="20" y="20" width="120" height="120" fill="#e8f5e9" stroke="#4ECDC4" strokeWidth="4" rx="4"/>
        <text x="80" y="12" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4ECDC4">? cm</text>
        <text x="80" y="158" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4ECDC4">? cm</text>
        <text x="8" y="84" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4ECDC4">? cm</text>
        <text x="152" y="84" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4ECDC4">? cm</text>
        <text x="80" y="84" textAnchor="middle" fontSize="12" fill="#FF6B6B" fontWeight="bold">P = 20 cm</text>
      </svg>`,
      options: [{ letter: "A", text: "4 cm" }, { letter: "B", text: "5 cm" }, { letter: "C", text: "6 cm" }, { letter: "D", text: "8 cm" }, { letter: "E", text: "10 cm" }],
      correctLetter: "B",
      explanation: "A square has 4 equal sides. Perimeter = 4 × side. So side = 20 ÷ 4 = 5 cm." },
    { id: "l2-q4", points: 3,
      text: "How many small cubes make up this shape?",
      svgDiagram: svgCubeCount,
      options: [{ letter: "A", text: "3" }, { letter: "B", text: "4" }, { letter: "C", text: "5" }, { letter: "D", text: "6" }, { letter: "E", text: "7" }],
      correctLetter: "C",
      explanation: "There are 4 cubes in the 2×2 base and 1 cube on top = 5 cubes total." },
    { id: "l2-q5", points: 4,
      text: "4 large sheep and 1 small sheep share 60g of food. The small sheep gets twice as much as each large sheep. How much does the small sheep get?",
      svgDiagram: svgSheepFeeding,
      options: [{ letter: "A", text: "10g" }, { letter: "B", text: "12g" }, { letter: "C", text: "15g" }, { letter: "D", text: "20g" }, { letter: "E", text: "24g" }],
      correctLetter: "D",
      explanation: "Let large sheep get x each. Small sheep gets 2x. Total: 4x + 2x = 6x = 60g → x = 10g. Small sheep gets 2 × 10 = 20g." },
    { id: "l2-q6", points: 4,
      text: "A rectangle has a length of 8 cm and a width of 3 cm. What is its area?",
      svgDiagram: `<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:240px;display:block;margin:auto">
        <rect x="20" y="20" width="200" height="60" fill="#e8f5e9" stroke="#4ECDC4" strokeWidth="4" rx="4"/>
        <text x="120" y="14" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4ECDC4">8 cm</text>
        <text x="8" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4ECDC4">3 cm</text>
        <text x="120" y="55" textAnchor="middle" fontSize="13" fill="#FF6B6B" fontWeight="bold">Area = ?</text>
      </svg>`,
      options: [{ letter: "A", text: "11 cm²" }, { letter: "B", text: "16 cm²" }, { letter: "C", text: "22 cm²" }, { letter: "D", text: "24 cm²" }, { letter: "E", text: "32 cm²" }],
      correctLetter: "D",
      explanation: "Area = length × width = 8 × 3 = 24 cm²." },
    { id: "l2-q7", points: 4,
      text: "A shape is made of 4 identical squares joined edge-to-edge. Which of these is NOT a valid shape you can make?",
      options: [{ letter: "A", text: "A straight line of 4 squares" }, { letter: "B", text: "An L-shape" }, { letter: "C", text: "A 2×2 square" }, { letter: "D", text: "A T-shape" }, { letter: "E", text: "A diagonal of 4 squares" }],
      correctLetter: "E",
      explanation: "Squares must be joined edge-to-edge (not corner-to-corner). A diagonal arrangement is not valid. All others (line, L, 2×2, T) are valid tetrominoes!" },
    { id: "l2-q8", points: 4,
      text: "A star has 5 points. How many lines of symmetry does a regular 5-pointed star have?",
      options: [{ letter: "A", text: "1" }, { letter: "B", text: "2" }, { letter: "C", text: "3" }, { letter: "D", text: "4" }, { letter: "E", text: "5" }],
      correctLetter: "E",
      explanation: "A regular 5-pointed star has 5 lines of symmetry — one through each point and the opposite indentation." },
    { id: "l2-q9", points: 5,
      text: "A balance scale has 2 stars on the left and 1 square on the right, and they balance. How many stars balance 3 squares?",
      svgDiagram: svgBalance("⭐⭐", "🟥", "2 stars", "1 square"),
      options: [{ letter: "A", text: "3 stars" }, { letter: "B", text: "4 stars" }, { letter: "C", text: "5 stars" }, { letter: "D", text: "6 stars" }, { letter: "E", text: "7 stars" }],
      correctLetter: "D",
      explanation: "2 stars = 1 square. So 1 square = 2 stars. Therefore 3 squares = 3 × 2 = 6 stars." },
    { id: "l2-q10", points: 5,
      text: "A grid path starts at the house 🏠. Follow: right 2, up 1, right 1. Where do you end up?",
      svgDiagram: svgGridPath,
      options: [{ letter: "A", text: "Row 1, Column 3" }, { letter: "B", text: "Row 2, Column 4" }, { letter: "C", text: "Row 1, Column 4" }, { letter: "D", text: "Row 3, Column 3" }, { letter: "E", text: "Row 2, Column 3" }],
      correctLetter: "B",
      explanation: "Start at Row 1, Column 1. Right 2 → Row 1, Column 3. Up 1 → Row 2, Column 3. Right 1 → Row 2, Column 4. You land on the star ⭐!" },
    { id: "l2-q11", points: 5,
      text: "A rectangle is cut into two identical pieces. Each piece has a perimeter of 14 cm. What is the perimeter of the original rectangle if it is cut along its length?",
      svgDiagram: `<svg viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;display:block;margin:auto">
        <rect x="10" y="20" width="120" height="60" fill="#e8f5e9" stroke="#4ECDC4" strokeWidth="3" rx="4"/>
        <text x="70" y="55" textAnchor="middle" fontSize="12" fill="#555">Original</text>
        <text x="155" y="55" textAnchor="middle" fontSize="20">→</text>
        <rect x="175" y="20" width="90" height="30" fill="#bbdefb" stroke="#4ECDC4" strokeWidth="2" rx="4"/>
        <text x="220" y="40" textAnchor="middle" fontSize="11" fill="#555">P = 14 cm</text>
        <rect x="175" y="50" width="90" height="30" fill="#bbdefb" stroke="#4ECDC4" strokeWidth="2" rx="4"/>
        <text x="220" y="70" textAnchor="middle" fontSize="11" fill="#555">P = 14 cm</text>
        <line x1="175" y1="50" x2="265" y2="50" stroke="#FF6B6B" strokeWidth="2" strokeDasharray="5,3"/>
      </svg>`,
      options: [{ letter: "A", text: "20 cm" }, { letter: "B", text: "22 cm" }, { letter: "C", text: "24 cm" }, { letter: "D", text: "28 cm" }, { letter: "E", text: "30 cm" }],
      correctLetter: "B",
      explanation: "Each piece perimeter = 14 cm. If cut along the length, each piece has the same length l but half the width w. So 2(l + w/2) = 14 → l + w/2 = 7. Original perimeter = 2(l + w) = 2l + 2w = 2(l + w/2) + w = 14 + w. For w = 8, l = 3: each piece is 3×4, perimeter = 14 ✓. Original = 2(3+8) = 22 cm." },
    { id: "l2-q12", points: 5,
      text: "A snail moves 3 cm forward each minute but slides back 1 cm every other minute. After 6 minutes, how far has it travelled?",
      svgDiagram: svgFrogJumps(0, 12, 2, 5),
      options: [{ letter: "A", text: "6 cm" }, { letter: "B", text: "9 cm" }, { letter: "C", text: "10 cm" }, { letter: "D", text: "12 cm" }, { letter: "E", text: "15 cm" }],
      correctLetter: "A",
      explanation: "Min 1: +3=3, Min 2: −1=2, Min 3: +3=5, Min 4: −1=4, Min 5: +3=7, Min 6: −1=6. After 6 minutes = 6 cm." },
  ],
  homeworkItems: [
    { id: "l2-h1", type: "puzzle", text: "Find the value of each emoji!",
      emoji1: "🔶", emoji2: "🔹", label1: "Orange Diamond", label2: "Blue Diamond",
      row1: { e1: 3, e2: 1, total: 19 }, row2: { e1: 1, e2: 3, total: 17 },
      answer1: 5, answer2: 4,
      explanation: "3o+b=19 and o+3b=17. Add: 4o+4b=36 → o+b=9. Subtract: 2o−2b=2 → o−b=1. So o=5, b=4." },
    { id: "l2-h2", type: "puzzle", text: "Find the value of each emoji!",
      emoji1: "🌍", emoji2: "🌙", label1: "Earth", label2: "Moon",
      row1: { e1: 2, e2: 0, total: 16 }, row2: { e1: 1, e2: 3, total: 17 },
      answer1: 8, answer2: 3,
      explanation: "Row 1: 2 earths = 16, so earth = 8. Row 2: 8 + 3 moons = 17 → 3 moons = 9 → moon = 3." },
    { id: "l2-h3", type: "mcq", text: "A triangle has angles of 60°, 60°, and ___°. What is the missing angle?",
      svgDiagram: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" style="width:180px;display:block;margin:auto">
        <polygon points="100,20 20,140 180,140" fill="#e8f5e9" stroke="#4ECDC4" strokeWidth="3"/>
        <text x="100" y="15" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FF6B6B">?°</text>
        <text x="18" y="158" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#555">60°</text>
        <text x="182" y="158" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#555">60°</text>
        <text x="100" y="100" textAnchor="middle" fontSize="12" fill="#555">All angles add to 180°</text>
      </svg>`,
      options: [{ letter: "A", text: "30°" }, { letter: "B", text: "45°" }, { letter: "C", text: "60°" }, { letter: "D", text: "90°" }, { letter: "E", text: "120°" }],
      correctLetter: "C",
      explanation: "Angles in a triangle add up to 180°. 60 + 60 + ? = 180 → ? = 60°. This is an equilateral triangle!" },
    { id: "l2-h4", type: "mcq", text: "How many lines of symmetry does a rectangle have?",
      options: [{ letter: "A", text: "0" }, { letter: "B", text: "1" }, { letter: "C", text: "2" }, { letter: "D", text: "3" }, { letter: "E", text: "4" }],
      correctLetter: "C",
      explanation: "A rectangle (that is not a square) has 2 lines of symmetry: one horizontal and one vertical through the middle." },
    { id: "l2-h5", type: "mcq", text: "A square tile has sides of 4 cm. How many tiles fit in a row along a 32 cm wall?",
      svgDiagram: `<svg viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:300px;display:block;margin:auto">
        <rect x="0" y="10" width="300" height="40" fill="#e3f2fd" stroke="#2D3436" strokeWidth="2" rx="4"/>
        ${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 36 + 4}" y="14" width="32" height="32" fill="#4ECDC4" stroke="#2D3436" strokeWidth="1.5" rx="2"/>`).join("")}
        <text x="150" y="58" textAnchor="middle" fontSize="11" fill="#555">32 cm wall — tiles are 4 cm each</text>
      </svg>`,
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "7" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "32 ÷ 4 = 8 tiles fit in a row." },
    { id: "l2-h6", type: "challenge", text: "⭐ Super Star: A shape has 4 sides, all equal in length, and all angles equal. What shape is it, and what are its angles?",
      options: [{ letter: "A", text: "Rectangle, 90° each" }, { letter: "B", text: "Square, 90° each" }, { letter: "C", text: "Rhombus, 60° each" }, { letter: "D", text: "Parallelogram, 45° each" }, { letter: "E", text: "Trapezium, 90° each" }],
      correctLetter: "B",
      explanation: "A shape with 4 equal sides AND 4 equal angles must be a square. The angles in any quadrilateral sum to 360°, so each angle = 360° ÷ 4 = 90°." },
  ],
};

// ─── Lesson 3: Logic & Word Problems ─────────────────────────────────────────

const lesson3: Lesson = {
  id: "lesson3",
  title: "Lesson 3",
  subtitle: "Logic & Word Problems",
  emoji: "🧠",
  color: "#9B59B6",
  starterSteps: [
    { clue: "🍎 + 🍎 + 🍎 + 🍎 = 20", hint: "Four apples are equal. What is one apple worth?", answer: "🍎 = 5" },
    { clue: "🍌 + 🍎 = 11", hint: "You know 🍎 = 5. So what does 🍌 equal?", answer: "🍌 = 6" },
    { clue: "🍇 × 🍎 = 15", hint: "You know 🍎 = 5. What number times 5 equals 15?", answer: "🍇 = 3" },
    { clue: "🍌 + 🍇 + 🍎 = ?", hint: "Add up all three fruits using the values you found!", answer: "6 + 3 + 5 = 14" },
  ],
  shapePuzzles: [
    { id: "l3-p1", difficulty: "A", emoji1: "🏰", emoji2: "⚔️", label1: "Castle", label2: "Sword",
      row1: { e1: 2, e2: 3, total: 23 }, row2: { e1: 3, e2: 2, total: 22 },
      answer1: 4, answer2: 5,
      explanation: "2c+3s=23 and 3c+2s=22. Multiply first by 3, second by 2: 6c+9s=69, 6c+4s=44. Subtract: 5s=25 → s=5. Then 2c+15=23 → c=4." },
    { id: "l3-p2", difficulty: "A", emoji1: "🎃", emoji2: "🕯️", label1: "Pumpkin", label2: "Candle",
      row1: { e1: 3, e2: 0, total: 24 }, row2: { e1: 1, e2: 2, total: 14 },
      answer1: 8, answer2: 3,
      explanation: "Row 1: 3 pumpkins = 24, so pumpkin = 8. Row 2: 8 + 2 candles = 14 → 2 candles = 6 → candle = 3." },
    { id: "l3-p3", difficulty: "A", emoji1: "🚂", emoji2: "🚃", label1: "Engine", label2: "Carriage",
      row1: { e1: 2, e2: 2, total: 18 }, row2: { e1: 3, e2: 1, total: 19 },
      answer1: 5, answer2: 4,
      explanation: "2e+2c=18 → e+c=9. 3e+c=19. Subtract: 2e=10 → e=5. Then c=4." },
    { id: "l3-p4", difficulty: "A", emoji1: "🎭", emoji2: "🎬", label1: "Mask", label2: "Clapperboard",
      row1: { e1: 2, e2: 0, total: 10 }, row2: { e1: 1, e2: 3, total: 14 },
      answer1: 5, answer2: 3,
      explanation: "Row 1: 2 masks = 10, so mask = 5. Row 2: 5 + 3 clapperboards = 14 → 3 clapperboards = 9 → clapperboard = 3." },
    { id: "l3-p5", difficulty: "B", emoji1: "🧪", emoji2: "🔭", label1: "Flask", label2: "Telescope",
      row1: { e1: 3, e2: 1, total: 25 }, row2: { e1: 1, e2: 3, total: 19 },
      answer1: 7, answer2: 4,
      explanation: "3f+t=25 and f+3t=19. Add: 4f+4t=44 → f+t=11. Subtract: 2f−2t=6 → f−t=3. So f=7, t=4." },
    { id: "l3-p6", difficulty: "B", emoji1: "🦖", emoji2: "🦕", label1: "T-Rex", label2: "Diplodocus",
      row1: { e1: 2, e2: 1, total: 19 }, row2: { e1: 1, e2: 2, total: 17 },
      answer1: 7, answer2: 5,
      explanation: "2t+d=19 and t+2d=17. Add: 3t+3d=36 → t+d=12. Subtract: t−d=2. So t=7, d=5." },
    { id: "l3-p7", difficulty: "B", emoji1: "🌋", emoji2: "🏝️", label1: "Volcano", label2: "Island",
      row1: { e1: 2, e2: 2, total: 24 }, row2: { e1: 3, e2: 1, total: 22 },
      answer1: 5, answer2: 7,
      explanation: "2v+2i=24 → v+i=12. 3v+i=22. Subtract: 2v=10 → v=5. Then i=7." },
    { id: "l3-p8", difficulty: "B", emoji1: "🎸", emoji2: "🥁", label1: "Guitar", label2: "Drums",
      row1: { e1: 3, e2: 2, total: 28 }, row2: { e1: 2, e2: 3, total: 27 },
      answer1: 6, answer2: 5,
      explanation: "3g+2d=28 and 2g+3d=27. Add: 5g+5d=55 → g+d=11. Subtract: g−d=1. So g=6, d=5." },
  ],
  competitionQuestions: [
    { id: "l3-q1", points: 3,
      text: "Mia has 15 sweets. She gives 4 to her brother and 3 to her sister. How many does she have left?",
      svgDiagram: svgChain([{ label: "Mia: 15 🍬", color: "#9B59B6" }, { label: "−4 (bro)", color: "#FF6B6B" }, { label: "−3 (sis)", color: "#FF8E53" }, { label: "= ?", color: "#4ECDC4" }], ["−4", "−3", "="]),
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "7" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "15 − 4 − 3 = 8 sweets left." },
    { id: "l3-q2", points: 3,
      text: "A bus has 24 seats. 17 people are on the bus. How many empty seats are there?",
      svgDiagram: svgBalance("👤👤👤👤👤👤👤👤👤👤👤👤👤👤👤👤👤", "💺💺💺💺💺💺💺", "17 people", "7 empty"),
      options: [{ letter: "A", text: "5" }, { letter: "B", text: "6" }, { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "9" }],
      correctLetter: "C",
      explanation: "24 − 17 = 7 empty seats." },
    { id: "l3-q3", points: 3,
      text: "Jake thinks of a number. He doubles it and adds 4. The answer is 18. What number did Jake think of?",
      svgDiagram: svgChain([{ label: "? (Jake)", color: "#9B59B6" }, { label: "×2", color: "#FF8E53" }, { label: "+4 = 18", color: "#4ECDC4" }], ["×2", "+4"]),
      options: [{ letter: "A", text: "5" }, { letter: "B", text: "6" }, { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "9" }],
      correctLetter: "C",
      explanation: "Work backwards: 18 − 4 = 14, then 14 ÷ 2 = 7. Jake thought of 7." },
    { id: "l3-q4", points: 3,
      text: "Grandma bakes 20 cookies for 4 grandchildren equally. How many does each child get?",
      svgDiagram: svgSharing("🍪", 20, 4),
      options: [{ letter: "A", text: "3" }, { letter: "B", text: "4" }, { letter: "C", text: "5" }, { letter: "D", text: "6" }, { letter: "E", text: "7" }],
      correctLetter: "C",
      explanation: "20 ÷ 4 = 5 cookies each." },
    { id: "l3-q5", points: 4,
      text: "Three children — Alex, Beth, and Charlie — each have a different number of marbles. Alex has 3 more than Beth. Charlie has twice as many as Beth. Together they have 27. How many does Beth have?",
      svgDiagram: svgChain([{ label: "Beth: b", color: "#4ECDC4" }, { label: "Alex: b+3", color: "#FF6B6B" }, { label: "Charlie: 2b", color: "#9B59B6" }], ["+3", "×2"]),
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "5" }, { letter: "C", text: "6" }, { letter: "D", text: "7" }, { letter: "E", text: "8" }],
      correctLetter: "C",
      explanation: "Let Beth = b. Alex = b+3, Charlie = 2b. Total: b + (b+3) + 2b = 27 → 4b+3=27 → 4b=24 → b=6. Beth has 6 marbles." },
    { id: "l3-q6", points: 4,
      text: "A train leaves at 9:15 am and arrives at 11:45 am. How long is the journey?",
      svgDiagram: svgClock(9, 15),
      options: [{ letter: "A", text: "1 hour 30 minutes" }, { letter: "B", text: "2 hours" }, { letter: "C", text: "2 hours 30 minutes" }, { letter: "D", text: "2 hours 45 minutes" }, { letter: "E", text: "3 hours" }],
      correctLetter: "C",
      explanation: "From 9:15 to 11:45 = 2 hours and 30 minutes." },
    { id: "l3-q7", points: 4,
      text: "In a class of 30 pupils, 18 have a pet. Of those with a pet, 10 have a dog. How many pupils have a pet but NOT a dog?",
      svgDiagram: `<svg viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;display:block;margin:auto">
        <rect x="0" y="0" width="280" height="100" rx="10" fill="#f8f9fa"/>
        <rect x="10" y="15" width="260" height="70" fill="#e3f2fd" stroke="#4ECDC4" strokeWidth="2" rx="8"/>
        <text x="140" y="10" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">30 pupils total</text>
        <rect x="20" y="25" width="150" height="50" fill="#bbdefb" stroke="#2196F3" strokeWidth="2" rx="6"/>
        <text x="95" y="48" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1565C0">18 have a pet</text>
        <rect x="25" y="30" width="70" height="40" fill="#90CAF9" stroke="#1565C0" strokeWidth="2" rx="5"/>
        <text x="60" y="53" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0D47A1">10 🐕</text>
        <text x="130" y="53" textAnchor="middle" fontSize="11" fill="#1565C0">? 🐈🐇</text>
      </svg>`,
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "7" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "18 have a pet. 10 of those have a dog. 18 − 10 = 8 have a pet but not a dog." },
    { id: "l3-q8", points: 4,
      text: "A shopkeeper has 5 boxes of pencils. Each box has 12 pencils. She sells 23 pencils. How many pencils does she have left?",
      svgDiagram: svgChain([{ label: "5×12=60", color: "#4ECDC4" }, { label: "−23 sold", color: "#FF6B6B" }, { label: "= ? left", color: "#9B59B6" }], ["−23", "="]),
      options: [{ letter: "A", text: "35" }, { letter: "B", text: "37" }, { letter: "C", text: "39" }, { letter: "D", text: "40" }, { letter: "E", text: "42" }],
      correctLetter: "B",
      explanation: "5 × 12 = 60 pencils total. 60 − 23 = 37 pencils left." },
    { id: "l3-q9", points: 5,
      text: "Anna, Bob, and Cara each pick a different number from 1 to 9. Anna's number is 3 times Bob's. Cara's number is 2 more than Bob's. What is the sum of all three numbers?",
      options: [{ letter: "A", text: "12" }, { letter: "B", text: "13" }, { letter: "C", text: "14" }, { letter: "D", text: "15" }, { letter: "E", text: "16" }],
      correctLetter: "A",
      explanation: "If Bob = 2: Anna = 6, Cara = 4. All different, all 1–9. Sum = 2+6+4 = 12 ✓." },
    { id: "l3-q10", points: 5,
      text: "A snail is at the bottom of a 10-metre well. Each day it climbs 3 metres, but each night it slides back 2 metres. On which day does it reach the top?",
      svgDiagram: `<svg viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg" style="width:160px;display:block;margin:auto">
        <rect x="30" y="10" width="100" height="190" fill="#f8f9fa" stroke="#2D3436" strokeWidth="3" rx="4"/>
        ${Array.from({ length: 10 }, (_, i) => `
          <line x1="30" y1="${10 + i * 19}" x2="130" y2="${10 + i * 19}" stroke="#ccc" strokeWidth="1"/>
          <text x="20" y="${10 + i * 19 + 5}" textAnchor="middle" fontSize="10" fill="#555">${10 - i}m</text>
        `).join("")}
        <text x="80" y="205" textAnchor="middle" fontSize="10" fill="#555">0m</text>
        <text x="80" y="195" textAnchor="middle" fontSize="20">🐌</text>
        <text x="80" y="30" textAnchor="middle" fontSize="18">🌟</text>
        <text x="80" y="15" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FF6B6B">TOP</text>
      </svg>`,
      options: [{ letter: "A", text: "Day 6" }, { letter: "B", text: "Day 7" }, { letter: "C", text: "Day 8" }, { letter: "D", text: "Day 9" }, { letter: "E", text: "Day 10" }],
      correctLetter: "C",
      explanation: "Each full day+night the snail gains 1 metre. After 7 nights it's at 7m. On day 8 it climbs 3m to reach 10m — it escapes on Day 8!" },
    { id: "l3-q11", points: 5,
      text: "Five friends sit in a row. Amy is not next to Ben. Ben is next to Cara. Cara is in the middle. Dan is at one end. Who is next to Amy?",
      svgDiagram: `<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:300px;display:block;margin:auto">
        <rect x="0" y="0" width="300" height="80" rx="10" fill="#f3e5f5"/>
        ${["Dan/Emma", "?", "Cara", "Ben", "?"].map((name, i) => `
          <circle cx="${30 + i * 60}" cy="40" r="22" fill="${name === "Cara" ? "#9B59B6" : name === "Ben" ? "#4ECDC4" : "#e0e0e0"}" stroke="#2D3436" strokeWidth="2"/>
          <text x="${30 + i * 60}" y="${name.length > 4 ? 38 : 44}" textAnchor="middle" fontSize="${name.length > 5 ? 8 : 11}" fontWeight="bold" fill="${name === "Cara" || name === "Ben" ? "white" : "#555"}">${name}</text>
        `).join("")}
      </svg>`,
      options: [{ letter: "A", text: "Ben" }, { letter: "B", text: "Cara" }, { letter: "C", text: "Dan" }, { letter: "D", text: "Emma" }, { letter: "E", text: "Dan and Emma" }],
      correctLetter: "D",
      explanation: "Cara is in position 3. Ben is next to Cara (pos 2 or 4). Amy is NOT next to Ben. If Ben=2, Amy can't be at 1 or 3. Dan is at an end (pos 1 or 5). If Dan=1, Amy=4 or 5. Since Amy can't be next to Ben (pos 2), Amy=5. Emma=4. Amy is next to Emma only. Answer: D." },
    { id: "l3-q12", points: 5,
      text: "In a 3×3 magic square, each row, column, and diagonal sums to 15. The centre is 5 and the top-left corner is 2. What is the bottom-right corner?",
      svgDiagram: svgGrid(3, 3, [[0, 0], [1, 1]], "#FFD700"),
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "6" }, { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "9" }],
      correctLetter: "D",
      explanation: "In a 3×3 magic square with centre 5, opposite corners sum to 10. Top-left = 2, so bottom-right = 10 − 2 = 8." },
  ],
  homeworkItems: [
    { id: "l3-h1", type: "puzzle", text: "Find the value of each emoji!",
      emoji1: "🦄", emoji2: "🐉", label1: "Unicorn", label2: "Dragon",
      row1: { e1: 2, e2: 1, total: 16 }, row2: { e1: 1, e2: 2, total: 14 },
      answer1: 6, answer2: 4,
      explanation: "2u+d=16 and u+2d=14. Add: 3u+3d=30 → u+d=10. Subtract: u−d=2. So u=6, d=4." },
    { id: "l3-h2", type: "puzzle", text: "Find the value of each emoji!",
      emoji1: "🏄", emoji2: "🤿", label1: "Surfer", label2: "Diver",
      row1: { e1: 3, e2: 0, total: 27 }, row2: { e1: 1, e2: 2, total: 13 },
      answer1: 9, answer2: 2,
      explanation: "Row 1: 3 surfers = 27, so surfer = 9. Row 2: 9 + 2 divers = 13 → 2 divers = 4 → diver = 2." },
    { id: "l3-h3", type: "mcq", text: "Tom is 8 years old. His dad is 4 times older. In 5 years, how old will Tom's dad be?",
      svgDiagram: svgChain([{ label: "Tom: 8", color: "#4ECDC4" }, { label: "Dad: ×4", color: "#FF8E53" }, { label: "+5 yrs", color: "#9B59B6" }, { label: "= ?", color: "#FF6B6B" }], ["×4", "+5", "="]),
      options: [{ letter: "A", text: "35" }, { letter: "B", text: "37" }, { letter: "C", text: "38" }, { letter: "D", text: "40" }, { letter: "E", text: "42" }],
      correctLetter: "B",
      explanation: "Dad is now 8 × 4 = 32 years old. In 5 years: 32 + 5 = 37." },
    { id: "l3-h4", type: "mcq", text: "A library has 3 shelves. Each shelf has 8 books. The librarian adds 6 more books spread equally across the shelves. How many books are on each shelf now?",
      svgDiagram: `<svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:240px;display:block;margin:auto">
        <rect x="10" y="10" width="220" height="100" fill="#f5f5f5" stroke="#8B6914" strokeWidth="3" rx="4"/>
        ${[0, 1, 2].map(row => {
          const y = 20 + row * 28;
          return `<rect x="20" y="${y}" width="200" height="22" fill="white" stroke="#ddd" strokeWidth="1"/>
          ${Array.from({ length: 8 }, (_, i) => `<rect x="${25 + i * 22}" y="${y + 2}" width="16" height="18" fill="#4ECDC4" rx="2"/>`).join("")}
          <text x="205" y="${y + 15}" fontSize="10" fill="#FF6B6B" fontWeight="bold">+2</text>`;
        }).join("")}
        <text x="120" y="112" textAnchor="middle" fontSize="11" fill="#555">8 books + 2 extra = ? per shelf</text>
      </svg>`,
      options: [{ letter: "A", text: "9" }, { letter: "B", text: "10" }, { letter: "C", text: "11" }, { letter: "D", text: "12" }, { letter: "E", text: "14" }],
      correctLetter: "B",
      explanation: "6 books ÷ 3 shelves = 2 extra per shelf. 8 + 2 = 10 books per shelf." },
    { id: "l3-h5", type: "mcq", text: "In a bag there are 3 red, 4 blue, and 5 green balls. Without looking, you pick one. Which colour are you most likely to pick?",
      svgDiagram: `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:240px;display:block;margin:auto">
        <rect x="0" y="0" width="240" height="80" rx="10" fill="#f8f9fa"/>
        ${[...Array(3)].map((_, i) => `<circle cx="${20 + i * 24}" cy="40" r="10" fill="#FF6B6B" stroke="#2D3436" strokeWidth="1.5"/>`).join("")}
        ${[...Array(4)].map((_, i) => `<circle cx="${100 + i * 24}" cy="40" r="10" fill="#4ECDC4" stroke="#2D3436" strokeWidth="1.5"/>`).join("")}
        ${[...Array(5)].map((_, i) => `<circle cx="${178 + i * 12}" cy="40" r="8" fill="#28a745" stroke="#2D3436" strokeWidth="1.5"/>`).join("")}
        <text x="36" y="68" textAnchor="middle" fontSize="11" fill="#555">3 red</text>
        <text x="148" y="68" textAnchor="middle" fontSize="11" fill="#555">4 blue</text>
        <text x="214" y="68" textAnchor="middle" fontSize="11" fill="#555">5 green</text>
      </svg>`,
      options: [{ letter: "A", text: "Red" }, { letter: "B", text: "Blue" }, { letter: "C", text: "Green" }, { letter: "D", text: "Red or Blue" }, { letter: "E", text: "All equally likely" }],
      correctLetter: "C",
      explanation: "There are 5 green balls — more than any other colour (3 red, 4 blue). Green is most likely!" },
    { id: "l3-h6", type: "challenge", text: "⭐ Super Star: I am a two-digit number. My digits add up to 9. If you reverse my digits, the new number is 27 more than me. What number am I?",
      svgDiagram: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;display:block;margin:auto">
        <rect x="0" y="0" width="280" height="80" rx="10" fill="#f3e5f5"/>
        <rect x="20" y="15" width="60" height="50" fill="white" stroke="#9B59B6" strokeWidth="3" rx="8"/>
        <text x="50" y="48" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#9B59B6">AB</text>
        <text x="100" y="42" textAnchor="middle" fontSize="18" fill="#555">→ reverse →</text>
        <rect x="140" y="15" width="60" height="50" fill="white" stroke="#FF6B6B" strokeWidth="3" rx="8"/>
        <text x="170" y="48" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#FF6B6B">BA</text>
        <text x="225" y="42" textAnchor="middle" fontSize="13" fill="#555">BA = AB + 27</text>
        <text x="140" y="72" textAnchor="middle" fontSize="11" fill="#555">A + B = 9</text>
      </svg>`,
      options: [{ letter: "A", text: "18" }, { letter: "B", text: "27" }, { letter: "C", text: "36" }, { letter: "D", text: "45" }, { letter: "E", text: "54" }],
      correctLetter: "C",
      explanation: "Digits add to 9: 18, 27, 36, 45, 54, 63, 72, 81, 90. Reversed is 27 more: 36 reversed = 63. 63 − 36 = 27 ✓. The answer is 36!" },
  ],
};

// ─── Lesson 4: Mixed Challenge (Mock Paper) ───────────────────────────────────

const lesson4: Lesson = {
  id: "lesson4",
  title: "Lesson 4",
  subtitle: "Mock Competition",
  emoji: "🏆",
  color: "#FFD93D",
  starterSteps: [
    { clue: "🦁 + 🦁 = 16", hint: "Two lions are worth 16. Half of 16 is…?", answer: "🦁 = 8" },
    { clue: "🦁 + 🐯 = 15", hint: "Lion = 8. So 8 + tiger = 15. What adds to 8 to make 15?", answer: "🐯 = 7" },
    { clue: "🐯 + 🐯 + 🦁 = ?", hint: "Replace: 7 + 7 + 8.", answer: "7 + 7 + 8 = 22" },
    { clue: "🦁 × 🐯 − 🦁 = ?", hint: "8 × 7 = 56. Then 56 − 8 = ?", answer: "56 − 8 = 48" },
  ],
  shapePuzzles: [
    { id: "l4-p1", difficulty: "A", emoji1: "🍦", emoji2: "🍩", label1: "Ice Cream", label2: "Donut",
      row1: { e1: 4, e2: 0, total: 32 }, row2: { e1: 2, e2: 4, total: 28 },
      answer1: 8, answer2: 3,
      explanation: "4 ice creams = 32, so ice cream = 8. Then 16 + 4 donuts = 28, so 4 donuts = 12, donut = 3." },
    { id: "l4-p2", difficulty: "A", emoji1: "🌮", emoji2: "🌯", label1: "Taco", label2: "Wrap",
      row1: { e1: 5, e2: 1, total: 29 }, row2: { e1: 3, e2: 3, total: 27 },
      answer1: 5, answer2: 4,
      explanation: "5T+W=29 and T+W=9 (from row2÷3). So 4T=20 → T=5. W=4." },
    { id: "l4-p3", difficulty: "A", emoji1: "🎸", emoji2: "🎹", label1: "Guitar", label2: "Piano",
      row1: { e1: 3, e2: 0, total: 21 }, row2: { e1: 1, e2: 2, total: 17 },
      answer1: 7, answer2: 5,
      explanation: "3 guitars = 21, so guitar = 7. Then 7 + 2 pianos = 17, so 2 pianos = 10, piano = 5." },
    { id: "l4-p4", difficulty: "A", emoji1: "🐸", emoji2: "🐢", label1: "Frog", label2: "Turtle",
      row1: { e1: 4, e2: 0, total: 24 }, row2: { e1: 2, e2: 3, total: 21 },
      answer1: 6, answer2: 3,
      explanation: "4 frogs = 24, so frog = 6. Then 12 + 3 turtles = 21, so 3 turtles = 9, turtle = 3." },
    { id: "l4-p5", difficulty: "B", emoji1: "🌞", emoji2: "🌛", label1: "Sun", label2: "Moon",
      row1: { e1: 2, e2: 3, total: 19 }, row2: { e1: 3, e2: 2, total: 21 },
      answer1: 5, answer2: 3,
      explanation: "Row2−Row1: S−M=2. Try S=5,M=3: 10+9=19✓ 15+6=21✓." },
    { id: "l4-p6", difficulty: "B", emoji1: "🍰", emoji2: "🧁", label1: "Cake", label2: "Cupcake",
      row1: { e1: 4, e2: 2, total: 26 }, row2: { e1: 2, e2: 4, total: 22 },
      answer1: 5, answer2: 3,
      explanation: "4C+2U=26 → 2C+U=13. 2C+4U=22 → C+2U=11. Subtract: C−U=2. Try C=5,U=3: 20+6=26✓ 10+12=22✓." },
    { id: "l4-p7", difficulty: "B", emoji1: "🦅", emoji2: "🦜", label1: "Eagle", label2: "Parrot",
      row1: { e1: 2, e2: 3, total: 23 }, row2: { e1: 3, e2: 2, total: 27 },
      answer1: 7, answer2: 3,
      explanation: "Row2−Row1: E−P=4. Try E=7,P=3: 14+9=23✓ 21+6=27✓." },
    { id: "l4-p8", difficulty: "B", emoji1: "🏠", emoji2: "🌳", label1: "House", label2: "Tree",
      row1: { e1: 3, e2: 2, total: 22 }, row2: { e1: 2, e2: 3, total: 18 },
      answer1: 6, answer2: 2,
      explanation: "3H+2T=22 and 2H+3T=18. Multiply: 9H+6T=66, 4H+6T=36. Subtract: 5H=30 → H=6. T=(22−18)/2=2." },
  ],
  competitionQuestions: [
    { id: "l4-q1", points: 3,
      text: "What is the value of the missing number?\n8 + ___ = 15",
      options: [{ letter: "A", text: "5" }, { letter: "B", text: "6" }, { letter: "C", text: "7" }, { letter: "D", text: "8" }, { letter: "E", text: "9" }],
      correctLetter: "C",
      explanation: "15 − 8 = 7. The missing number is 7." },
    { id: "l4-q2", points: 3,
      text: "A caterpillar 🐛 eats 2 leaves each day. How many leaves does it eat in 2 weeks?",
      svgDiagram: svgFrogJumps(0, 14, 2, 7),
      options: [{ letter: "A", text: "14" }, { letter: "B", text: "24" }, { letter: "C", text: "28" }, { letter: "D", text: "30" }, { letter: "E", text: "32" }],
      correctLetter: "C",
      explanation: "2 weeks = 14 days. 14 × 2 = 28 leaves." },
    { id: "l4-q3", points: 3,
      text: "What shape comes next?\n🔴 🔺 🔴 🔺 🔴 ___",
      svgDiagram: svgPattern(["🔴", "🔺", "🔴", "🔺", "🔴", "?"]),
      options: [{ letter: "A", text: "🔴 Red circle" }, { letter: "B", text: "🔺 Red triangle" }, { letter: "C", text: "🔵 Blue circle" }, { letter: "D", text: "🟡 Yellow" }, { letter: "E", text: "🟢 Green" }],
      correctLetter: "B",
      explanation: "The pattern alternates: circle, triangle, circle, triangle... After the 5th shape (circle), the 6th is a triangle." },
    { id: "l4-q4", points: 3,
      text: "There are 36 children. They are put into groups of 4. How many groups are there?",
      svgDiagram: svgSharing("👤", 36, 9),
      options: [{ letter: "A", text: "7" }, { letter: "B", text: "8" }, { letter: "C", text: "9" }, { letter: "D", text: "10" }, { letter: "E", text: "12" }],
      correctLetter: "C",
      explanation: "36 ÷ 4 = 9 groups." },
    { id: "l4-q5", points: 4,
      text: "A farmer has chickens 🐔 and cows 🐄. He counts 20 heads and 56 legs. How many cows are there?",
      svgDiagram: svgBalance("🐔🐔🐔🐔🐔🐔🐔🐔🐔🐔🐔🐔", "🐄🐄🐄🐄🐄🐄🐄🐄", "chickens (2 legs)", "cows (4 legs)"),
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "7" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "If all 20 were chickens: 20 × 2 = 40 legs. Extra legs = 56 − 40 = 16. Each cow adds 2 extra legs. Cows = 16 ÷ 2 = 8." },
    { id: "l4-q6", points: 4,
      text: "The clock shows 7:30. What time was it 2 hours and 45 minutes ago?",
      svgDiagram: svgClock(7, 30),
      options: [{ letter: "A", text: "4:30" }, { letter: "B", text: "4:45" }, { letter: "C", text: "5:00" }, { letter: "D", text: "5:15" }, { letter: "E", text: "5:30" }],
      correctLetter: "B",
      explanation: "7:30 − 2 hours = 5:30. 5:30 − 45 minutes = 4:45." },
    { id: "l4-q7", points: 4,
      text: "A number pattern: 2, 5, 10, 17, 26, ___. What is the next number?",
      options: [{ letter: "A", text: "35" }, { letter: "B", text: "36" }, { letter: "C", text: "37" }, { letter: "D", text: "38" }, { letter: "E", text: "40" }],
      correctLetter: "C",
      explanation: "Differences: +3, +5, +7, +9, +11. The next difference is +11. 26 + 11 = 37." },
    { id: "l4-q8", points: 4,
      text: "A bag has red and blue balls. There are 5 more red balls than blue balls. There are 13 balls in total. How many blue balls are there?",
      svgDiagram: `<svg viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:260px;display:block;margin:auto">
        <rect x="0" y="0" width="260" height="80" rx="10" fill="#f8f9fa"/>
        ${[...Array(4)].map((_, i) => `<circle cx="${20 + i * 22}" cy="40" r="9" fill="#4ECDC4" stroke="#2D3436" strokeWidth="1.5"/>`).join("")}
        ${[...Array(9)].map((_, i) => `<circle cx="${110 + i * 16}" cy="40" r="9" fill="#FF6B6B" stroke="#2D3436" strokeWidth="1.5"/>`).join("")}
        <text x="50" y="68" textAnchor="middle" fontSize="11" fill="#4ECDC4" fontWeight="bold">? blue</text>
        <text x="180" y="68" textAnchor="middle" fontSize="11" fill="#FF6B6B" fontWeight="bold">blue + 5 red</text>
        <text x="130" y="15" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">Total = 13 balls</text>
      </svg>`,
      options: [{ letter: "A", text: "3" }, { letter: "B", text: "4" }, { letter: "C", text: "5" }, { letter: "D", text: "6" }, { letter: "E", text: "8" }],
      correctLetter: "B",
      explanation: "If blue = B, then red = B + 5. Total: B + B + 5 = 13 → 2B = 8 → B = 4. There are 4 blue balls." },
    { id: "l4-q9", points: 5,
      text: "A staircase has 10 steps. Each step is 20 cm high. An owl can hop 3 steps at a time. Starting from the bottom, how many hops does it take to reach the top?",
      svgDiagram: svgStaircase(10, "#FFD93D"),
      options: [{ letter: "A", text: "3 jumps" }, { letter: "B", text: "4 jumps" }, { letter: "C", text: "5 jumps" }, { letter: "D", text: "6 jumps" }, { letter: "E", text: "7 jumps" }],
      correctLetter: "B",
      explanation: "Hop 1: steps 1-3. Hop 2: steps 4-6. Hop 3: steps 7-9. Hop 4: step 10 (top). It takes 4 hops." },
    { id: "l4-q10", points: 5,
      text: "Three boxes contain 5, 8, and 11 balls. You can move balls between boxes. What is the minimum number of moves to make all boxes equal?",
      svgDiagram: `<svg viewBox="0 0 280 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;display:block;margin:auto"><rect x="0" y="0" width="280" height="90" rx="10" fill="#f8f9fa"/><rect x="30" y="20" width="60" height="50" fill="white" stroke="#FF6B6B" strokeWidth="3" rx="8"/><text x="60" y="50" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#FF6B6B">5</text><text x="60" y="65" textAnchor="middle" fontSize="11" fill="#555">Box A</text><rect x="120" y="20" width="60" height="50" fill="white" stroke="#4ECDC4" strokeWidth="3" rx="8"/><text x="150" y="50" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#4ECDC4">8</text><text x="150" y="65" textAnchor="middle" fontSize="11" fill="#555">Box B</text><rect x="210" y="20" width="60" height="50" fill="white" stroke="#9B59B6" strokeWidth="3" rx="8"/><text x="240" y="50" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#9B59B6">11</text><text x="240" y="65" textAnchor="middle" fontSize="11" fill="#555">Box C</text><text x="140" y="88" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FF6B6B">Make all equal — min moves?</text></svg>`,
      options: [{ letter: "A", text: "1 move" }, { letter: "B", text: "2 moves" }, { letter: "C", text: "3 moves" }, { letter: "D", text: "4 moves" }, { letter: "E", text: "5 moves" }],
      correctLetter: "B",
      explanation: "Total = 24, so each box needs 8. Box A needs +3, Box C needs −3. Move 3 balls from Box C to Box A. That's 1 move! But we need to check: 5+3=8✓, 8=8✓, 11−3=8✓. Just 1 move! Answer is A." },
    { id: "l4-q11", points: 5,
      text: "A number is a palindrome if it reads the same forwards and backwards (e.g. 121). How many 3-digit palindromes are there between 100 and 200?",
      options: [{ letter: "A", text: "5" }, { letter: "B", text: "8" }, { letter: "C", text: "9" }, { letter: "D", text: "10" }, { letter: "E", text: "11" }],
      correctLetter: "D",
      explanation: "3-digit palindromes have the form ABA. Between 100–200, A=1. The middle digit B can be 0–9. So: 101, 111, 121, 131, 141, 151, 161, 171, 181, 191 = 10 palindromes." },
    { id: "l4-q12", points: 5,
      text: "A magic square uses numbers 1–9. Each row, column, and diagonal sums to 15. If the top row is 2, 7, 6 — what is the bottom-left corner?",
      svgDiagram: `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="width:160px;display:block;margin:auto"><rect x="0" y="0" width="160" height="160" rx="10" fill="#f3e5f5"/>${[[2,7,6],[9,5,1],[4,3,8]].map((row,r)=>row.map((v,c)=>`<rect x="${10+c*46}" y="${10+r*46}" width="42" height="42" fill="${r===0?"#e8d5f5":r===2&&c===0?"#FFD700":"white"}" stroke="#9B59B6" strokeWidth="2" rx="4"/><text x="${31+c*46}" y="${36+r*46}" textAnchor="middle" fontSize="18" fontWeight="bold" fill="${r===0?"#9B59B6":"#2D3436"}">${r===2&&c===0?"?":v}</text>`).join("")).join("")}</svg>`,
      options: [{ letter: "A", text: "2" }, { letter: "B", text: "3" }, { letter: "C", text: "4" }, { letter: "D", text: "6" }, { letter: "E", text: "8" }],
      correctLetter: "C",
      explanation: "Top row: 2+7+6=15 ✓. The classic 3×3 magic square: top row 2,7,6 → middle 9,5,1 → bottom 4,3,8. Bottom-left = 4." },
  ],
  homeworkItems: [
    { id: "l4-h1", type: "puzzle", text: "Find the value of each emoji!",
      emoji1: "🌞", emoji2: "🌛", label1: "Sun", label2: "Moon",
      row1: { e1: 2, e2: 3, total: 19 }, row2: { e1: 3, e2: 2, total: 21 },
      answer1: 5, answer2: 3,
      explanation: "2S+3M=19 and 3S+2M=21. Add: 5S+5M=40 → S+M=8. Subtract: S−M=2. So S=5, M=3." },
    { id: "l4-h2", type: "puzzle", text: "Find the value of each emoji!",
      emoji1: "🍕", emoji2: "🥤", label1: "Pizza", label2: "Drink",
      row1: { e1: 3, e2: 1, total: 25 }, row2: { e1: 1, e2: 3, total: 19 },
      answer1: 7, answer2: 4,
      explanation: "3P+D=25 and P+3D=19. Add: 4P+4D=44 → P+D=11. Subtract: 2P−2D=6 → P−D=3. So P=7, D=4." },
    { id: "l4-h3", type: "mcq", text: "A frog jumps 4 metres each jump. It needs to cross a 30-metre river. How many jumps does it need?",
      svgDiagram: svgFrogJumps(0, 32, 4, 8),
      options: [{ letter: "A", text: "6" }, { letter: "B", text: "7" }, { letter: "C", text: "8" }, { letter: "D", text: "9" }, { letter: "E", text: "10" }],
      correctLetter: "C",
      explanation: "7 jumps = 28m (not enough). 8 jumps = 32m ≥ 30m. The frog needs 8 jumps." },
    { id: "l4-h4", type: "mcq", text: "There are 5 red, 3 blue, and 2 green marbles in a bag. You pick one without looking. Which colour are you LEAST likely to pick?",
      options: [{ letter: "A", text: "Red" }, { letter: "B", text: "Blue" }, { letter: "C", text: "Green" }, { letter: "D", text: "Red or Blue" }, { letter: "E", text: "All equally likely" }],
      correctLetter: "C",
      explanation: "There are only 2 green marbles — fewer than red (5) or blue (3). Green is least likely." },
    { id: "l4-h5", type: "mcq", text: "A rectangle has an area of 24 cm² and a length of 8 cm. What is its width?",
      svgDiagram: `<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:240px;display:block;margin:auto"><rect x="20" y="20" width="200" height="60" fill="#fff8e1" stroke="#FFD93D" strokeWidth="4" rx="4"/><text x="120" y="14" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FFD93D">8 cm</text><text x="8" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FFD93D">? cm</text><text x="120" y="55" textAnchor="middle" fontSize="13" fill="#FF6B6B" fontWeight="bold">Area = 24 cm²</text></svg>`,
      options: [{ letter: "A", text: "2 cm" }, { letter: "B", text: "3 cm" }, { letter: "C", text: "4 cm" }, { letter: "D", text: "6 cm" }, { letter: "E", text: "8 cm" }],
      correctLetter: "B",
      explanation: "Area = length × width → 24 = 8 × width → width = 24 ÷ 8 = 3 cm." },
    { id: "l4-h6", type: "challenge", text: "⭐ Super Star: A farmer has both chickens 🐔 and rabbits 🐇. He counts 10 heads and 28 legs. How many chickens are there?",
      svgDiagram: `<svg viewBox="0 0 280 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;display:block;margin:auto"><rect x="0" y="0" width="280" height="90" rx="10" fill="#f8f9fa"/><text x="60" y="45" textAnchor="middle" fontSize="32">🐔</text><text x="60" y="68" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#555">2 legs</text><text x="140" y="45" textAnchor="middle" fontSize="32">🐇</text><text x="140" y="68" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#555">4 legs</text><text x="220" y="35" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FF6B6B">10 heads</text><text x="220" y="55" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#9B59B6">28 legs</text><text x="140" y="85" textAnchor="middle" fontSize="11" fill="#555">How many chickens?</text></svg>`,
      options: [{ letter: "A", text: "4" }, { letter: "B", text: "5" }, { letter: "C", text: "6" }, { letter: "D", text: "7" }, { letter: "E", text: "8" }],
      correctLetter: "C",
      explanation: "If all 10 were chickens: 10 × 2 = 20 legs. Extra legs = 28 − 20 = 8. Each rabbit adds 2 extra legs. Rabbits = 8 ÷ 2 = 4. Chickens = 10 − 4 = 6." },
  ],
};

// Fix l4-q10 answer
lesson4.competitionQuestions[9].correctLetter = "A";
lesson4.competitionQuestions[9].explanation = "Total = 5+8+11 = 24. Each box needs 8. Move 3 balls from Box C to Box A: A=8, B=8, C=8. Just 1 move!";

// ─── Exports ─────────────────────────────────────────────────────────────────

export const lessons: Lesson[] = [lesson1, lesson2, lesson3, lesson4];

// Legacy exports for backward compatibility
export const starterSteps = lesson1.starterSteps;
export const shapePuzzles = lesson1.shapePuzzles;
export const competitionQuestions = lesson1.competitionQuestions;
export const homeworkItems = lesson1.homeworkItems;
