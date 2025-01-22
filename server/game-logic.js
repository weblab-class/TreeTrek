/** constants */
const MAP_LENGTH = 600;
const ACORN_PROB = 0.2; // probability of acorn at any given branch
const RIGHT_POS = 450; // position of right branch/player
const LEFT_POS = 150; // position of left branch/player
const VISIBLE_BRANCHES = 6; // number of visible branches onscreen at any given moment
const BRANCH_SEP = 150; // distance between branches
const avatars = ["cat", "beaver"];

/** Utils! */

/** Helper to check a player eating a piece of food */
const playerAttemptEatFood = (pid1, f) => {
  const player1Position = gameState.players[pid1].position;
  const foodPosition = f.position;
  const x1 = player1Position.x;
  const y1 = player1Position.y;
  const x2 = foodPosition.x;
  const y2 = foodPosition.y;
  if (x1 === x2 && y1 === y2) {
    removeAcorn(f);
  }
};

/** Attempts all pairwise eating between each player and all foods */
const computePlayersEatFoods = () => {
  Object.keys(gameState.players).forEach((pid1) => {
    gameState.food.forEach((f) => {
      playerAttemptEatFood(pid1, f);
    });
  });
};

/** Game State */
const gameState = {
    winner: null, // multiplayer end game condition
    gameOver: false, // singleplayer end game condition
    players: {}, // dict of ids pointing to dictionary of position & avatar ex: {'13523': {position: {x: "left", y: altitude}, avatar: "beaver", index: branchIndex}}
    branches: [], // array of branch directions ex: ["right", "left", ...]
    food: [], // array of indices representing the branch index each acorn is on
    lowestBranchIndex: 0 // number of branches that have been popped for efficiency purposes
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
const spawnPlayer = (id) => {
    gameState.players[id] = {
      position: {x: gameState.branches[0], y: 0},
      avatar: "cat", // idk how to find avatar for now
      index: 0
    };
};

/** Adds a food to the game state, initialized with random probability */
const spawnFood = () => {
  for (let index = 0; index < (VISIBLE_BRANCHES + 1); index++) {
    if (Math.random() < ACORN_PROB) {
      gameState.food.push({x: gameState.branches[index], y: index})
    }
  }
};

/** Moves a player based off the sent data from the "move" socket msg */
const movePlayer = (id, dir) => {
  // If player doesn't exist, don't move anything
  if (gameState.players[id] == undefined) {
    return;
  }

  // Initialize a desired position to move to
  const desiredPosition = {
    x: gameState.players[id].position.x,
    y: gameState.players[id].position.y,
  };

  // Calculate desired position
  if (dir === "right" || dir === "left") {
    desiredPosition.x = dir;
    desiredPosition.y += BRANCH_SEP;
  }
  // could possibly insert message to press L & R arrow if user presses other key

  // check if direction is correct & change altitude
  const currIndex = desiredPosition.y / BRANCH_SEP;
  const branchIndex = currIndex + gameState.lowestBranchIndex; // should be correct indexing?
  if (dir === gameState.branches[branchIndex]) {
    updateBranches();
    updateAcorns(branchIndex);
    gameState.players[id].position = desiredPosition;
  } else {
    gameState.gameOver = true;
  }
};

/** Check multiplayer win condition (only player left) */
const checkWin = () => {
  if (Object.keys(gameState.players).length == 1) {
    gameState.gameOver = true;
    gameState.winner = Object.keys(gameState.players);
    return true;
  }
};

/** Check if player falls off branch */
const checkGameOver = () => {
  return gameState.gameOver;
};

/** Update the game state. This function is called once per server tick. */
const updateGameState = () => {
  checkWin();
  checkGameOver();
  computePlayersEatFoods();
};

/** Remove a player from the game state if they fall off a branch */
const removePlayer = (id) => {
  if (gameState.players[id] != undefined) {
    delete gameState.players[id];
  }
};

/** Remove an acorn from the game state if it gets eaten, given reference to acorn object */
const removeAcorn = (f) => {
  let ix = gameState.food.indexOf(f);
  if (ix !== -1) {
    gameState.food.splice(ix, 1);
  }
};

/** After player moves, updates branches accordingly */
const updateBranches = () => {
  if (Math.random() < 0.5) {
    gameState.branches.push(RIGHT_POS);
  } else {
    gameState.branches.push(LEFT_POS);
  }
};

/** For every newly generated branch, possibly add an acorn */
const updateAcorns = (index) => {
  if (Math.random() < ACORN_PROB) {
    gameState.food.push(index);
  }
}

const resetGame = () => {
  gameState.winner = null;
  gameState.gameOver = false;
};

module.exports = {
  gameState,
  spawnPlayer,
  spawnBranches,
  spawnFood,
  movePlayer,
  removePlayer,
  updateGameState,
  resetGame,
};
