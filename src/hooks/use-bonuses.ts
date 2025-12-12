// hooks/use-bonuses.ts
import { useCallback } from "react";
import { Bonus, Board, ActiveBonus, GameModifiers, Goal } from "types";
import { BONUS_EFFECTS } from "@utils/bonus-effects/effects-registry";

export const useBonuses = (
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void,
  setBoard: (board: Board) => void,
  setIsAnimating: (animating: boolean) => void,
  activeBonus: ActiveBonus | null,
  setActiveBonus: (bonus: ActiveBonus | null) => void,
  setMoves: (updater: (moves: number) => number) => void,
  setModifiers: (modifiers: GameModifiers) => void,
  // новый параметр
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void
) => {
  const handleBonus = useCallback(
    async (type: Bonus["type"], currentBoard: Board) => {
      const bonusEffect = BONUS_EFFECTS[type];

      if (activeBonus?.type === type && activeBonus.isActive) {
        setActiveBonus(null);

        if (bonusEffect.reset) {
          setModifiers(bonusEffect.reset());
        }
        return;
      }

      if (activeBonus && activeBonus.type !== type) {
        const previousBonusEffect = BONUS_EFFECTS[activeBonus.type];
        if (previousBonusEffect.reset) {
          setModifiers(previousBonusEffect.reset());
        }
        setActiveBonus(null);
      }

      setBonuses((prevBonuses) => {
        const bonusIndex = prevBonuses.findIndex(
          (bonus) => bonus.type === type
        );

        if (bonusIndex === -1 || prevBonuses[bonusIndex].count <= 0) {
          return prevBonuses;
        }

        if (!bonusEffect.isInstant) {
          // делаем бонус активным — далее клик по клетке обработает applyAt
          setActiveBonus({ type, isActive: true });

          if (bonusEffect.applyModifiers) {
            setModifiers(bonusEffect.applyModifiers());
          }
          return prevBonuses;
        }

        // --- instant bonus: уменьшаем счётчик и применяем сразу ---
        const newBonuses = [...prevBonuses];
        newBonuses[bonusIndex] = {
          ...newBonuses[bonusIndex],
          count: newBonuses[bonusIndex].count - 1,
        };

        return newBonuses;
      });

      if (bonusEffect.isInstant) {
        const newBoard = bonusEffect.apply(currentBoard);

        // Вызов старого onApply (для ходов) если есть
        if (bonusEffect.onApply) {
          bonusEffect.onApply(setMoves);
        }

        // Вызов нового onApplyGoals (для изменения целей) если есть
        if (bonusEffect.onApplyGoals) {
          bonusEffect.onApplyGoals(setGoals);
        }

        setIsAnimating(true);
        setTimeout(() => {
          setBoard(newBoard);
          setIsAnimating(false);
        }, 500);
      }
    },
    [
      setBonuses,
      setBoard,
      setIsAnimating,
      activeBonus,
      setActiveBonus,
      setMoves,
      setModifiers,
      setGoals, // <-- новый зависимый
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
  }, [activeBonus, setActiveBonus, setModifiers]);

  return {
    handleBonus,
    deactivateBonus,
  };
};
