/** constants */
// const ACORN_PROB = 0.2; // probability of acorn at any given branch
const VISIBLE_BRANCHES = 6; // number of visible branches onscreen at any given moment

class GameLogic {
  constructor() {
    this.gameState = {
      multiplayer: false, // boolean for multiplayer
      winner: null, // multiplayer end game condition
      gameOver: false, // singleplayer end game condition
      players: {}, // dict of ids pointing to dictionary of position & avatar
        // ex: {'13523': xPosition: "left", avatar: "beaver", index: branchIndex, alive: true, animation: 0}
      branches: [], // array of branch directions ex: ["right", "left", ...]
      acorns: [], // array of indices representing the branch index each acorn is on
      lowestBranchIndex: 0, // number of branches that have been popped for efficiency purposes
      time: 0, // how many milliseconds in the game
    };
  }

  /** Resets game state */
  resetGame() {
    this.gameState.winner = null;
    this.gameState.gameOver = false;
    this.gameState.players = {};
    this.gameState.branches = [];
    this.gameState.time = 0;
    this.spawnBranches();
  }

  /** Adds first (VISIBLE_BRANCHES + 1) branches to game state, with random directions */
  spawnBranches() {
    for (let index = 0; index < (VISIBLE_BRANCHES + 1); index++) {
      if (Math.random() < 0.5) {
          this.gameState.branches.push("right");
      } else {
          this.gameState.branches.push("left");
      }
    }
  }
  
  /** Adds a player to the game state, initialized with position of 1st branch */
  spawnPlayer(id, avatar) {
    this.gameState.players[id] = {
      xPosition: this.gameState.branches[0],
      avatar: avatar,
      index: 0,
      alive: true,
      animation: 0,
    };
    if (this.gameState.players.length == 2) {
      this.gameState.multiplayer = true;
    }
  };

  /** Update the game state. This function is called once per server tick. */
  updateGameState(serverTime) {
    this.gameState.time = serverTime;
    this.checkWin();
    this.checkGameOver();
  }

  /** Moves a player based off the sent data from the "move" socket msg */
  movePlayer(id, dir) {
    // If player doesn't exist, don't move anything
    if (this.gameState.players[id] == undefined) {
      return;
    }
    // could possibly insert message to press L & R arrow if user presses other key

    // check if direction is correct & change altitude
    this.gameState.players[id].index += 1;
    const branchIndex = this.gameState.players[id].index;
    if (dir === this.gameState.branches[branchIndex]) {
      this.updateBranches();
      // updateAcorns(branchIndex);
      this.gameState.players[id].xPosition = dir;
      this.gameState.players[id].animation = 1;
    } else if (dir === "right" || dir === "left") {
      this.gameState.players[id].alive = false;
    }
  }

  /** After player moves, updates branches accordingly */
  updateBranches() {
    if (Math.random() < 0.5) {
      this.gameState.branches.push("right");
    } else {
      this.gameState.branches.push("left");
    }
  }

  updateAnimation(pid, update) {
    if (update == 0) {
      this.gameState.players[pid].animation = 0;
    } else {
      this.gameState.players[pid].animation += 1;
    }
  }

  /** Check multiplayer win condition (only player left) */
  checkWin() {
    if (this.gameState.multiplayer) {
      let alivePlayers = 0;
      let player = null;
      for (let playerid in this.gameState.players) {
        if (this.gameState.players[playerid].alive) {
          alivePlayers += 1;
          if (alivePlayers > 1) {
            return false;
          }
          player = playerid;
        }
      }
      this.gameState.winner = player;
      this.gameState.gameOver = true;
      return true;
    }
  }

  /** Check if player falls off branch */
  checkGameOver() {
    if (!this.gameState.multiplayer) {
      for (let playerid in this.gameState.players) {
        if (!this.gameState.players[playerid].alive) {
          this.gameState.gameOver = true;
        }
      }
    }
    return this.gameState.gameOver;
  }

  /** Remove a player from the game state if they disconnect */
  removePlayer(id) {
    if (this.gameState.players[id] != undefined) {
      delete this.gameState.players[id];
      if (Object.keys(this.gameState.players).length == 1) {
        this.gameState.multiplayer = false;
      }
    }
  }

}

module.exports = GameLogic;

// module.exports = {
//   gameState,
//   spawnPlayer,
//   spawnBranches,
//   spawnAcorns,
//   movePlayer,
//   updateAnimation,
//   removePlayer,
//   updateGameState,
//   resetGame,
// }


/** Acorn Functions! */

// /** Helper to check a player eating an acorn */
// const playerAttemptEatAcorns = (pid1, acornIndex) => {
//   if (gameState.players[pid1].index === acornIndex) {
//     removeAcorn(acornIndex);
//   }
// };

// /** Attempts all pairwise eating between each player and all acorns */
// const computePlayersEatAcorns = () => {
//   Object.keys(gameState.players).forEach((pid1) => {
//     gameState.acorns.forEach((f) => {
//       playerAttemptEatAcorns(pid1, f);
//     });
//   });
// };

// /** Adds acorns to the game state, initialized with random probability */
// const spawnAcorns = () => {
//   for (let index = 0; index < (VISIBLE_BRANCHES + 1); index++) {
//     if (Math.random() < ACORN_PROB) {
//       gameState.acorns.push(index);
//     }
//   }
// };

// /** Remove an acorn from the game state if it gets eaten, given reference to acorn object */
// const removeAcorn = (acornIndex) => {
//   let ix = gameState.acorns.indexOf(acornIndex);
//   if (ix !== -1) {
//     gameState.acorns.splice(ix, 1);
//   }
// };

// /** For every newly generated branch, possibly add an acorn */
// const updateAcorns = (index) => {
//   if (Math.random() < ACORN_PROB) {
//     gameState.acorns.push(index);
//   }
// }
