import { useCallback } from "react";
import { Match, Goal, GameModifiers } from "types";

export const useGoals = (
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void
) => {
  const updateGoals = useCallback(
    (foundMatches: Match[], modifiers: GameModifiers) => {
      setGoals((prevGoals) => {
        const newGoals = [...prevGoals];

        foundMatches.forEach((match) => {
          const goalIndex = newGoals.findIndex(
            (goal) => goal.figure === match.figure
          );
          if (goalIndex !== -1) {
            const progressMultiplier = modifiers.doubleGoalProgress ? 2 : 1;
            const progressToAdd = match.positions.length * progressMultiplier;

            newGoals[goalIndex] = {
              ...newGoals[goalIndex],
              collected: Math.min(
                newGoals[goalIndex].collected + progressToAdd,
                newGoals[goalIndex].target
              ),
            };
          }
        });

        return newGoals;
      });
    },
    [setGoals]
  );

  return {
    updateGoals,
  };
};
