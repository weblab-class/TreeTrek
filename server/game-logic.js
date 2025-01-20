/** constants */
const MAP_LENGTH = 600;
const PLAYER_HEIGHT = 75;
const ACORN_SIZE = 10;
const ACORN_PROB = 0.2;
const RIGHT_POS = 450;
const LEFT_POS = 150;
const INITIAL_HEIGHT = 50;
const avatars = ["cat", "beaver"];
const branches = ["right", "left"];

/** Utils! */

/** Helper to generate a random integer */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

/** Game State */
const gameState = {
    winner: null,
    players: {}, // dict of ids pointing to dictionary of position & avatar ex: {'13523': {position: {x: 350, y: 150}, avatar: "beaver"}}
    branches: [], // array of branch directions ex: [RIGHT_POS, LEFT_POS, ...]
    food: [], // array of food positions
    // position has an x and y: position.x & position.y
};


/** Game logic */

/** Adds first 7? branches to game state, with random directions */
const spawnBranches = () => {
    for (let index = 0; index < 7; index++) {
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

const removePlayer = (id) => {
  if (gameState.players[id] != undefined) {
    delete gameState.players[id];
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
      desiredPosition.x = RIGHT_POS; // idk what the correct coords are atm
    } else if (dir === "left") {
      desiredPosition.x = LEFT_POS;
    }
    // need to check if direction is correct & change height

    // Move player
    gameState.players[id].position = desiredPosition;
};


/** After player moves, updates branches accordingly */
const updateBranches = () => {

};

/** Update the game state. This function is called once per server tick. */
const updateGameState = () => {
};

module.exports = {
  gameState,
  spawnBranches,
  spawnPlayer,
  removePlayer,
  updateGameState,
};
