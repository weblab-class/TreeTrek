/** constants */
const MAP_LENGTH = 600;
const PLAYER_HEIGHT = 75;
const ACORN_SIZE = 10;
const ACORN_PROB = 0.2;
const RIGHT_POS = 450;
const LEFT_POS = 150;
const INITIAL_HEIGHT = 200;
const VISIBLE_BRANCHES = 6;
const BRANCH_SEP = 150; // distance between branches
const avatars = ["cat", "beaver"];
const branches = ["right", "left"];

/** Utils! */

/** Game State */
const gameState = {
    winner: null,
    gameOver: false,
    players: {}, // dict of ids pointing to dictionary of position & avatar ex: {'13523': {position: {x: 350, y: 150}, avatar: "beaver"}}
    branches: [], // array of branch directions ex: [RIGHT_POS, LEFT_POS, ...]
    food: [], // array of food positions
    // position has an x and y: position.x & position.y
};


/** Game logic */

/** Adds first (VISIBLE_BRANCHES + 1) branches to game state, with random directions */
const spawnBranches = () => {
    for (let index = 0; index < (VISIBLE_BRANCHES + 1); index++) {
        if (Math.random() < 0.5) {
            gameState.branches.push(RIGHT_POS);
        } else {
            gameState.branches.push(LEFT_POS);
        }
    }
};

/** Adds a player to the game state, initialized with position of 1st branch */
const spawnPlayer = (id) => {
    gameState.players[id] = {
      position: {x: gameState.branches[0], y: INITIAL_HEIGHT},
      avatar: "cat", // idk how to find avatar for now
    };
};

/** Adds a food to the game state, initialized with random probability */
const spawnFood = () => {
  for (let index = 0; index < (VISIBLE_BRANCHES + 1); index++) {
    if (Math.random() < ACORN_PROB) {
      gameState.food.push({x: gameState.branches[index], y: index * BRANCH_SEP})
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
  if (dir === "right") {
    desiredPosition.x = RIGHT_POS;
  } else if (dir === "left") {
    desiredPosition.x = LEFT_POS;
  }

  // check if direction is correct & change height
  const curr_index = (desiredPosition.y - INITIAL_HEIGHT) / BRANCH_SEP;
  if (dir === gameState.branches[curr_index + 1]) {
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
  if (gameState.gameOver) {
    return true;
  } else { // idk if this is good convention
    return false;
  }
};

/** Update the game state. This function is called once per server tick. */
const updateGameState = () => {
  checkWin();
  checkGameOver();
};

/** Remove a player from the game state if they fall off a branch */
const removePlayer = (id) => {
  if (gameState.players[id] != undefined) {
    delete gameState.players[id];
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
const updateAcorns = () => {
  if (Math.random() < ACORN_PROB) {
    
  }
}

module.exports = {
  gameState,
  spawnBranches,
  spawnPlayer,
  removePlayer,
  updateGameState,
};
