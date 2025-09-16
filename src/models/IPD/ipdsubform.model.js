const mongoose = require("mongoose");

const ipdSubformSchema = new mongoose.Schema(
  {
    subformName: {
      type: String,
      required: true,
      trim: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form", // reference to your main Form collection
      required: true,
    },
  },
  { timestamps: true }
);

const IPDSubform = mongoose.model("IPDSubform", ipdSubformSchema);

module.exports = IPDSubform;
