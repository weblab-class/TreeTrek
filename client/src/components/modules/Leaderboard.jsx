import React from "react";
import "./Leaderboard.css";

/**
 * Component that shows countdown from 30 seconds
 *
 * Proptypes
 * @param {dict} players key: id, value: score
 */
const Leaderboard = (props) => {
  const sortedPlayers = Object.entries(props.players).sort((a, b) => b[1] - a[1]);

  return (
    <div className="Leaderboard">
      <div className="Leaderboard-title">Leaderboard</div>
      <ul className="Leaderboard-list">
        {sortedPlayers.map(([player, score], index) => (
          <li key={player} className="Leaderboard-item">
            <span className="player">{index + 1}. {player}</span>
            <span className="score">{score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
