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
  },

  { versionKey: false, timestamps: true }
);

const Calendar = mongoose.model("SchedulingRequest", SchedulingRequestSchema);

module.exports = Calendar;
