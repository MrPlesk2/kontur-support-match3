import { Figure } from "types";
import { FIGURE_PATHS } from "consts";
import "./cell.styles.css";

type CellProps = {
  figure: Figure;
};

export const Cell = ({ figure }: CellProps) => {
  return (
    <div className="cell">
      {figure && (
        <img src={FIGURE_PATHS[figure]} alt={figure} className="figure" />
      )}
    </div>
  );
};
