import { Figure, FigureType } from "./figure";

export type Position = {
  row: number;
  col: number;
};

export type SpecialCell = {
  row: number;
  col: number;
  type: "golden" | "team";
  isActive: boolean;
};

export interface BoardCell {
  figure: Figure | null;
  isStar?: boolean;
  specialCell?: SpecialCell;
}

export type Match = {
  positions: Position[];
  figure: FigureType;
};

export type Board = (Figure | null)[][];