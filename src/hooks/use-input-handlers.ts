import { useRef } from "react";
import { 
  Position, 
  Bonus, 
  Board, 
  LevelState, 
  ActiveBonus,
  Match,
  Figure 
} from "types";
import { BONUS_EFFECTS } from "@utils/bonus-effects/effects-registry";
import { applyGravity, fillEmptySlots, findAllMatches } from "@utils/game-logic";
import { ANIMATION_DURATION } from "consts";

type GameBoardState = {
  selectedPosition: Position | null;
  setSelectedPosition: (pos: Position | null) => void;
  isSwapping: boolean;
  setIsSwapping: (swapping: boolean) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  moves: number;
  setMoves: (updater: (moves: number) => number) => void;
  setMatches: (matches: Match[]) => void;
};

type UseInputHandlersProps = {
  levelState: LevelState;
  gameState: GameBoardState;
  areAdjacent: (pos1: Position, pos2: Position) => boolean;
  swapFigures: (
    pos1: Position,
    pos2: Position,
    moves: number,
    setMoves: (updater: (moves: number) => number) => void
  ) => Promise<boolean>;
  handleBonus: (type: Bonus["type"], board: Board) => void;
  board: Board;
  activeBonus: ActiveBonus | null;
  setActiveBonus: (b: ActiveBonus | null) => void;
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void;
  setBoard: (board: Board) => void;
  setIsAnimating: (animating: boolean) => void;
  setMoves: (updater: (moves: number) => number) => void;
  setGoals: (updater: (goals: import("types").Goal[]) => import("types").Goal[]) => void;
  setMatches: (matches: Match[]) => void;
  processMatches?: (board: Board) => Promise<Board>;
};

export const useInputHandlers = ({
  levelState,
  gameState,
  areAdjacent,
  swapFigures,
  handleBonus,
  board,
  activeBonus,
  setActiveBonus,
  setBonuses,
  setBoard,
  setIsAnimating,
  setMoves,
  setGoals,
  setMatches,
  processMatches,
}: UseInputHandlersProps) => {
  const modernSourceRef = useRef<Position | null>(null);

  const applyAndFinalizeBonus = async (
    type: string,
    boardWithHoles: Board,
    matchedPositions: Position[],
    effect: any
  ) => {
    // списываем бонус
    setBonuses((prev) => {
      const next = [...prev];
      const idx = next.findIndex((b) => b.type === type);
      if (idx !== -1 && next[idx].count > 0) {
        next[idx] = { ...next[idx], count: next[idx].count - 1 };
      }
      return next;
    });

    effect?.onApply?.(setMoves);
    effect?.onApplyGoals?.(setGoals);

    setIsAnimating(true);

    try {
      // 1. Показываем анимацию матча для удаляемых фигур
      if (matchedPositions.length > 0) {
        // Создаем временные матчи для анимации
        const tempMatches: Match[] = [];
        
        // Группируем позиции по типу фигур (для it-sphere все одного типа)
        const figureTypes = new Map<Figure, Position[]>();
        
        matchedPositions.forEach(pos => {
          const figure = board[pos.row][pos.col];
          if (figure) {
            if (!figureTypes.has(figure)) {
              figureTypes.set(figure, []);
            }
            figureTypes.get(figure)!.push(pos);
          }
        });
        
        // Создаем матчи для каждого типа фигур
        figureTypes.forEach((positions, figure) => {
          tempMatches.push({
            positions,
            figure
          });
        });
        
        setMatches(tempMatches);
        await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
        setMatches([]);
      }

      // 2. показываем удаление
      setBoard([...boardWithHoles]);
      await new Promise(resolve => setTimeout(resolve, 200));

      // 3. гравитация
      let updatedBoard = applyGravity(boardWithHoles);
      setBoard([...updatedBoard]);
      await new Promise(resolve => setTimeout(resolve, 200));

      // 4. заполнение
      updatedBoard = fillEmptySlots(updatedBoard);
      setBoard([...updatedBoard]);
      await new Promise(resolve => setTimeout(resolve, 200));

      // 5. обработать возможные матчи, если они есть
      if (processMatches) {
        await processMatches(updatedBoard);
      }
    } finally {
      setIsAnimating(false);
      setActiveBonus(null);
      modernSourceRef.current = null;
    }
  };

  const handleCellClick = async (position: Position) => {
    if (
      levelState.isLevelTransition ||
      gameState.isSwapping ||
      gameState.isAnimating ||
      gameState.moves <= 0
    ) {
      return;
    }

    // --- TARGETED BONUS HANDLING ---
    if (activeBonus && activeBonus.isActive && activeBonus.type !== "careerGrowth") {
      const effect = BONUS_EFFECTS[activeBonus.type];
      if (effect?.applyAt) {
        // remoteWork: однонажатие в точке
        if (activeBonus.type === "remoteWork") {
          const result = effect.applyAt(board, position);
          await applyAndFinalizeBonus(activeBonus.type, result.board, result.matchedPositions, effect);
          return;
        }
        // itSphere: однонажатие на фигуру — удаляет все такого типа
        if (activeBonus.type === "itSphere") {
          const result = effect.applyAt(board, position);
          await applyAndFinalizeBonus(activeBonus.type, result.board, result.matchedPositions, effect);
          return;
        }
        // modernProducts: двухшаговый - сначала выбираем исходную фигурку, затем цель
        if (activeBonus.type === "modernProducts") {
          if (!modernSourceRef.current) {
            const fig = board[position.row][position.col];
            if (!fig) return;
            modernSourceRef.current = position;
            return;
          }
          const sourcePos = modernSourceRef.current;
          const result = effect.applyAt(board, sourcePos as Position, position);
          await applyAndFinalizeBonus(activeBonus.type, result.board, result.matchedPositions, effect);
          return;
        }
      }
    }

    // --- EXISTING CLICK / SWAP LOGIC ---
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
    // Разрешаем перетаскивание при активном career-growth
    if (activeBonus && activeBonus.isActive && activeBonus.type !== "careerGrowth") {
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
    // Разрешаем перетаскивание при активном career-growth
    if (activeBonus && activeBonus.isActive && activeBonus.type !== "careerGrowth") {
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

  const resetSelection = () => {
    gameState.setSelectedPosition(null);
    modernSourceRef.current = null;
  };

  return {
    handleCellClick,
    handleDragStart,
    handleDragOver,
    handleUseBonus,
    resetSelection,
  };
};