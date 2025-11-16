import { useState, useEffect, useRef } from "react";
import { Position, Bonus, BonusType, LevelState } from "types";
import { LEVELS } from "consts";
import { getLevelGoals, getLevelMoves } from "@utils/level-utils";
import { createInitialBoard } from "@utils/game-logic";
import { useBoardState } from "./use-board-state";
import { useGameState } from "./use-game-state";
import { useBonuses } from "./use-bonuses";
import { useGameActions } from "./use-game-actions";

export const useGameLogic = () => {
  const { board, setBoard } = useBoardState();
  const gameState = useGameState();

  const isLevelInitialized = useRef(false);

  const [levelState, setLevelState] = useState<LevelState>({
    currentLevel: 1,
    isLevelComplete: false,
    isLevelTransition: true,
    selectedBonuses: [],
  });

  const currentLevel =
    LEVELS.find((level) => level.id === levelState.currentLevel) || LEVELS[0];

  const { handleBonus, deactivateBonus } = useBonuses(
    gameState.setBonuses,
    setBoard,
    gameState.setIsAnimating,
    gameState.activeBonus,
    gameState.setActiveBonus,
    gameState.setMoves,
    gameState.setModifiers
  );

  const { areAdjacent, swapFigures } = useGameActions(
    board,
    setBoard,
    gameState.setIsSwapping,
    gameState.setIsAnimating,
    gameState.setMatches,
    gameState.setScore,
    gameState.setGoals,
    gameState.modifiers,
    gameState.setModifiers,
    gameState.activeBonus,
    gameState.setActiveBonus,
    gameState.setBonuses
  );

  useEffect(() => {
    if (
      levelState.isLevelTransition ||
      levelState.isLevelComplete ||
      !isLevelInitialized.current
    ) {
      return;
    }

    const allGoalsCompleted = gameState.goals.every(
      (goal) => goal.collected >= goal.target
    );

    const scoreReached = gameState.score >= currentLevel.requiredScore;

    if (allGoalsCompleted && scoreReached) {

      setLevelState((prev) => ({
        ...prev,
        isLevelComplete: true,
        isLevelTransition: true,
      }));

      isLevelInitialized.current = false;
    }
  }, [
    gameState.score,
    gameState.goals,
    levelState.isLevelTransition,
    levelState.isLevelComplete,
    levelState.currentLevel,
    currentLevel,
  ]);

  useEffect(() => {
    if (levelState.isLevelTransition) {
      isLevelInitialized.current = false;
      return;
    }

    if (isLevelInitialized.current) return;


    const levelGoals = getLevelGoals(levelState.currentLevel);
    const levelMoves = getLevelMoves(levelState.currentLevel);

    gameState.setGoals(levelGoals.map((goal) => ({ ...goal, collected: 0 })));
    gameState.setMoves(levelMoves);
    gameState.setScore(0);
    gameState.setMatches([]);
    gameState.setSelectedPosition(null);
    gameState.setIsSwapping(false);
    gameState.setIsAnimating(false);
    gameState.setActiveBonus(null);
    gameState.setModifiers({
      doublePoints: false,
      doubleGoalProgress: false,
      extraMoves: 0,
    });

    if (levelState.selectedBonuses.length > 0) {
      const selectedBonusesWithCount = levelState.selectedBonuses.map(
        (type) => ({
          type,
          count: 3,
        })
      );
      gameState.setBonuses(selectedBonusesWithCount);
    } else {
      gameState.setBonuses([]);
    }

    const newBoard = createInitialBoard();
    setBoard(newBoard);

    isLevelInitialized.current = true;

  }, [gameState, levelState.currentLevel, levelState.isLevelTransition, levelState.selectedBonuses, setBoard]);

  const handleCellClick = (position: Position) => {
    if (
      levelState.isLevelTransition ||
      gameState.isSwapping ||
      gameState.isAnimating ||
      gameState.moves <= 0
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
      levelState.isLevelTransition ||
      gameState.isSwapping ||
      gameState.isAnimating ||
      gameState.moves <= 0
    ) {
      return;
    }
    gameState.setSelectedPosition(position);
  };

  const handleDragOver = (position: Position) => {
    if (
      levelState.isLevelTransition ||
      !gameState.selectedPosition ||
      gameState.isSwapping ||
      gameState.isAnimating ||
      gameState.moves <= 0
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
    if (levelState.isLevelTransition || gameState.isAnimating) {
      return;
    }
    handleBonus(type, board);
  };

  const handleLevelStart = (selectedBonuses: BonusType[]) => {

    let nextLevel: number;

    if (levelState.isLevelComplete) {
      nextLevel = levelState.currentLevel + 1;
    } else {
      nextLevel = 1;
    }

    const nextLevelData = LEVELS.find((level) => level.id === nextLevel);

    if (!nextLevelData) {
      // TODO: Показать экран завершения игры
      return;
    }

    console.log(`Запускаем уровень ${nextLevel} с бонусами:`, selectedBonuses);

    setLevelState({
      currentLevel: nextLevel,
      isLevelComplete: false,
      isLevelTransition: false,
      selectedBonuses,
    });

    isLevelInitialized.current = false;
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
