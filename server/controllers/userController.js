const mongoose = require('mongoose');
const User = require("../models/userModel");
const createError = require("../utils/appError");
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcryptjs");

// Get All Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users.map((user) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        email: user.email,
        profile: user.profile,
        role: user.role,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    next(new createError(error.message, 500));
  }
};

// Get User By ID
exports.getUserById = async (req, res, next) => {
 
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        profile: user.profile,
        email: user.email,
        role: user.role,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(new createError(error.message, 500));
  }
};


// Update User By ID
exports.updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    //Check if password is being updated
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        profile: user.profile,
        email: user.email,
        role: user.role,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};


// Delete User By ID
exports.deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Delete the user's profile picture if it exists
    if (user.profile) {
      const profilePicturePath = path.resolve(user.profile); // Get the absolute path of the profile picture

      // Check if the file exists before attempting to delete
      fs.access(profilePicturePath, fs.constants.F_OK, (err) => {
        if (!err) {
          // File exists, proceed to delete it
          fs.unlink(profilePicturePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Error deleting file: ${unlinkErr.message}`);
              return next(new createError(500, 'Error deleting profile picture'));
            }
            console.log(`Successfully deleted profile picture: ${profilePicturePath}`);
          });
        } else {
          console.warn(`Profile picture not found at path: ${profilePicturePath}`);
        }
      });
    }

    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        profile: user.profile,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};
