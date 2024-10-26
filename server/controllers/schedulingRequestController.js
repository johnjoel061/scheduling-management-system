const Facility = require("../models/facilityModel");
const SchedulingRequest = require("../models/schedulingRequestModel");
const createError = require("../utils/appError");
const nodemailer = require("nodemailer");

exports.addSchedulingRequest = async (req, res, next) => {
  try {
    const {
      eventTitle,
      eventDescription,
      participant,
      numberOfParticipant,
      dateOfRequesting,
      startDate,
      endDate,
      startTime,
      endTime,
      firstName,
      lastName,
      occupation,
      email,
      status,

    } = req.body;

    // Create a new leave request
    const newSchedulingRequest = new SchedulingRequest({
      eventTitle,
      eventDescription,
      participant,
      numberOfParticipant,
      dateOfRequesting,
      startDate,
      endDate,
      startTime,
      endTime,
      firstName,
      lastName,
      occupation,
      email,
      status,
    });

    // Save the leave request to the database
    await newSchedulingRequest.save();

    res.status(201).json({
      message: "Scheduling request submitted successfully",
      schedulingRequest: newSchedulingRequest,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting scheduling request", error });
  }
};
