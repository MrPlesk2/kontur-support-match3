export const FIGURES = [
  "pencil",
  "questionBook",
  "openBook",
  "briefcase",
  "bonnet",
  "roundMessage",
  "rectangleMessage",
  "letter",
  "phone",
  "smartphone",
  "goldenCell",
  "star",
  "diamond",
  "teamCell",
  "teamImage0",
  "teamImage1",
  "teamImage2",
  "teamImage3",
  "team",
  "question",
  "heart",
  "handshake",
  "kpi",
  "bulb",
] as const;

export type FigureType = (typeof FIGURES)[number];

export type Figure = {
  id: string;
  type: FigureType;
};

const createFigureId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `figure-${Math.random().toString(36).slice(2)}-${Date.now()}`;
};

export const createFigure = (type: FigureType, id?: string): Figure => ({
  id: id ?? createFigureId(),
  type,
});

export const isFigureType = (value: unknown): value is FigureType =>
  typeof value === "string" && (FIGURES as readonly string[]).includes(value);