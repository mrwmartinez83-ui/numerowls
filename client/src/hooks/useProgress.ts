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

const STORAGE_KEY = "numerowls_progress";

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

  const getTotalScore = useCallback((): { correct: number; attempted: number } => {
    let correct = 0;
    let attempted = 0;
    Object.values(progress).forEach((lp) => {
      Object.values(lp).forEach((sec) => {
        correct += (sec as SectionProgress).correct;
        attempted += (sec as SectionProgress).attempted;
      });
    });
    return { correct, attempted };
  }, [progress]);

  const getEarnedBadges = useCallback((): string[] => {
    const badges: string[] = [];
    let totalCorrect = 0;
    let totalAttempted = 0;
    let lessonsCompleted = 0;
    let homeworkCompleted = 0;
    let streakMax = 0;

    Object.values(progress).forEach((lp) => {
      const comp = lp.competition;
      if (comp.attempted > 0) totalAttempted += comp.attempted;
      if (comp.correct > 0) totalCorrect += comp.correct;
      // Check lesson fully attempted
      const sections = Object.values(lp) as SectionProgress[];
      const allAttempted = sections.every((s) => s.attempted >= s.total && s.total > 0);
      if (allAttempted) lessonsCompleted++;
      if (lp.homework.attempted >= lp.homework.total && lp.homework.total > 0) homeworkCompleted++;
      if (lp.starter.attempted > 0) badges.push("first_hoot");
      if (lp.puzzles.attempted > 0) badges.push("puzzle_starter");
      if (comp.correct >= 5) badges.push("star_pupil");
      if (lp.puzzles.attempted >= lp.puzzles.total && lp.puzzles.total > 0) badges.push("puzzle_master");
      const compPct = comp.total > 0 ? (comp.correct / comp.total) * 100 : 0;
      if (compPct >= 80 && comp.total > 0) badges.push("gold_standard");
      const allCorrect = sections.every((s) => s.correct >= s.total && s.total > 0);
      if (allCorrect) badges.push("top_of_tree");
    });

    if (totalCorrect >= 10) badges.push("sharp_shooter");
    if (lessonsCompleted >= 4) badges.push("night_owl");
    if (homeworkCompleted >= 4) badges.push("diamond_owl");
    if (homeworkCompleted >= 1) badges.push("bookworm");

    return Array.from(new Set(badges));
  }, [progress]);

  return {
    progress,
    initLesson,
    recordAnswer,
    resetLesson,
    resetAll,
    getLessonProgress,
    getLessonCompletion,
    getTotalScore,
    getEarnedBadges,
  };
}
