const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema(
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
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
  },

  { versionKey: false, timestamps: true }
);

const Calendar = mongoose.model("Calendar", CalendarSchema);

module.exports = Calendar;
