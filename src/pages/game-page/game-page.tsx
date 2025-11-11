import { GameField } from "@components/game-field/game-field";
import { mockBoard } from "@mocks/board";
import "./game-page.styles.css";

export default function GamePage() {
  return (
    <div className="page">
      <GameField board={mockBoard} />
    </div>
  );
}
