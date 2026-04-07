import { Board, Figure, FigureType } from "types";
import { BOARD_ROWS, BOARD_COLS } from "consts";
import { isTeamImage } from "@utils/game-utils";

const promoteTeamImage = (
  figure: Figure,
  nextType: Extract<FigureType, "teamImage1" | "teamImage2" | "teamImage3">
): Figure => ({
  ...figure,
  type: nextType,
});

export const progressTeamHappyOne = (board: Board): Board => {
  const newBoard = board.map((row) => [...row]);

  for (let col = 0; col < BOARD_COLS; col++) {
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      const cell = newBoard[row][col];
      if (cell && isTeamImage(cell)) {
        newBoard[row][col] = promoteTeamImage(cell, "teamImage1");
      }
    }
  }

  return newBoard;
};

export const progressTeamHappyTwo = (board: Board): Board => {
  const newBoard = board.map((row) => [...row]);

  for (let col = 0; col < BOARD_COLS; col++) {
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      const cell = newBoard[row][col];
      if (cell && isTeamImage(cell)) {
        newBoard[row][col] = promoteTeamImage(cell, "teamImage2");
      }
    }
  }

  return newBoard;
};

export const progressTeamHappyThree = (board: Board): Board => {
  const newBoard = board.map((row) => [...row]);

  for (let col = 0; col < BOARD_COLS; col++) {
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      const cell = newBoard[row][col];
      if (cell && isTeamImage(cell)) {
        newBoard[row][col] = promoteTeamImage(cell, "teamImage3");
      }
    }
  }

  return newBoard;
};