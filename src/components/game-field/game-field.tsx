import { useEffect, useRef, useState } from "react";
import { Cell } from "@components/game-field/cell/cell";
import { Board, Position, Match, SpecialCell } from "types";
import { isBigFigure } from "@utils/game-utils";
import "./game-field.styles.css";

type GameFieldProps = {
  board: Board;
  selectedPosition: Position | null;
  modernProductsSourcePos: Position | null;
  activeBonusType?: string;
  matches: Match[];
  specialCells: SpecialCell[];
  onCellClick: (position: Position) => void;
  onDragStart: (position: Position) => void;
  onDragOver: (position: Position) => void;
};

const createFigureId = () => `figure-${Math.random().toString(36).slice(2)}-${Date.now()}`;

export const GameField = ({
  board,
  selectedPosition,
  modernProductsSourcePos,
  activeBonusType,
  matches,
  specialCells,
  onCellClick,
  onDragStart,
  onDragOver,
}: GameFieldProps) => {
  const [cellIds, setCellIds] = useState<string[][]>(() =>
    board.map((row) => row.map((cell) => (cell ? createFigureId() : "")))
  );
  const cellIdsRef = useRef<string[][]>(cellIds);
  const prevBoardRef = useRef<Board>(board);

  useEffect(() => {
    const prevBoard = prevBoardRef.current;
    const prevIds = cellIdsRef.current;
    const rows = board.length;
    const cols = board[0]?.length || 0;
    const nextIds: string[][] = Array.from({ length: rows }, () => Array(cols).fill(""));

    for (let col = 0; col < cols; col++) {
      const prevColIds: string[] = [];
      for (let row = 0; row < rows; row++) {
        if (prevBoard[row]?.[col] !== null) {
          prevColIds.push(prevIds[row]?.[col] || createFigureId());
        }
      }

      let prevIndex = 0;
      for (let row = 0; row < rows; row++) {
        if (board[row][col] !== null) {
          if (prevIndex < prevColIds.length) {
            nextIds[row][col] = prevColIds[prevIndex];
            prevIndex++;
          } else {
            nextIds[row][col] = createFigureId();
          }
        }
      }
    }

    setCellIds(nextIds);
    cellIdsRef.current = nextIds;
    prevBoardRef.current = board;
  }, [board]);
  const isPartOfMatch = (row: number, col: number): boolean => {
    return matches.some((match) =>
      match.positions.some((pos) => pos.row === row && pos.col === col)
    );
  };

  const getSpecialCell = (
    row: number,
    col: number
  ): SpecialCell | undefined => {
    return specialCells.find(
      (cell) => cell.row === row && cell.col === col && cell.isActive
    );
  };

  // Функция для определения, заблокирована ли клетка большой иконкой
  const isCellBlocked = (row: number, col: number): boolean => {
    // Проверяем все соседние клетки на наличие большой иконки

    const figure = board[row][col];

    if (figure && isBigFigure(figure)) {
      return true;
    }

    return false;
  };

  const CELL_SIZE = 50;
  const CELL_GAP = 10;

  return (
    <div className="field-wrapper" style={{ position: "relative", display: "inline-block" }}>
      <div className="field">
        {board.map((row, rowIndex) =>
          row.map((figure, colIndex) => {
            const specialCell = getSpecialCell(rowIndex, colIndex);
            const isSelected =
              selectedPosition?.row === rowIndex &&
              selectedPosition?.col === colIndex;

            const isModernProductsSource =
              activeBonusType === "modernProducts" &&
              modernProductsSourcePos?.row === rowIndex &&
              modernProductsSourcePos?.col === colIndex;

            const isBlocked = isCellBlocked(rowIndex, colIndex);
            const isMatched = isPartOfMatch(rowIndex, colIndex);
            const figureId = cellIds[rowIndex]?.[colIndex] || "";

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                figure={figure}
                figureId={figureId}
                position={{ row: rowIndex, col: colIndex }}
                isSelected={isSelected}
                isModernProductsSource={isModernProductsSource}
                isMatched={isMatched}
                isBlocked={isBlocked}
                specialCell={specialCell}
                onClick={onCellClick}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
              />
            );
          })
        )}
      </div>
    </div>
  );
};