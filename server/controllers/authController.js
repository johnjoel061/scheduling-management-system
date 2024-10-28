const User = require("../models/userModel");
const createError = require("../utils/appError");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const upload = require("../utils/profileMulterConfig");
const fs = require("fs");
const path = require("path");

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map((filePath) => filePath.replace(/\\/g, "/"));
}

// Register User
exports.signup = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Check if user already exists
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        return next(new createError("User already exists!", 400));
      }

      // Hash the password---------NEED TO CHANGE IF CLIENT REQUEST
      const hashedPassword = await bcrypt.hash(req.body.password, 12);

      // Get the path of the uploaded profile picture
      const profile = req.file ? normalizeFilePaths([req.file.path])[0] : null;

      // Create new user
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        profile: profile,
      });

      // Assign JWT (JSON Web Token)
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7 days",
      });

      // Respond with the token
      res.status(201).json({
        status: "success",
        message: "New ADMIN registered successfully",
        token,
        user: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          middleName: newUser.middleName,
          email: newUser.email,
          profile: newUser.profile,
          role: newUser.role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new createError("Please provide email and password!", 400));
    }

    // Find user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new createError("User not found!", 404));
    }

    // Check if password is correct =========CHANGE LATER BY THE DECISION OF CLIENT
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    //const isPasswordCorrect = password === user.password;

    if (!isPasswordCorrect) {
      return next(new createError("Invalid email or password!", 401));
    }

    // Assign JWT (JSON Web Token)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7 days",
    });

    // Respond with the token
    res.status(200).json({
      status: "success",
      token,
      message: "Logged in successfully",

      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
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

// Generate Verification Code and Send Email
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase(); // 6 character code

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Send verification code to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_GMAIL,
      to: user.email,
      subject: "Password Reset Verification Code",
      text: `Your reset password verification code is ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Verification code sent to email",
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};

// Verify Code and Update Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, verificationCode, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (
      user.verificationCode !== verificationCode ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification code",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};
