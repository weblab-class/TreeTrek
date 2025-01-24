import React, { useContext, useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { drawCanvas } from "../../canvasManager";
import { handleInput } from "../../input";
import { UserContext } from "../App";

import "../../utilities.css";
import "./Game.css";

const Game = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  console.log(userId);
  const canvasRef = useRef(null);

  const [gameOverModal, setGameOverModal] = useState(null);

  // add event listener on mount
  useEffect(() => {
    window.addEventListener("keydown", handleInput);

    // remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleInput);
      post("/api/despawn", { userid: userId });
    };
  }, []);

  // update game periodically
  useEffect(() => {
    socket.on("update", (update) => {
      processUpdate(update);
    });
    return () => {
      socket.off("update");
    };
  }, []);

  const processUpdate = (update) => {
    // show GameOver if game is over
    if (update.gameOver) {
      post("/api/despawn", { userid: userId });
      setGameOverModal(
        <div className="Game-over">
          {/* <button
            onClick={() => {
              post("/api/reset", { userid: userId });
            }}
          >
            Respawn
          </button> */}
          Game Over!
        </div>
      );
    } else {
      setGameOverModal(null);
    }
    drawCanvas(update, canvasRef, userId);
  };

  // set a spawn button if the player is not in the game
  let spawnButton = null;
  if (userId) {
    spawnButton = (
      <div>
        <button className="Game-spawn"
          onClick={() => {
            post("/api/spawn", { userid: userId });
          }}
        >
          Play!
        </button>
      </div>
    );
  }

  // display text if the player is not logged in
  let loginModal = null;
  if (!userId) {
    loginModal = <div className="Game-login"> Please login first! </div>;
  }

  return (
    <div className="Game-game">
      <canvas ref={canvasRef}/>

      <div>
        {loginModal}
        {gameOverModal}
        {spawnButton}
      </div>
    </div>
  );
};

export default Game;
