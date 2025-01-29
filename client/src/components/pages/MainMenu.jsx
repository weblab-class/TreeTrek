import React from 'react';
import NavBar from "../modules/NavBar";
import TwinklingStars from '../modules/TwinklingStars';
import MovingClouds from '../modules/MovingClouds';
import { useNavigate } from "react-router-dom";


import "../../utilities.css";
import './MainMenu.css';

const MainMenu = () => {
  let navigate = useNavigate();

  return (
    <div className="MainMenu">
      <NavBar />
      <TwinklingStars />
      <MovingClouds/>
      <h1 className >Main Menu</h1>
      <div className="MainMenu-options">
        <button onClick={() => navigate("/findlobby")} className="multiplayer-button">
          <img src="/multiplayerButton.png" alt="Multiplayer" style={{width:"235px", height:"auto"}}/>
        </button>
        <button onClick={() => navigate("/lobbys")} className="singleplayer-button">
          <img src="/singleplayerButton.png" alt="SinglePlayer" style={{width:"340px", height:"auto"}}/>
        </button>
        <button onClick={() => navigate("/leaderboard")} className="leaderboard-button">
          <img src="/leaderboardButton.png" alt="Leaderboard" style={{width:"235px", height:"auto"}}/>
        </button>
        <button onClick={() => navigate("/tutorial")} className="tutorial-button">
          <img src="/tutorialButton.png" alt="Tutorial" style={{width:"215px", height:"auto"}}/>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
