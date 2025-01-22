import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './MainMenu.css';

const MainMenu = () => {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        navigate("/game");
    }
        return (
        <div className = "main-menu">
            <h1>Main Menu </h1>
            <div className = "menu-options">
                <button onClick={routeChange}>
                    <img src="/singleplayerButton.png" alt="SinglePlayer" style={{width:"150px", height:"auto"}}/>
                </button>
                {/* <button> Multiplayer </button>
                <button> Settings </button>
                <button> High Scores </button> */}
            </div>
        </div>
    );
};

export default MainMenu;
