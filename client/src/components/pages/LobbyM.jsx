import React, { useContext, useState, useEffect, } from 'react';
import { avatarPlayer, readyPlayer, prepLobbyGame } from "../../client-socket";
import { socket } from "../../client-socket.js";
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

  const [lobbyPlayers, setLobbyPlayers] = useState({});
  const [readyPlayers, setReadyPlayers] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    socket.on("newPlayer", () => {
      get(`/api/lobbydata/${props.lobbyId}`).then((res) => {
        res.players.forEach((pid, index) => {
          setLobbyPlayers((players) => ({ ...players, [pid]: {name: res.names[index], avatar: "bear", ready: res.readiness[index]} }));
        });
      });
    });
    socket.on("updateAvatar", ({id, avatar}) => {
      setLobbyPlayers((players) => ({ ...players, [id]: {...players[id], avatar: avatar} }));
    });
    socket.on("updateReadiness", ({id, ready}) => {
      if (ready) {
        setReadyPlayers((readyPlayers) => readyPlayers + 1);
      } else {
        setReadyPlayers((readyPlayers) => readyPlayers - 1);
      }
      setLobbyPlayers((players) => ({ ...players, [id]: {...players[id], ready: ready} }));
    });
    socket.on("startLobbyGame", (code) => {
      post("/api/spawn", { avatar: animal[currentIndex], lobbyCode: code }).then(() => navigate("/game"));
    });

    return () => {
      socket.off("newPlayer");
      socket.off("updateAvatar");
      socket.off("updateReadiness");
    };
  }, []);

  useEffect(() => {
    get(`/api/lobbydata/${props.lobbyId}`).then((res) => {
      res.players.forEach((pid, index) => {
        setLobbyPlayers((players) => ({ ...players, [pid]: {name: res.names[index], avatar: "bear", ready: res.readiness[index]} }));
      });
    });
  }, []);

  // TEMP
  useEffect(() => {
    console.log(lobbyPlayers); // This will log every time lobbyPlayers is updated
  }, [lobbyPlayers]);

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
    avatarPlayer(animal[currentIndex]);
  };
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + sprites.length) % sprites.length);
    avatarPlayer(animal[currentIndex]);
  };


  const handlePlay = () => {
    prepLobbyGame();
  }
  let playButton = null;
  if (lobbyPlayers[userId]) {
    playButton = (
      <div>
          <button className={readyPlayers === Object.keys(lobbyPlayers).length ? "Lobby-ready" : "Lobby-not-ready"} onClick={ handlePlay }>
            {readyPlayers === Object.keys(lobbyPlayers).length ? 'Play!' : 'Waiting...'}
          </button>
      </div>
    );
  }

  const handleReady = () => {
    if (lobbyPlayers[userId].ready) {
      readyPlayer(false);
    } else {
      readyPlayer(true);
    }
  }
  let readyButton = null;
  if (lobbyPlayers[userId]) {
    readyButton = (
      <div>
          <button className={lobbyPlayers[userId].ready ? "Lobby-ready" : "Lobby-not-ready"} onClick={ handleReady }>
            {lobbyPlayers[userId].ready ? 'Ready!' : 'Not Ready'}
          </button>
      </div>
    );
  }


  return (
    <div className="Background">
      <NavBar />
      <div className="Lobby">
        <h1>Lobby ID: {props.lobbyId}</h1>
        <div className="Lobby-players">
          {Object.entries(lobbyPlayers).map(([id, {name, avatar, ready}]) => {
            const isCurrentPlayer = id === userId;
            return (
              <div className="character-selection" key={id}>
                  <h2>{name}</h2>
                  {isCurrentPlayer && <div className="character-selection-options">
                      <button className="left-button" onClick={handlePrevious}></button>
                      <div className="character-container">
                          <img src={sprites[currentIndex].src}
                          style={{width:"275px", height:"auto"}}/>
                      </div>
                      <button className="right-button" onClick={handleNext}></button>
                  </div>}
                  {!isCurrentPlayer && <div className="character-selection-options">
                      <div className="character-container">
                          <img src={`/${avatar}left.png`}
                          style={{width:"275px", height:"auto"}}/>
                      </div>
                  </div>}
                  {isCurrentPlayer && <h2><i>{animal[currentIndex]}</i></h2>}
                  {!isCurrentPlayer && <h2><i>{avatar}</i></h2>}
                  {isCurrentPlayer && readyButton}
                  {!isCurrentPlayer &&
                    <div>
                        <button className={ready ? "Lobby-ready" : "Lobby-not-ready"}>
                          {ready ? 'Ready!' : 'Not Ready'}
                        </button>
                    </div>
                  }
              </div>
            );
          })}
        </div>
        {readyPlayers === Object.keys(lobbyPlayers).length && playButton}
      </div>
    </div>
  );
};

export default LobbyM;
