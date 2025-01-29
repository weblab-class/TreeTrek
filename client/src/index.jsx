import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import NotFound from "./components/pages/NotFound";
import LoginPage from "./components/pages/LoginPage";
import MainMenu from "./components/pages/MainMenu";
import GlobalLeaderboard from "./components/pages/GlobalLeaderboard";
import LobbyS from "./components/pages/LobbyS";
import FindLobby from "./components/pages/FindLobby";
import LobbyM from "./components/pages/LobbyM";
import Game from "./components/pages/Game";
import GameOverS from "./components/pages/GameOverS";
import Tutorial from "./components/pages/Tutorial";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "740397720964-3fo97kk41qmd6j2pnggs9gkhffrvn2gs.apps.googleusercontent.com";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<LoginPage />} />
      <Route path="/mainmenu/" element={<MainMenu />} />
      <Route path="/leaderboard/" element={<GlobalLeaderboard />} />
      <Route path="/findlobby/" element={<FindLobby />} />
      <Route path="/lobbym/:lobbyId" element={<LobbyM />}/>
      <Route path="/lobbys/:lobbyId" element={<LobbyS />}/>
      <Route path="/game/" element={<Game />} />
      <Route path="/gameovers/" element={<GameOverS />} />
      <Route path="/tutorial/" element={<Tutorial />} />
    </Route>
  )
);

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
