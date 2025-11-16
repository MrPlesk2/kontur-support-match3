import { useMatchProcessing } from "./use-match-processing";
import { useSwapLogic } from "./use-swap-logic";
import { Board, Match, Bonus, ActiveBonus, GameModifiers, Goal } from "types";

export const useGameActions = (
  board: Board,
  setBoard: (board: Board) => void,
  setIsSwapping: (swapping: boolean) => void,
  setIsAnimating: (animating: boolean) => void,
  setMatches: (matches: Match[]) => void,
  setScore: (updater: (score: number) => number) => void,
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void,
  modifiers: GameModifiers,
  setModifiers: (modifiers: GameModifiers) => void,
  activeBonus: ActiveBonus | null,
  setActiveBonus: (bonus: ActiveBonus | null) => void,
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void
) => {
  const { processMatches } = useMatchProcessing(
    setBoard,
    setMatches,
    setScore,
    setGoals,
    modifiers,
    setModifiers,
    activeBonus,
    setActiveBonus,
    setBonuses
  );

  const { areAdjacent, swapFigures } = useSwapLogic(
    board,
    setIsSwapping,
    setIsAnimating,
    setBoard,
    processMatches
  );

  return {
    areAdjacent,
    processMatches,
    swapFigures,
  };
};
