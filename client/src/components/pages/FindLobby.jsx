import React, { useState } from 'react';
import { get, post } from "../../utilities";
import { useNavigate } from 'react-router-dom';
import Navbar from "../modules/NavBar";
import "./FindLobby.css";
import "../../utilities.css";

const FindLobby = () => {
  const [lobbyCode, setLobbyCode] = useState('');
  const navigate = useNavigate();

  const handleJoinLobby = async () => {
    try {
      await get(`/api/joinlobby/${lobbyCode}`);
      navigate(`/lobbym/${lobbyCode}`);
    } catch (error) {
      alert("oops, please check code and try again");
    }
  };

  const handleCreateLobby = async () => {
    const response = await post('/api/createlobby');
    setLobbyCode(response.lobbyId);
    navigate(`/lobbym/${response.lobbyId}`);
  };

  return (
    <div>
      <Navbar />
      <div className = "lobby-container">
        {/* <h2>Lobby Page</h2> */}
        <button onClick={handleCreateLobby}className = "create-button">
          CREATE LOBBY
        </button>
        <input
          type="text"
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          placeholder="ENTER LOBBY CODE"
          className="input-box"
        />
        <button onClick={handleJoinLobby} className = "join-button">
          JOIN LOBBY
        </button>
      </div>
    </div>
  );
};

export default FindLobby;
