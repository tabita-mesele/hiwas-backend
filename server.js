const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 📁 Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔗 Routes
const newsletterRoutes = require("./routes/newsletterRoutes");
app.use("/api/newsletters", newsletterRoutes);

// 🗄️ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/hiwas")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.get("/test", (req, res) => {
  res.json({ message: "server working" });
});
// 🚀 Server
app.listen(5000, () => console.log("Server running on port 5000"));