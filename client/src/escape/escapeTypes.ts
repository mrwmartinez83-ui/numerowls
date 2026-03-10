// ─── Escape Room Engine Types ───────────────────────────────────────────────

export type PuzzleType =
  | "cipher_lock"       // Enter a 3-4 digit code derived from solving sub-clues
  | "combination_dial"  // Rotate dials to correct values
  | "pattern_sequence"  // Find the next number(s) in a sequence
  | "logic_grid"        // Deduce values from a set of clues
  | "word_code"         // Solve maths, map answers to letters, spell a word
  | "number_balance"    // Balance scales by finding missing values
  | "coordinate_lock"   // Plot points, read off a hidden number
  | "prime_cipher"      // Use prime factorisation to decode
  | "fraction_dial"     // Order fractions to reveal a code
  | "algebra_vault";    // Solve simultaneous-style equations

export interface Hint {
  text: string;
  cost: number; // penalty in seconds (shown to group as "this hint costs 30 seconds")
}

export interface PuzzleClue {
  id: string;
  label: string;       // e.g. "Clue A", "Dial 1"
  question: string;    // rendered as rich text / JSX
  answer: number | string;
  visual?: string;     // emoji or SVG key for visual
}

export interface EscapePuzzle {
  type: PuzzleType;
  title: string;
  flavourText: string;   // story-flavoured instruction
  clues: PuzzleClue[];
  lockCode: string;      // the final answer to enter (derived from clues)
  hints: Hint[];
  successText: string;   // story text shown on unlock
}

export interface EscapeStage {
  id: number;
  name: string;
  scene: string;         // emoji scene description
  sceneEmoji: string;    // large atmospheric emoji
  storyIntro: string;    // narrative text before puzzle
  puzzle: EscapePuzzle;
  storyOutro: string;    // narrative text after solving
}

export interface EscapeRoom {
  id: string;
  tier: "bronze" | "silver" | "gold";
  title: string;
  subtitle: string;
  theme: string;
  emoji: string;
  color: string;
  bgGradient: string;
  yearRange: string;
  description: string;
  storyIntro: string;    // opening cinematic
  storyOutro: string;    // final escape text
  stages: EscapeStage[];
  generate: () => EscapeRoom; // regenerate with new random values
}

// ─── Utility helpers ─────────────────────────────────────────────────────────

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
  return true;
}

export function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (n > 1) {
    while (n % d === 0) { factors.push(d); n /= d; }
    d++;
  }
  return factors;
}

// Map a number 1-26 to a letter A-Z
export function numToLetter(n: number): string {
  return String.fromCharCode(64 + ((((n - 1) % 26) + 26) % 26 + 1));
}

// Pad a number to a fixed width string
export function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}
