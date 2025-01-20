import React, {useState} from 'react'
import './MainMenu.css';

const MainMenu = () => {
    return (
        <div className = "main-menu">
            <h1> Welcome to the Main Menu </h1>
            <div className = "menu-options">
                <button> Singleplayer </button>
                <button> Multiplayer </button>
                <button> Settings </button>
                <button> High Scores </button>
            </div>
        </div>
    );

};

export default MainMenu;
