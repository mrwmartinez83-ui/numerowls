import { useState } from "react";
import { COMPETITION_SETS, ALL_COMPETITION_QUESTIONS, type CompetitionQ } from "@/lib/competitionBank";
import type { YearGroup } from "@/lib/competitionBank";

// ── Print styles injected into document head ─────────────────────────────────
const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  #numerowls-print-area, #numerowls-print-area * { visibility: visible !important; }
  #numerowls-print-area { position: fixed; top: 0; left: 0; width: 100%; padding: 0; margin: 0; }
  @page { margin: 1.5cm; size: A4; }
}
`;

const COLORS = {
  navy: "#0F1B2D", card: "#1A2E4A", gold: "#F5A623",
  teal: "#4ECDC4", purple: "#9B59B6", muted: "#B0C4DE",
};

const ptColors: Record<number, string> = { 3: "#4ECDC4", 4: "#F5A623", 5: "#9B59B6" };
const ptLabels: Record<number, string> = { 3: "3 marks", 4: "4 marks", 5: "5 marks" };
const yearGroupColors: Record<string, string> = {
  "Y1-2": "#4ECDC4", "Y3-4": "#F5A623", "Y5-6": "#E74C3C", "Mixed": "#9B59B6",
};

// ── Print preview renderer ───────────────────────────────────────────────────
function PrintPreview({
  questions,
  title,
  showAnswers,
  showExplanations,
  includeAnswerBoxes,
  yearGroup,
  date,
  pupilName,
}: {
  questions: CompetitionQ[];
  title: string;
  showAnswers: boolean;
  showExplanations: boolean;
  includeAnswerBoxes: boolean;
  yearGroup: string;
  date: string;
  pupilName: string;
}) {
  const totalMarks = questions.reduce((s, q) => s + q.points, 0);

  return (
    <div
      id="numerowls-print-area"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#111",
        background: "white",
        padding: "0",
        maxWidth: "210mm",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{
        borderBottom: "3px solid #1A2E4A",
        paddingBottom: 16, marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
            🦉 NumerOwls · Competition Maths
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1A2E4A" }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
            {yearGroup} · {questions.length} questions · {totalMarks} marks total
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 12, marginBottom: 8,
            borderBottom: "1px solid #ccc", paddingBottom: 4,
            minWidth: 200,
          }}>
            <span style={{ color: "#555" }}>Name: </span>
            <span style={{ color: pupilName ? "#111" : "#ccc" }}>
              {pupilName || "_________________________________"}
            </span>
          </div>
          <div style={{ fontSize: 12 }}>
            <span style={{ color: "#555" }}>Date: </span>
            <span>{date || "_____________"}</span>
            <span style={{ marginLeft: 16, color: "#555" }}>Score: </span>
            <span>______/{totalMarks}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        background: "#f8f9fa", border: "1px solid #ddd",
        borderRadius: 6, padding: "10px 16px", marginBottom: 28,
        fontSize: 12, color: "#333", lineHeight: 1.6,
      }}>
        <strong>Instructions:</strong> Choose ONE answer for each question. Circle the letter of your choice.
        Questions are worth 3, 4, or 5 marks as shown. There is no penalty for wrong answers.
        If you are unsure, try to eliminate unlikely options before guessing.
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={q.id} style={{
          marginBottom: showExplanations && !showAnswers ? 32 : 28,
          pageBreakInside: "avoid",
          borderLeft: `4px solid ${ptColors[q.points]}`,
          paddingLeft: 14, paddingBottom: 12,
        }}>
          {/* Question header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              background: "#1A2E4A", color: "white",
              borderRadius: 6, padding: "2px 10px",
              fontSize: 12, fontWeight: 700,
            }}>
              Q{i + 1}
            </span>
            <span style={{
              color: ptColors[q.points], fontSize: 12, fontWeight: 700,
              border: `1px solid ${ptColors[q.points]}`,
              borderRadius: 4, padding: "1px 8px",
            }}>
              {ptLabels[q.points]}
            </span>
          </div>

          {/* Question text */}
          <div style={{
            fontSize: 14, fontWeight: 600, color: "#111",
            lineHeight: 1.7, marginBottom: 12, whiteSpace: "pre-line",
          }}>
            {q.text}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", marginBottom: includeAnswerBoxes ? 12 : 0 }}>
            {q.options.map(opt => (
              <div key={opt.letter} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13,
                background: showAnswers && opt.letter === q.correctLetter ? "#d4edda" : "transparent",
                padding: showAnswers && opt.letter === q.correctLetter ? "2px 8px" : "2px 0",
                borderRadius: 4,
              }}>
                <span style={{
                  width: 22, height: 22,
                  border: "1.5px solid #555",
                  borderRadius: "50%",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 11,
                  background: showAnswers && opt.letter === q.correctLetter ? "#28a745" : "transparent",
                  color: showAnswers && opt.letter === q.correctLetter ? "white" : "#333",
                }}>
                  {opt.letter}
                </span>
                <span style={{
                  fontWeight: showAnswers && opt.letter === q.correctLetter ? 700 : 400,
                }}>
                  {opt.text}
                </span>
              </div>
            ))}
          </div>

          {/* Answer box */}
          {includeAnswerBoxes && !showAnswers && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#555" }}>My answer:</span>
              <div style={{
                width: 32, height: 32, border: "2px solid #ccc",
                borderRadius: 6, display: "inline-block",
              }} />
            </div>
          )}

          {/* Explanation (answer sheet mode) */}
          {showAnswers && showExplanations && (
            <div style={{
              marginTop: 10,
              background: "#e8f4f8", borderRadius: 6,
              padding: "8px 12px", fontSize: 12, color: "#333",
              borderLeft: "3px solid #17a2b8", lineHeight: 1.6,
            }}>
              <strong>Solution:</strong> {q.explanation}
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #ccc", paddingTop: 12, marginTop: 24,
        fontSize: 11, color: "#888", display: "flex", justifyContent: "space-between",
      }}>
        <span>🦉 NumerOwls — numerowls.com — Free competition maths practice</span>
        <span>Questions inspired by PMC · UKMT · Kangourou</span>
      </div>
    </div>
  );
}

// ── Print Worksheet Builder ───────────────────────────────────────────────────
export default function PrintWorksheet() {
  const [selectedSet, setSelectedSet] = useState<string>("set_y34_medium");
  const [customQuestionIds, setCustomQuestionIds] = useState<string[]>([]);
  const [useCustom, setUseCustom] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [includeAnswerBoxes, setIncludeAnswerBoxes] = useState(true);
  const [worksheetTitle, setWorksheetTitle] = useState("");
  const [pupilName, setPupilName] = useState("");
  const [date, setDate] = useState(() => new Date().toLocaleDateString("en-GB"));
  const [preview, setPreview] = useState(false);

  // Inject print styles
  useState(() => {
    const style = document.createElement("style");
    style.textContent = PRINT_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  });

  const set = COMPETITION_SETS.find(s => s.id === selectedSet);
  const questions = useCustom
    ? ALL_COMPETITION_QUESTIONS.filter(q => customQuestionIds.includes(q.id))
    : set?.questions ?? [];

  const title = worksheetTitle || (set ? set.name : "Competition Maths Worksheet");
  const yearGroup = set ? set.yearGroup : "Mixed";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      {!preview ? (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
          <h2 style={{
            fontWeight: 900, fontSize: 24, color: "white",
            margin: "0 0 6px",
          }}>
            📄 Print as Worksheet
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 14, fontWeight: 600, marginBottom: 32 }}>
            Generate a clean, print-ready worksheet for classroom or homework use.
          </p>

          {/* Question set */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 800, color: "white", display: "block", marginBottom: 8 }}>
              Question Set
            </label>
            <select
              value={selectedSet}
              onChange={e => setSelectedSet(e.target.value)}
              style={{
                background: COLORS.card, border: "2px solid rgba(255,255,255,0.12)",
                borderRadius: 12, padding: "12px 16px", width: "100%",
                fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer",
              }}
            >
              {COMPETITION_SETS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.questions.length} questions)</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 800, color: "white", display: "block", marginBottom: 8 }}>
              Worksheet Title (optional)
            </label>
            <input
              type="text"
              value={worksheetTitle}
              onChange={e => setWorksheetTitle(e.target.value)}
              placeholder={title}
              style={{
                background: COLORS.card, border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "12px 16px", width: "100%",
                fontSize: 14, color: "white", fontFamily: "'Nunito', sans-serif",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 800, color: "white", display: "block", marginBottom: 8 }}>
                Pupil Name (optional)
              </label>
              <input
                type="text"
                value={pupilName}
                onChange={e => setPupilName(e.target.value)}
                placeholder="Leave blank for a line"
                style={{
                  background: COLORS.card, border: "2px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, padding: "12px 16px", width: "100%",
                  fontSize: 13, color: "white", fontFamily: "'Nunito', sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 800, color: "white", display: "block", marginBottom: 8 }}>
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  background: COLORS.card, border: "2px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, padding: "12px 16px", width: "100%",
                  fontSize: 13, color: "white", fontFamily: "'Nunito', sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Options */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, fontWeight: 800, color: "white", display: "block", marginBottom: 12 }}>
              Options
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { key: "includeAnswerBoxes", label: "Include answer boxes", value: includeAnswerBoxes, set: setIncludeAnswerBoxes },
                { key: "showAnswers", label: "Show correct answers (answer sheet mode)", value: showAnswers, set: setShowAnswers },
                { key: "showExplanations", label: "Show worked solutions", value: showExplanations, set: setShowExplanations, disabled: !showAnswers },
              ].map(opt => (
                <label key={opt.key} style={{
                  display: "flex", alignItems: "center", gap: 10, cursor: opt.disabled ? "not-allowed" : "pointer",
                  opacity: opt.disabled ? 0.5 : 1,
                }}>
                  <input
                    type="checkbox"
                    checked={opt.value}
                    onChange={e => opt.set(e.target.checked)}
                    disabled={opt.disabled}
                    style={{ width: 16, height: 16, accentColor: COLORS.gold }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: "14px 18px",
            marginBottom: 24, fontSize: 13,
          }}>
            <div style={{ fontWeight: 800, color: "white", marginBottom: 4 }}>
              {showAnswers ? "📋 Answer Sheet" : "📄 Question Sheet"}
            </div>
            <div style={{ color: COLORS.muted }}>
              {questions.length} questions · {questions.reduce((s, q) => s + q.points, 0)} marks total · {yearGroup}
              {showAnswers ? " · With answers" : ""}
              {showAnswers && showExplanations ? " + solutions" : ""}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setPreview(true)}
              style={{
                background: `rgba(78,205,196,0.15)`, border: "2px solid rgba(78,205,196,0.4)",
                borderRadius: 14, padding: "14px 28px",
                fontSize: 14, fontWeight: 800, color: COLORS.teal,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              }}
            >
              👁️ Preview
            </button>
            <button
              onClick={handlePrint}
              style={{
                background: "linear-gradient(135deg, #F5A623, #E8941A)",
                border: "none", borderRadius: 14, padding: "14px 32px",
                fontSize: 15, fontWeight: 900, color: COLORS.navy,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 4px 20px rgba(245,166,35,0.4)",
              }}
            >
              🖨️ Print Now
            </button>
          </div>
        </div>
      ) : (
        /* Preview mode */
        <div>
          <div style={{
            background: COLORS.card, padding: "12px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            <button
              onClick={() => setPreview(false)}
              style={{
                background: "transparent", border: "none",
                color: COLORS.muted, fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              }}
            >
              ← Back to settings
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted }}>
              Print preview
            </span>
            <button
              onClick={handlePrint}
              style={{
                background: "linear-gradient(135deg, #F5A623, #E8941A)",
                border: "none", borderRadius: 10, padding: "10px 24px",
                fontSize: 13, fontWeight: 900, color: COLORS.navy,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              }}
            >
              🖨️ Print
            </button>
          </div>

          <div style={{ background: "#e5e5e5", padding: "24px", minHeight: "100vh" }}>
            <div style={{
              background: "white",
              boxShadow: "0 4px 40px rgba(0,0,0,0.25)",
              borderRadius: 4,
              padding: "24mm 20mm",
              maxWidth: "210mm", margin: "0 auto",
            }}>
              <PrintPreview
                questions={questions}
                title={title}
                showAnswers={showAnswers}
                showExplanations={showExplanations}
                includeAnswerBoxes={includeAnswerBoxes}
                yearGroup={yearGroup}
                date={date}
                pupilName={pupilName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Quick Print Button (embed anywhere) ──────────────────────────────────────
export function QuickPrintButton({
  questions,
  label = "🖨️ Print as Worksheet",
}: {
  questions: CompetitionQ[];
  label?: string;
}) {
  const handlePrint = () => {
    // Open print dialog with just these questions
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1.5px solid rgba(255,255,255,0.12)",
        borderRadius: 10, padding: "8px 16px",
        fontSize: 13, fontWeight: 700, color: "#B0C4DE",
        cursor: "pointer", fontFamily: "'Nunito', sans-serif",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}
