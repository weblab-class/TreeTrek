import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";

import './MainMenu.css';

const MainMenu = () => {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        navigate("/game");
    }
        return (
        <div className = "main-menu">
            <h1> Welcome to the Main Menu </h1>
            <div className = "menu-options">
                <button onClick={routeChange}> Singleplayer </button>
                <button> Multiplayer </button>
                <button> Settings </button>
                <button> High Scores </button>
            </div>
        </div>
    );
};

export default MainMenu;
