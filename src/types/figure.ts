export const FIGURES = [
  "pencil",
  "questionBook",
  "openBook",
  "apple",
  "bonnet",
] as const;

export type Figure = (typeof FIGURES)[number];
