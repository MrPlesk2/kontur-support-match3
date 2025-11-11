import { Link } from "react-router-dom";
import { AppRoute } from "../../consts/routes.js";
import type { JSX } from "react";

function NotFoundPage(): JSX.Element {
  return (
    <div>
      <div>
        <h1>404 Not Found</h1>
        <p>Кажется, кто-то съел эту страницу</p>
        <Link to={AppRoute.GamePage}>Вернуться в игру</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
