const bcrypt = require("bcryptjs");

const User = require("../../model/user");
const error = require("../../shared/utils/error");

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
  }
};
