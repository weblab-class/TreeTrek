import React, { useState } from 'react';
import { get, post } from "../../utilities";
import { useNavigate } from 'react-router-dom';

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
      <h2>Lobby Page</h2>
      <button onClick={handleJoinLobby}>
        Join Lobby
      </button>
      <input
        type="text"
        value={lobbyCode}
        onChange={(e) => setLobbyCode(e.target.value)}
        placeholder="Enter lobby code"
      />
      <button onClick={handleCreateLobby}>
        Create Lobby
      </button>
    </div>
  );
};

export default FindLobby;
