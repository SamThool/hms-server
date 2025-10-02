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
    type: {
      type: String,
      required: true,
      enum: ["emoji", "data", "tableLR", "tableTB", "para"],
      default: "data",
    },
    images: [
      {
        imagename: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    table: [
      {
        columnName: {
          type: String,
        },
        options: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const IPDSubform = mongoose.model("IPDSubform", ipdSubformSchema);

module.exports = IPDSubform;
