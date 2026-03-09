/**
 * renderMath — converts fraction notation to properly rendered HTML.
 *
 * Strategy:
 *  1. Common fractions → unicode characters (½, ¾, ⅔ etc.) — perfect in all browsers.
 *  2. Other fractions (7/12, 9/10 etc.) → inline-styled stacked fraction with a
 *     visible horizontal bar, using inline styles so button/parent styles can't override.
 *
 * Safe for dangerouslySetInnerHTML — only inserts known HTML.
 */

const UNICODE_FRACTIONS: Record<string, string> = {
  "1/2":  "½",
  "1/3":  "⅓",
  "2/3":  "⅔",
  "1/4":  "¼",
  "3/4":  "¾",
  "1/5":  "⅕",
  "2/5":  "⅖",
  "3/5":  "⅗",
  "4/5":  "⅘",
  "1/6":  "⅙",
  "5/6":  "⅚",
  "1/7":  "⅐",
  "1/8":  "⅛",
  "3/8":  "⅜",
  "5/8":  "⅝",
  "7/8":  "⅞",
  "1/9":  "⅑",
  "1/10": "⅒",
};

function makeFrac(num: string, den: string): string {
  const key = `${num}/${den}`;
  if (UNICODE_FRACTIONS[key]) return UNICODE_FRACTIONS[key];

  // Use inline styles to ensure the fraction bar always renders correctly,
  // regardless of parent element (button, div, span, etc.)
  return (
    `<span style="display:inline-grid;grid-template-rows:auto auto;text-align:center;font-size:0.82em;vertical-align:middle;margin:0 0.1em;line-height:1.25;" aria-label="${num} over ${den}">` +
      `<span style="display:block;border-bottom:1.5px solid currentColor;padding:0 2px 1px;">${num}</span>` +
      `<span style="display:block;padding:1px 2px 0;">${den}</span>` +
    `</span>`
  );
}

export function renderMath(text: string): string {
  if (!text) return "";

  let result = text;

  // 1. Mixed numbers first: "3 1/2" → "3½"
  result = result.replace(/(\d+)\s+(\d{1,3})\/(\d{1,3})\b/g, (_, whole, num, den) => {
    return whole + makeFrac(num, den);
  });

  // 2. Standalone fractions: "3/4", "7/12" etc.
  //    Skip large numbers (likely years or IDs)
  result = result.replace(/\b(\d{1,3})\/(\d{1,3})\b/g, (match, num, den) => {
    const n = parseInt(num), d = parseInt(den);
    if (n > 99 || d > 99) return match;
    return makeFrac(num, den);
  });

  return result;
}
