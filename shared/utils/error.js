module.exports.customError = (errMsg, statusCode) => {
  const err = new Error(errMsg);
  err.statusCode = statusCode;
  throw err;
};

module.exports.customCatchError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};
