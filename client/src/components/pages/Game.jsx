import React, { useContext, useState, useEffect, useRef } from "react";
import Timer from "../modules/Timer";
import BranchCounter from "../modules/BranchCounter";

import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { drawCanvas } from "../../canvasManager";
import { handleInput } from "../../input";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./Game.css";

const Game = () => {
  let navigate = useNavigate();
  const { userId } = useContext(UserContext);
  const canvasRef = useRef(null);

  const [time, setTime] = useState(0); // stores time in ms
  const [branch, setBranch] = useState(0); // stores player's branch index

  // add event listener on mount
  useEffect(() => {
    window.addEventListener("keydown", handleInput);

    // remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleInput);
      post("/api/despawn");
    };
  }, []);

  // update game periodically
  useEffect(() => {
    socket.on("update", (update) => {
      processUpdate(update);
      //setTime(prevTime => prevTime + 1); // using local timer is still slow
    });
    return () => {
      socket.off("update");
    };
  }, []);

  const processUpdate = (update) => {
    setTime(update.time);
    setBranch(update.players[userId].index);
    // goes to GameOver if game is over
    if (update.gameOver) {
      update.gameOver = false;
      post("/api/gameover", { gameBranch: update.players[userId].index }).then(() =>
        post("/api/despawn")
      ).then(() =>
        navigate("/gameovers") // assuming singleplayer, directly go to gameover page
      );
    }
    drawCanvas(update, canvasRef, userId);
  };

  // display text if the player is not logged in
  let loginModal = null;
  if (!userId) {
    loginModal = <div className="Game-login"> Please login first! </div>;
  };

  useEffect(() => {
    post("/api/newgame");  // This could be triggering multiple times
  }, []);

  return (
    <div className="Game-game">
      <BranchCounter branch={branch}/>
      <Timer time={time / 1000 | 0}/> {/*display time in seconds */}
      <canvas ref={canvasRef}/>

      <div>
        {loginModal}
      </div>
    </div>
  );
};

export default Game;
