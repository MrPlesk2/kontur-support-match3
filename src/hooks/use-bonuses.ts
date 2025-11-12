import { useCallback } from "react";
import { Bonus, Board, GameModifiers } from "types";
import {
  applyFriendlyTeamEffect,
  applyBarbellEffect,
  applyCareerGrowthEffect,
} from "@utils/bonus-effects";

export const useBonuses = (
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void,
  setBoard: (board: Board) => void,
  setIsAnimating: (animating: boolean) => void,
  setModifiers: (modifiers: GameModifiers) => void
) => {
  const handleBonus = useCallback(
    async (type: Bonus["type"], currentBoard: Board) => {
      setBonuses((prevBonuses) => {
        const newBonuses = [...prevBonuses];
        const bonusIndex = newBonuses.findIndex((bonus) => bonus.type === type);

        if (bonusIndex === -1 || newBonuses[bonusIndex].count <= 0) {
          return prevBonuses;
        }

        newBonuses[bonusIndex] = {
          ...newBonuses[bonusIndex],
          count: newBonuses[bonusIndex].count - 1,
        };

        return newBonuses;
      });

      if (type === "barbell") {
        const newBoard = applyBarbellEffect(currentBoard);
        setIsAnimating(true);
        setTimeout(() => {
          setBoard(newBoard);
          setIsAnimating(false);
        }, 500);
      } else if (type === "friendlyTeam") {
        const newBoard = applyFriendlyTeamEffect(currentBoard);
        setIsAnimating(true);
        setTimeout(() => {
          setBoard(newBoard);
          setIsAnimating(false);
        }, 500);
      } else if (type === "careerGrowth") {
        const newModifiers = applyCareerGrowthEffect();
        setModifiers(newModifiers);
        console.log("Модификаторы активированы:", newModifiers);
      }

      console.log(`Использован бонус: ${type}`);
    },
    [setBonuses, setBoard, setIsAnimating, setModifiers]
  );

  return {
    handleBonus,
  };
};
