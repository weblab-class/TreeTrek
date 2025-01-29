import React from 'react'
import NavBar from "../modules/NavBar";
import TwinklingStars from '../modules/TwinklingStars';
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import './Tutorial.css';

const Tutorial = () => {
    let navigate = useNavigate();

    return (
        <div>
            <NavBar/>
            <TwinklingStars/>
            <div className="Tutorial">
                <h1>Tutorial</h1>
                <div className="Tutorial-text">
                    <h3> Welcome to TreeTrek! </h3>
                    <p> Your goal is to climb as many branches as possible within the time limit. <br>
                    </br>To climb, press the right and left arrows on your keyboard. </p>
                    <p> If the branch is on the same side as your character, press the arrow for that side to climb up (eg. press<i class="bi bi-caret-left"></i> to climb up). </p>
                    <img src="/sameBranches.png" alt="sameBranches" style={{width:"auto", height:"90px"}}></img>
                    <p> Otherwise, click the other arrow to hop and climb onto a branch on the other side (eg. press<i class="bi bi-caret-left"></i>to climb left).</p>
                    <img src="/diffBranches.png" alt="diffBranches" style={{width:"auto", height:"90px"}}></img>
                    <p> Pressing the wrong arrow key will cause your character to fall, ending the game. The game also ends with the allocated time runs out.</p>
                    <p> Good luck and have fun! </p>
                </div>
                <button className="mainMenu-button" onClick={() => navigate("/mainmenu")}>
                    <img src="/mainMenuButton.png" alt="menuButton" style={{width:"auto", height:"90px"}}/>
                </button>
            </div>
        </div>
    );
};

export default Tutorial;