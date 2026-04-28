export const BONUS_TYPES = {
  friendlyTeam: "friendlyTeam",
  careerGrowth: "careerGrowth",
  sportCompensation: "sportCompensation",
  knowledgeBase: "knowledgeBase",
  remoteWork: "remoteWork",
  openGuide: "openGuide",
  modernProducts: "modernProducts",
  itSphere: "itSphere",
  dms: "dms",
} as const;

export type BonusType = typeof BONUS_TYPES[keyof typeof BONUS_TYPES];

export type Bonus = {
  type: BonusType;
  count: number;
};

export type ActiveBonus = {
  type: BonusType;
  isActive: boolean;
};
