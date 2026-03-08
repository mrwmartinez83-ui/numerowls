# NumerOwls — Platform Plan & Brand Guide

## Brand Identity
- **Name:** NumerOwls
- **Tagline:** "Be wise. Be sharp. Be a NumerOwl."
- **Mascot:** Ollie the Owl — a friendly, wide-eyed owl wearing a graduation cap, holding a pencil
- **Domain:** NumerOwls.com

## Design Philosophy: "Midnight Academy"
A rich, deep-night sky aesthetic — deep navy/indigo backgrounds with warm amber/gold accents,
star/moon motifs, and a sense of a magical school for brilliant young mathematicians.
Feels premium, not childish — like a real competition platform.

### Color Palette (OKLCH for Tailwind 4)
- Background: #0F1B2D (deep navy)
- Surface card: #1A2E4A
- Surface hover: #243B55
- Primary Accent: #F5A623 (warm amber/gold)
- Secondary Accent: #4ECDC4 (teal)
- Success: #2ECC71
- Error: #E74C3C
- Text Primary: #FFFFFF
- Text Secondary: #B0C4DE (light steel blue)
- Star/Sparkle: #FFD700
- Purple accent: #9B59B6

### Typography
- Display + Body: "Nunito" (rounded, friendly, readable for children)
- Numbers/Code: "Space Grotesk" (crisp maths numbers)

### Signature Elements
- Owl mascot SVG
- Star/sparkle decorations (✦ ✧ ⭐)
- Gold badge/medal motifs
- Night sky gradient backgrounds
- Subtle constellation dot patterns on hero sections

## Page Structure (Routes via Wouter)
1. `/` — Landing page (hero with Ollie, features, how it works, CTA)
2. `/practice` — Practice Arena (lesson tabs: Numbers, Shapes, Logic, Mock)
3. `/starter` — Starter Activity (separate warm-up page, "Crack the Code")
4. `/badges` — Badge cabinet + progress dashboard
5. `/compete` — Coming Soon placeholder

## Badge System
Badges earned by completing sections and hitting score thresholds:

### Tier 1 — Bronze (easy to earn, encouraging)
- 🦉 "First Hoot" — Complete your first starter activity
- 🔥 "On Fire" — 3 correct competition answers in a row
- 🧩 "Puzzle Starter" — Solve your first shape puzzle

### Tier 2 — Silver (moderate effort)
- ⭐ "Star Pupil" — Get 5 competition questions correct in one lesson
- 🎯 "Sharp Shooter" — Get 10 competition questions correct total
- 📚 "Bookworm" — Complete all homework in any lesson

### Tier 3 — Gold (real achievement)
- 🏆 "Top of the Tree" — Score 100% on any full lesson
- 💎 "Diamond Owl" — Complete all homework across all 4 lessons
- 🌙 "Night Owl" — Complete all 4 lessons
- 🌟 "Gold Standard" — Score 80%+ on Lesson 4 Mock Competition

## SVG Diagram Rules
- ADD diagrams for: counting objects, balance scales, clock faces, sharing/grouping, 
  grid/pattern questions, spatial arrangements, frog/animal jumps
- DO NOT add for: pure number sequences, arithmetic, simple word problems that are clear without a visual
- Number lines: viewBox min 320px wide, numbers spaced 35px+ apart, font-size ≤ 11px for labels,
  always test at max-width:320px to avoid overlap

## Future Roadmap (not built yet — show as "Coming Soon")
- Teacher portal: create classes, add pupils, view progress reports
- Parent portal: purchase subscription, child gets login
- Competition mode: timed, scored, leaderboard
- Certificates: auto-generated PDF on completion
- "Ask Ollie" AI hint system
