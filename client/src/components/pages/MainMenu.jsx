import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './MainMenu.css';

const MainMenu = () => {
    let navigate = useNavigate(); 
    const routeChange = () =>{   //on singleplayer click, redirect to game page
        navigate("/game");  
    }
        return (
        <div className = "main-menu">
            <h1>Main Menu </h1>
            <div className = "menu-options">
                <button onClick={routeChange}>
                    <img src="/singleplayerButton.png" alt="SinglePlayer" style={{width:"205px", height:"auto"}}/>
                </button>
                {/* <button> Multiplayer </button> ##to be implemented later##
                <button> Settings </button>
                <button> High Scores </button> */}
            </div>
        </div>
    );
};

export default MainMenu;
