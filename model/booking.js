const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Event"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
