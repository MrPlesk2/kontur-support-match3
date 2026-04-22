import { useState, useEffect } from "react";
import { Bonus } from "types";
import { LEVELS } from "consts/levels";
import { getRandomBonusesForLevel6 } from "@utils/bonus-utils";
import { PromotionHeader } from "../promotion-header/promotion-header";
import { BonusSelectionCard } from "../bonus-selection-card/bonus-selection-card";
import "./level-transition.styles.css";
import ChoiceLevel from "@components/choice/main-choice/choice-level";
import { Button } from "@components/button/button";

type LevelTransitionProps = {
  currentLevel: number;
  onLevelStart: (nextLevel: number, selectedBonuses: Bonus[]) => void;
  promotionLink?: string;
  promotionLinkText?: string;
};

export const LevelTransition = ({
  currentLevel,
  onLevelStart,
  promotionLink,
  promotionLinkText = "Узнать о карьере в поддержке",
}: LevelTransitionProps) => {
  const [selectedLevel, setSelectedLevel] = useState(NaN);
  const [bonusesForNextLevel, setBonusesForNextLevel] = useState<Bonus[]>([]);
  const [showChoiceLevel, setShowChoiceLevel] = useState(false);

  let nextLevel = currentLevel + 1;

  if (currentLevel === 3 && selectedLevel) {
    nextLevel = selectedLevel;
  } else if (currentLevel === 4) {
    nextLevel += 1;
  }

  const nextLevelInfo = LEVELS.find((level) => level.id === nextLevel);

  useEffect(() => {
    if (currentLevel === 3) {
      setSelectedLevel(NaN);
      setShowChoiceLevel(true);
    } else {
      setShowChoiceLevel(false);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (nextLevelInfo) {
      if (nextLevel === 6) {
        const randomBonuses = getRandomBonusesForLevel6();
        setBonusesForNextLevel(randomBonuses);
      } else {
        setBonusesForNextLevel(nextLevelInfo.bonuses);
      }
    }
  }, [nextLevel, nextLevelInfo]);

  const handleChoiceConfirm = (choice: number) => {
    setSelectedLevel(choice);
    setShowChoiceLevel(false);
  };

  const handleStart = () => {
    if (nextLevelInfo) {
      onLevelStart(nextLevel, bonusesForNextLevel);
    }
  };

  if (showChoiceLevel && currentLevel === 3) {
    return <ChoiceLevel onChoiceConfirm={handleChoiceConfirm} />;
  }

  if (!nextLevelInfo) {
    return null;
  }

  const shouldShowPromotionLink = Boolean(promotionLink) && nextLevel >= 2;

  return (
    <div className="lt-overlay">
      <div className="lt-modal">
        <PromotionHeader
          nextLevelName={nextLevelInfo.name}
          levelDescription={nextLevelInfo.description}
          isFirstLevel={currentLevel === 0}
        />

        <BonusSelectionCard availableBonuses={bonusesForNextLevel} />

        <div className="lt-actions">
          <Button
            text={currentLevel === 0 ? "Начать игру" : "Продолжить игру"}
            onClick={handleStart}
          />

          {shouldShowPromotionLink && (
            <a className="lt-link-button lt-link-button--small" href={promotionLink}>
              {promotionLinkText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};