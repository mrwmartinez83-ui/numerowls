/**
 * DiagramRenderer — renders inline SVG diagrams for competition-style questions.
 * Types are imported from @shared/diagramTypes.
 */

import React from "react";
import type {
  DiagramSpec,
  NumberPyramidSpec,
  MagicSquareSpec,
  CrossnumberSpec,
  VennDiagramSpec,
  PathfindingGridSpec,
  TilingGridSpec,
  FractionShapeSpec,
  AngleShapeSpec,
  SymmetryShapeSpec,
  NetShapeSpec,
  CountingShapesSpec,
  FunctionMachineSpec,
} from "@shared/diagramTypes";

export type { DiagramSpec };

// ─── Colours ─────────────────────────────────────────────────────────────────
const C = {
  bg: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.18)",
  accent: "#F5A623",
  green: "#2ECC71",
  blue: "#5DADE2",
  text: "#FFFFFF",
  muted: "#B0C4DE",
  shaded: "rgba(245,166,35,0.35)",
  shadedStroke: "#F5A623",
  black: "#0F1B2D",
};

// ─── Main component ───────────────────────────────────────────────────────────

interface DiagramRendererProps {
  spec: DiagramSpec;
}

export default function DiagramRenderer({ spec }: DiagramRendererProps) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
    border: `1px solid ${C.border}`,
    margin: "12px 0",
    overflowX: "auto",
  };

  let diagram: React.ReactNode;

  switch (spec.type) {
    case "number-pyramid":
      diagram = <NumberPyramid spec={spec} />;
      break;
    case "magic-square":
      diagram = <MagicSquare spec={spec} />;
      break;
    case "crossnumber":
      diagram = <Crossnumber spec={spec} />;
      break;
    case "venn-diagram":
      diagram = <VennDiagram spec={spec} />;
      break;
    case "pathfinding-grid":
      diagram = <PathfindingGrid spec={spec} />;
      break;
    case "tiling-grid":
      diagram = <TilingGrid spec={spec} />;
      break;
    case "fraction-shape":
      diagram = <FractionShape spec={spec} />;
      break;
    case "angle-shape":
      diagram = <AngleShape spec={spec} />;
      break;
    case "symmetry-shape":
      diagram = <SymmetryShape spec={spec} />;
      break;
    case "net-shape":
      diagram = <NetShape spec={spec} />;
      break;
    case "counting-shapes":
      diagram = <CountingShapes spec={spec} />;
      break;
    case "function-machine":
      diagram = <FunctionMachine spec={spec} />;
      break;
    default:
      return null;
  }

  return <div style={containerStyle}>{diagram}</div>;
}

// ─── Number Pyramid ───────────────────────────────────────────────────────────

function NumberPyramid({ spec }: { spec: NumberPyramidSpec }) {
  const rows = spec.rows;
  const maxCols = Math.max(...rows.map(r => r.length));
  const cellSize = 52;
  const gap = 4;
  const width = maxCols * (cellSize + gap);
  const height = rows.length * (cellSize + gap) + 10;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      {rows.map((row, ri) => {
        const offset = ((maxCols - row.length) / 2) * (cellSize + gap);
        return row.map((val, ci) => {
          const x = offset + ci * (cellSize + gap);
          const y = (rows.length - 1 - ri) * (cellSize + gap);
          const isEmpty = val === null;
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cellSize} height={cellSize} rx={8}
                fill={isEmpty ? "rgba(245,166,35,0.15)" : C.bg}
                stroke={isEmpty ? C.accent : C.border}
                strokeWidth={isEmpty ? 2 : 1.5}
              />
              {val !== null && (
                <text x={x + cellSize / 2} y={y + cellSize / 2 + 6}
                  textAnchor="middle" fill={C.text} fontSize={20} fontWeight={700}>
                  {val}
                </text>
              )}
              {isEmpty && (
                <text x={x + cellSize / 2} y={y + cellSize / 2 + 6}
                  textAnchor="middle" fill={C.accent} fontSize={22} fontWeight={800}>
                  ?
                </text>
              )}
            </g>
          );
        });
      })}
    </svg>
  );
}

// ─── Magic Square ─────────────────────────────────────────────────────────────

function MagicSquare({ spec }: { spec: MagicSquareSpec }) {
  const cells = spec.cells;
  const n = cells.length;
  const cellSize = 56;
  const gap = 2;
  const total = n * cellSize + (n + 1) * gap;

  return (
    <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* Outer border */}
      <rect x={gap} y={gap} width={total - 2 * gap} height={total - 2 * gap}
        rx={8} fill="none" stroke={C.border} strokeWidth={2} />
      {cells.map((row, ri) =>
        row.map((val, ci) => {
          const x = gap + ci * (cellSize + gap);
          const y = gap + ri * (cellSize + gap);
          const isEmpty = val === null;
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cellSize} height={cellSize}
                fill={isEmpty ? "rgba(245,166,35,0.12)" : C.bg}
                stroke={isEmpty ? C.accent : C.border}
                strokeWidth={isEmpty ? 2 : 1}
              />
              {val !== null && (
                <text x={x + cellSize / 2} y={y + cellSize / 2 + 7}
                  textAnchor="middle" fill={C.text} fontSize={22} fontWeight={700}>
                  {val}
                </text>
              )}
              {isEmpty && (
                <text x={x + cellSize / 2} y={y + cellSize / 2 + 7}
                  textAnchor="middle" fill={C.accent} fontSize={24} fontWeight={800}>
                  ?
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

// ─── Crossnumber ─────────────────────────────────────────────────────────────

function Crossnumber({ spec }: { spec: CrossnumberSpec }) {
  const cells = spec.cells;
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const cellSize = 48;
  const total_w = cols * cellSize;
  const total_h = rows * cellSize;

  return (
    <svg width={total_w} height={total_h} viewBox={`0 0 ${total_w} ${total_h}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      {cells.map((row, ri) =>
        row.map((val, ci) => {
          const x = ci * cellSize;
          const y = ri * cellSize;
          const isBlack = val === "#";
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cellSize} height={cellSize}
                fill={isBlack ? "#1a2a3a" : C.bg}
                stroke={C.border} strokeWidth={1.5}
              />
              {!isBlack && val && (
                <text x={x + cellSize / 2} y={y + cellSize / 2 + 7}
                  textAnchor="middle" fill={C.text} fontSize={20} fontWeight={700}>
                  {val}
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

// ─── Venn Diagram ─────────────────────────────────────────────────────────────

function VennDiagram({ spec }: { spec: VennDiagramSpec }) {
  const w = 340, h = 200;
  const r = 80;
  const cx1 = 120, cx2 = 220, cy = 100;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* Circle A */}
      <circle cx={cx1} cy={cy} r={r} fill="rgba(93,173,226,0.15)" stroke={C.blue} strokeWidth={2} />
      {/* Circle B */}
      <circle cx={cx2} cy={cy} r={r} fill="rgba(46,204,113,0.15)" stroke={C.green} strokeWidth={2} />
      {/* Labels */}
      <text x={cx1 - 30} y={30} textAnchor="middle" fill={C.blue} fontSize={13} fontWeight={700}>{spec.labelA}</text>
      <text x={cx2 + 30} y={30} textAnchor="middle" fill={C.green} fontSize={13} fontWeight={700}>{spec.labelB}</text>
      {/* Only A */}
      <text x={cx1 - 28} y={cy + 5} textAnchor="middle" fill={C.text} fontSize={18} fontWeight={800}>{spec.onlyA}</text>
      {/* Both */}
      <text x={(cx1 + cx2) / 2} y={cy + 5} textAnchor="middle" fill={C.accent} fontSize={18} fontWeight={800}>{spec.both}</text>
      {/* Only B */}
      <text x={cx2 + 28} y={cy + 5} textAnchor="middle" fill={C.text} fontSize={18} fontWeight={800}>{spec.onlyB}</text>
      {/* Outside */}
      {spec.outside && (
        <text x={w - 24} y={cy + 5} textAnchor="middle" fill={C.muted} fontSize={14} fontWeight={600}>{spec.outside}</text>
      )}
      {/* Total label */}
      {spec.total && (
        <text x={w / 2} y={h - 8} textAnchor="middle" fill={C.muted} fontSize={12}>Total: {spec.total}</text>
      )}
    </svg>
  );
}

// ─── Pathfinding Grid ─────────────────────────────────────────────────────────

function PathfindingGrid({ spec }: { spec: PathfindingGridSpec }) {
  const { rows, cols, path } = spec;
  const cellSize = 44;
  const w = cols * cellSize;
  const h = rows * cellSize;
  const pathSet = new Set((path ?? []).map(([r, c]) => `${r},${c}`));

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      {Array.from({ length: rows }, (_, ri) =>
        Array.from({ length: cols }, (_, ci) => {
          const x = ci * cellSize;
          const y = ri * cellSize;
          const isStart = ri === rows - 1 && ci === 0;
          const isEnd = ri === 0 && ci === cols - 1;
          const isPath = pathSet.has(`${ri},${ci}`);
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cellSize} height={cellSize}
                fill={isStart || isEnd ? "rgba(245,166,35,0.25)" : isPath ? "rgba(46,204,113,0.15)" : C.bg}
                stroke={C.border} strokeWidth={1.5}
              />
              {isStart && <text x={x + cellSize / 2} y={y + cellSize / 2 + 5} textAnchor="middle" fill={C.accent} fontSize={13} fontWeight={700}>START</text>}
              {isEnd && <text x={x + cellSize / 2} y={y + cellSize / 2 + 5} textAnchor="middle" fill={C.accent} fontSize={13} fontWeight={700}>END</text>}
            </g>
          );
        })
      )}
    </svg>
  );
}

// ─── Tiling Grid ─────────────────────────────────────────────────────────────

function TilingGrid({ spec }: { spec: TilingGridSpec }) {
  const { rows, cols, shaded = [], blocked = [] } = spec;
  const cellSize = 44;
  const w = cols * cellSize;
  const h = rows * cellSize;
  const shadedSet = new Set(shaded.map(([r, c]) => `${r},${c}`));
  const blockedSet = new Set(blocked.map(([r, c]) => `${r},${c}`));

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      {Array.from({ length: rows }, (_, ri) =>
        Array.from({ length: cols }, (_, ci) => {
          const x = ci * cellSize;
          const y = ri * cellSize;
          const isShaded = shadedSet.has(`${ri},${ci}`);
          const isBlocked = blockedSet.has(`${ri},${ci}`);
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cellSize} height={cellSize}
                fill={isBlocked ? "#1a2a3a" : isShaded ? C.shaded : C.bg}
                stroke={C.border} strokeWidth={1.5}
              />
              {isBlocked && (
                <>
                  <line x1={x + 4} y1={y + 4} x2={x + cellSize - 4} y2={y + cellSize - 4} stroke={C.muted} strokeWidth={1.5} />
                  <line x1={x + cellSize - 4} y1={y + 4} x2={x + 4} y2={y + cellSize - 4} stroke={C.muted} strokeWidth={1.5} />
                </>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

// ─── Fraction Shape ───────────────────────────────────────────────────────────

function FractionShape({ spec }: { spec: FractionShapeSpec }) {
  const { shape, parts, shaded, label } = spec;
  const size = 160;
  const shadedSet = new Set(shaded);

  if (shape === "circle") {
    const cx = size / 2, cy = size / 2, r = 68;
    const slices = Array.from({ length: parts }, (_, i) => {
      const startAngle = (i / parts) * 2 * Math.PI - Math.PI / 2;
      const endAngle = ((i + 1) / parts) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = parts === 1 ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      return { d, isShaded: shadedSet.has(i + 1) };
    });
    return (
      <svg width={size} height={size + 24} viewBox={`0 0 ${size} ${size + 24}`} style={{ fontFamily: "Nunito, sans-serif" }}>
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.isShaded ? C.shaded : C.bg} stroke={C.border} strokeWidth={1.5} />
        ))}
        {label && <text x={cx} y={size + 18} textAnchor="middle" fill={C.muted} fontSize={13}>{label}</text>}
      </svg>
    );
  }

  if (shape === "square" || shape === "rectangle") {
    const w = shape === "rectangle" ? 200 : 160;
    const h = 160;
    const cols = parts <= 4 ? parts : Math.ceil(Math.sqrt(parts));
    const rows = Math.ceil(parts / cols);
    const cw = w / cols, ch = h / rows;
    return (
      <svg width={w} height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} style={{ fontFamily: "Nunito, sans-serif" }}>
        {Array.from({ length: parts }, (_, i) => {
          const ri = Math.floor(i / cols), ci = i % cols;
          return (
            <rect key={i} x={ci * cw} y={ri * ch} width={cw} height={ch}
              fill={shadedSet.has(i + 1) ? C.shaded : C.bg}
              stroke={C.border} strokeWidth={1.5}
            />
          );
        })}
        {label && <text x={w / 2} y={h + 18} textAnchor="middle" fill={C.muted} fontSize={13}>{label}</text>}
      </svg>
    );
  }

  if (shape === "triangle") {
    // Equilateral triangle divided into `parts` rows
    const tw = 180, th = 156;
    return (
      <svg width={tw} height={th + 24} viewBox={`0 0 ${tw} ${th + 24}`} style={{ fontFamily: "Nunito, sans-serif" }}>
        <polygon points={`${tw / 2},4 4,${th - 4} ${tw - 4},${th - 4}`}
          fill={shadedSet.has(1) ? C.shaded : C.bg} stroke={C.border} strokeWidth={2} />
        {label && <text x={tw / 2} y={th + 18} textAnchor="middle" fill={C.muted} fontSize={13}>{label}</text>}
      </svg>
    );
  }

  return null;
}

// ─── Angle Shape ─────────────────────────────────────────────────────────────

function AngleShape({ spec }: { spec: AngleShapeSpec }) {
  const { shape, angles, labels } = spec;

  if (shape === "triangle") {
    const w = 220, h = 180;
    // Fixed triangle vertices
    const pts: [number, number][] = [[110, 20], [20, 160], [200, 160]];
    const ptStr = pts.map(([x, y]) => `${x},${y}`).join(" ");
    const angleLabels = angles ?? [];
    const lblPos: [number, number][] = [[110, 42], [38, 148], [182, 148]];
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ fontFamily: "Nunito, sans-serif" }}>
        <polygon points={ptStr} fill={C.bg} stroke={C.border} strokeWidth={2} />
        {angleLabels.map((a, i) => (
          <text key={i} x={lblPos[i][0]} y={lblPos[i][1]} textAnchor="middle"
            fill={a === "?" ? C.accent : C.muted} fontSize={14} fontWeight={a === "?" ? 800 : 600}>
            {a === "?" ? "?" : `${a}°`}
          </text>
        ))}
        {(labels ?? []).map((l, i) => (
          <text key={`lbl-${i}`} x={pts[i][0]} y={pts[i][1] - 8} textAnchor="middle" fill={C.muted} fontSize={12}>{l}</text>
        ))}
      </svg>
    );
  }

  if (shape === "polygon") {
    const n = angles.length;
    const r = 80, cx = 110, cy = 100;
    const pts: [number, number][] = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 2 * Math.PI - Math.PI / 2;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    const ptStr = pts.map(([x, y]) => `${x},${y}`).join(" ");
    return (
      <svg width={220} height={200} viewBox="0 0 220 200" style={{ fontFamily: "Nunito, sans-serif" }}>
        <polygon points={ptStr} fill={C.bg} stroke={C.border} strokeWidth={2} />
        {angles.map((a, i) => {
          const labelR = r + 22;
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          return (
            <text key={i} x={lx} y={ly + 5} textAnchor="middle"
              fill={a === "?" ? C.accent : C.muted} fontSize={13} fontWeight={a === "?" ? 800 : 600}>
              {a === "?" ? "?" : `${a}°`}
            </text>
          );
        })}
      </svg>
    );
  }

  if (shape === "straight-line") {
    return (
      <svg width={280} height={100} viewBox="0 0 280 100" style={{ fontFamily: "Nunito, sans-serif" }}>
        <line x1={20} y1={60} x2={260} y2={60} stroke={C.border} strokeWidth={2} />
        <line x1={140} y1={20} x2={140} y2={60} stroke={C.border} strokeWidth={2} />
        {angles.map((a, i) => (
          <text key={i} x={i === 0 ? 80 : 200} y={50}
            textAnchor="middle" fill={a === "?" ? C.accent : C.muted} fontSize={14} fontWeight={a === "?" ? 800 : 600}>
            {a === "?" ? "?" : `${a}°`}
          </text>
        ))}
      </svg>
    );
  }

  return null;
}

// ─── Symmetry Shape ───────────────────────────────────────────────────────────

function SymmetryShape({ spec }: { spec: SymmetryShapeSpec }) {
  const { shape, letter, lines = [] } = spec;
  const w = 180, h = 180;
  const cx = w / 2, cy = h / 2;

  let shapeEl: React.ReactNode = null;

  if (shape === "hexagon") {
    const r = 72;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * 2 * Math.PI - Math.PI / 2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    shapeEl = <polygon points={pts} fill={C.bg} stroke={C.border} strokeWidth={2} />;
  } else if (shape === "square") {
    shapeEl = <rect x={cx - 65} y={cy - 65} width={130} height={130} fill={C.bg} stroke={C.border} strokeWidth={2} />;
  } else if (shape === "letter" && letter) {
    shapeEl = <text x={cx} y={cy + 30} textAnchor="middle" fill={C.text} fontSize={100} fontWeight={800} fontFamily="Arial">{letter}</text>;
  }

  const lineMap: Record<string, [number, number, number, number]> = {
    h: [20, cy, w - 20, cy],
    v: [cx, 20, cx, h - 20],
    d1: [20, 20, w - 20, h - 20],
    d2: [w - 20, 20, 20, h - 20],
  };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      {shapeEl}
      {lines.map((l, i) => {
        const [x1, y1, x2, y2] = lineMap[l] ?? [0, 0, 0, 0];
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={C.accent} strokeWidth={2} strokeDasharray="6,4" />
        );
      })}
    </svg>
  );
}

// ─── Net Shape ────────────────────────────────────────────────────────────────

function NetShape({ spec }: { spec: NetShapeSpec }) {
  const { netType, grid, label } = spec;
  const cellSize = 44;

  // Default grids for common net types
  const defaultGrids: Record<string, boolean[][]> = {
    cross: [
      [false, true, false],
      [true,  true, true ],
      [false, true, false],
      [false, true, false],
    ],
    strip: [
      [true, true, true, true, true, true],
    ],
    T: [
      [true, true, true],
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ],
    L: [
      [true, false],
      [true, false],
      [true, false],
      [true, true],
    ],
    Z: [
      [true, true, false],
      [false, true, false],
      [false, true, true],
    ],
  };

  const g = grid ?? defaultGrids[netType] ?? defaultGrids.cross;
  const rows = g.length;
  const cols = Math.max(...g.map(r => r.length));
  const w = cols * cellSize;
  const h = rows * cellSize + (label ? 24 : 0);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      {g.map((row, ri) =>
        row.map((present, ci) => {
          if (!present) return null;
          return (
            <rect key={`${ri}-${ci}`}
              x={ci * cellSize} y={ri * cellSize}
              width={cellSize} height={cellSize}
              fill={C.bg} stroke={C.border} strokeWidth={2}
            />
          );
        })
      )}
      {label && (
        <text x={w / 2} y={rows * cellSize + 18} textAnchor="middle" fill={C.muted} fontSize={13}>{label}</text>
      )}
    </svg>
  );
}

// ─── Counting Shapes ─────────────────────────────────────────────────────────

function CountingShapes({ spec }: { spec: CountingShapesSpec }) {
  const vb = spec.viewBox ?? "0 0 200 200";
  return (
    <svg viewBox={vb} width={200} height={200} style={{ fontFamily: "Nunito, sans-serif" }}>
      {spec.shapes.map((s, i) => (
        <path key={i} d={s.d}
          fill={s.fill ?? C.bg}
          stroke={s.stroke ?? C.border}
          strokeWidth={1.5}
        />
      ))}
      {spec.label && (
        <text x="100" y="195" textAnchor="middle" fill={C.muted} fontSize={12}>{spec.label}</text>
      )}
    </svg>
  );
}

// ─── Function Machine ─────────────────────────────────────────────────────────

function FunctionMachine({ spec }: { spec: FunctionMachineSpec }) {
  const { steps, input, output } = spec;
  const boxW = 110, boxH = 44, gap = 30;
  const arrowLen = gap;
  const totalSteps = steps.length;
  const totalW = (input ? boxW + gap : 0) + totalSteps * (boxW + gap) + (output ? boxW : 0);
  const h = boxH + 40;
  let x = 10;

  const elements: React.ReactNode[] = [];

  // Input
  if (input) {
    elements.push(
      <g key="input">
        <rect x={x} y={h / 2 - boxH / 2} width={boxW} height={boxH} rx={8}
          fill="rgba(93,173,226,0.15)" stroke={C.blue} strokeWidth={1.5} />
        <text x={x + boxW / 2} y={h / 2 + 6} textAnchor="middle" fill={C.blue} fontSize={16} fontWeight={700}>{input}</text>
      </g>
    );
    x += boxW;
    elements.push(<line key="arr-in" x1={x} y1={h / 2} x2={x + arrowLen} y2={h / 2} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow)" />);
    x += arrowLen;
  }

  // Steps
  steps.forEach((step, i) => {
    elements.push(
      <g key={`step-${i}`}>
        <rect x={x} y={h / 2 - boxH / 2} width={boxW} height={boxH} rx={8}
          fill="rgba(245,166,35,0.12)" stroke={C.accent} strokeWidth={1.5} />
        <text x={x + boxW / 2} y={h / 2 + 6} textAnchor="middle" fill={C.accent} fontSize={13} fontWeight={700}>{step}</text>
      </g>
    );
    x += boxW;
    if (i < totalSteps - 1 || output) {
      elements.push(<line key={`arr-${i}`} x1={x} y1={h / 2} x2={x + arrowLen} y2={h / 2} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow)" />);
      x += arrowLen;
    }
  });

  // Output
  if (output) {
    elements.push(
      <g key="output">
        <rect x={x} y={h / 2 - boxH / 2} width={boxW} height={boxH} rx={8}
          fill={output === "?" ? "rgba(245,166,35,0.15)" : "rgba(46,204,113,0.15)"}
          stroke={output === "?" ? C.accent : C.green} strokeWidth={1.5} />
        <text x={x + boxW / 2} y={h / 2 + 6} textAnchor="middle"
          fill={output === "?" ? C.accent : C.green} fontSize={16} fontWeight={700}>{output}</text>
      </g>
    );
    x += boxW;
  }

  return (
    <svg width={x + 10} height={h} viewBox={`0 0 ${x + 10} ${h}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={C.muted} />
        </marker>
      </defs>
      {elements}
    </svg>
  );
}
