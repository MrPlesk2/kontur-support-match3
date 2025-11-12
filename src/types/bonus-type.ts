export const BONUS_TYPES = [
  "globe",
  "barbell",
  "friendlyTeam",
  "careerGrowth",
] as const;
export type BonusType = typeof BONUS_TYPES[number];