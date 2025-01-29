import React from 'react';
import { useParams } from "react-router-dom";

const LobbyM = () => {
  let props = useParams();
  return (
    <div>
      <h2>Lobby Waiting Room</h2>
      <p>Lobby ID: {props.lobbyId}</p>
      <button>Ready Up</button>
      {/* Add more waiting room functionality here */}
    </div>
  );
};

export default LobbyM;
