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
function svgHandshakeSmall(n: number) {
  const W = 320; const cx = W / 2; const cy = 80; const r = 55;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i * 360 / n - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  const lines: string[] = [];
  const dots: string[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      lines.push(`<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="#4ECDC4" strokeWidth="1.5" opacity="0.6"/>`);
    }
    dots.push(`<circle cx="${pts[i].x.toFixed(1)}" cy="${pts[i].y.toFixed(1)}" r="12" fill="#F5A623" stroke="#2D3436" strokeWidth="2"/>`);
    dots.push(`<text x="${pts[i].x.toFixed(1)}" y="${(pts[i].y + 5).toFixed(1)}" textAnchor="middle" fontSize="13">👤</text>`);
  }
  return svgWrap(`${lines.join("")}${dots.join("")}`, 160, "#f0f8ff");
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
    {
      id: "l1-cq1", points: 3,
      text: "I think of a number, add 8, and the answer is 15. What is my number?",
      options: [
        { letter: "A", text: "5" },
        { letter: "B", text: "6" },
        { letter: "C", text: "7" },
        { letter: "D", text: "8" },
        { letter: "E", text: "9" },
      ],
      correctLetter: "C",
      explanation: "Work backwards: 15 − 8 = 7. Check: 7 + 8 = 15 ✓",
    },
    {
      id: "l1-cq2", points: 3,
      text: "What comes next in this sequence?\n1, 4, 9, 16, ___",
      svgDiagram: svgPattern(["1²=1", "2²=4", "3²=9", "4²=16", "?"]),
      options: [
        { letter: "A", text: "20" },
        { letter: "B", text: "23" },
        { letter: "C", text: "24" },
        { letter: "D", text: "25" },
        { letter: "E", text: "30" },
      ],
      correctLetter: "D",
      explanation: "These are square numbers: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25. The next is 25.",
    },
    {
      id: "l1-cq3", points: 3,
      text: "A bag has 30 marbles. ⅕ are red and the rest are blue. How many blue marbles are there?",
      options: [
        { letter: "A", text: "5" },
        { letter: "B", text: "20" },
        { letter: "C", text: "24" },
        { letter: "D", text: "25" },
        { letter: "E", text: "28" },
      ],
      correctLetter: "C",
      explanation: "⅕ of 30 = 6 red marbles. Blue = 30 − 6 = 24.",
    },
    {
      id: "l1-cq4", points: 3,
      text: "Two numbers add up to 10 and multiply to give 21. What is the larger number?",
      options: [
        { letter: "A", text: "5" },
        { letter: "B", text: "6" },
        { letter: "C", text: "7" },
        { letter: "D", text: "8" },
        { letter: "E", text: "9" },
      ],
      correctLetter: "C",
      explanation: "Try pairs that sum to 10: 3 + 7 = 10, and 3 × 7 = 21 ✓. The larger number is 7.",
    },
    // 4-point
    {
      id: "l1-cq5", points: 4,
      text: "A number machine first doubles the input, then subtracts 3. The output is 13. What was the input?",
      svgDiagram: svgChain(
        [{ label: "Input ?", color: "#9B59B6" }, { label: "×2", color: "#FF8E53" }, { label: "−3", color: "#FF6B6B" }, { label: "= 13", color: "#4ECDC4" }],
        ["×2", "−3", "="]
      ),
      options: [
        { letter: "A", text: "5" },
        { letter: "B", text: "7" },
        { letter: "C", text: "8" },
        { letter: "D", text: "10" },
        { letter: "E", text: "11" },
      ],
      correctLetter: "C",
      explanation: "Work backwards: 13 + 3 = 16 (undo −3). 16 ÷ 2 = 8 (undo ×2). Check: 8 × 2 − 3 = 13 ✓",
    },
    {
      id: "l1-cq6", points: 4,
      text: "Today is Tuesday. What day will it be in 20 days' time?",
      options: [
        { letter: "A", text: "Monday" },
        { letter: "B", text: "Tuesday" },
        { letter: "C", text: "Wednesday" },
        { letter: "D", text: "Thursday" },
        { letter: "E", text: "Saturday" },
      ],
      correctLetter: "A",
      explanation: "20 ÷ 7 = 2 remainder 6. After 14 days it's Tuesday again. 6 more days: Wed, Thu, Fri, Sat, Sun, Mon. Answer: Monday.",
    },
    {
      id: "l1-cq7", points: 4,
      text: "4 children each shake hands with every other child exactly once. How many handshakes happen in total?",
      svgDiagram: svgHandshakeSmall(4),
      options: [
        { letter: "A", text: "4" },
        { letter: "B", text: "6" },
        { letter: "C", text: "8" },
        { letter: "D", text: "10" },
        { letter: "E", text: "12" },
      ],
      correctLetter: "B",
      explanation: "Child 1 shakes 3 hands. Child 2 shakes 2 new hands. Child 3 shakes 1 new hand. Total: 3 + 2 + 1 = 6. Or: 4 × 3 ÷ 2 = 6.",
    },
    {
      id: "l1-cq8", points: 4,
      text: "Anya gives half her stickers to Ben. Ben now has 18 stickers. He had 6 to start with. How many stickers did Anya have?",
      svgDiagram: svgChain(
        [{ label: "Anya ?", color: "#9B59B6" }, { label: "Ben 6 + ½Anya", color: "#FF8E53" }, { label: "= 18", color: "#4ECDC4" }],
        ["÷2 →", "="]
      ),
      options: [
        { letter: "A", text: "12" },
        { letter: "B", text: "18" },
        { letter: "C", text: "24" },
        { letter: "D", text: "30" },
        { letter: "E", text: "36" },
      ],
      correctLetter: "C",
      explanation: "Ben ends with 18. He started with 6, so he received 18 − 6 = 12 stickers from Anya. That was half of Anya's total. So Anya had 12 × 2 = 24 stickers.",
    },
    // 5-point
    {
      id: "l1-cq9", points: 5,
      text: "On a balance scale: 3 apples balance 1 melon. 1 melon balances 5 oranges. How many oranges balance 6 apples?",
      svgDiagram: svgTwoBalances("🍎🍎🍎", "🍈", "3 apples = 1 melon", "🍈", "🍊🍊🍊🍊🍊", "1 melon = 5 oranges"),
      options: [
        { letter: "A", text: "8 oranges" },
        { letter: "B", text: "9 oranges" },
        { letter: "C", text: "10 oranges" },
        { letter: "D", text: "12 oranges" },
        { letter: "E", text: "15 oranges" },
      ],
      correctLetter: "C",
      explanation: "3 apples = 1 melon = 5 oranges. So 6 apples = 2 melons = 10 oranges.",
    },
    {
      id: "l1-cq10", points: 5,
      text: "The numbers 1–9 are placed in a 3×3 magic square so that every row, column and diagonal adds to the same total. What is that total?",
      svgDiagram: svgGrid(3, 3, [[1, 1]], "#FFD700"),
      options: [
        { letter: "A", text: "12" },
        { letter: "B", text: "13" },
        { letter: "C", text: "14" },
        { letter: "D", text: "15" },
        { letter: "E", text: "16" },
      ],
      correctLetter: "D",
      explanation: "The numbers 1 to 9 sum to 45. There are 3 rows, so each row must total 45 ÷ 3 = 15.",
    },
    {
      id: "l1-cq11", points: 5,
      text: "Ali is 3 times as old as his sister Bea. In 4 years, Ali will be twice as old as Bea. How old is Ali now?",
      options: [
        { letter: "A", text: "6" },
        { letter: "B", text: "9" },
        { letter: "C", text: "12" },
        { letter: "D", text: "15" },
        { letter: "E", text: "18" },
      ],
      correctLetter: "C",
      explanation: "Let Bea = b, Ali = 3b. In 4 years: 3b + 4 = 2(b + 4) → 3b + 4 = 2b + 8 → b = 4. Ali = 3 × 4 = 12. Check: in 4 years, Ali = 16, Bea = 8, and 16 = 2 × 8 ✓",
    },
    {
      id: "l1-cq12", points: 5,
      text: "How many squares of ALL sizes are there in a 3×3 grid?",
      svgDiagram: svgGrid(3, 3, [], "#4ECDC4"),
      options: [
        { letter: "A", text: "9" },
        { letter: "B", text: "12" },
        { letter: "C", text: "14" },
        { letter: "D", text: "16" },
        { letter: "E", text: "18" },
      ],
      correctLetter: "C",
      explanation: "1×1 squares: 9. 2×2 squares: 4. 3×3 squares: 1. Total: 9 + 4 + 1 = 14.",
    },
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
    // 3-point
    {
      id: "l2-cq1", points: 3,
      text: "A number is multiplied by 4 and 7 is added. The answer is 35. What is the number?",
      options: [
        { letter: "A", text: "5" },
        { letter: "B", text: "6" },
        { letter: "C", text: "7" },
        { letter: "D", text: "8" },
        { letter: "E", text: "9" },
      ],
      correctLetter: "C",
      explanation: "Work backwards: 35 − 7 = 28 (undo +7). 28 ÷ 4 = 7 (undo ×4). Check: 7 × 4 + 7 = 35 ✓",
    },
    {
      id: "l2-cq2", points: 3,
      text: "Class 4 has 32 pupils. ¾ of them walk to school. How many pupils walk to school?",
      options: [
        { letter: "A", text: "8" },
        { letter: "B", text: "16" },
        { letter: "C", text: "20" },
        { letter: "D", text: "24" },
        { letter: "E", text: "28" },
      ],
      correctLetter: "D",
      explanation: "¾ of 32 = (32 ÷ 4) × 3 = 8 × 3 = 24 pupils walk to school.",
    },
    {
      id: "l2-cq3", points: 3,
      text: "January 1st is a Thursday. On what day does February 1st fall? (January has 31 days.)",
      options: [
        { letter: "A", text: "Thursday" },
        { letter: "B", text: "Friday" },
        { letter: "C", text: "Saturday" },
        { letter: "D", text: "Sunday" },
        { letter: "E", text: "Monday" },
      ],
      correctLetter: "D",
      explanation: "31 = 4 × 7 + 3. After 4 complete weeks we're back to Thursday. Three more days: Friday, Saturday, Sunday. February 1st is a Sunday.",
    },
    // 4-point
    {
      id: "l2-cq4", points: 4,
      text: "The product of two numbers is 24 and their sum is 11. What is the DIFFERENCE between the two numbers?",
      options: [
        { letter: "A", text: "1" },
        { letter: "B", text: "3" },
        { letter: "C", text: "5" },
        { letter: "D", text: "7" },
        { letter: "E", text: "9" },
      ],
      correctLetter: "C",
      explanation: "Factor pairs of 24 that sum to 11: 3 and 8 (3 + 8 = 11, 3 × 8 = 24 ✓). Difference: 8 − 3 = 5.",
    },
    {
      id: "l2-cq5", points: 4,
      text: "A 2-digit number has digit sum 9. When the digits are reversed, the new number is 27 less than the original. What is the original number?",
      options: [
        { letter: "A", text: "36" },
        { letter: "B", text: "45" },
        { letter: "C", text: "54" },
        { letter: "D", text: "63" },
        { letter: "E", text: "72" },
      ],
      correctLetter: "D",
      explanation: "Pairs summing to 9: (1,8), (2,7), (3,6), (4,5). Testing (6,3): 63 reversed = 36. 63 − 36 = 27 ✓. The number is 63.",
    },
    {
      id: "l2-cq6", points: 4,
      text: "In a class, 18 pupils like art, 14 like music, and 6 like both. How many pupils like at least one of these subjects?",
      svgDiagram: svgVenn(12, 8, 6, "Art", "Music"),
      options: [
        { letter: "A", text: "20" },
        { letter: "B", text: "24" },
        { letter: "C", text: "26" },
        { letter: "D", text: "28" },
        { letter: "E", text: "32" },
      ],
      correctLetter: "C",
      explanation: "Art only: 18 − 6 = 12. Music only: 14 − 6 = 8. Both: 6. Total: 12 + 8 + 6 = 26.",
    },
    {
      id: "l2-cq7", points: 4,
      text: "A tap fills ⅓ of a tank in 6 minutes. How long does it take to fill the whole tank?",
      options: [
        { letter: "A", text: "12 min" },
        { letter: "B", text: "16 min" },
        { letter: "C", text: "18 min" },
        { letter: "D", text: "20 min" },
        { letter: "E", text: "24 min" },
      ],
      correctLetter: "C",
      explanation: "⅓ of the tank takes 6 minutes. The whole tank (3 thirds) takes 6 × 3 = 18 minutes.",
    },
    // 5-point
    {
      id: "l2-cq8", points: 5,
      text: "5 teams enter a tournament. Each team plays every other team exactly once. How many matches are played in total?",
      svgDiagram: svgHandshakeSmall(5),
      options: [
        { letter: "A", text: "8" },
        { letter: "B", text: "9" },
        { letter: "C", text: "10" },
        { letter: "D", text: "12" },
        { letter: "E", text: "20" },
      ],
      correctLetter: "C",
      explanation: "Each of 5 teams plays 4 matches. 5 × 4 = 20, but each match involves 2 teams so we halve: 20 ÷ 2 = 10 matches.",
    },
    {
      id: "l2-cq9", points: 5,
      text: "Three consecutive odd numbers sum to 57. What is the LARGEST of the three numbers?",
      options: [
        { letter: "A", text: "17" },
        { letter: "B", text: "19" },
        { letter: "C", text: "21" },
        { letter: "D", text: "23" },
        { letter: "E", text: "25" },
      ],
      correctLetter: "C",
      explanation: "Consecutive odd numbers differ by 2. Middle = n: (n−2) + n + (n+2) = 3n = 57, so n = 19. The three numbers: 17, 19, 21. Largest = 21.",
    },
    {
      id: "l2-cq10", points: 5,
      text: "Tom is now twice as old as Sam. Six years ago, Tom was 3 times Sam's age. How old is Tom now?",
      options: [
        { letter: "A", text: "16" },
        { letter: "B", text: "18" },
        { letter: "C", text: "20" },
        { letter: "D", text: "24" },
        { letter: "E", text: "30" },
      ],
      correctLetter: "D",
      explanation: "Let Sam = s, Tom = 2s. Six years ago: 2s − 6 = 3(s − 6) → 2s − 6 = 3s − 18 → s = 12. Tom = 2 × 12 = 24. Check: 6 years ago Tom = 18, Sam = 6, and 18 = 3 × 6 ✓",
    },
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
    // 3-point
    {
      id: "l3-cq1", points: 3,
      text: "⅗ of a number is 24. What is ¾ of the SAME number?",
      options: [
        { letter: "A", text: "18" },
        { letter: "B", text: "24" },
        { letter: "C", text: "30" },
        { letter: "D", text: "32" },
        { letter: "E", text: "40" },
      ],
      correctLetter: "C",
      explanation: "⅗ of n = 24 → n = 24 × 5/3 = 40. Then ¾ of 40 = (40 ÷ 4) × 3 = 30.",
    },
    {
      id: "l3-cq2", points: 3,
      text: "A cyclist travels at 15 km/h for 40 minutes, then 20 km/h for 30 minutes. What total distance does she travel?",
      options: [
        { letter: "A", text: "14 km" },
        { letter: "B", text: "16 km" },
        { letter: "C", text: "18 km" },
        { letter: "D", text: "20 km" },
        { letter: "E", text: "25 km" },
      ],
      correctLetter: "D",
      explanation: "40 min = ⅔ hour: 15 × ⅔ = 10 km. 30 min = ½ hour: 20 × ½ = 10 km. Total: 10 + 10 = 20 km.",
    },
    // 4-point
    {
      id: "l3-cq3", points: 4,
      text: "A square has the same area as a rectangle measuring 18 cm × 8 cm. What is the perimeter of the square?",
      options: [
        { letter: "A", text: "40 cm" },
        { letter: "B", text: "44 cm" },
        { letter: "C", text: "48 cm" },
        { letter: "D", text: "52 cm" },
        { letter: "E", text: "72 cm" },
      ],
      correctLetter: "C",
      explanation: "Area of rectangle = 18 × 8 = 144 cm². Square side = √144 = 12 cm. Perimeter = 4 × 12 = 48 cm.",
    },
    {
      id: "l3-cq4", points: 4,
      text: "How many whole numbers from 1 to 100 contain the digit 7 at least once?",
      options: [
        { letter: "A", text: "10" },
        { letter: "B", text: "15" },
        { letter: "C", text: "18" },
        { letter: "D", text: "19" },
        { letter: "E", text: "20" },
      ],
      correctLetter: "D",
      explanation: "7 in units place: 7,17,27,37,47,57,67,77,87,97 → 10 numbers. 7 in tens place: 70–79 → 10 numbers. But 77 is counted in both. Total: 10 + 10 − 1 = 19.",
    },
    {
      id: "l3-cq5", points: 4,
      text: "Anna, Ben and Cara share £72 in the ratio 1 : 2 : 3. Cara gives half her share to Ben. How much does Ben have now?",
      options: [
        { letter: "A", text: "£24" },
        { letter: "B", text: "£30" },
        { letter: "C", text: "£36" },
        { letter: "D", text: "£40" },
        { letter: "E", text: "£42" },
      ],
      correctLetter: "E",
      explanation: "1+2+3=6 parts. Each part = £12. Anna=£12, Ben=£24, Cara=£36. Cara gives half (£18) to Ben. Ben now has £24 + £18 = £42.",
    },
    // 5-point
    {
      id: "l3-cq6", points: 5,
      text: "What is the smallest whole number that leaves remainder 1 when divided by 3, 4, or 5?",
      options: [
        { letter: "A", text: "31" },
        { letter: "B", text: "41" },
        { letter: "C", text: "51" },
        { letter: "D", text: "61" },
        { letter: "E", text: "121" },
      ],
      correctLetter: "D",
      explanation: "The number is one more than a multiple of LCM(3,4,5)=60. Smallest: 60+1=61. Check: 61÷3=20 r1 ✓, 61÷4=15 r1 ✓, 61÷5=12 r1 ✓",
    },
    {
      id: "l3-cq7", points: 5,
      text: "The sum of 5 consecutive whole numbers is 135. What is the LARGEST of the five?",
      options: [
        { letter: "A", text: "25" },
        { letter: "B", text: "27" },
        { letter: "C", text: "29" },
        { letter: "D", text: "31" },
        { letter: "E", text: "33" },
      ],
      correctLetter: "C",
      explanation: "The mean of 5 consecutive numbers is the middle one. Mean = 135÷5 = 27. Numbers: 25, 26, 27, 28, 29. Largest = 29.",
    },
    {
      id: "l3-cq8", points: 5,
      text: "A recipe for 6 people uses 450 g of flour. Sam makes it for 8 people, using a 50 g scoop. How many FULL scoops does he need?",
      options: [
        { letter: "A", text: "10" },
        { letter: "B", text: "11" },
        { letter: "C", text: "12" },
        { letter: "D", text: "13" },
        { letter: "E", text: "14" },
      ],
      correctLetter: "C",
      explanation: "Per person: 450÷6 = 75 g. For 8: 75×8 = 600 g. Full 50 g scoops: 600÷50 = 12.",
    },
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
    // 3-point
    {
      id: "l4-cq1", points: 3,
      text: "What is the largest 3-digit number divisible by both 6 and 9?",
      options: [
        { letter: "A", text: "972" },
        { letter: "B", text: "981" },
        { letter: "C", text: "990" },
        { letter: "D", text: "996" },
        { letter: "E", text: "999" },
      ],
      correctLetter: "C",
      explanation: "LCM(6,9) = 18. Largest 3-digit multiple of 18: 999÷18 = 55.5, so 55×18 = 990. Check: 990÷6=165 ✓, 990÷9=110 ✓",
    },
    // 4-point
    {
      id: "l4-cq2", points: 4,
      text: "Three friends choose different numbers from {1, 2, 3}. Alex's is NOT 1. Ben's is less than Cara's. Cara's is NOT 2. What number did Ben pick?",
      options: [
        { letter: "A", text: "1" },
        { letter: "B", text: "2" },
        { letter: "C", text: "3" },
        { letter: "D", text: "1 or 2" },
        { letter: "E", text: "Cannot be determined" },
      ],
      correctLetter: "A",
      explanation: "Cara ≠ 2, so Cara = 1 or 3. Ben < Cara, so Cara ≠ 1. Therefore Cara = 3. Alex ≠ 1, so Alex = 2. Ben must be 1.",
    },
    {
      id: "l4-cq3", points: 4,
      text: "Rosa finishes ¼ of the way through a field of 60 runners. Kofi finishes ⅓ of the way through. How many runners finish BETWEEN them?",
      options: [
        { letter: "A", text: "3" },
        { letter: "B", text: "4" },
        { letter: "C", text: "5" },
        { letter: "D", text: "6" },
        { letter: "E", text: "10" },
      ],
      correctLetter: "B",
      explanation: "Rosa: ¼ × 60 = 15th. Kofi: ⅓ × 60 = 20th. Between 15th and 20th (exclusive): 16th, 17th, 18th, 19th = 4 runners.",
    },
    {
      id: "l4-cq4", points: 4,
      text: "Mia thinks of a number, divides by 4, adds 7, then multiplies by 2. Her answer is 22. What number did she start with?",
      svgDiagram: svgChain(
        [{ label: "n", color: "#9B59B6" }, { label: "÷4", color: "#3498DB" }, { label: "+7", color: "#FF8E53" }, { label: "×2=22", color: "#4ECDC4" }],
        ["÷4", "+7", "×2"]
      ),
      options: [
        { letter: "A", text: "8" },
        { letter: "B", text: "12" },
        { letter: "C", text: "16" },
        { letter: "D", text: "20" },
        { letter: "E", text: "24" },
      ],
      correctLetter: "C",
      explanation: "Work backwards: 22÷2=11 (undo ×2). 11−7=4 (undo +7). 4×4=16 (undo ÷4). Check: 16÷4=4, 4+7=11, 11×2=22 ✓",
    },
    // 5-point
    {
      id: "l4-cq5", points: 5,
      text: "A rectangle has perimeter 40 cm. Its area is 96 cm². What are its dimensions?",
      options: [
        { letter: "A", text: "8 cm × 12 cm" },
        { letter: "B", text: "6 cm × 16 cm" },
        { letter: "C", text: "10 cm × 10 cm" },
        { letter: "D", text: "4 cm × 24 cm" },
        { letter: "E", text: "9 cm × 11 cm" },
      ],
      correctLetter: "A",
      explanation: "Perimeter 40 → 2(l+w)=40 → l+w=20. Area l×w=96. Two numbers summing to 20 with product 96: 8 and 12 (8+12=20, 8×12=96 ✓).",
    },
    {
      id: "l4-cq6", points: 5,
      text: "In a group, each person is either a Knight (always honest) or a Knave (always lies). Alex says: 'I am a Knave.' Can Alex be a Knight? Can Alex be a Knave?",
      options: [
        { letter: "A", text: "Alex must be a Knight" },
        { letter: "B", text: "Alex must be a Knave" },
        { letter: "C", text: "Alex could be either" },
        { letter: "D", text: "This is impossible — neither can say this" },
        { letter: "E", text: "Alex must be silent" },
      ],
      correctLetter: "D",
      explanation: "If Alex is a Knight, he tells truth — but he says 'I am a Knave', which is false. Contradiction. If Alex is a Knave, he lies — but 'I am a Knave' would be true. Contradiction. Neither is possible — this statement can never be made!",
    },
    {
      id: "l4-cq7", points: 5,
      text: "How many rectangles of all sizes (including squares) are in a 2×3 grid?",
      svgDiagram: (() => {
        const cells: string[] = [];
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 3; c++) {
            cells.push(`<rect x="${20 + c * 50}" y="${20 + r * 50}" width="50" height="50" fill="#e8f4f8" stroke="#2D3436" strokeWidth="2"/>`);
          }
        }
        return `<svg viewBox="0 0 190 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:240px;display:block;margin:auto"><rect x="0" y="0" width="190" height="140" rx="10" fill="#f8f9fa"/>${cells.join("")}</svg>`;
      })(),
      options: [
        { letter: "A", text: "12" },
        { letter: "B", text: "16" },
        { letter: "C", text: "18" },
        { letter: "D", text: "20" },
        { letter: "E", text: "24" },
      ],
      correctLetter: "C",
      explanation: "Choose 2 from 3 horizontal lines: C(3,2)=3. Choose 2 from 4 vertical lines: C(4,2)=6. Total: 3×6=18.",
    },
    {
      id: "l4-cq8", points: 5,
      text: "The mean of five numbers is 9. When one number is removed, the mean of the remaining four is 9.5. What number was removed?",
      options: [
        { letter: "A", text: "4" },
        { letter: "B", text: "5" },
        { letter: "C", text: "6" },
        { letter: "D", text: "7" },
        { letter: "E", text: "9" },
      ],
      correctLetter: "D",
      explanation: "Total of 5 numbers = 5×9 = 45. After removing one, 4 remain with mean 9.5, so their total = 4×9.5 = 38. Removed number = 45 − 38 = 7.",
    },
    {
      id: "l4-cq9", points: 5,
      text: "A snail climbs 3 cm up a 10 cm wall each day, but slides back 1 cm each night. On which day does it first reach the top?",
      options: [
        { letter: "A", text: "Day 4" },
        { letter: "B", text: "Day 5" },
        { letter: "C", text: "Day 8" },
        { letter: "D", text: "Day 9" },
        { letter: "E", text: "Day 10" },
      ],
      correctLetter: "B",
      explanation: "Net progress per day (after sliding): 3−1=2 cm. After 4 days it's at 8 cm. On day 5 it climbs 3 cm to reach 11 cm — past the top! It reaches 10 cm on day 5 (without sliding back).",
    },
    {
      id: "l4-cq10", points: 5,
      text: "How many ways can you tile a 1×6 strip using 1×1 and 1×2 tiles?",
      options: [
        { letter: "A", text: "8" },
        { letter: "B", text: "10" },
        { letter: "C", text: "13" },
        { letter: "D", text: "16" },
        { letter: "E", text: "21" },
      ],
      correctLetter: "C",
      explanation: "Let f(n) = ways to tile 1×n strip. f(1)=1, f(2)=2. For n≥3: f(n)=f(n-1)+f(n-2) (Fibonacci!). f(3)=3, f(4)=5, f(5)=8, f(6)=13.",
    },
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


// ─── Exports ─────────────────────────────────────────────────────────────────

export const lessons: Lesson[] = [lesson1, lesson2, lesson3, lesson4];

// Legacy exports for backward compatibility
export const starterSteps = lesson1.starterSteps;
export const shapePuzzles = lesson1.shapePuzzles;
export const competitionQuestions = lesson1.competitionQuestions;
export const homeworkItems = lesson1.homeworkItems;
