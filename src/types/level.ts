import { FigureType } from "./figure";
import { Goal } from "./goal";
import { SpecialCell } from "./special-cell";
import { Position } from "./position";
import { Bonus } from "./bonus";

export type Level = {
  id: number;
  name: string;
  description: string;
  goals: Goal[];
  bonuses: Bonus[];
  moves: number;
  availableFigures?: FigureType[];
  specialCells?: SpecialCell[];
  starPositions?: Position[];
  diamondPositions?: Position[];
  teamPositions?: Position[];
  teamImagePosition?: Position;
};