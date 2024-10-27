const SchedulingRequest = require("../models/schedulingRequestModel");
const nodemailer = require("nodemailer");

exports.addSchedulingRequest = async (req, res, next) => {
  try {
    const {
      eventTitle,
      eventDescription,
      venue,
      participant,
      numberOfParticipant,
      dateRequested,
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
      venue,
      participant,
      numberOfParticipant,
      dateRequested,
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

exports.handleSchedulingRequest = async (req, res, next) => {
  const { requestId, action, disapprovedReason } = req.body;

  try {
    // Fetch the scheduling request by ID
    const schedulingRequest = await SchedulingRequest.findById(requestId);
    if (!schedulingRequest) {
      return res.status(404).json({ message: "Scheduling request not found" });
    }

    // Update the status and, if disapproved, add the disapproved reason
    schedulingRequest.status =
      action === "approve" ? "approved" : "disapproved";
    if (action === "disapprove" && disapprovedReason) {
      schedulingRequest.disapprovedReason = disapprovedReason;
    }

    // Save the changes
    await schedulingRequest.save();

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_GMAIL, // set your email address in .env file
        pass: process.env.GMAIL_APP_PASSWORD, // set your email password in .env file
      },
    });

    // Compose the email message
    const mailOptions = {
      from: process.env.ADMIN_GMAIL,
      to: schedulingRequest.email,
      subject: `Update on Your Scheduling Request - ${
        schedulingRequest.status.charAt(0).toUpperCase() +
        schedulingRequest.status.slice(1)
      }`,
      text:
        schedulingRequest.status === "approved"
          ? `Dear ${schedulingRequest.firstName} ${schedulingRequest.lastName},\n\n
    We are pleased to inform you that your scheduling request for the event titled "${schedulingRequest.eventTitle}" has been approved.\n
    Please review the event details to ensure everything is in order.\n\n
    If you have any further questions, feel free to reach out to us.\n\n
    Best regards,\n
    DEBESMSCAT Scheduling Service`
          : `Dear ${schedulingRequest.firstName} ${schedulingRequest.lastName},\n\n
    We regret to inform you that your scheduling request for the event titled "${schedulingRequest.eventTitle}" has been disapproved.\n
    The reason provided is as follows:\n\n
    "${disapprovedReason}"\n\n
    If you have any questions or need further assistance, please feel free to contact us.\n\n
    Best regards,\n
    DEBESMSCAT Scheduling Service`,
    };

    // Send the email notification
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({
      message: `Scheduling request ${schedulingRequest.status} successfully`,
      schedulingRequest,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error handling scheduling request", error });
  }
};

exports.getAllSchedulingRequests = async (req, res, next) => {
  try {
    // Retrieve all scheduling requests from the database
    const schedulingRequests = await SchedulingRequest.find();

    res.status(200).json({
      message: "All scheduling requests retrieved successfully",
      schedulingRequests,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving scheduling requests", error });
  }
};

exports.getSchedulingRequestById = async (req, res, next) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Retrieve the scheduling request by ID from the database
    const schedulingRequest = await SchedulingRequest.findById(id);

    // Check if the scheduling request exists
    if (!schedulingRequest) {
      return res.status(404).json({ message: "Scheduling request not found" });
    }

    res.status(200).json({
      message: "Scheduling request retrieved successfully",
      schedulingRequest,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving scheduling request", error });
  }
};

exports.deleteSchedulingRequestById = async (req, res, next) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Find and delete the scheduling request by ID
    const deletedSchedulingRequest = await SchedulingRequest.findByIdAndDelete(
      id
    );

    // Check if the scheduling request existed and was deleted
    if (!deletedSchedulingRequest) {
      return res.status(404).json({ message: "Scheduling request not found" });
    }

    res.status(200).json({
      message: "Scheduling request deleted successfully",
      deletedSchedulingRequest,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting scheduling request", error });
  }
};
