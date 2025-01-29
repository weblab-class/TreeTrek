const GameLogic = require("./game-logic");
const Lobby = require("./models/lobby");

let io;
let lobbies = {}; // dict mapping lobby code to GameLogic object

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
      // console.log('Lobby not found');
      return null; // Handle case where lobby doesn't exist
    }

    // console.log('Lobby initialized:', lobby);
    lobbies[lobbyCode] = new GameLogic();
  } catch (error) {
    console.error('Error finding lobby:', error);
  }
};

/** Helper function to search for lobbyCode based on player_.id */
const findLobbyByPlayer = async (playerId) => {
  try {
    const lobby = await Lobby.findOne({ players: { $in: [playerId] } });

    if (!lobby) {
      // console.log("Lobby not found for player:", playerId);
      return null; // Handle case where no lobby is found
    }

    // console.log("Lobby found:", lobby);
    return lobby.code;
  } catch (error) {
    console.error("Error finding lobby:", error);
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
    gameInstance.updateGameState(time);
    sendGameState(lobbyCode); // sends to frontend game component

    time += 1000 / 60;
    if (gameInstance.gameState.gameOver || time >= 30 * 1000) {
      gameInstance.gameState.gameOver = true;
      sendGameState(lobbyCode);
      clearInterval(intervalID);
    }
  }, 1000 / 60); // 60 frames per second
}

const newLobby = async (lobbyCode) => {
  await initGame(lobbyCode);
  gameInstance = lobbies[lobbyCode];
  // console.log("newLobby (server-socket): " + gameInstance);
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
  gameInstance.spawnPlayer(user.googleid, avatar);
};

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user.googleid];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user.googleid] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket, lobbyCode) => {
  if (user) {
    delete userToSocketMap[user.googleid];
    gameInstance = lobbies[lobbyCode];
    gameInstance.removePlayer(user.googleid);
    // removeUserFromGame(user, lobbyCode); // Remove user from game if they disconnect
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
        findLobbyByPlayer(user.googleid).then((code) =>removeUser(user, socket, code));
        gameInstance.removePlayer(user.googleid);
        findLobbyByPlayer(user.googleid).then((code) => Lobby.deleteOne({code: code}));
      });
      socket.on("move", async (dir) => {
        // Listen for moves from client and move player accordingly
        const user = getUserFromSocketID(socket.id);
        if (user) {
          const lobbyCode = await findLobbyByPlayer(user.googleid);
          gameInstance = lobbies[lobbyCode];
          gameInstance.movePlayer(user.googleid, dir);
        }
      });
      socket.on("avatarPlayer", (avatar) => {
        const user = getUserFromSocketID(socket.id);
        if (user) socket.emit("updateAvatar", { id: user.googleid, avatar: avatar });
      });
      socket.on("readyPlayer", (ready) => {
        const user = getUserFromSocketID(socket.id);
        // console.log(user + " " + ready);
        if (user) socket.emit("updateReadiness", { id: user.googleid, ready: ready });
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  addUserToGame: addUserToGame,
  // removeUserFromGame: removeUserFromGame,
  newLobby: newLobby,
  startGame: startGame,
  resetGame: resetGame,
  getIo: () => io,
};
