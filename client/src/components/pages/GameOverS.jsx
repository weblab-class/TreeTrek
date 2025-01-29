import React, { useState, useEffect } from 'react'
import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";
import NavBar from "../modules/NavBar";

import "../../utilities.css";
import './GameOver.css';

const GameOverS = () => {
    let navigate = useNavigate();

    const [highestGame, setHighestGame] = useState(0);
    const [lastGame, setLastGame] = useState(0);
    useEffect(() => {
        get("/api/gameover").then((data) => {
            setHighestGame(data.highestGame);
            setLastGame(data.lastGame);
        })
    }, []);

    return (
        <div>
            <NavBar />
            <div className = "GameOver">
                <div className = "GameOver-title">
                    Game Over!
                </div>

                {highestGame == lastGame &&
                    <div className = "GameOver-newHighScore">
                    new high score!
                    </div>
                }
                <div className = "GameOver-scores">
                    Score: {lastGame}
                    <br></br>
                    High Score: {highestGame}
                </div>

                <button onClick={() => navigate("/lobbys")}>
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameOverS;
