export interface Position {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  transform?: string;
  width?: string;
}

export interface TutorialStep {
  text: string;
  characterPos: 'left' | 'right';
  highlightSelector?: string;
  position?: Position; 
  mobilePosition?: Position;
  highlightBonus?: boolean;
  highlightSelectorMobile?: string;
}
