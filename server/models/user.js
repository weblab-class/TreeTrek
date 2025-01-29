const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  highestGame: Number,
  lastGame: Number,
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
