import React, { useContext, useState, useEffect, useRef } from "react";
import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';

import "../../utilities.css";
import './Lobby.css';

const LobbyS = () => {
    const { userId } = useContext(UserContext);
    let navigate = useNavigate();

    let spawnButton = null;
    if (userId) {
        post("/api/newlobby");
        post("/api/spawn", { userid: userId })
        spawnButton = (
            <div>
                <button className="Lobby-spawn"
                    onClick={() => {
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
