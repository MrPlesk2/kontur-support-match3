import { useCallback } from "react";
import { Board, Match, GameModifiers, ActiveBonus, Bonus, Goal } from "types";
import { ANIMATION_DURATION } from "consts";
import {
  findAllMatches,
  updateBoardAfterMatches,
  applyGravity,
  fillEmptySlots,
} from "@utils/game-logic";
import { BONUS_EFFECTS } from "@utils/bonus-effects";
import {
  updateGoalsWithModifiers,
  calculateRoundScore,
} from "@utils/modifiers-utils";

export const useMatchProcessing = (
  setBoard: (board: Board) => void,
  setMatches: (matches: Match[]) => void,
  setScore: (updater: (score: number) => number) => void,
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void,
  modifiers: GameModifiers,
  setModifiers: (modifiers: GameModifiers) => void,
  activeBonus: ActiveBonus | null,
  setActiveBonus: (bonus: ActiveBonus | null) => void,
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void
) => {
  const processMatches = useCallback(
    async (currentBoard: Board): Promise<Board> => {
      let boardToProcess = currentBoard;
      let hasMatches = true;
      let totalRoundScore = 0;
      let usedModifiers = false;

      while (hasMatches) {
        const foundMatches = findAllMatches(boardToProcess);

        if (foundMatches.length === 0) {
          hasMatches = false;
          break;
        }

        setGoals((prevGoals) =>
          updateGoalsWithModifiers(prevGoals, foundMatches, modifiers)
        );

        const roundScore = calculateRoundScore(foundMatches, modifiers);
        totalRoundScore += roundScore;

        if (modifiers.doublePoints || modifiers.doubleGoalProgress) {
          usedModifiers = true;
        }

        setMatches(foundMatches);
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));

        boardToProcess = updateBoardAfterMatches(boardToProcess);
        setBoard(boardToProcess);
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));

        setMatches([]);

        boardToProcess = applyGravity(boardToProcess);
        setBoard(boardToProcess);
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));

        boardToProcess = fillEmptySlots(boardToProcess);
        setBoard(boardToProcess);
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));
      }

      if (totalRoundScore > 0) {
        setScore((prevScore) => prevScore + totalRoundScore);
      }

      if (usedModifiers && activeBonus) {
        const bonusEffect = BONUS_EFFECTS[activeBonus.type];

        if (bonusEffect.reset) {
          setModifiers(bonusEffect.reset());
        }

        setActiveBonus(null);

        if (!bonusEffect.isInstant) {
          setBonuses((prevBonuses) => {
            const newBonuses = [...prevBonuses];
            const bonusIndex = newBonuses.findIndex(
              (bonus) => bonus.type === activeBonus.type
            );

            if (bonusIndex !== -1 && newBonuses[bonusIndex].count > 0) {
              newBonuses[bonusIndex] = {
                ...newBonuses[bonusIndex],
                count: newBonuses[bonusIndex].count - 1,
              };
            }

            return newBonuses;
          });
        }
      }

      return boardToProcess;
    },
    [
      setBoard,
      setMatches,
      setScore,
      setGoals,
      modifiers,
      setModifiers,
      setActiveBonus,
      setBonuses,
      activeBonus,
    ]
  );

  return {
    processMatches,
  };
};
