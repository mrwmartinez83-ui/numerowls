/**
 * Question Parameterisation Engine
 * ─────────────────────────────────
 * Allows questions to have randomised numerical values each session,
 * so students cannot memorise answers.
 *
 * Usage:
 *   1. Add a `params` generator function to a question in the bank.
 *   2. Call `instantiate(question)` before displaying it.
 *   3. The returned Question has all {slots} replaced with real numbers,
 *      the correct answer recomputed, and fresh distractors generated.
 *
 * Questions without `params` are returned unchanged.
 */

import type { Question } from "./questionBank";

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * A ParamSet is the output of a params generator.
 * It contains:
 *   - vars: named values to substitute into {slot} placeholders in the text
 *   - answer: the correct answer (as a string, matching options format)
 *   - options: all 5 answer options (must include the correct answer)
 *   - explanation: the worked explanation with real numbers
 */
export interface ParamSet {
  vars: Record<string, string | number>;
  answer: string;
  options: string[];
  explanation: string;
}

/**
 * A ParameterisedQuestion is a Question with an optional `params` generator.
 * The generator receives a seeded random function and returns a ParamSet.
 */
export interface ParameterisedQuestion extends Question {
  params?: (rand: RandFn) => ParamSet;
}

/** A seeded random function — returns a float in [0, 1) */
export type RandFn = () => number;

// ─── Seeded PRNG (Mulberry32) ─────────────────────────────────────────────────
// Using a seeded PRNG means the same session seed always produces the same
// numbers, so refreshing mid-question doesn't change the values.

function mulberry32(seed: number): RandFn {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a random integer in [min, max] inclusive */
export function randInt(rand: RandFn, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/** Pick a random element from an array */
export function randChoice<T>(rand: RandFn, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

/** Shuffle an array (Fisher-Yates) */
export function shuffle<T>(rand: RandFn, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate a session seed from the current date (day-level granularity).
 * This means numbers change daily but stay consistent within a session.
 * Pass an optional extra salt (e.g. question ID) to get per-question variation.
 */
export function sessionSeed(questionId: string): number {
  const today = new Date();
  const datePart = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Simple hash of questionId
  let hash = 0;
  for (let i = 0; i < questionId.length; i++) {
    hash = ((hash << 5) - hash + questionId.charCodeAt(i)) | 0;
  }
  return (datePart ^ Math.abs(hash)) >>> 0;
}

// ─── Template substitution ────────────────────────────────────────────────────

/**
 * Replace {slot} placeholders in a template string with values from vars.
 * e.g. "What is {a} + {b}?" with vars {a: 7, b: 5} → "What is 7 + 5?"
 */
function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = vars[key];
    return val !== undefined ? String(val) : `{${key}}`;
  });
}

// ─── Main instantiate function ────────────────────────────────────────────────

/**
 * Instantiate a question with randomised parameters.
 * If the question has no `params` generator, returns it unchanged.
 * Otherwise, generates fresh values and substitutes them into the question.
 */
export function instantiate(q: ParameterisedQuestion): Question {
  if (!q.params) return q;

  const seed = sessionSeed(q.id);
  const rand = mulberry32(seed);
  const paramSet = q.params(rand);

  // Substitute vars into text
  const text = fillTemplate(q.text, paramSet.vars);

  // Substitute vars into options (some options may also contain {slots})
  const options = paramSet.options.map(opt => fillTemplate(opt, paramSet.vars));

  // Substitute vars into explanation
  const explanation = fillTemplate(paramSet.explanation, paramSet.vars);

  // The answer must be one of the options (after substitution)
  const answer = fillTemplate(paramSet.answer, paramSet.vars);

  return {
    ...q,
    text,
    options,
    answer,
    explanation,
  };
}

/**
 * Instantiate an array of questions.
 * Non-parameterised questions pass through unchanged.
 */
export function instantiateAll(questions: ParameterisedQuestion[]): Question[] {
  return questions.map(instantiate);
}
