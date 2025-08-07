const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema(
  {
    vital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinical-Vital",
    },
    parameters: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        subParameters: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
    delete: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const VitalParameterModel = mongoose.model("VitalParameter", vitalSchema);

module.exports = VitalParameterModel;
