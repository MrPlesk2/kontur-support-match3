import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AppRoute } from "./consts/routes.js";
import GamePage from "@pages/game-page/game-page.js";
import NotFoundPage from "@pages/not-found-page/not-found-page.js";
import type { JSX } from "react";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.GamePage} element={<GamePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
