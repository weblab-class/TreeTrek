import React from "react";
import "./Timer.css";

/**
 * Component that shows countdown from 30 seconds
 *
 * Proptypes
 * @param {int} time current game time
 */
const Timer = (props) => {
  return (
    <div className="Time">
      time remaining: {30 - props.time}s
    </div>
  );
};

export default Timer;
