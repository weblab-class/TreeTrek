import React, { useState } from 'react';
import { get, post } from "../../utilities";
import { useNavigate } from 'react-router-dom';

const FindLobby = () => {
  const [lobbyCode, setLobbyCode] = useState('');
  const navigate = useNavigate();

  const handleJoinLobby = async () => {
    await get(`/api/join-lobby/${lobbyCode}`);
    console.log(lobbyCode);
    navigate(`/lobbym/${lobbyCode}`);
  };

  const handleCreateLobby = async () => {
    const response = await post('/api/create-lobby');
    console.log(response);
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
