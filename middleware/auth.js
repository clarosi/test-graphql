const jwt = require("jsonwebtoken");

const unAuth = (req, next) => {
  req.isAuth = false;
  return next();
};

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return unAuth(req, next);
  }
  // Authorization: Bearer tokenValue
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    return unAuth(req, next);
  }
  jwt.verify(token, process.env.PRIVATE_KEY, (err, decodedToken) => {
    if (err || !decodedToken) {
      return unAuth(req, next);
    }
    req.isAuth = true;
    req.useId = decodedToken.useId;
    next();
  });
};
