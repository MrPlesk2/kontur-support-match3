import { Board, Figure, Level, Position } from "types";
import { BOARD_ROWS, BOARD_COLS } from "consts";
import {
  findAllMatches,
  updateBoardAfterMatches,
  applyGravity,
  willCreateMatch,
  applyHorizontalGravity,
  isTeamImage
} from "@utils/game-utils";
import { shuffleBoardWithoutMatches } from "@utils/board-utils";

export const applyGravityFillLoop = (inputBoard: Board, level?: Level): Board => {
  let board = inputBoard;
  let iterations = 0;
  const maxIterations = 50;

  while (
    board.some((row) => row.some((cell) => cell === null)) &&
    iterations < maxIterations
  ) {
    board = applyGravity(board);
    board = fillEmptySlots(board, level);
    iterations++;
  }

  return board;
};

export const createInitialBoard = (level?: Level): Board => {
  const board: Board = Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLS).fill(null));

  const availableFigures = level?.availableFigures || [
    "pencil",
    "questionBook",
    "openBook",
    "briefcase",
    "bonnet",
  ];

  if (level?.starPositions) {
    level.starPositions.forEach((position: Position) => {
      if (position.row < BOARD_ROWS && position.col < BOARD_COLS) {
        board[position.row][position.col] = "star";
      }
    });
  }

  if (level?.diamondPositions) {
    level.diamondPositions.forEach((position: Position) => {
      if (position.row < BOARD_ROWS && position.col < BOARD_COLS) {
        board[position.row][position.col] = "diamond";
      }
    });
  }

  if (level?.teamPositions) {
    level.teamPositions.forEach((position: Position) => {
      if (position.row < BOARD_ROWS && position.col < BOARD_COLS) {
        board[position.row][position.col] = "team";
      }
    });
  }

  if (level?.teamImagePosition) {
    board[level.teamImagePosition.row][level.teamImagePosition.col] = "teamImage0";
  }

  // Заполняем только верхний ряд
  for (let col = 0; col < BOARD_COLS; col++) {
    if (board[0][col] !== null) continue;

    let attempts = 0;
    let validFigure: Figure | null = null;

    while (!validFigure && attempts < 50) {
      const candidate = availableFigures[Math.floor(Math.random() * availableFigures.length)];
      attempts++;

      if (candidate === "star" || candidate === "diamond" || candidate === "team" || isTeamImage(candidate)) {
        continue;
      }

      const horizontalMatch =
        col >= 2 &&
        board[0][col - 1] === candidate &&
        board[0][col - 2] === candidate;

      if (!horizontalMatch) {
        validFigure = candidate;
      }
    }

    board[0][col] = validFigure || "pencil";
  }

  let finalBoard = applyGravityFillLoop(board, level);

  const matches = findAllMatches(finalBoard);
  if (matches.length > 0) {
    finalBoard = shuffleBoardWithoutMatches(finalBoard, level);
    if (findAllMatches(finalBoard).length > 0) {
      return createInitialBoard(level);
    }
  }

  return finalBoard;
};

export const fillEmptySlots = (board: Board, level?: Level): Board => {
  const newBoard = board.map((row) => [...row]);

  const availableFigures = level?.availableFigures || [
    "pencil",
    "questionBook",
    "openBook",
    "briefcase",
    "bonnet",
  ];

  const figuresWithoutStarsAndDiamondsAndTeam = availableFigures.filter(
    (fig) => fig !== "star" && fig !== "diamond" && fig !== "team" && !isTeamImage(fig)
  );

  // Заполняем только верхний ряд (row 0)
  for (let col = 0; col < BOARD_COLS; col++) {
    if (newBoard[0][col] === null) {
      const randomFigure =
        figuresWithoutStarsAndDiamondsAndTeam[
          Math.floor(Math.random() * figuresWithoutStarsAndDiamondsAndTeam.length)
        ];
      newBoard[0][col] = randomFigure;
    }
  }

  return newBoard;
};

// В файле game-logic/index.ts или отдельном файле

export const hasPossibleMoves = (board: Board): boolean => {
  const rows = board.length;
  const cols = board[0].length;

  // Фигуры, которые нельзя менять местами
  const UNMOVABLE_FIGURES: Figure[] = [
    "team",
    "teamImage0",
    "teamImage1",
    "teamImage2",
    "teamImage3",
  ];

  // Функция проверки, можно ли менять фигуру
  const canSwapFigure = (figure: Figure | null): boolean => {
    if (!figure) return false;
    if (UNMOVABLE_FIGURES.includes(figure)) return false;
    return true;
  };

  // Проверяем все возможные свапы между соседними клетками
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const currentFigure = board[row][col];
      if (!canSwapFigure(currentFigure)) continue;

      // Проверяем свап с правой клеткой
      if (col < cols - 1) {
        const rightFigure = board[row][col + 1];
        if (canSwapFigure(rightFigure)) {
          // Проверяем специальный случай: нельзя менять две звезды между собой
          if (currentFigure === "star" && rightFigure === "star") {
            continue;
          }

          if (currentFigure === "diamond" && rightFigure === "diamond") {
            continue;
          }

          // Меняем фигуры местами
          const tempBoard = board.map(r => [...r]);
          tempBoard[row][col] = rightFigure;
          tempBoard[row][col + 1] = currentFigure;
          
          // Проверяем, создает ли этот свап матч
          const matchesAfterSwap = findAllMatches(tempBoard);
          if (matchesAfterSwap.length > 0) {
            return true;
          }
        }
      }

      // Проверяем свап с нижней клеткой
      if (row < rows - 1) {
        const bottomFigure = board[row + 1][col];
        if (canSwapFigure(bottomFigure)) {
          // Проверяем специальный случай: нельзя менять две звезды между собой
          if (currentFigure === "star" && bottomFigure === "star") {
            continue;
          }

          if (currentFigure === "diamond" && bottomFigure === "diamond") {
            continue;
          }

          // Меняем фигуры местами
          const tempBoard = board.map(r => [...r]);
          tempBoard[row][col] = bottomFigure;
          tempBoard[row + 1][col] = currentFigure;
          
          // Проверяем, создает ли этот свап матч
          const matchesAfterSwap = findAllMatches(tempBoard);
          if (matchesAfterSwap.length > 0) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

export {
  findAllMatches,
  updateBoardAfterMatches,
  applyGravity,
  willCreateMatch,
  shuffleBoardWithoutMatches,
  applyHorizontalGravity,
};