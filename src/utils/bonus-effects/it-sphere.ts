import { Board, Figure, FigureType, Position, SpecialCell } from "types";
import { BOARD_ROWS } from "consts";
import { isTeamImage } from "@utils/game-utils";

const forbidden = new Set<FigureType>([
  "star",
  "diamond",
  "goldenCell",
  "team",
  "teamCell",
  "teamImage0",
  "teamImage1",
  "teamImage2",
  "teamImage3",
]);

// ✅ type guard — теперь TS понимает что f !== null
const isUsable = (f: Figure | null): f is Figure => {
  if (!f) return false;
  if (forbidden.has(f.type)) return false;
  if (isTeamImage(f.type)) return false;
  return true;
};

/** удалить самый частый тип */
export const applyItSphereEffect = (
  board: Board,
  specialCells: SpecialCell[] = []
): {
  board: Board;
  matchedPositions: Position[];
  removedFigures: Array<{ position: Position; figure: Figure }>;
  removedGoldenCells: Position[];
} => {
  const freq = new Map<FigureType, number>();

  // 🔥 считаем частоты
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const f = board[r][c];
      if (isUsable(f)) {
        freq.set(f.type, (freq.get(f.type) || 0) + 1);
      }
    }
  }

  let targetType: FigureType | null = null;
  let max = -1;

  freq.forEach((count, figType) => {
    if (count > max) {
      max = count;
      targetType = figType;
    }
  });

  if (!targetType) {
    return {
      board,
      matchedPositions: [],
      removedFigures: [],
      removedGoldenCells: [],
    };
  }

  const matchedPositions: Position[] = [];
  const removedFigures: Array<{ position: Position; figure: Figure }> = [];
  const removedGoldenCells: Position[] = [];

  const newBoard = board.map((r) => [...r]);

  // 🔥 удаляем все фигуры нужного типа
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < newBoard[r].length; c++) {
      const cell = newBoard[r][c];

      if (cell && cell.type === targetType) {
        const pos = { row: r, col: c };

        matchedPositions.push(pos);
        removedFigures.push({ position: pos, figure: cell });

        newBoard[r][c] = null;

        // golden
        for (let i = 0; i < specialCells.length; i++) {
          const sc = specialCells[i];
          if (
            sc.row === r &&
            sc.col === c &&
            sc.type === "golden" &&
            sc.isActive !== false
          ) {
            removedGoldenCells.push(pos);
            break;
          }
        }
      }
    }
  }

  return {
    board: newBoard,
    matchedPositions,
    removedFigures,
    removedGoldenCells,
  };
};

/** удалить ВСЕ фигуры типа выбранной */
export const applyItSphereAt = (
  board: Board,
  pos: Position,
  _secondPos?: Position,
  specialCells: SpecialCell[] = []
): {
  board: Board;
  matchedPositions: Position[];
  removedFigures: Array<{ position: Position; figure: Figure }>;
  removedGoldenCells: Position[];
} => {
  const { row, col } = pos;

  if (
    row < 0 ||
    col < 0 ||
    row >= BOARD_ROWS ||
    col >= (board[0]?.length ?? 0)
  ) {
    return {
      board,
      matchedPositions: [],
      removedFigures: [],
      removedGoldenCells: [],
    };
  }

  const targetFig = board[row][col];

  if (!isUsable(targetFig)) {
    return {
      board,
      matchedPositions: [],
      removedFigures: [],
      removedGoldenCells: [],
    };
  }

  const targetType = targetFig.type;

  const matchedPositions: Position[] = [];
  const removedFigures: Array<{ position: Position; figure: Figure }> = [];
  const removedGoldenCells: Position[] = [];

  const newBoard = board.map((r) => [...r]);

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < newBoard[r].length; c++) {
      const cell = newBoard[r][c];

      if (cell && cell.type === targetType) {
        const p = { row: r, col: c };

        matchedPositions.push(p);
        removedFigures.push({ position: p, figure: cell });

        newBoard[r][c] = null;

        for (let i = 0; i < specialCells.length; i++) {
          const sc = specialCells[i];
          if (
            sc.row === r &&
            sc.col === c &&
            sc.type === "golden" &&
            sc.isActive !== false
          ) {
            removedGoldenCells.push(p);
            break;
          }
        }
      }
    }
  }

  return {
    board: newBoard,
    matchedPositions,
    removedFigures,
    removedGoldenCells,
  };
};