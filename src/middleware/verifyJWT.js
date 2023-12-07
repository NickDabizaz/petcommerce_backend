const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Header tidak ada" });
  }
  console.log(authHeader);
  //Bearer xxxx
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "invalid token" });
    }

    req.pengguna = decoded.pengguna;
    next();
  });
};

module.exports = verifyJWT;