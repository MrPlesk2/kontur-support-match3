import { Level } from "types";

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Новичок",
    description: "Начни свой путь в IT!",
    goals: [
      { figure: "pencil", target: 3, collected: 0 },
      { figure: "bonnet", target: 3, collected: 0 },
      { figure: "briefcase", target: 3, collected: 0 },
    ],
    moves: 21,
    requiredScore: 100,
  },
  {
    id: 2,
    name: "Консультант",
    description: "Ты освоил основы!",
    goals: [
      { figure: "pencil", target: 5, collected: 0 },
      { figure: "bonnet", target: 4, collected: 0 },
      { figure: "briefcase", target: 3, collected: 0 },
    ],
    moves: 22,
    requiredScore: 250,
  },
  {
    id: 3,
    name: "Специалист",
    description: "Растёшь над собой!",
    goals: [
      { figure: "pencil", target: 3, collected: 0 },
      { figure: "bonnet", target: 4, collected: 0 },
      { figure: "briefcase", target: 5, collected: 0 },
    ],
    moves: 23,
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
