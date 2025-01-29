import React, { useState, useEffect } from 'react'
import Leaderboard from "../modules/Leaderboard";
import NavBar from "../modules/NavBar";

import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './GlobalLeaderboard.css';

const GlobalLeaderboard = () => {
    let navigate = useNavigate();

    const [leaders, setLeaders] = useState({});
    useEffect(() => {
        get("/api/leaderboard").then((leaders) => {
            setLeaders(leaders);
        })
    }, []);

    return (
        <div>
            <NavBar />
            <div className="GlobalLeaderboard-container">
                <Leaderboard players={leaders} />
                <button className="mainMenu-button" onClick={() => navigate("/mainmenu")}>
                    <img src="/mainMenuButton.png" alt="menuButton" style={{width:"auto", height:"90px"}}/>
                </button>
            </div>
        </div>
    );
};

export default GlobalLeaderboard;
