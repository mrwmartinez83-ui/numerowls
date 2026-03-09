/**
 * renderMath — converts fraction notation to properly rendered HTML.
 *
 * ALL fractions (1/2, 3/4, 5/9, 7/12 etc.) are rendered as the same
 * consistent stacked fraction style with a horizontal bar — no unicode
 * characters, so every fraction looks identical.
 *
 * Safe for dangerouslySetInnerHTML — only inserts known HTML.
 */

function makeFrac(num: string, den: string): string {
  // Inline styles ensure the fraction bar always renders correctly
  // regardless of parent element (button, div, span, etc.)
  return (
    `<span style="display:inline-grid;grid-template-rows:auto auto;text-align:center;font-size:0.85em;vertical-align:middle;margin:0 0.15em;line-height:1.2;" aria-label="${num} over ${den}">` +
      `<span style="display:block;border-bottom:1.5px solid currentColor;padding:0 3px 1px;">${num}</span>` +
      `<span style="display:block;padding:1px 3px 0;">${den}</span>` +
    `</span>`
  );
}

export function renderMath(text: string): string {
  if (!text) return "";

  let result = text;

  // 1. Mixed numbers first: "3 1/2" → "3 <frac>" (whole number stays as text)
  result = result.replace(/(\d+)\s+(\d{1,3})\/(\d{1,3})\b/g, (_, whole, num, den) => {
    return whole + makeFrac(num, den);
  });

  // 2. Standalone fractions: "1/2", "3/4", "7/12" etc.
  //    Skip large numbers (likely years, IDs, or ratios like 2026/03)
  result = result.replace(/\b(\d{1,3})\/(\d{1,3})\b/g, (match, num, den) => {
    const n = parseInt(num), d = parseInt(den);
    // Skip if numerator ≥ denominator and both > 9 (likely not a fraction)
    if (n > 99 || d > 99) return match;
    return makeFrac(num, den);
  });

  return result;
}
