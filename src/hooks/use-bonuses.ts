import { useCallback } from "react";
import { Bonus, Board, GameModifiers, ActiveBonus } from "types";
import { BONUS_EFFECTS } from "@utils/bonus-effects/effects-registry";

export const useBonuses = (
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void,
  setBoard: (board: Board) => void,
  setIsAnimating: (animating: boolean) => void,
  setModifiers: (modifiers: GameModifiers) => void,
  activeBonus: ActiveBonus | null,
  setActiveBonus: (bonus: ActiveBonus | null) => void
) => {
  const handleBonus = useCallback(
    async (type: Bonus["type"], currentBoard: Board) => {
      const bonusEffect = BONUS_EFFECTS[type];

      if (activeBonus && activeBonus.type !== type) {
        return;
      }

      if (activeBonus?.type === type && activeBonus.isActive) {
        setActiveBonus(null);

        if (bonusEffect.reset) {
          setModifiers(bonusEffect.reset());
        }
        return;
      }

      setBonuses((prevBonuses) => {
        const newBonuses = [...prevBonuses];
        const bonusIndex = newBonuses.findIndex((bonus) => bonus.type === type);

        if (bonusIndex === -1 || newBonuses[bonusIndex].count <= 0) {
          return prevBonuses;
        }

        if (bonusEffect.isInstant) {
          newBonuses[bonusIndex] = {
            ...newBonuses[bonusIndex],
            count: newBonuses[bonusIndex].count - 1,
          };
        }

        return newBonuses;
      });

      setActiveBonus({ type, isActive: true });

      const effectResult = bonusEffect.apply(currentBoard);

      if (bonusEffect.isInstant) {
        const newBoard = effectResult as Board;
        setIsAnimating(true);
        setTimeout(() => {
          setBoard(newBoard);
          setIsAnimating(false);
          setActiveBonus(null);
        }, 500);
      } else {
        const newModifiers = effectResult as GameModifiers;
        setModifiers(newModifiers);
      }
    },
    [
      setBonuses,
      setBoard,
      setIsAnimating,
      setModifiers,
      activeBonus,
      setActiveBonus,
    ]
  );

  const deactivateBonus = useCallback(() => {
    if (activeBonus) {
      const bonusEffect = BONUS_EFFECTS[activeBonus.type];
      if (bonusEffect.reset) {
        setModifiers(bonusEffect.reset());
      }
      setActiveBonus(null);
    }
  }, [activeBonus, setModifiers, setActiveBonus]);

  return {
    handleBonus,
    deactivateBonus,
  };
};
