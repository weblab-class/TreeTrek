import React from 'react'
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './MainMenu.css';

const MainMenu = () => {
    let navigate = useNavigate();

    return (
        <div className = "MainMenu">
            <h1>Main Menu</h1>
            <div className = "MainMenu-options">
                <button onClick={() => navigate("/lobbys")}>
                    <img src="/singleplayerButton.png" alt="SinglePlayer" style={{width:"225px", height:"auto"}}/>
                </button>
                {/* <button> Multiplayer </button> ##to be implemented later##
                <button> Settings </button>
                <button> High Scores </button> */}
                <button /*onClick={() => navigate("/multiplayer")}*/>
                    <img src="/multiplayerButton.png" alt="Multiplayer" style={{width:"225px", height:"auto"}}/>
                </button>
                <button onClick={() => navigate("/tutorial")}>
                    <img src="/tutorialButton.png" alt="Tutorial" style={{width:"225px", height:"auto"}}/>
                </button>
            </div>
        </div>
    );
};

export default MainMenu;
