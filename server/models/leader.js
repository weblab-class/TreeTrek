const mongoose = require("mongoose");

const LeaderSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  highestGame: Number,
});

const Leader = mongoose.model("leader", LeaderSchema);

module.exports = Leader;
