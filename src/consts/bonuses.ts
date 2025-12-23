import { BonusType } from "types/bonus-type";

export const BONUS_PATHS: Record<BonusType, string> = {
  friendlyTeam: "src/assets/bonuses/friendlyTeam.svg",
  careerGrowth: "src/assets/bonuses/careerGrowth.svg",
  sportCompensation: "src/assets/bonuses/sportCompensation.svg",
  knowledgeBase: "src/assets/bonuses/sportCompensation.svg",
  remoteWork: "src/assets/bonuses/sportCompensation.svg",
  openGuide: "src/assets/bonuses/sportCompensation.svg",
  modernProducts: "src/assets/bonuses/sportCompensation.svg",
  itSphere: "src/assets/bonuses/sportCompensation.svg",
};

export const BONUS_DESCRIPTIONS: Record<BonusType, string> = {
  friendlyTeam: "Перемешивает все фигурки на поле, создавая новые комбинации для сбора рядов",
  careerGrowth: "Удваивает очки за следующий ряд и засчитывает следующий ряд как два в счетчике цели",
  sportCompensation: "Дает дополнительный ход",
  knowledgeBase: "Доступ к обширной базе знаний и документации",
  remoteWork: "Возможность работать удаленно из любой точки мира",
  openGuide: "Открытость руководства и прозрачность коммуникации",
  modernProducts: "Работа с современными технологиями и продуктами",
  itSphere: "Развитие в перспективной IT-сфере",
};