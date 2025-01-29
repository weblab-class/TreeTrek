const mongoose = require('mongoose');

const lobbySchema = new mongoose.Schema({
  code: String,
  players: Array,
  names: Array,
  readiness: Array,
});

const Lobby = mongoose.model('Lobby', lobbySchema);

module.exports = Lobby;
