const gameLogic = require("./game-logic");

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.sockets.get(socketid);

const sendGameState = () => {
  io.emit("update", gameLogic.gameState);
};

const runGame = () => {
  let time = 0; // time in ms
  const intervalID = setInterval(() => {
    //console.log("interval start time " + timesRun);
    gameLogic.updateGameState(time);
    sendGameState(); // sends to frontend game component

    time += 1000 / 60;
    //console.log("time " + timesRun);
    if (gameLogic.gameState.gameOver || time >= 30 * 1000) {
      //console.log('its over');
      gameLogic.gameState.gameOver = true;
      sendGameState();
      clearInterval(intervalID);
    }
  }, 1000 / 60); // 60 frames per second
}

const newLobby = () => {
  gameLogic.resetGame();
}

const startGame = () => {
  gameLogic.spawnBranches();
  runGame();
}

const resetGame = () => {
  gameLogic.resetGame();
}

const addUserToGame = (user) => {
  gameLogic.spawnPlayer(user._id);
};

const removeUserFromGame = (user) => {
  gameLogic.removePlayer(user._id);
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

const removeUser = (user, socket) => {
  if (user) {
    delete userToSocketMap[user._id];
    removeUserFromGame(user); // Remove user from game if they disconnect
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
