const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    sectionType: {
      type: String,
      required: true,
      enum: ["pathology", "radiology"], // you can add more types in future
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
