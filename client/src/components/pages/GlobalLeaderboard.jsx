import React, { useContext, useState, useEffect } from 'react'
import Leaderboard from "../modules/Leaderboard";
import NavBar from "../modules/NavBar";
import TwinklingStars from '../modules/TwinklingStars';

import { get, post } from "../../utilities";
import { UserContext } from '../App';
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './GlobalLeaderboard.css';

const GlobalLeaderboard = () => {
    let navigate = useNavigate();
    const { userId } = useContext(UserContext);

    const [leaders, setLeaders] = useState({});
    useEffect(() => {
        get("/api/leaderboard").then((leaders) => {
            setLeaders(leaders);
        });
    }, []);

    return (
        <div>
            <NavBar />
            <TwinklingStars />
            <div className="GlobalLeaderboard-container">
                <Leaderboard playerid={userId} players={leaders} />
                <button className="mainMenu-button" onClick={() => navigate("/mainmenu")}>
                        <img src="/mainMenuButton.png" alt="menuButton" style={{width:"auto", height:"90px"}}/>
                </button>
            </div>
        </div>
    );
};

export default GlobalLeaderboard;
