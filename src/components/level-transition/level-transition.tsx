import { useState } from "react";
import { BonusType } from "types";
import { LEVEL_NAMES, LEVELS } from "consts/levels";
import { PromotionHeader } from "./promotion-header";
import { BonusSelectionCard } from "./bonus-selection-card";
import "./level-transition.styles.css";

type LevelTransitionProps = {
  currentLevel: number;
  nextLevel: number;
  onLevelStart: (selectedBonuses: BonusType[]) => void;
};

export const LevelTransition = ({
  currentLevel,
  nextLevel,
  onLevelStart,
}: LevelTransitionProps) => {
  const [selectedBonuses, setSelectedBonuses] = useState<BonusType[]>([]);

  const availableBonuses = LEVELS[currentLevel].bonuses
  
  const nextLevelName = LEVEL_NAMES[nextLevel] || `Уровень ${nextLevel}`;

  const handleStart = () => {
    onLevelStart(selectedBonuses);
  };

  return (
    <div className="lt-overlay">
      <div className="lt-modal">
        <PromotionHeader
          nextLevelName={nextLevelName}
          levelDescription={LEVELS[currentLevel].description}
        />
        <BonusSelectionCard
          availableBonuses={availableBonuses}
          selectedBonuses={selectedBonuses}
          onToggle={setSelectedBonuses}
        />
        <button
          className="lt-start-button"
          onClick={handleStart}
          disabled={selectedBonuses.length !== 2}
        >
          Продолжить игру
        </button>
      </div>
    </div>
  );
};
