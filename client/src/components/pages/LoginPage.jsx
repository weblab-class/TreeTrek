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
      navigate("/mainmenu/");
    }
  }, [userId, navigate]);

  return (
    <div className = "LoginPage-container">
      <h1>TreeTrek</h1>
      <div>
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
      {/* <button>Play As Guest</button> */}
    </div>
  );
};

export default LoginPage;
