export const BONUS_TYPES = [
  "friendlyTeam",
  "careerGrowth",
] as const;
export type BonusType = typeof BONUS_TYPES[number];