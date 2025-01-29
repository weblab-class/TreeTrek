import react from "react";  

import "../../utilities.css";
import "./MovingClouds.css";

const MovingClouds = () => {
    return (
        <div className="sky">
            <img src="./cloud.png" className="cloud cloud1"/>
            <img src="./cloud1.png" className="cloud cloud2"/>
            <img src="./cloud.png" className="cloud cloud3"/>
            <img src="./cloud1.png" className="cloud cloud4"/>
        </div>
    );
};  

export default MovingClouds;