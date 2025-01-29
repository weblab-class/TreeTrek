import React, { useContext, useState, useEffect } from 'react'
import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import NavBar from "../modules/NavBar";
import TwinklingStars from '../modules/TwinklingStars';

import "../../utilities.css";
import './GameOver.css';

const GameOverS = () => {
    let navigate = useNavigate();
    const { userId } = useContext(UserContext);

    const [highestGame, setHighestGame] = useState(0);
    const [lastGame, setLastGame] = useState(0);
    useEffect(() => {
        get("/api/gameover").then((data) => {
            setHighestGame(data.highestGame);
            setLastGame(data.lastGame);
        })
    }, []);

    const handlePlayAgain = () => {
        get(`api/findlobby/${userId}`).then((data) => {
            console.log(data.lobbyCode);
            if (data.lobbyCode != null) {
                navigate(`/lobbys/${data.lobbyCode}`);
            }
        }).catch(error => {
            console.error("Error fetching lobby:", error);
        });
    };

    return (
        <div>
            <NavBar />
            <TwinklingStars />
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

                <button onClick={handlePlayAgain}>
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameOverS;
