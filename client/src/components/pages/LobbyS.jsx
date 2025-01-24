import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';

import "../../utilities.css";
import './LobbyS.css';

const LobbyS = () => {
    const { userId } = useContext(UserContext);
    console.log(userId);
    let navigate = useNavigate();

    let spawnButton = null;
    if (userId) {
        spawnButton = (
            <div>
                <button className="Game-spawn"
                    onClick={() => {
                    post("/api/spawn", { userid: userId });
                    navigate("/game");
                    }}
                >
                    Play!
                </button>
            </div>
        );
    }; 

    return (



            <div className = "character-selection">
                <h1>Character Selection</h1>
                <div className = "message-box">

                </div>
                <div className = "character-selection-options">
                    <div className = "character">

                    </div>
                    <button className = "left-button"> 

                    </button>
                    <button className = "right-button">


                    </button>
                </div>
                {/* <div className = "MainMenu-options">
                    <button onClick={() => navigate("/game")}>
                        <img src="../singleplayerButton.png" alt="SinglePlayer" style={{width:"205px", height:"auto"}}/>
                    </button>
                </div> */}
                {spawnButton}
            </div>
    );
};

export default LobbyS;
