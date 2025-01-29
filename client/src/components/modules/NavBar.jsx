import React, { useContext } from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; 

import "../../utilities.css";
import "./NavBar.css"
import { UserContext } from "../App";

const NavBar = () => {
    const navigate = useNavigate();
    const { userId, handleLogout } = useContext(UserContext);

    return (
        <div className="NavBar">
            <button onClick ={() => navigate("/mainmenu")} className="NavBar-title">TreeTrek</button>          
            {userId && (
                <button
                className="logout-button"
                onClick={() => {
                    googleLogout();
                    handleLogout();
                    navigate("/");
                }}
                >
                Logout
                </button>
            )}
        </div>
    );
};

export default NavBar;