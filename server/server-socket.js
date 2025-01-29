const GameLogic = require("./game-logic");

let io;
let lobbies = {}; // dict mapping lobby code to gameLogic object

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.sockets.get(socketid);

/** Initializes a gameLogic object from the given lobby code */
const initGame = async (lobbyCode) => {
  try {
    const lobby = await Lobby.findOne({ code: lobbyCode });

    if (!lobby) {
      console.log('Lobby not found');
      return null; // Handle case where lobby doesn't exist
    }

    console.log('Lobby found:', lobby);
    lobbies[lobbyCode] = new GameLogic();
  } catch (error) {
    console.error('Error finding lobby:', error);
  }
};

const sendGameState = (lobbyCode) => {
  gameInstance = lobbies[lobbyCode];
  io.emit("update", gameInstance.gameState);
  Object.keys(gameInstance.gameState.players).forEach((pid) => {
    if (gameInstance.gameState.players[pid].animation == 5) {
      gameInstance.updateAnimation(pid, 0);
    }
    else if (gameInstance.gameState.players[pid].animation != 0) {
      gameInstance.updateAnimation(pid, 1);
    }
  });
};

const runGame = (lobbyCode) => {
  gameInstance = lobbies[lobbyCode];
  let time = 0; // time in ms
  const intervalID = setInterval(() => {
    //console.log("interval start time " + timesRun);
    gameInstance.updateGameState(time);
    sendGameState(lobbyCode); // sends to frontend game component

    time += 1000 / 60;
    //console.log("time " + timesRun);
    if (gameInstance.gameState.gameOver || time >= 30 * 1000) {
      //console.log('its over');
      gameInstance.gameState.gameOver = true;
      sendGameState(lobbyCode);
      clearInterval(intervalID);
    }
  }, 1000 / 60); // 60 frames per second
}

const newLobby = (lobbyCode) => {
  initGame(lobbyCode);
  gameInstance = lobbies[lobbyCode];
  gameInstance.resetGame();
}

const startGame = (lobbyCode) => {
  gameInstance = lobbies[lobbyCode];
  gameInstance.spawnBranches();
  runGame(lobbyCode);
}

const resetGame = (lobbyCode) => {
  gameInstance = lobbies[lobbyCode];
  gameInstance.resetGame();
}

const addUserToGame = (user, avatar, lobbyCode) => {
  gameInstance = lobbies[lobbyCode];
  gameInstance.spawnPlayer(user._id, avatar);
};

const removeUserFromGame = (user, lobbyCode) => {
  gameInstance = lobbies[lobbyCode];
  gameInstance.removePlayer(user._id);
};

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket, lobbyCode) => {
  if (user) {
    delete userToSocketMap[user._id];
    removeUserFromGame(user, lobbyCode); // Remove user from game if they disconnect
  }
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      socket.on("move", (dir) => {
        // Listen for moves from client and move player accordingly
        const user = getUserFromSocketID(socket.id);
        if (user) gameLogic.movePlayer(user._id, dir);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  addUserToGame: addUserToGame,
  removeUserFromGame: removeUserFromGame,
  newLobby: newLobby,
  startGame: startGame,
  resetGame: resetGame,
  getIo: () => io,
};
