import { useEffect, useState } from "react";
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
  hideAlternateLevelButton?: boolean;
};

const getBonusesForLevel = (levelId: number): Bonus[] => {
  if (levelId === 6) {
    return getRandomBonusesForLevel6();
  }

  return LEVELS.find((level) => level.id === levelId)?.bonuses ?? [];
};

export const LevelTransition = ({
  currentLevel,
  onLevelStart,
  promotionLink,
  promotionLinkText = "Узнать о карьере в поддержке",
  hideAlternateLevelButton = false,
}: LevelTransitionProps) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(NaN);
  const [bonusesForNextLevel, setBonusesForNextLevel] = useState<Bonus[]>([]);
  const [showChoiceLevel, setShowChoiceLevel] = useState(false);

  const isChoiceLevel = currentLevel === 3;

  let nextLevel = currentLevel + 1;

  if (isChoiceLevel && !Number.isNaN(selectedLevel)) {
    nextLevel = selectedLevel;
  } else if (currentLevel === 4) {
    nextLevel += 1;
  }

  const nextLevelInfo = LEVELS.find((level) => level.id === nextLevel);

  const alternateLevel = currentLevel === 4 ? 5 : currentLevel === 5 ? 4 : null;

  const alternateLevelInfo =
    alternateLevel !== null
      ? LEVELS.find((level) => level.id === alternateLevel)
      : null;

  useEffect(() => {
    if (isChoiceLevel) {
      setSelectedLevel(NaN);
      setShowChoiceLevel(true);
    } else {
      setShowChoiceLevel(false);
    }
  }, [isChoiceLevel]);

  useEffect(() => {
    if (!nextLevelInfo) {
      setBonusesForNextLevel([]);
      return;
    }

    if (nextLevel === 6) {
      setBonusesForNextLevel(getRandomBonusesForLevel6());
    } else {
      setBonusesForNextLevel(nextLevelInfo.bonuses);
    }
  }, [nextLevel, nextLevelInfo]);

  const handleChoiceConfirm = (choice: number) => {
    setSelectedLevel(choice);
    setShowChoiceLevel(false);
  };

  const handleStartMain = () => {
    if (nextLevelInfo) {
      onLevelStart(nextLevel, bonusesForNextLevel);
    }
  };

  const handleStartAlternate = () => {
    if (!alternateLevelInfo || alternateLevel === null) {
      return;
    }

    onLevelStart(alternateLevel, getBonusesForLevel(alternateLevel));
  };

  if (showChoiceLevel && isChoiceLevel) {
    return <ChoiceLevel onChoiceConfirm={handleChoiceConfirm} />;
  }

  if (!nextLevelInfo) {
    return null;
  }

  const shouldShowPromotionLink = Boolean(promotionLink) && nextLevel >= 2;

  const shouldShowAlternateButton =
    (currentLevel === 4 || currentLevel === 5) && !hideAlternateLevelButton;

  const alternateButtonText =
    currentLevel === 4
      ? "Пройти уровень Эксперт"
      : "Пройти уровень Руководитель группы";

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
            onClick={handleStartMain}
          />

          {shouldShowAlternateButton && (
            <Button text={alternateButtonText} onClick={handleStartAlternate} />
          )}

          {shouldShowPromotionLink && (
            <a
              className="lt-link-button lt-link-button--small"
              href={promotionLink}
              target="_blank"
              rel="noreferrer noopener"
            >
              {promotionLinkText}
            </a>

          )}
        </div>
      </div>
    </div>
  );
};
