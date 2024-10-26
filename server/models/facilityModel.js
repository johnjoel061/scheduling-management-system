const mongoose = require("mongoose");
const facilitySchema = new mongoose.Schema(
  {
    facilityName: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("Facility", facilitySchema);

module.exports = User;
