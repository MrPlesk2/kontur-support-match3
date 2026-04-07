import { FigureType } from "./figure";

export type Goal = {
  figure: FigureType;
  target: number;
  collected: number;
};