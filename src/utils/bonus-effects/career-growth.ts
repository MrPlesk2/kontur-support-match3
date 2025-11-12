import { GameModifiers } from "types";

export const applyCareerGrowthEffect = (): GameModifiers => {

  return {
    doublePoints: true,
    doubleGoalProgress: true,
  };
};

export const resetCareerGrowthModifiers = (): GameModifiers => {
  return {
    doublePoints: false,
    doubleGoalProgress: false,
  };
};
