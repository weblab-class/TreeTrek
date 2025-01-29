import React, { useContext, useState, useEffect, useRef } from "react";
import { get, post } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';

import NavBar from "../modules/NavBar";
import "../../utilities.css";
import './Lobby.css';

const LobbyS = () => {
    const { userId } = useContext(UserContext);
    let navigate = useNavigate();

    
    const sprites = [
        { name: 'cat', src: './cat.png' },
        { name: 'beaver', src: './beaver.png' }
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sprites.length);
    };
    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
          (prevIndex - 1 + sprites.length) % sprites.length);
    };


    let spawnButton = null;
    if (userId) {
        post("/api/newlobby");
        post("/api/spawn");
        spawnButton = (
            <div>
                <button className="Lobby-spawn" onClick={() => {navigate("/game"); }}>
                    Play!
                </button>
            </div>
        );
    };
    

    return (
        <div>
            <NavBar />
            <div className="character-selection">
                <h1>Character Selection</h1>
                <div className="message-box"></div>
                <div className="character-selection-options">
                    <button className="left-button" onClick={handlePrevious}></button>
                    <div className="character-container">
                        <img src={sprites[currentIndex].src} 
                        alt={sprites[currentIndex].name}
                        style={{width:"275px", height:"auto"}}/>
                    </div>
                    <button className="right-button" onClick={handleNext}></button>
                </div>
                {spawnButton}
            </div>
        </div>
    );
};

export default LobbyS;
