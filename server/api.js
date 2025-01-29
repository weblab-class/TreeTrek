/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Leader = require("./models/leader");
const Lobby = require("./models/lobby");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

// initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  };

  res.send(req.user);
});

/** Helper function to search for lobbyCode based on player_.id */
router.get("/lobby/player/:playerId", async (req, res) => {
  const { playerId } = req.params; // Extract playerId from URL

  try {
    const lobby = await Lobby.findOne({ players: { $in: [playerId] } });

    if (!lobby) {
      return res.status(404).json({ message: "Lobby not found for player" });
    };

    res.json({ lobbyCode: lobby.code }); // Return only the lobby code
  } catch (error) {
    console.error("Error finding lobby:", error);
    res.status(500).json({ message: "Server error" });
  };
});

const findLobbyByPlayer = async (playerId) => {
  try {
    const lobby = await Lobby.findOne({ players: { $in: [playerId] } });

    if (!lobby) {
      // console.log("Lobby not found for player:", playerId);
      return null; // Handle case where no lobby is found
    };

    // console.log("Lobby found (api.js):", lobby);
    return lobby.code;
  } catch (error) {
    console.error("Error finding lobby:", error);
  };
};

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  };
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/leaderboard", async (req, res) => {
  const leaders = {};
  let leadersDB = await Leader.find();
  leadersDB.forEach((leader) => {
    leaders[leader.googleid] = {name: leader.name, highestGame: leader.highestGame};
  });
  res.send(leaders);
});

router.post("/spawn", (req, res) => {
  if (req.user && req.body.lobbyCode) {
      socketManager.startGame(req.user.googleid, req.body.avatar, req.body.lobbyCode);
  };
  res.send(true);
});

router.post("/newlobby", (req, res) => {
  socketManager.newLobby(req.user.googleid, req.body.lobbyCode);
  res.send({});
});

router.post("/gameover", async (req, res) => {
  let userDB = await User.findOne({ googleid: req.user.googleid });
  let higherBranch = req.body.gameBranch > userDB.highestGame ? req.body.gameBranch : userDB.highestGame;
  // if user is already on leaderboard, update score
  if (await Leader.findOne({ googleid: req.user.googleid })) {
    await Leader.updateOne({ googleid: req.user.googleid }, {
      $set: {highestGame: higherBranch}
    });
  } else {
    let lowestLeader = await Leader.findOne().sort({highestGame: 1});
    if (lowestLeader.highestGame < higherBranch) {
      await Leader.updateOne({highestGame: lowestLeader.highestGame}, {
        $set: {name: req.user.name, googleid: req.user.googleid, highestGame: higherBranch}
      });
    };
  };

  User.updateOne({ googleid: req.user.googleid }, {
    $set: {highestGame: higherBranch, lastGame: req.body.gameBranch}
  }).then(res.send({}));
});

router.get("/gameover", (req, res) => {
  User.findOne({ googleid: req.user.googleid }).then((userDB) => {
    res.send({ highestGame: userDB.highestGame, lastGame: userDB.lastGame });
  });
});

// Helper function to generate 4-letter lobby code
const generateCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  };
  return code;
};

// Create a new lobby
router.post('/createlobby', async (req, res) => {
  const lobbyId = generateCode();
  const lobby = new Lobby({ code: lobbyId, players: [req.user.googleid], names: [req.user.name], readiness: [false] });
  await lobby.save();
  socketManager.newLobby(req.user.googleid, lobbyId);
  res.json({ lobbyId });
});

// Join a lobby
router.get('/joinlobby/:code', async (req, res) => {
  const code = req.params.code;
  const lobby = await Lobby.findOne({ code: code });
  if (lobby) {
    socketManager.joinLobby(req.user.googleid, req.body.avatar, code);
    await Lobby.findByIdAndUpdate(lobby._id, { $push: { players: req.user.googleid } }, { new: true });
    await Lobby.findByIdAndUpdate(lobby._id, { $push: { names: req.user.name } }, { new: true });
    await Lobby.findByIdAndUpdate(lobby._id, { $push: { readiness: false } }, { new: true });
    res.send({});
  } else {
    res.status(404).send({});
  };
});

// Search for lobby based on player_.id
router.get("/findlobby/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  console.log(req.params);
  try {
    const lobby = await Lobby.findOne({ players: { $in: [userId] } });
    if (!lobby) {
        console.log("Lobby not found for player:", userId);
        res.send(null); // Handle case where no lobby is found
    }

    console.log("Lobby found (gameOver):", lobby);
    console.log(lobby.code);
    res.send({lobbyCode: lobby.code});
  } catch (error) {
    console.error("Error finding lobby:", error);
  }
});

// Delete a lobby
router.post("/leavelobby/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    console.log("attempting to leaveLobby");
    const lobby = await Lobby.findOne({ players: { $in: [userId] } });
    console.log("found lobby (LL-API): " + lobby);
    if (!lobby) {
        return res.status(404).json({ message: "Lobby not found for player" });
    };
    // findLobbyByPlayer(userId).then((code) => Lobby.deleteOne({code: code}));
    // Remove the player from the lobby
    await Lobby.findOneAndUpdate(
        { code: lobby.code },
        { $pull: { players: userId } },
        { new: true }
    );
    // If the lobby is empty after removal, delete it
    const updatedLobby = await Lobby.findOne({ code: lobby.code });
    console.log("updated lobby (LL-API): " + updatedLobby);
    if (updatedLobby.players.length === 0) {
        await Lobby.deleteOne({ code: lobby.code });
        console.log("Lobby deleted because it was empty");
    };

    console.log("Player removed from lobby");
  } catch (error) {
      console.error("Error deleting lobby:", error);
      // res.status(500).json({ message: "Server error" });
  };
});

router.get("/lobbydata/:code", async (req, res) => {
  const code = req.params.code;
  const lobby = await Lobby.findOne({ code: code });
  if (lobby) {
    res.send({players: lobby.players, names: lobby.names, readiness: lobby.readiness});
  } else {
    res.status(404).send({});
  };
});


// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
