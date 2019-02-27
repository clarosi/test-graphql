const { customError } = require("./error");

module.exports.checkAuth = req => {
  if (!req.isAuth) {
    customError("Unauthorized user.", 401);
  }
};
