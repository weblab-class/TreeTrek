import React, {useState} from 'react'
import './MainMenu.css';
// import { useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';

const MainMenu = () => {
    // let navigate = useNavigate();
    // let history = useHistory();
    
   return (
        <div>
            <div className = "main-menu">
                <h1> Welcome to the Main Menu </h1>
                <div className = "menu-options">
                    <button> Singleplayer </button>
                    <button> Multiplayer </button>
                    <button> Settings </button>
                    <button> High Scores </button>
                </div>
            </div>

            {/* <div className = "back-button">
                <button onClick = {() => history.goBack()}> Back </button>
            </div> */}
        </div>

      
    );

};

export default MainMenu;
