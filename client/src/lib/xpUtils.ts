// Shared XP and level utility functions
// Kept separate from NavBar to avoid Vite HMR export incompatibility warnings

export const XP_PER_LEVEL = 100;

export function getLevel(xp: number): number {
  return Math.floor((xp ?? 0) / XP_PER_LEVEL) + 1;
}

export function getXpIntoLevel(xp: number): number {
  return (xp ?? 0) % XP_PER_LEVEL;
}
