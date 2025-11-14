import { useState, useEffect } from "react";
import { Position, Bonus, BonusType, LevelState } from "types";
import { LEVELS } from "consts/levels";
import { createInitialBoard } from "@utils/game-logic";
import { useBoardState } from "./use-board-state";
import { useGameState } from "./use-game-state";
import { useGoals } from "./use-goals";
import { useBonuses } from "./use-bonuses";
import { useGameActions } from "./use-game-actions";

export const useGameLogic = () => {
  const { board, setBoard } = useBoardState();
  const gameState = useGameState();

  const [levelState, setLevelState] = useState<LevelState>({
    currentLevel: 1,
    isLevelComplete: false,
    isLevelTransition: false,
    selectedBonuses: [],
  });

  const currentLevel =
    LEVELS.find((level) => level.id === levelState.currentLevel) || LEVELS[0];

  const { updateGoals } = useGoals(gameState.setGoals);
  const { handleBonus, deactivateBonus } = useBonuses(
    gameState.setBonuses,
    setBoard,
    gameState.setIsAnimating,
    gameState.activeBonus,
    gameState.setActiveBonus,
    gameState.setMoves
  );
  const { areAdjacent, swapFigures } = useGameActions(
    board,
    setBoard,
    gameState.setIsSwapping,
    gameState.setIsAnimating,
    gameState.setMatches,
    gameState.setScore,
    updateGoals,
    gameState.modifiers,
    gameState.setModifiers,
    gameState.activeBonus,
    gameState.setActiveBonus,
    gameState.setBonuses
  );

  useEffect(() => {
    if (levelState.isLevelComplete) return;

    const allGoalsCompleted = gameState.goals.every(
      (goal) => goal.collected >= goal.target
    );

    const scoreReached = gameState.score >= currentLevel.requiredScore;

    console.log("Проверка завершения уровня:", {
      goals: gameState.goals,
      allGoalsCompleted,
      score: gameState.score,
      requiredScore: currentLevel.requiredScore,
      scoreReached,
    });

    if (allGoalsCompleted && scoreReached) {
      setTimeout(() => {
        setLevelState((prev) => ({
          ...prev,
          isLevelComplete: true,
          isLevelTransition: true,
        }));
      }, 1000); 
    }
  }, [
    gameState.score,
    gameState.goals,
    levelState.isLevelComplete,
    currentLevel,
  ]);

  useEffect(() => {
    if (gameState.goals.length === 0) {
      gameState.setGoals(currentLevel.goals);
      gameState.setMoves(currentLevel.moves);
    }
  });

  const handleCellClick = (position: Position) => {
    if (
      gameState.isSwapping ||
      gameState.isAnimating ||
      gameState.moves <= 0 ||
      levelState.isLevelTransition
    ) {
      return;
    }

    if (!gameState.selectedPosition) {
      gameState.setSelectedPosition(position);
    } else {
      if (areAdjacent(gameState.selectedPosition, position)) {
        swapFigures(
          gameState.selectedPosition,
          position,
          gameState.moves,
          gameState.setMoves
        );
      }
      gameState.setSelectedPosition(null);
    }
  };

  const handleDragStart = (position: Position) => {
    if (
      gameState.isSwapping ||
      gameState.isAnimating ||
      gameState.moves <= 0 ||
      levelState.isLevelTransition
    ) {
      return;
    }
    gameState.setSelectedPosition(position);
  };

  const handleDragOver = (position: Position) => {
    if (
      !gameState.selectedPosition ||
      gameState.isSwapping ||
      gameState.isAnimating ||
      gameState.moves <= 0 ||
      levelState.isLevelTransition
    ) {
      return;
    }

    if (areAdjacent(gameState.selectedPosition, position)) {
      swapFigures(
        gameState.selectedPosition,
        position,
        gameState.moves,
        gameState.setMoves
      );
      gameState.setSelectedPosition(null);
    }
  };

  const handleUseBonus = (type: Bonus["type"]) => {
    if (gameState.isAnimating || levelState.isLevelTransition) {
      return;
    }
    handleBonus(type, board);
  };

  const handleLevelStart = (selectedBonuses: BonusType[]) => {
    const nextLevel = levelState.currentLevel + 1;
    const nextLevelData = LEVELS.find((level) => level.id === nextLevel);

    if (!nextLevelData) {
      setLevelState((prev) => ({
        ...prev,
        isLevelComplete: false,
        isLevelTransition: false,
      }));
      return;
    }

    gameState.setGoals(nextLevelData.goals);
    gameState.setMoves(nextLevelData.moves);
    gameState.setScore(0);
    gameState.setBonuses(selectedBonuses.map((type) => ({ type, count: 1 })));

    setLevelState((prev) => ({
      ...prev,
      currentLevel: nextLevel,
      isLevelComplete: false,
      isLevelTransition: false,
      selectedBonuses,
    }));

    const newBoard = createInitialBoard();
    setBoard(newBoard);
  };

  const resetSelection = () => gameState.setSelectedPosition(null);

  return {
    board,
    selectedPosition: gameState.selectedPosition,
    isSwapping: gameState.isSwapping,
    isAnimating: gameState.isAnimating,
    matches: gameState.matches,
    score: gameState.score,
    moves: gameState.moves,
    goals: gameState.goals,
    bonuses: gameState.bonuses,
    activeBonus: gameState.activeBonus,
    modifiers: gameState.modifiers,

    levelState,
    currentLevel,

    handleCellClick,
    handleDragStart,
    handleDragOver,
    useBonus: handleUseBonus,
    deactivateBonus,
    resetSelection,
    handleLevelStart,
  };
};
