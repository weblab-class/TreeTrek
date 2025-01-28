import React from 'react'
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './Tutorial.css';

const Tutorial = () => {
    let navigate = useNavigate();

    return (
        <div className="Tutorial">
            <h1>Tutorial</h1>
            <div className="Tutorial-text">
                <p> Welcome to TreeTrek! </p>
                <p> Your goal is to climb as many branches as possible within the time limit. </p>
                <p> To climb, press the right and left arrows on your keyboard. </p>
                <p> If the branch is on the same side as your character, press the arrow for that side to climb up (e.g., left arrow for a branch on the left). </p>
                <p> Otherwise, click the other arrow to hop and climb onto a branch on the other side.</p>
                <p> Pressing the wrong arrow key will cause your character to fall, ending the game. The game also ends with the allocated time runs out.</p>
                <p> Good luck and have fun! </p>
            </div>
            <button className="Tutorial-button" onClick={() => navigate("/mainmenu")}>
            <img src="/mainMenuButton.png" alt="menuButton" style={{width:"auto", height:"90px"}}/>
            </button>
        </div>
    );
};

export default Tutorial;