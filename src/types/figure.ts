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
  "team",
] as const;

export type Figure = (typeof FIGURES)[number];
