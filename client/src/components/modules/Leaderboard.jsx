import React from "react";
import "./Leaderboard.css";

/**
 * Component that shows countdown from 30 seconds
 *
 * Proptypes
 * @param {String} playerid userid NEEDS TO BE GOOGLE ID???
 * @param {dict} players key: googleid, value: {name, highestGame}
 */
const Leaderboard = (props) => {
  const sortedPlayers = Object.entries(props.players).sort((a, b) => b[1].highestGame - a[1].highestGame);

  return (
    <div className="Leaderboard">
      <div className="Leaderboard-title">Leaderboard</div>
      <ul className="Leaderboard-list">
        {sortedPlayers.map(([player, {name, highestGame}], index) => {
          const isCurrentPlayer = player === props.playerid;
          return (
          <li key={player} className={`Leaderboard-item${isCurrentPlayer ? '-current-player' : ''}`}>
            <span className="player">{index + 1}. {name}</span>
            <span className="score">{highestGame}</span>
          </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Leaderboard;
