import React, { useContext, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./LoginPage.css";
import { UserContext } from "../App";

const LoginPage = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(userId) {
      navigate("../mainmenu/");
    }
  }, [userId, navigate]);

  return (
    <div className = "LoginPage-container">
      <h1>TreeTrek</h1>
      <div className = "LoginPage-button">
        {userId ? (
          <button
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
