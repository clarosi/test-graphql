module.exports.customError = (errMsg, statusCode) => {
  const err = new Error(errMsg);
  err.statusCode = statusCode;
  err.status = statusCode || 500;
  throw err;
};

// TODO in graphql
// module.exports.customCatchError = (err, next) => {
//   if (!err.statusCode) {
//     err.statusCode = 500;
//   }
//   next(err);
// };
