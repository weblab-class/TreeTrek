import React, { useContext } from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; 
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./NavBar.css"
import { UserContext } from "../App";

const NavBar = () => {
    const navigate = useNavigate();
    const { userId, handleLogout } = useContext(UserContext);

    // Function to delete the lobby the user is in
    const deleteUserLobby = async () => {
        if (!userId) return;
        try {
            post(`/api/leavelobby/${userId}`);

        } catch (error) {
            console.error("Error deleting lobby:", error);
        }
    };

    const handleNavigation = async (path) => {
        await deleteUserLobby(); // Delete the lobby before navigation
        navigate(path);
    };

    const handleUserLogout = async () => {
        await deleteUserLobby(); // Delete lobby before logging out
        googleLogout();
        handleLogout();
        navigate("/");
    };

    return (
        <div className="NavBar">
            <button onClick ={() => handleNavigation("/mainmenu")} className="NavBar-title">TreeTrek</button>          
            {userId && (
                <button
                className="logout-button"
                onClick={() => { handleUserLogout }}
                >
                Logout
                </button>
            )}
        </div>
    );
};

export default NavBar;