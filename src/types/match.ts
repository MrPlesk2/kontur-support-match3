import { FigureType } from "./figure";
import { Position } from "./position";

export type Match = {
  positions: Position[];
  figure: FigureType;
};