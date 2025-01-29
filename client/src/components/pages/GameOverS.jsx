import React, { useContext, useState, useEffect } from 'react'
import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import NavBar from "../modules/NavBar";

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

    /** Helper function to search for lobbyCode based on player_.id */
    const findLobbyByPlayer = async (playerId) => {
        try {
        const lobby = await Lobby.findOne({ players: { $in: [playerId] } });
    
        if (!lobby) {
            console.log("Lobby not found for player:", playerId);
            return null; // Handle case where no lobby is found
        }
    
        console.log("Lobby found (api.js):", lobby);
        return lobby.code;
        } catch (error) {
        console.error("Error finding lobby:", error);
        }
    };

    const handlePlayAgain = async () => {
        const lobbyCode = await findLobbyByPlayer(userId);
        console.log("LobbyCode (gameover):" + lobbyCode);
        navigate(`/lobbys/${lobbyCode}`);
    };

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

                <button onClick={() => handlePlayAgain}>
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameOverS;
