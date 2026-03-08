# NumerOwls Platform Architecture Plan

## Vision
A competition maths skills development platform for Years 1–6.
Pupils practise skills, take timed tests, earn certificates and badges,
appear on a leaderboard, and tackle a Problem of the Week.
Teachers manage classes, set work, and track scores.
Parents can eventually pay for direct access.

---

## User Roles
| Role | Access |
|------|--------|
| **Guest** | Landing page, skill previews |
| **Pupil** | Pupil dashboard, practice, timed tests, leaderboard, POTW |
| **Teacher** | Teacher dashboard, class management, set work, view scores |
| **Admin** | (future) full platform management |

For now: single localStorage-based "session" per role (no real auth yet).
Switching role via a simple role-picker on the landing page.

---

## Pages & Routes
| Route | Page | Role |
|-------|------|------|
| `/` | Landing | Guest |
| `/pupil` | Pupil Dashboard | Pupil |
| `/practice/:skillId` | Skill Practice | Pupil |
| `/test` | Timed Test | Pupil |
| `/certificate` | Certificate | Pupil |
| `/leaderboard` | Leaderboard | All |
| `/potw` | Problem of the Week | All |
| `/teacher` | Teacher Dashboard | Teacher |
| `/badges` | Badge Collection | Pupil |

---

## Skill Categories (replacing "lessons")
Each skill has a name, icon, colour, year range, and question bank.

| ID | Name | Icon | Years | Colour |
|----|------|------|-------|--------|
| `counting` | Counting & Sequences | 🔢 | 1–3 | #4ECDC4 |
| `addition` | Addition & Subtraction | ➕ | 1–4 | #F5A623 |
| `multiplication` | Multiplication & Division | ✖️ | 2–6 | #9B59B6 |
| `fractions` | Fractions & Decimals | 🍕 | 3–6 | #E74C3C |
| `shapes` | Shapes & Geometry | 🔷 | 1–6 | #3498DB |
| `patterns` | Patterns & Algebra | 🔄 | 1–6 | #2ECC71 |
| `logic` | Logic & Word Problems | 🧠 | 1–6 | #F39C12 |
| `puzzles` | Shape Value Puzzles | 🧩 | 1–6 | #E91E63 |
| `measurement` | Measurement & Data | 📏 | 2–6 | #00BCD4 |
| `time` | Time & Calendar | 🕐 | 1–4 | #FF5722 |

---

## Question Structure
```ts
interface Question {
  id: string;
  skill: SkillId;
  year: 1 | 2 | 3 | 4 | 5 | 6;
  difficulty: 1 | 2 | 3;  // 1=easy, 2=medium, 3=hard
  type: "mcq" | "puzzle" | "open";
  text: string;
  diagram?: string;  // SVG string — ONLY for questions that genuinely need it
  options?: string[];  // MCQ only
  answer: string;
  explanation: string;
  points: 3 | 4 | 5;
}
```

**Diagram rule:** Only include diagrams for:
- Balance scale puzzles
- Shape/geometry questions
- Sharing/grouping problems
- Clock face questions
- Grid/array questions
NO diagrams for: sequences, word problems that can be understood from text alone.

---

## Timed Test Structure
- Pupil selects: Year group + Duration (5 / 10 / 15 min)
- System selects 10–24 questions from that year's bank
- Mix of skill categories
- Auto-marked on submit
- Score stored in localStorage
- Certificate generated if score ≥ 60%

---

## Badge System (10 badges)
| Badge | Trigger |
|-------|---------|
| First Hoot 🦉 | Complete first practice session |
| Sharp Shooter 🎯 | Get 5 correct in a row |
| Speed Demon ⚡ | Complete a timed test |
| Puzzle Master 🧩 | Solve all puzzles in a skill |
| Gold Standard 🥇 | Score 80%+ on a timed test |
| Diamond Owl 💎 | Score 100% on a timed test |
| Weekly Warrior 📅 | Answer Problem of the Week |
| All-Rounder 🌟 | Practice 5 different skills |
| Top of the Tree 🌳 | Reach top 3 on leaderboard |
| Night Owl 🌙 | Complete all skills for your year |

---

## Leaderboard
- Stored in localStorage (simulated multi-pupil with seed data)
- Columns: Rank, Name, Year, Total Points, Badges, Last Active
- Filterable by year group
- Pupil's own row highlighted

---

## Problem of the Week
- One special question per week (hardcoded for now, date-keyed)
- Bonus points for correct answer
- Shows previous weeks' answers

---

## Teacher Dashboard
- "Classes" tab: list of classes with pupil count
- "Pupils" tab: per-pupil score breakdown by skill
- "Set Work" tab: assign a skill or test to a class
- "Scores" tab: sortable table of all results
- Uses seed data to simulate a real class

---

## Certificate
- Generated in-browser as a styled HTML div
- Shows: pupil name, test name, score, date, NumerOwls branding
- Print-friendly CSS

---

## Data Storage (localStorage keys)
```
numerowls_role         "pupil" | "teacher"
numerowls_pupil_name   string
numerowls_pupil_year   1-6
numerowls_scores       { testId: { score, total, date, certificate } }[]
numerowls_skill_progress  { skillId: { attempted, correct }[] }
numerowls_badges       string[]
numerowls_potw         { weekKey: boolean }
```
