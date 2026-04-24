const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  title: String,
  category: String,
  content: String, // ✅ ADD THIS
  cover: String,
  filePath: String,
});

module.exports = mongoose.model("Newsletter", newsletterSchema);