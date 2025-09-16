// models/IPD/IPDPatientEMR.js
const mongoose = require("mongoose");

const EMRSchema = new mongoose.Schema(
  {
    consultantName: { type: String, required: true },
    consultantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
      required: true,
    },
    updatedAt: { type: Date, default: Date.now },
    data: { type: Array, default: [] },
    image: { type: String, default: null },
  },
  { _id: true } // keep _id for each EMR entry
);

const IPDPatientEMRSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    EMR: { type: [EMRSchema], default: [] },
  },
  { timestamps: true }
);

// ✅ This must be exported as model
module.exports = mongoose.model("IPDPatientEMR", IPDPatientEMRSchema);
