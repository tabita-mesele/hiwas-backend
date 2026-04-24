const jwt = require("jsonwebtoken");

const SECRET = "hiwas_secret_key";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], SECRET);

    req.user = verified; // contains id + role

    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = auth;