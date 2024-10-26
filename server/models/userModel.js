const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String },
    role: {
      type: String,
      default: "ADMIN",
    },

    verificationCode: { type: String, default: "" },
    verificationCodeExpires: { type: Date, default: null },
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
