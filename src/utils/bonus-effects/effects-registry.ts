import { BonusType, Board, GameModifiers } from "types";
import { applyFriendlyTeamEffect } from "./friendly-team";
import {
  applyCareerGrowthEffect,
  resetCareerGrowthModifiers,
} from "./career-growth";

export type BonusEffect = {
  apply: (board: Board) => Board | GameModifiers;
  isInstant?: boolean;
  reset?: () => GameModifiers;
};

export const BONUS_EFFECTS: Record<BonusType, BonusEffect> = {
  friendlyTeam: {
    apply: applyFriendlyTeamEffect,
    isInstant: true,
  },
  careerGrowth: {
    apply: applyCareerGrowthEffect,
    isInstant: false,
    reset: resetCareerGrowthModifiers,
  },
};
