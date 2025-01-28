import React, { useContext, useState, useEffect } from 'react'
import Leaderboard from "../modules/Leaderboard";

import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './GlobalLeaderboard.css';

const GlobalLeaderboard = () => {
    let navigate = useNavigate();

    const [userID, setUserID] = useState("a");
    const [leaders, setLeaders] = useState({});
    useEffect(() => {
        get("/api/whoami").then((res) => {
            setUserID(res.googleid);
        });
        get("/api/leaderboard").then((leaders) => {
            setLeaders(leaders);
        });
    }, []);

    return (
        <div className="GlobalLeaderboard-container">
            <Leaderboard playerid={userID} players={leaders} />
        </div>
    );
};

export default GlobalLeaderboard;
