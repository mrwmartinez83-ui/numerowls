/**
 * DiagramSpec — shared type definitions for question diagrams.
 * Used by both the question bank (shared/) and the DiagramRenderer component (client/).
 */

export type DiagramSpec =
  | NumberPyramidSpec
  | MagicSquareSpec
  | CrossnumberSpec
  | VennDiagramSpec
  | PathfindingGridSpec
  | TilingGridSpec
  | FractionShapeSpec
  | AngleShapeSpec
  | SymmetryShapeSpec
  | NetShapeSpec
  | CountingShapesSpec
  | FunctionMachineSpec;

export interface NumberPyramidSpec {
  type: "number-pyramid";
  /** Rows from bottom to top. Use null for missing/unknown cells. */
  rows: (number | null)[][];
}

export interface MagicSquareSpec {
  type: "magic-square";
  /** Grid cells row by row. Use null for empty/unknown cells. */
  cells: (number | null)[][];
}

export interface CrossnumberSpec {
  type: "crossnumber";
  /** Grid rows. Use "#" for black squares, "" for empty white, or a digit/letter. */
  cells: string[][];
}

export interface VennDiagramSpec {
  type: "venn-diagram";
  labelA: string;
  labelB: string;
  onlyA: string;
  both: string;
  onlyB: string;
  outside?: string;
  total?: string;
}

export interface PathfindingGridSpec {
  type: "pathfinding-grid";
  rows: number;
  cols: number;
  /** Optional highlighted path as [row, col] pairs (0-indexed from top-left) */
  path?: [number, number][];
}

export interface TilingGridSpec {
  type: "tiling-grid";
  rows: number;
  cols: number;
  /** Cells to shade orange (0-indexed [row, col]) */
  shaded?: [number, number][];
  /** Cells to mark as blocked/black */
  blocked?: [number, number][];
  label?: string;
}

export interface FractionShapeSpec {
  type: "fraction-shape";
  shape: "square" | "rectangle" | "circle" | "triangle";
  /** Total number of equal parts */
  parts: number;
  /** Which parts are shaded (1-indexed) */
  shaded: number[];
  label?: string;
}

export interface AngleShapeSpec {
  type: "angle-shape";
  shape: "triangle" | "polygon" | "straight-line" | "angles-at-point";
  /** Angles in degrees; use "?" for the unknown angle */
  angles: (number | "?")[];
  labels?: string[];
}

export interface SymmetryShapeSpec {
  type: "symmetry-shape";
  shape: "hexagon" | "square" | "rectangle" | "letter" | "custom";
  letter?: string;
  /** Lines of symmetry to draw: "h"=horizontal, "v"=vertical, "d1"=diagonal ↘, "d2"=diagonal ↗ */
  lines?: ("h" | "v" | "d1" | "d2")[];
}

export interface NetShapeSpec {
  type: "net-shape";
  /** Preset net type: "cross" | "strip" | "T" | "L" | "Z" */
  netType: string;
  /** Custom grid (true = cell present). Overrides netType if provided. */
  grid?: boolean[][];
  label?: string;
}

export interface CountingShapesSpec {
  type: "counting-shapes";
  /** SVG path data for each shape to draw */
  shapes: { d: string; fill?: string; stroke?: string }[];
  viewBox?: string;
  label?: string;
}

export interface FunctionMachineSpec {
  type: "function-machine";
  /** Labels for each operation box, e.g. ["× 2", "+ 3"] */
  steps: string[];
  input?: string;
  output?: string;
}
