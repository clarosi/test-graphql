const Booking = require("../../model/booking");
const error = require("../../shared/utils/error");

const { toISOSDate } = require("../../shared/utils/date");
const { user, event } = require("../../shared/utils/resolver");
const { checkAuth } = require("../../shared/utils/auth");

module.exports = {
  bookings: req => {
    checkAuth(req);
    return Booking.find()
      .then(result => {
        return result.map(obj => {
          return {
            ...obj._doc,
            user: user.bind(this, obj.userId),
            event: event.bind(this, obj.eventId),
            createdAt: toISOSDate(obj.createdAt),
            updatedAt: toISOSDate(obj.updatedAt)
          };
        });
      })
      .catch(err => {
        console.log(err.message);
        error.customError(err.message, 500);
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
        error.customError(err.message, 500);
      });
  },
  cancelBooking: (args, req) => {
    checkAuth(req);
    const bookingId = args.bookingId;
    return Booking.findByIdAndDelete(bookingId)
      .then(result => {
        if (!result) {
          error.customError("Booking was not found.", 404);
        }
        return {
          ...result._doc,
          event: event.bind(this, result.eventId),
          user: user.bind(this, result.userId)
        };
      })
      .catch(err => {
        console.log(err.message);
        error.customError(err.message, 500);
      });
  }
};
