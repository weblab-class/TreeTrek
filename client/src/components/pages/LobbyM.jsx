import React, { useContext, useState, useEffect, } from 'react';
import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import { useParams } from "react-router-dom";

import NavBar from "../modules/NavBar";
import "../../utilities.css";
import './Lobby.css';

const LobbyM = () => {
  let props = useParams();

  const { userId } = useContext(UserContext);
  const [players, setPlayers] = useState([]);
  const [names, setNames] = useState([]);
  const [readiness, setReadiness] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    get(`/api/lobbydata/${props.lobbyId}`).then((res) => {
      setPlayers(res.players);
      setNames(res.names);
      setReadiness(res.readiness);
    });
  }, []);
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
  let readyButton = null;
  readyButton = (
    <div>
        <button className="Lobby-play" onClick={ handlePlay }>
            Ready!
        </button>
    </div>
  );
  // if (userId) {
  //     post("/api/newlobby");
  //     playButton = (
  //         <div>
  //             <button className="Lobby-play" onClick={ handlePlay }>
  //                 Ready!
  //             </button>
  //         </div>
  //     );
  // };
  let lobbyPlayers = [];
  for (let i = 0; i < names.length; i++) {
    lobbyPlayers.push(
      <div key={i}>
        <div className="character-selection">
          <h2>{names[i]}</h2>
          <div className="character-selection-options">
            <div className="character-container">
              <img
                src={sprites[currentIndex].src}
                style={{ width: "275px", height: "auto" }}
              />
            </div>
          </div>
          <h2><i>{animal[currentIndex]}</i></h2>
          <h2>{readiness[i]}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="Background">
      <NavBar />
      <div className="Lobby">
        <h1>Lobby ID: {props.lobbyId}</h1>
        <div className="Lobby-players">
          {lobbyPlayers}
        </div>
      </div>
    </div>
  );
};

export default LobbyM;
