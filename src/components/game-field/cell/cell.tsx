import { Figure, Position, SpecialCell } from "types";
import { FIGURE_PATHS } from "consts";
import "./cell.styles.css";
import { isTeamImage } from "@utils/game-utils";
import { useRef, useEffect } from "react";

type CellProps = {
  figure: Figure | null;
  position: Position;
  isSelected: boolean;
  isModernProductsSource: boolean;
  isMatched: boolean;
  isBlocked: boolean;
  specialCell?: SpecialCell;
  onClick: (position: Position) => void;
  onDragStart: (position: Position) => void;
  onDragOver: (position: Position) => void;
  onTouchEnd?: (position: Position) => void;
};

export const Cell = ({
  figure,
  position,
  isSelected,
  isModernProductsSource,
  isMatched,
  isBlocked,
  specialCell,
  onClick,
  onDragStart,
  onDragOver,
  onTouchEnd,
}: CellProps) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchStartTime = useRef<number | null>(null);

  const handleClick = () => {
    if (isBlocked) return;
    onClick(position);
  };

  const handleMouseDown = () => {
    if (isBlocked) return;
    onDragStart(position);
  };

  const handleMouseEnter = () => {
    if (isBlocked) return;
    onDragOver(position);
  };

  // Touch handlers
  useEffect(() => {
    const cellElement = cellRef.current;
    if (!cellElement) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isBlocked) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      touchStartTime.current = Date.now();
      
      onDragStart(position);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isBlocked || !touchStartPos.current) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
      
      // Detect if we're moving enough to be considered a swipe
      if (deltaX > 10 || deltaY > 10) {
        // Determine swipe direction and find adjacent cell
        const direction = getSwipeDirection(
          touchStartPos.current,
          { x: touch.clientX, y: touch.clientY }
        );
        
        const adjacentPosition = getAdjacentPosition(position, direction);
        if (adjacentPosition) {
          onDragOver(adjacentPosition);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isBlocked) return;
      e.preventDefault();
      
      if (touchStartTime.current && onTouchEnd) {
        const touchDuration = Date.now() - touchStartTime.current;
        // Only treat as tap if it was short (not a swipe)
        if (touchDuration < 200) {
          onClick(position);
        }
      }
      
      touchStartPos.current = null;
      touchStartTime.current = null;
    };

    cellElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    cellElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    cellElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    cellElement.addEventListener('touchcancel', () => {
      touchStartPos.current = null;
      touchStartTime.current = null;
    }, { passive: true });

    return () => {
      cellElement.removeEventListener('touchstart', handleTouchStart);
      cellElement.removeEventListener('touchmove', handleTouchMove);
      cellElement.removeEventListener('touchend', handleTouchEnd);
      cellElement.removeEventListener('touchcancel', () => {});
    };
  }, [isBlocked, onClick, onDragStart, onDragOver, onTouchEnd, position]);

  const isStar = figure === "star";
  const isDiamond = figure === "diamond";
  const isTeamBigFigure = figure && (figure === "team" || isTeamImage(figure));

  return (
    <div
      ref={cellRef}
      className={`
        cell 
        ${isSelected ? "cell--selected" : ""}
        ${isModernProductsSource ? "cell--modern-source" : ""}
        ${isMatched && !isStar ? "cell--matched" : ""} 
        ${!figure ? "cell--empty" : ""} 
        ${specialCell ? `cell--${specialCell.type}` : ""} 
        ${isStar ? "cell--star" : ""}
        ${isBlocked ? "cell--blocked" : ""}
      `}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      style={{ 
        pointerEvents: isBlocked ? 'none' : 'auto',
        touchAction: 'manipulation'
      }}
    >
      <div className="cell-content">
        {figure && (
          <img
            src={FIGURE_PATHS[figure]}
            alt={figure}
            className={`
              figure 
              ${isStar ? "figure--star" : ""} 
              ${isDiamond ? "figure--diamond" : ""}
              ${isTeamBigFigure ? "figure--big" : ""}
              ${isTeamImage(figure) ? "figure--big--image" : ""}
            `}
            draggable="false"
          />
        )}
      </div>
    </div>
  );
};

// Helper functions
type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

const getSwipeDirection = (
  start: { x: number; y: number },
  end: { x: number; y: number }
): SwipeDirection => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  if (absDeltaX > absDeltaY && absDeltaX > 10) {
    return deltaX > 0 ? 'right' : 'left';
  } else if (absDeltaY > absDeltaX && absDeltaY > 10) {
    return deltaY > 0 ? 'down' : 'up';
  }
  
  return null;
};

const getAdjacentPosition = (
  position: Position,
  direction: SwipeDirection
): Position | null => {
  switch (direction) {
    case 'left':
      return { row: position.row, col: position.col - 1 };
    case 'right':
      return { row: position.row, col: position.col + 1 };
    case 'up':
      return { row: position.row - 1, col: position.col };
    case 'down':
      return { row: position.row + 1, col: position.col };
    default:
      return null;
  }
};