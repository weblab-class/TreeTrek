import React from 'react'
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './LobbyS.css';

const LobbyS = () => {
    let navigate = useNavigate();

    return (
            <div className = "MainMenu">
                <h1>Main Menu</h1>
                <div className = "MainMenu-options">
                    <button onClick={() => navigate("/game")}>
                        <img src="../singleplayerButton.png" alt="SinglePlayer" style={{width:"205px", height:"auto"}}/>
                    </button>
                    {/* <button> Multiplayer </button> ##to be implemented later##
                    <button> Settings </button>
                    <button> High Scores </button> */}
                </div>
            </div>
    );
};

export default LobbyS;
