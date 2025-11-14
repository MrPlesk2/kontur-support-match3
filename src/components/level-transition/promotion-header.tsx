import "./promotion-header.styles.css";

type PromotionHeaderProps = {
  currentLevelName: string;
  nextLevelName: string;
};

export const PromotionHeader = ({
  currentLevelName,
  nextLevelName,
}: PromotionHeaderProps) => {
  return (
    <div className="ph-container">
      <h2 className="ph-title">Поздравляем!</h2>
      <p className="ph-text">
        Вы завершили <strong>{currentLevelName}</strong>
      </p>
      <div className="ph-promotion">
        <h3>Повышение!</h3>
        <p>
          Теперь вы <strong>{nextLevelName}</strong>
        </p>
      </div>
    </div>
  );
};
