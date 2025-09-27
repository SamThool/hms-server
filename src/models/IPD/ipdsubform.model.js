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
      ref: "Form",
      required: true,
    },
    images: [
      {
        imagename: {
          type: String,
          required: true,
        },
        image: {
          type: String, // can store URL, path, or base64 string
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const IPDSubform = mongoose.model("IPDSubform", ipdSubformSchema);

module.exports = IPDSubform;
