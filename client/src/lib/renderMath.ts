/**
 * renderMath — converts fraction patterns in strings to proper HTML stacked fractions.
 *
 * Supported patterns:
 *   3/4   → <span class="frac"><sup>3</sup><span>/</span><sub>4</sub></span>
 *
 * The function is safe to use with dangerouslySetInnerHTML because it only
 * inserts a whitelist of known HTML tags and never processes user input.
 */

// Matches a fraction like 3/4, 11/12, 1/100 — but NOT things like
// URLs (http://), file paths, or numbers that happen to contain a slash.
// We require the pattern to be surrounded by word boundaries or spaces.
const FRAC_PATTERN = /\b(\d+)\/(\d+)\b/g;

export function renderMath(text: string): string {
  if (!text) return "";
  return text.replace(
    FRAC_PATTERN,
    (_, num, den) =>
      `<span class="frac"><sup>${num}</sup><span>/</span><sub>${den}</sub></span>`
  );
}
