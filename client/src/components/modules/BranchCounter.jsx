import React from "react";
import "./BranchCounter.css";

/**
 * Component that shows countdown from 30 seconds
 *
 * Proptypes
 * @param {int} branch current branch
 */
const BranchCounter = (props) => {
  return (
    <div className="BranchCounter">
      {props.branch}
    </div>
  );
};

export default BranchCounter;
