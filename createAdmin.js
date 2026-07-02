const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// connect DB (use your correct DB name)
// mongoose.connect("mongodb://127.0.0.1:27017/hiwas")
//   .then(() => console.log("DB connected"))
//   .catch(err => console.log(err));


// mongoose.connect("mongodb://mongo:vUhRZOVGiZpZxgwmlOdUFlDmiUMUsdAq@switchback.proxy.rlwy.net:18788/hiwasDB")
//   .then(() => console.log("DB connected from remote serevr"))
//   .catch(err => console.log(err));

mongoose.connect(
  "mongodb://mongo:lfOWtCahrmIxPBzkdLXgoRJUtZpPlfhP@hayabusa.proxy.rlwy.net:12559/hiwasDB?authSource=admin"
)
.then(() => console.log("✅ Connected to Railway MongoDB"))
.catch(err => console.error("❌ Connection Error:", err));


// Admin model (simple)
const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Admin = mongoose.model("Admin", AdminSchema);

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.create({
    username: "admin",
    password: hashedPassword,
  });

  console.log("✅ Admin created successfully");

  mongoose.connection.close();
};

createAdmin();