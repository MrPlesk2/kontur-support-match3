import { FigureType } from "./figure";
import { SpecialCell, Position } from "./board";
import { Bonus } from "./bonus";

export type Goal = {
  figure: FigureType;
  target: number;
  collected: number;
};

export type LevelState = {
  currentLevel: number;
  isLevelComplete: boolean;
  isLevelTransition: boolean;
  selectedBonuses: Bonus[];
  isLevelFailed: boolean;
};

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
