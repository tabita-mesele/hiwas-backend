const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* =========================
   CORS CONFIG (FIXED)
========================= */
const corsOptions = {
  origin: [
    "https://hiwasnewspp.netlify.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

/* ✅ IMPORTANT: Handle preflight requests */
app.options("*", cors(corsOptions));

/* =========================
   BODY PARSER
========================= */
app.use(express.json());

/* =========================
   STATIC FILES (UPLOADS)
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
   TEST ROUTE
========================= */
app.get("/test", (req, res) => {
  res.json({ message: "server working" });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   DATABASE CONNECTION
========================= */
mongoose.connect(
  "mongodb://mongo:lfOWtCahrmIxPBzkdLXgoRJUtZpPlfhP@hayabusa.proxy.rlwy.net:12559/hiwasDB?authSource=admin"
)
.then(() => console.log("✅ Connected to Railway MongoDB"))
.catch(err => console.error("❌ Connection Error:", err));

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});