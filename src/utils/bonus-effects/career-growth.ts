import { GameModifiers } from "types";

export const applyCareerGrowthEffect = (): GameModifiers => {
  return {
    doublePoints: true,
    doubleGoalProgress: true,
    extraMoves: 0,
  };
};

export const resetCareerGrowthModifiers = (): GameModifiers => {
  return {
    doublePoints: false,
    doubleGoalProgress: false,
    extraMoves: 0,
  };
};
