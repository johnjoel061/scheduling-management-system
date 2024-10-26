const Facility = require("../models/facilityModel");
const CreateError = require("../utils/appError");

// Controller to get all facilities
exports.getAllFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json({
      status: "success",
      results: facilities.length,
      data: facilities,
    });
  } catch (error) {
    next(createError(500, "Failed to retrieve facilities"));
  }
};

// Controller to add a new facility
exports.addFacility = async (req, res, next) => {
  try {
    const { facilityName } = req.body;
    
    if (!facilityName) {
      return next(new CreateError("Facility name is required", 400));
    }

    // Check if the facility already exists
    const existingFacility = await Facility.findOne({ facilityName });
    if (existingFacility) {
      return next(new CreateError("Facility already exists", 400));
    }

    const newFacility = await Facility.create({ facilityName });
    res.status(201).json({
      status: "success",
      data: newFacility,
    });
  } catch (error) {
    next(new CreateError("Failed to add facility", 500));
  }
};

// Controller to delete a facility by ID
exports.deleteFacility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedFacility = await Facility.findByIdAndDelete(id);

    if (!deletedFacility) {
      return next(createError(404, "Facility not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Facility deleted successfully",
    });
  } catch (error) {
    next(createError(500, "Failed to delete facility"));
  }
};
