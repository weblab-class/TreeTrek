import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Skeleton.css";
import { UserContext } from "../App";


const Skeleton = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <div className = "login-container">
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
      <button>Play As Guest</button>
    </div>
  );
};

export default Skeleton;
