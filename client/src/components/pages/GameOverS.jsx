import React from 'react'
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './GameOver.css';

const GameOverS = () => {
    let navigate = useNavigate();

    return (
            <div className = "GameOver">
                <h1>Game Over!</h1>
                <button onClick={() => navigate("/lobbys")}>
                    Play Again
                </button>
            </div>
    );
};

export default GameOverS;
