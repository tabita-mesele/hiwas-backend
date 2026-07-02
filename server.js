const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// const app = express();
const app = express();

/* =========================
   ✅ CORS FIX (IMPORTANT)
========================= */
app.use(cors({
  origin: [
    "https://hiwasnewspp.netlify.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// handle preflight requests
app.options("*", cors());

/* =========================
   JSON BODY PARSER
========================= */
app.use(express.json());

/* =========================
   FILES (UPLOADS)
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */
const newsletterRoutes = require("./routes/newsletterRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/newsletters", newsletterRoutes);
app.use("/api/auth", authRoutes);

/* =========================
   DATABASE CONNECTION
========================= */
mongoose.connect(
  "mongodb://mongo:lfOWtCahrmIxPBzkdLXgoRJUtZpPlfhP@hayabusa.proxy.rlwy.net:12559/hiwasDB?authSource=admin"
)
.then(() => console.log("✅ Connected to Railway MongoDB"))
.catch(err => console.error("❌ Connection Error:", err));

/* =========================
   TEST ROUTE
========================= */
app.get("/test", (req, res) => {
  res.json({ message: "server working" });
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => console.log("Server running on port 5000"));