export const FIGURES = [
  "pencil",
  "questionBook",
  "openBook",
  "briefcase",
  "bonnet",
] as const;

export type Figure = (typeof FIGURES)[number];
