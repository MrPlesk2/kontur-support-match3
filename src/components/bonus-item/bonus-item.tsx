import { Bonus, ActiveBonus } from "types";
import { BONUS_PATHS, BONUS_NAMES, BONUS_EFFECTS } from "consts";
import { useState } from "react";
import "./bonus-item.styles.css";
import "./bonus-tooltip.styles.css";

type BonusItemProps = {
  bonus: Bonus;
  activeBonus: ActiveBonus | null;
  onUse: (type: Bonus["type"]) => void;
  index: number;
};

export const BonusItem = ({ 
  bonus, 
  activeBonus, 
  onUse, 
  index 
}: BonusItemProps) => {
  const { type, count } = bonus;
  const [showTooltip, setShowTooltip] = useState(false);

  const isActive = activeBonus?.type === type && activeBonus.isActive;
  const canUse = count > 0 || isActive;
  
  const tooltipPosition = index === 0 ? 'left' : 'right';

  const handleClick = () => {
    if (canUse) {
      onUse(type);
    }
  };

  return (
    <div
      className={`
        bonus-item 
        ${isActive ? "bonus-item--active" : ""}
        ${!canUse ? "bonus-item--disabled" : ""}
      `}
      onClick={handleClick}
      onMouseEnter={() => canUse && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="bonus-circle">
        <img src={BONUS_PATHS[type]} alt={type} className="bonus-icon" />
        <div className="bonus-count">{count}</div>
      </div>
      
      
      {showTooltip && canUse && (
        <div className={`bonus-tooltip bonus-tooltip--${tooltipPosition}`}>
          <div className="bonus-tooltip-title">{BONUS_NAMES[type]}</div>
          <div className="bonus-tooltip-effect">{BONUS_EFFECTS[type]}</div>
        </div>
      )}
    </div>
  );
};
