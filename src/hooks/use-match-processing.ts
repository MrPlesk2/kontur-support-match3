import { useCallback } from "react";
import {
  Board,
  Match,
  GameModifiers,
  ActiveBonus,
  Bonus,
  Goal,
  Level,
  SpecialCell,
  Position,
} from "types";
import { ANIMATION_DURATION, BOARD_ROWS } from "consts";
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

type UseMatchProcessingProps = {
  setBoard: (board: Board) => void;
  setMatches: (matches: Match[]) => void;
  setScore: (updater: (score: number) => number) => void;
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void;
  modifiers: GameModifiers;
  setModifiers: (modifiers: GameModifiers) => void;
  activeBonus: ActiveBonus | null;
  setActiveBonus: (bonus: ActiveBonus | null) => void;
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void;
  currentLevel?: Level;
  onSpecialCellsUpdate?: (specialCells: SpecialCell[]) => void;
};

export const useMatchProcessing = ({
  setBoard,
  setMatches,
  setScore,
  setGoals,
  modifiers,
  setModifiers,
  activeBonus,
  setActiveBonus,
  setBonuses,
  currentLevel,
  onSpecialCellsUpdate,
}: UseMatchProcessingProps) => {
  const processMatches = useCallback(
    async (currentBoard: Board): Promise<Board> => {
      let boardToProcess = currentBoard;
      let hasMatches = true;
      let totalRoundScore = 0;
      let usedModifiers = false;

      const initialSpecialCells = currentLevel?.specialCells || [];
      const updatedSpecialCells = [...initialSpecialCells];

      while (hasMatches) {
        const foundMatches = findAllMatches(boardToProcess);

        // Сначала обрабатываем обычные матчи
        if (foundMatches.length > 0) {
          // Обрабатываем золотые ячейки
          let collectedGoldenCellsInThisRound = 0;

          foundMatches.forEach((match) => {
            match.positions.forEach((position) => {
              const specialCellIndex = updatedSpecialCells.findIndex(
                (cell) =>
                  cell.row === position.row &&
                  cell.col === position.col &&
                  cell.isActive
              );

              if (specialCellIndex !== -1) {
                updatedSpecialCells[specialCellIndex] = {
                  ...updatedSpecialCells[specialCellIndex],
                  isActive: false,
                };
                collectedGoldenCellsInThisRound++;
              }
            });
          });

          if (onSpecialCellsUpdate && updatedSpecialCells.length > 0) {
            onSpecialCellsUpdate(updatedSpecialCells);
          }

          if (collectedGoldenCellsInThisRound > 0) {
            setGoals((prevGoals) => {
              const newGoals = [...prevGoals];
              const goldenGoalIndex = newGoals.findIndex(
                (goal) => goal.figure === "goldenCell"
              );

              if (goldenGoalIndex !== -1) {
                const progressIncrease = modifiers.doubleGoalProgress
                  ? collectedGoldenCellsInThisRound * 2
                  : collectedGoldenCellsInThisRound;

                const newCollected = Math.min(
                  newGoals[goldenGoalIndex].collected + progressIncrease,
                  newGoals[goldenGoalIndex].target
                );

                newGoals[goldenGoalIndex] = {
                  ...newGoals[goldenGoalIndex],
                  collected: newCollected,
                };
              }

              return newGoals;
            });
          }

          // Обновляем цели для обычных фигур
          setGoals((prevGoals) => {
            const goalsWithoutSpecial = prevGoals.filter(
              (goal) => goal.figure !== "goldenCell" && goal.figure !== "star"
            );
            const updatedGoals = updateGoalsWithModifiers(
              goalsWithoutSpecial,
              foundMatches,
              modifiers
            );

            const goldenGoal = prevGoals.find(
              (goal) => goal.figure === "goldenCell"
            );
            const starGoal = prevGoals.find((goal) => goal.figure === "star");
            const result = [...updatedGoals];
            if (goldenGoal) result.push(goldenGoal);
            if (starGoal) result.push(starGoal);
            return result;
          });

          const roundScore = calculateRoundScore(foundMatches, modifiers);
          totalRoundScore += roundScore;

          if (modifiers.doublePoints || modifiers.doubleGoalProgress) {
            usedModifiers = true;
          }

          setMatches(foundMatches);
          await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));

          // Обрабатываем обычные матчи
          boardToProcess = updateBoardAfterMatches(boardToProcess);
          setBoard(boardToProcess);
          await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));

          setMatches([]);

          boardToProcess = applyGravity(boardToProcess);
          setBoard(boardToProcess);
          await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));

          // Заполняем пустые места после матчей
          const tempLevel = currentLevel
            ? {
                ...currentLevel,
                specialCells: updatedSpecialCells,
              }
            : undefined;

          boardToProcess = fillEmptySlots(boardToProcess, tempLevel);
          setBoard(boardToProcess);
          await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));
        }

        // ПОСЛЕ обработки обычных матчей обрабатываем звезды
        let collectedStars = 0;
        const starsToRemove: Position[] = [];

        // Поиск звезд в нижнем ряду для всех уровней
        for (let col = 0; col < boardToProcess[0].length; col++) {
          if (boardToProcess[BOARD_ROWS - 1]?.[col] === "star") {
            starsToRemove.push({ row: BOARD_ROWS - 1, col });
          }
        }

        // Удаляем звезды из нижнего ряда
        if (starsToRemove.length > 0) {
          collectedStars = starsToRemove.length;

          starsToRemove.forEach(({ row, col }) => {
            boardToProcess[row][col] = null;
          });

          // Обновляем цели для звезд
          if (collectedStars > 0) {
            setGoals((prevGoals) => {
              const newGoals = [...prevGoals];
              const starGoalIndex = newGoals.findIndex(
                (goal) => goal.figure === "star"
              );

              if (starGoalIndex !== -1) {
                const progressIncrease = modifiers.doubleGoalProgress
                  ? collectedStars * 2
                  : collectedStars;
                const newCollected = Math.min(
                  newGoals[starGoalIndex].collected + progressIncrease,
                  newGoals[starGoalIndex].target
                );

                newGoals[starGoalIndex] = {
                  ...newGoals[starGoalIndex],
                  collected: newCollected,
                };
              }

              return newGoals;
            });
          }

          // Применяем гравитацию после удаления звезд
          boardToProcess = applyGravity(boardToProcess);
          setBoard([...boardToProcess]);
          await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));

          // Заполняем пустые места новыми фигурами
          const tempLevel = currentLevel
            ? {
                ...currentLevel,
                specialCells: updatedSpecialCells,
              }
            : undefined;

          boardToProcess = fillEmptySlots(boardToProcess, tempLevel);
          setBoard([...boardToProcess]);
          await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));
        }

        // Проверяем, есть ли еще матчи или звезды для обработки
        const newMatches = findAllMatches(boardToProcess);
        const newStarsToRemove = [];
        for (let col = 0; col < boardToProcess[0].length; col++) {
          if (boardToProcess[BOARD_ROWS - 1]?.[col] === "star") {
            newStarsToRemove.push({ row: BOARD_ROWS - 1, col });
          }
        }

        if (newMatches.length === 0 && newStarsToRemove.length === 0) {
          hasMatches = false;
          break;
        }
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
      currentLevel,
      onSpecialCellsUpdate,
    ]
  );

  return {
    processMatches,
  };
};
