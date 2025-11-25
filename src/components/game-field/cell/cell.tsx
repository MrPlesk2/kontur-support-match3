import { Figure, Position, SpecialCell } from "types";
import { FIGURE_PATHS } from "consts";
import "./cell.styles.css";

type CellProps = {
  figure: Figure | null;
  position: Position;
  isSelected: boolean;
  isMatched: boolean;
  specialCell?: SpecialCell;
  onClick: (position: Position) => void;
  onDragStart: (position: Position) => void;
  onDragOver: (position: Position) => void;
};

export const Cell = ({
  figure,
  position,
  isSelected,
  isMatched,
  specialCell,
  onClick,
  onDragStart,
  onDragOver,
}: CellProps) => {
  const handleClick = () => {
    onClick(position);
  };

  const handleMouseDown = () => {
    onDragStart(position);
  };

  const handleMouseEnter = () => {
    onDragOver(position);
  };

  const isStar = figure === "star";

  return (
    <div
      className={`
        cell 
        ${isSelected ? "cell--selected" : ""}
        ${
          isMatched && !isStar ? "cell--matched" : ""
        }
        ${!figure ? "cell--empty" : ""}
        ${specialCell ? `cell--${specialCell.type}` : ""}
        ${isStar ? "cell--star" : ""}
      `}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      {figure && (
        <img
          src={FIGURE_PATHS[figure]}
          alt={figure}
          className={`figure ${isStar ? "figure--star" : ""}`}
          draggable="false"
        />
      )}
    </div>
  );
};
