/** constants */
const ACORN_PROB = 0.2; // probability of acorn at any given branch
const RIGHT_POS = 450; // position of right branch/player
const LEFT_POS = 150; // position of left branch/player
const VISIBLE_BRANCHES = 6; // number of visible branches onscreen at any given moment
const BRANCH_SEP = 150; // distance between branches
const avatars = ["cat", "beaver"];

/** Utils! */

/** Helper to check a player eating an acorn */
const playerAttemptEatAcorns = (pid1, acornIndex) => {
  if (gameState.players[pid1].index === acornIndex) {
    removeAcorn(acornIndex);
  }
};

/** Attempts all pairwise eating between each player and all acorns */
const computePlayersEatAcorns = () => {
  Object.keys(gameState.players).forEach((pid1) => {
    gameState.acorns.forEach((f) => {
      playerAttemptEatAcorns(pid1, f);
    });
  });
};

/** Game State */
const gameState = {
    winner: null, // multiplayer end game condition
    gameOver: false, // singleplayer end game condition
    players: {}, // dict of ids pointing to dictionary of position & avatar
      // ex: {'13523': xPosition: "left", avatar: "beaver", index: branchIndex}, animation: 0}
    branches: [], // array of branch directions ex: ["right", "left", ...]
    acorns: [], // array of indices representing the branch index each acorn is on
    lowestBranchIndex: 0, // number of branches that have been popped for efficiency purposes
    time: 0, // how many milliseconds in the game
};


/** Game logic */

/** Adds first (VISIBLE_BRANCHES + 1) branches to game state, with random directions */
const spawnBranches = () => {
  for (let index = 0; index < (VISIBLE_BRANCHES + 1); index++) {
      if (Math.random() < 0.5) {
          gameState.branches.push("right");
      } else {
          gameState.branches.push("left");
      }
  }
};

/** Adds a player to the game state, initialized with position of 1st branch */
const spawnPlayer = (id, avatar) => {
  gameState.players[id] = {
    xPosition: gameState.branches[0],
    avatar: avatar,
    index: 0,
    animation: 0,
  };
};

const setAvatar = (id, avatar) => {
  gameState.players[id].avatar = avatar;
};

/** Adds acorns to the game state, initialized with random probability */
const spawnAcorns = () => {
  for (let index = 0; index < (VISIBLE_BRANCHES + 1); index++) {
    if (Math.random() < ACORN_PROB) {
      gameState.acorns.push(index);
    }
  }
};

/** Moves a player based off the sent data from the "move" socket msg */
const movePlayer = (id, dir) => {
  // If player doesn't exist, don't move anything
  if (gameState.players[id] == undefined) {
    return;
  }
  // could possibly insert message to press L & R arrow if user presses other key

  // check if direction is correct & change altitude
  gameState.players[id].index += 1;
  const branchIndex = gameState.players[id].index;
  if (dir === gameState.branches[branchIndex]) {
    updateBranches();
    updateAcorns(branchIndex);
    gameState.players[id].xPosition = dir;
    gameState.players[id].animation = 1;
  } else if (dir === "right" || dir === "left") {
    gameState.gameOver = true;
  }
};

const updateAnimation = (pid, update) => {
  if (update == 0) {
    gameState.players[pid].animation = 0;
  } else {
    gameState.players[pid].animation += 1;
  }
};

/** Check multiplayer win condition (only player left) */
const checkWin = () => {
  if (Object.keys(gameState.players).length == 1) {
    gameState.winner = Object.keys(gameState.players);
    return true;
  }
};

/** Check if player falls off branch */
const checkGameOver = () => {
  return gameState.gameOver;
};

/** Update the game state. This function is called once per server tick. */
const updateGameState = (serverTime) => {
  gameState.time = serverTime;
  checkWin();
  checkGameOver();
  //computePlayersEatAcorns();
};

/** Remove a player from the game state if they fall off a branch */
const removePlayer = (id) => {
  if (gameState.players[id] != undefined) {
    delete gameState.players[id];
  }
};

/** Remove an acorn from the game state if it gets eaten, given reference to acorn object */
const removeAcorn = (acornIndex) => {
  let ix = gameState.acorns.indexOf(acornIndex);
  if (ix !== -1) {
    gameState.acorns.splice(ix, 1);
  }
};

/** After player moves, updates branches accordingly */
const updateBranches = () => {
  if (Math.random() < 0.5) {
    gameState.branches.push("right");
  } else {
    gameState.branches.push("left");
  }
};

/** For every newly generated branch, possibly add an acorn */
const updateAcorns = (index) => {
  if (Math.random() < ACORN_PROB) {
    gameState.acorns.push(index);
  }
}

const resetGame = () => {
  gameState.winner = null;
  gameState.gameOver = false;
  gameState.players = {};
  gameState.branches = [];
  gameState.time = 0;
  spawnBranches();
  // gameState = { // resets game state
  //   winner: null,
  //   gameOver: false,
  //   players: {},
  //   acorns: [],
  //   lowestBranchIndex: 0
  // };
};

module.exports = {
  gameState,
  spawnPlayer,
  spawnBranches,
  spawnAcorns,
  movePlayer,
  updateAnimation,
  removePlayer,
  updateGameState,
  resetGame,
};
