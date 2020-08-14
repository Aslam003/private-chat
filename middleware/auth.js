const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //Get token
  const token = req.headers.authorization;
  //Token checking
  if (!token) {
    return res
      .status(401)
      .json({ errMsg: "Tokken missing authorization denied" });
  }

  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ errMsg: "invalid token" });
  }
};
