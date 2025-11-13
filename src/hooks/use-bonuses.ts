import { useCallback } from "react";
import { Bonus, Board, ActiveBonus } from "types";
import { BONUS_EFFECTS } from "@utils/bonus-effects/effects-registry";

export const useBonuses = (
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void,
  setBoard: (board: Board) => void,
  setIsAnimating: (animating: boolean) => void,
  activeBonus: ActiveBonus | null,
  setActiveBonus: (bonus: ActiveBonus | null) => void,
  setMoves: (updater: (moves: number) => number) => void
) => {
  const handleBonus = useCallback(
    async (type: Bonus["type"], currentBoard: Board) => {
      const bonusEffect = BONUS_EFFECTS[type];

      if (activeBonus && activeBonus.type !== type) {
        return;
      }

      if (activeBonus?.type === type && activeBonus.isActive) {
        setActiveBonus(null);
        return;
      }

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

      setActiveBonus({ type, isActive: true });

      const newBoard = bonusEffect.apply(currentBoard);

      if (bonusEffect.isInstant) {
        if (bonusEffect.onApply) {
          bonusEffect.onApply(setMoves);
        }

        setIsAnimating(true);
        setTimeout(() => {
          setBoard(newBoard);
          setIsAnimating(false);
          setActiveBonus(null);
        }, 500);
      } else {
        setBoard(newBoard);
      }
    },
    [
      setBonuses,
      setBoard,
      setIsAnimating,
      activeBonus,
      setActiveBonus,
      setMoves,
    ]
  );

  const deactivateBonus = useCallback(() => {
    setActiveBonus(null);
  }, [setActiveBonus]);

  return {
    handleBonus,
    deactivateBonus,
  };
};
