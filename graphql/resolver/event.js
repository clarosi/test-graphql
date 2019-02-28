const Event = require("../../model/event");
const User = require("../../model/user");
const Booking = require("../../model/booking");

const error = require("../../shared/utils/error");
const { toISOSDate } = require("../../shared/utils/date");
const { user, event } = require("../../shared/utils/resolver");
const { checkAuth } = require("../../shared/utils/auth");

module.exports = {
  events: req => {
    checkAuth(req);
    return Event.find()
      .then(result => {
        return result.map(obj => {
          return {
            ...obj._doc,
            date: toISOSDate(obj._doc.date),
            creator: user.bind(this, obj.creator)
          };
        });
      })
      .catch(err => {
        console.log(err.message);
        error.customError(err.message, err.statusCode);
      });
  },
  createEvent: (args, req) => {
    checkAuth(req);
    const event = Event({
      ...args.eventInput,
      creator: req.userId
    });
    let createdEvent;
    return event
      .save()
      .then(result => {
        createdEvent = result;
        return User.findById(req.userId);
      })
      .then(result => {
        if (!result) {
          error.customError("User not found.", 404);
        }
        result.createdEvents.push(event._id);
        return result.save();
      })
      .then(result => {
        console.log(createdEvent);
        return createdEvent;
      })
      .catch(err => {
        console.log(err.message);
        error.customError(err.message, err.statusCode);
      });
  },
  bookEvent: (args, req) => {
    checkAuth(req);
    const booking = Booking({
      ...args.bookingInput,
      userId: req.userId
    });
    return booking
      .save()
      .then(result => {
        console.log(result._doc);
        return {
          ...result._doc,
          user: user.bind(this, result.userId),
          event: event.bind(this, result.eventId),
          createdAt: toISOSDate(result._doc.createdAt),
          updatedAt: toISOSDate(result._doc.updatedAt)
        };
      })
      .catch(err => {
        console.log(err.message);
        error.customError(err.message, err.statusCode);
      });
  }
};
