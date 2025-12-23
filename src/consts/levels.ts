import { Level } from "types";

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Новичок",
    description: "Привет! Сегодня твой первый день в команде поддержки. Твоя цель - накапливать знания по продуктам Контура, активно задавать вопросы наставнику и погружаться в жизнь IT-компании. Собери иконки по три в ряд и перейдешь на новый уровень. Удачи!",
    goals: [
      { figure: "pencil", target: 3, collected: 0 },
      { figure: "bonnet", target: 3, collected: 0 },
      { figure: "briefcase", target: 3, collected: 0 },
    ],
    bonuses: ["careerGrowth", "friendlyTeam", "sportCompensation"],
    moves: 21,
    availableFigures: [
      "pencil",
      "questionBook",
      "openBook",
      "briefcase",
      "bonnet",
    ],
  },
  {
    id: 2,
    name: "Консультант",
    description: "Обучение позади — теперь начинается настоящее приключение! Клиентам нужна твоя помощь по продуктам Контура. Ты получаешь письма, звонки, сообщения в чате… Твоя задача — собрать нужное количество рядов с особыми обращениями клиентов. Вперёд, консультант! Мы рассчитываем на тебя.",
    goals: [
      {
        figure: "goldenCell",
        target: 9,
        collected: 0,
      },
    ],
    bonuses: ["openGuide", "modernProducts", "itSphere"],
    moves: 22,
    availableFigures: [
      "roundMessage",
      "rectangleMessage",
      "letter",
      "phone",
      "smartphone",
    ],
    specialCells: [
      { row: 2, col: 2, type: "golden", isActive: true },
      { row: 2, col: 3, type: "golden", isActive: true },
      { row: 2, col: 4, type: "golden", isActive: true },
      { row: 3, col: 2, type: "golden", isActive: true },
      { row: 3, col: 3, type: "golden", isActive: true },
      { row: 3, col: 4, type: "golden", isActive: true },
      { row: 4, col: 2, type: "golden", isActive: true },
      { row: 4, col: 3, type: "golden", isActive: true },
      { row: 4, col: 4, type: "golden", isActive: true },
    ],
  },
  {
    id: 3,
    name: "Специалист",
    description: "Ты уже знаешь, как находить решения и собирать идеальные комбинации. Пора переходить на роль специалиста поддержки. Покажи своё мастерство — впереди новые вызовы!",
    goals: [
      { figure: "star", target: 5, collected: 0 }, // Цель - собрать 5 звезд
    ],
    bonuses: ["careerGrowth", "friendlyTeam", "sportCompensation"],
    moves: 23,
    availableFigures: ["roundMessage", "letter", "smartphone", "star", "phone"],
    starPositions: [
      // Начальные позиции звезд
      { row: 3, col: 1 },
      { row: 0, col: 2 },
      { row: 3, col: 3 },
      { row: 0, col: 4 },
      { row: 3, col: 5 },
    ],
  },
  {
    id: 4,
    name: "Эксперт",
    description: "Эксперт — мастер поддержки, который способен справиться с любой задачей. Если ты хочешь глубже погружаться в продукты и быть тем самым человеком, к которому идут, когда “никто больше не смог” — этот путь для тебя.",
    goals: [
      { figure: "diamond", target: 5, collected: 0 }, // Цель - собрать 5 звезд
      {
        figure: "goldenCell",
        target: 10,
        collected: 0,
      }
    ],
    bonuses: ["careerGrowth", "friendlyTeam", "sportCompensation"],
    moves: 23,
    availableFigures: ["roundMessage", "letter", "smartphone", "star", "phone"],
    diamondPositions: [
      // Начальные позиции звезд
      { row: 0, col: 1 },
      { row: 1, col: 2 },
      { row: 0, col: 3 },
      { row: 1, col: 4 },
      { row: 0, col: 5 },
    ],
    specialCells: [
      { row: 3, col: 0, type: "golden", isActive: true },
      { row: 2, col: 1, type: "golden", isActive: true },
      { row: 4, col: 1, type: "golden", isActive: true },
      { row: 3, col: 2, type: "golden", isActive: true },
      { row: 2, col: 3, type: "golden", isActive: true },
      { row: 4, col: 3, type: "golden", isActive: true },
      { row: 3, col: 4, type: "golden", isActive: true },
      { row: 2, col: 5, type: "golden", isActive: true },
      { row: 4, col: 5, type: "golden", isActive: true },
      { row: 3, col: 6, type: "golden", isActive: true },
    ],
  },
  {
    id: 5,
    name: "Тимлид",
    description: "Тимлид — тот, кто организовывает работу группы консультантов, помогает им работать лучше и поддерживает по сложным вопросам от клиентов. Здесь не нужно самому общаться с клиентами.  Если тебе близко быть лидером, взаимодействовать и развивать других — выбирай этот путь.",
    goals: [
      {
        figure: "teamCell",
        target: 14,
        collected: 0,
      }
    ],
    bonuses: ["careerGrowth", "friendlyTeam", "sportCompensation"],
    moves: 23,
    availableFigures: ["roundMessage", "letter", "smartphone", "star", "phone"],
    teamPositions: [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 3, col: 2 },
      { row: 3, col: 3 },
    ],
    teamImagePosition : { row: 3, col: 4 },
    specialCells: [
      { row: 1, col: 2, type: "team", isActive: true },
      { row: 1, col: 3, type: "team", isActive: true },
      { row: 1, col: 4, type: "team", isActive: true },
      { row: 4, col: 2, type: "team", isActive: true },
      { row: 4, col: 3, type: "team", isActive: true },
      { row: 4, col: 4, type: "team", isActive: true },
      { row: 2, col: 1, type: "team", isActive: true },
      { row: 3, col: 1, type: "team", isActive: true },
      { row: 2, col: 5, type: "team", isActive: true },
      { row: 3, col: 5, type: "team", isActive: true },
    ],
  },
];

export const LEVEL_NAMES: Record<number, string> = {
  1: "Новичок",
  2: "Консультант",
  3: "Специалист",
  4: "Эксперт",
  5: "Тимлид",
};
