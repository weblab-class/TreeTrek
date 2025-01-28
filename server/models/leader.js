const mongoose = require("mongoose");

const LeaderSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  highestGame: Number,
});

// compile model from schema
module.exports = mongoose.model("leader", LeaderSchema);
