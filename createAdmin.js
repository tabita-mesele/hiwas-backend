const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// connect DB (use your correct DB name)
mongoose.connect("mongodb://127.0.0.1:27017/hiwas")
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

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