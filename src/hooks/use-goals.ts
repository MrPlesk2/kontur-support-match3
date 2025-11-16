import { useCallback } from "react";
import { Match, Goal, GameModifiers } from "types";
import { updateGoalsWithModifiers } from "@utils/modifiers-utils";

export const useGoals = (
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void
) => {
  const updateGoals = useCallback(
    (matches: Match[], modifiers: GameModifiers) => {
      setGoals((prevGoals) =>
        updateGoalsWithModifiers(prevGoals, matches, modifiers)
      );
    },
    [setGoals]
  );

  return {
    updateGoals,
  };
};
