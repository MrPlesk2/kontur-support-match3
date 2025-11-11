import { SCORE_ICON_PATH } from "consts";
import "./score.styles.css";

type ScoreProps = {
  score: number;
};

export const Score = ({ score }: ScoreProps) => {
  return (
    <div className="score-container">
      <div className="score">
        <img src={SCORE_ICON_PATH} alt="Score" className="score-icon" />
        <span className="score-value">{score}</span>
      </div>
    </div>
  );
};
