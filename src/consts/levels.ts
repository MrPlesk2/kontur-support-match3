import { Level } from "types";

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Новичок",
    description: "Начни свой путь в IT!",
    goals: [
      { figure: "pencil", target: 9, collected: 0 },
      { figure: "bonnet", target: 10, collected: 0 },
      { figure: "briefcase", target: 9, collected: 0 },
    ],
    moves: 15,
    requiredScore: 100,
  },
  {
    id: 2,
    name: "Консультант",
    description: "Ты освоил основы!",
    goals: [
      { figure: "pencil", target: 1, collected: 0 },
      { figure: "bonnet", target: 1, collected: 0 },
      { figure: "briefcase", target: 2, collected: 0 },
    ],
    moves: 20,
    requiredScore: 250,
  },
  {
    id: 3,
    name: "Специалист",
    description: "Растёшь над собой!",
    goals: [
      { figure: "pencil", target: 15, collected: 0 },
      { figure: "bonnet", target: 12, collected: 0 },
      { figure: "briefcase", target: 10, collected: 0 },
    ],
    moves: 18,
    requiredScore: 400,
  },
];

export const LEVEL_NAMES: Record<number, string> = {
  1: "Новичок",
  2: "Консультант",
  3: "Специалист",
  4: "Эксперт",
  5: "Тимлид",
};

export const getFirstLevelGoals = () => {
  const firstLevel = LEVELS.find((level) => level.id === 1);
  return firstLevel ? firstLevel.goals : [];
};

export const getLevelById = (id: number): Level | undefined => {
  return LEVELS.find((level) => level.id === id);
};

export const getFirstLevelMoves = () => {
  const firstLevel = LEVELS.find((level) => level.id === 1);
  return firstLevel ? firstLevel.moves : 10;
};
