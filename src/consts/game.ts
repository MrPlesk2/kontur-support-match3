import { Bonus } from "types";

export const MIN_MATCH_LENGTH = 3 as const;
export const ANIMATION_DURATION = 300 as const;
export const INITIAL_MOVES = 20;

export const INITIAL_BONUSES: Bonus[] = [
  { type: "friendlyTeam", count: 3 },
  { type: "careerGrowth", count: 2 },
];
