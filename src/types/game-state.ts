import { Goal } from "./level";
import { Position, Match } from "./board";
import { ActiveBonus, Bonus } from "./bonus";

export type GameModifiers = {
  doublePoints: boolean;
  doubleGoalProgress: boolean;
  extraMoves: number;
};

export type GameGoalsState = {
  goals: Goal[];
  setGoals: (updater: (goals: Goal[]) => Goal[]) => void;
};

export type GameScoreState = {
  score: number;
  setScore: (updater: (score: number) => number) => void;
};

export type GameMovesState = {
  moves: number;
  setMoves: (updater: (moves: number) => number) => void;
};

export type GameBoardState = {
  selectedPosition: Position | null;
  setSelectedPosition: (pos: Position | null) => void;
  isSwapping: boolean;
  setIsSwapping: (swapping: boolean) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  score: number;
  setScore: (updater: (score: number) => number) => void;
};

export type GameMatchesState = {
  matches: Match[];
  setMatches: (matches: Match[]) => void;
};

export type GameBonusesState = {
  bonuses: Bonus[];
  activeBonus: ActiveBonus | null;
  modifiers: GameModifiers;
  setBonuses: (updater: (bonuses: Bonus[]) => Bonus[]) => void;
  setActiveBonus: (bonus: ActiveBonus | null) => void;
  setModifiers: (modifiers: GameModifiers) => void;
};

export type GameState = GameGoalsState &
  GameScoreState &
  GameMovesState &
  GameBoardState &
  GameMatchesState &
  GameBonusesState;
