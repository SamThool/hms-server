const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema(
  {
    services: {
      type: String,
      required: true,
      trim: true,
    },
    weaker: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    Indigenous: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Charity_Master", charitySchema);
