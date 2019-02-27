const User = require("../../model/user");
const Event = require("../../model/event");

const user = userId => {
  return User.findById(userId)
    .then(result => {
      if (!result) {
        error.customError("User not found.", 404);
      }
      return {
        ...result._doc,
        password: null,
        createdEvents: events.bind(this, result.createdEvents)
      };
    })
    .catch(err => {
      console.log(err.message);
      error.customError(err.message, 500);
    });
};

const event = eventId => {
  return Event.findById(eventId)
    .then(result => {
      if (!result) {
        error.customError("Event not found.", 404);
      }
      return {
        ...result._doc,
        creator: user.bind(this, result.creator)
      };
    })
    .catch(err => {
      console.log(err.message);
      error.customError(err.message, 500);
    });
};

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(result => {
      if (!result) {
        error.customError("Events not found.", 404);
      }
      return result.map(obj => {
        return {
          ...obj._doc,
          creator: user.bind(this, result.creator)
        };
      });
    })
    .catch(err => {
      error.customError(err.message, 500);
    });
};

module.exports = {
  user,
  event,
  events
};
