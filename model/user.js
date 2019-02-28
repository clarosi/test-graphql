const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // name: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   minLength: 5
    // },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 5
    },
    createdEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
