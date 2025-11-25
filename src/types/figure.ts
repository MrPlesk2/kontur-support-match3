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
] as const;

export type Figure = (typeof FIGURES)[number];
