const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "editor"],
    default: "editor",
  },
});

module.exports = mongoose.model("Admin", adminSchema);