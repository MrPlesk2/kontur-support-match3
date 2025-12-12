// utils/bonus-effects/effects-registry.ts
import { BonusType, Board, GameModifiers, Position } from "types";
import { applyFriendlyTeamEffect } from "./friendly-team";
import {
  applyCareerGrowthEffect,
  resetCareerGrowthModifiers,
} from "./career-growth";
import { applySportCompensationEffect } from "./sport-compensation";
import { applyKnowledgeBaseEffect } from "./knowledge-base";

import { applyRemoteWorkEffect, applyRemoteWorkAt } from "./remote-work";
import { applyOpenGuideEffect } from "./open-guide";
import { applyModernProductsEffect, applyModernProductsAt } from "./modern-products";
import { applyItSphereEffect, applyItSphereAt } from "./it-sphere";

export type BonusEffect = {
  apply: (board: Board) => Board;
  /** Применение по клетке/позиции; secondPos — для двухшаговых эффектов */
  applyAt?: (board: Board, pos: Position, secondPos?: Position) => Board;
  isInstant?: boolean;
  onApply?: (setMoves: (updater: (moves: number) => number) => void) => void;
  reset?: () => GameModifiers;
  applyModifiers?: () => GameModifiers;
};

export const BONUS_EFFECTS: Record<BonusType, BonusEffect> = {
  friendlyTeam: {
    apply: applyFriendlyTeamEffect,
    isInstant: true,
  },
  careerGrowth: {
    apply: (board: Board) => board,
    isInstant: false,
    applyModifiers: applyCareerGrowthEffect,
    reset: resetCareerGrowthModifiers,
  },
  sportCompensation: {
    apply: applySportCompensationEffect,
    isInstant: true,
    onApply: (setMoves) => {
      setMoves((prevMoves) => prevMoves + 1);
    },
  },
  knowledgeBase: {
    apply: applyKnowledgeBaseEffect,
    isInstant: true,
    onApply: (setMoves) => {
      setMoves((prevMoves) => prevMoves + 2);
    },
  },

  // Новые бонусы — поддерживают applyAt (таргет)
  remoteWork: {
    apply: applyRemoteWorkEffect, // случайное удаление (backwards compat)
    applyAt: applyRemoteWorkAt, // удаление по выбранной клетке
    isInstant: false,
  },
  openGuide: {
    apply: applyOpenGuideEffect,
    isInstant: true,
  },
  modernProducts: {
    apply: applyModernProductsEffect,
    applyAt: applyModernProductsAt, // принимает (board, sourcePos, targetPos)
    isInstant: false,
  },
  itSphere: {
    apply: applyItSphereEffect,
    applyAt: applyItSphereAt, // принимает (board, pos) — удаляет все одного типа
    isInstant: false,
  },
};
