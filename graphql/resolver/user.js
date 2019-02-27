const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../../model/user");
const error = require("../../shared/utils/error");

const ERR_MSG = "Invalid email or password.";

module.exports = {
  createUser: args => {
    return bcrypt
      .hash(args.userInput.password, 12)
      .then(result => {
        const user = User({
          ...args.userInput,
          password: result
        });
        return user.save();
      })
      .then(result => {
        console.log(result);
        result.password = null;
        return result;
      })
      .catch(err => {
        console.log(err.message);
        error.customError(err.message, 500);
      });
  },
  login: ({ email, password }) => {
    let userId;
    return User.findOne({ email })
      .then(result => {
        if (!result) {
          error.customError(ERR_MSG, 401);
        }
        userId = result._id;
        return bcrypt.compare(password, result.password);
      })
      .then(result => {
        if (!result) {
          error.customError(ERR_MSG, 401);
        }
        return jwt.sign({ userId, email }, process.env.PRIVATE_KEY, {
          expiresIn: "1h"
        });
      })
      .then(result => {
        return {
          userId,
          email,
          token: result,
          tokenExp: 1
        };
      })
      .catch(err => {
        console.log(err.message);
        error.customError(err.message, 500);
      });
  }
};
