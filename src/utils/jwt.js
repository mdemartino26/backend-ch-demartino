const jwt = require("jsonwebtoken");
const secretKey = "7xjR4TnUjx2P3z4L7WvQ9uM5xY2kR8yD";


function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: "1h" });
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Token de autorización no proporcionado" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token de autorización no válido" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { generateToken, verifyToken };
