import { Goal } from "types";
import { FIGURE_PATHS } from "consts";
import "./goal-item.styles.css";

type GoalItemProps = {
  goal: Goal;
};

export const GoalItem = ({ goal }: GoalItemProps) => {
  const { figure, collected, target } = goal;
  const isCompleted = collected >= target;

  return (
    <div className={`goal-item ${isCompleted ? "goal-item--completed" : ""}`}>
      <img src={FIGURE_PATHS[figure]} alt={figure} className="goal-figure" />
      <div className="goal-progress">
        {collected}/{target}
      </div>
    </div>
  );
};
