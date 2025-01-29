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

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
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
})

router.post("/spawn", (req, res) => {
  if (req.user) {
    socketManager.addUserToGame(req.user);
  }
  res.send({});
});

router.post("/despawn", (req, res) => {
  if (req.user) {
    socketManager.removeUserFromGame(req.user);
  }
  res.send({});
});

router.post("/newlobby", (req, res) => {
  socketManager.newLobby();
  res.send({});
})

router.post("/newgame", (req, res) => {
  socketManager.startGame();
  res.send({});
})

// router.post("/reset", (req, res) => { // intended to reset the game
//   if (req.user) {
//     socketManager.addUserToGame(req.user);
//     socketManager.resetGame(); // comes from server-socket function
//   }
//   res.send({});
// });

router.post("/gameover", async (req, res) => {
  let userDB = await User.findOne({ googleid: req.user.googleid });
  let higherBranch = req.body.gameBranch > userDB.highestGame ? req.body.gameBranch : userDB.highestGame;
  // if user is already on leaderboard, update score
  if (await Leader.findOne({ googleid: req.user.googleid })) {
    await Leader.updateOne({ googleid: req.user.googleid }, {
      $set: {highestGame: higherBranch}
    })
  } else {
    let lowestLeader = await Leader.findOne().sort({highestGame: 1});
    if (lowestLeader.highestGame < higherBranch) {
      console.log(lowestLeader);
      await Leader.updateOne({highestGame: lowestLeader.highestGame}, {
        $set: {name: req.user.name, googleid: req.user.googleid, highestGame: higherBranch}
      })
    }
  }

  User.updateOne({ googleid: req.user.googleid }, {
    $set: {highestGame: higherBranch, lastGame: req.body.gameBranch}
  }).then(res.send({}));
})

router.get("/gameover", (req, res) => {
  User.findOne({ googleid: req.user.googleid }).then((userDB) => {
    res.send({ highestGame: userDB.highestGame, lastGame: userDB.lastGame });
  })
})

router.post("/spriteselect", (req, res) => {
  User.updateOne({ googleid: req.user.googleid }, {
    $set: {sprite: req.body.sprite}
  }).then(res.send({}));
})

router.get("/spriteselect", (req, res) => {
  User.findOne({ googleid: req.user.googleid }).then((userDB) => {
    res.send({ sprite: userDB.sprite });
  })
})



// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
