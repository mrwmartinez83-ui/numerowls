/**
 * QuestionBrowser — owner/admin only page.
 * Lists every question in the bank with full metadata.
 * Filterable by skill, year group, difficulty, style, and source.
 * Searchable by question text or ID.
 */

import { useState, useMemo } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/_core/hooks/useAuth";
import { QUESTIONS, SKILLS } from "@shared/questionBank";
import type { Question, SkillId, QuestionStyle, QuestionSource } from "@shared/questionBank";
import DiagramRenderer from "@/components/DiagramRenderer";
import { Link } from "wouter";

const STYLE_LABELS: Record<string, string> = {
  "number-pyramid": "Number Pyramid",
  "magic-square": "Magic Square",
  "crossnumber": "Crossnumber",
  "function-machine": "Function Machine",
  "liar-truth-teller": "Liar/Truth-Teller",
  "true-false-statements": "True/False",
  "estimation": "Estimation",
  "probability-language": "Probability Language",
  "counting-shapes": "Counting Shapes",
  "net-3d-shape": "Net of 3D Shape",
  "venn-diagram": "Venn Diagram",
  "pigeonhole": "Pigeonhole",
  "palindrome-counting": "Palindrome Counting",
  "calendar-arithmetic": "Calendar Arithmetic",
  "think-of-a-number": "Think of a Number",
  "seating-arrangements": "Seating Arrangements",
  "pathfinding-grid": "Pathfinding Grid",
  "self-referential": "Self-Referential",
  "arithmetic-comparison": "Arithmetic Comparison",
  "alternating-sequence": "Alternating Sequence",
  "digit-puzzle": "Digit Puzzle",
  "ratio-word-problem": "Ratio Word Problem",
  "fraction-of-shape": "Fraction of Shape",
  "compound-perimeter": "Compound Perimeter",
  "area-border-frame": "Area/Border/Frame",
  "angle-polygon": "Angle/Polygon",
  "symmetry-reflection": "Symmetry/Reflection",
  "folding-origami": "Folding/Origami",
  "tiling-covering": "Tiling/Covering",
  "ordering-by-clues": "Ordering by Clues",
  "conversation-logic": "Conversation Logic",
  "logic-deduction": "Logic Deduction",
  "tournament-table": "Tournament Table",
  "time-arithmetic": "Time Arithmetic",
  "speed-distance-time": "Speed/Distance/Time",
  "percentage-change": "Percentage Change",
  "fraction-ordering": "Fraction Ordering",
  "minimum-for-percentage": "Min for Percentage",
  "consecutive-numbers": "Consecutive Numbers",
  "reverse-operations": "Reverse Operations",
  "weighing-balance": "Weighing Balance",
  "simultaneous-equations": "Simultaneous Equations",
  "3d-counting": "3D Counting",
  "floor-plan-area": "Floor Plan Area",
  "pie-chart": "Pie Chart",
  "mean-average": "Mean/Average",
  "coin-denomination": "Coin Denomination",
  "standard": "Standard",
};

const SOURCE_COLORS: Record<string, string> = {
  jmc: "#5DADE2",
  imc: "#9B59B6",
  pmc: "#2ECC71",
  amc8: "#E74C3C",
  original: "#F5A623",
};

const DIFF_COLORS = ["", "#2ECC71", "#F5A623", "#E74C3C"];
const DIFF_LABELS = ["", "Easy", "Medium", "Hard"];

export default function QuestionBrowser() {
  const { user, isAuthenticated, loading } = useAuth();

  // Filters
  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState<SkillId | "all">("all");
  const [filterYear, setFilterYear] = useState<number | 0>(0);
  const [filterDiff, setFilterDiff] = useState<0 | 1 | 2 | 3>(0);
  const [filterStyle, setFilterStyle] = useState<QuestionStyle | "all">("all");
  const [filterSource, setFilterSource] = useState<QuestionSource | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Derive all unique styles and sources present in the bank
  const allStyles = useMemo(() => {
    const s = new Set<string>();
    QUESTIONS.forEach(q => { if (q.style) s.add(q.style); });
    return Array.from(s).sort();
  }, []);

  const allSources = useMemo(() => {
    const s = new Set<string>();
    QUESTIONS.forEach(q => { if (q.source) s.add(q.source); });
    return Array.from(s).sort();
  }, []);

  // Filtered questions
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return QUESTIONS.filter(question => {
      if (filterSkill !== "all" && question.skill !== filterSkill) return false;
      if (filterYear !== 0 && question.year !== filterYear) return false;
      if (filterDiff !== 0 && question.difficulty !== filterDiff) return false;
      if (filterStyle !== "all" && question.style !== filterStyle) return false;
      if (filterSource !== "all" && question.source !== filterSource) return false;
      if (q && !question.text.toLowerCase().includes(q) && !question.id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filterSkill, filterYear, filterDiff, filterStyle, filterSource]);

  // Stats
  const stats = useMemo(() => {
    const bySkill: Record<string, number> = {};
    const byYear: Record<number, number> = {};
    const byStyle: Record<string, number> = {};
    QUESTIONS.forEach(q => {
      bySkill[q.skill] = (bySkill[q.skill] ?? 0) + 1;
      byYear[q.year] = (byYear[q.year] ?? 0) + 1;
      if (q.style) byStyle[q.style] = (byStyle[q.style] ?? 0) + 1;
    });
    return { bySkill, byYear, byStyle };
  }, []);

  // ── Auth guard ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1B2D", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#B0C4DE", fontSize: "16px" }}>Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1B2D", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "48px" }}>🔒</div>
        <div style={{ color: "white", fontSize: "20px", fontWeight: 700 }}>Admin access only</div>
        <div style={{ color: "#B0C4DE", fontSize: "14px" }}>This page is restricted to site administrators.</div>
        <Link href="/"><button className="no-btn-gold" style={{ marginTop: "8px" }}>← Back to Home</button></Link>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "32px", paddingBottom: "80px", maxWidth: "1200px" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <span style={{ fontSize: "28px" }}>📚</span>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "28px", color: "white", margin: 0 }}>
              Question Bank Browser
            </h1>
            <span style={{ background: "rgba(245,166,35,0.15)", border: "1px solid #F5A623", color: "#F5A623", fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "6px" }}>
              ADMIN ONLY
            </span>
          </div>
          <p style={{ color: "#B0C4DE", margin: 0, fontSize: "14px" }}>
            {QUESTIONS.length} questions total · {filtered.length} shown · Use filters to explore the bank
          </p>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px", marginBottom: "24px" }}>
          {[1,2,3,4,5,6].map(y => (
            <div key={y} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#F5A623" }}>{stats.byYear[y] ?? 0}</div>
              <div style={{ fontSize: "11px", color: "#B0C4DE", fontWeight: 600 }}>Year {y}</div>
            </div>
          ))}
        </div>

        {/* Skill breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "24px" }}>
          {SKILLS.map(sk => (
            <div key={sk.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
              onClick={() => setFilterSkill(filterSkill === sk.id ? "all" : sk.id)}>
              <span style={{ fontSize: "20px" }}>{sk.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: filterSkill === sk.id ? sk.color : "white" }}>{sk.name}</div>
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: sk.color }}>{stats.bySkill[sk.id] ?? 0}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by text or ID…"
            style={{ gridColumn: "1 / -1", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)", color: "white", fontSize: "14px", outline: "none" }}
          />
          {/* Skill */}
          <select value={filterSkill} onChange={e => setFilterSkill(e.target.value as SkillId | "all")} className="no-select">
            <option value="all">All Skills</option>
            {SKILLS.map(sk => <option key={sk.id} value={sk.id}>{sk.icon} {sk.name}</option>)}
          </select>
          {/* Year */}
          <select value={filterYear} onChange={e => setFilterYear(Number(e.target.value))} className="no-select">
            <option value={0}>All Years</option>
            {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
          {/* Difficulty */}
          <select value={filterDiff} onChange={e => setFilterDiff(Number(e.target.value) as 0|1|2|3)} className="no-select">
            <option value={0}>All Difficulties</option>
            <option value={1}>⭐ Easy</option>
            <option value={2}>⭐⭐ Medium</option>
            <option value={3}>⭐⭐⭐ Hard</option>
          </select>
          {/* Style */}
          <select value={filterStyle} onChange={e => setFilterStyle(e.target.value as QuestionStyle | "all")} className="no-select">
            <option value="all">All Styles</option>
            {allStyles.map(s => <option key={s} value={s}>{STYLE_LABELS[s] ?? s}</option>)}
          </select>
          {/* Source */}
          <select value={filterSource} onChange={e => setFilterSource(e.target.value as QuestionSource | "all")} className="no-select">
            <option value="all">All Sources</option>
            {allSources.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
          {/* Reset */}
          <button onClick={() => { setSearch(""); setFilterSkill("all"); setFilterYear(0); setFilterDiff(0); setFilterStyle("all"); setFilterSource("all"); }}
            style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#B0C4DE", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            Reset Filters
          </button>
        </div>

        {/* Results count */}
        <div style={{ fontSize: "13px", color: "#B0C4DE", marginBottom: "12px", fontWeight: 600 }}>
          Showing {filtered.length} of {QUESTIONS.length} questions
        </div>

        {/* Question list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(q => {
            const skill = SKILLS.find(s => s.id === q.skill);
            const isExpanded = expandedId === q.id;
            return (
              <div key={q.id}
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isExpanded ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "12px", overflow: "hidden" }}>

                {/* Collapsed header — always visible */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  style={{ padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "12px" }}>

                  {/* ID badge */}
                  <code style={{ fontSize: "10px", color: "#B0C4DE", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: "5px", whiteSpace: "nowrap", marginTop: "2px", flexShrink: 0 }}>
                    {q.id}
                  </code>

                  {/* Question text preview */}
                  <div style={{ flex: 1, fontSize: "14px", color: "white", fontWeight: 600, lineHeight: 1.4 }}>
                    {q.text.length > 120 ? q.text.slice(0, 120) + "…" : q.text}
                  </div>

                  {/* Metadata badges */}
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
                    {/* Year */}
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#B0C4DE", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: "5px" }}>
                      Y{q.year}
                    </span>
                    {/* Difficulty */}
                    <span style={{ fontSize: "11px", fontWeight: 700, color: DIFF_COLORS[q.difficulty], background: `${DIFF_COLORS[q.difficulty]}22`, padding: "2px 8px", borderRadius: "5px" }}>
                      {DIFF_LABELS[q.difficulty]}
                    </span>
                    {/* Skill */}
                    {skill && (
                      <span style={{ fontSize: "11px", fontWeight: 700, color: skill.color, background: `${skill.color}22`, padding: "2px 8px", borderRadius: "5px" }}>
                        {skill.icon} {skill.name}
                      </span>
                    )}
                    {/* Style */}
                    {q.style && (
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "#9B59B6", background: "rgba(155,89,182,0.12)", padding: "2px 8px", borderRadius: "5px" }}>
                        {STYLE_LABELS[q.style] ?? q.style}
                      </span>
                    )}
                    {/* Source */}
                    {q.source && (
                      <span style={{ fontSize: "10px", fontWeight: 700, color: SOURCE_COLORS[q.source] ?? "#B0C4DE", background: `${SOURCE_COLORS[q.source] ?? "#B0C4DE"}22`, padding: "2px 8px", borderRadius: "5px" }}>
                        {q.source.toUpperCase()}
                      </span>
                    )}
                    {/* Has diagram */}
                    {q.diagram && (
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#4ECDC4", background: "rgba(78,205,196,0.12)", padding: "2px 8px", borderRadius: "5px" }}>
                        📊 diagram
                      </span>
                    )}
                    {/* Points */}
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#F5A623" }}>
                      {q.points}pts
                    </span>
                    {/* Expand chevron */}
                    <span style={{ color: "#B0C4DE", fontSize: "14px", marginLeft: "4px" }}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px" }}>
                    {/* Full question text */}
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "white", lineHeight: 1.6, marginBottom: "12px" }}>
                      {q.text}
                    </div>

                    {/* Diagram */}
                    {q.diagram && (
                      <div style={{ marginBottom: "12px" }}>
                        <DiagramRenderer spec={q.diagram} />
                      </div>
                    )}

                    {/* Options grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "12px" }}>
                      {q.options.map(opt => (
                        <div key={opt} style={{
                          padding: "8px 10px", borderRadius: "8px", textAlign: "center", fontSize: "14px", fontWeight: 600,
                          background: opt === q.answer ? "rgba(46,204,113,0.15)" : "rgba(255,255,255,0.04)",
                          border: `1.5px solid ${opt === q.answer ? "#2ECC71" : "rgba(255,255,255,0.1)"}`,
                          color: opt === q.answer ? "#2ECC71" : "white",
                        }}>
                          {opt === q.answer ? "✓ " : ""}{opt}
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "13px", color: "#B0C4DE", lineHeight: 1.6 }}>
                      💡 <strong style={{ color: "white" }}>Explanation:</strong> {q.explanation}
                    </div>

                    {/* Metadata row */}
                    <div style={{ marginTop: "10px", display: "flex", gap: "12px", fontSize: "12px", color: "#B0C4DE" }}>
                      <span><strong>ID:</strong> <code style={{ color: "#F5A623" }}>{q.id}</code></span>
                      <span><strong>Type:</strong> {q.type}</span>
                      <span><strong>Year:</strong> {q.year}</span>
                      <span><strong>Difficulty:</strong> {q.difficulty}/3</span>
                      <span><strong>Points:</strong> {q.points}</span>
                      {q.style && <span><strong>Style:</strong> {q.style}</span>}
                      {q.source && <span><strong>Source:</strong> {q.source}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#B0C4DE" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "6px" }}>No questions match your filters</div>
            <div style={{ fontSize: "14px" }}>Try adjusting the filters or clearing your search.</div>
          </div>
        )}
      </div>
    </div>
  );
}
