const Event = require("../../model/event");
const User = require("../../model/user");
const Booking = require("../../model/booking");

const error = require("../../shared/utils/error");
const { toISOSDate } = require("../../shared/utils/date");
const { user, event } = require("../../shared/utils/resolverHelper");

module.exports = {
  events: () => {
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
        error.customError(err.message, 500);
      });
  },
  createEvent: args => {
    const event = Event({
      ...args.eventInput,
      creator: "5c73aacc47f9eb75b5100cc5"
    });
    let createdEvent;
    return event
      .save()
      .then(result => {
        createdEvent = result;
        return User.findById("5c73aacc47f9eb75b5100cc5");
      })
      .then(result => {
        if (!result) {
          error.customError("User not found.", 500);
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
        error.customError(err.message, 500);
      });
  },
  bookEvent: args => {
    const booking = Booking({
      ...args.bookingInput,
      userId: "5c74ee5e3fb3e72fb537681b"
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
        error.customError(err.message, 500);
      });
  }
};
