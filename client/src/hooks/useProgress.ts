import { useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SectionProgress {
  attempted: number;
  correct: number;
  total: number;
}

export interface LessonProgress {
  starter: SectionProgress;
  puzzles: SectionProgress;
  competition: SectionProgress;
  homework: SectionProgress;
}

export interface AllProgress {
  [lessonId: string]: LessonProgress;
}

const STORAGE_KEY = "kangaroo_maths_progress";

const defaultSection = (total: number): SectionProgress => ({
  attempted: 0,
  correct: 0,
  total,
});

const defaultLesson = (): LessonProgress => ({
  starter: defaultSection(0),
  puzzles: defaultSection(0),
  competition: defaultSection(0),
  homework: defaultSection(0),
});

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useProgress() {
  const [progress, setProgress] = useState<AllProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const save = useCallback((updated: AllProgress) => {
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }, []);

  const initLesson = useCallback(
    (lessonId: string, totals: { starter: number; puzzles: number; competition: number; homework: number }) => {
      setProgress((prev) => {
        if (prev[lessonId]) return prev;
        const updated = {
          ...prev,
          [lessonId]: {
            starter: defaultSection(totals.starter),
            puzzles: defaultSection(totals.puzzles),
            competition: defaultSection(totals.competition),
            homework: defaultSection(totals.homework),
          },
        };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
    },
    []
  );

  const recordAnswer = useCallback(
    (lessonId: string, section: keyof LessonProgress, isCorrect: boolean) => {
      setProgress((prev) => {
        const lesson = prev[lessonId] || defaultLesson();
        const sec = lesson[section];
        const updated: AllProgress = {
          ...prev,
          [lessonId]: {
            ...lesson,
            [section]: {
              ...sec,
              attempted: sec.attempted + 1,
              correct: sec.correct + (isCorrect ? 1 : 0),
            },
          },
        };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
    },
    []
  );

  const resetLesson = useCallback(
    (lessonId: string) => {
      setProgress((prev) => {
        const updated = { ...prev };
        delete updated[lessonId];
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
    },
    []
  );

  const resetAll = useCallback(() => {
    save({});
  }, [save]);

  const getLessonProgress = useCallback(
    (lessonId: string): LessonProgress | null => {
      return progress[lessonId] || null;
    },
    [progress]
  );

  const getLessonCompletion = useCallback(
    (lessonId: string): number => {
      const lp = progress[lessonId];
      if (!lp) return 0;
      const sections = Object.values(lp) as SectionProgress[];
      const totalAttempted = sections.reduce((s, sec) => s + sec.attempted, 0);
      const totalItems = sections.reduce((s, sec) => s + sec.total, 0);
      if (totalItems === 0) return 0;
      return Math.round((totalAttempted / totalItems) * 100);
    },
    [progress]
  );

  return {
    progress,
    initLesson,
    recordAnswer,
    resetLesson,
    resetAll,
    getLessonProgress,
    getLessonCompletion,
  };
}
