const mongoose = require("mongoose");

const SchedulingRequestSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: true,
    },

    eventDescription: {
      type: String,
      required: true,
    },

    participant: {
      type: String,
      required: true,
    },

    numberOfParticipant: {
      type: String,
      required: true,
    },

    dateOfRequesting: {
      type: { type: Date, default: Date.now },
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    occupation: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "disapproved"],
      default: "pending",
    },

    disapprovedReason: {type: String},
  },

  { versionKey: false, timestamps: true }
);

const Calendar = mongoose.model("SchedulingRequest", SchedulingRequestSchema);

module.exports = Calendar;
