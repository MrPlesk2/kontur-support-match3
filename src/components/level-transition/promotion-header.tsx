import "./promotion-header.styles.css";

type PromotionHeaderProps = {
  nextLevelName: string;
  levelDescription: string;
};

export const PromotionHeader = ({
  nextLevelName,
  levelDescription
}: PromotionHeaderProps) => {
  return (
    <div className="ph-container">
      <div className="ph-promotion">
        <h1>{nextLevelName}</h1>
        <p>
          {levelDescription}
        </p>
      </div>
    </div>
  );
};
