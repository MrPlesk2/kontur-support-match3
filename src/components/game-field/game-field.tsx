import { Figure } from "types";
import { Cell } from "@components/game-field/cell/cell";
import "./game-field.styles.css";

type GameFieldProps = {
  board: Figure[][];
};

export const GameField = ({ board }: GameFieldProps) => {

  return (
    <div className="field">
      {board.map((row, rowIndex) =>
        row.map((figure, colIndex) => (
          <Cell key={`${rowIndex}-${colIndex}`} figure={figure} />
        ))
      )}
    </div>
  );
};
