import { useState } from "react";
import {
  Position,
  Match,
  Goal,
  Bonus,
  GameModifiers,
  ActiveBonus,
} from "types";
import {
  getFirstLevelGoals,
  getFirstLevelMoves,
  INITIAL_BONUSES,
} from "consts";

const initialModifiers: GameModifiers = {
  doublePoints: false,
  doubleGoalProgress: false,
  extraMoves: 0,
};

export const useGameState = () => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [isSwapping, setIsSwapping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(getFirstLevelMoves());
  const [goals, setGoals] = useState<Goal[]>(getFirstLevelGoals());
  const [bonuses, setBonuses] = useState<Bonus[]>(INITIAL_BONUSES);
  const [modifiers, setModifiers] = useState<GameModifiers>(initialModifiers);
  const [activeBonus, setActiveBonus] = useState<ActiveBonus | null>(null);

  return {
    selectedPosition,
    setSelectedPosition,
    isSwapping,
    setIsSwapping,
    isAnimating,
    setIsAnimating,
    matches,
    setMatches,
    score,
    setScore,
    moves,
    setMoves,
    goals,
    setGoals,
    bonuses,
    setBonuses,
    modifiers,
    setModifiers,
    activeBonus,
    setActiveBonus,
  };
};
