// utils/bonus-effects/open-guide.ts
import { Board, Goal } from "types";

/**
 * applyOpenGuideEffect: не меняет доску (можно вернуть board без изменений)
 * onApplyOpenGuide: начисляет +3 к случайной незавершенной цели (collected < target)
 */

export const applyOpenGuideEffect = (board: Board): Board => {
  // не меняем доску — эффект влияет на цели, не на доску
  return board;
};

export const onApplyOpenGuide = (
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void
) => {
  setGoals((prev) => {
    const next = [...prev];
    // найдем индексы незавершённых целей (collected < target)
    const unfinished: number[] = [];
    next.forEach((g, i) => {
      if (g.collected < g.target) unfinished.push(i);
    });

    if (unfinished.length === 0) {
      // нет незавершённых целей — ничего не делаем
      return next;
    }

    // выберем случайную незавершённую цель
    const idx = unfinished[Math.floor(Math.random() * unfinished.length)];
    const goal = next[idx];

    const add = 3;
    next[idx] = {
      ...goal,
      collected: Math.min(goal.target, goal.collected + add),
    };

    return next;
  });
};
