const mongoose = require("mongoose");

const opdRefundNoteSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient_Appointment",
      required: true,
    },

    refundNumber: {
      type: String,
      unique: true,
      index: true,
    },

    opdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
      required: true,
    },

    receiptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opd_Receipt",
      required: true,
    },

    // opdCreditBillId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "OPD_credit_bill",
    //   required: true,
    // },

    refundAmount: {
      type: Number,
      required: true,
    },

    refundReason: {
      type: String,
      required: true,
      trim: true,
    },

    refundDate: {
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

const OPDRefundNote = mongoose.model("OPD_refund_note", opdRefundNoteSchema);

module.exports = OPDRefundNote;
