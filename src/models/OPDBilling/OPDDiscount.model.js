const mongoose = require("mongoose");

const opdDiscountNoteSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient_Appointment",
      required: true,
    },

    discountNumber: {
      type: String,
      unique: true,
      index: true,
    },

    opdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
      required: true,
    },

    // opdCreditBillId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "OPD_credit_bill",
    //   required: true,
    // },

    discountAmount: {
      type: Number,
      required: true,
    },

    discountReason: {
      type: String,
      required: true,
      trim: true,
    },

    discountDate: {
      type: Date,
      default: Date.now,
    },

    paymentMode: {
      type: String,
      required: true,
      default: "cash",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: false,
      default: null,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const OPDDiscountNote = mongoose.model(
  "OPD_discount_note",
  opdDiscountNoteSchema
);

module.exports = OPDDiscountNote;
