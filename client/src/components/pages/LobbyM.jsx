import React, { useContext, useState, useEffect, } from 'react';
import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import { useParams } from "react-router-dom";

import "../../utilities.css";
import './Lobby.css';

const LobbyM = () => {
  let props = useParams();

  const { userId } = useContext(UserContext);
  let navigate = useNavigate();

  // load in sprites
  let sprites = [];
  const animal = ["bear", "bird", "chicken", "deer", "dog", "duck", "fox", "hedgehog", "horse", "lion", "mouse", "panda", "penguin", "rabbit", "skunk", "squirrel", "tiger", "tim"];
  for (let i = 0; i < animal.length; i++) {
      sprites.push(new Image());
      sprites[i].src = `/${animal[i]}left.png`;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sprites.length);
  };
  const handlePrevious = () => {
      setCurrentIndex((prevIndex) =>
        (prevIndex - 1 + sprites.length) % sprites.length);
  };

  const handlePlay = () => {
      post("/api/spawn", { avatar: animal[currentIndex] }).then(() =>
          navigate("/game")
      );
  }
  let playButton = null;
  if (userId) {
      post("/api/newlobby");
      playButton = (
          <div>
              <button className="Lobby-play" onClick={ handlePlay }>
                  Ready!
              </button>
          </div>
      );
  };



  return (
    <div className="character-selection">
        <h1>Lobby ID: {props.lobbyId}</h1>
        <div className="character-selection-options">
            <button className="left-button" onClick={handlePrevious}></button>
            <div className="character-container">
                <img src={sprites[currentIndex].src}
                style={{width:"275px", height:"auto"}}/>
            </div>
            <button className="right-button" onClick={handleNext}></button>
        </div>
        {playButton}
    </div>
  );
};

export default LobbyM;
